"use client";
import {createContext,useContext,useEffect,useMemo,useSyncExternalStore} from "react";
import type {ReactNode} from "react";
import type {LanguageCode} from "@/lib/zh";
import {toDisplayChinese} from "@/lib/zh";

type LangContext = {language:LanguageCode;setLanguage:(code:LanguageCode)=>void;t:(text:string)=>string};
const LanguageContext=createContext<LangContext|null>(null);
const KEY="skill-atlas-language";
const EVENT="skill-atlas-language-change";
function currentLanguage():LanguageCode{
  try {return localStorage.getItem(KEY)==="zh-Hans"?"zh-Hans":"zh-Hant";}
  catch{return "zh-Hant";}
}
function subscribeLanguage(callback:()=>void){
  window.addEventListener("storage",callback);
  window.addEventListener(EVENT,callback);
  return ()=>{window.removeEventListener("storage",callback);window.removeEventListener(EVENT,callback);};
}
function setLanguageSetting(language:LanguageCode){
  try{localStorage.setItem(KEY,language);}catch{}
  window.dispatchEvent(new Event(EVENT));
}
export function LanguageProvider({children}:{children:ReactNode}){
  const language=useSyncExternalStore<LanguageCode>(subscribeLanguage,currentLanguage,()=> "zh-Hant");
  useEffect(()=>{document.documentElement.lang=language;},[language]);
  const value=useMemo(()=>({language,setLanguage:setLanguageSetting,t:(text:string)=>toDisplayChinese(text,language)}),[language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){
  const ctx=useContext(LanguageContext);
  if(!ctx)throw new Error("LanguageProvider missing");
  return ctx;
}
export function LocaleText({text}:{text:string}){const {t}=useLanguage();return <>{t(text)}</>;}
