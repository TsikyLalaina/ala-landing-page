import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import usePWAInstall from '../hooks/usePWAInstall'

export default function Header() {
  const { t } = useTranslation()
  const { canInstall, promptInstall } = usePWAInstall()
  return (
    <header style={{position:'sticky',top:0,zIndex:30,backdropFilter:'saturate(140%) blur(6px)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'10px 16px',maxWidth:1100,margin:'0 auto'}}>
        <a href="#" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:6,background:'#2E5E4E'}} />
          <div style={{color:'#EAE7E2',fontWeight:800,letterSpacing:0.4}}>Ala</div>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <LanguageToggle />
          {canInstall ? (
            <button onClick={() => promptInstall()} style={{background:'#C9A66B',color:'#0B3D2E',border:'1px solid #C9A66B',padding:'8px 12px',borderRadius:8,fontWeight:700}}>
              {t('nav.install')}
            </button>
          ) : (
            <a href="mailto:invest@ala.mg?subject=Ala%20Investment%20Interest" style={{background:'transparent',color:'#EAE7E2',border:'1px solid #2E5E4E',padding:'8px 12px',borderRadius:8,fontWeight:700,textDecoration:'none'}}>{t('nav.invest')}</a>
          )}
        </div>
      </div>
    </header>
  )
}
