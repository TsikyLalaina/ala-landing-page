import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function OfflineIndicator() {
  const { t } = useTranslation()
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  if (online) return null
  return (
    <div style={{position:'fixed',bottom:12,left:'50%',transform:'translateX(-50%)',background:'#5E3B2E',color:'#F6F3EE',padding:'8px 12px',borderRadius:8,border:'1px solid #7A5646',zIndex:50,fontSize:12}}>
      {t('offline.banner')}
    </div>
  )
}
