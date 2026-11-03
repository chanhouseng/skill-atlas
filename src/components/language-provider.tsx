"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
import type {ReactNode} from "react";
import type {LanguageCode} from "@/lib/zh";
import {toDisplayChinese} from "@/lib/zh";
type LangContext = {language:LanguageCode;setLanguage:(code:LanguageCode)=>void;t:(text:string)=>string};
const LanguageContext=createContext<LangContext|null>(null);

export function LanguageProvider({children}:{children:ReactNode}){
  const [language,setLanguage]=useState<LanguageCode>("zh-Hant");
  useEffect(()=>{
    try{
      const saved=localStorage.getItem("skill-atlas-language");
      if(saved==="zh-Hans"||saved==="zh-Hant") queueMicrotask(()=>setLanguage(saved));
    }catch{}
  },[]);
  useEffect(()=>{
    document.documentElement.lang=language;
    try{localStorage.setItem("skill-atlas-language",language);}catch{}
  },[language]);
  const value=useMemo(()=>({language,setLanguage,t:(text:string)=>toDisplayChinese(text,language)}),[language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){
  const ctx=useContext(LanguageContext);
  if(!ctx)throw new Error("LanguageProvider missing");
  return ctx;
}
export function LocaleText({text}:{text:string}){const {t}=useLanguage();return <>{t(text)}</>;}
