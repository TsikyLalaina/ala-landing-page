import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import LanguageToggle from './LanguageToggle'
import usePWAInstall from '../hooks/usePWAInstall'

export default function Header() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const { canInstall, promptInstall } = usePWAInstall()
  return (
    <header style={{position:'sticky',top:0,zIndex:30,backdropFilter:'saturate(140%) blur(6px)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'10px 16px',maxWidth:1100,margin:'0 auto'}}>
        <a href="#" style={{display:'flex',alignItems:'center',textDecoration:'none',overflow:'visible',lineHeight:0}}>
          <span
            aria-label="Ala"
            role="img"
            style={{
              width: 28,
              height: 28,
              display: 'block',
              background: '#EAE7E2',
              WebkitMask: 'url(/icons/ala.svg) no-repeat center / contain',
              mask: 'url(/icons/ala.svg) no-repeat center / contain',
              transform: 'scale(2.4)',
              transformOrigin: 'center',
            }}
          />
        </a>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <LanguageToggle />
          {user ? (
            <Link 
              to="/feed" 
              style={{background:'#4ADE80',color:'#0B3D2E',border:'none',padding:'8px 16px',borderRadius:8,fontWeight:700,textDecoration:'none'}}
            >
              Go to Feed
            </Link>
          ) : (
            <Link 
              to="/login" 
              style={{background:'transparent',color:'#EAE7E2',border:'1px solid #2E5E4E',padding:'8px 16px',borderRadius:8,fontWeight:700,textDecoration:'none'}}
            >
              {t('auth.login')}
            </Link>
          )}

          {canInstall && (
            <button onClick={() => promptInstall()} style={{background:'#C9A66B',color:'#0B3D2E',border:'1px solid #C9A66B',padding:'8px 12px',borderRadius:8,fontWeight:700}}>
              {t('nav.install')}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
