export const categories = [
  "網頁與視覺設計",
  "程式開發",
  "測試與品質",
  "Agent 與自動化",
  "文件與辦公",
  "影音與創作",
  "學習與協作",
  "Skill 工具"
] as const;

export type SkillCategory = (typeof categories)[number];

export interface VerifiedRecord {
  id: string;
  source: string;
  slug: string;
  path: string;
  sha: string;
  name: string;
  description: string;
  checkedAt?: string;
}
export interface CatalogSnapshot {
  syncedAt: string;
  entries: VerifiedRecord[];
}
export interface SkillLocalization {
  zhName:string;
  summary:string;
  category:SkillCategory;
  scenarios:string[];
  examplePrompt:string;
  caution:string;
  tags:string[];
  featured:boolean;
  reviewedSha:string;
}
export interface Skill extends SkillLocalization,VerifiedRecord {
  sourceKind?: "github" | "local";
  routeSlug:string;
  sourceFileUrl:string;
  needsReview:boolean;
  verifiedAt:string;
}
export function buildSkills(snapshot:CatalogSnapshot,localizations:Record<string,SkillLocalization>):Skill[] {
  const ids=new Set<string>();
  const bySlug=new Map<string,number>();
  for(const record of snapshot.entries) {
    if(ids.has(record.id)) throw new Error("duplicate "+record.id);
    if(record.id!==record.source+"/"+record.slug) throw new Error("invalid canonical id "+record.id);
    if (!record.path.endsWith("/"+record.slug+"/SKILL.md") || !/^[0-9a-f]{40}$/.test(record.sha)) throw new Error("invalid verified source "+record.id);
    ids.add(record.id);
    bySlug.set(record.slug,(bySlug.get(record.slug)??0)+1);
  }
  return snapshot.entries.map((record) => {
    const localized=localizations[record.id];
    if(!localized) throw new Error("missing localization "+record.id);
    if(!localized.zhName || !localized.summary || !localized.examplePrompt || !localized.scenarios?.length) throw new Error("incomplete localization "+record.id);
    if(!categories.includes(localized.category)) throw new Error("invalid category "+record.id);
    const routeSlug=(bySlug.get(record.slug)??0)>1 ? record.source.replace("/","--")+"--"+record.slug : record.slug;
    const sourceFileUrl="https://github.com/"+record.source+"/blob/main/"+record.path;
    return {...record,...localized,routeSlug,sourceFileUrl,needsReview:localized.reviewedSha!==record.sha,verifiedAt:record.checkedAt??snapshot.syncedAt};
  });
}
