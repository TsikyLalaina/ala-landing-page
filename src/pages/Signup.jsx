import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2, MailCheck, ArrowRight, CheckCircle } from 'lucide-react';

// Validation helpers
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const Signup = () => {
  const { t } = useTranslation();
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Live validation
  useEffect(() => {
    if (emailTouched) {
      if (!email) {
        setEmailError(t('auth.validation.email_required'));
      } else if (!validateEmail(email)) {
        setEmailError(t('auth.validation.email_invalid'));
      } else {
        setEmailError('');
      }
    }
  }, [email, emailTouched, t]);

  useEffect(() => {
    if (passwordTouched) {
      if (!password) {
        setPasswordError(t('auth.validation.password_required'));
      } else if (!validatePassword(password)) {
        setPasswordError(t('auth.validation.password_min'));
      } else {
        setPasswordError('');
      }
    }
  }, [password, passwordTouched, t]);

  const isFormValid = validateEmail(email) && validatePassword(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    
    if (!isFormValid) return;
    
    setLoading(true);

    const { error: signUpError } = await signUp({ email, password });

    if (signUpError) {
      toast.error(signUpError.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };

  const inputBaseStyle = {
    width: '100%',
    background: '#1A5D4A',
    border: '1px solid #2E7D67',
    color: '#F2F1EE',
    padding: '14px 14px 14px 46px',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box'
  };

  const inputErrorStyle = {
    ...inputBaseStyle,
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)'
  };

  const inputValidStyle = {
    ...inputBaseStyle,
    borderColor: '#4ADE80'
  };

  const getInputStyle = (touched, error, value) => {
    if (!touched) return inputBaseStyle;
    if (error) return inputErrorStyle;
    if (value) return inputValidStyle;
    return inputBaseStyle;
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0B3D2E 0%, #0D4D3A 50%, #0B3D2E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: '100%',
            maxWidth: '420px',
            textAlign: 'center',
            background: 'rgba(13, 77, 58, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid #2E7D67',
            borderRadius: '24px',
            padding: '48px 32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px -10px rgba(74, 222, 128, 0.5)'
            }}
          >
            <MailCheck style={{ width: '40px', height: '40px', color: '#0B3D2E' }} />
          </motion.div>
          
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#F2F1EE', marginBottom: '12px' }}>
            {t('auth.check_email')}
          </h1>
          <p style={{ color: '#A7C7BC', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
            {t('auth.check_email_desc')}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link 
              to="/login" 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#4ADE80',
                color: '#0B3D2E',
                fontWeight: '600',
                padding: '16px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                boxShadow: '0 4px 15px -3px rgba(74, 222, 128, 0.4)'
              }}
            >
              {t('auth.login')}
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </Link>
            <button 
              onClick={() => setSubmitted(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A7C7BC',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px'
              }}
            >
              {t('auth.try_again')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0B3D2E 0%, #0D4D3A 50%, #0B3D2E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div style={{
          background: 'rgba(13, 77, 58, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #2E7D67',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 20px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px -10px rgba(74, 222, 128, 0.4)'
            }}>
              <Mail style={{ width: '28px', height: '28px', color: '#0B3D2E' }} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#F2F1EE', marginBottom: '8px' }}>
              {t('auth.create_account')}
            </h1>
            <p style={{ color: '#A7C7BC', fontSize: '15px' }}>{t('auth.join_community')}</p>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: '#F2F1EE',
              border: 'none',
              color: '#0B3D2E',
              fontWeight: '600',
              padding: '14px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '15px',
              marginBottom: '24px'
            }}
          >
            {googleLoading ? (
              <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('auth.continue_with_google')}
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: '#2E7D67' }} />
            <span style={{ color: '#6B9B8A', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('auth.or')}</span>
            <div style={{ flex: 1, height: '1px', background: '#2E7D67' }} />
          </div>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', color: '#D7D4CE', marginBottom: '8px' }}>
                {t('auth.email')}
                {emailTouched && !emailError && email && (
                  <CheckCircle style={{ width: '16px', height: '16px', color: '#4ADE80' }} />
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#6B9B8A' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="you@example.com"
                  style={getInputStyle(emailTouched, emailError, email)}
                />
              </div>
              {emailError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {emailError}
                </motion.p>
              )}
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', color: '#D7D4CE', marginBottom: '8px' }}>
                {t('auth.password')}
                {passwordTouched && !passwordError && password && (
                  <CheckCircle style={{ width: '16px', height: '16px', color: '#4ADE80' }} />
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#6B9B8A' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="••••••••"
                  style={getInputStyle(passwordTouched, passwordError, password)}
                />
              </div>
              {passwordError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {passwordError}
                </motion.p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: isFormValid ? '#4ADE80' : '#2E7D67',
                color: isFormValid ? '#0B3D2E' : '#6B9B8A',
                fontWeight: '600',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: loading || !isFormValid ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                marginTop: '4px',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: isFormValid ? '0 4px 15px -3px rgba(74, 222, 128, 0.4)' : 'none'
              }}
            >
              {loading ? (
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {t('auth.signup')}
                  <ArrowRight style={{ width: '20px', height: '20px' }} />
                </>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#A7C7BC', marginTop: '24px', fontSize: '15px' }}>
          {t('auth.already_have_account')}{' '}
          <Link to="/login" style={{ color: '#4ADE80', fontWeight: '600', textDecoration: 'none' }}>
            {t('auth.login')}
          </Link>
        </p>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #6B9B8A;
        }
        input:focus {
          border-color: #4ADE80 !important;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Signup;
