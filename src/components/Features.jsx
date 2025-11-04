import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const cardStyle = {
  background:'#0E3F31',
  border:'1px solid #1E5A49',
  borderRadius:14,
  padding:18,
  color:'#EAE7E2',
  minHeight:140,
}

function Icon({ idx }) {
  const props = { width:20, height:20, stroke:'currentColor', fill:'none', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' }
  switch (idx) {
    case 0:
      // TrendingUp
      return (
        <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h7v7"/>
        </svg>
      )
    case 1:
      // ShieldCheck
      return (
        <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      )
    case 2:
      // Leaf
      return (
        <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 21C7 21 3 17 3 13 3 6 12 3 21 3c0 9-3 18-10 18z"/>
          <path d="M20 4c-5 5-9 9-12 12"/>
        </svg>
      )
    case 3:
      // Factory
      return (
        <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 21V9l6 3V9l6 3V6l6 2v13H3z"/>
          <path d="M7 21v-4M11 21v-4M15 21v-4M19 21v-4"/>
        </svg>
      )
    case 4:
      // Handshake
      return (
        <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 11l3-3 3 3 3-3 3 3"/>
          <path d="M2 12l4-4 4 4M10 12l2 2 2-2"/>
          <path d="M2 16l4 4h6l4-4"/>
        </svg>
      )
    default:
      // Users
      return (
        <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
  }
}

export default function Features() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true })
  return (
    <section style={{padding:'48px 20px',maxWidth:1100,margin:'0 auto'}}>
      <h2 style={{color:'#F2F1EE',fontSize:'clamp(22px,3.2vw,36px)',margin:'0 0 18px'}}>{t('features.title')}</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14}}>
        {items.map((it, idx) => (
          <motion.div key={idx} initial={{y:20,opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}} transition={{duration:0.4, delay:idx*0.05}} style={cardStyle}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
              <div style={{width:36,height:36,borderRadius:8,background:'#2E5E4E',display:'grid',placeItems:'center',color:'#C9A66B'}}>
                <Icon idx={idx} />
              </div>
              <div style={{fontWeight:700}}>{it.title}</div>
            </div>
            <div style={{color:'#CFCBC3',fontSize:14}}>{it.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
