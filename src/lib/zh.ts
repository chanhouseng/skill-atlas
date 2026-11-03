import * as OpenCC from "opencc-js";
export type LanguageCode = "zh-Hant" | "zh-Hans";
const toSimplified = OpenCC.Converter({from:"hk",to:"cn"});
const toTraditional = OpenCC.Converter({from:"cn",to:"hk"});
export function toDisplayChinese(text:string,language:LanguageCode): string {
  return language==="zh-Hans" ? toSimplified(text).replace(/搜寻/g,"搜索") : text;
}
export function normalizeChineseSearch(text:string):string {
  return toTraditional(text).normalize("NFKC").toLocaleLowerCase();
}
