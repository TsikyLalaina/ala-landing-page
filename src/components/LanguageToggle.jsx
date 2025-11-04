import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const active = (i18n.language || 'en').slice(0,2)
  const setLang = (lng) => {
    i18n.changeLanguage(lng)
    if (typeof window !== 'undefined') localStorage.setItem('ala_lang', lng)
    setOpen(false)
  }
  const btnStyle = { border:'1px solid #2E5E4E', background:'#2E5E4E', color:'#EAE7E2', padding:'6px 10px', borderRadius:6, minWidth:54, textAlign:'left' }
  const menuStyle = { position:'absolute', right:0, top:'calc(100% + 6px)', background:'#0E3F31', border:'1px solid #1E5A49', borderRadius:8, overflow:'hidden', minWidth:120, boxShadow:'0 8px 24px rgba(0,0,0,0.35)' }
  const itemStyle = (code) => ({ display:'block', width:'100%', textAlign:'left', padding:'8px 10px', background: active===code ? '#1B4D3E' : 'transparent', color:'#EAE7E2', border:'none', cursor:'pointer' })
  return (
    <div style={{ position:'relative' }}>
      <button aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((v)=>!v)} style={btnStyle}>
        {active.toUpperCase()}
      </button>
      {open && (
        <div role="listbox" style={menuStyle}>
          <button role="option" aria-label={t('nav.lang_en')} onClick={() => setLang('en')} style={itemStyle('en')}>EN — {t('nav.lang_en')}</button>
          <button role="option" aria-label={t('nav.lang_mg')} onClick={() => setLang('mg')} style={itemStyle('mg')}>MG — {t('nav.lang_mg')}</button>
          <button role="option" aria-label={t('nav.lang_fr')} onClick={() => setLang('fr')} style={itemStyle('fr')}>FR — {t('nav.lang_fr')}</button>
        </div>
      )}
    </div>
  )
}
