import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  Users, PlusSquare, Search, Loader2, User, ArrowRight
} from 'lucide-react';

const Groups = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          creator:users!groups_creator_id_fkey(name, avatar_url),
          members:group_members(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0B3D2E', paddingBottom: 80, color: '#F2F1EE' }}>
      {/* Header */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 10, 
        background: 'rgba(11, 61, 46, 0.95)', 
        backdropFilter: 'blur(10px)',
        padding: '16px 20px',
        borderBottom: '1px solid #2E7D67',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users color="#4ADE80" /> {t('auth.groups.title') || 'Groups'}
        </h1>
        {user && (
          <Link 
            to="/create-group"
            style={{ 
              background: '#4ADE80', color: '#0B3D2E', 
              padding: '8px 16px', borderRadius: 20, 
              textDecoration: 'none', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14
            }}
          >
            <PlusSquare size={18} /> {t('auth.groups.create') || 'Create Group'}
          </Link>
        )}
      </div>

      <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 20px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <Search size={20} color="#A7C7BC" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('auth.groups.search_placeholder') || "Search for groups..."}
            style={{ 
              width: '100%', 
              background: 'rgba(13, 77, 58, 0.6)', 
              border: '1px solid #2E7D67', 
              borderRadius: 12, 
              padding: '12px 12px 12px 44px', 
              color: 'white', 
              fontSize: 16,
              outline: 'none'
            }}
          />
        </div>

        {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
             <Loader2 style={{ color: '#4ADE80', width: 32, height: 32, animation: 'spin 1s linear infinite' }} />
             <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
           </div>
        ) : filteredGroups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#A7C7BC', background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16 }}>
            <Users size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
            <p>{t('auth.groups.no_groups') || 'No groups found. Create one!'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredGroups.map(group => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(13, 77, 58, 0.6)',
                  border: '1px solid #2E7D67',
                  borderRadius: 16,
                  padding: 20,
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.01, borderColor: '#4ADE80' }}
                onClick={() => navigate(`/group/${group.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, color: '#F2F1EE' }}>{group.name}</h3>
                  <span style={{ 
                    fontSize: 12, background: group.is_public ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                    color: group.is_public ? '#4ADE80' : '#EF4444', 
                    padding: '2px 8px', borderRadius: 10 
                  }}>
                    {group.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
                
                <p style={{ color: '#A7C7BC', fontSize: 14, margin: '0 0 16px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {group.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(46, 125, 103, 0.3)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#A7C7BC' }}>
                    <Users size={16} />
                    <span>{group.members && group.members[0]?.count || 0} Members</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#A7C7BC' }}>Created by {group.creator?.name || 'Unknown'}</span>
                    {group.creator?.avatar_url && (
                      <img src={group.creator.avatar_url} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
