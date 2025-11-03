import { useTranslation } from 'react-i18next'

export default function AnnouncementBar() {
  const { t } = useTranslation()
  return (
    <div style={{background:'#0F4D3A',color:'#EAE7E2',padding:'8px 12px',textAlign:'center',fontSize:12,letterSpacing:0.3}}>
      {t('urgency.line')}
    </div>
  )
}
