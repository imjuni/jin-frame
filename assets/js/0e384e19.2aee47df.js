"use strict";(self.webpackChunkjin_frame_docs=self.webpackChunkjin_frame_docs||[]).push([[671],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>f});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),m=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=m(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=m(a),d=r,f=u["".concat(s,".").concat(d)]||u[d]||c[d]||i;return a?n.createElement(f,o(o({ref:t},p),{},{components:a})):n.createElement(f,o({ref:t},p))}));function f(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:r,o[1]=l;for(var m=2;m<i;m++)o[m]=a[m];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},9881:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>m});var n=a(7462),r=(a(7294),a(3905));const i={sidebar_position:1,slug:"/",title:"jin-frame"},o=void 0,l={unversionedId:"intro",id:"intro",title:"jin-frame",description:"Download Status Github Star Github Issues NPM version License cti",source:"@site/docs/intro.md",sourceDirName:".",slug:"/",permalink:"/jin-frame/",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,slug:"/",title:"jin-frame"},sidebar:"tutorialSidebar",next:{title:"Exports",permalink:"/jin-frame/api/"}},s={},m=[{value:"Why jin-frame?",id:"why-jin-frame",level:2},{value:"Requirement",id:"requirement",level:2},{value:"Axios version",id:"axios-version",level:2},{value:"Install",id:"install",level:2},{value:"Useage",id:"useage",level:2},{value:"Form",id:"form",level:2},{value:"application/x-www-form-urlencoded",id:"applicationx-www-form-urlencoded",level:3},{value:"multipart/form-data",id:"multipartform-data",level:3},{value:"Example",id:"example",level:2}],p={toc:m};function u(e){let{components:t,...i}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://npmcharts.com/compare/jin-frame?minimal=true"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/npm/dw/jin-frame.svg",alt:"Download Status"}))," ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/github/stars/imjuni/jin-frame.svg?style=popout",alt:"Github Star"}))," ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/issues"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/github/issues-raw/imjuni/jin-frame.svg",alt:"Github Issues"}))," ",(0,r.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/jin-frame"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/npm/v/jin-frame.svg",alt:"NPM version"}))," ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/master/LICENSE"},(0,r.kt)("img",{parentName:"a",src:"https://img.shields.io/npm/l/jin-frame.svg",alt:"License"}))," ",(0,r.kt)("a",{parentName:"p",href:"https://app.circleci.com/pipelines/github/imjuni/jin-frame?branch=master"},(0,r.kt)("img",{parentName:"a",src:"https://circleci.com/gh/imjuni/jin-frame.svg?style=shield",alt:"cti"})),"\n",(0,r.kt)("a",{parentName:"p",href:"https://codecov.io/gh/imjuni/jin-frame"},(0,r.kt)("img",{parentName:"a",src:"https://codecov.io/gh/imjuni/jin-frame/branch/master/graph/badge.svg?token=R7R2PdJcS9",alt:"codecov"}))),(0,r.kt)("p",null,"Reusable HTTP request definition library. Ok, Create ",(0,r.kt)("inlineCode",{parentName:"p"},"template")," for Your HTTP Request!"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Axios Usage"),(0,r.kt)("th",{parentName:"tr",align:null},"Jin-Frame"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("img",{alt:"axios",src:a(9757).Z,width:"867",height:"540"})),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("img",{alt:"jin-frame",src:a(3500).Z,width:"821",height:"504"}))))),(0,r.kt)("h2",{id:"why-jin-frame"},"Why jin-frame?"),(0,r.kt)("p",null,"When the system designed by MSA architecture, it invokes many APIs repeatedly. These repetitive API calls can be optimized for method extraction by refectoring, but are hardly reusabled and easily make to mistakes. Jin-frame defines the API as a class. Defining APIs in this class allows static type verification with the help of the TypeScript compiler and reduces the probability of errors by abstracting API calls. Jin-frame can use ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/axios/axios"},"Axios")," to call APIs directly or automatically process up to run."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"TypeScript compiler can detect error at compile-time"),(0,r.kt)("li",{parentName:"ol"},"HTTP request definition"),(0,r.kt)("li",{parentName:"ol"},"Use Axios ecosystem"),(0,r.kt)("li",{parentName:"ol"},"Inheritance"),(0,r.kt)("li",{parentName:"ol"},"Support FileUpload")),(0,r.kt)("h2",{id:"requirement"},"Requirement"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"TypeScript"),(0,r.kt)("li",{parentName:"ol"},"Decorator",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"enable experimentalDecorators, emitDecoratorMetadata option in tsconfig.json")))),(0,r.kt)("h2",{id:"axios-version"},"Axios version"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"jin-frame"),(0,r.kt)("th",{parentName:"tr",align:null},"axios"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"2.x"),(0,r.kt)("td",{parentName:"tr",align:null},"<= 0.27.x")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"3.x"),(0,r.kt)("td",{parentName:"tr",align:null},">= 1.1.x")))),(0,r.kt)("h2",{id:"install"},"Install"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"npm i jin-frame --save\n")),(0,r.kt)("h2",{id:"useage"},"Useage"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class TestPostQuery extends JinFrame {\n  @JinFrame.param()\n  public readonly id: number;\n\n  @JinFrame.body({ replaceAt: 'test.hello.marvel.name' })\n  public readonly name: string;\n\n  @JinFrame.header({ replaceAt: 'test.hello.marvel.skill' })\n  public readonly skill: string;\n\n  @JinFrame.body({ replaceAt: 'test.hello.marvel.gender' })\n  public readonly gender: string;\n\n  constructor(args: OmitConstructorType<TestPostQuery, 'host' | 'method' | 'contentType'>) {\n    super({ host: 'http://some.api.yanolja.com/jinframe/:id', method: 'POST', ...args });\n  }\n}\n")),(0,r.kt)("p",null,"TestPostQuery class create AxiosRequestConfig object below."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const query = new TestPostQuery('ironman', 'beam');\nconsole.log(query.request());\n\n// console.log show below,\n{\n  timeout: 2000,\n  headers: { test: { hello: { marvel: { skill: 'beam' } } }, 'Content-Type': 'application/json' },\n  method: 'POST',\n  data: { test: { hello: { marvel: { name: 'ironman', gender: 'male' } } } },\n  transformRequest: undefined,\n  url: 'http://some.api.yanolja.com/jinframe/1',\n  validateStatus: () => true\n}\n")),(0,r.kt)("p",null,"You can change name or skill parameter at run-time. Even if you can change host address. Every change don't make fail and create well-formed AxiosRequestConfig object. Also you can change request time and transformRequest, validateStatus parameter. ",(0,r.kt)("em",{parentName:"p"},"x-www-form-urlencoded")," transformRequest already include. You only set content-type params. See ",(0,r.kt)("em",{parentName:"p"},"x-www-form-urlencoded")," ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/master/src/__tests__/jinframe.post.test.ts"},"testcase"),"."),(0,r.kt)("p",null,"Execution no need additional progress. Create curried function after execute that function. jin-frame using axios library so using on browser."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const query = new TestPostQuery('ironman', 'beam');\nconst res = await query.execute();\n\n// or\nconst resp = await axios.request(query.request());\n")),(0,r.kt)("p",null,"Also you can use either,"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"// change base calss JinFrame to JinEitherFrame\nclass TestPostQuery extends JinEitherFrame {\n  // your definition ...\n}\n\nconst query = new TestPostQuery('ironman', 'beam');\nconst res = await query.execute();\n\nif (isFail(res)) {\n  // failover action\n}\n")),(0,r.kt)("h2",{id:"form"},"Form"),(0,r.kt)("p",null,"The form data is ",(0,r.kt)("inlineCode",{parentName:"p"},"multipart/form-data")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"application/x-www-form-urlencoded"),". Use to upload files or submit form fields data."),(0,r.kt)("h3",{id:"applicationx-www-form-urlencoded"},"application/x-www-form-urlencoded"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"application/x-www-form-urlencoded")," converts from data using the ",(0,r.kt)("inlineCode",{parentName:"p"},"trasformRequest")," function in ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/axios/axios"},"axios"),". For jin-frame, if you set the ",(0,r.kt)("inlineCode",{parentName:"p"},"application/x-www-form-urlencoded")," to content-type, use the built-in transformRequest function or pass transformRequest function to constructor."),(0,r.kt)("h3",{id:"multipartform-data"},"multipart/form-data"),(0,r.kt)("p",null,"jin-frame uses the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/form-data/form-data"},"form-data")," package for form-data processing. If you set the ",(0,r.kt)("inlineCode",{parentName:"p"},"multipart/form-data")," content-type, use the form-data package to generate the AxiosRequestConfig data field value. Alternatively, upload the file by passing the customBody constructor parameter."),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("p",null,"You can find more examples in ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/tree/master/examples"},"examples directory"),"."))}u.isMDXComponent=!0},9757:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/axios-usage-126f433d204432131bc8317298922b18.png"},3500:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/jinframe-usage-a680170523eae04ff694e905e8d5550b.png"}}]);