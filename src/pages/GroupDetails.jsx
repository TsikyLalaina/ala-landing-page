import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, UserMinus, PlusSquare, ArrowLeft, Loader2, ThumbsUp, ThumbsDown, Check, X, MessageCircle
} from 'lucide-react';

const GroupDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(true);
    const [joinLoading, setJoinLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchGroupDetails();
            fetchMembers();
            fetchGroupPosts();
        }
    }, [id]);

    const [status, setStatus] = useState(null); // null, 'member', 'admin', 'pending'
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (id) {
            fetchGroupDetails();
            fetchMembers();
            fetchGroupPosts();
        }
    }, [id]);

    useEffect(() => {
        if (user && members.length > 0) {
            const membership = members.find(m => m.user_id === user.id);
            if (membership) {
                setStatus(membership.status);
                setIsMember(['member', 'admin'].includes(membership.status));
                // Check role for admin privileges. Status must be active (member/admin).
                setIsAdmin(membership.role === 'admin' && ['member', 'admin'].includes(membership.status));
            } else {
                setStatus(null);
                setIsMember(false);
                setIsAdmin(false);
            }
        } else {
            setStatus(null);
            setIsMember(false);
            setIsAdmin(false);
        }
    }, [user, members]);

    const fetchGroupDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('groups')
                .select('*, creator:users!groups_creator_id_fkey(name, avatar_url)')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            setGroup(data);
        } catch (error) {
            console.error('Error fetching group:', error);
            toast.error('Could not load group details');
        } finally {
            setLoading(false);
        }
    };
    const fetchMembers = async () => {
        try {
            const { data, error } = await supabase
                .from('group_members')
                .select('*, user:users(id, name, avatar_url)')
                .eq('group_id', id);
            
            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const fetchGroupPosts = async () => {
        try {
            // Fetch posts with vote counts
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    author:users!posts_user_id_fkey(name, avatar_url),
                    votes:votes(vote_value),
                    group_comments!group_comments_post_id_fkey(count)
                `)
                .eq('group_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Process votes
            const postsWithVotes = data.map(post => {
                const upvotes = post.votes.filter(v => v.vote_value === 1).length;
                const downvotes = post.votes.filter(v => v.vote_value === -1).length;
                const userVote = user ? post.votes.find(v => v.user_id === user.id)?.vote_value : 0;
                return { ...post, upvotes, downvotes, userVote };
            });

            setPosts(postsWithVotes);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    const handleJoinToggle = async () => {
        if (!user) {
            toast.error('Please login to join groups');
            return;
        }
        setJoinLoading(true);
        try {
            if (status) {
                // Leave or Cancel Request
                const { error } = await supabase
                    .from('group_members')
                    .delete()
                    .eq('group_id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
                setMembers(prev => prev.filter(m => m.user_id !== user.id));
                toast.success(status === 'pending' ? 'Request cancelled' : 'Left group');
                setStatus(null);
            } else {
                // Join or Request
                const initialStatus = group.is_public ? 'member' : 'pending';
                
                const { error } = await supabase
                    .from('group_members')
                    .insert({ 
                        group_id: id, 
                        user_id: user.id,
                        status: initialStatus
                    });
                
                if (error) throw error;
                await fetchMembers(); 
                toast.success(initialStatus === 'pending' ? 'Request sent to admin' : 'Joined group!');
            }
        } catch (error) {
            console.error('Error toggling join:', error);
            toast.error('Action failed');
        } finally {
            setJoinLoading(false);
        }
    };

    const handleAcceptRequest = async (userId) => {
        try {
            const { error } = await supabase
                .from('group_members')
                .update({ status: 'member' })
                .eq('group_id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, status: 'member' } : m));
            toast.success('Member accepted!');
        } catch (error) {
            console.error('Error accepting member:', error);
            toast.error('Failed to accept member');
        }
    };

    const handleRejectRequest = async (userId) => {
        try {
            const { error } = await supabase
                .from('group_members')
                .delete()
                .eq('group_id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            setMembers(prev => prev.filter(m => m.user_id !== userId));
            toast.success('Request rejected');
        } catch (error) {
            console.error('Error rejecting member:', error);
            toast.error('Failed to reject member');
        }
    };

    const copyInviteLink = () => {
        const link = `https://ala-mg.com/group/${id}?invite=${group.invitation_code}`;
        navigator.clipboard.writeText(link);
        toast.success('Invite link copied!');
    };

    const handleVote = async (postId, value) => {
        if (!isMember) {
            toast.error('You must be a member to vote');
            return;
        }

        try {
            // Check if vote exists
            const postIndex = posts.findIndex(p => p.id === postId);
            const currentVote = posts[postIndex].userVote;

            // Optimistic update
            const newPosts = [...posts];
            const post = newPosts[postIndex];

            // Toggle logic: if clicking same value, remove vote (value 0). If diff, set value.
            const newValue = currentVote === value ? 0 : value;

            // Update counts
            if (currentVote === 1) post.upvotes--;
            if (currentVote === -1) post.downvotes--;
            if (newValue === 1) post.upvotes++;
            if (newValue === -1) post.downvotes++;
            
            post.userVote = newValue;
            setPosts(newPosts);

            // DB Update
            if (newValue === 0) {
                 await supabase.from('votes').delete().match({ post_id: postId, user_id: user.id });
            } else {
                 // Upsert
                 const { error } = await supabase.from('votes').upsert({
                     group_id: id,
                     post_id: postId,
                     user_id: user.id,
                     vote_value: newValue
                 }, { onConflict: 'post_id, user_id' });
                 if (error) throw error;
            }
        } catch (error) {
            console.error('Vote error:', error);
            toast.error('Failed to vote');
            fetchGroupPosts(); // Revert
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B3D2E' }}>
                <Loader2 style={{ color: '#4ADE80', width: 40, height: 40, animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!group) return <div style={{ padding: 40, color: 'white', background: '#0B3D2E', minHeight: '100vh' }}>Group not found</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', paddingBottom: 80, color: '#F2F1EE' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
                {/* Header */}
                <button onClick={() => navigate('/groups')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                    <ArrowLeft size={18} /> Back to Groups
                </button>

                {/* Admin: Pending Requests */}
                {isAdmin && members.some(m => m.status === 'pending') && (
                    <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #FBBF24', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                        <h3 style={{ color: '#FBBF24', fontSize: 18, fontWeight: 'bold', margin: '0 0 16px 0' }}>Pending Requests ({members.filter(m => m.status === 'pending').length})</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {members.filter(m => m.status === 'pending').map(request => (
                                <div key={request.user_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {request.user?.avatar_url ? (
                                            <img src={request.user.avatar_url} style={{ width: 40, height: 40, borderRadius: '50%' }} alt="" />
                                        ) : (
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2E7D67', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Users size={20} color="#A7C7BC" />
                                            </div>
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{request.user?.name || 'Unknown User'}</div>
                                            <div style={{ fontSize: 12, color: '#A7C7BC' }}>Requested {new Date(request.joined_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button 
                                            onClick={() => handleAcceptRequest(request.user_id)}
                                            style={{ background: '#4ADE80', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#0B3D2E' }}
                                            title="Accept"
                                        >
                                            <Check size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleRejectRequest(request.user_id)}
                                            style={{ background: '#EF4444', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'white' }}
                                            title="Reject"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ background: 'rgba(13, 77, 58, 0.6)', borderRadius: 16, padding: 32, border: '1px solid #2E7D67', marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>{group.name}</h1>
                            <p style={{ color: '#A7C7BC', fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>{group.description}</p>
                            <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#A7C7BC' }}>
                                <span>{group.is_public ? 'Public Group' : 'Private Group'}</span>
                                <span>Created by {group.creator?.name}</span>
                                <span>{members.length} Members</span>
                            </div>
                        </div>
                        {user && (
                            <div style={{ display: 'flex', gap: 10 }}>
                                {isMember && (
                                    <button
                                        onClick={copyInviteLink}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)', border: 'none', 
                                            padding: '10px 16px', borderRadius: 24, 
                                            color: '#A7C7BC', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            fontWeight: 'bold', fontSize: 14
                                        }}
                                    >
                                        Share Invite
                                    </button>
                                )}
                                <button
                                    onClick={user.id === group.creator_id ? undefined : handleJoinToggle}
                                    disabled={joinLoading || user.id === group.creator_id}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '10px 24px', borderRadius: 24,
                                        background: user.id === group.creator_id ? 'rgba(74, 222, 128, 0.1)' : (status ? 'transparent' : '#4ADE80'),
                                        color: user.id === group.creator_id ? '#4ADE80' : (status ? (status === 'pending' ? '#FBBF24' : '#F2F1EE') : '#0B3D2E'),
                                        border: user.id === group.creator_id ? '1px solid #4ADE80' : (status ? (status === 'pending' ? '1px solid #FBBF24' : '1px solid #EF4444') : 'none'),
                                        fontWeight: 'bold', 
                                        cursor: (user.id === group.creator_id || joinLoading) ? 'default' : 'pointer'
                                    }}
                                >
                                    {status === 'pending' ? (
                                        <span>Request Sent</span>
                                    ) : isMember ? (
                                        user.id === group.creator_id ? (
                                            <span>Owner</span>
                                        ) : (
                                            <><UserMinus size={18} /> Leave</>
                                        )
                                    ) : (
                                        <><UserPlus size={18} /> {group.is_public ? 'Join' : 'Request to Join'}</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isMember && (
                    <div style={{ marginBottom: 24 }}>
                        <button 
                            onClick={() => navigate('/new-post', { state: { groupId: group.id, groupName: group.name } })}
                            style={{ 
                                width: '100%', 
                                background: 'rgba(74, 222, 128, 0.1)', 
                                border: '1px dashed #4ADE80', 
                                borderRadius: 12, 
                                padding: 20, 
                                color: '#4ADE80', 
                                fontSize: 16, fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                cursor: 'pointer'
                            }}
                        >
                            <PlusSquare /> Propose a Plan or Post Update
                        </button>
                    </div>
                )}

                <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Community Plans & Discussions</h2>
                
                {posts.length === 0 ? (
                    <p style={{ color: '#A7C7BC', fontStyle: 'italic' }}>No posts yet. Be the first to start a discussion!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {posts.map(post => (
                            <div key={post.id} style={{ background: 'rgba(13, 77, 58, 0.4)', padding: 20, borderRadius: 12, border: '1px solid rgba(46, 125, 103, 0.4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {post.author?.avatar_url && <img src={post.author.avatar_url} style={{ width: 32, height: 32, borderRadius: '50%' }} alt="" />}
                                        <span style={{ fontWeight: 'bold' }}>{post.author?.name}</span>
                                        <span style={{ fontSize: 12, color: '#A7C7BC' }}>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 16 }}>{post.content}</p>
                                
                                {/* Voting and Comment Actions */}
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button 
                                            onClick={() => handleVote(post.id, 1)}
                                            style={{ 
                                                background: post.userVote === 1 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                                                border: 'none', borderRadius: 8, padding: '6px 12px',
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                color: post.userVote === 1 ? '#4ADE80' : '#A7C7BC', cursor: 'pointer' 
                                            }}
                                        >
                                            <ThumbsUp size={16} /> {post.upvotes}
                                        </button>
                                        <button 
                                            onClick={() => handleVote(post.id, -1)}
                                            style={{ 
                                                background: post.userVote === -1 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                                                border: 'none', borderRadius: 8, padding: '6px 12px',
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                color: post.userVote === -1 ? '#EF4444' : '#A7C7BC', cursor: 'pointer' 
                                            }}
                                        >
                                            <ThumbsDown size={16} /> {post.downvotes}
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={() => navigate(`/group-post/${post.id}`)}
                                        style={{ 
                                            background: 'transparent', 
                                            border: 'none', 
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            color: '#A7C7BC', cursor: 'pointer',
                                            padding: '6px 12px'
                                        }}
                                    >
                                        <MessageCircle size={18} />
                                        <span style={{ fontSize: 14 }}>{post.group_comments?.[0]?.count || 0} Comments</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupDetails;
