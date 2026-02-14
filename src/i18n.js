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
      auth: {
        login: 'Sign In',
        signup: 'Sign Up',
        logout: 'Sign Out',
        email: 'Email',
        password: 'Password',
        name: 'Full Name',
        name_placeholder: 'Enter your full name',
        username: 'Username',
        username_placeholder: '@username',
        phone: 'Phone Number',
        location: 'Location',
        location_placeholder: 'e.g. Antananarivo, Anosy',
        bio: 'Bio',
        bio_placeholder: 'Tell us about yourself...',
        sector: 'Primary Sector',
        agriculture: 'Agriculture',
        mining: 'Mining',
        both: 'Both',
        other: 'Other',
        dont_have_account: "Don't have an account?",
        already_have_account: 'Already have an account?',
        welcome_back: 'Welcome back',
        login_subtitle: 'Sign in to continue your journey',
        create_account: 'Create account',
        join_community: 'Join the regenerative community',
        continue_with_google: 'Continue with Google',
        or: 'or',
        try_again: 'Try again with different email',
        back: 'Back',
        next: 'Continue',
        complete: 'Complete Setup',
        onboarding: {
          title: 'Complete your profile',
          subtitle: 'Help us personalize your experience',
          step1_title: 'Basic Information',
          step1_desc: 'Tell us who you are',
          step2_title: 'Your Details',
          step2_desc: 'Where are you based and what do you do?',
          step3_title: 'Your Interests',
          step3_desc: 'Select topics you care about',
          success: 'Profile created successfully!',
        },
        validation: {
          email_required: 'Email is required',
          email_invalid: 'Please enter a valid email address',
          password_required: 'Password is required',
          password_min: 'Password must be at least 6 characters',
          name_required: 'Name is required',
          name_min: 'Name must be at least 2 characters',
          phone_invalid: 'Please enter a valid phone number',
        },
        profile: {
          edit: 'Edit Profile',
          save: 'Save Changes',
          cancel: 'Cancel',
          upload_photo: 'Upload Photo',
          location_map: 'Location Map',
          badges: 'Badges',
          contributions: 'Contributions',
          member_since: 'Member since',
          bio_placeholder: 'Tell us about yourself...',
          location_placeholder: 'Region, City',
          no_badges: 'No badges yet',
        },
        posts: {
          new_post: 'New Post',
          create_title: 'Create a Post',
          placeholder: 'What are you working on? Share a problem, solution, or update...',
          upload_media: 'Add Photos/Video',
          hashtags: 'Hashtags',
          hashtags_placeholder: 'e.g. #drought #vanilla',
          category: 'Category',
          select_category: 'Select a category',
          submit: 'Post',
          success: 'Post created successfully!',
          categories: {
            general: 'General',
            drought_resilience: 'Drought Resilience',
            mine_restoration: 'Mine Restoration',
            market_access: 'Market Access',
            farming: 'Farming Tips',
          },
        },
        feed: {
          title: 'Your Feed',
          load_more: 'Load More',
          no_posts: 'No posts yet. Be the first to share!',
          likes: 'Likes',
          comments: 'Comments',
          share: 'Share',
        },
        discussion: {
          reply: 'Reply',
          write_reply: 'Write a reply...',
          nested_reply: 'Write a nested reply...',
          view_replies: 'View replies',
          flag: 'Flag for moderation',
          quote: 'Quote',
          submit: 'Post',
          load_comments: 'Load comments',
          no_comments: 'No comments yet. Start the discussion!',
        },
        groups: {
          title: 'Community Groups',
          create: 'Create Group',
          create_title: 'Create a New Group',
          search_placeholder: 'Search for groups...',
          no_groups: 'No groups found. Create one!',
          submit_create: 'Create Group',
          created_success: 'Group created successfully!',
        },

        check_email: 'Check your email',
        check_email_desc: 'We sent a verification link to your email. Please verify to continue.',
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
      auth: {
        login: 'Hiditra',
        signup: 'Hisoratra anarana',
        logout: 'Hivoaka',
        email: 'Mailaka',
        password: 'Tenimiafina',
        name: 'Anarana feno',
        phone: 'Laharana finday',
        sector: 'Sehatra iasana',
        agriculture: 'Fambolena',
        mining: 'Harena an-kibon’ny tany',
        both: 'Izy roa',
        other: 'Hafa',
        dont_have_account: 'Tsy mbola manana kaonty?',
        already_have_account: 'Efa manana kaonty?',
        welcome_back: 'Tonga soa indray',
        create_account: 'Mamorona ny kaontinao',
        error_invalid_email: 'Mailaka tsy manankery',
        error_password_too_short: 'Tenimiafina farafahakeliny 6 litera',
        error_generic: 'Nisy olana. Manandrama indray.',
        loading: 'Eo am-pikirakirana...',
        onboarding: {
          welcome: 'Tonga soa ato amin’ny Ala!',
          setup_profile: 'Andao hamboarina ny mombamomba anao.',
        },
        groups: {
          title: "Vondronan'ny Fiaraha-monina",
          create: 'Mamorona Vondrona',
          create_title: 'Mamorona Vondrona Vaovao',
          search_placeholder: 'Mitady vondrona...',
          no_groups: 'Tsy nahitana vondrona. Mamorona iray!',
          submit_create: 'Mamorona Vondrona',
          created_success: 'Vondrona voaforona soa aman-tsara!',
        },
        check_email: 'Jereo ny mailakanao',
        check_email_desc: 'Nandefa rohy fanamarinana tany amin’ny adiresy mailakanao izahay. Manamarina ny kaontinao mba hanohizana.',
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
      auth: {
        login: 'Connexion',
        signup: 'S’inscrire',
        logout: 'Déconnexion',
        email: 'Email',
        password: 'Mot de passe',
        name: 'Nom complet',
        phone: 'Numéro de téléphone',
        sector: 'Secteur principal',
        agriculture: 'Agriculture',
        mining: 'Mines',
        both: 'Les deux',
        other: 'Autre',
        dont_have_account: 'Vous n’avez pas de compte ?',
        already_have_account: 'Vous avez déjà un compte ?',
        welcome_back: 'Bon retour',
        create_account: 'Créez votre compte',
        error_invalid_email: 'Adresse email invalide',
        error_password_too_short: 'Le mot de passe doit faire au moins 6 caractères',
        error_generic: 'Une erreur est survenue. Veuillez réessayer.',
        loading: 'Chargement...',
        onboarding: {
          welcome: 'Bienvenue sur Ala !',
          setup_profile: 'Configurons votre profil pour commencer.',
        },
        groups: {
          title: 'Groupes Communautaires',
          create: 'Créer un groupe',
          create_title: 'Créer un nouveau groupe',
          search_placeholder: 'Rechercher des groupes...',
          no_groups: 'Aucun groupe trouvé. Créez-en un !',
          submit_create: 'Créer un groupe',
          created_success: 'Groupe créé avec succès !',
        },
        check_email: 'Vérifiez vos e-mails',
        check_email_desc: 'Nous avons envoyé un lien de vérification à votre adresse e-mail. Veuillez vérifier votre compte pour continuer.',
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
