import{_ as s,r,o as c,c as l,a as e,b as o,w as i,d as t,e as a}from"./app.264072a3.js";const h={},p=e("h1",{id:"interface-ibodyfieldoption",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#interface-ibodyfieldoption","aria-hidden":"true"},"#"),t(" Interface: IBodyFieldOption")],-1),f=e("h2",{id:"hierarchy",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#hierarchy","aria-hidden":"true"},"#"),t(" Hierarchy")],-1),_=e("code",null,"ICommonFieldOption",-1),u=e("p",null,[t("\u21B3 "),e("strong",null,[e("code",null,"IBodyFieldOption")])],-1),m=e("h2",{id:"table-of-contents",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),t(" Table of contents")],-1),b=e("h3",{id:"properties",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),t(" Properties")],-1),y=t("encode"),g=t("formatters"),v=t("replaceAt"),x=t("type"),I=a('<h2 id="properties-1" tabindex="-1"><a class="header-anchor" href="#properties-1" aria-hidden="true">#</a> Properties</h2><h3 id="encode" tabindex="-1"><a class="header-anchor" href="#encode" aria-hidden="true">#</a> encode</h3><p>\u2022 <code>Optional</code> <strong>encode</strong>: <code>boolean</code></p><p>Do encodeURIComponent execution, this option only executed in query parameter</p><h4 id="inherited-from" tabindex="-1"><a class="header-anchor" href="#inherited-from" aria-hidden="true">#</a> Inherited from</h4>',5),F=t("ICommonFieldOption"),O=t("."),B=t("encode"),k=e("h4",{id:"defined-in",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),t(" Defined in")],-1),C={href:"https://github.com/imjuni/jin-frame/blob/b1283dd/src/interfaces/ICommonFieldOption.ts#L3",target:"_blank",rel:"noopener noreferrer"},D=t("src/interfaces/ICommonFieldOption.ts:3"),j=e("hr",null,null,-1),L=e("h3",{id:"formatters",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#formatters","aria-hidden":"true"},"#"),t(" formatters")],-1),T=t("\u2022 "),w=e("code",null,"Optional",-1),S=t(),q=e("strong",null,"formatters",-1),E=t(": "),H=e("code",null,"TSingleBodyFormatter",-1),M=t(" | "),N=e("code",null,"TMultipleBodyFormatter",-1),R=a(`<p>formatter configuration, use convert date type or transform data shape</p><p><code>formatters</code> field only work when have valid input type.</p><p><code>formatters</code> fields operate in order of string formatter, dateTime formatter. So You can change a string to JavaScript Date instance using by string formatter and a converted Date instance to string using by dateTime formatter.</p><p><strong><code>Remarks</code></strong></p><p>If you use the string formatter to change to JavaScript Date instance and then do not change to a string, the formatters setting is: automatically convert to iso8601 string</p><p><strong><code>Example</code></strong></p><p>ordered example.</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>{
  findFrom: &#39;data.more.birthday&#39;,
  string: (value: string) =&gt; parse(value, &quot;yyyy-MM-dd&#39;T&#39;HH:mm:ss&quot;, new Date()),
  dateTime: (value: Date) =&gt; format(value, &#39;yyyy-MM-dd HH:mm:ss&#39;),
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4>`,9),V={href:"https://github.com/imjuni/jin-frame/blob/b1283dd/src/interfaces/body/IBodyFieldOption.ts#L52",target:"_blank",rel:"noopener noreferrer"},A=t("src/interfaces/body/IBodyFieldOption.ts:52"),J=a('<hr><h3 id="replaceat" tabindex="-1"><a class="header-anchor" href="#replaceat" aria-hidden="true">#</a> replaceAt</h3><p>\u2022 <code>Optional</code> <strong>replaceAt</strong>: <code>string</code></p><p>If you want to create depth or rename on field of body set this option dot seperated string. See below,</p><p><strong><code>Example</code></strong></p><p><code>data.test.ironman</code> convert to <code>{ data: { test: { ironman: &quot;value here&quot; } } }</code></p><h4 id="defined-in-2" tabindex="-1"><a class="header-anchor" href="#defined-in-2" aria-hidden="true">#</a> Defined in</h4>',7),P={href:"https://github.com/imjuni/jin-frame/blob/b1283dd/src/interfaces/body/IBodyFieldOption.ts#L26",target:"_blank",rel:"noopener noreferrer"},U=t("src/interfaces/body/IBodyFieldOption.ts:26"),Y=e("hr",null,null,-1),z=e("h3",{id:"type",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#type","aria-hidden":"true"},"#"),t(" type")],-1),G=e("p",null,[t("\u2022 "),e("strong",null,"type"),t(": "),e("code",null,'"body"')],-1),K=e("h4",{id:"defined-in-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-3","aria-hidden":"true"},"#"),t(" Defined in")],-1),Q={href:"https://github.com/imjuni/jin-frame/blob/b1283dd/src/interfaces/body/IBodyFieldOption.ts#L17",target:"_blank",rel:"noopener noreferrer"},W=t("src/interfaces/body/IBodyFieldOption.ts:17");function X(Z,$){const n=r("RouterLink"),d=r("ExternalLinkIcon");return c(),l("div",null,[p,f,e("ul",null,[e("li",null,[e("p",null,[o(n,{to:"/api/interfaces/ICommonFieldOption.html"},{default:i(()=>[_]),_:1})]),u])]),m,b,e("ul",null,[e("li",null,[o(n,{to:"/api/interfaces/IBodyFieldOption.html#encode"},{default:i(()=>[y]),_:1})]),e("li",null,[o(n,{to:"/api/interfaces/IBodyFieldOption.html#formatters"},{default:i(()=>[g]),_:1})]),e("li",null,[o(n,{to:"/api/interfaces/IBodyFieldOption.html#replaceat"},{default:i(()=>[v]),_:1})]),e("li",null,[o(n,{to:"/api/interfaces/IBodyFieldOption.html#type"},{default:i(()=>[x]),_:1})])]),I,e("p",null,[o(n,{to:"/api/interfaces/ICommonFieldOption.html"},{default:i(()=>[F]),_:1}),O,o(n,{to:"/api/interfaces/ICommonFieldOption.html#encode"},{default:i(()=>[B]),_:1})]),k,e("p",null,[e("a",C,[D,o(d)])]),j,L,e("p",null,[T,w,S,q,E,o(n,{to:"/api/#tsinglebodyformatter"},{default:i(()=>[H]),_:1}),M,o(n,{to:"/api/#tmultiplebodyformatter"},{default:i(()=>[N]),_:1})]),R,e("p",null,[e("a",V,[A,o(d)])]),J,e("p",null,[e("a",P,[U,o(d)])]),Y,z,G,K,e("p",null,[e("a",Q,[W,o(d)])])])}const te=s(h,[["render",X],["__file","IBodyFieldOption.html.vue"]]);export{te as default};
