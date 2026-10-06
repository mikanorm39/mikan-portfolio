/**
 * Adobe Fonts（Typekit）のキット。
 * - strenuous-3d：英字のタイトル・見出し
 * - ab-yanchag-open：日本語の本文（ダイナミックサブセット＝ページにある文字だけ読み込む）
 * 日本語フォントのダイナミックサブセットは CSS の <link> では使えないので、公式の JS 埋め込みコードで読み込む。
 */
export const TYPEKIT_KIT_ID = "kfd7xzg";

/** Adobe Fonts の埋め込みコード（公式のものをそのまま使用。kitId だけ定数から入れる） */
export const typekitScript = `(function(d){var config={kitId:'${TYPEKIT_KIT_ID}',scriptTimeout:3000,async:true},h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)})(document);`;
