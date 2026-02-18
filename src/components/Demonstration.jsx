import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function Demonstration() {
  const { t } = useTranslation()

  return (
    <section style={{padding:'48px 20px',maxWidth:1100,margin:'0 auto', textAlign:'center'}}>
      <motion.div
        initial={{opacity:0, y:20}}
        whileInView={{opacity:1, y:0}}
        transition={{duration:0.6}}
        viewport={{once:true}}
      >
        <h2 style={{color:'#F2F1EE',fontSize:'clamp(22px,3.2vw,36px)',margin:'0 0 12px'}}>
          {t('demonstration.title')}
        </h2>
        <p style={{color:'#CFCBC3',fontSize:'clamp(14px,1.2vw,18px)',maxWidth:600,margin:'0 auto 32px'}}>
          {t('demonstration.subtitle')}
        </p>

        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid #1E5A49',
          background: '#000'
        }}>
          <video
            src="/images/demosala.webm"
            controls
            playsInline
            style={{width:'100%', height:'auto', display:'block'}}
          />
        </div>
      </motion.div>
    </section>
  )
}
