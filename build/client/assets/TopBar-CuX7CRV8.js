import{x as b,A as j,p as s,v as n}from"./chunk-LFPYN7LY-CisNrVsk.js";import{c as e,X as v}from"./x-8qqd1VOc.js";import{A as u}from"./arrow-left-CFhq2T2Z.js";/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],y=e("house",N);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],M=e("menu",k);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],E=e("message-circle",g);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],F=e("square-plus",f);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],w=e("users",_),H=({type:h="standard",title:l,icon:o,leftAction:r,rightAction:t,titleColor:m="#F2F1EE",critical:c=!1,sticky:i=!0})=>{const x=b(),a=j();if(h==="main"){const p=t?.isMenuOpen,d=t?.setIsMenuOpen;return s.jsx("div",{className:`top-bar-container ${c?"is-critical":""}`,style:i?{}:{position:"static"},children:s.jsxs("div",{className:"top-bar-main-flex",children:[s.jsx("div",{className:"top-bar-logo-group",children:s.jsx("div",{className:"top-bar-logo"})}),s.jsxs("div",{className:"top-bar-nav-links",children:[s.jsxs(n,{to:"/feed",className:"top-bar-nav-btn",style:{color:a.pathname==="/feed"?"#4ADE80":"#F2F1EE"},children:[s.jsx(y,{size:22,strokeWidth:a.pathname==="/feed"?2.5:2}),s.jsx("span",{className:"top-bar-nav-label",style:{fontWeight:a.pathname==="/feed"?600:400},children:"Home"})]}),s.jsxs(n,{to:"/groups",className:"top-bar-nav-btn",style:{color:a.pathname.startsWith("/groups")?"#4ADE80":"#F2F1EE"},children:[s.jsx(w,{size:22}),s.jsx("span",{className:"top-bar-nav-label",children:"Groups"})]}),s.jsxs(n,{to:"/new-post",className:"top-bar-nav-btn",style:{color:"#F2F1EE"},children:[s.jsx(F,{size:22}),s.jsx("span",{className:"top-bar-nav-label",children:"Post"})]}),s.jsxs(n,{to:"/messages",className:"top-bar-nav-btn",style:{color:a.pathname.startsWith("/messages")?"#4ADE80":"#F2F1EE"},children:[s.jsx(E,{size:22}),s.jsx("span",{className:"top-bar-nav-label",children:"Chat"})]}),s.jsxs("button",{onClick:()=>d&&d(!p),className:"top-bar-nav-btn",style:{color:"#F2F1EE"},children:[p?s.jsx(v,{size:22}):s.jsx(M,{size:22}),s.jsx("span",{className:"top-bar-nav-label",children:"More"})]})]})]})})}return s.jsx("div",{className:`top-bar-container ${c?"is-critical":""}`,style:i?{}:{position:"static"},children:s.jsxs("div",{className:"top-bar-standard-flex",children:[s.jsxs("div",{className:"top-bar-left-group",children:[r!==null&&s.jsx("button",{onClick:()=>r?r():x(-1),className:"top-bar-back-btn",children:s.jsx(u,{size:24})}),(l||o)&&s.jsxs("h1",{className:"top-bar-title",style:{color:m},children:[o&&s.jsx("span",{className:"top-bar-title-icon",children:o}),s.jsx("span",{children:l})]})]}),t&&s.jsx("div",{className:"top-bar-right-group",children:t})]})})};export{E as M,F as S,H as T,w as U};
