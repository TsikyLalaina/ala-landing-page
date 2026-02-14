import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Impact from '../components/Impact'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import OfflineIndicator from '../components/OfflineIndicator'
import MapPreview from '../components/MapPreview'

function Landing() {
  return (
    <div style={{background:'#0B3D2E'}}>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
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
