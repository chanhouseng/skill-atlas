import rawSnapshot from "./catalog.snapshot.json" with { type: "json" };
import rawLocalizations from "./catalog.zh.json" with { type: "json" };
import { buildSkills, categories } from "./catalog.ts";
import type { CatalogSnapshot, Skill, SkillLocalization } from "./catalog.ts";
import { localSkills } from "./local-skills.ts";

export type { Skill };
export { categories };

export const lastSyncAt = rawSnapshot.syncedAt;
export const skills: Skill[] = [...buildSkills(
  rawSnapshot as CatalogSnapshot,
  rawLocalizations as unknown as Record<string, SkillLocalization>
),...localSkills];
if(new Set(skills.map(skill=>skill.id)).size!==skills.length || new Set(skills.map(skill=>skill.routeSlug)).size!==skills.length) throw new Error("duplicate skill identity or route");

export function getSkillBySlug(routeSlug: string): Skill | undefined {
  return skills.find((skill) => skill.routeSlug === routeSlug);
}

export function installCommand(skill: Skill): string | null {
  if(skill.sourceKind==="local") return null;
  // The CLI identifies a skill by its YAML frontmatter name, which may differ from the directory.
  return `npx skills add ${skill.source} --skill ${skill.name}`;
}
export function sourceFileUrl(skill: Skill): string | null {
  return skill.sourceKind==="local" ? null : skill.sourceFileUrl;
}
export function githubUrl(skill: Skill): string | null {
  return skill.sourceKind==="local" ? null : `https://github.com/${skill.source}`;
}
