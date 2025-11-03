import { useTranslation } from 'react-i18next'
import usePWAInstall from '../hooks/usePWAInstall'

export default function Footer() {
  const { t } = useTranslation()
  const { canInstall, promptInstall } = usePWAInstall()
  return (
    <footer id="footer" style={{padding:'36px 20px',maxWidth:1100,margin:'0 auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:16,background:'#0E3F31',border:'1px solid #1E5A49',borderRadius:14,padding:18,color:'#EAE7E2'}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontWeight:800}}>Ala</div>
          <div style={{display:'flex',gap:12}}>
            <a href="mailto:invest@ala.mg?subject=Investor%20Deck%20Request" style={{color:'#C9A66B',textDecoration:'none'}}>{t('footer.request_deck')}</a>
            <a href="mailto:invest@ala.mg" style={{color:'#EAE7E2',textDecoration:'none'}}>{t('footer.email_label')}: {t('footer.email_value')}</a>
            {canInstall && (
              <button onClick={() => promptInstall()} style={{background:'#C9A66B',color:'#0B3D2E',border:'1px solid #C9A66B',padding:'8px 12px',borderRadius:8,fontWeight:700}}>{t('nav.install')}</button>
            )}
          </div>
        </div>
        <div style={{color:'#A7A39B',fontSize:12}}>{t('footer.rights')}</div>
      </div>
    </footer>
  )
}
