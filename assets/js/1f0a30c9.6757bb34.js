"use strict";(self.webpackChunkjin_frame_docs=self.webpackChunkjin_frame_docs||[]).push([[497],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>u});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),d=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=d(e.components);return r.createElement(p.Provider,{value:t},e.children)},s="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),s=d(n),f=a,u=s["".concat(p,".").concat(f)]||s[f]||c[f]||i;return n?r.createElement(u,o(o({ref:t},m),{},{components:n})):r.createElement(u,o({ref:t},m))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=f;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[s]="string"==typeof e?e:a,o[1]=l;for(var d=2;d<i;d++)o[d]=n[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},278:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>s,frontMatter:()=>i,metadata:()=>l,toc:()=>d});var r=n(7462),a=(n(7294),n(3905));const i={id:"IHeaderFieldOption",title:"Interface: IHeaderFieldOption",sidebar_label:"IHeaderFieldOption",sidebar_position:0,custom_edit_url:null},o=void 0,l={unversionedId:"api/interfaces/IHeaderFieldOption",id:"api/interfaces/IHeaderFieldOption",title:"Interface: IHeaderFieldOption",description:"Hierarchy",source:"@site/docs/api/interfaces/IHeaderFieldOption.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/IHeaderFieldOption",permalink:"/jin-frame/api/interfaces/IHeaderFieldOption",draft:!1,editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"IHeaderFieldOption",title:"Interface: IHeaderFieldOption",sidebar_label:"IHeaderFieldOption",sidebar_position:0,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"IFormatter",permalink:"/jin-frame/api/interfaces/IFormatter"},next:{title:"IJinFrameCreateConfig",permalink:"/jin-frame/api/interfaces/IJinFrameCreateConfig"}},p={},d=[{value:"Hierarchy",id:"hierarchy",level:2},{value:"Properties",id:"properties",level:2},{value:"comma",id:"comma",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"encode",id:"encode",level:3},{value:"Inherited from",id:"inherited-from",level:4},{value:"Defined in",id:"defined-in-1",level:4},{value:"formatters",id:"formatters",level:3},{value:"Defined in",id:"defined-in-2",level:4},{value:"replaceAt",id:"replaceat",level:3},{value:"Defined in",id:"defined-in-3",level:4},{value:"type",id:"type",level:3},{value:"Defined in",id:"defined-in-4",level:4}],m={toc:d};function s(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"hierarchy"},"Hierarchy"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"/jin-frame/api/interfaces/ICommonFieldOption"},(0,a.kt)("inlineCode",{parentName:"a"},"ICommonFieldOption"))),(0,a.kt)("p",{parentName:"li"},"\u21b3 ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"IHeaderFieldOption"))))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("h3",{id:"comma"},"comma"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"comma"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("p",null,'"comma" option only working array type variable. If you want to process array parameter of headers\nusing by comma seperated string, set this option'),(0,a.kt)("p",null,"Comma seperated array parameter on header"),(0,a.kt)("h4",{id:"defined-in"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/e005d9d/src/interfaces/IHeaderFieldOption.ts#L23"},"jin-frame/src/interfaces/IHeaderFieldOption.ts:23")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"encode"},"encode"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"encode"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("p",null,"Do encodeURIComponent execution, this option only executed in query parameter"),(0,a.kt)("h4",{id:"inherited-from"},"Inherited from"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/jin-frame/api/interfaces/ICommonFieldOption"},"ICommonFieldOption"),".",(0,a.kt)("a",{parentName:"p",href:"/jin-frame/api/interfaces/ICommonFieldOption#encode"},"encode")),(0,a.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/e005d9d/src/interfaces/ICommonFieldOption.ts#L3"},"jin-frame/src/interfaces/ICommonFieldOption.ts:3")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"formatters"},"formatters"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"formatters"),": ",(0,a.kt)("a",{parentName:"p",href:"/jin-frame/api/interfaces/IFormatter"},(0,a.kt)("inlineCode",{parentName:"a"},"IFormatter"))," ","|"," ",(0,a.kt)("a",{parentName:"p",href:"/jin-frame/api/interfaces/IFormatter"},(0,a.kt)("inlineCode",{parentName:"a"},"IFormatter")),"[]"),(0,a.kt)("p",null,"formatter configuration, use convert date type or transform data shape"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"formatters")," field only work when have valid input type."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"formatters")," fields operate in order of string formatter, dateTime formatter. So You can change a string to\nJavaScript Date instance using by string formatter and a converted Date instance to string using by dateTime\nformatter."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"Remarks"))),(0,a.kt)("p",null,"If you use the string formatter to change to JavaScript Date instance and then do not change to a string,\nthe formatters setting is: automatically convert to iso8601 string"),(0,a.kt)("p",null,"header field don't need a findFrom. HTTP protocol header not treat complex type object and array."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"Url"))),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Headers"},"https://developer.mozilla.org/en-US/docs/Web/API/Headers")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"Example"))),(0,a.kt)("p",null,"ordered example."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"{\n  string: (value: string) => parse(value, \"yyyy-MM-dd'T'HH:mm:ss\", new Date()),\n  dateTime: (value: Date) => format(value, 'yyyy-MM-dd HH:mm:ss'),\n}\n")),(0,a.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/e005d9d/src/interfaces/IHeaderFieldOption.ts#L52"},"jin-frame/src/interfaces/IHeaderFieldOption.ts:52")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"replaceat"},"replaceAt"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"replaceAt"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string")),(0,a.kt)("p",null,'"replaceAt" option only working in body or header. If you want to create depth of body or header,\nset this option dot seperated string. See below,'),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"Example"))),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"data.test.ironman")," convert to ",(0,a.kt)("inlineCode",{parentName:"p"},'{ data: { test: { ironman: "value here" } } }')),(0,a.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/e005d9d/src/interfaces/IHeaderFieldOption.ts#L15"},"jin-frame/src/interfaces/IHeaderFieldOption.ts:15")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"type"},"type"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"type"),": ",(0,a.kt)("inlineCode",{parentName:"p"},'"header"')),(0,a.kt)("p",null,"field option discriminator"),(0,a.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/e005d9d/src/interfaces/IHeaderFieldOption.ts#L6"},"jin-frame/src/interfaces/IHeaderFieldOption.ts:6")))}s.isMDXComponent=!0}}]);