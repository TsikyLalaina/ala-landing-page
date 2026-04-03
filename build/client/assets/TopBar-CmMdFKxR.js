import{x,A as b,p as s,v as n}from"./chunk-LFPYN7LY-CisNrVsk.js";import{c as e,X as j}from"./x-8qqd1VOc.js";import{A as v}from"./arrow-left-CFhq2T2Z.js";/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],N=e("house",u);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],k=e("menu",y);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],g=e("message-circle",M);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],f=e("square-plus",E);/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],_=e("users",F),C=({type:d="standard",title:r,icon:o,leftAction:l,rightAction:t,titleColor:h="#F2F1EE",critical:c=!1})=>{const m=x(),a=b();if(d==="main"){const i=t?.isMenuOpen,p=t?.setIsMenuOpen;return s.jsx("div",{className:`top-bar-container ${c?"is-critical":""}`,children:s.jsxs("div",{className:"top-bar-main-flex",children:[s.jsxs("div",{className:"top-bar-logo-group",children:[s.jsx("div",{className:"top-bar-logo"}),s.jsx("h1",{className:"top-bar-logo-text",children:"Ala"})]}),s.jsxs("div",{className:"top-bar-nav-links",children:[s.jsxs(n,{to:"/feed",className:"top-bar-nav-btn",style:{color:a.pathname==="/feed"?"#4ADE80":"#F2F1EE"},children:[s.jsx(N,{size:22,strokeWidth:a.pathname==="/feed"?2.5:2}),s.jsx("span",{className:"top-bar-nav-label",style:{fontWeight:a.pathname==="/feed"?600:400},children:"Home"})]}),s.jsxs(n,{to:"/groups",className:"top-bar-nav-btn",style:{color:a.pathname.startsWith("/groups")?"#4ADE80":"#F2F1EE"},children:[s.jsx(_,{size:22}),s.jsx("span",{className:"top-bar-nav-label",children:"Groups"})]}),s.jsxs(n,{to:"/new-post",className:"top-bar-nav-btn",style:{color:"#F2F1EE"},children:[s.jsx(f,{size:22}),s.jsx("span",{className:"top-bar-nav-label",children:"Post"})]}),s.jsxs(n,{to:"/messages",className:"top-bar-nav-btn",style:{color:a.pathname.startsWith("/messages")?"#4ADE80":"#F2F1EE"},children:[s.jsx(g,{size:22}),s.jsx("span",{className:"top-bar-nav-label",children:"Chat"})]}),s.jsxs("button",{onClick:()=>p&&p(!i),className:"top-bar-nav-btn",style:{color:"#F2F1EE"},children:[i?s.jsx(j,{size:22}):s.jsx(k,{size:22}),s.jsx("span",{className:"top-bar-nav-label",children:"More"})]})]})]})})}return s.jsx("div",{className:`top-bar-container ${c?"is-critical":""}`,children:s.jsxs("div",{className:"top-bar-standard-flex",children:[s.jsxs("div",{className:"top-bar-left-group",children:[l!==null&&s.jsx("button",{onClick:()=>l?l():m(-1),className:"top-bar-back-btn",children:s.jsx(v,{size:24})}),(r||o)&&s.jsxs("h1",{className:"top-bar-title",style:{color:h},children:[o&&s.jsx("span",{className:"top-bar-title-icon",children:o}),s.jsx("span",{children:r})]})]}),t&&s.jsx("div",{className:"top-bar-right-group",children:t})]})})};export{g as M,f as S,C as T,_ as U};
