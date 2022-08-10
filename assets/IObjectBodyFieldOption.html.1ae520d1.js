import{_ as s,o as c,c as l,a as e,b as o,w as i,d as t,e as d,r as a}from"./app.a47fcfe0.js";const h={},p=e("h1",{id:"interface-iobjectbodyfieldoption",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#interface-iobjectbodyfieldoption","aria-hidden":"true"},"#"),t(" Interface: IObjectBodyFieldOption")],-1),f=e("h2",{id:"hierarchy",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#hierarchy","aria-hidden":"true"},"#"),t(" Hierarchy")],-1),_=e("code",null,"ICommonFieldOption",-1),u=e("p",null,[t("\u21B3 "),e("strong",null,[e("code",null,"IObjectBodyFieldOption")])],-1),m=e("h2",{id:"table-of-contents",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),t(" Table of contents")],-1),b=e("h3",{id:"properties",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#properties","aria-hidden":"true"},"#"),t(" Properties")],-1),y=t("encode"),g=t("formatters"),O=t("order"),j=t("type"),v=d('<h2 id="properties-1" tabindex="-1"><a class="header-anchor" href="#properties-1" aria-hidden="true">#</a> Properties</h2><h3 id="encode" tabindex="-1"><a class="header-anchor" href="#encode" aria-hidden="true">#</a> encode</h3><p>\u2022 <code>Optional</code> <strong>encode</strong>: <code>boolean</code></p><p>Do encodeURIComponent execution, this option only executed in query parameter</p><h4 id="inherited-from" tabindex="-1"><a class="header-anchor" href="#inherited-from" aria-hidden="true">#</a> Inherited from</h4>',5),x=t("ICommonFieldOption"),I=t("."),F=t("encode"),B=e("h4",{id:"defined-in",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in","aria-hidden":"true"},"#"),t(" Defined in")],-1),k={href:"https://github.com/imjuni/jin-frame/blob/add3593/src/interfaces/ICommonFieldOption.ts#L3",target:"_blank",rel:"noopener noreferrer"},D=t("src/interfaces/ICommonFieldOption.ts:3"),C=e("hr",null,null,-1),w=e("h3",{id:"formatters",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#formatters","aria-hidden":"true"},"#"),t(" formatters")],-1),L=t("\u2022 "),T=e("code",null,"Optional",-1),S=t(),H=e("strong",null,"formatters",-1),M=t(": "),E=e("code",null,"TSingleObjectBodyFormatter",-1),N=t(" | "),R=e("code",null,"TMultipleObjectBodyFormatter",-1),V=d(`<p>formatter configuration, use convert date type or transform data shape</p><p><code>formatters</code> field only work when have valid input type.</p><p><code>formatters</code> fields operate in order of string formatter, dateTime formatter. So You can change a string to JavaScript Date instance using by string formatter and a converted Date instance to string using by dateTime formatter.</p><p><strong><code>Remarks</code></strong></p><p>If you use the string formatter to change to JavaScript Date instance and then do not change to a string, the formatters setting is: automatically convert to iso8601 string</p><p><strong><code>Example</code></strong></p><p>ordered example.</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>{
  key: &#39;data.more.birthday&#39;,
  string: (value: string) =&gt; parse(value, &quot;yyyy-MM-dd&#39;T&#39;HH:mm:ss&quot;, new Date()),
  dateTime: (value: Date) =&gt; format(value, &#39;yyyy-MM-dd HH:mm:ss&#39;),
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="defined-in-1" tabindex="-1"><a class="header-anchor" href="#defined-in-1" aria-hidden="true">#</a> Defined in</h4>`,9),q={href:"https://github.com/imjuni/jin-frame/blob/add3593/src/interfaces/body/IObjectBodyFieldOption.ts#L51",target:"_blank",rel:"noopener noreferrer"},J=t("src/interfaces/body/IObjectBodyFieldOption.ts:51"),P=d('<hr><h3 id="order" tabindex="-1"><a class="header-anchor" href="#order" aria-hidden="true">#</a> order</h3><p>\u2022 <code>Optional</code> <strong>order</strong>: <code>number</code></p><p>merge order of object-body. Sorted in ascending order. Objects with fast numbers are overwritten by object with slow number.</p><p><strong><code>Default</code></strong></p><p>0</p><h4 id="defined-in-2" tabindex="-1"><a class="header-anchor" href="#defined-in-2" aria-hidden="true">#</a> Defined in</h4>',7),U={href:"https://github.com/imjuni/jin-frame/blob/add3593/src/interfaces/body/IObjectBodyFieldOption.ts#L25",target:"_blank",rel:"noopener noreferrer"},Y=t("src/interfaces/body/IObjectBodyFieldOption.ts:25"),z=e("hr",null,null,-1),A=e("h3",{id:"type",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#type","aria-hidden":"true"},"#"),t(" type")],-1),G=e("p",null,[t("\u2022 "),e("strong",null,"type"),t(": "),e("code",null,'"object-body"')],-1),K=e("h4",{id:"defined-in-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#defined-in-3","aria-hidden":"true"},"#"),t(" Defined in")],-1),Q={href:"https://github.com/imjuni/jin-frame/blob/add3593/src/interfaces/body/IObjectBodyFieldOption.ts#L17",target:"_blank",rel:"noopener noreferrer"},W=t("src/interfaces/body/IObjectBodyFieldOption.ts:17");function X(Z,$){const n=a("RouterLink"),r=a("ExternalLinkIcon");return c(),l("div",null,[p,f,e("ul",null,[e("li",null,[e("p",null,[o(n,{to:"/api/interfaces/ICommonFieldOption.html"},{default:i(()=>[_]),_:1})]),u])]),m,b,e("ul",null,[e("li",null,[o(n,{to:"/api/interfaces/IObjectBodyFieldOption.html#encode"},{default:i(()=>[y]),_:1})]),e("li",null,[o(n,{to:"/api/interfaces/IObjectBodyFieldOption.html#formatters"},{default:i(()=>[g]),_:1})]),e("li",null,[o(n,{to:"/api/interfaces/IObjectBodyFieldOption.html#order"},{default:i(()=>[O]),_:1})]),e("li",null,[o(n,{to:"/api/interfaces/IObjectBodyFieldOption.html#type"},{default:i(()=>[j]),_:1})])]),v,e("p",null,[o(n,{to:"/api/interfaces/ICommonFieldOption.html"},{default:i(()=>[x]),_:1}),I,o(n,{to:"/api/interfaces/ICommonFieldOption.html#encode"},{default:i(()=>[F]),_:1})]),B,e("p",null,[e("a",k,[D,o(r)])]),C,w,e("p",null,[L,T,S,H,M,o(n,{to:"/api/#tsingleobjectbodyformatter"},{default:i(()=>[E]),_:1}),N,o(n,{to:"/api/#tmultipleobjectbodyformatter"},{default:i(()=>[R]),_:1})]),V,e("p",null,[e("a",q,[J,o(r)])]),P,e("p",null,[e("a",U,[Y,o(r)])]),z,A,G,K,e("p",null,[e("a",Q,[W,o(r)])])])}var te=s(h,[["render",X],["__file","IObjectBodyFieldOption.html.vue"]]);export{te as default};
