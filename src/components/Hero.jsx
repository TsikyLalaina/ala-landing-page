import { Parallax } from 'react-parallax'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useState, useCallback } from 'react'
import useSpeech from '../hooks/useSpeech'
import usePWAInstall from '../hooks/usePWAInstall'

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const { t, i18n } = useTranslation()
  const { supported, speaking, speak, cancel } = useSpeech()
  const { canInstall, promptInstall } = usePWAInstall()
  const [faded, setFaded] = useState(prefersReduced)

  const handleListen = () => {
    if (!supported) return
    if (speaking) return cancel()
    const lang = i18n.language?.startsWith('mg') ? 'fr-FR' : 'en-US'
    speak(t('hero.voice_text'), lang, 1)
  }

  const handleEnded = useCallback(() => {
    setFaded(true)
  }, [])

  return (
    <section style={{position:'relative'}}>
      <Parallax bgImage={'/images/After.png'} strength={prefersReduced?0:200}>
        <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
          <motion.video
            key="before-video"
            poster="/images/After.png"
            playsInline
            muted
            autoPlay
            preload="auto"
            onEnded={handleEnded}
            initial={{opacity:1}}
            animate={{opacity: faded ? (prefersReduced?0.3:0) : 1}}
            transition={{duration:1.8, ease:'easeOut'}}
            style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',filter:'contrast(0.95)'}}
          >
            <source src="/images/Before.mp4" type="video/mp4" />
          </motion.video>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(11,61,46,0.65) 0%, rgba(11,61,46,0.85) 60%, rgba(11,61,46,1) 100%)'}} />
          <div style={{position:'relative',padding:'64px 20px',maxWidth:1100,margin:'0 auto',textAlign:'center'}}>
            <motion.h1
              initial={{y:20,opacity:0}}
              whileInView={{y:0,opacity:1}}
              transition={{duration:0.6}}
              style={{fontSize:'clamp(28px,5vw,56px)',lineHeight:1.05,color:'#F2F1EE',fontWeight:800,letterSpacing:-0.5}}>
              {t('hero.title')}
            </motion.h1>
            <motion.p
              initial={{y:20,opacity:0}}
              whileInView={{y:0,opacity:1}}
              transition={{duration:0.6, delay:0.1}}
              style={{color:'#D7D4CE',margin:'14px auto 26px',maxWidth:820,fontSize:'clamp(14px,2.3vw,20px)'}}>
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{opacity:0}}
              whileInView={{opacity:1}}
              transition={{duration:0.6, delay:0.2}}
              style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
              <button onClick={() => canInstall ? promptInstall() : window.open('#footer','_self')} style={{background:'#C9A66B',color:'#0B3D2E',border:'1px solid #C9A66B',padding:'12px 16px',borderRadius:10,fontWeight:700}}>
                {t('hero.cta_install')}
              </button>
              <a href="mailto:tsikyloharanontsoa@ala-mg.com?subject=Ala%20Investment%20Interest" style={{background:'transparent',color:'#F2F1EE',border:'1px solid #2E5E4E',padding:'12px 16px',borderRadius:10,fontWeight:700,textDecoration:'none'}}>
                {t('hero.cta_invest')}
              </a>
              <button onClick={handleListen} aria-pressed={speaking} style={{background:'transparent',color:'#F2F1EE',border:'1px solid #2E5E4E',padding:'12px 16px',borderRadius:10,fontWeight:700}}>
                {speaking ? '⏸ ' : '▶ '} {t('hero.listen')}
              </button>
            </motion.div>
          </div>
        </div>
      </Parallax>
    </section>
  )
}
