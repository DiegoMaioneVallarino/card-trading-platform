import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { useMessagingStore } from "../features/messaging.store";
import { demoTraders } from "../features/trading/trading.store";
import "./socialPages.css";

export function MessagesPage() {
 const { threadId } = useParams<{ threadId: string }>();
 const navigate = useNavigate();
 const threads = useMessagingStore(s => s.threads);
 const messages = useMessagingStore(s => s.messages);
 const read = useMessagingStore(s => s.readThreadIds);
 const openThread = useMessagingStore(s => s.openThread);
 const send = useMessagingStore(s => s.sendMessage);
 const markRead = useMessagingStore(s => s.markThreadRead);
 const [draft, setDraft] = useState("");
 const active = threads.find(t => t.id === threadId) ?? (!threadId ? threads[0] : undefined);
 const chat = useMemo(() => messages.filter(m => m.threadId === active?.id), [messages, active?.id]);
 useEffect(() => { if (active && chat.some(m => m.author === "them")) markRead(active.id); }, [active?.id, chat.length, markRead]);
 function submit(e: FormEvent) { e.preventDefault(); if (!active || !draft.trim()) return; send(active.id, draft); setDraft(""); }
 return <main className="social-page"><div className="social-heading"><p>COLLECTOR COMMUNITY · LOCAL DEMO</p><h1>Messages<span>.</span></h1><div>Conversations saved in this browser. No real messages are delivered.</div></div>
 <div className="chat-layout"><aside className="chat-sidebar"><div className="social-section-title">Conversations</div>
 {threads.slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).map(t => { const last = messages.filter(m=>m.threadId===t.id).at(-1); const unread = messages.some(m=>m.threadId===t.id && m.author==="them") && messages.filter(m=>m.threadId===t.id && m.author==="them").at(-1)?.id !== read[t.id]; return <Link key={t.id} className={`chat-contact ${active?.id===t.id?"selected":""}`} to={`/messages/${t.id}`}><div className="chat-avatar">{t.participantName.charAt(0)}</div><div><strong>{t.participantName}</strong><small>{last?.body ?? t.context ?? "New conversation"}</small></div>{unread && <span className="social-dot"/>}</Link>; })}
 <div className="chat-demo-people"><div className="social-section-title">Start a demo conversation</div>{demoTraders.map(p=><button key={p.id} onClick={()=>navigate(`/messages/${openThread(p.id,p.name,"Trading Center")}`)}>{p.name}</button>)}</div></aside>
 <section className="chat-main">{active ? <><header className="chat-top"><div className="chat-avatar">{active.participantName.charAt(0)}</div><div><strong>{active.participantName}</strong><small>{active.context || "Collector conversation"}</small></div></header><div className="chat-messages">{chat.length ? chat.map(m=><div key={m.id} className={`chat-bubble ${m.author==="me"?"mine":"theirs"}`}><p>{m.body}</p><time>{new Date(m.createdAt).toLocaleString()}</time></div>) : <div className="social-empty"><MessageCircle/><h3>Start the conversation</h3><p>Write your first message to this demo contact.</p></div>}</div><form className="chat-compose" onSubmit={submit}><label className="sr-only" htmlFor="chat-input">Message</label><input id="chat-input" maxLength={2000} placeholder="Write a message..." value={draft} onChange={e=>setDraft(e.target.value)}/><button type="submit" disabled={!draft.trim()} aria-label="Send demo message"><Send size={18}/></button></form></> : <div className="social-empty"><ArrowLeft/><h3>Conversation not found</h3><p>Select a conversation from the left panel.</p><Link to="/messages">Back to inbox</Link></div>}</section></div></main>;
}
