import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  Users, User, FileText, CheckCircle, ArrowLeft, Loader2
} from 'lucide-react';

const CreateGroup = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: formData.name,
          description: formData.description,
          is_public: formData.is_public,
          creator_id: user.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // 2. Add Creator as Admin Member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'admin',
          status: 'member'
        });

      if (memberError) throw memberError;

      toast.success(t('auth.groups.created_success') || 'Group created successfully!');
      navigate(`/group/${groupData.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error(error.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B3D2E', paddingBottom: 80, color: '#F2F1EE' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'transparent', border: 'none', color: '#A7C7BC', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 20
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           style={{
             background: 'rgba(13, 77, 58, 0.6)',
             backdropFilter: 'blur(10px)',
             border: '1px solid #2E7D67',
             borderRadius: 16,
             padding: 32,
           }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={28} color="#4ADE80" /> {t('auth.groups.create_title') || 'Create a New Group'}
          </h1>
          <p style={{ color: '#A7C7BC', marginBottom: 24 }}>Start a community for your project or interest.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#F2F1EE', marginBottom: 8, fontSize: 14 }}>
                Group Name
              </label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Clean Water Project"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid #2E7D67',
                  borderRadius: 8,
                  color: 'white',
                  fontSize: 16,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#F2F1EE', marginBottom: 8, fontSize: 14 }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose of this group..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid #2E7D67',
                  borderRadius: 8,
                  color: 'white',
                  fontSize: 16,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <input 
                 type="checkbox" 
                 id="is_public" 
                 checked={formData.is_public} 
                 onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                 style={{ width: 18, height: 18, accentColor: '#4ADE80' }}
               />
               <label htmlFor="is_public" style={{ color: '#F2F1EE', fontSize: 14, cursor: 'pointer' }}>
                 Public Group (Anyone can view and join)
               </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#4ADE80',
                color: '#0B3D2E',
                border: 'none',
                padding: '14px',
                borderRadius: 12,
                fontWeight: 'bold',
                fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 10
              }}
            >
              {loading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
              {t('auth.groups.submit_create') || 'Create Group'}
            </button> 
          </form>
        </motion.div>
      </div>
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CreateGroup;
