import { useTranslation } from 'react-i18next'

export default function Testimonials() {
  const { t } = useTranslation()
  const items = t('testimonials.items', { returnObjects: true })
  return (
    <section style={{padding:'48px 20px',maxWidth:1100,margin:'0 auto'}}>
      <h2 style={{color:'#F2F1EE',fontSize:'clamp(22px,3.2vw,36px)',margin:'0 0 18px'}}>{t('testimonials.title')}</h2>
      <div className="ala-carousel" mask="true" style={{['--items']: items.length}}>
        {items.map((x, idx) => (
          <article key={idx} style={{['--i']: idx}}>
            <img src={`/images/partner${(idx % 3) + 1}.jpg`} alt={`${x.name} — ${x.role}`} />
            <h3>{x.name} — <span style={{fontWeight:400,color:'#CFCBC3'}}>{x.role}</span></h3>
            <div>
              <p style={{fontSize:16,lineHeight:1.5}}>“{x.quote}”</p>
              <a href="mailto:invest@ala.mg?subject=Reference%20check">Contact</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
