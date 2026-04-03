import{w as z,z as R,x as q,a as o,p as e}from"./chunk-LFPYN7LY-CisNrVsk.js";import{u as $}from"./AuthContext-Cp18ztuo.js";import{s as d}from"./supabase-Cc_Lwtd_.js";import{T as w}from"./TopBar-CfL6p7_d.js";import{S as F}from"./search-B9Ds4HEC.js";import{L as _}from"./loader-circle-B04qapzM.js";import{M as C}from"./message-square-CLILAdGq.js";import{U as S}from"./user-DklXjnZA.js";import{c as L}from"./x-8qqd1VOc.js";import{C as N}from"./check-Bi1oF7IJ.js";import{S as T}from"./send-DtRHVw67.js";import"./arrow-left-CFhq2T2Z.js";/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]],I=L("check-check",U),W=()=>{const{userId:i}=R(),{user:r}=$(),x=q(),h=o.useRef(null),[g,E]=o.useState([]),[y,p]=o.useState([]),[l,b]=o.useState(""),[D,A]=o.useState(!0),[f,v]=o.useState(!1),[c,j]=o.useState(null);o.useEffect(()=>{u();const s=d.channel("global-messages").on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`receiver_id=eq.${r.id}`},t=>{u(),i&&t.new.sender_id===i&&p(a=>[...a,t.new])}).subscribe();return()=>d.removeChannel(s)},[r.id]),o.useEffect(()=>{i?k(i):(j(null),p([]))},[i]),o.useEffect(()=>{h.current&&(h.current.scrollTop=h.current.scrollHeight)},[y]);const u=async()=>{try{const{data:s,error:t}=await d.from("messages").select(`
                    *,
                    sender:sender_id(id, name, avatar_url),
                    receiver:receiver_id(id, name, avatar_url)
                `).or(`sender_id.eq.${r.id},receiver_id.eq.${r.id}`).order("created_at",{ascending:!1});if(t)throw t;const a=new Map;s.forEach(n=>{const m=n.sender_id===r.id?n.receiver:n.sender;a.has(m.id)||a.set(m.id,{user:m,lastMessage:n,hasUnread:n.receiver_id===r.id&&!n.read_at})}),E(Array.from(a.values())),A(!1)}catch(s){console.error("Error fetching conversations:",s)}},k=async s=>{if(!c||c.id!==s){const{data:n}=await d.from("users").select("*").eq("id",s).single();j(n)}const{data:t,error:a}=await d.from("messages").select("*").or(`and(sender_id.eq.${r.id},receiver_id.eq.${s}),and(sender_id.eq.${s},receiver_id.eq.${r.id})`).order("created_at",{ascending:!0});a||p(t),await d.from("messages").update({read_at:new Date().toISOString()}).eq("sender_id",s).eq("receiver_id",r.id).is("read_at",null),u()},B=async s=>{if(s.preventDefault(),!(!l.trim()||!i)){v(!0);try{const{data:t,error:a}=await d.from("messages").insert({sender_id:r.id,receiver_id:i,content:l.trim()}).select().single();if(a)throw a;p(n=>[...n,t]),b(""),u()}catch(t){console.error("Error sending message:",t)}finally{v(!1)}}},M={display:"flex",flexDirection:"column",background:"rgba(11, 61, 46, 0.95)",borderRight:"1px solid #2E7D67",height:"100%"};return e.jsxs("div",{style:{height:"100vh",display:"flex",background:"#0B3D2E",color:"#F2F1EE",overflow:"hidden"},children:[e.jsxs("div",{className:`sidebar-container ${i?"hidden-mobile":""}`,style:M,children:[e.jsx(w,{title:"Messages",leftAction:()=>x("/feed")}),e.jsx("div",{style:{padding:12},children:e.jsxs("div",{style:{position:"relative"},children:[e.jsx(F,{size:16,style:{position:"absolute",left:12,top:12,color:"#A7C7BC"}}),e.jsx("input",{placeholder:"Search conversations...",style:{width:"100%",padding:"10px 10px 10px 36px",borderRadius:20,border:"none",background:"rgba(255,255,255,0.1)",color:"white",boxSizing:"border-box",outline:"none"}})]})}),e.jsx("div",{style:{flex:1,overflowY:"auto"},children:D?e.jsx("div",{style:{padding:20,textAlign:"center"},children:e.jsx(_,{className:"animate-spin"})}):g.length===0?e.jsxs("div",{style:{padding:40,textAlign:"center",color:"#A7C7BC"},children:[e.jsx(C,{size:48,style:{opacity:.3,marginBottom:10}}),e.jsx("p",{children:"No messages yet."})]}):g.map(s=>e.jsxs("div",{onClick:()=>x(`/messages/${s.user.id}`),style:{padding:16,display:"flex",gap:12,cursor:"pointer",background:i===s.user.id?"rgba(74, 222, 128, 0.1)":"transparent",borderLeft:i===s.user.id?"3px solid #4ADE80":"3px solid transparent"},children:[s.user.avatar_url?e.jsx("img",{src:s.user.avatar_url,style:{width:48,height:48,borderRadius:"50%",objectFit:"cover"}}):e.jsx("div",{style:{width:48,height:48,borderRadius:"50%",background:"#2E7D67",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(S,{color:"#A7C7BC"})}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4},children:[e.jsx("span",{style:{fontWeight:"bold",color:s.hasUnread?"white":"#F2F1EE"},children:s.user.name}),e.jsx("span",{style:{fontSize:11,color:"#A7C7BC"},children:new Date(s.lastMessage.created_at).toLocaleDateString()})]}),e.jsxs("p",{style:{margin:0,fontSize:13,color:s.hasUnread?"#4ADE80":"#A7C7BC",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:s.hasUnread?"bold":"normal"},children:[s.lastMessage.sender_id===r.id?"You: ":"",s.lastMessage.content]})]})]},s.user.id))})]}),e.jsx("div",{className:`chat-container ${i?"":"hidden-mobile"}`,style:{flex:1,display:"flex",flexDirection:"column",background:"#0B3D2E"},children:i?e.jsxs(e.Fragment,{children:[e.jsx(w,{leftAction:()=>x("/messages"),title:c?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[c.avatar_url?e.jsx("img",{src:c.avatar_url,style:{width:32,height:32,borderRadius:"50%",objectFit:"cover"}}):e.jsx("div",{style:{width:32,height:32,borderRadius:"50%",background:"#2E7D67",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(S,{size:16,color:"#A7C7BC"})}),e.jsx("span",{style:{fontSize:16},children:c.name})]}):""}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:20,display:"flex",flexDirection:"column",gap:12},ref:h,children:y.map(s=>{const t=s.sender_id===r.id;return e.jsxs("div",{style:{alignSelf:t?"flex-end":"flex-start",maxWidth:"75%"},children:[e.jsx("div",{style:{background:t?"#4ADE80":"rgba(255,255,255,0.1)",color:t?"#0B3D2E":"#F2F1EE",padding:"10px 14px",borderRadius:16,borderBottomRightRadius:t?4:16,borderTopLeftRadius:t?16:4},children:s.content}),e.jsxs("div",{style:{fontSize:10,color:"#A7C7BC",marginTop:4,textAlign:t?"right":"left",display:"flex",alignItems:"center",justifyContent:t?"flex-end":"flex-start",gap:4},children:[new Date(s.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),t&&(s.read_at?e.jsx(I,{size:12,color:"#4ADE80"}):e.jsx(N,{size:12}))]})]},s.id)})}),e.jsx("div",{style:{padding:16,borderTop:"1px solid #2E7D67",background:"rgba(11, 61, 46, 0.95)"},children:e.jsxs("form",{onSubmit:B,style:{display:"flex",gap:10},children:[e.jsx("input",{value:l,onChange:s=>b(s.target.value),placeholder:"Type a message...",style:{flex:1,padding:"12px 16px",borderRadius:24,border:"none",background:"rgba(255,255,255,0.1)",color:"white",outline:"none"}}),e.jsx("button",{type:"submit",disabled:f||!l.trim(),style:{background:"transparent",border:"none",padding:8,cursor:!l.trim()||f?"not-allowed":"pointer",opacity:f||!l.trim()?.5:1},children:f?e.jsx(_,{className:"animate-spin",size:24,color:"#4ADE80"}):e.jsx(T,{size:28,color:"#4ADE80"})})]})})]}):e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#A7C7BC"},children:[e.jsx(C,{size:64,style:{opacity:.2,marginBottom:20}}),e.jsx("p",{style:{fontSize:18},children:"Select a conversation to start chatting"})]})}),e.jsx("style",{children:`
                /* Default (Mobile First approach naturally, but here we style for basic shared styles) */
                .sidebar-container {
                    width: 100%;
                    flex: 1;
                }
                .chat-container {
                    /* Default hidden on mobile if sidebar is active (handled by hidden-mobile on sidebar logic actually) */
                    /* But if chat is active, we hide sidebar.
                       So by default if chat active, chat is flex 1. 
                    */
                }

                @media (max-width: 768px) {
                    .hidden-mobile {
                        display: none !important;
                    }
                    .mobile-only {
                        display: flex;
                    }
                }

                @media (min-width: 768px) {
                    .sidebar-container {
                        width: 350px !important;
                        min-width: 350px;
                        flex: none !important;
                        display: flex !important;
                        border-right: 1px solid #2E7D67;
                    }
                    .chat-container {
                        display: flex !important;
                        flex: 1;
                    }
                    /* Override hidden-mobile on desktop so both are visible */
                    .hidden-mobile {
                        display: flex !important;
                    }
                    .mobile-only {
                        display: none !important;
                    }
                }
            `})]})},se=z(W);export{se as default};
