import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Demonstration from '../components/Demonstration'
import Features from '../components/Features'
import Impact from '../components/Impact'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import OfflineIndicator from '../components/OfflineIndicator'
import MapPreview from '../components/MapPreview'
import SEOHead from '../components/SEOHead'

const LANDING_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ala',
    url: 'https://ala-mg.com',
    logo: 'https://ala-mg.com/icons/ala.png',
    description:
      "Ala is Madagascar's tech-enabled ecosystem uniting mining and agricultural sectors to regenerate land, empower communities, and create bankable, sustainable returns.",
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'tsikyloharanontsoa@ala-mg.com',
      contactType: 'investor relations',
    },
    sameAs: [],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ala-mg.com/',
      },
    ],
  },
]

function Landing() {
  return (
    <div style={{background:'#0B3D2E'}}>
      <SEOHead
        title="Ala — Regenerate Madagascar's Future | Unite Mining & Farming"
        description="Ala unites Madagascar's mining and agricultural sectors to regenerate land, empower communities, and create bankable, sustainable returns. Invest now."
        path="/"
        jsonLd={LANDING_JSON_LD}
      />
      <AnnouncementBar />
      <Header />
      <main role="main">
        <Hero />
        <Demonstration />
        <Features />
        <Impact />
        <MapPreview />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
      <OfflineIndicator />
    </div>
  )
}

export default Landing;
