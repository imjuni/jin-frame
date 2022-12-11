"use strict";(self.webpackChunkjin_frame_docs=self.webpackChunkjin_frame_docs||[]).push([[136],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),l=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=l(e.components);return a.createElement(s.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),d=l(n),c=r,h=d["".concat(s,".").concat(c)]||d[c]||u[c]||o;return n?a.createElement(h,i(i({ref:t},m),{},{components:n})):a.createElement(h,i({ref:t},m))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=c;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p[d]="string"==typeof e?e:r,i[1]=p;for(var l=2;l<o;l++)i[l]=n[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},425:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>p,toc:()=>l});var a=n(7462),r=(n(7294),n(3905));const o={lang:"en-US",title:"Object Body",description:"Object Body usage"},i=void 0,p={unversionedId:"usage/object-body",id:"usage/object-body",title:"Object Body",description:"Object Body usage",source:"@site/docs/usage/object-body.md",sourceDirName:"usage",slug:"/usage/object-body",permalink:"/jin-frame/usage/object-body",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/usage/object-body.md",tags:[],version:"current",frontMatter:{lang:"en-US",title:"Object Body",description:"Object Body usage"},sidebar:"tutorialSidebar",previous:{title:"Header",permalink:"/jin-frame/usage/header"},next:{title:"Param",permalink:"/jin-frame/usage/param"}},s={},l=[{value:"depth",id:"depth",level:2},{value:"type",id:"type",level:2},{value:"formatters",id:"formatters",level:2},{value:"single formatters",id:"single-formatters",level:3},{value:"multiple formatters",id:"multiple-formatters",level:3},{value:"Examples",id:"examples",level:2}],m={toc:l};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Explain how to define header parameter using the jin-frame. The body parameter can be defined as the ",(0,r.kt)("inlineCode",{parentName:"p"},"body()")," function and the ",(0,r.kt)("inlineCode",{parentName:"p"},"objectBody()"),". This section describes the ",(0,r.kt)("inlineCode",{parentName:"p"},"objectBody()")," function."),(0,r.kt)("h2",{id:"depth"},"depth"),(0,r.kt)("p",null,"The function ",(0,r.kt)("inlineCode",{parentName:"p"},"objectBody()")," does not automatically generate 1 dpeth keys. If the ",(0,r.kt)("inlineCode",{parentName:"p"},"AxiosRequestConfig.data")," shape is complex and has many keys, generating all key values as a function ",(0,r.kt)("inlineCode",{parentName:"p"},"body()")," can result in more unnecessary work."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"class MarvelHeroPostFrame extends JinEitherFrame {\n  @JinEitherFrame.param()\n  public readonly id: string;\n\n  @JinEitherFrame.objectBody()\n  public readonly personality: { username: string; password: string };\n\n  constructor(args: { id: string; username: string; password: string }) {\n    super({ host: 'http://api.marvel-comics.com', path: '/hero/:id', method: 'POST' });\n\n    this.id = args.id;\n    this.personality = { username: args.username, password: args.password };\n  }\n}\nconst frame = new MarvelHeroPostFrame({ id: 1, username: 'ironman', password: 'advengers' });\nconst req = frame.request();\nconsole.log(req);\n")),(0,r.kt)("p",null,"When you create ",(0,r.kt)("inlineCode",{parentName:"p"},"MarvelHeroPostFrame")," and execute the ",(0,r.kt)("inlineCode",{parentName:"p"},"requset")," function, the following body objects are created:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "timeout": 120000,\n  "headers": { "Content-Type": "application/json" },\n  "method": "POST",\n  "data": { "username": "ironman", "password": "advengers" },\n  "transformRequest": undefined,\n  "url": "http://api.marvel-comics.com/hero/1",\n  "validateStatus": undefined\n}\n')),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"req")," value is type of ",(0,r.kt)("inlineCode",{parentName:"p"},"AxiosRequestConfig"),"."),(0,r.kt)("p",null,"If you look at the ",(0,r.kt)("inlineCode",{parentName:"p"},"data")," field, you can see that the ",(0,r.kt)("inlineCode",{parentName:"p"},"username")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"password")," keys are assigned into the data without using the ",(0,r.kt)("inlineCode",{parentName:"p"},"personality")," class member variable name. As such, the ",(0,r.kt)("inlineCode",{parentName:"p"},"objectBody()")," function is a function that defines all or part of the body parameter."),(0,r.kt)("h2",{id:"type"},"type"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"objectBody()")," function use ",(0,r.kt)("inlineCode",{parentName:"p"},"string")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"number"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"boolean"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"Date"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"string[]"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"number[]"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"boolean[]"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"Date[]"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"object")," type. ",(0,r.kt)("inlineCode",{parentName:"p"},"string[]"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"number[]"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"boolean[]"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"Date[]")," type don't merged another ",(0,r.kt)("inlineCode",{parentName:"p"},"objectBody()")," definition."),(0,r.kt)("h2",{id:"formatters"},"formatters"),(0,r.kt)("h3",{id:"single-formatters"},"single formatters"),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"objectBody()")," function can be changed to the wanted value using the formatters. The example below shows how to declare an epoch number type variable as a Date type and change the Date type to a number type using the getUnixTime function when the epoch variable is included in the request."),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"getUnixTime")," function is included in package ",(0,r.kt)("inlineCode",{parentName:"p"},"date-fns"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import getUnixTime from 'date-fns/getUnixTime';\n\nclass GetHeroFrame extends JinFrame {\n  @JinFrame.param()\n  public readonly id: Date;\n\n  @JinFrame.objectBody({\n    formatter: {\n      dateTime: (value) => getUnixTime(value),\n    },\n  })\n  public readonly epoch: Date;\n\n  constructor(id: number, epoch: Date) {\n    super({ host: 'http://api.marvel-comics.com', path: '/hero/:id', method: 'POST' });\n\n    this.id = id;\n    this.epoch = epoch;\n  }\n}\n")),(0,r.kt)("p",null,"formatters have three function like number, dateTime, string. Each function can be an input value for another formatters function."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import getUnixTime from 'date-fns/getUnixTime';\n\nclass GetEpochFormatFrame extends JinFrame {\n  @JinFrame.param()\n  public readonly id: Date;\n\n  @JinFrame.objectBody({\n    formatter: {\n      order: ['number', 'dateTime', 'string'],\n      number: (value) => getUnixTime(value + 86400),\n      dateTime: (value) => liteFormat(value, 'yyyyMMddHHmmss'),\n    },\n  })\n  public readonly epoch: number;\n\n  constructor(id: number, epoch: number) {\n    super({ host: 'http://api.marvel-comics.com', path: '/release/:epoch', method: 'POST' });\n\n    this.id = id;\n    this.epoch = epoch;\n  }\n}\n")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"GetEpochFormatFrame")," adds 1 day to the epoch variable, converts it to a Date type using the getUnixTime function, and converts it to a string using the liteFormat function. ",(0,r.kt)("inlineCode",{parentName:"p"},"GetEpochFormatFrame")," is an example. You can find another efficiency way to add a day and text it's"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"order")," option deside that order of formatter apply. Default values are ",(0,r.kt)("inlineCode",{parentName:"p"},"['number', 'string', 'dateTime']")),(0,r.kt)("h3",{id:"multiple-formatters"},"multiple formatters"),(0,r.kt)("p",null,"You may need to apply formatters to multiple keys when the value defined by the function ",(0,r.kt)("inlineCode",{parentName:"p"},"objectBody()")," is ",(0,r.kt)("inlineCode",{parentName:"p"},"object"),". See below."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"interface IHeroInBody {\n  name: string;\n  age: number;\n  bio: {\n    birth: Date;\n  };\n}\n\nclass MarvelHeroPostFrame extends JinEitherFrame {\n  @JinEitherFrame.param()\n  public readonly id: string;\n\n  @JinEitherFrame.objectBody({\n    formatters: [\n      {\n        findFrom: 'name',\n        string: (value) => `Marvel SuperHero \"${value}\"`,\n      },\n      {\n        findFrom: 'bio.birth',\n        dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),\n      },\n    ],\n  })\n  public readonly hero: IHeroInBody;\n\n  @JinEitherFrame.objectBody()\n  public readonly password: string;\n\n  constructor(args: { id: string; hero: IHeroInBody; password: string }) {\n    super({ host: 'http://api.marvel-comics.com', path: '/hero/:id', method: 'POST' });\n\n    this.id = args.id;\n    this.hero = args.hero;\n    this.password = args.password;\n  }\n}\n")),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"hero")," class member variable defined by the function ",(0,r.kt)("inlineCode",{parentName:"p"},"body()")," using the ",(0,r.kt)("inlineCode",{parentName:"p"},"IHeroInBody")," interface. The above example shows the application of formatters to the ",(0,r.kt)("inlineCode",{parentName:"p"},"name")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"bio.birth")," values in the ",(0,r.kt)("inlineCode",{parentName:"p"},"IHeroInBody")," interface defined in this way."),(0,r.kt)("p",null,"You want to access a child node in ",(0,r.kt)("inlineCode",{parentName:"p"},"hero")," object, you have to pass ",(0,r.kt)("inlineCode",{parentName:"p"},"findFrom")," option and that is use dot path(using ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/sindresorhus/dot-prop"},"dot-prop")," package). The class member variable name ",(0,r.kt)("inlineCode",{parentName:"p"},"hero")," should not be written down."),(0,r.kt)("h2",{id:"examples"},"Examples"),(0,r.kt)("p",null,"You can found more example in ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/master/src/__tests__"},"testcase")," and ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/imjuni/jin-frame/blob/master/examples"},"examples"),"."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/imjuni/jin-frame/blob/master/src/__tests__/jinframe.get.test.ts"},"object.body.builder.test")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/imjuni/jin-frame/blob/master/examples/CommaSeperatedGetFrame.ts"},"BodyOrderedMergeFrame.ts")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/imjuni/jin-frame/blob/master/examples/OverlapDecoratorGetFrame.ts"},"ComplexFormatGetFrame.ts")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/imjuni/jin-frame/blob/master/examples/OverlapDecoratorGetFrame.ts"},"ComplexFormattingWithBodyMergeFrame.ts"))))}d.isMDXComponent=!0}}]);