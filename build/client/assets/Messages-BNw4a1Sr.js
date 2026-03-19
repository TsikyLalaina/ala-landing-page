import{w as M,z as R,x as q,a as o,p as e}from"./chunk-LFPYN7LY-CisNrVsk.js";import{u as F}from"./AuthContext-Cp18ztuo.js";import{s as d}from"./supabase-Cc_Lwtd_.js";import{A as w}from"./arrow-left-KcxvKs1X.js";import{S as $}from"./search-D-bhSeWo.js";import{L as C}from"./loader-circle-3CKXh_uz.js";import{M as _}from"./message-square-Ct9cqEcT.js";import{U as E}from"./user-CWrWcOAj.js";import{c as L}from"./createLucideIcon-dAkXvH6m.js";import{C as N}from"./check-DkBDPIIC.js";import{S as U}from"./send-BYjrdRjg.js";/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]],I=L("check-check",T),W=()=>{const{userId:i}=R(),{user:r}=F(),u=q(),h=o.useRef(null),[g,S]=o.useState([]),[b,p]=o.useState([]),[l,y]=o.useState(""),[D,k]=o.useState(!0),[x,v]=o.useState(!1),[c,j]=o.useState(null);o.useEffect(()=>{f();const s=d.channel("global-messages").on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`receiver_id=eq.${r.id}`},t=>{f(),i&&t.new.sender_id===i&&p(n=>[...n,t.new])}).subscribe();return()=>d.removeChannel(s)},[r.id]),o.useEffect(()=>{i?A(i):(j(null),p([]))},[i]),o.useEffect(()=>{h.current&&(h.current.scrollTop=h.current.scrollHeight)},[b]);const f=async()=>{try{const{data:s,error:t}=await d.from("messages").select(`
                    *,
                    sender:sender_id(id, name, avatar_url),
                    receiver:receiver_id(id, name, avatar_url)
                `).or(`sender_id.eq.${r.id},receiver_id.eq.${r.id}`).order("created_at",{ascending:!1});if(t)throw t;const n=new Map;s.forEach(a=>{const m=a.sender_id===r.id?a.receiver:a.sender;n.has(m.id)||n.set(m.id,{user:m,lastMessage:a,hasUnread:a.receiver_id===r.id&&!a.read_at})}),S(Array.from(n.values())),k(!1)}catch(s){console.error("Error fetching conversations:",s)}},A=async s=>{if(!c||c.id!==s){const{data:a}=await d.from("users").select("*").eq("id",s).single();j(a)}const{data:t,error:n}=await d.from("messages").select("*").or(`and(sender_id.eq.${r.id},receiver_id.eq.${s}),and(sender_id.eq.${s},receiver_id.eq.${r.id})`).order("created_at",{ascending:!0});n||p(t),await d.from("messages").update({read_at:new Date().toISOString()}).eq("sender_id",s).eq("receiver_id",r.id).is("read_at",null),f()},B=async s=>{if(s.preventDefault(),!(!l.trim()||!i)){v(!0);try{const{data:t,error:n}=await d.from("messages").insert({sender_id:r.id,receiver_id:i,content:l.trim()}).select().single();if(n)throw n;p(a=>[...a,t]),y(""),f()}catch(t){console.error("Error sending message:",t)}finally{v(!1)}}},z={display:"flex",flexDirection:"column",background:"rgba(11, 61, 46, 0.95)",borderRight:"1px solid #2E7D67",height:"100%"};return e.jsxs("div",{style:{height:"100vh",display:"flex",background:"#0B3D2E",color:"#F2F1EE",overflow:"hidden"},children:[e.jsxs("div",{className:`sidebar-container ${i?"hidden-mobile":""}`,style:z,children:[e.jsxs("div",{style:{padding:16,borderBottom:"1px solid #2E7D67",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("h1",{style:{fontSize:20,fontWeight:"bold",margin:0},children:"Messages"}),e.jsx("button",{onClick:()=>u("/feed"),style:{background:"none",border:"none",color:"#A7C7BC",cursor:"pointer"},children:e.jsx(w,{size:20})})]}),e.jsx("div",{style:{padding:12},children:e.jsxs("div",{style:{position:"relative"},children:[e.jsx($,{size:16,style:{position:"absolute",left:12,top:12,color:"#A7C7BC"}}),e.jsx("input",{placeholder:"Search conversations...",style:{width:"100%",padding:"10px 10px 10px 36px",borderRadius:20,border:"none",background:"rgba(255,255,255,0.1)",color:"white",boxSizing:"border-box",outline:"none"}})]})}),e.jsx("div",{style:{flex:1,overflowY:"auto"},children:D?e.jsx("div",{style:{padding:20,textAlign:"center"},children:e.jsx(C,{className:"animate-spin"})}):g.length===0?e.jsxs("div",{style:{padding:40,textAlign:"center",color:"#A7C7BC"},children:[e.jsx(_,{size:48,style:{opacity:.3,marginBottom:10}}),e.jsx("p",{children:"No messages yet."})]}):g.map(s=>e.jsxs("div",{onClick:()=>u(`/messages/${s.user.id}`),style:{padding:16,display:"flex",gap:12,cursor:"pointer",background:i===s.user.id?"rgba(74, 222, 128, 0.1)":"transparent",borderLeft:i===s.user.id?"3px solid #4ADE80":"3px solid transparent"},children:[s.user.avatar_url?e.jsx("img",{src:s.user.avatar_url,style:{width:48,height:48,borderRadius:"50%",objectFit:"cover"}}):e.jsx("div",{style:{width:48,height:48,borderRadius:"50%",background:"#2E7D67",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(E,{color:"#A7C7BC"})}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4},children:[e.jsx("span",{style:{fontWeight:"bold",color:s.hasUnread?"white":"#F2F1EE"},children:s.user.name}),e.jsx("span",{style:{fontSize:11,color:"#A7C7BC"},children:new Date(s.lastMessage.created_at).toLocaleDateString()})]}),e.jsxs("p",{style:{margin:0,fontSize:13,color:s.hasUnread?"#4ADE80":"#A7C7BC",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:s.hasUnread?"bold":"normal"},children:[s.lastMessage.sender_id===r.id?"You: ":"",s.lastMessage.content]})]})]},s.user.id))})]}),e.jsx("div",{className:`chat-container ${i?"":"hidden-mobile"}`,style:{flex:1,display:"flex",flexDirection:"column",background:"#0B3D2E"},children:i?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{padding:"10px 16px",borderBottom:"1px solid #2E7D67",display:"flex",alignItems:"center",gap:12,background:"rgba(11, 61, 46, 0.95)"},children:[e.jsx("button",{onClick:()=>u("/messages"),className:"mobile-only",style:{background:"none",border:"none",color:"#A7C7BC",cursor:"pointer",marginRight:4,display:"flex"},children:e.jsx(w,{size:20})}),c&&e.jsxs(e.Fragment,{children:[c.avatar_url?e.jsx("img",{src:c.avatar_url,style:{width:36,height:36,borderRadius:"50%",objectFit:"cover"}}):e.jsx("div",{style:{width:36,height:36,borderRadius:"50%",background:"#2E7D67",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(E,{size:18,color:"#A7C7BC"})}),e.jsx("div",{children:e.jsx("div",{style:{fontWeight:"bold"},children:c.name})})]})]}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:20,display:"flex",flexDirection:"column",gap:12},ref:h,children:b.map(s=>{const t=s.sender_id===r.id;return e.jsxs("div",{style:{alignSelf:t?"flex-end":"flex-start",maxWidth:"75%"},children:[e.jsx("div",{style:{background:t?"#4ADE80":"rgba(255,255,255,0.1)",color:t?"#0B3D2E":"#F2F1EE",padding:"10px 14px",borderRadius:16,borderBottomRightRadius:t?4:16,borderTopLeftRadius:t?16:4},children:s.content}),e.jsxs("div",{style:{fontSize:10,color:"#A7C7BC",marginTop:4,textAlign:t?"right":"left",display:"flex",alignItems:"center",justifyContent:t?"flex-end":"flex-start",gap:4},children:[new Date(s.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),t&&(s.read_at?e.jsx(I,{size:12,color:"#4ADE80"}):e.jsx(N,{size:12}))]})]},s.id)})}),e.jsx("div",{style:{padding:16,borderTop:"1px solid #2E7D67",background:"rgba(11, 61, 46, 0.95)"},children:e.jsxs("form",{onSubmit:B,style:{display:"flex",gap:10},children:[e.jsx("input",{value:l,onChange:s=>y(s.target.value),placeholder:"Type a message...",style:{flex:1,padding:"12px 16px",borderRadius:24,border:"none",background:"rgba(255,255,255,0.1)",color:"white",outline:"none"}}),e.jsx("button",{type:"submit",disabled:x||!l.trim(),style:{background:"transparent",border:"none",padding:8,cursor:!l.trim()||x?"not-allowed":"pointer",opacity:x||!l.trim()?.5:1},children:x?e.jsx(C,{className:"animate-spin",size:24,color:"#4ADE80"}):e.jsx(U,{size:28,color:"#4ADE80"})})]})})]}):e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#A7C7BC"},children:[e.jsx(_,{size:64,style:{opacity:.2,marginBottom:20}}),e.jsx("p",{style:{fontSize:18},children:"Select a conversation to start chatting"})]})}),e.jsx("style",{children:`
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
            `})]})},ee=M(W);export{ee as default};
