import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const setLang = (lng) => {
    i18n.changeLanguage(lng)
    if (typeof window !== 'undefined') localStorage.setItem('ala_lang', lng)
  }
  const active = i18n.language || 'en'
  return (
    <div style={{display:'flex',gap:8}}>
      <button aria-label={t('nav.lang_en')} onClick={() => setLang('en')} style={{border:'1px solid #2E5E4E',background:active.startsWith('en')?'#2E5E4E':'transparent',color:'#EAE7E2',padding:'6px 10px',borderRadius:6}}>
        EN
      </button>
      <button aria-label={t('nav.lang_mg')} onClick={() => setLang('mg')} style={{border:'1px solid #2E5E4E',background:active.startsWith('mg')?'#2E5E4E':'transparent',color:'#EAE7E2',padding:'6px 10px',borderRadius:6}}>
        MG
      </button>
    </div>
  )
}
