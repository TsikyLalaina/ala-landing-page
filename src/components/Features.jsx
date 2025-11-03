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
              <div style={{width:36,height:36,borderRadius:8,background:'#2E5E4E'}} />
              <div style={{fontWeight:700}}>{it.title}</div>
            </div>
            <div style={{color:'#CFCBC3',fontSize:14}}>{it.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
