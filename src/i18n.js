import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav: {
        install: 'Install App',
        invest: 'Invest Now',
        lang_en: 'EN',
        lang_mg: 'MG',
      },
      hero: {
        title: "Ala: Regenerate Madagascar's Future — Unite Mining & Farming",
        subtitle: 'Empower communities, restore land, drive profits sustainably',
        cta_install: 'Install App',
        cta_invest: 'Invest Now',
        listen: 'Listen',
        voice_text:
          'Ala is Madagascar’s tech-enabled ecosystem uniting mines and farms. We restore degraded lands into productive agroforestry, power hubs with solar, and enable co-ops to raise incomes. Invest to scale a profitable, regenerative model for communities and nature.',
      },
      features: {
        title: 'Why Invest in Ala',
        items: [
          {
            title: 'Scalable model with 250% ROI',
            desc: 'Bundled carbon and commodity revenues with asset-light solar hubs and co-ops.',
          },
          {
            title: 'Solar hubs power resilience',
            desc: 'Irrigation, storage, and processing that reduce losses and increase quality.',
          },
          {
            title: 'Traceability and compliance',
            desc: 'Co-op led procurement with digital IDs meets investor-grade ESG standards.',
          },
          {
            title: 'Data-driven drought planning',
            desc: 'Sensors and satellite analytics optimize water and crop rotations.',
          },
          {
            title: 'Mine-to-farm restoration',
            desc: 'Transition disturbed sites into vanilla, clove, and agroforestry mosaics.',
          },
          {
            title: 'Bankable revenue streams',
            desc: 'Pre-sold carbon plus export crops enable predictable returns.',
          },
        ],
      },
      impact: {
        title: 'Measured Impact',
        hectaresRestored: 'Hectares Restored',
        farmYieldIncrease: 'Farm Yield Increase',
        co2Sequestered: 't CO₂e Sequestered',
        communitiesEmpowered: 'People Empowered',
        note: 'Illustrative figures. Replace with verified M&E once available.',
      },
      how: {
        title: 'How It Works',
        steps: [
          {
            title: '1. Map & Prioritize Sites',
            desc: 'Identify degraded mine edges and drought-prone farms for restoration.',
          },
          {
            title: '2. Deploy Solar Hubs',
            desc: 'Bring energy, water, and connectivity to community co-ops.',
          },
          {
            title: '3. Train & Organize Co-ops',
            desc: 'Provide agronomy, compliance, and market access toolkits.',
          },
          {
            title: '4. Finance & Monitor',
            desc: 'Blend carbon pre-sales with impact capital and real-time telemetry.',
          },
          {
            title: '5. Scale Regionally',
            desc: 'Reinvest proceeds to expand hubs and agroforestry corridors.',
          },
        ],
      },
      testimonials: {
        title: 'What Partners Say',
        items: [
          {
            quote:
              'Ala aligns our mine closure plans with community value creation — the data transparency is investor-grade.',
            name: 'R. Andriambelo',
            role: 'Sustainability Director, Mining Co.',
          },
          {
            quote:
              'Solar hubs and co-ops lifted quality and cut losses. Households doubled income in one season.',
            name: 'F. Raharisoa',
            role: 'Co-op Lead, Sofia Region',
          },
          {
            quote:
              'The stacked revenues de-risk returns. It’s a scalable model for climate and livelihoods.',
            name: 'E. Johnson',
            role: 'Impact Investor',
          },
        ],
      },
      footer: {
        contact: 'Contact',
        email_label: 'Email',
        email_value: 'invest@ala.mg',
        request_deck: 'Request the investor deck',
        rights: '© Ala 2025. All rights reserved.',
      },
      offline: {
        banner: 'You are offline. Content is available with limited interactivity.',
      },
      urgency: {
        line: 'Anchor round open — limited allocations through Q4 2025',
      },
    },
  },
  mg: {
    translation: {
      nav: {
        install: 'Apetraka ny App',
        invest: 'Mampiasa vola izao',
        lang_en: 'EN',
        lang_mg: 'MG',
      },
      hero: {
        title: "Ala: Avereno velona an’i Madagasikara — Ampiraiso ny Fitrandrahana sy ny Fambolena",
        subtitle:
          'Manome hery ny fiarahamonina, manarina ny tany, mampitombo ny vola miditra maharitra',
        cta_install: 'Apetraka ny App',
        cta_invest: 'Mampiasa vola izao',
        listen: 'Henoina',
        voice_text:
          'Ala dia rafitra manam-pahaizana mampifandray ny fitrandrahana sy ny fambolena. Manorina ala fambolena amin’ny tany simba izahay, mampandeha toerana amin’ny herinaratra masoandro, ary manohana fikambanana mba hiakatra ny vola miditra. Ampiasao vola hanitarana maodely maharitra sy mahasoa.',
      },
      features: {
        title: 'Antony hanohanana an’i Ala',
        items: [
          {
            title: 'Maodely azo ampitomboina, ROI 250%',
            desc: 'Vola avy amin’ny karbônina sy vokatra, miaraka amin’ny toby masoandro mora apetraka.',
          },
          {
            title: 'Toerana masoandro ho an’ny faharetana',
            desc: 'Fandrarahana, fitahirizana, sy fanodinana hampihenana fatiantoka.',
          },
          {
            title: 'Fanaraha-maso sy fankatoavana',
            desc: 'Fividianana tarihin’ny fikambanana sy ID nomerika ho an’ny fenitra ESG.',
          },
          {
            title: 'Fandrafetana amin’ny angona',
            desc: 'Sensor sy sary zanabolana hanatsarana ny rano sy ny fikafika fambolena.',
          },
          {
            title: 'Fanarenana avy amin’ny fitrandrahana ho fambolena',
            desc: 'Famindrana toerana simba ho amin’ny lavanila, jirofo, sy agroforestry.',
          },
          {
            title: 'Loharanom-bola azo antoka',
            desc: 'Karbônina mialoha sy vokatra fanondrana ho an’ny fiverenam-bola azo vinaniana.',
          },
        ],
      },
      impact: {
        title: 'Voka-dratsy tsara refesina',
        hectaresRestored: 'Hektara voarenina',
        farmYieldIncrease: 'Fitombon’ny vokatra',
        co2Sequestered: 't CO₂e voasintona',
        communitiesEmpowered: 'Olona voaofana/voatsara',
        note: 'Marika ohatra. Soloy angona ofisialy rehefa vonona.',
      },
      how: {
        title: 'Fomba Fiasan’i Ala',
        steps: [
          { title: '1. Fandrefesana toerana', desc: 'Mamaritra faritra simba sy maina indrindra.' },
          { title: '2. Fametrahana toby masoandro', desc: 'Energia, rano, fifandraisana ho an’ny fikambanana.' },
          { title: '3. Fampiofanana sy fandaminana', desc: 'Agronomia, fankatoavana, fidirana amin’ny tsena.' },
          { title: '4. Famatsiam-bola sy fanaraha-maso', desc: 'Karbônina mialoha, renivola, sy telemetry.' },
          { title: '5. Fanitarana', desc: 'Mamerina ny vola ho fanitarana.' },
        ],
      },
      testimonials: {
        title: 'Hevitry ny mpiara-miombon’antoka',
        items: [
          {
            quote:
              'Mifanaraka amin’ny drafitra fanakatonana toeram-pitrandrahana sy famoronana lanja — mazava ny angona.',
            name: 'R. Andriambelo',
            role: 'Talen’ny Tontolo iainana',
          },
          {
            quote:
              'Nampiakatra kalitao sy nampihena fatiantoka ny toby masoandro. Nihatsara ny fidiram-bola.',
            name: 'F. Raharisoa',
            role: 'Lehiben’ny fikambanana, Sofia',
          },
          {
            quote:
              'Mampihena loza ny vola maro mitambatra. Maodely azo ampitomboina.',
            name: 'E. Johnson',
            role: 'Mpampiasa vola',
          },
        ],
      },
      footer: {
        contact: 'Fifandraisana',
        email_label: 'Mailaka',
        email_value: 'invest@ala.mg',
        request_deck: 'Mangataka pejy ho an’ny mpampiasa vola',
        rights: '© Ala 2025. Zo rehetra voatokana.',
      },
      offline: { banner: 'Tsy misy tambajotra. Misy fetrany ny fiasa.' },
      urgency: { line: 'Fandraisana mpampiasa vola — hatramin’ny Q4 2025' },
    },
  },
}

const saved = typeof window !== 'undefined' ? localStorage.getItem('ala_lang') : null

i18n.use(initReactI18next).init({
  resources,
  lng: saved || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
