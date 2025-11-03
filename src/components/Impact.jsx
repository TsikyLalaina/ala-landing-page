import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

function CountUp({ target, duration = 1500 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const [value, setValue] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '-20% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration])
  return (
    <span ref={ref}>{value.toLocaleString()}</span>
  )
}

export default function Impact() {
  const { t } = useTranslation()
  const slides = [
    { key: 'hectaresRestored', value: 545, note: t('impact.hectaresRestored') },
    { key: 'farmYieldIncrease', value: 3, note: t('impact.farmYieldIncrease') + ' ×' },
    { key: 'co2Sequestered', value: 120000, note: t('impact.co2Sequestered') },
    { key: 'communitiesEmpowered', value: 15000, note: t('impact.communitiesEmpowered') },
  ]
  return (
    <section style={{padding:'48px 20px',maxWidth:1100,margin:'0 auto'}}>
      <h2 style={{color:'#F2F1EE',fontSize:'clamp(22px,3.2vw,36px)',margin:'0 0 18px'}}>{t('impact.title')}</h2>
      <div className="ala-carousel" mask="true" style={{['--items'] : slides.length}}>
        {slides.map((s, idx) => (
          <article key={idx} style={{['--i']: idx}}>
            <img src="/images/hero-after.svg" alt="Restored landscape"/>
            <h3>{s.note}</h3>
            <div>
              <p style={{fontSize:'clamp(28px,8vw,56px)',fontWeight:800,color:'#C9A66B',margin:'4px 0 8px'}}>
                <CountUp target={s.value} />
              </p>
              <p style={{fontSize:12,color:'#A7A39B'}}>Illustrative metric</p>
              <a href="#impact-details">Learn more</a>
            </div>
          </article>
        ))}
      </div>
      <div style={{color:'#A7A39B',fontSize:12,marginTop:12}}>{t('impact.note')}</div>
    </section>
  )
}
