import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Send, Search, MoreVertical, 
    MessageSquare, User, Loader2, Check, CheckCheck
} from 'lucide-react';

const Messages = () => {
    const { userId } = useParams(); // Selected user to chat with
    const { user } = useAuth();
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [activeUser, setActiveUser] = useState(null); // The user object we are chatting with

    // 1. Fetch Conversations List
    useEffect(() => {
        fetchConversations();
        
        // Subscribe to all incoming messages to update list
        const sub = supabase
            .channel('global-messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, 
                payload => {
                    fetchConversations(); // Refresh list on new message
                    if (userId && payload.new.sender_id === userId) {
                        setMessages(prev => [...prev, payload.new]);
                    }
                }
            )
            .subscribe();
            
        return () => supabase.removeChannel(sub);
    }, [user.id]);

    // 2. If userId param exists, load that chat
    useEffect(() => {
        if (userId) {
            loadChat(userId);
        } else {
            setActiveUser(null);
            setMessages([]);
        }
    }, [userId]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            // Get all messages where I am sender or receiver
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:sender_id(id, name, avatar_url),
                    receiver:receiver_id(id, name, avatar_url)
                `)
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Group by other user
            const convMap = new Map();
            data.forEach(msg => {
                const other = msg.sender_id === user.id ? msg.receiver : msg.sender;
                if (!convMap.has(other.id)) {
                    convMap.set(other.id, {
                        user: other,
                        lastMessage: msg,
                        hasUnread: msg.receiver_id === user.id && !msg.read_at
                    });
                }
            });
            setConversations(Array.from(convMap.values()));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const loadChat = async (targetId) => {
        // Get user details
        if (!activeUser || activeUser.id !== targetId) {
             const { data: userData } = await supabase.from('users').select('*').eq('id', targetId).single();
             setActiveUser(userData);
        }

        // Get messages
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${user.id})`)
            .order('created_at', { ascending: true });

        if (!error) setMessages(data);

        // Mark as read
        await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('sender_id', targetId)
            .eq('receiver_id', user.id)
            .is('read_at', null);
            
        fetchConversations(); // Update unread status in list
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !userId) return;

        setSending(true);
        try {
            const { data, error } = await supabase.from('messages').insert({
                sender_id: user.id,
                receiver_id: userId,
                content: newMessage.trim()
            }).select().single();

            if (error) throw error;

            setMessages(prev => [...prev, data]);
            setNewMessage('');
            fetchConversations(); // Update list order
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    // Mobile View Control
    // On mobile: 
    // - if !userId: show sidebar (list), hide chat
    // - if userId: hide sidebar, show chat
    // On desktop:
    // - show both (sidebar fixed width, chat flex 1)

    const listStyle = { 
        display: 'flex', flexDirection: 'column', 
        background: 'rgba(11, 61, 46, 0.95)',
        borderRight: '1px solid #2E7D67',
        height: '100%'
    };

    return (
        <div style={{ height: '100vh', display: 'flex', background: '#0B3D2E', color: '#F2F1EE', overflow: 'hidden' }}>
            
            {/* Sidebar / List */}
            <div 
                className={`sidebar-container ${userId ? 'hidden-mobile' : ''}`}
                style={listStyle}
            >
                {/* Header */}
                <div style={{ padding: 16, borderBottom: '1px solid #2E7D67', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>Messages</h1>
                    <button onClick={() => navigate('/feed')} style={{ background: 'none', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {/* Search */}
                <div style={{ padding: 12 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#A7C7BC' }} />
                        <input placeholder="Search conversations..." style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                    </div>
                </div>

                {/* List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: 20, textAlign: 'center' }}><Loader2 className="animate-spin" /></div>
                    ) : conversations.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#A7C7BC' }}>
                            <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: 10 }} />
                            <p>No messages yet.</p>
                        </div>
                    ) : (
                        conversations.map(c => (
                            <div 
                                key={c.user.id} 
                                onClick={() => navigate(`/messages/${c.user.id}`)}
                                style={{ 
                                    padding: 16, display: 'flex', gap: 12, cursor: 'pointer',
                                    background: userId === c.user.id ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                                    borderLeft: userId === c.user.id ? '3px solid #4ADE80' : '3px solid transparent'
                                }}
                            >
                                {c.user.avatar_url ? (
                                    <img src={c.user.avatar_url} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#2E7D67', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User color="#A7C7BC" />
                                    </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 'bold', color: c.hasUnread ? 'white' : '#F2F1EE' }}>{c.user.name}</span>
                                        <span style={{ fontSize: 11, color: '#A7C7BC' }}>{new Date(c.lastMessage.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 13, color: c.hasUnread ? '#4ADE80' : '#A7C7BC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: c.hasUnread ? 'bold' : 'normal' }}>
                                        {c.lastMessage.sender_id === user.id ? 'You: ' : ''}{c.lastMessage.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div 
                className={`chat-container ${!userId ? 'hidden-mobile' : ''}`}
                style={{ 
                    flex: 1, display: 'flex', flexDirection: 'column', 
                    background: '#0B3D2E'
                }}
            >
                {userId ? (
                    <>
                        {/* Chat Header */}
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid #2E7D67', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(11, 61, 46, 0.95)' }}>
                            <button onClick={() => navigate('/messages')} className="mobile-only" style={{ background: 'none', border: 'none', color: '#A7C7BC', cursor: 'pointer', marginRight: 4, display: 'flex' }}>
                                <ArrowLeft size={20} />
                            </button>
                            {activeUser && (
                                <>
                                    {activeUser.avatar_url ? (
                                        <img src={activeUser.avatar_url} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2E7D67', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={18} color="#A7C7BC" />
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{activeUser.name}</div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Messages Feed */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }} ref={scrollRef}>
                            {messages.map((msg, i) => {
                                const isMe = msg.sender_id === user.id;
                                return (
                                    <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                        <div style={{ 
                                            background: isMe ? '#4ADE80' : 'rgba(255,255,255,0.1)', 
                                            color: isMe ? '#0B3D2E' : '#F2F1EE',
                                            padding: '10px 14px', borderRadius: 16,
                                            borderBottomRightRadius: isMe ? 4 : 16,
                                            borderTopLeftRadius: isMe ? 16 : 4
                                        }}>
                                            {msg.content}
                                        </div>
                                        <div style={{ fontSize: 10, color: '#A7C7BC', marginTop: 4, textAlign: isMe ? 'right' : 'left', display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 4 }}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {isMe && (msg.read_at ? <CheckCheck size={12} color="#4ADE80" /> : <Check size={12} />)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: 16, borderTop: '1px solid #2E7D67', background: 'rgba(11, 61, 46, 0.95)' }}>
                            <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
                                <input 
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    style={{ flex: 1, padding: '12px 16px', borderRadius: 24, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                                />
                                <button 
                                    type="submit" 
                                    disabled={sending || !newMessage.trim()} 
                                    style={{ 
                                        background: 'transparent', 
                                        border: 'none', 
                                        padding: 8,
                                        cursor: !newMessage.trim() || sending ? 'not-allowed' : 'pointer',
                                        opacity: sending || !newMessage.trim() ? 0.5 : 1
                                    }}
                                >
                                    {sending ? <Loader2 className="animate-spin" size={24} color="#4ADE80" /> : <Send size={28} color="#4ADE80" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A7C7BC' }}>
                        <MessageSquare size={64} style={{ opacity: 0.2, marginBottom: 20 }} />
                        <p style={{ fontSize: 18 }}>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            <style>{`
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
            `}</style>
        </div>
    );
};

export default Messages;
