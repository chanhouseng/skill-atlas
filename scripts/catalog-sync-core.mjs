/**
 * Parse GitHub SKILL.md strictly as untrusted text. This module never executes source content.
 */
function cleanYamlValue(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1,-1).replace(/\\n/g," ").replace(/\\\"/g,'"').trim();
  }
  return v;
}

export function extractMetadata(markdown) {
  const content = markdown.replace(/^\uFEFF/, "");
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/);
  if (!match) throw new Error("SKILL.md has no YAML frontmatter");
  const lines=match[1].split(/\r?\n/);
  const find=(key)=>{
    const i=lines.findIndex(line=>new RegExp("^"+key+":\\s*").test(line));
    if(i<0) return "";
    const raw=lines[i].slice(lines[i].indexOf(":")+1).trim();
    if (raw!=="" && !["|","|-",">",">-"].includes(raw)) return cleanYamlValue(raw);
    const continuation=[];
    for (let k=i+1;k<lines.length;k++) {
      if (/^\S/.test(lines[k])) break;
      if (lines[k].trim()) continuation.push(lines[k].trim());
    }
    return continuation.join(" ").trim();
  };
  const name=find("name");
  const description=find("description");
  if (!name || !description) throw new Error("SKILL.md missing name or description in YAML frontmatter");
  return {name,description};
}

const sourcePattern=/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const slugPattern=/^[a-z0-9][a-z0-9-]*$/;
function findPath(tree,slug,repo) {
  const paths=tree.filter(file=>file.type==="blob" && file.path.endsWith("/"+slug+"/SKILL.md") && !file.path.includes("/.system/"));
  if (paths.length===0) throw new Error("missing SKILL.md for "+repo+"/"+slug);
  if (paths.length!==1) throw new Error("ambiguous SKILL.md paths for "+repo+"/"+slug);
  if (!/^[A-Za-z0-9_.\/-]+$/.test(paths[0].path)) throw new Error("invalid source file path");
  if (!/^[0-9a-f]{40}$/.test(paths[0].sha)) throw new Error("invalid source SHA");
  return paths[0];
}
async function mapLimit(items,max,fn) {
  const results=new Array(items.length);
  let index=0;
  await Promise.all(Array.from({length:Math.min(max,items.length)}, async () => {
    while(index<items.length) {
      const i=index++;
      results[i]=await fn(items[i]);
    }
  }));
  return results;
}
export async function syncCatalog({sources,previous,now,fetchTree,fetchSkill}) {
  if(!sources || typeof sources!=="object") throw new Error("missing source manifest");
  const old=new Map((previous?.entries||[]).map(item=>[item.id,item]));
  const requested=[];
  const repoTrees=new Map();
  for (const [repo,slugs] of Object.entries(sources)) {
    if(!sourcePattern.test(repo)) throw new Error("invalid source "+repo);
    if (!Array.isArray(slugs)||!slugs.length) throw new Error("empty source "+repo);
    for(const slug of slugs) {
      if(!slugPattern.test(slug)) throw new Error("invalid slug "+slug);
      const id=repo+"/"+slug;
      if(requested.some(item=>item.id===id)) throw new Error("duplicate "+id);
      requested.push({id,repo,slug});
    }
  }
  await mapLimit(Object.keys(sources),3,async(repo)=>{
    const tree=await fetchTree(repo);
    if(!Array.isArray(tree)) throw new Error("invalid GitHub tree for "+repo);
    repoTrees.set(repo,tree);
  });
  let cached=0,changed=0,newItems=0;
  const entries=await mapLimit(requested,6,async({id,repo,slug})=>{
    const file=findPath(repoTrees.get(repo),slug,repo);
    const oldEntry=old.get(id);
    if (oldEntry && oldEntry.sha===file.sha && oldEntry.path===file.path && oldEntry.description && oldEntry.name) {
      cached++;
      return {...oldEntry,checkedAt:now};
    }
    const markdown=await fetchSkill(repo,file.path,file.sha);
    if(typeof markdown!=="string"||markdown.length===0) throw new Error("empty SKILL.md "+id);
    const metadata=extractMetadata(markdown);
    if(oldEntry) changed++; else newItems++;
    return {id,source:repo,slug,path:file.path,sha:file.sha,...metadata,checkedAt:now};
  });
  return {syncedAt:now,entries,stats:{total:entries.length,cached,changed,new:newItems,repositories:Object.keys(sources).length}};
}

/** Guard: never publish a snapshot which would break the Chinese catalog UI. */
export function validatePublishableCatalog(snapshot,localizations) {
  if(!Array.isArray(snapshot?.entries)) throw new Error("invalid snapshot");
  for(const entry of snapshot.entries){
    const row=localizations?.[entry.id];
    if(!row || !row.zhName || !row.summary || !row.examplePrompt || !Array.isArray(row.scenarios) || !row.scenarios.length){
      throw new Error("missing localization for "+entry.id+"; snapshot not published");
    }
  }
  return true;
}
