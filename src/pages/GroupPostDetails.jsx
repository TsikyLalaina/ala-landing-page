import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, MessageCircle, Share2, MapPin, 
  Loader2, User, SendHorizontal, CornerDownRight, Flag, ThumbsUp, ThumbsDown
} from 'lucide-react';

const CommentItem = ({ comment, allComments, onReply, onFlag, depth = 0 }) => {
  const { t } = useTranslation();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  // Find children
  const children = allComments.filter(c => c.parent_id === comment.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReply(false);
    }
  };

  return (
    <div style={{ paddingLeft: depth * 20, marginTop: 16 }}>
      <div style={{ background: 'rgba(13, 77, 58, 0.4)', padding: 12, borderRadius: 12, border: '1px solid rgba(46, 125, 103, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {comment.author?.avatar_url ? (
              <img src={comment.author.avatar_url} style={{ width: 24, height: 24, borderRadius: '50%' }} alt="" />
            ) : (
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2E7D67', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <User size={12} color="#A7C7BC" />
              </div>
            )}
            <span style={{ fontSize: 13, fontWeight: 'bold', color: '#F2F1EE' }}>{comment.author?.name}</span>
            <span style={{ fontSize: 11, color: '#A7C7BC' }}>{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <button onClick={() => onFlag(comment.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Flag size={12} color="#A7C7BC" />
          </button>
        </div>
        
        <p style={{ color: '#D1D5DB', fontSize: 14, margin: '0 0 8px 0', lineHeight: 1.4 }}>{comment.content}</p>
        
        <div style={{ display: 'flex', gap: 16 }}>
           <button 
            onClick={() => setShowReply(!showReply)} 
            style={{ 
              background: 'none', border: 'none', color: '#4ADE80', 
              fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 
            }}
          >
            <MessageCircle size={12} /> {t('auth.discussion.reply')}
           </button>
        </div>

        {showReply && (
          <form onSubmit={handleSubmit} style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <input 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t('auth.discussion.nested_reply')}
              style={{
                flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid #2E7D67', 
                borderRadius: 8, padding: '4px 8px', color: 'white', fontSize: 13
              }}
            />
            <button type="submit" disabled={!replyContent.trim()} style={{ background: '#4ADE80', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer' }}>
              <SendHorizontal size={14} color="#0B3D2E" />
            </button>
          </form>
        )}
      </div>

      {children.map(child => (
        <CommentItem 
          key={child.id} 
          comment={child} 
          allComments={allComments} 
          onReply={onReply} 
          onFlag={onFlag}
          depth={depth + 1} 
        />
      ))}
    </div>
  );
};

const GroupPostDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [userVote, setUserVote] = useState(0); // -1, 0, 1
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  useEffect(() => {
    fetchPostDetails();
    
    // Realtime subscription for group comments
    const channel = supabase
      .channel('group_comments')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'group_comments', 
        filter: `post_id=eq.${id}` 
      }, (payload) => {
        fetchComments(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      // Fetch Post with Group Context
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          author:users!posts_user_id_fkey(id, name, avatar_url, sector, location),
          votes:votes(vote_value),
          group_comments!group_comments_post_id_fkey(count)
        `)
        .eq('id', id)
        .single();
      
      if (postError) throw postError;
      
      // Calculate votes
      const uVotes = postData.votes.filter(v => v.vote_value === 1).length;
      const dVotes = postData.votes.filter(v => v.vote_value === -1).length;
      const myVote = user ? postData.votes.find(v => v.user_id === user.id)?.vote_value || 0 : 0;

      setPost(postData);
      setUpvotes(uVotes);
      setDownvotes(dVotes);
      setUserVote(myVote);

      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error('Could not load discussion');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    const { data: commentsData, error: commentsError } = await supabase
        .from('group_comments')
        .select(`
          *,
          author:users!group_comments_user_id_fkey(id, name, avatar_url)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) console.error(commentsError);
      else setComments(commentsData || []);
  };

  const handleCreateComment = async (parentId = null, contentStr = newComment) => {
    if (!contentStr.trim()) return;
    
    if (!parentId) setSending(true);

    try {
      const { error } = await supabase.from('group_comments').insert({
        post_id: id,
        user_id: user.id,
        group_id: post.group_id, // Important for RLS
        content: contentStr,
        parent_id: parentId
      });

      if (error) throw error;
      
      if (!parentId) setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error('Failed to post comment');
    } finally {
      if (!parentId) setSending(false);
    }
  };

  const handleVote = async (value) => {
    if (!user) return;

    const previousVote = userVote;
    const previousUp = upvotes;
    const previousDown = downvotes;

    // Toggle logic: click same = remove (0)
    const newValue = previousVote === value ? 0 : value;

    // Optimistic Update
    setUserVote(newValue);
    if (previousVote === 1) setUpvotes(prev => prev - 1);
    if (previousVote === -1) setDownvotes(prev => prev - 1);
    if (newValue === 1) setUpvotes(prev => prev + 1);
    if (newValue === -1) setDownvotes(prev => prev + 1);

    try {
      if (newValue === 0) {
           await supabase.from('votes').delete().match({ post_id: id, user_id: user.id });
      } else {
           const { error } = await supabase.from('votes').upsert({
               group_id: post.group_id,
               post_id: id,
               user_id: user.id,
               vote_value: newValue
           }, { onConflict: 'post_id, user_id' });
           if (error) throw error;
      }
    } catch (err) {
      console.error(err);
      // Revert
      setUserVote(previousVote);
      setUpvotes(previousUp);
      setDownvotes(previousDown);
      toast.error("Failed to vote");
    }
  };

  const handleFlag = (commentId) => {
    console.log('Flagging comment:', commentId);
    toast.success('Flagged for moderation');
  };

  if (loading) {
     return (
       <div style={{ minHeight: '100vh', background: '#0B3D2E', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader2 style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
       </div>
     );
  }

  if (!post) return <div style={{ background: '#0B3D2E', minHeight: '100vh', color: 'white', padding: 20 }}>Discussion not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0B3D2E', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 10, 
        background: 'rgba(11, 61, 46, 0.95)', 
        backdropFilter: 'blur(10px)',
        padding: '10px 16px',
        borderBottom: '1px solid #2E7D67',
        display: 'flex', alignItems: 'center', gap: 16
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#F2F1EE', cursor: 'pointer' }}>
          <ArrowLeft />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', color: '#F2F1EE', margin: 0 }}>Group Discussion</h1>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
        {/* Main Post */}
        <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(46, 125, 103, 0.5)' }}>
           <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
             {post.author?.avatar_url ? (
                <img src={post.author.avatar_url} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} alt="" />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#2E7D67', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <User size={24} color="#A7C7BC" />
                </div>
              )}
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#F2F1EE', margin: 0 }}>{post.author?.name}</h2>
                <div style={{ fontSize: 12, color: '#A7C7BC', marginTop: 4 }}>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
           </div>

           <p style={{ color: '#F2F1EE', fontSize: 16, lineHeight: 1.6, marginBottom: 16, whiteSpace: 'pre-wrap' }}>{post.content}</p>

           {post.media_urls && post.media_urls.length > 0 && (
              <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {post.media_urls.map((url, i) => (
                    url.match(/\.(mp4|webm|ogg|mov|quicktime)$/i) ? 
                    <video key={i} src={url} controls style={{ width: '100%', borderRadius: 8 }} /> :
                    <img key={i} src={url} style={{ width: '100%', borderRadius: 8 }} alt="" />
                ))}
              </div>
           )}

           <div style={{ display: 'flex', gap: 16, color: '#A7C7BC' }}>
             <button 
               onClick={() => handleVote(1)}
               style={{ background: userVote === 1 ? 'rgba(74, 222, 128, 0.2)' : 'transparent', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: userVote === 1 ? '#4ADE80' : '#A7C7BC' }}
             >
               <ThumbsUp size={20} /> 
               <span style={{ fontSize: 14 }}>{upvotes}</span>
             </button>
             <button 
               onClick={() => handleVote(-1)}
               style={{ background: userVote === -1 ? 'rgba(239, 68, 68, 0.2)' : 'transparent', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: userVote === -1 ? '#EF4444' : '#A7C7BC' }}
             >
               <ThumbsDown size={20} /> 
               <span style={{ fontSize: 14 }}>{downvotes}</span>
             </button>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
               <MessageCircle size={20} /> <span style={{ fontSize: 14 }}>{comments.length}</span>
             </div>
           </div>
        </div>

        {/* Comments Section */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, color: '#F2F1EE', marginBottom: 16 }}>Comments ({comments.length})</h3>
          
          {comments.filter(c => !c.parent_id).length === 0 ? (
             <p style={{ color: '#A7C7BC', textAlign: 'center', padding: 20 }}>No comments yet.</p>
          ) : (
             comments.filter(c => !c.parent_id).map(comment => (
               <CommentItem 
                 key={comment.id} 
                 comment={comment} 
                 allComments={comments} 
                 onReply={(parentId, content) => handleCreateComment(parentId, content)}
                 onFlag={handleFlag}
               />
             ))
          )}
        </div>
      </div>

      {/* Comment Input Footer */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        background: '#0B3D2E', borderTop: '1px solid #2E7D67', 
        padding: '12px 16px', zIndex: 40 
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', gap: 12 }}>
           <input 
             value={newComment}
             onChange={(e) => setNewComment(e.target.value)}
             placeholder="Write a reply..."
             style={{ 
               flex: 1, 
               background: 'rgba(0,0,0,0.2)', 
               border: '1px solid #2E7D67', 
               borderRadius: 20, 
               padding: '10px 16px', 
               color: 'white', 
               outline: 'none' 
             }}
           />
           <button 
             onClick={() => handleCreateComment(null)}
             disabled={!newComment.trim() || sending}
             style={{ 
               background: 'transparent', 
               border: 'none', 
               padding: 8,
               cursor: !newComment.trim() || sending ? 'not-allowed' : 'pointer',
               opacity: !newComment.trim() || sending ? 0.5 : 1
             }}
           >
             {sending ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} color="#4ADE80" /> : <SendHorizontal size={28} color="#4ADE80" />}
           </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPostDetails;
