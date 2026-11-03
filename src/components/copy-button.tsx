"use client";
import { useState } from "react";
import { Copy, Check, WarningCircle } from "@phosphor-icons/react";
import { useLanguage } from "@/components/language-provider";

export function CopyButton({value,label="複製",localizeValue=false}:{value:string;label?:string;localizeValue?:boolean}){
  const {t}=useLanguage();
  const [status,setStatus]=useState<"idle"|"copied"|"failed">("idle");
  async function copy(){
    try{
      if(!navigator.clipboard?.writeText)throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(localizeValue?t(value):value);
      setStatus("copied");
    }catch{setStatus("failed");}
  }
  return <div className="copy-control"><button type="button" onClick={copy} className="copy-button" aria-label={t(label)}>
    {status==="copied"?<Check size={16}/>:status==="failed"?<WarningCircle size={16}/>:<Copy size={16}/>}
    {status==="copied"?t("已複製"):status==="failed"?t("複製失敗"):t(label)}
  </button><span role="status" className="copy-message">{status==="failed"?t("請手動選取文字複製。"):""}</span></div>;
}
