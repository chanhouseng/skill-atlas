import {readFile,writeFile,rename,unlink} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {discoverNewSkills} from "./discover-core.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const target=path.join(root,"src/data/discovery.candidates.json");
const verifiedPath=path.join(root,"src/data/catalog.snapshot.json");
const token=process.env.GITHUB_TOKEN;
const headers={
  "Accept":"application/vnd.github+json",
  "User-Agent":"skill-atlas-zh/0.3 (public GitHub Skill discovery)",
  ...(token?{Authorization:"Bearer "+token}:{})
};
const wait=ms=>new Promise(done=>setTimeout(done,ms));

export async function github(url,{fetchImpl=fetch,waitImpl=wait}={}){
 for(let attempt=0;attempt<3;attempt++){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),22000);
  try{
    const res=await fetchImpl(url,{headers,signal:controller.signal});
    if(res.ok)return res.json();
    if(res.status===403||res.status===401){
      const quota=res.headers.get("x-ratelimit-remaining");
      throw new Error(quota==="0"?"GitHub API rate limit exhausted; set GITHUB_TOKEN or retry later":"GitHub authorization failure HTTP "+res.status);
    }
    const retryableConflict=res.status===409 && /^https:\/\/api\.github\.com\/repos\/[^/]+\/[^/]+\/git\/trees\//.test(url);
    if(!retryableConflict && ![429,500,502,503,504].includes(res.status))throw new Error("GitHub HTTP "+res.status+" "+url);
    if(attempt===2)throw new Error("GitHub temporarily unavailable HTTP "+res.status);
  }catch(error){
    if(attempt===2||/rate limit|authorization|GitHub HTTP/.test(error.message))throw error;
  }finally{clearTimeout(timeout);}
  await waitImpl(850*(attempt+1));
 }
 throw new Error("GitHub request failed");
}
async function main(){
 const verified=JSON.parse(await readFile(verifiedPath,"utf8"));
 let previous=[];
 try{previous=JSON.parse(await readFile(target,"utf8")).candidates||[];}
 catch(error){if(error.code!=="ENOENT")throw error;}
 const from=new Date(Date.now()-21*86400000).toISOString().slice(0,10);
 const queries=[
   "topic:agent-skills pushed:>="+from,
   "topic:claude-skills pushed:>="+from,
   "topic:codex-skills pushed:>="+from,
   '"SKILL.md" in:readme pushed:>='+from
 ];
 const search=async q=>{
   const uri="https://api.github.com/search/repositories?q="+encodeURIComponent(q)+"&sort=updated&order=desc&per_page=30";
   const data=await github(uri);
   if(data.incomplete_results)throw new Error("GitHub returned incomplete search results for "+q);
   if(!Array.isArray(data.items))throw new Error("GitHub returned invalid search data");
   return data.items;
 };
 const tree=async repo=>{
   const data=await github("https://api.github.com/repos/"+repo+"/git/trees/HEAD?recursive=1");
   if(data.truncated)throw new Error("GitHub tree too large or truncated: "+repo);
   if(!Array.isArray(data.tree))throw new Error("Invalid tree for "+repo);
   return data.tree;
 };
 const found=await discoverNewSkills({queries,search,tree,existing:verified.entries,previous,now:new Date().toISOString(),maxRepos:25,maxPerRepo:20});
 // Write only after every API operation has completed, preserving the last good snapshot on failure.
 const tmp=target+"."+process.pid+".tmp";
 try{await writeFile(tmp,JSON.stringify(found,null,2)+"\n","utf8");await rename(tmp,target);}
 catch(error){await unlink(tmp).catch(()=>{});throw error;}
 console.log("GitHub discovery completed:",JSON.stringify({scannedAt:found.scannedAt,repositories:found.scannedRepositories,new:found.newCandidates,pending:found.candidates.length}));
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main().catch(error=>{console.error("Discovery aborted; previous candidates preserved:",error.message);process.exitCode=1;});
