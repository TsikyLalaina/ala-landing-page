import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function HowItWorks() {
  const { t } = useTranslation()
  const steps = t('how.steps', { returnObjects: true })
  return (
    <section style={{padding:'48px 20px',maxWidth:1100,margin:'0 auto'}}>
      <h2 style={{color:'#F2F1EE',fontSize:'clamp(22px,3.2vw,36px)',margin:'0 0 18px'}}>{t('how.title')}</h2>
      <div style={{display:'grid',gridAutoFlow:'column',gridAutoColumns:'minmax(260px,1fr)',overflowX:'auto',gap:14,scrollSnapType:'x mandatory',paddingBottom:8}}>
        {steps.map((s, idx) => (
          <motion.div key={idx} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5, delay:idx*0.05}} style={{background:'#0E3F31',border:'1px solid #1E5A49',borderRadius:14,padding:18,scrollSnapAlign:'start',minHeight:160}}>
            <div style={{fontWeight:800,color:'#F2F1EE',marginBottom:6}}>{s.title}</div>
            <div style={{color:'#CFCBC3',fontSize:14}}>{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
