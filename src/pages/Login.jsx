import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (emailTouched) {
      if (!email) setEmailError(t('auth.validation.email_required'));
      else if (!validateEmail(email)) setEmailError(t('auth.validation.email_invalid'));
      else setEmailError('');
    }
  }, [email, emailTouched, t]);

  useEffect(() => {
    if (passwordTouched && !password) setPasswordError(t('auth.validation.password_required'));
    else setPasswordError('');
  }, [password, passwordTouched, t]);

  const isFormValid = validateEmail(email) && password.length > 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!isFormValid) return;
    setLoading(true);
    const { error: signInError } = await signIn({ email, password });
    if (signInError) { toast.error(signInError.message); setLoading(false); }
  };

  const inputBase = { width: '100%', background: '#1A5D4A', border: '1px solid #2E7D67', color: '#F2F1EE', padding: '14px 14px 14px 46px', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
  const getStyle = (touched, error, value) => touched ? (error ? { ...inputBase, borderColor: '#ef4444' } : value ? { ...inputBase, borderColor: '#4ADE80' } : inputBase) : inputBase;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0B3D2E 0%, #0D4D3A 50%, #0B3D2E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter', sans-serif" }}>
      <SEOHead
        title="Sign In — Ala | Community Platform for Madagascar"
        description="Sign in to your Ala account to access the community feed, marketplace, resource hub, and more. Join the regenerative movement."
        path="/login"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ background: 'rgba(13, 77, 58, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid #2E7D67', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '56px', height: '56px', margin: '0 auto 20px', borderRadius: '16px', background: 'linear-gradient(135deg, #4ADE80, #22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogIn style={{ width: '28px', height: '28px', color: '#0B3D2E' }} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#F2F1EE', marginBottom: '8px' }}>{t('auth.welcome_back')}</h1>
            <p style={{ color: '#A7C7BC', fontSize: '15px' }}>{t('auth.login_subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', color: '#D7D4CE', marginBottom: '8px' }}>
                {t('auth.email')} {emailTouched && !emailError && email && <CheckCircle style={{ width: '16px', height: '16px', color: '#4ADE80' }} />}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#6B9B8A' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)} placeholder="you@example.com" style={getStyle(emailTouched, emailError, email)} />
              </div>
              {emailError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle style={{ width: '14px', height: '14px' }} />{emailError}</motion.p>}
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', color: '#D7D4CE', marginBottom: '8px' }}>
                {t('auth.password')} {passwordTouched && !passwordError && password && <CheckCircle style={{ width: '16px', height: '16px', color: '#4ADE80' }} />}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#6B9B8A' }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setPasswordTouched(true)} placeholder="••••••••" style={getStyle(passwordTouched, passwordError, password)} />
              </div>
              {passwordError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle style={{ width: '14px', height: '14px' }} />{passwordError}</motion.p>}
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: isFormValid ? '#4ADE80' : '#2E7D67', color: isFormValid ? '#0B3D2E' : '#6B9B8A', fontWeight: '600', padding: '16px 24px', borderRadius: '12px', border: 'none', cursor: loading || !isFormValid ? 'not-allowed' : 'pointer', fontSize: '16px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
              {loading ? <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> : <>{t('auth.login')}<ArrowRight style={{ width: '20px', height: '20px' }} /></>}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: '#A7C7BC', marginTop: '24px', fontSize: '15px' }}>{t('auth.dont_have_account')} <Link to="/signup" style={{ color: '#4ADE80', fontWeight: '600', textDecoration: 'none' }}>{t('auth.signup')}</Link></p>
      </motion.div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } input::placeholder { color: #6B9B8A; } input:focus { border-color: #4ADE80 !important; box-shadow: 0 0 0 3px rgba(74,222,128,0.15) !important; }`}</style>
    </div>
  );
};

export default Login;
