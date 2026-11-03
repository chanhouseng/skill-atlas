/**
 * Maintainer-only public GitHub catalog sync. Reads source markdown as data only.
 * Never imports/evaluates/executes any external SKILL.md.
 */
import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { syncCatalog, validatePublishableCatalog } from "./catalog-sync-core.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const manifestPath=path.join(root,"src/data/catalog.sources.json");
const snapshotPath=path.join(root,"src/data/catalog.snapshot.json");
const headers={ "Accept":"application/vnd.github+json","User-Agent":"skill-atlas-zh/0.2 (metadata only)" };
if(process.env.GITHUB_TOKEN) headers.Authorization="Bearer "+process.env.GITHUB_TOKEN;

async function getText(url,{api=false}={}) {
  let response;
  for(let attempt=0;attempt<3;attempt++) {
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),25000);
    try {
      response=await fetch(url,{headers:api?headers:{"User-Agent":headers["User-Agent"]},signal:controller.signal});
      if(response.ok) return await response.text();
      if(response.status===401 || response.status===403) {
        const exhausted=response.headers.get("x-ratelimit-remaining")==="0";
        const message=exhausted
          ? "GitHub API request quota exhausted. Provide GITHUB_TOKEN in your environment or retry after the limit resets."
          : "GitHub API authorization failed (HTTP "+response.status+"). Verify public access or GITHUB_TOKEN permissions.";
        const error=new Error(message);
        error.permanent=true;
        throw error;
      }
      if(![429,500,502,503,504].includes(response.status)) {
        const error=new Error("HTTP "+response.status+" "+url);
        error.permanent=true;
        throw error;
      }
    }catch(error){
      if(error.permanent) throw error;
      if(attempt===2) throw new Error(url+": "+error.message+(error.cause?.code?" ("+error.cause.code+")":""));
    }finally{clearTimeout(timeout);}
    await new Promise(resolve=>setTimeout(resolve,(attempt+1)*750));
  }
  throw new Error("Source not available: HTTP "+response?.status+" "+url);
}
async function getTree(repo) {
  const text=await getText("https://api.github.com/repos/"+repo+"/git/trees/HEAD?recursive=1",{api:true});
  const json=JSON.parse(text);
  if(json.truncated) throw new Error("GitHub tree was truncated: "+repo);
  if(!Array.isArray(json.tree)) throw new Error("Invalid GitHub tree: "+repo);
  return json.tree;
}
async function getSkill(repo,file,sha) {
  // Read immutable GitHub blob data via the REST API. Never execute external content.
  const url="https://api.github.com/repos/"+repo+"/git/blobs/"+sha;
  const json=JSON.parse(await getText(url,{api:true}));
  if(json.encoding!=="base64" || typeof json.content!=="string") throw new Error("Unexpected GitHub blob format: "+repo+"/"+file);
  return Buffer.from(json.content.replace(/\\s/g,""),"base64").toString("utf8");
}
async function main() {
  const sources=JSON.parse(await readFile(manifestPath,"utf8"));
  let previous=null;
  try{previous=JSON.parse(await readFile(snapshotPath,"utf8"));}
  catch(e){if(e.code!=="ENOENT")throw e;}
  console.log("Sync starting:", Object.keys(sources).length, "public GitHub repositories");
  const next=await syncCatalog({sources,previous,now:new Date().toISOString(),fetchTree:getTree,fetchSkill:getSkill});
  const localizations=JSON.parse(await readFile(path.join(root,"src/data/catalog.zh.json"),"utf8"));
  validatePublishableCatalog(next,localizations);
  // Finish every network, parsing and localization check before touching the previous snapshot.
  const tmp=snapshotPath+"."+process.pid+".tmp";
  try{
    await writeFile(tmp,JSON.stringify(next,null,2)+"\n","utf8");
    await rename(tmp,snapshotPath);
  }catch(error){await unlink(tmp).catch(()=>{});throw error;}
  console.log(JSON.stringify(next.stats));
  console.log("Saved",snapshotPath, "as of",next.syncedAt);
}
main().catch(error=>{console.error("Sync failed; previous snapshot left unchanged:",error.message);process.exitCode=1;});
