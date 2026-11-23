import { Link } from "react-router-dom";
import { Bell, ArrowLeftRight, MessageCircle, CheckCheck } from "lucide-react";
import { useMemo } from "react";
import { useTradingStore } from "../features/trading/trading.store";
import { useMessagingStore } from "../features/messaging.store";
import { useNotificationsStore } from "../features/notifications.store";
import "./socialPages.css";
export function NotificationsPage() {
 const offers = useTradingStore(s=>s.offers);
 const threads = useMessagingStore(s=>s.threads);
 const messages = useMessagingStore(s=>s.messages);
 const readIds = useNotificationsStore(s=>s.readIds);
 const markRead = useNotificationsStore(s=>s.markRead);
 const markAllRead = useNotificationsStore(s=>s.markAllRead);
 const notices = useMemo(()=>[
  ...offers.map(o=>({id:`trade-${o.id}-${o.status}-${o.revision}`,type:"trade" as const,title:`${o.direction==="incoming"?"Incoming":"Sent"} trade · ${o.partnerName}`,description:`Offer status: ${o.status}${o.revision?` · Revision ${o.revision}`:""}`,time:o.updatedAt,url:"/trading"})),
  ...messages.filter(m=>m.author==="them").map(m=>({id:`message-${m.id}`,type:"message" as const,title:`Message from ${threads.find(t=>t.id===m.threadId)?.participantName ?? "Collector"}`,description:m.body,time:m.createdAt,url:`/messages/${m.threadId}`})),
 ].sort((a,b)=>b.time.localeCompare(a.time)),[offers,threads,messages]);
 const unread = notices.filter(n=>!readIds.includes(n.id)).length;
 return <main className="social-page"><div className="social-heading"><p>YOUR ACTIVITY · LOCAL DEMO</p><h1>Notifications<span>.</span></h1><div>Trade updates and incoming demo messages, stored on this device.</div></div><div className="notice-toolbar"><strong>{unread} unread</strong><button onClick={()=>markAllRead(notices.map(n=>n.id))} disabled={!unread}><CheckCheck size={17}/> Mark all as read</button></div><div className="notice-list">{notices.length ? notices.map(n=><Link onClick={()=>markRead(n.id)} key={n.id} to={n.url} className={`notice-item ${readIds.includes(n.id)?"":"unread"}`}><div className="notice-icon">{n.type==="trade"?<ArrowLeftRight size={19}/>:<MessageCircle size={19}/>}</div><div><strong>{n.title}</strong><p>{n.description}</p><small>{new Date(n.time).toLocaleString()}</small></div>{!readIds.includes(n.id)&&<span className="social-dot"/>}</Link>) : <div className="social-empty"><Bell/><h3>No activity yet</h3><p>Your demo messages and trades will appear here.</p></div>}</div></main>;
}
