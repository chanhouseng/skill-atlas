import type { Skill } from "../data/skills";
import { normalizeChineseSearch } from "./zh.ts";

export type SkillFilter = {
  query?: string;
  category?: string;
  featuredOnly?: boolean;
};

function normalized(value: string): string {
  return normalizeChineseSearch(value.trim());
}

/** 即時關鍵字搜尋：多個空白分隔的字詞需要全部命中。無外部 API 依賴。 */
export function filterSkills(items: Skill[], options: SkillFilter): Skill[] {
  const tokens = normalized(options.query ?? "").split(/\s+/).filter(Boolean);
  return items.filter((skill) => {
    if (options.category && options.category !== "全部" && skill.category !== options.category) return false;
    if (options.featuredOnly && !skill.featured) return false;
    if (tokens.length === 0) return true;
    const haystack = normalized([
      skill.slug, skill.zhName, skill.summary, skill.category,
      skill.source, ...skill.tags, ...skill.scenarios
    ].join(" "));
    return tokens.every((token) => haystack.includes(token));
  });
}
