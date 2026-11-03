import { chromium } from "playwright-core";
import path from "node:path";
(async () => {
  const browser=await chromium.launch({executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:true,args:["--no-sandbox"]});
  const issues=[];
  const origin="http://127.0.0.1:3026";
  const out=path.join(process.env.USERPROFILE,"Desktop","skill-atlas-zh","docs");
  let page;
  try {
    const ctx=await browser.newContext({viewport:{width:390,height:844},permissions:["clipboard-read","clipboard-write"],deviceScaleFactor:1});
    page=await ctx.newPage();
    page.on("pageerror",error=>issues.push("PAGE_ERROR "+error.message));
    let response=await page.goto(origin+"/",{waitUntil:"networkidle"});
    console.log("HOME_STATUS",response.status());
    if(response.status()!==200)issues.push("HOME_RESPONSE");
    let html=await page.locator("body").innerText();
    if(!html.includes("117"))issues.push("NO_117_COUNT");
    let dims=await page.evaluate(()=>({innerWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth}));
    console.log("MOBILE_DIMS",dims);
    if(dims.scrollWidth>dims.innerWidth)issues.push("MOBILE_OVERFLOW");
    await page.screenshot({path:path.join(out,"qa-phase2-mobile.png"),fullPage:true});

    await page.locator(".hero-search input").fill("React");
    const reactCount=await page.locator(".skill-card").count();
    console.log("SEARCH_REACT",reactCount);
    if(reactCount<2)issues.push("REACT_SEARCH_TOO_FEW");

    await page.locator(".hero-search input").fill("一個不可能存在的技能查詢-xyz");
    if(!(await page.locator(".empty-state").isVisible()))issues.push("NO_EMPTY_STATE");

    await page.locator(".hero-search input").fill("");
    await page.getByRole("button",{name:"文件與辦公"}).last().click();
    const categoryCount=await page.locator(".skill-card").count();
    console.log("CATEGORY_DOCS",categoryCount);
    if(categoryCount<5)issues.push("DOCS_CATEGORY");

    await page.goto(origin+"/skills/react-best-practices",{waitUntil:"networkidle"});
    const heading=await page.locator("h1").first().innerText();
    console.log("SKILL_HEADING",heading);
    if(!heading.includes("React"))issues.push("SKILL_HEADING");
    if(!await page.locator("body").innerText().then(t=>t.includes("已核對 GitHub SKILL.md")))issues.push("SOURCE_VERIFIED_LABEL");
    const source=page.locator('a:has-text("查看原始 SKILL.md")');
    const href=await source.getAttribute("href");
    console.log("SOURCE_FILE",href);
    if(!href?.includes("github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md"))issues.push("WRONG_SOURCE_LINK");
    await page.getByRole("button",{name:"複製指令"}).click();
    const copied=await page.evaluate(()=>navigator.clipboard.readText());
    console.log("COPIED_COMMAND",copied);
    if(copied!=="npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices")issues.push("INCORRECT_INSTALL_COMMAND");
    await page.getByRole("button",{name:"複製示例"}).click();
    const example=await page.evaluate(()=>navigator.clipboard.readText());
    if(!example.includes("vercel-react-best-practices"))issues.push("INVALID_PROMPT");
    await page.screenshot({path:path.join(out,"qa-phase2-detail.png"),fullPage:true});

    response=await page.goto(origin+"/skills/not-real",{waitUntil:"networkidle"});
    console.log("404_STATUS",response.status());
    if(response.status()!==404)issues.push("NOT_FOUND_NOT_404");

    await page.setViewportSize({width:1440,height:900});
    await page.goto(origin+"/",{waitUntil:"networkidle"});
    dims=await page.evaluate(()=>({innerWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
    console.log("DESKTOP_DIMS",dims);
    if(dims.scrollWidth>dims.innerWidth)issues.push("DESKTOP_OVERFLOW");
    await page.screenshot({path:path.join(out,"qa-phase2-desktop.png"),fullPage:true});
    await page.locator(".view-switch button").last().click();
    const featuredCount=await page.locator(".skill-card").count();
    console.log("FEATURED_COUNT",featuredCount);
    if(featuredCount<1)issues.push("FEATURED_EMPTY");
    console.log("ISSUES",JSON.stringify(issues));
    process.exitCode=issues.length?1:0;
  } finally {
    await browser.close();
  }
})().catch(error=>{console.error("QA_FATAL",error.stack);process.exitCode=2;});