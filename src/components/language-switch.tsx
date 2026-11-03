"use client";
import {useLanguage} from "./language-provider";
export function LanguageSwitch(){
 const {language,setLanguage,t}=useLanguage();
 return <div className="language-switch" role="group" aria-label={t("選擇顯示語言")}>
  <button type="button" aria-pressed={language==="zh-Hant"} onClick={()=>setLanguage("zh-Hant")}>繁體</button>
  <button type="button" aria-pressed={language==="zh-Hans"} onClick={()=>setLanguage("zh-Hans")}>简体</button>
 </div>;
}
