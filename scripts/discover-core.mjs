const repoPattern=/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const pathPattern=/^(?:[A-Za-z0-9_.-]+\/)+SKILL\.md$/;
const shaPattern=/^[a-f0-9]{40}$/;
function uniqRepositories(results){
 const repos=new Map();
 for(const item of results){
  if(!item||!repoPattern.test(item.full_name||"")||item.fork||item.archived||item.disabled)continue;
  const key=item.full_name.toLowerCase();
  if(!repos.has(key))repos.set(key,item);
 }
 return [...repos.values()];
}
async function mapLimit(list,limit,fn){
 const output=new Array(list.length);let i=0;
 await Promise.all(Array.from({length:Math.min(limit,list.length)},async()=>{
  while(i<list.length){const pos=i++;output[pos]=await fn(list[pos]);}
 }));
 return output;
}
/**
 * New candidates never get added to the verified Skill catalog.
 * Search and tree access must both complete before the caller may write a snapshot.
 */
export async function discoverNewSkills({queries,search,tree,existing=[],previous=[],now,maxRepos=25,maxPerRepo=25}){
 if(!Array.isArray(queries)||!queries.length)throw new Error("No discovery search queries");
 const results=[];
 for(const q of queries){
  const found=await search(q);
  if(!Array.isArray(found))throw new Error("Invalid GitHub repository search result");
  results.push(...found);
 }
 const repos=uniqRepositories(results).slice(0,Math.max(0,maxRepos));
 const known=new Set(existing.map(x=>x.source+":"+x.path));
 const old=new Map(previous.map(x=>[x.id,x]));
 const links=new Set();
 const scans=await mapLimit(repos,3,async(repo)=>{
  const files=await tree(repo.full_name);
  if(!Array.isArray(files))throw new Error("Invalid GitHub repository tree "+repo.full_name);
  for(const file of files)if(file.type==='blob'&&file.mode==='120000')links.add(repo.full_name+':'+file.path);
  const eligible=files.filter(f=>f.type==="blob"&&["100644","100755"].includes(f.mode)&&pathPattern.test(f.path||"")&&shaPattern.test(f.sha||"")&&!f.path.includes("/.system/")&&!f.path.split("/").some(segment=>segment==="."||segment==="..")).slice(0,maxPerRepo);
  return eligible.map(file=>{
    const id=repo.full_name+":"+file.path;
    const last=old.get(id);
    const parts=file.path.split("/");
    const slug=parts[parts.length-2];
    return {
      id,source:repo.full_name,slug,path:file.path,sha:file.sha,
      sourceFileUrl:"https://github.com/"+repo.full_name+"/blob/"+(repo.default_branch||"HEAD")+"/"+file.path,
      repoDescription:typeof repo.description==="string" ? repo.description.slice(0,250) : "",
      firstSeen:last?.firstSeen||now,lastSeen:now,status:"pending"
    };
  });
 });
 const active=scans.flat().filter(item=>!known.has(item.source+":"+item.path));
 const merged=new Map(previous.filter(item=>!known.has(item.source+":"+item.path)&&!links.has(item.id)).map(item=>[item.id,item]));
 for(const item of active)merged.set(item.id,item);
 const candidates=[...merged.values()].sort((a,b)=>b.firstSeen.localeCompare(a.firstSeen)||a.id.localeCompare(b.id)).slice(0,800);
 return {scannedAt:now,scannedRepositories:repos.length,searchQueries:queries.length,newCandidates:active.filter(item=>!old.has(item.id)).length,candidates};
}
