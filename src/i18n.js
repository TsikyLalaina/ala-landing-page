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
        lang_fr: 'FR',
      },
      hero: {
        title: "Ala: Regenerate Madagascar's Future   Unite Mining & Farming",
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
        email_value: 'tsikyloharanontsoa@ala-mg.com',
        request_deck: 'Request the investor deck',
        rights: '© Ala 2025. All rights reserved.',
      },
      offline: {
        banner: 'You are offline. Content is available with limited interactivity.',
      },
      urgency: {
        line: 'Preview build: figures are forward‑looking illustrations and some visuals are placeholders for demonstration. Validated data and full assets are available in our investor materials.',
      },
    },
  },
  mg: {
    translation: {
      nav: {
        install: 'Hampiasa ny App',
        invest: 'Hampanjary Vola',
        lang_en: 'EN',
        lang_mg: 'MG',
        lang_fr: 'FR',
      },
      hero: {
        title: "Ala: Mamerina ny Hoavin'i Madagasikara   Mampivondrona ny Harena An-kibon'ny Tany sy ny Fambolena",
        subtitle: 'Manome hery ny fiaraha-monina, mamerina ny tany simba, mitondra tombony maharitra',
        cta_install: 'Hampiasa ny App',
        cta_invest: 'Hampanjary Vola',
        listen: 'Mihaino',
        voice_text:
          'Ala dia rafitra nomerika ao Madagasikara izay mampivondrona ny harena an-kibon’ny tany sy ny toeram-pambolena. Mamerina ny tany simba ho toy ny ala fambolena mahomby izahay, manome herin’aratra avy amin’ny masoandro ny ivon-toerana, ary manampy ny fikambanana mpiara-miasa hampiakatra ny fidiram-bola. Mampiasa vola mba hanitarana ny modely mahomby sy mamerina ny tontolo iainana ho an’ny fiaraha-monina sy ny natiora.',
      },
      features: {
        title: 'Maninona no tokony hampanjary vola ao amin’ny Ala',
        items: [
          {
            title: 'Modely azo hitarina miaraka amin’ny fiverenam-bola 250%',
            desc: 'Fampifangaroana ny fidiram-bola avy amin’ny karbônina sy ny vokatra ara-barotra miaraka amin’ny ivon-toerana masoandro maivana sy ny fikambanan\'ny mpiara-miasa.',
          },
          {
            title: 'Ivon-toerana masoandro manome herin\'aratra maharitra',
            desc: 'Fanondrahana, fitahirizana, ary fanodinana izay mampihena ny fatiantoka ary mampiakatra ny kalitao.',
          },
          {
            title: 'Fanaraha-maso sy fanajana ny fitsipika',
            desc: 'Fividianana entana notarihin’ny fikambanana mpiara-miasa miaraka amin’ny ID nomerika mahafeno ny fenitra ESG ny mpampanjary vola',
          },
          {
            title: 'Fandrindrana ny mosary maina mifototra amin’ny fahalalana',
            desc: 'Sensor sy fanadihadiana avy amin’ny zanabolana manatsara ny rano sy ny fihodin’ny vokatra.',
          },
          {
            title: 'Fanarenana avy amin’ny harena an-kibon’ny tany mankany amin’ny toeram-pambolena',
            desc: 'Mamindra ny toerana simba ho toy ny mosaika vanilla, girofo, ary ala fambolena.',
          },
          {
            title: 'Lalan-drakitra azo antoka',
            desc: 'Karbônina efa amidy mialoha miampy vokatra aondrana manome fiverenana azo vinaniana.',
          },
        ],
      },
      impact: {
        title: 'Voka-pifanoherana Voarindra',
        hectaresRestored: 'Hektara Narenina',
        farmYieldIncrease: 'Fampitomboana ny Voka-pambolena',
        co2Sequestered: 't CO₂e Voatahiry',
        communitiesEmpowered: 'Olona Mahaleo-tena',
        note: 'Tarehimarika fanoharana. Soloy amin’ny M&E voamarina rehefa misy.',
      },
      how: {
        title: 'Ahoana no Iasany',
        steps: [
          {
            title: '1. Sarintany sy laharam-pahamehana ny Toerana',
            desc: 'Mamantatra ny sisin’ny harena an-kibon’ny tany simba sy ny toeram-pambolena mora mosary maina ho an’ny fanarenana.',
          },
          {
            title: '2. Mametraka Ivon-toerana Masoandro',
            desc: 'Mitondra angovo, rano, ary fifandraisan-davitra ho an’ny fikambanana mpiara-miasa eo an-toerana.',
          },
          {
            title: '3. Mampiofana sy Mandamina ny Fikambanana Mpiara-miasa',
            desc: 'Manome fitaovana momba ny agronomia, fanajana fitsipika, ary fidirana amin’ny tsena goavana.',
          },
          {
            title: '4. Famatsiam-bola & Fanaraha-maso',
            desc: 'Mampifangaro ny varotra karbônina mialoha amin’ny renivohitra misy vokany sy telemetry amin’ny fotoana marina.',
          },
          {
            title: '5. Manitatra ny Faritra',
            desc: 'Mamerina mampiasa ny vokatra hanitarana ny ivon-toerana sy ny lalan’ala fambolena.',
          },
        ],
      },
      testimonials: {
        title: 'Inona no Lazain’ny Mpiray Tsikay',
        items: [
          {
            quote:
              'Ala dia mampifanaraka ny drafitry ny fanakatonana harena an-kibon’ny tany amin’ny famoronana lanja ho an’ny fiaraha-monina — ny fangaraharan’ny angona dia ampy ho an’ny mpampiasa vola.',
            name: 'R. Andriambelo',
            role: 'Talentsoratra Maharitra, Orinasa Harena An-kibon’ny Tany',
          },
          {
            quote:
              'Ny ivon-toerana masoandro sy ny fikambanana mpiara-miasa dia nanandratra ny kalitao ary namely ny fatiantoka. Ny ankohonana dia avo roa heny ny fidiram-bola tao anatin’ny vanim-potoana iray.',
            name: 'F. Raharisoa',
            role: 'Mpitarika Fikambanana Mpiara-miasa, Faritra Sofia',
          },
          {
            quote:
              'Ny fidiram-bola mifangarika dia mampihena ny risika amin’ny fiverenana. Modely azo ampitarina ho an’ny toetrandro sy ny fivelomana.',
            name: 'E. Johnson',
            role: 'Mpampiasa Vola Misy Vokany',
          },
        ],
      },
      footer: {
        contact: 'Fifandraisana',
        email_label: 'Mailaka',
        email_value: 'tsikyloharanontsoa@ala-mg.com',
        request_deck: 'Mangataka ny taratasy ho an’ny mpampanjary vola',
        rights: '© Ala 2025. Zo rehetra voaaro.',
      },
      offline: {
        banner: 'Tsy mifandray amin\'ny interinety ny fitaovanao. Misy votoaty voafetra.',
      },
      urgency: {
        line: 'Fanorenana mialoha: tarehimarika mialoha sy sary sasany dia placeholder ho an’ny fampisehoana. Angona voamarina sy fananana feno dia misy ao amin’ny fitaovana ho an’ny mpampanjary vola.',
      },
    },
  },
  fr: {
    translation: {
      nav: {
        install: 'Installer l’application',
        invest: "Investir maintenant",
        lang_en: 'EN',
        lang_mg: 'MG',
        lang_fr: 'FR',
      },
      hero: {
        title: "Ala : Régénérer l’avenir de Madagascar   Unir mines et agriculture",
        subtitle: 'Renforcer les communautés, restaurer les terres, créer des rendements durables',
        cta_install: 'Installer l’application',
        cta_invest: 'Investir maintenant',
        listen: 'Écouter',
      },
      features: {
        title: 'Pourquoi investir dans Ala',
        items: [
          {
            title: 'Modèle évolutif avec ROI de 250 %',
            desc: 'Revenus combinés carbone et matières premières avec hubs solaires légers et coopératives.',
          },
          {
            title: 'Des hubs solaires renforcent la résilience',
            desc: 'Irrigation, stockage et transformation pour réduire les pertes et améliorer la qualité.',
          },
          {
            title: 'Traçabilité et conformité',
            desc: 'Achats pilotés par les coopératives et identités numériques conformes aux normes ESG.',
          },
          {
            title: 'Planification sécheresse pilotée par la donnée',
            desc: 'Capteurs et imagerie satellite optimisent l’eau et les rotations culturales.',
          },
          {
            title: 'Restauration des sites miniers vers l’agroforesterie',
            desc: 'Conversion des zones perturbées en mosaïques de vanille, clou de girofle et agroforesterie.',
          },
          {
            title: 'Flux de revenus bancables',
            desc: 'Préventes carbone et cultures d’exportation pour des rendements prévisibles.',
          },
        ],
      },
      impact: {
        title: 'Impact mesuré',
        hectaresRestored: 'Hectares restaurés',
        farmYieldIncrease: 'Hausse des rendements',
        co2Sequestered: 't CO₂e séquestrées',
        communitiesEmpowered: 'Personnes accompagnées',
        note: "Chiffres illustratifs. Données vérifiées à venir.",
      },
      how: {
        title: 'Comment ça marche',
        steps: [
          {
            title: '1. Cartographier et prioriser les sites',
            desc: 'Identifier les lisières de mines dégradées et les fermes sujettes à la sécheresse pour la restauration.',
          },
          {
            title: '2. Déployer les hubs solaires',
            desc: 'Apporter énergie, eau et connectivité aux coopératives.',
          },
          {
            title: '3. Former et organiser les coopératives',
            desc: 'Fournir agronomie, conformité et accès marché.',
          },
          {
            title: '4. Financer et suivre',
            desc: 'Panachage de préventes carbone, capitaux d’impact et télémétrie en temps réel.',
          },
          {
            title: '5. Changer d’échelle régionalement',
            desc: 'Réinvestir les revenus pour étendre hubs et corridors agroforestiers.',
          },
        ],
      },
      testimonials: { title: 'Ce que disent nos partenaires' },
      footer: {
        contact: 'Contact',
        email_label: 'Email',
        email_value: 'tsikyloharanontsoa@ala-mg.com',
        request_deck: 'Demander le dossier investisseur',
        rights: '© Ala 2025. Tous droits réservés.',
      },
      offline: { banner: "Vous êtes hors ligne. Interactions limitées." },
      urgency: {
        line: "Version d’aperçu : chiffres illustratifs et certains visuels sont des substituts de démonstration. Données vérifiées et ressources complètes disponibles dans nos documents investisseurs.",
      },
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
