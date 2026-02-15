import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, MessageCircle, Share2, MapPin, 
  Loader2, User, SendHorizontal, CornerDownRight, Flag
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

const PostDetails = () => {
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
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchPostDetails();
    
    // Realtime subscription
    const channel = supabase
      .channel('comments')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'comments', 
        filter: `post_id=eq.${id}` 
      }, (payload) => {
        // Fetch the new comment with author details ideally, 
        // simplified here by re-fetching or optimistic update.
        // For accurate author info, re-fetching is safer.
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
      // Fetch Post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          author:users!posts_user_id_fkey(id, name, avatar_url, sector, location),
          likes(count),
          comments!comments_post_id_fkey(count)
        `)
        .eq('id', id)
        .single();
      
      if (postError) throw postError;
      setPost(postData);
      setLikeCount(postData.likes[0]?.count || 0);

      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('user_id')
          .eq('post_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setHasLiked(!!likeData);
      }

      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error('Could not load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          author:users!comments_user_id_fkey(id, name, avatar_url)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) console.error(commentsError);
      else setComments(commentsData || []);
  };

  const handleCreateComment = async (parentId = null, contentStr = newComment) => {
    if (!contentStr.trim()) return;
    
    // For top-level form, use loading state
    if (!parentId) setSending(true);

    try {
      const { error } = await supabase.from('comments').insert({
        post_id: id,
        user_id: user.id,
        content: contentStr,
        parent_id: parentId
      });

      if (error) throw error;
      
      if (!parentId) setNewComment('');
      // Update comments list immediately
      await fetchComments();
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      if (!parentId) setSending(false);
    }
  };

  const handleLike = async () => {
    const previousLiked = hasLiked;
    const previousCount = likeCount;

    setHasLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      if (previousLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ post_id: id, user_id: user.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: id, user_id: user.id });
        if (error) throw error;
      }
    } catch (err) {
      console.error(err);
      setHasLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error("Failed to update like");
    }
  };

  const handleFlag = (commentId) => {
    // Mock flag
    console.log('Flagging comment:', commentId);
    toast.success('Content flagged for moderation');
  };

  if (loading) {
     return (
       <div style={{ minHeight: '100vh', background: '#0B3D2E', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader2 style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
       </div>
     );
  }

  if (!post) return <div style={{ background: '#0B3D2E', minHeight: '100vh', color: 'white', padding: 20 }}>Post not found</div>;

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
        <h1 style={{ fontSize: 18, fontWeight: 'bold', color: '#F2F1EE', margin: 0 }}>Discussion</h1>
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
                  {post.author?.sector && <span style={{ marginRight: 8 }}>{post.author.sector}</span>}
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
           </div>

           <p style={{ color: '#F2F1EE', fontSize: 16, lineHeight: 1.6, marginBottom: 16, whiteSpace: 'pre-wrap' }}>{post.content}</p>

           {post.media_urls && post.media_urls.length > 0 && (
              <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 4 }} className="media-container">
                {post.media_urls.map((url, i) => {
                   const isVideo = url.match(/\.(mp4|webm|ogg|mov|quicktime)$/i);
                   const MediaTag = isVideo ? 'video' : 'img';
                   return (
                     <MediaTag 
                        key={i} 
                        src={url} 
                        controls={isVideo} 
                        className="post-media-item"
                        alt={!isVideo ? "Post content" : undefined}
                     />
                   );
                })}
              </div>
           )}
           <style>{`
             .post-media-item {
               width: 100%;
               height: auto;
               max-height: 600px;
               object-fit: cover;
               border-radius: 8px;
             }
             @media (min-width: 768px) {
               .post-media-item {
                 max-height: 300px; /* Reduced height for PC */
                 width: auto;
                 max-width: 100%;
                 margin: 0 auto;
                 display: block;
                 object-fit: contain;
                 background: rgba(0,0,0,0.2);
               }
             }
           `}</style>

           <div style={{ display: 'flex', gap: 24, color: '#A7C7BC' }}>
             <button 
               onClick={handleLike}
               style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: hasLiked ? '#EF4444' : '#A7C7BC' }}
             >
               <Heart size={20} fill={hasLiked ? "#EF4444" : "none"} /> 
               <span style={{ fontSize: 14 }}>{likeCount}</span>
             </button>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
               <MessageCircle size={20} /> <span style={{ fontSize: 14 }}>{comments.length}</span>
             </div>
             <Share2 size={20} style={{ marginLeft: 'auto' }} />
           </div>
        </div>

        {/* Comments Section */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, color: '#F2F1EE', marginBottom: 16 }}>{t('auth.discussion.load_comments')} ({comments.length})</h3>
          
          {comments.filter(c => !c.parent_id).length === 0 ? (
             <p style={{ color: '#A7C7BC', textAlign: 'center', padding: 20 }}>{t('auth.discussion.no_comments')}</p>
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
             placeholder={t('auth.discussion.write_reply')}
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

export default PostDetails;
