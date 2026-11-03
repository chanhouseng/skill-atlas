import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { skills } from "@/data/skills";

export const metadata: Metadata = {
  title: "技集 · AI Skill 中文指南",
  description: "中文搜尋 AI Skill，了解真實來源、用途、適用場景與具體調用方式。",
};

export default function HomePage() {
  return <main id="main"><Catalog items={skills} /></main>;
}
