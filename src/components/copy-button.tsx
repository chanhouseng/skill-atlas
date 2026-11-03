"use client";
import { useState } from "react";
import { Copy, Check, WarningCircle } from "@phosphor-icons/react";

export function CopyButton({ value, label = "複製" }: {value: string; label?: string}) {
  const [status, setStatus] = useState<"idle"|"copied"|"failed">("idle");
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }
  return <div className="copy-control"><button type="button" onClick={copy} className="copy-button" aria-label={label}>
    {status === "copied" ? <Check size={16} /> : status === "failed" ? <WarningCircle size={16} /> : <Copy size={16}/>}
    {status === "copied" ? "已複製" : status === "failed" ? "複製失敗" : label}
  </button><span role="status" className="copy-message">{status === "failed" ? "請手動選取文字複製。" : ""}</span></div>;
}
