import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, Meta, Links, ScrollRestoration, Scripts, Navigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { HelmetProvider, Helmet } from "react-helmet-async";
import React, { createContext, useState, useEffect, useContext, useCallback, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Info, AlertCircle, CheckCircle, X, LogIn, Loader2, Mail, Lock, ArrowRight, MailCheck, MapPin, Sparkles, User, Hash, Phone, Leaf, Mountain, Briefcase, FileText, Check, ArrowLeft, Home, Users, PlusSquare, MessageCircle, Menu, ShoppingCart, BookOpen, Calendar, Scale, Radio, ClipboardList, LogOut, Heart, Share2, Camera, Save, Edit2, BarChart2, Award, Plus, SendHorizontal, Flag, ThumbsUp, ThumbsDown, Search, UserMinus, UserPlus, Package, ShoppingBag, Upload, Clock, Ban, AlertTriangle, Store, ChevronRight, Filter, Eye, Globe, HelpCircle, Video, Tag, ExternalLink, XCircle, CheckCircle2, Shield, Minus, MessageSquare, Send, List, Map as Map$1, ShieldAlert, Bug, Flame, Droplets, CloudLightning, HelpingHand, PackageOpen, Square, Mic, Download, CheckCheck, Ticket, TrendingUp, DollarSign, BarChart3, PieChart, Image, ChevronDown } from "lucide-react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        onAllReady() {
          if (isbot(userAgent)) {
            shellRendered = true;
            const body = new PassThrough();
            const stream = createReadableStreamFromReadable(body);
            responseHeaders.set("Content-Type", "text/html");
            resolve(
              new Response(stream, {
                headers: responseHeaders,
                status: responseStatusCode
              })
            );
            pipe(body);
          }
        },
        onShellReady() {
          if (!isbot(userAgent)) {
            shellRendered = true;
            const body = new PassThrough();
            const stream = createReadableStreamFromReadable(body);
            responseHeaders.set("Content-Type", "text/html");
            resolve(
              new Response(stream, {
                headers: responseHeaders,
                status: responseStatusCode
              })
            );
            pipe(body);
          }
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const resources = {
  en: {
    translation: {
      nav: {
        install: "Install App",
        invest: "Invest Now",
        lang_en: "EN",
        lang_mg: "MG",
        lang_fr: "FR"
      },
      hero: {
        title: "Ala: Regenerate Madagascar's Future   Unite Mining & Farming",
        subtitle: "Empower communities, restore land, drive profits sustainably",
        cta_install: "Install App",
        cta_invest: "Invest Now",
        listen: "Listen",
        voice_text: "Ala is Madagascar’s tech-enabled ecosystem uniting mines and farms. We restore degraded lands into productive agroforestry, power hubs with solar, and enable co-ops to raise incomes. Invest to scale a profitable, regenerative model for communities and nature."
      },
      demonstration: {
        title: "See Ala in Action",
        subtitle: "Watch how our platform connects mines and farms for a sustainable future."
      },
      features: {
        title: "Why Invest in Ala",
        items: [
          {
            title: "Scalable model with 250% ROI",
            desc: "Bundled carbon and commodity revenues with asset-light solar hubs and co-ops."
          },
          {
            title: "Solar hubs power resilience",
            desc: "Irrigation, storage, and processing that reduce losses and increase quality."
          },
          {
            title: "Traceability and compliance",
            desc: "Co-op led procurement with digital IDs meets investor-grade ESG standards."
          },
          {
            title: "Data-driven drought planning",
            desc: "Sensors and satellite analytics optimize water and crop rotations."
          },
          {
            title: "Mine-to-farm restoration",
            desc: "Transition disturbed sites into vanilla, clove, and agroforestry mosaics."
          },
          {
            title: "Bankable revenue streams",
            desc: "Pre-sold carbon plus export crops enable predictable returns."
          }
        ]
      },
      impact: {
        title: "Measured Impact",
        hectaresRestored: "Hectares Restored",
        farmYieldIncrease: "Farm Yield Increase",
        co2Sequestered: "t CO₂e Sequestered",
        communitiesEmpowered: "People Empowered",
        note: "Illustrative figures. Replace with verified M&E once available."
      },
      how: {
        title: "How It Works",
        steps: [
          {
            title: "1. Map & Prioritize Sites",
            desc: "Identify degraded mine edges and drought-prone farms for restoration."
          },
          {
            title: "2. Deploy Solar Hubs",
            desc: "Bring energy, water, and connectivity to community co-ops."
          },
          {
            title: "3. Train & Organize Co-ops",
            desc: "Provide agronomy, compliance, and market access toolkits."
          },
          {
            title: "4. Finance & Monitor",
            desc: "Blend carbon pre-sales with impact capital and real-time telemetry."
          },
          {
            title: "5. Scale Regionally",
            desc: "Reinvest proceeds to expand hubs and agroforestry corridors."
          }
        ]
      },
      testimonials: {
        title: "What Partners Say",
        items: [
          {
            quote: "Ala aligns our mine closure plans with community value creation — the data transparency is investor-grade.",
            name: "R. Andriambelo",
            role: "Sustainability Director, Mining Co."
          },
          {
            quote: "Solar hubs and co-ops lifted quality and cut losses. Households doubled income in one season.",
            name: "F. Raharisoa",
            role: "Co-op Lead, Sofia Region"
          },
          {
            quote: "The stacked revenues de-risk returns. It’s a scalable model for climate and livelihoods.",
            name: "E. Johnson",
            role: "Impact Investor"
          }
        ]
      },
      footer: {
        contact: "Contact",
        email_label: "Email",
        email_value: "tsikyloharanontsoa@ala-mg.com",
        request_deck: "Request the investor deck",
        rights: "© Ala 2025. All rights reserved."
      },
      offline: {
        banner: "You are offline. Content is available with limited interactivity."
      },
      urgency: {
        line: "Preview build: figures are forward‑looking illustrations and some visuals are placeholders for demonstration. Validated data and full assets are available in our investor materials."
      },
      auth: {
        login: "Sign In",
        signup: "Sign Up",
        logout: "Sign Out",
        email: "Email",
        password: "Password",
        name: "Full Name",
        name_placeholder: "Enter your full name",
        username: "Username",
        username_placeholder: "@username",
        phone: "Phone Number",
        location: "Location",
        location_placeholder: "e.g. Antananarivo, Anosy",
        bio: "Bio",
        bio_placeholder: "Tell us about yourself...",
        sector: "Primary Sector",
        agriculture: "Agriculture",
        mining: "Mining",
        both: "Both",
        other: "Other",
        dont_have_account: "Don't have an account?",
        already_have_account: "Already have an account?",
        welcome_back: "Welcome back",
        login_subtitle: "Sign in to continue your journey",
        create_account: "Create account",
        join_community: "Join the regenerative community",
        continue_with_google: "Continue with Google",
        or: "or",
        try_again: "Try again with different email",
        back: "Back",
        next: "Continue",
        complete: "Complete Setup",
        onboarding: {
          title: "Complete your profile",
          subtitle: "Help us personalize your experience",
          step1_title: "Basic Information",
          step1_desc: "Tell us who you are",
          step2_title: "Your Details",
          step2_desc: "Where are you based and what do you do?",
          step3_title: "Your Interests",
          step3_desc: "Select topics you care about",
          success: "Profile created successfully!"
        },
        validation: {
          email_required: "Email is required",
          email_invalid: "Please enter a valid email address",
          password_required: "Password is required",
          password_min: "Password must be at least 6 characters",
          name_required: "Name is required",
          name_min: "Name must be at least 2 characters",
          phone_invalid: "Please enter a valid phone number"
        },
        profile: {
          edit: "Edit Profile",
          save: "Save Changes",
          cancel: "Cancel",
          upload_photo: "Upload Photo",
          location_map: "Location Map",
          badges: "Badges",
          contributions: "Contributions",
          member_since: "Member since",
          bio_placeholder: "Tell us about yourself...",
          location_placeholder: "Region, City",
          no_badges: "No badges yet"
        },
        posts: {
          new_post: "New Post",
          create_title: "Create a Post",
          placeholder: "What are you working on? Share a problem, solution, or update...",
          upload_media: "Add Photos/Video",
          hashtags: "Hashtags",
          hashtags_placeholder: "e.g. #drought #vanilla",
          category: "Category",
          select_category: "Select a category",
          submit: "Post",
          success: "Post created successfully!",
          categories: {
            general: "General",
            drought_resilience: "Drought Resilience",
            mine_restoration: "Mine Restoration",
            market_access: "Market Access",
            farming: "Farming Tips"
          }
        },
        feed: {
          title: "Your Feed",
          load_more: "Load More",
          no_posts: "No posts yet. Be the first to share!",
          likes: "Likes",
          comments: "Comments",
          share: "Share"
        },
        discussion: {
          reply: "Reply",
          write_reply: "Write a reply...",
          nested_reply: "Write a nested reply...",
          view_replies: "View replies",
          flag: "Flag for moderation",
          quote: "Quote",
          submit: "Post",
          load_comments: "Load comments",
          no_comments: "No comments yet. Start the discussion!"
        },
        groups: {
          title: "Community Groups",
          create: "Create Group",
          create_title: "Create a New Group",
          search_placeholder: "Search for groups...",
          no_groups: "No groups found. Create one!",
          submit_create: "Create Group",
          created_success: "Group created successfully!"
        },
        check_email: "Check your email",
        check_email_desc: "We sent a verification link to your email. Please verify to continue."
      }
    }
  },
  mg: {
    translation: {
      nav: {
        install: "Hampiasa ny App",
        invest: "Hampanjary Vola",
        lang_en: "EN",
        lang_mg: "MG",
        lang_fr: "FR"
      },
      hero: {
        title: "Ala: Mamerina ny Hoavin'i Madagasikara   Mampivondrona ny Harena An-kibon'ny Tany sy ny Fambolena",
        subtitle: "Manome hery ny fiaraha-monina, mamerina ny tany simba, mitondra tombony maharitra",
        cta_install: "Hampiasa ny App",
        cta_invest: "Hampanjary Vola",
        listen: "Mihaino",
        voice_text: "Ala dia rafitra nomerika ao Madagasikara izay mampivondrona ny harena an-kibon’ny tany sy ny toeram-pambolena. Mamerina ny tany simba ho toy ny ala fambolena mahomby izahay, manome herin’aratra avy amin’ny masoandro ny ivon-toerana, ary manampy ny fikambanana mpiara-miasa hampiakatra ny fidiram-bola. Mampiasa vola mba hanitarana ny modely mahomby sy mamerina ny tontolo iainana ho an’ny fiaraha-monina sy ny natiora."
      },
      demonstration: {
        title: "Jereo ny fiasan'ny Ala",
        subtitle: "Jereo ny fomba fampifandraisana ny harena an-kibon'ny tany sy ny fambolena ho an'ny hoavy maharitra."
      },
      features: {
        title: "Maninona no tokony hampanjary vola ao amin’ny Ala",
        items: [
          {
            title: "Modely azo hitarina miaraka amin’ny fiverenam-bola 250%",
            desc: "Fampifangaroana ny fidiram-bola avy amin’ny karbônina sy ny vokatra ara-barotra miaraka amin’ny ivon-toerana masoandro maivana sy ny fikambanan'ny mpiara-miasa."
          },
          {
            title: "Ivon-toerana masoandro manome herin'aratra maharitra",
            desc: "Fanondrahana, fitahirizana, ary fanodinana izay mampihena ny fatiantoka ary mampiakatra ny kalitao."
          },
          {
            title: "Fanaraha-maso sy fanajana ny fitsipika",
            desc: "Fividianana entana notarihin’ny fikambanana mpiara-miasa miaraka amin’ny ID nomerika mahafeno ny fenitra ESG ny mpampanjary vola"
          },
          {
            title: "Fandrindrana ny mosary maina mifototra amin’ny fahalalana",
            desc: "Sensor sy fanadihadiana avy amin’ny zanabolana manatsara ny rano sy ny fihodin’ny vokatra."
          },
          {
            title: "Fanarenana avy amin’ny harena an-kibon’ny tany mankany amin’ny toeram-pambolena",
            desc: "Mamindra ny toerana simba ho toy ny mosaika vanilla, girofo, ary ala fambolena."
          },
          {
            title: "Lalan-drakitra azo antoka",
            desc: "Karbônina efa amidy mialoha miampy vokatra aondrana manome fiverenana azo vinaniana."
          }
        ]
      },
      impact: {
        title: "Voka-pifanoherana Voarindra",
        hectaresRestored: "Hektara Narenina",
        farmYieldIncrease: "Fampitomboana ny Voka-pambolena",
        co2Sequestered: "t CO₂e Voatahiry",
        communitiesEmpowered: "Olona Mahaleo-tena",
        note: "Tarehimarika fanoharana. Soloy amin’ny M&E voamarina rehefa misy."
      },
      how: {
        title: "Ahoana no Iasany",
        steps: [
          {
            title: "1. Sarintany sy laharam-pahamehana ny Toerana",
            desc: "Mamantatra ny sisin’ny harena an-kibon’ny tany simba sy ny toeram-pambolena mora mosary maina ho an’ny fanarenana."
          },
          {
            title: "2. Mametraka Ivon-toerana Masoandro",
            desc: "Mitondra angovo, rano, ary fifandraisan-davitra ho an’ny fikambanana mpiara-miasa eo an-toerana."
          },
          {
            title: "3. Mampiofana sy Mandamina ny Fikambanana Mpiara-miasa",
            desc: "Manome fitaovana momba ny agronomia, fanajana fitsipika, ary fidirana amin’ny tsena goavana."
          },
          {
            title: "4. Famatsiam-bola & Fanaraha-maso",
            desc: "Mampifangaro ny varotra karbônina mialoha amin’ny renivohitra misy vokany sy telemetry amin’ny fotoana marina."
          },
          {
            title: "5. Manitatra ny Faritra",
            desc: "Mamerina mampiasa ny vokatra hanitarana ny ivon-toerana sy ny lalan’ala fambolena."
          }
        ]
      },
      testimonials: {
        title: "Inona no Lazain’ny Mpiray Tsikay",
        items: [
          {
            quote: "Ala dia mampifanaraka ny drafitry ny fanakatonana harena an-kibon’ny tany amin’ny famoronana lanja ho an’ny fiaraha-monina — ny fangaraharan’ny angona dia ampy ho an’ny mpampiasa vola.",
            name: "R. Andriambelo",
            role: "Talentsoratra Maharitra, Orinasa Harena An-kibon’ny Tany"
          },
          {
            quote: "Ny ivon-toerana masoandro sy ny fikambanana mpiara-miasa dia nanandratra ny kalitao ary namely ny fatiantoka. Ny ankohonana dia avo roa heny ny fidiram-bola tao anatin’ny vanim-potoana iray.",
            name: "F. Raharisoa",
            role: "Mpitarika Fikambanana Mpiara-miasa, Faritra Sofia"
          },
          {
            quote: "Ny fidiram-bola mifangarika dia mampihena ny risika amin’ny fiverenana. Modely azo ampitarina ho an’ny toetrandro sy ny fivelomana.",
            name: "E. Johnson",
            role: "Mpampiasa Vola Misy Vokany"
          }
        ]
      },
      footer: {
        contact: "Fifandraisana",
        email_label: "Mailaka",
        email_value: "tsikyloharanontsoa@ala-mg.com",
        request_deck: "Mangataka ny taratasy ho an’ny mpampanjary vola",
        rights: "© Ala 2025. Zo rehetra voaaro."
      },
      offline: {
        banner: "Tsy mifandray amin'ny interinety ny fitaovanao. Misy votoaty voafetra."
      },
      urgency: {
        line: "Fanorenana mialoha: tarehimarika mialoha sy sary sasany dia placeholder ho an’ny fampisehoana. Angona voamarina sy fananana feno dia misy ao amin’ny fitaovana ho an’ny mpampanjary vola."
      },
      auth: {
        login: "Hiditra",
        signup: "Hisoratra anarana",
        logout: "Hivoaka",
        email: "Mailaka",
        password: "Tenimiafina",
        name: "Anarana feno",
        phone: "Laharana finday",
        sector: "Sehatra iasana",
        agriculture: "Fambolena",
        mining: "Harena an-kibon’ny tany",
        both: "Izy roa",
        other: "Hafa",
        dont_have_account: "Tsy mbola manana kaonty?",
        already_have_account: "Efa manana kaonty?",
        welcome_back: "Tonga soa indray",
        create_account: "Mamorona ny kaontinao",
        error_invalid_email: "Mailaka tsy manankery",
        error_password_too_short: "Tenimiafina farafahakeliny 6 litera",
        error_generic: "Nisy olana. Manandrama indray.",
        loading: "Eo am-pikirakirana...",
        onboarding: {
          welcome: "Tonga soa ato amin’ny Ala!",
          setup_profile: "Andao hamboarina ny mombamomba anao."
        },
        groups: {
          title: "Vondronan'ny Fiaraha-monina",
          create: "Mamorona Vondrona",
          create_title: "Mamorona Vondrona Vaovao",
          search_placeholder: "Mitady vondrona...",
          no_groups: "Tsy nahitana vondrona. Mamorona iray!",
          submit_create: "Mamorona Vondrona",
          created_success: "Vondrona voaforona soa aman-tsara!"
        },
        check_email: "Jereo ny mailakanao",
        check_email_desc: "Nandefa rohy fanamarinana tany amin’ny adiresy mailakanao izahay. Manamarina ny kaontinao mba hanohizana."
      }
    }
  },
  fr: {
    translation: {
      nav: {
        install: "Installer l’application",
        invest: "Investir maintenant",
        lang_en: "EN",
        lang_mg: "MG",
        lang_fr: "FR"
      },
      hero: {
        title: "Ala : Régénérer l’avenir de Madagascar   Unir mines et agriculture",
        subtitle: "Renforcer les communautés, restaurer les terres, créer des rendements durables",
        cta_install: "Installer l’application",
        cta_invest: "Investir maintenant",
        listen: "Écouter"
      },
      demonstration: {
        title: "Découvrez Ala en action",
        subtitle: "Regardez comment notre plateforme connecte mines et fermes pour un avenir durable."
      },
      features: {
        title: "Pourquoi investir dans Ala",
        items: [
          {
            title: "Modèle évolutif avec ROI de 250 %",
            desc: "Revenus combinés carbone et matières premières avec hubs solaires légers et coopératives."
          },
          {
            title: "Des hubs solaires renforcent la résilience",
            desc: "Irrigation, stockage et transformation pour réduire les pertes et améliorer la qualité."
          },
          {
            title: "Traçabilité et conformité",
            desc: "Achats pilotés par les coopératives et identités numériques conformes aux normes ESG."
          },
          {
            title: "Planification sécheresse pilotée par la donnée",
            desc: "Capteurs et imagerie satellite optimisent l’eau et les rotations culturales."
          },
          {
            title: "Restauration des sites miniers vers l’agroforesterie",
            desc: "Conversion des zones perturbées en mosaïques de vanille, clou de girofle et agroforesterie."
          },
          {
            title: "Flux de revenus bancables",
            desc: "Préventes carbone et cultures d’exportation pour des rendements prévisibles."
          }
        ]
      },
      impact: {
        title: "Impact mesuré",
        hectaresRestored: "Hectares restaurés",
        farmYieldIncrease: "Hausse des rendements",
        co2Sequestered: "t CO₂e séquestrées",
        communitiesEmpowered: "Personnes accompagnées",
        note: "Chiffres illustratifs. Données vérifiées à venir."
      },
      how: {
        title: "Comment ça marche",
        steps: [
          {
            title: "1. Cartographier et prioriser les sites",
            desc: "Identifier les lisières de mines dégradées et les fermes sujettes à la sécheresse pour la restauration."
          },
          {
            title: "2. Déployer les hubs solaires",
            desc: "Apporter énergie, eau et connectivité aux coopératives."
          },
          {
            title: "3. Former et organiser les coopératives",
            desc: "Fournir agronomie, conformité et accès marché."
          },
          {
            title: "4. Financer et suivre",
            desc: "Panachage de préventes carbone, capitaux d’impact et télémétrie en temps réel."
          },
          {
            title: "5. Changer d’échelle régionalement",
            desc: "Réinvestir les revenus pour étendre hubs et corridors agroforestiers."
          }
        ]
      },
      testimonials: { title: "Ce que disent nos partenaires" },
      footer: {
        contact: "Contact",
        email_label: "Email",
        email_value: "tsikyloharanontsoa@ala-mg.com",
        request_deck: "Demander le dossier investisseur",
        rights: "© Ala 2025. Tous droits réservés."
      },
      offline: { banner: "Vous êtes hors ligne. Interactions limitées." },
      urgency: {
        line: "Version d’aperçu : chiffres illustratifs et certains visuels sont des substituts de démonstration. Données vérifiées et ressources complètes disponibles dans nos documents investisseurs."
      },
      auth: {
        login: "Connexion",
        signup: "S’inscrire",
        logout: "Déconnexion",
        email: "Email",
        password: "Mot de passe",
        name: "Nom complet",
        phone: "Numéro de téléphone",
        sector: "Secteur principal",
        agriculture: "Agriculture",
        mining: "Mines",
        both: "Les deux",
        other: "Autre",
        dont_have_account: "Vous n’avez pas de compte ?",
        already_have_account: "Vous avez déjà un compte ?",
        welcome_back: "Bon retour",
        create_account: "Créez votre compte",
        error_invalid_email: "Adresse email invalide",
        error_password_too_short: "Le mot de passe doit faire au moins 6 caractères",
        error_generic: "Une erreur est survenue. Veuillez réessayer.",
        loading: "Chargement...",
        onboarding: {
          welcome: "Bienvenue sur Ala !",
          setup_profile: "Configurons votre profil pour commencer."
        },
        groups: {
          title: "Groupes Communautaires",
          create: "Créer un groupe",
          create_title: "Créer un nouveau groupe",
          search_placeholder: "Rechercher des groupes...",
          no_groups: "Aucun groupe trouvé. Créez-en un !",
          submit_create: "Créer un groupe",
          created_success: "Groupe créé avec succès !"
        },
        check_email: "Vérifiez vos e-mails",
        check_email_desc: "Nous avons envoyé un lien de vérification à votre adresse e-mail. Veuillez vérifier votre compte pour continuer."
      }
    }
  }
};
const saved = typeof window !== "undefined" ? localStorage.getItem("ala_lang") : null;
i18n.use(initReactI18next).init({
  resources,
  lng: saved || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});
const supabaseUrl = "https://ktunjttwbqyipypebaae.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0dW5qdHR3YnF5aXB5cGViYWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTgxNDYsImV4cCI6MjA4NTc3NDE0Nn0.DmKji0hhYXCSAndlH8Jv6fEwoVaphot8mM7PwtjBOo8";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Profile fetch error:", err);
      return null;
    }
  };
  const checkAdmin = async (userId) => {
    try {
      const { data } = await supabase.from("admin_users").select("role").eq("user_id", userId).maybeSingle();
      return !!data;
    } catch {
      return false;
    }
  };
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: session2 } } = await supabase.auth.getSession();
      if (session2?.user) {
        setSession(session2);
        setUser(session2.user);
        const [userProfile, adminStatus] = await Promise.all([
          fetchProfile(session2.user.id),
          checkAdmin(session2.user.id)
        ]);
        setProfile(userProfile);
        setIsAdmin(adminStatus);
      }
      setLoading(false);
    };
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session2) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      if (session2?.user) {
        const [userProfile, adminStatus] = await Promise.all([
          fetchProfile(session2.user.id),
          checkAdmin(session2.user.id)
        ]);
        setProfile(userProfile);
        setIsAdmin(adminStatus);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    initAuth();
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  const signUp = async (data) => {
    return supabase.auth.signUp(data);
  };
  const signIn = async (data) => {
    return supabase.auth.signInWithPassword(data);
  };
  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://ala-mg.com/onboarding"
      }
    });
  };
  const signOut = async () => {
    setProfile(null);
    return supabase.auth.signOut();
  };
  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id);
      setProfile(userProfile);
    }
  };
  const value = {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile,
    user,
    session,
    profile,
    loading,
    isAdmin,
    isOnboarded: !!profile
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
};
const useAuth = () => {
  return useContext(AuthContext);
};
const ToastContext = createContext({});
const useToast = () => useContext(ToastContext);
const TOAST_TYPES = {
  success: { icon: CheckCircle, bg: "#059669", border: "#10b981" },
  error: { icon: AlertCircle, bg: "#dc2626", border: "#ef4444" },
  info: { icon: Info, bg: "#0B3D2E", border: "#4ADE80" }
};
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info", duration = 5e3) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const toast = {
    success: (msg, duration) => addToast(msg, "success", duration),
    error: (msg, duration) => addToast(msg, "error", duration),
    info: (msg, duration) => addToast(msg, "info", duration)
  };
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value: { toast, removeToast }, children: [
    children,
    /* @__PURE__ */ jsx("div", { style: {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      pointerEvents: "none"
    }, children: /* @__PURE__ */ jsx(AnimatePresence, { children: toasts.map(({ id, message, type }) => {
      const config = TOAST_TYPES[type];
      const Icon2 = config.icon;
      return /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 100, scale: 0.9 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: 100, scale: 0.9 },
          style: {
            background: config.bg,
            border: `1px solid ${config.border}`,
            borderRadius: "12px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "white",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3)",
            maxWidth: "360px",
            pointerEvents: "auto",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          },
          children: [
            /* @__PURE__ */ jsx(Icon2, { style: { width: "20px", height: "20px", flexShrink: 0 } }),
            /* @__PURE__ */ jsx("span", { style: { flex: 1, fontSize: "14px", lineHeight: "1.4" }, children: message }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeToast(id),
                style: {
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: /* @__PURE__ */ jsx(X, { style: { width: "16px", height: "16px", color: "white" } })
              }
            )
          ]
        },
        id
      );
    }) }) })
  ] });
};
function LanguageWatcher() {
  useEffect(() => {
    const updateLang = (lng) => {
      document.documentElement.lang = lng || "en";
    };
    updateLang(i18n.language);
    i18n.on("languageChanged", updateLang);
    return () => i18n.off("languageChanged", updateLang);
  }, []);
  return null;
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx("meta", {
        name: "description",
        content: "Ala unites Madagascar’s mining and agricultural sectors to regenerate land, empower communities, and create bankable, sustainable returns."
      }), /* @__PURE__ */ jsx("meta", {
        name: "theme-color",
        content: "#0B3D2E"
      }), /* @__PURE__ */ jsx("meta", {
        name: "color-scheme",
        content: "dark light"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/svg+xml",
        href: "/icons/ala.svg"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/png",
        href: "/icons/ala.png"
      }), /* @__PURE__ */ jsx("link", {
        rel: "manifest",
        href: "/manifest.webmanifest"
      }), /* @__PURE__ */ jsx("title", {
        children: "Ala Regenerate Madagascar's Future"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function Root() {
  return /* @__PURE__ */ jsx(HelmetProvider, {
    children: /* @__PURE__ */ jsx(ToastProvider, {
      children: /* @__PURE__ */ jsxs(AuthProvider, {
        children: [/* @__PURE__ */ jsx(LanguageWatcher, {}), /* @__PURE__ */ jsx(Outlet, {})]
      })
    })
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const PublicLayout = UNSAFE_withComponentProps(function PublicLayout2() {
  const {
    user,
    isOnboarded,
    loading
  } = useAuth();
  if (loading) return /* @__PURE__ */ jsx(Outlet, {});
  if (user) {
    if (!isOnboarded) return /* @__PURE__ */ jsx(Navigate, {
      to: "/onboarding"
    });
    return /* @__PURE__ */ jsx(Navigate, {
      to: "/feed"
    });
  }
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PublicLayout
}, Symbol.toStringTag, { value: "Module" }));
function AnnouncementBar() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx("div", { style: { background: "#0F4D3A", color: "#EAE7E2", padding: "8px 12px", textAlign: "center", fontSize: 12, letterSpacing: 0.3 }, children: t("urgency.line") });
}
function LanguageToggle() {
  const { i18n: i18n2, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const active = (i18n2.language || "en").slice(0, 2);
  const setLang = (lng) => {
    i18n2.changeLanguage(lng);
    if (typeof window !== "undefined") localStorage.setItem("ala_lang", lng);
    setOpen(false);
  };
  const btnStyle = { border: "1px solid #2E5E4E", background: "#2E5E4E", color: "#EAE7E2", padding: "6px 10px", borderRadius: 6, minWidth: 54, textAlign: "left" };
  const menuStyle = { position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#0E3F31", border: "1px solid #1E5A49", borderRadius: 8, overflow: "hidden", minWidth: 120, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" };
  const itemStyle = (code) => ({ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", background: active === code ? "#1B4D3E" : "transparent", color: "#EAE7E2", border: "none", cursor: "pointer" });
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx("button", { "aria-haspopup": "listbox", "aria-expanded": open, onClick: () => setOpen((v) => !v), style: btnStyle, children: active.toUpperCase() }),
    open && /* @__PURE__ */ jsxs("div", { role: "listbox", style: menuStyle, children: [
      /* @__PURE__ */ jsxs("button", { role: "option", "aria-label": t("nav.lang_en"), onClick: () => setLang("en"), style: itemStyle("en"), children: [
        "EN — ",
        t("nav.lang_en")
      ] }),
      /* @__PURE__ */ jsxs("button", { role: "option", "aria-label": t("nav.lang_mg"), onClick: () => setLang("mg"), style: itemStyle("mg"), children: [
        "MG — ",
        t("nav.lang_mg")
      ] }),
      /* @__PURE__ */ jsxs("button", { role: "option", "aria-label": t("nav.lang_fr"), onClick: () => setLang("fr"), style: itemStyle("fr"), children: [
        "FR — ",
        t("nav.lang_fr")
      ] })
    ] })
  ] });
}
function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);
  const canInstall = !!deferredPrompt && !installed;
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return null;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return choice;
  }, [deferredPrompt]);
  return { canInstall, installed, promptInstall };
}
function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { canInstall, promptInstall } = usePWAInstall();
  return /* @__PURE__ */ jsx("header", { style: { position: "sticky", top: 0, zIndex: 30, backdropFilter: "saturate(140%) blur(6px)" }, children: /* @__PURE__ */ jsxs("nav", { "aria-label": "Main navigation", style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px", maxWidth: 1100, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("a", { href: "#", style: { display: "flex", alignItems: "center", textDecoration: "none", overflow: "visible", lineHeight: 0 }, children: /* @__PURE__ */ jsx(
      "span",
      {
        "aria-label": "Ala",
        role: "img",
        style: {
          width: 28,
          height: 28,
          display: "block",
          background: "#EAE7E2",
          WebkitMask: "url(/icons/ala.svg) no-repeat center / contain",
          mask: "url(/icons/ala.svg) no-repeat center / contain",
          transform: "scale(2.4)",
          transformOrigin: "center"
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsx(LanguageToggle, {}),
      user ? /* @__PURE__ */ jsx(
        Link,
        {
          to: "/feed",
          style: { background: "#4ADE80", color: "#0B3D2E", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, textDecoration: "none" },
          children: "Go to Feed"
        }
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          to: "/login",
          style: { background: "transparent", color: "#EAE7E2", border: "1px solid #2E5E4E", padding: "8px 16px", borderRadius: 8, fontWeight: 700, textDecoration: "none" },
          children: t("auth.login")
        }
      ),
      canInstall && /* @__PURE__ */ jsx("button", { onClick: () => promptInstall(), style: { background: "#C9A66B", color: "#0B3D2E", border: "1px solid #C9A66B", padding: "8px 12px", borderRadius: 8, fontWeight: 700 }, children: t("nav.install") })
    ] })
  ] }) });
}
function useSpeech(defaultLang = "en-US") {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const supported = !!synth;
  const utteranceRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    if (!supported) return;
    const updateVoices = () => setVoices(synth.getVoices());
    updateVoices();
    synth.addEventListener("voiceschanged", updateVoices);
    return () => synth.removeEventListener("voiceschanged", updateVoices);
  }, [supported, synth]);
  const getVoice = useMemo(() => {
    return (lang) => {
      if (!voices.length) return null;
      return voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(lang.split("-")[0])) || voices[0];
    };
  }, [voices]);
  const speak = useCallback(
    (text, lang = defaultLang, rate = 1) => {
      if (!supported || !text) return;
      if (synth.speaking) synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      const voice = getVoice(lang);
      if (voice) u.voice = voice;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      utteranceRef.current = u;
      synth.speak(u);
    },
    [supported, synth, getVoice, defaultLang]
  );
  const cancel = useCallback(() => {
    if (!supported) return;
    synth.cancel();
    setSpeaking(false);
  }, [supported, synth]);
  return { supported, speaking, speak, cancel, voices };
}
function ClientParallax({ children, bgImage, strength }) {
  const [ParallaxComp, setParallaxComp] = useState(null);
  useEffect(() => {
    import("react-parallax").then((mod) => {
      setParallaxComp(() => mod.Parallax);
    });
  }, []);
  if (ParallaxComp) {
    return /* @__PURE__ */ jsx(ParallaxComp, { bgImage, strength, children });
  }
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx("img", { src: bgImage, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }),
    children
  ] });
}
function Hero() {
  const prefersReduced = useReducedMotion();
  const { t, i18n: i18n2 } = useTranslation();
  const { supported, speaking, speak, cancel } = useSpeech();
  const { canInstall, promptInstall } = usePWAInstall();
  const [faded, setFaded] = useState(prefersReduced);
  const handleListen = () => {
    if (!supported) return;
    if (speaking) return cancel();
    const lang = i18n2.language?.startsWith("mg") ? "fr-FR" : "en-US";
    speak(t("hero.voice_text"), lang, 1);
  };
  const handleEnded = useCallback(() => {
    setFaded(true);
  }, []);
  return /* @__PURE__ */ jsx("section", { style: { position: "relative" }, children: /* @__PURE__ */ jsx(ClientParallax, { bgImage: "/images/After.png", strength: prefersReduced ? 0 : 200, children: /* @__PURE__ */ jsxs("div", { style: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx(
      motion.video,
      {
        poster: "/images/After.png",
        playsInline: true,
        muted: true,
        autoPlay: true,
        preload: "auto",
        onEnded: handleEnded,
        initial: { opacity: 1 },
        animate: { opacity: faded ? prefersReduced ? 0.3 : 0 : 1 },
        transition: { duration: 1.8, ease: "easeOut" },
        style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "contrast(0.95)" },
        children: /* @__PURE__ */ jsx("source", { src: "/images/Before.mp4", type: "video/mp4" })
      },
      "before-video"
    ),
    /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,61,46,0.65) 0%, rgba(11,61,46,0.85) 60%, rgba(11,61,46,1) 100%)" } }),
    /* @__PURE__ */ jsxs("div", { style: { position: "relative", padding: "64px 20px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx(
        motion.h1,
        {
          initial: { y: 20, opacity: 0 },
          whileInView: { y: 0, opacity: 1 },
          transition: { duration: 0.6 },
          style: { fontSize: "clamp(28px,5vw,56px)", lineHeight: 1.05, color: "#F2F1EE", fontWeight: 800, letterSpacing: -0.5 },
          children: t("hero.title")
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { y: 20, opacity: 0 },
          whileInView: { y: 0, opacity: 1 },
          transition: { duration: 0.6, delay: 0.1 },
          style: { color: "#D7D4CE", margin: "14px auto 26px", maxWidth: 820, fontSize: "clamp(14px,2.3vw,20px)" },
          children: t("hero.subtitle")
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          transition: { duration: 0.6, delay: 0.2 },
          style: { display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" },
          children: [
            /* @__PURE__ */ jsx("button", { onClick: () => canInstall ? promptInstall() : null, style: { background: "#C9A66B", color: "#0B3D2E", border: "1px solid #C9A66B", padding: "12px 16px", borderRadius: 10, fontWeight: 700 }, children: t("hero.cta_install") }),
            /* @__PURE__ */ jsx(Link, { to: "/signup", style: { background: "#4ADE80", color: "#0B3D2E", border: "none", padding: "12px 16px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }, children: t("hero.cta_invest") }),
            /* @__PURE__ */ jsxs("button", { onClick: handleListen, "aria-pressed": speaking, style: { background: "transparent", color: "#F2F1EE", border: "1px solid #2E5E4E", padding: "12px 16px", borderRadius: 10, fontWeight: 700 }, children: [
              speaking ? "⏸ " : "▶ ",
              " ",
              t("hero.listen")
            ] })
          ]
        }
      )
    ] })
  ] }) }) });
}
function Demonstration() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx("section", { style: { padding: "48px 20px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }, children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      viewport: { once: true },
      children: [
        /* @__PURE__ */ jsx("h2", { style: { color: "#F2F1EE", fontSize: "clamp(22px,3.2vw,36px)", margin: "0 0 12px" }, children: t("demonstration.title") }),
        /* @__PURE__ */ jsx("p", { style: { color: "#CFCBC3", fontSize: "clamp(14px,1.2vw,18px)", maxWidth: 600, margin: "0 auto 32px" }, children: t("demonstration.subtitle") }),
        /* @__PURE__ */ jsx("div", { style: {
          position: "relative",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          border: "1px solid #1E5A49",
          background: "#000"
        }, children: /* @__PURE__ */ jsx(
          "video",
          {
            src: "/images/demosala.webm",
            controls: true,
            playsInline: true,
            style: { width: "100%", height: "auto", display: "block" }
          }
        ) })
      ]
    }
  ) });
}
const cardStyle = {
  background: "#0E3F31",
  border: "1px solid #1E5A49",
  borderRadius: 14,
  padding: 18,
  color: "#EAE7E2",
  minHeight: 140
};
function Icon({ idx }) {
  const props = { width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (idx) {
    case 0:
      return /* @__PURE__ */ jsxs("svg", { ...props, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M3 17l6-6 4 4 7-7" }),
        /* @__PURE__ */ jsx("path", { d: "M14 8h7v7" })
      ] });
    case 1:
      return /* @__PURE__ */ jsxs("svg", { ...props, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" }),
        /* @__PURE__ */ jsx("path", { d: "M9 12l2 2 4-4" })
      ] });
    case 2:
      return /* @__PURE__ */ jsxs("svg", { ...props, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M11 21C7 21 3 17 3 13 3 6 12 3 21 3c0 9-3 18-10 18z" }),
        /* @__PURE__ */ jsx("path", { d: "M20 4c-5 5-9 9-12 12" })
      ] });
    case 3:
      return /* @__PURE__ */ jsxs("svg", { ...props, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M3 21V9l6 3V9l6 3V6l6 2v13H3z" }),
        /* @__PURE__ */ jsx("path", { d: "M7 21v-4M11 21v-4M15 21v-4M19 21v-4" })
      ] });
    case 4:
      return /* @__PURE__ */ jsxs("svg", { ...props, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M8 11l3-3 3 3 3-3 3 3" }),
        /* @__PURE__ */ jsx("path", { d: "M2 12l4-4 4 4M10 12l2 2 2-2" }),
        /* @__PURE__ */ jsx("path", { d: "M2 16l4 4h6l4-4" })
      ] });
    default:
      return /* @__PURE__ */ jsxs("svg", { ...props, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "7", r: "4" }),
        /* @__PURE__ */ jsx("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
        /* @__PURE__ */ jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
      ] });
  }
}
function Features() {
  const { t } = useTranslation();
  const items = t("features.items", { returnObjects: true });
  return /* @__PURE__ */ jsxs("section", { style: { padding: "48px 20px", maxWidth: 1100, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("h2", { style: { color: "#F2F1EE", fontSize: "clamp(22px,3.2vw,36px)", margin: "0 0 18px" }, children: t("features.title") }),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }, children: items.map((it, idx) => /* @__PURE__ */ jsxs(motion.div, { initial: { y: 20, opacity: 0 }, whileInView: { y: 0, opacity: 1 }, viewport: { once: true }, transition: { duration: 0.4, delay: idx * 0.05 }, style: cardStyle, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 36, height: 36, borderRadius: 8, background: "#2E5E4E", display: "grid", placeItems: "center", color: "#C9A66B" }, children: /* @__PURE__ */ jsx(Icon, { idx }) }),
        /* @__PURE__ */ jsx("div", { style: { fontWeight: 700 }, children: it.title })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { color: "#CFCBC3", fontSize: 14 }, children: it.desc })
    ] }, idx)) })
  ] });
}
function CountUp({ target, duration = 1500 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "-20% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return /* @__PURE__ */ jsx("span", { ref, children: value.toLocaleString() });
}
function Impact() {
  const { t } = useTranslation();
  const slides = [
    { key: "hectaresRestored", value: 545, note: t("impact.hectaresRestored") },
    { key: "farmYieldIncrease", value: 3, note: t("impact.farmYieldIncrease") + " ×" },
    { key: "co2Sequestered", value: 12e4, note: t("impact.co2Sequestered") },
    { key: "communitiesEmpowered", value: 15e3, note: t("impact.communitiesEmpowered") }
  ];
  const media = {
    hectaresRestored: {
      video: "/images/hectaresrestored.mp4",
      poster: "/images/hectaresrestored.jpeg",
      alt: "Restored hectares aerial"
    },
    farmYieldIncrease: {
      video: "/images/farmyieldincrease.mp4",
      poster: "/images/farmyieldincrease.jpeg",
      alt: "Higher farm yields"
    },
    co2Sequestered: {
      video: "/images/co2esequestered%20carbon.mp4",
      poster: "/images/co2esequestered%20carbon.jpeg",
      alt: "Carbon sequestration visuals"
    },
    communitiesEmpowered: {
      video: "/images/communitiesempowered.mp4",
      poster: "/images/communitiesempowered.jpeg",
      alt: "Communities empowered at hubs"
    }
  };
  return /* @__PURE__ */ jsxs("section", { style: { padding: "48px 20px", maxWidth: 1100, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("h2", { style: { color: "#F2F1EE", fontSize: "clamp(22px,3.2vw,36px)", margin: "0 0 18px" }, children: t("impact.title") }),
    /* @__PURE__ */ jsx("div", { className: "ala-carousel", mask: "true", style: { ["--items"]: slides.length }, children: slides.map((s, idx) => /* @__PURE__ */ jsxs("article", { style: { ["--i"]: idx }, children: [
      /* @__PURE__ */ jsx(
        "video",
        {
          poster: media[s.key]?.poster,
          playsInline: true,
          muted: true,
          autoPlay: true,
          loop: true,
          preload: "metadata",
          "aria-label": media[s.key]?.alt,
          children: /* @__PURE__ */ jsx("source", { src: media[s.key]?.video, type: "video/mp4" })
        },
        s.key
      ),
      /* @__PURE__ */ jsx("h3", { children: s.note }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: "clamp(28px,8vw,56px)", fontWeight: 800, color: "#C9A66B", margin: "4px 0 8px" }, children: /* @__PURE__ */ jsx(CountUp, { target: s.value }) }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 12, color: "#A7A39B" }, children: "Illustrative metric" }),
        /* @__PURE__ */ jsx("a", { href: "#impact-details", children: "Learn more" })
      ] })
    ] }, idx)) }),
    /* @__PURE__ */ jsx("div", { style: { color: "#A7A39B", fontSize: 12, marginTop: 12 }, children: t("impact.note") })
  ] });
}
function HowItWorks() {
  const { t } = useTranslation();
  const steps = t("how.steps", { returnObjects: true });
  return /* @__PURE__ */ jsxs("section", { style: { padding: "48px 20px", maxWidth: 1100, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("h2", { style: { color: "#F2F1EE", fontSize: "clamp(22px,3.2vw,36px)", margin: "0 0 18px" }, children: t("how.title") }),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gridAutoFlow: "column", gridAutoColumns: "minmax(260px,1fr)", overflowX: "auto", gap: 14, scrollSnapType: "x mandatory", paddingBottom: 8 }, children: steps.map((s, idx) => /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: idx * 0.05 }, style: { background: "#0E3F31", border: "1px solid #1E5A49", borderRadius: 14, padding: 18, scrollSnapAlign: "start", minHeight: 160 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontWeight: 800, color: "#F2F1EE", marginBottom: 6 }, children: s.title }),
      /* @__PURE__ */ jsx("div", { style: { color: "#CFCBC3", fontSize: 14 }, children: s.desc })
    ] }, idx)) })
  ] });
}
function Testimonials() {
  const { t } = useTranslation();
  const items = t("testimonials.items", { returnObjects: true });
  return /* @__PURE__ */ jsxs("section", { style: { padding: "48px 20px", maxWidth: 1100, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("h2", { style: { color: "#F2F1EE", fontSize: "clamp(22px,3.2vw,36px)", margin: "0 0 18px" }, children: t("testimonials.title") }),
    /* @__PURE__ */ jsx("div", { className: "ala-carousel", mask: "true", style: { ["--items"]: items.length }, children: items.map((x, idx) => /* @__PURE__ */ jsxs("article", { style: { ["--i"]: idx }, children: [
      /* @__PURE__ */ jsx("img", { src: `/images/partner${idx % 3 + 1}.jpg`, alt: `${x.name} — ${x.role}` }),
      /* @__PURE__ */ jsxs("h3", { children: [
        x.name,
        " — ",
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 400, color: "#CFCBC3" }, children: x.role })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { fontSize: 16, lineHeight: 1.5 }, children: [
          "“",
          x.quote,
          "”"
        ] }),
        /* @__PURE__ */ jsx("a", { href: "mailto:tsikyloharanontsoa@ala-mg.com?subject=Reference%20check", children: "Contact" })
      ] })
    ] }, idx)) })
  ] });
}
function Footer() {
  const { t } = useTranslation();
  const { canInstall, promptInstall } = usePWAInstall();
  return /* @__PURE__ */ jsx("footer", { id: "footer", style: { padding: "36px 20px", maxWidth: 1100, margin: "0 auto" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: 16, background: "#0E3F31", border: "1px solid #1E5A49", borderRadius: 14, padding: 18, color: "#EAE7E2" }, children: [
    /* @__PURE__ */ jsxs("nav", { "aria-label": "Footer navigation", style: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontWeight: 800 }, children: "Ala" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12 }, children: [
        /* @__PURE__ */ jsx("a", { href: "mailto:tsikyloharanontsoa@ala-mg.com?subject=Investor%20Deck%20Request", style: { color: "#C9A66B", textDecoration: "none" }, children: t("footer.request_deck") }),
        /* @__PURE__ */ jsxs("a", { href: "mailto:tsikyloharanontsoa@ala-mg.com", style: { color: "#EAE7E2", textDecoration: "none" }, children: [
          t("footer.email_label"),
          ": ",
          t("footer.email_value")
        ] }),
        canInstall && /* @__PURE__ */ jsx("button", { onClick: () => promptInstall(), style: { background: "#C9A66B", color: "#0B3D2E", border: "1px solid #C9A66B", padding: "8px 12px", borderRadius: 8, fontWeight: 700 }, children: t("nav.install") })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { color: "#A7A39B", fontSize: 12 }, children: t("footer.rights") })
  ] }) });
}
function OfflineIndicator() {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setIsMounted(true);
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  if (!isMounted || online) return null;
  return /* @__PURE__ */ jsx("div", { style: { position: "fixed", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "#5E3B2E", color: "#F6F3EE", padding: "8px 12px", borderRadius: 8, border: "1px solid #7A5646", zIndex: 50, fontSize: 12 }, children: t("offline.banner") });
}
const leaflet = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const HUBS = [
  { region: "SAVA", name: "Sambava", lat: -14.27, lon: 50.17 },
  { region: "SAVA", name: "Antalaha", lat: -14.91, lon: 50.28 },
  { region: "SAVA", name: "Vohemar", lat: -13.37, lon: 50 },
  { region: "SAVA", name: "Andapa", lat: -14.66, lon: 49.65 },
  { region: "Anosy", name: "Taolagnaro (Fort Dauphin)", lat: -25.04, lon: 46.99 },
  { region: "Analanjirofo", name: "Mananara (Nord)", lat: -16.17, lon: 49.77 },
  { region: "Analanjirofo", name: "Maroantsetra", lat: -15.43, lon: 49.75 },
  { region: "Toamasina", name: "Toamasina (general)", lat: -18.15, lon: 49.4 },
  { region: "Toamasina", name: "Ambatovy Mine Area", lat: -18.82, lon: 48.3 },
  { region: "Vakinankaratra", name: "Antsirabe", lat: -19.87, lon: 47.03 }
];
function MapPreview() {
  const mapEl = useRef(null);
  useEffect(() => {
    if (!mapEl.current) return;
    let map = null;
    let isMounted = true;
    import("leaflet").then((LModule) => {
      if (!isMounted) return;
      const L = LModule.default || LModule;
      const center = [-19, 46.5];
      const zoom = 5.5;
      map = L.map(mapEl.current, { scrollWheelZoom: false }).setView(center, zoom);
      const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
      });
      tiles.addTo(map);
      HUBS.forEach((h) => {
        const marker = L.circleMarker([h.lat, h.lon], {
          radius: 6,
          color: "#B91C1C",
          // red stroke
          weight: 2,
          fillColor: "#EF4444",
          // red fill
          fillOpacity: 0.85
        }).addTo(map);
        marker.bindPopup(`${h.name} — ${h.region}<br/>Lat ${h.lat.toFixed(2)}, Lon ${h.lon.toFixed(2)}`);
      });
    });
    return () => {
      isMounted = false;
      if (map) map.remove();
    };
  }, []);
  return /* @__PURE__ */ jsxs("section", { style: { padding: "48px 20px", maxWidth: 1100, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("h2", { style: { color: "#F2F1EE", fontSize: "clamp(22px,3.2vw,36px)", margin: "0 0 18px" }, children: "Restoration Hubs — Preview" }),
    /* @__PURE__ */ jsx("div", { style: { position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid #1E5A49" }, children: /* @__PURE__ */ jsx("div", { ref: mapEl, style: { height: 400, width: "100%" } }) }),
    /* @__PURE__ */ jsx("div", { style: { color: "#A7A39B", fontSize: 12, marginTop: 8 }, children: "Tiles: © OpenStreetMap contributors. Hub pins shown are approximate placeholders pending field verification." })
  ] });
}
const SITE_URL = "https://ala-mg.com";
const DEFAULT_IMAGE = `${SITE_URL}/images/After.png`;
const SITE_NAME = "Ala";
function SEOHead({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = null
}) {
  const { i18n: i18n2 } = useTranslation();
  const lang = i18n2.language || "en";
  const canonicalUrl = `${SITE_URL}${path}`;
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }),
    noindex && /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" }),
    /* @__PURE__ */ jsx("html", { lang }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "en", href: canonicalUrl }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "mg", href: canonicalUrl }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "fr", href: canonicalUrl }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "x-default", href: canonicalUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: canonicalUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: image }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE_NAME }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: lang === "mg" ? "mg_MG" : lang === "fr" ? "fr_FR" : "en_US" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: title }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: image }),
    jsonLd && /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(jsonLd) })
  ] });
}
const LANDING_JSON_LD = [{
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ala",
  url: "https://ala-mg.com",
  logo: "https://ala-mg.com/icons/ala.png",
  description: "Ala is Madagascar's tech-enabled ecosystem uniting mining and agricultural sectors to regenerate land, empower communities, and create bankable, sustainable returns.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "tsikyloharanontsoa@ala-mg.com",
    contactType: "investor relations"
  },
  sameAs: []
}, {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{
    "@type": "ListItem",
    position: 1,
    name: "Home",
    item: "https://ala-mg.com/"
  }]
}];
function Landing() {
  return /* @__PURE__ */ jsxs("div", {
    style: {
      background: "#0B3D2E"
    },
    children: [/* @__PURE__ */ jsx(SEOHead, {
      title: "Ala — Regenerate Madagascar's Future | Unite Mining & Farming",
      description: "Ala unites Madagascar's mining and agricultural sectors to regenerate land, empower communities, and create bankable, sustainable returns. Invest now.",
      path: "/",
      jsonLd: LANDING_JSON_LD
    }), /* @__PURE__ */ jsx(AnnouncementBar, {}), /* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("main", {
      role: "main",
      children: [/* @__PURE__ */ jsx(Hero, {}), /* @__PURE__ */ jsx(Demonstration, {}), /* @__PURE__ */ jsx(Features, {}), /* @__PURE__ */ jsx(Impact, {}), /* @__PURE__ */ jsx(MapPreview, {}), /* @__PURE__ */ jsx(HowItWorks, {}), /* @__PURE__ */ jsx(Testimonials, {})]
    }), /* @__PURE__ */ jsx(Footer, {}), /* @__PURE__ */ jsx(OfflineIndicator, {})]
  });
}
const Landing$1 = UNSAFE_withComponentProps(Landing);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Landing$1
}, Symbol.toStringTag, { value: "Module" }));
const validateEmail$1 = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const Login = () => {
  const {
    t
  } = useTranslation();
  const {
    signIn,
    signInWithGoogle
  } = useAuth();
  const {
    toast
  } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  useEffect(() => {
    if (emailTouched) {
      if (!email) setEmailError(t("auth.validation.email_required"));
      else if (!validateEmail$1(email)) setEmailError(t("auth.validation.email_invalid"));
      else setEmailError("");
    }
  }, [email, emailTouched, t]);
  useEffect(() => {
    if (passwordTouched && !password) setPasswordError(t("auth.validation.password_required"));
    else setPasswordError("");
  }, [password, passwordTouched, t]);
  const isFormValid = validateEmail$1(email) && password.length > 0;
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!isFormValid) return;
    setLoading(true);
    const {
      error: signInError
    } = await signIn({
      email,
      password
    });
    if (signInError) {
      toast.error(signInError.message);
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const {
      error
    } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };
  const inputBase = {
    width: "100%",
    background: "#1A5D4A",
    border: "1px solid #2E7D67",
    color: "#F2F1EE",
    padding: "14px 14px 14px 46px",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  };
  const getStyle = (touched, error, value) => touched ? error ? {
    ...inputBase,
    borderColor: "#ef4444"
  } : value ? {
    ...inputBase,
    borderColor: "#4ADE80"
  } : inputBase : inputBase;
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0B3D2E 0%, #0D4D3A 50%, #0B3D2E 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', sans-serif"
    },
    children: [/* @__PURE__ */ jsx(SEOHead, {
      title: "Sign In — Ala | Community Platform for Madagascar",
      description: "Sign in to your Ala account to access the community feed, marketplace, resource hub, and more. Join the regenerative movement.",
      path: "/login"
    }), /* @__PURE__ */ jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      style: {
        width: "100%",
        maxWidth: "420px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(13, 77, 58, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid #2E7D67",
          borderRadius: "24px",
          padding: "40px 32px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            textAlign: "center",
            marginBottom: "32px"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              width: "56px",
              height: "56px",
              margin: "0 auto 20px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4ADE80, #22C55E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsx(LogIn, {
              style: {
                width: "28px",
                height: "28px",
                color: "#0B3D2E"
              }
            })
          }), /* @__PURE__ */ jsx("h1", {
            style: {
              fontSize: "26px",
              fontWeight: "700",
              color: "#F2F1EE",
              marginBottom: "8px"
            },
            children: t("auth.welcome_back")
          }), /* @__PURE__ */ jsx("p", {
            style: {
              color: "#A7C7BC",
              fontSize: "15px"
            },
            children: t("auth.login_subtitle")
          })]
        }), /* @__PURE__ */ jsx("button", {
          onClick: handleGoogleLogin,
          disabled: googleLoading,
          style: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            background: "#F2F1EE",
            border: "none",
            color: "#0B3D2E",
            fontWeight: "600",
            padding: "14px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "15px",
            marginBottom: "24px"
          },
          children: googleLoading ? /* @__PURE__ */ jsx(Loader2, {
            style: {
              width: "20px",
              height: "20px",
              animation: "spin 1s linear infinite"
            }
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs("svg", {
              style: {
                width: "20px",
                height: "20px"
              },
              viewBox: "0 0 24 24",
              children: [/* @__PURE__ */ jsx("path", {
                fill: "#4285F4",
                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              }), /* @__PURE__ */ jsx("path", {
                fill: "#34A853",
                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              }), /* @__PURE__ */ jsx("path", {
                fill: "#FBBC05",
                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              }), /* @__PURE__ */ jsx("path", {
                fill: "#EA4335",
                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              })]
            }), t("auth.continue_with_google")]
          })
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              flex: 1,
              height: "1px",
              background: "#2E7D67"
            }
          }), /* @__PURE__ */ jsx("span", {
            style: {
              color: "#6B9B8A",
              fontSize: "13px",
              textTransform: "uppercase"
            },
            children: t("auth.or")
          }), /* @__PURE__ */ jsx("div", {
            style: {
              flex: 1,
              height: "1px",
              background: "#2E7D67"
            }
          })]
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleLogin,
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "14px",
                fontWeight: "500",
                color: "#D7D4CE",
                marginBottom: "8px"
              },
              children: [t("auth.email"), " ", emailTouched && !emailError && email && /* @__PURE__ */ jsx(CheckCircle, {
                style: {
                  width: "16px",
                  height: "16px",
                  color: "#4ADE80"
                }
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative"
              },
              children: [/* @__PURE__ */ jsx(Mail, {
                style: {
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#6B9B8A"
                }
              }), /* @__PURE__ */ jsx("input", {
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                onBlur: () => setEmailTouched(true),
                placeholder: "you@example.com",
                style: getStyle(emailTouched, emailError, email)
              })]
            }), emailError && /* @__PURE__ */ jsxs(motion.p, {
              initial: {
                opacity: 0
              },
              animate: {
                opacity: 1
              },
              style: {
                color: "#ef4444",
                fontSize: "13px",
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              },
              children: [/* @__PURE__ */ jsx(AlertCircle, {
                style: {
                  width: "14px",
                  height: "14px"
                }
              }), emailError]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "14px",
                fontWeight: "500",
                color: "#D7D4CE",
                marginBottom: "8px"
              },
              children: [t("auth.password"), " ", passwordTouched && !passwordError && password && /* @__PURE__ */ jsx(CheckCircle, {
                style: {
                  width: "16px",
                  height: "16px",
                  color: "#4ADE80"
                }
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative"
              },
              children: [/* @__PURE__ */ jsx(Lock, {
                style: {
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#6B9B8A"
                }
              }), /* @__PURE__ */ jsx("input", {
                type: "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                onBlur: () => setPasswordTouched(true),
                placeholder: "••••••••",
                style: getStyle(passwordTouched, passwordError, password)
              })]
            }), passwordError && /* @__PURE__ */ jsxs(motion.p, {
              initial: {
                opacity: 0
              },
              animate: {
                opacity: 1
              },
              style: {
                color: "#ef4444",
                fontSize: "13px",
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              },
              children: [/* @__PURE__ */ jsx(AlertCircle, {
                style: {
                  width: "14px",
                  height: "14px"
                }
              }), passwordError]
            })]
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            disabled: loading,
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: isFormValid ? "#4ADE80" : "#2E7D67",
              color: isFormValid ? "#0B3D2E" : "#6B9B8A",
              fontWeight: "600",
              padding: "16px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: loading || !isFormValid ? "not-allowed" : "pointer",
              fontSize: "16px",
              marginTop: "4px",
              opacity: loading ? 0.7 : 1
            },
            children: loading ? /* @__PURE__ */ jsx(Loader2, {
              style: {
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite"
              }
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [t("auth.login"), /* @__PURE__ */ jsx(ArrowRight, {
                style: {
                  width: "20px",
                  height: "20px"
                }
              })]
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("p", {
        style: {
          textAlign: "center",
          color: "#A7C7BC",
          marginTop: "24px",
          fontSize: "15px"
        },
        children: [t("auth.dont_have_account"), " ", /* @__PURE__ */ jsx(Link, {
          to: "/signup",
          style: {
            color: "#4ADE80",
            fontWeight: "600",
            textDecoration: "none"
          },
          children: t("auth.signup")
        })]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } input::placeholder { color: #6B9B8A; } input:focus { border-color: #4ADE80 !important; box-shadow: 0 0 0 3px rgba(74,222,128,0.15) !important; }`
    })]
  });
};
const Login$1 = UNSAFE_withComponentProps(Login);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login$1
}, Symbol.toStringTag, { value: "Module" }));
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
const validatePassword = (password) => {
  return password.length >= 6;
};
const Signup = () => {
  const {
    t
  } = useTranslation();
  const {
    signUp,
    signInWithGoogle
  } = useAuth();
  const {
    toast
  } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  useEffect(() => {
    if (emailTouched) {
      if (!email) {
        setEmailError(t("auth.validation.email_required"));
      } else if (!validateEmail(email)) {
        setEmailError(t("auth.validation.email_invalid"));
      } else {
        setEmailError("");
      }
    }
  }, [email, emailTouched, t]);
  useEffect(() => {
    if (passwordTouched) {
      if (!password) {
        setPasswordError(t("auth.validation.password_required"));
      } else if (!validatePassword(password)) {
        setPasswordError(t("auth.validation.password_min"));
      } else {
        setPasswordError("");
      }
    }
  }, [password, passwordTouched, t]);
  const isFormValid = validateEmail(email) && validatePassword(password);
  const handleSignup = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!isFormValid) return;
    setLoading(true);
    const {
      error: signUpError
    } = await signUp({
      email,
      password
    });
    if (signUpError) {
      toast.error(signUpError.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    const {
      error
    } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };
  const inputBaseStyle = {
    width: "100%",
    background: "#1A5D4A",
    border: "1px solid #2E7D67",
    color: "#F2F1EE",
    padding: "14px 14px 14px 46px",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box"
  };
  const inputErrorStyle = {
    ...inputBaseStyle,
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.15)"
  };
  const inputValidStyle = {
    ...inputBaseStyle,
    borderColor: "#4ADE80"
  };
  const getInputStyle = (touched, error, value) => {
    if (!touched) return inputBaseStyle;
    if (error) return inputErrorStyle;
    if (value) return inputValidStyle;
    return inputBaseStyle;
  };
  if (submitted) {
    return /* @__PURE__ */ jsx("div", {
      style: {
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0B3D2E 0%, #0D4D3A 50%, #0B3D2E 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      },
      children: /* @__PURE__ */ jsxs(motion.div, {
        initial: {
          opacity: 0,
          scale: 0.9
        },
        animate: {
          opacity: 1,
          scale: 1
        },
        style: {
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
          background: "rgba(13, 77, 58, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid #2E7D67",
          borderRadius: "24px",
          padding: "48px 32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
        },
        children: [/* @__PURE__ */ jsx(motion.div, {
          initial: {
            scale: 0
          },
          animate: {
            scale: 1
          },
          transition: {
            delay: 0.2,
            type: "spring",
            stiffness: 200
          },
          style: {
            width: "80px",
            height: "80px",
            margin: "0 auto 24px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 40px -10px rgba(74, 222, 128, 0.5)"
          },
          children: /* @__PURE__ */ jsx(MailCheck, {
            style: {
              width: "40px",
              height: "40px",
              color: "#0B3D2E"
            }
          })
        }), /* @__PURE__ */ jsx("h1", {
          style: {
            fontSize: "28px",
            fontWeight: "700",
            color: "#F2F1EE",
            marginBottom: "12px"
          },
          children: t("auth.check_email")
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#A7C7BC",
            fontSize: "16px",
            marginBottom: "32px",
            lineHeight: "1.6"
          },
          children: t("auth.check_email_desc")
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          },
          children: [/* @__PURE__ */ jsxs(Link, {
            to: "/login",
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#4ADE80",
              color: "#0B3D2E",
              fontWeight: "600",
              padding: "16px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "16px",
              boxShadow: "0 4px 15px -3px rgba(74, 222, 128, 0.4)"
            },
            children: [t("auth.login"), /* @__PURE__ */ jsx(ArrowRight, {
              style: {
                width: "20px",
                height: "20px"
              }
            })]
          }), /* @__PURE__ */ jsx("button", {
            onClick: () => setSubmitted(false),
            style: {
              background: "transparent",
              border: "none",
              color: "#A7C7BC",
              cursor: "pointer",
              fontSize: "14px",
              padding: "8px"
            },
            children: t("auth.try_again")
          })]
        })]
      })
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0B3D2E 0%, #0D4D3A 50%, #0B3D2E 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    children: [/* @__PURE__ */ jsx(SEOHead, {
      title: "Join Ala — Sign Up to Regenerate Madagascar's Future",
      description: "Create your Ala account and join a community uniting mining and agriculture for regenerative impact in Madagascar.",
      path: "/signup"
    }), /* @__PURE__ */ jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      style: {
        width: "100%",
        maxWidth: "420px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(13, 77, 58, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid #2E7D67",
          borderRadius: "24px",
          padding: "40px 32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            textAlign: "center",
            marginBottom: "32px"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              width: "56px",
              height: "56px",
              margin: "0 auto 20px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 40px -10px rgba(74, 222, 128, 0.4)"
            },
            children: /* @__PURE__ */ jsx(Mail, {
              style: {
                width: "28px",
                height: "28px",
                color: "#0B3D2E"
              }
            })
          }), /* @__PURE__ */ jsx("h1", {
            style: {
              fontSize: "26px",
              fontWeight: "700",
              color: "#F2F1EE",
              marginBottom: "8px"
            },
            children: t("auth.create_account")
          }), /* @__PURE__ */ jsx("p", {
            style: {
              color: "#A7C7BC",
              fontSize: "15px"
            },
            children: t("auth.join_community")
          })]
        }), /* @__PURE__ */ jsx("button", {
          onClick: handleGoogleSignup,
          disabled: googleLoading,
          style: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            background: "#F2F1EE",
            border: "none",
            color: "#0B3D2E",
            fontWeight: "600",
            padding: "14px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "15px",
            marginBottom: "24px"
          },
          children: googleLoading ? /* @__PURE__ */ jsx(Loader2, {
            style: {
              width: "20px",
              height: "20px",
              animation: "spin 1s linear infinite"
            }
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs("svg", {
              style: {
                width: "20px",
                height: "20px"
              },
              viewBox: "0 0 24 24",
              children: [/* @__PURE__ */ jsx("path", {
                fill: "#4285F4",
                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              }), /* @__PURE__ */ jsx("path", {
                fill: "#34A853",
                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              }), /* @__PURE__ */ jsx("path", {
                fill: "#FBBC05",
                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              }), /* @__PURE__ */ jsx("path", {
                fill: "#EA4335",
                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              })]
            }), t("auth.continue_with_google")]
          })
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              flex: 1,
              height: "1px",
              background: "#2E7D67"
            }
          }), /* @__PURE__ */ jsx("span", {
            style: {
              color: "#6B9B8A",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            },
            children: t("auth.or")
          }), /* @__PURE__ */ jsx("div", {
            style: {
              flex: 1,
              height: "1px",
              background: "#2E7D67"
            }
          })]
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleSignup,
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "14px",
                fontWeight: "500",
                color: "#D7D4CE",
                marginBottom: "8px"
              },
              children: [t("auth.email"), emailTouched && !emailError && email && /* @__PURE__ */ jsx(CheckCircle, {
                style: {
                  width: "16px",
                  height: "16px",
                  color: "#4ADE80"
                }
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative"
              },
              children: [/* @__PURE__ */ jsx(Mail, {
                style: {
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#6B9B8A"
                }
              }), /* @__PURE__ */ jsx("input", {
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                onBlur: () => setEmailTouched(true),
                placeholder: "you@example.com",
                style: getInputStyle(emailTouched, emailError, email)
              })]
            }), emailError && /* @__PURE__ */ jsxs(motion.p, {
              initial: {
                opacity: 0,
                y: -5
              },
              animate: {
                opacity: 1,
                y: 0
              },
              style: {
                color: "#ef4444",
                fontSize: "13px",
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              },
              children: [/* @__PURE__ */ jsx(AlertCircle, {
                style: {
                  width: "14px",
                  height: "14px"
                }
              }), emailError]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "14px",
                fontWeight: "500",
                color: "#D7D4CE",
                marginBottom: "8px"
              },
              children: [t("auth.password"), passwordTouched && !passwordError && password && /* @__PURE__ */ jsx(CheckCircle, {
                style: {
                  width: "16px",
                  height: "16px",
                  color: "#4ADE80"
                }
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative"
              },
              children: [/* @__PURE__ */ jsx(Lock, {
                style: {
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#6B9B8A"
                }
              }), /* @__PURE__ */ jsx("input", {
                type: "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                onBlur: () => setPasswordTouched(true),
                placeholder: "••••••••",
                style: getInputStyle(passwordTouched, passwordError, password)
              })]
            }), passwordError && /* @__PURE__ */ jsxs(motion.p, {
              initial: {
                opacity: 0,
                y: -5
              },
              animate: {
                opacity: 1,
                y: 0
              },
              style: {
                color: "#ef4444",
                fontSize: "13px",
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              },
              children: [/* @__PURE__ */ jsx(AlertCircle, {
                style: {
                  width: "14px",
                  height: "14px"
                }
              }), passwordError]
            })]
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            disabled: loading,
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: isFormValid ? "#4ADE80" : "#2E7D67",
              color: isFormValid ? "#0B3D2E" : "#6B9B8A",
              fontWeight: "600",
              padding: "16px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: loading || !isFormValid ? "not-allowed" : "pointer",
              fontSize: "16px",
              marginTop: "4px",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
              boxShadow: isFormValid ? "0 4px 15px -3px rgba(74, 222, 128, 0.4)" : "none"
            },
            children: loading ? /* @__PURE__ */ jsx(Loader2, {
              style: {
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite"
              }
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [t("auth.signup"), /* @__PURE__ */ jsx(ArrowRight, {
                style: {
                  width: "20px",
                  height: "20px"
                }
              })]
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("p", {
        style: {
          textAlign: "center",
          color: "#A7C7BC",
          marginTop: "24px",
          fontSize: "15px"
        },
        children: [t("auth.already_have_account"), " ", /* @__PURE__ */ jsx(Link, {
          to: "/login",
          style: {
            color: "#4ADE80",
            fontWeight: "600",
            textDecoration: "none"
          },
          children: t("auth.login")
        })]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #6B9B8A;
        }
        input:focus {
          border-color: #4ADE80 !important;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.15) !important;
        }
      `
    })]
  });
};
const Signup$1 = UNSAFE_withComponentProps(Signup);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Signup$1
}, Symbol.toStringTag, { value: "Module" }));
const OnboardingLayout = UNSAFE_withComponentProps(function OnboardingLayout2() {
  const {
    user,
    isOnboarded,
    loading
  } = useAuth();
  if (loading) return null;
  if (!user) return /* @__PURE__ */ jsx(Navigate, {
    to: "/login"
  });
  if (isOnboarded) return /* @__PURE__ */ jsx(Navigate, {
    to: "/feed"
  });
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OnboardingLayout
}, Symbol.toStringTag, { value: "Module" }));
const LocationPicker = ({ value, onChange, placeholder = "Search location...", disabled = false, inputStyle = {} }) => {
  const [query, setQuery] = useState(value?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (value?.name && value.name !== query) {
      setQuery(value.name);
    }
  }, [value?.name]);
  const searchLocations = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&countrycodes=mg&limit=5&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "AlaApp/1.0"
          }
        }
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSuggestions(data.map((item) => ({
        id: item.place_id,
        name: item.display_name,
        shortName: item.address?.city || item.address?.town || item.address?.village || item.address?.state || item.name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      })));
      setShowDropdown(true);
    } catch (error) {
      console.error("Location search error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (value && newQuery !== value.name) {
      onChange(null);
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchLocations(newQuery);
    }, 300);
  };
  const handleSelect = (suggestion) => {
    setQuery(suggestion.shortName || suggestion.name);
    onChange({
      name: suggestion.shortName || suggestion.name,
      lat: suggestion.lat,
      lng: suggestion.lng
    });
    setShowDropdown(false);
    setSuggestions([]);
  };
  const handleClear = () => {
    setQuery("");
    onChange(null);
    setSuggestions([]);
  };
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "flex", alignItems: "center" }, children: [
      /* @__PURE__ */ jsx(
        MapPin,
        {
          size: 16,
          style: {
            position: "absolute",
            left: 10,
            color: "#A7C7BC",
            pointerEvents: "none"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: query,
          onChange: handleInputChange,
          onFocus: () => suggestions.length > 0 && setShowDropdown(true),
          placeholder,
          disabled,
          style: {
            width: "100%",
            padding: "8px 32px 8px 32px",
            background: "rgba(0,0,0,0.2)",
            border: value ? "1px solid #4ADE80" : "1px solid #2E7D67",
            borderRadius: 8,
            color: "white",
            fontSize: 14,
            outline: "none",
            ...inputStyle
          }
        }
      ),
      loading ? /* @__PURE__ */ jsx(
        Loader2,
        {
          size: 16,
          style: {
            position: "absolute",
            right: 10,
            color: "#4ADE80",
            animation: "spin 1s linear infinite"
          }
        }
      ) : query && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleClear,
          style: {
            position: "absolute",
            right: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            alignItems: "center"
          },
          children: /* @__PURE__ */ jsx(X, { size: 14, color: "#A7C7BC" })
        }
      )
    ] }),
    showDropdown && suggestions.length > 0 && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      marginTop: 4,
      background: "#0D4D3A",
      border: "1px solid #2E7D67",
      borderRadius: 8,
      maxHeight: 200,
      overflowY: "auto",
      zIndex: 9999,
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    }, children: suggestions.map((suggestion) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleSelect(suggestion),
        style: {
          padding: "10px 12px",
          cursor: "pointer",
          borderBottom: "1px solid rgba(46, 125, 103, 0.3)",
          transition: "background 0.15s"
        },
        onMouseEnter: (e) => e.target.style.background = "rgba(74, 222, 128, 0.1)",
        onMouseLeave: (e) => e.target.style.background = "transparent",
        children: [
          /* @__PURE__ */ jsx("div", { style: { color: "#F2F1EE", fontSize: 14, fontWeight: 500 }, children: suggestion.shortName }),
          /* @__PURE__ */ jsx("div", { style: { color: "#A7C7BC", fontSize: 11, marginTop: 2 }, children: suggestion.name })
        ]
      },
      suggestion.id
    )) }),
    query && !value && !loading && /* @__PURE__ */ jsx("p", { style: { fontSize: 11, color: "#EF4444", marginTop: 4 }, children: "Please select a location from the suggestions" }),
    /* @__PURE__ */ jsx("style", { children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` })
  ] });
};
const STEPS = ["profile", "details", "interests"];
const INTEREST_OPTIONS = [{
  id: "vanilla",
  label: "Vanilla",
  icon: "🌿"
}, {
  id: "clove",
  label: "Clove",
  icon: "🌸"
}, {
  id: "cocoa",
  label: "Cocoa",
  icon: "🍫"
}, {
  id: "coffee",
  label: "Coffee",
  icon: "☕"
}, {
  id: "rice",
  label: "Rice",
  icon: "🌾"
}, {
  id: "graphite",
  label: "Graphite",
  icon: "⚫"
}, {
  id: "nickel",
  label: "Nickel",
  icon: "🔘"
}, {
  id: "cobalt",
  label: "Cobalt",
  icon: "🔵"
}, {
  id: "reforestation",
  label: "Reforestation",
  icon: "🌳"
}, {
  id: "carbon",
  label: "Carbon Credits",
  icon: "🌍"
}];
const validatePhone = (phone) => {
  if (!phone) return true;
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.startsWith("+261")) {
    return /^\+261\d{9}$/.test(cleaned);
  } else if (cleaned.startsWith("0")) {
    return /^0\d{9}$/.test(cleaned);
  } else if (cleaned.startsWith("+")) {
    return /^\+\d{8,15}$/.test(cleaned);
  }
  return false;
};
const Onboarding = () => {
  const {
    t
  } = useTranslation();
  const {
    user,
    refreshProfile
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    location: null,
    // { name, lat, lng }
    sector: "agriculture",
    bio: "",
    interests: []
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const validate = useCallback((data) => {
    const newErrors = {};
    if (!data.name.trim()) {
      newErrors.name = t("auth.validation.name_required");
    } else if (data.name.trim().length < 2) {
      newErrors.name = t("auth.validation.name_min");
    } else if (data.name.trim().length > 100) {
      newErrors.name = "Name is too long (max 100 characters)";
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(data.name.trim())) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    if (data.username) {
      if (data.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (data.username.length > 30) {
        newErrors.username = "Username is too long (max 30 characters)";
      } else if (!/^[a-z][a-z0-9_-]*$/.test(data.username)) {
        newErrors.username = "Username must start with a letter and contain only lowercase letters, numbers, _ or -";
      }
    }
    if (data.phone && !validatePhone(data.phone)) {
      newErrors.phone = t("auth.validation.phone_invalid");
    }
    return newErrors;
  }, [t]);
  useEffect(() => {
    setErrors(validate(formData));
  }, [formData, validate]);
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;
    let sanitizedValue = value;
    switch (name) {
      case "name":
        sanitizedValue = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "").replace(/\s{2,}/g, " ").slice(0, 100);
        break;
      case "username":
        sanitizedValue = value.toLowerCase().replace(/[^a-z0-9_-]/g, "").replace(/^[^a-z]+/, "").slice(0, 30);
        break;
      case "phone": {
        const cleaned = value.replace(/[^\d+\s()-]/g, "");
        if (cleaned.startsWith("+261") || cleaned.startsWith("261")) {
          const digits = cleaned.replace(/\D/g, "");
          if (digits.length <= 3) {
            sanitizedValue = "+261";
          } else if (digits.length <= 5) {
            sanitizedValue = `+261 ${digits.slice(3)}`;
          } else if (digits.length <= 7) {
            sanitizedValue = `+261 ${digits.slice(3, 5)} ${digits.slice(5)}`;
          } else if (digits.length <= 10) {
            sanitizedValue = `+261 ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
          } else if (digits.length <= 12) {
            sanitizedValue = `+261 ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 10)} ${digits.slice(10, 12)}`;
          } else {
            sanitizedValue = `+261 ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 10)} ${digits.slice(10, 12)}`;
          }
        } else if (cleaned.startsWith("0")) {
          const digits = cleaned.replace(/\D/g, "");
          if (digits.length <= 3) {
            sanitizedValue = digits;
          } else if (digits.length <= 5) {
            sanitizedValue = `${digits.slice(0, 3)} ${digits.slice(3)}`;
          } else if (digits.length <= 8) {
            sanitizedValue = `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
          } else if (digits.length <= 10) {
            sanitizedValue = `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)}`;
          } else {
            sanitizedValue = `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)}`;
          }
        } else {
          sanitizedValue = cleaned.slice(0, 20);
        }
        break;
      }
      case "bio":
        sanitizedValue = value.slice(0, 500);
        break;
      default:
        sanitizedValue = value;
    }
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
  };
  const handleBlur = (field) => {
    if (field === "name" || field === "bio") {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].trim()
      }));
    }
    setTouched({
      ...touched,
      [field]: true
    });
  };
  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest]
    }));
  };
  const isStepValid = () => {
    if (step === 0) {
      return !errors.name && !errors.phone && !errors.username && formData.name;
    }
    return true;
  };
  const handleNext = () => {
    if (step === 0) {
      setTouched((prev) => ({
        ...prev,
        name: true,
        phone: true,
        username: true
      }));
    }
    if (isStepValid() && step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const {
        error: insertError
      } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        name: formData.name,
        username: formData.username || null,
        phone: formData.phone || null,
        location: formData.location?.name || null,
        location_lat: formData.location?.lat || null,
        location_lng: formData.location?.lng || null,
        sector: formData.sector,
        bio: formData.bio || null,
        interests: formData.interests.length > 0 ? formData.interests : null
      });
      if (insertError) throw insertError;
      await refreshProfile();
      toast.success(t("auth.onboarding.success"));
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong saving your profile");
      setLoading(false);
    }
  };
  const getInputStyles = (fieldName) => {
    const isError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && (formData[fieldName]?.length > 0 || fieldName === "phone");
    const base = {
      width: "100%",
      background: "#1A5D4A",
      border: "1px solid #2E7D67",
      color: "#F2F1EE",
      padding: "14px 14px 14px 46px",
      borderRadius: "12px",
      fontSize: "15px",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box"
    };
    if (isError) {
      return {
        ...base,
        borderColor: "#ef4444",
        boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.15)"
      };
    }
    if (isValid && formData[fieldName]) {
      return {
        ...base,
        borderColor: "#4ADE80"
      };
    }
    return base;
  };
  const ValidIcon = ({
    fieldName
  }) => {
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName]?.length > 0;
    if (!isValid) return null;
    return /* @__PURE__ */ jsx(CheckCircle, {
      style: {
        width: "16px",
        height: "16px",
        color: "#4ADE80"
      }
    });
  };
  const iconStyle = {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    color: "#6B9B8A"
  };
  const labelStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
    fontWeight: "500",
    color: "#D7D4CE",
    marginBottom: "8px"
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0B3D2E 0%, #0D4D3A 50%, #0B3D2E 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    children: [/* @__PURE__ */ jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      style: {
        width: "100%",
        maxWidth: "480px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          textAlign: "center",
          marginBottom: "24px"
        },
        children: [/* @__PURE__ */ jsx("div", {
          style: {
            width: "64px",
            height: "64px",
            margin: "0 auto 16px",
            borderRadius: "20px",
            background: "rgba(74, 222, 128, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          children: /* @__PURE__ */ jsx(Sparkles, {
            style: {
              width: "32px",
              height: "32px",
              color: "#4ADE80"
            }
          })
        }), /* @__PURE__ */ jsx("h1", {
          style: {
            fontSize: "28px",
            fontWeight: "700",
            color: "#F2F1EE",
            marginBottom: "8px"
          },
          children: t("auth.onboarding.title")
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#A7C7BC",
            fontSize: "15px"
          },
          children: t("auth.onboarding.subtitle")
        })]
      }), /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "24px"
        },
        children: STEPS.map((_, idx) => /* @__PURE__ */ jsx("div", {
          style: {
            height: "6px",
            borderRadius: "3px",
            transition: "all 0.3s",
            width: idx === step ? "32px" : "8px",
            background: idx <= step ? "#4ADE80" : "rgba(74,222,128,0.3)"
          }
        }, idx))
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(13, 77, 58, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid #2E7D67",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
        },
        children: [/* @__PURE__ */ jsxs(AnimatePresence, {
          mode: "wait",
          children: [step === 0 && /* @__PURE__ */ jsxs(motion.div, {
            initial: {
              opacity: 0,
              x: 20
            },
            animate: {
              opacity: 1,
              x: 0
            },
            exit: {
              opacity: 0,
              x: -20
            },
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center",
                marginBottom: "8px"
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  width: "48px",
                  height: "48px",
                  margin: "0 auto 12px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #4ADE80, #22C55E)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: /* @__PURE__ */ jsx(User, {
                  style: {
                    width: "24px",
                    height: "24px",
                    color: "#0B3D2E"
                  }
                })
              }), /* @__PURE__ */ jsx("h2", {
                style: {
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#F2F1EE"
                },
                children: t("auth.onboarding.step1_title")
              }), /* @__PURE__ */ jsx("p", {
                style: {
                  color: "#A7C7BC",
                  fontSize: "14px",
                  marginTop: "4px"
                },
                children: t("auth.onboarding.step1_desc")
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("label", {
                style: labelStyle,
                children: [t("auth.name"), " *", /* @__PURE__ */ jsx(ValidIcon, {
                  fieldName: "name"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  position: "relative"
                },
                children: [/* @__PURE__ */ jsx(User, {
                  style: iconStyle
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  name: "name",
                  value: formData.name,
                  onChange: handleChange,
                  onBlur: () => handleBlur("name"),
                  placeholder: t("auth.name_placeholder"),
                  style: getInputStyles("name")
                })]
              }), touched.name && errors.name && /* @__PURE__ */ jsxs(motion.p, {
                initial: {
                  opacity: 0
                },
                animate: {
                  opacity: 1
                },
                style: {
                  color: "#ef4444",
                  fontSize: "13px",
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                },
                children: [/* @__PURE__ */ jsx(AlertCircle, {
                  style: {
                    width: "14px",
                    height: "14px"
                  }
                }), errors.name]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("label", {
                style: labelStyle,
                children: [t("auth.username"), /* @__PURE__ */ jsx(ValidIcon, {
                  fieldName: "username"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  position: "relative"
                },
                children: [/* @__PURE__ */ jsx(Hash, {
                  style: iconStyle
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  name: "username",
                  value: formData.username,
                  onChange: handleChange,
                  onBlur: () => handleBlur("username"),
                  placeholder: t("auth.username_placeholder"),
                  style: getInputStyles("username")
                })]
              }), touched.username && errors.username && /* @__PURE__ */ jsxs(motion.p, {
                initial: {
                  opacity: 0
                },
                animate: {
                  opacity: 1
                },
                style: {
                  color: "#ef4444",
                  fontSize: "13px",
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                },
                children: [/* @__PURE__ */ jsx(AlertCircle, {
                  style: {
                    width: "14px",
                    height: "14px"
                  }
                }), errors.username]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("label", {
                style: labelStyle,
                children: [t("auth.phone"), /* @__PURE__ */ jsx(ValidIcon, {
                  fieldName: "phone"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  position: "relative"
                },
                children: [/* @__PURE__ */ jsx(Phone, {
                  style: iconStyle
                }), /* @__PURE__ */ jsx("input", {
                  type: "tel",
                  name: "phone",
                  value: formData.phone,
                  onChange: handleChange,
                  onBlur: () => handleBlur("phone"),
                  placeholder: "+261 34 31 708 39",
                  style: getInputStyles("phone")
                })]
              }), !touched.phone && !formData.phone && /* @__PURE__ */ jsx("p", {
                style: {
                  color: "#6B9B8A",
                  fontSize: "12px",
                  marginTop: "6px",
                  fontStyle: "italic"
                },
                children: "Start with +261 for auto-formatting"
              }), touched.phone && errors.phone && /* @__PURE__ */ jsxs(motion.p, {
                initial: {
                  opacity: 0
                },
                animate: {
                  opacity: 1
                },
                style: {
                  color: "#ef4444",
                  fontSize: "13px",
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                },
                children: [/* @__PURE__ */ jsx(AlertCircle, {
                  style: {
                    width: "14px",
                    height: "14px"
                  }
                }), errors.phone]
              })]
            })]
          }, "step-0"), step === 1 && /* @__PURE__ */ jsxs(motion.div, {
            initial: {
              opacity: 0,
              x: 20
            },
            animate: {
              opacity: 1,
              x: 0
            },
            exit: {
              opacity: 0,
              x: -20
            },
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center",
                marginBottom: "8px"
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  width: "48px",
                  height: "48px",
                  margin: "0 auto 12px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #C9A66B, #B8956A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: /* @__PURE__ */ jsx(MapPin, {
                  style: {
                    width: "24px",
                    height: "24px",
                    color: "#0B3D2E"
                  }
                })
              }), /* @__PURE__ */ jsx("h2", {
                style: {
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#F2F1EE"
                },
                children: t("auth.onboarding.step2_title")
              }), /* @__PURE__ */ jsx("p", {
                style: {
                  color: "#A7C7BC",
                  fontSize: "14px",
                  marginTop: "4px"
                },
                children: t("auth.onboarding.step2_desc")
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                style: labelStyle,
                children: t("auth.location")
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  position: "relative"
                },
                children: /* @__PURE__ */ jsx(LocationPicker, {
                  value: formData.location,
                  onChange: (loc) => setFormData({
                    ...formData,
                    location: loc
                  }),
                  placeholder: t("auth.location_placeholder"),
                  inputStyle: {
                    background: "#1A5D4A",
                    padding: "14px 14px 14px 46px",
                    borderRadius: "12px",
                    fontSize: "15px"
                  }
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                style: labelStyle,
                children: t("auth.sector")
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                },
                children: [{
                  value: "agriculture",
                  Icon: Leaf,
                  label: t("auth.agriculture"),
                  color: "#4ADE80"
                }, {
                  value: "mining",
                  Icon: Mountain,
                  label: t("auth.mining"),
                  color: "#C9A66B"
                }, {
                  value: "both",
                  Icon: Sparkles,
                  label: t("auth.both"),
                  color: "#22D3EE"
                }, {
                  value: "other",
                  Icon: Briefcase,
                  label: t("auth.other"),
                  color: "#A7C7BC"
                }].map(({
                  value,
                  Icon: Icon2,
                  label,
                  color
                }) => /* @__PURE__ */ jsxs("button", {
                  type: "button",
                  onClick: () => setFormData({
                    ...formData,
                    sector: value
                  }),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: formData.sector === value ? `2px solid ${color}` : "1px solid #2E7D67",
                    background: formData.sector === value ? `${color}15` : "#1A5D4A",
                    color: formData.sector === value ? color : "#A7C7BC",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontWeight: "500",
                    fontSize: "14px"
                  },
                  children: [/* @__PURE__ */ jsx(Icon2, {
                    style: {
                      width: "18px",
                      height: "18px"
                    }
                  }), label]
                }, value))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("label", {
                style: labelStyle,
                children: [t("auth.bio"), /* @__PURE__ */ jsxs("span", {
                  style: {
                    fontSize: "12px",
                    color: "#6B9B8A"
                  },
                  children: [formData.bio.length, "/500"]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  position: "relative"
                },
                children: [/* @__PURE__ */ jsx(FileText, {
                  style: {
                    ...iconStyle,
                    top: "20px",
                    transform: "none"
                  }
                }), /* @__PURE__ */ jsx("textarea", {
                  name: "bio",
                  value: formData.bio,
                  onChange: handleChange,
                  placeholder: t("auth.bio_placeholder"),
                  rows: 3,
                  style: {
                    ...getInputStyles("bio"),
                    resize: "none",
                    paddingTop: "14px"
                  }
                })]
              })]
            })]
          }, "step-1"), step === 2 && /* @__PURE__ */ jsxs(motion.div, {
            initial: {
              opacity: 0,
              x: 20
            },
            animate: {
              opacity: 1,
              x: 0
            },
            exit: {
              opacity: 0,
              x: -20
            },
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center",
                marginBottom: "8px"
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  width: "48px",
                  height: "48px",
                  margin: "0 auto 12px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: /* @__PURE__ */ jsx(Sparkles, {
                  style: {
                    width: "24px",
                    height: "24px",
                    color: "#0B3D2E"
                  }
                })
              }), /* @__PURE__ */ jsx("h2", {
                style: {
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#F2F1EE"
                },
                children: t("auth.onboarding.step3_title")
              }), /* @__PURE__ */ jsx("p", {
                style: {
                  color: "#A7C7BC",
                  fontSize: "14px",
                  marginTop: "4px"
                },
                children: t("auth.onboarding.step3_desc")
              })]
            }), /* @__PURE__ */ jsx("div", {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px"
              },
              children: INTEREST_OPTIONS.map(({
                id,
                label,
                icon
              }) => /* @__PURE__ */ jsxs("button", {
                type: "button",
                onClick: () => toggleInterest(id),
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: formData.interests.includes(id) ? "2px solid #4ADE80" : "1px solid #2E7D67",
                  background: formData.interests.includes(id) ? "rgba(74,222,128,0.1)" : "#1A5D4A",
                  color: formData.interests.includes(id) ? "#4ADE80" : "#D7D4CE",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontWeight: "500",
                  fontSize: "13px"
                },
                children: [/* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: "18px"
                  },
                  children: icon
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    flex: 1,
                    textAlign: "left"
                  },
                  children: label
                }), formData.interests.includes(id) && /* @__PURE__ */ jsx(Check, {
                  style: {
                    width: "16px",
                    height: "16px",
                    color: "#4ADE80"
                  }
                })]
              }, id))
            })]
          }, "step-2")]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: "12px",
            marginTop: "28px"
          },
          children: [step > 0 && /* @__PURE__ */ jsxs("button", {
            onClick: handleBack,
            style: {
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#1A5D4A",
              color: "#A7C7BC",
              fontWeight: "600",
              padding: "16px 24px",
              borderRadius: "12px",
              border: "1px solid #2E7D67",
              cursor: "pointer",
              fontSize: "15px"
            },
            children: [/* @__PURE__ */ jsx(ArrowLeft, {
              style: {
                width: "20px",
                height: "20px"
              }
            }), t("auth.back")]
          }), step < STEPS.length - 1 ? /* @__PURE__ */ jsxs("button", {
            onClick: handleNext,
            disabled: !isStepValid(),
            style: {
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: isStepValid() ? "#4ADE80" : "#2E7D67",
              color: isStepValid() ? "#0B3D2E" : "#6B9B8A",
              fontWeight: "600",
              padding: "16px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: isStepValid() ? "pointer" : "not-allowed",
              fontSize: "15px"
            },
            children: [t("auth.next"), /* @__PURE__ */ jsx(ArrowRight, {
              style: {
                width: "20px",
                height: "20px"
              }
            })]
          }) : /* @__PURE__ */ jsx("button", {
            onClick: handleSubmit,
            disabled: loading,
            style: {
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#4ADE80",
              color: "#0B3D2E",
              fontWeight: "600",
              padding: "16px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              opacity: loading ? 0.7 : 1
            },
            children: loading ? /* @__PURE__ */ jsx(Loader2, {
              style: {
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite"
              }
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [t("auth.complete"), /* @__PURE__ */ jsx(Check, {
                style: {
                  width: "20px",
                  height: "20px"
                }
              })]
            })
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder, textarea::placeholder {
          color: #6B9B8A;
        }
        input:focus, textarea:focus {
          border-color: #4ADE80 !important;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.15) !important;
        }
      `
    })]
  });
};
const Onboarding$1 = UNSAFE_withComponentProps(Onboarding);
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Onboarding$1
}, Symbol.toStringTag, { value: "Module" }));
const ProtectedLayout = UNSAFE_withComponentProps(function ProtectedLayout2() {
  const {
    user,
    loading
  } = useAuth();
  if (loading) return null;
  if (!user) return /* @__PURE__ */ jsx(Navigate, {
    to: "/login"
  });
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProtectedLayout
}, Symbol.toStringTag, { value: "Module" }));
const Feed = () => {
  const {
    t
  } = useTranslation();
  const {
    user,
    profile,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState(/* @__PURE__ */ new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const PAGE_SIZE = 5;
  const fetchPosts = async (pageNumber = 0) => {
    try {
      if (pageNumber === 0) setLoading(true);
      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const {
        data,
        error
      } = await supabase.from("posts").select(`
          *,
          author:users!posts_user_id_fkey(id, name, avatar_url, sector, location),
          likes(count),
          comments!comments_post_id_fkey(count)
        `, {
        count: "exact"
      }).order("created_at", {
        ascending: false
      }).range(from, to);
      if (error) throw error;
      if (data) {
        setPosts((prev) => pageNumber === 0 ? data : [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
        if (user) {
          const postIds = data.map((p) => p.id);
          const {
            data: userLikes
          } = await supabase.from("likes").select("post_id").eq("user_id", user.id).in("post_id", postIds);
          if (userLikes) {
            setLikedPosts((prev) => {
              const newSet = new Set(prev);
              userLikes.forEach((like) => newSet.add(like.post_id));
              return newSet;
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts(0);
  }, []);
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const seconds = Math.floor((now - date) / 1e3);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  const handleLike = async (postId) => {
    const isLiked = likedPosts.has(postId);
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (isLiked) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
    setPosts((prev) => prev.map((p) => {
      if (p.id === postId) {
        const currentCount = p.likes && p.likes[0] ? p.likes[0].count : 0;
        return {
          ...p,
          likes: [{
            count: isLiked ? Math.max(0, currentCount - 1) : currentCount + 1
          }]
        };
      }
      return p;
    }));
    try {
      if (isLiked) {
        const {
          error
        } = await supabase.from("likes").delete().match({
          post_id: postId,
          user_id: user.id
        });
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (isLiked) newSet.add(postId);
        else newSet.delete(postId);
        return newSet;
      });
      setPosts((prev) => prev.map((p) => {
        if (p.id === postId) {
          const currentCount = p.likes && p.likes[0] ? p.likes[0].count : 0;
          return {
            ...p,
            likes: [{
              count: isLiked ? currentCount + 1 : Math.max(0, currentCount - 1)
            }]
          };
        }
        return p;
      }));
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsx(SEOHead, {
      title: "Feed — Ala Community",
      description: "Your Ala community feed.",
      path: "/feed",
      noindex: true
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "10px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12
        },
        children: [/* @__PURE__ */ jsx("div", {
          style: {
            width: 32,
            height: 32,
            background: "#EAE7E2",
            mask: "url(/icons/ala.svg) no-repeat center / contain",
            WebkitMask: "url(/icons/ala.svg) no-repeat center / contain"
          }
        }), /* @__PURE__ */ jsx("h1", {
          style: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#F2F1EE",
            margin: 0,
            display: "none",
            sm: "block"
          },
          children: "Ala"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 24
        },
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/feed",
          style: {
            color: "#4ADE80",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            textDecoration: "none"
          },
          children: [/* @__PURE__ */ jsx(Home, {
            size: 24,
            strokeWidth: 2.5
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 10,
              fontWeight: 600
            },
            children: "Home"
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/groups",
          style: {
            color: "#F2F1EE",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            textDecoration: "none"
          },
          children: [/* @__PURE__ */ jsx(Users, {
            size: 24
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 10
            },
            children: "Groups"
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/new-post",
          style: {
            color: "#4ADE80",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            textDecoration: "none"
          },
          children: [/* @__PURE__ */ jsx(PlusSquare, {
            size: 24
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 10
            },
            children: "Post"
          })]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/messages",
          style: {
            color: "#F2F1EE",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            textDecoration: "none"
          },
          children: [/* @__PURE__ */ jsx(MessageCircle, {
            size: 24
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 10
            },
            children: "Chat"
          })]
        }), /* @__PURE__ */ jsxs("button", {
          onClick: () => setIsMenuOpen(!isMenuOpen),
          style: {
            background: "transparent",
            border: "none",
            color: "#F2F1EE",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: 0
          },
          children: [isMenuOpen ? /* @__PURE__ */ jsx(X, {
            size: 24
          }) : /* @__PURE__ */ jsx(Menu, {
            size: 24
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 10
            },
            children: "More"
          })]
        })]
      }), isMenuOpen && /* @__PURE__ */ jsxs("div", {
        style: {
          position: "absolute",
          top: "100%",
          right: 0,
          width: 250,
          background: "rgba(11, 61, 46, 0.98)",
          backdropFilter: "blur(10px)",
          border: "1px solid #2E7D67",
          borderTop: "none",
          borderBottomLeftRadius: 16,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 8
        },
        children: [/* @__PURE__ */ jsx("div", {
          style: {
            paddingBottom: 12,
            marginBottom: 12,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 12
          },
          children: /* @__PURE__ */ jsxs(Link, {
            to: `/profile/${user.id}`,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              color: "white",
              flex: 1
            },
            onClick: () => setIsMenuOpen(false),
            children: [profile?.avatar_url || user.user_metadata?.avatar_url ? /* @__PURE__ */ jsx("img", {
              src: profile?.avatar_url || user.user_metadata.avatar_url,
              alt: "",
              style: {
                width: 32,
                height: 32,
                borderRadius: "50%"
              }
            }) : /* @__PURE__ */ jsx("div", {
              style: {
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#2E7D67",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ jsx(User, {
                size: 16
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  fontWeight: "bold",
                  fontSize: 14
                },
                children: profile?.name || user.user_metadata?.name || "User"
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  fontSize: 12,
                  color: "#A7C7BC"
                },
                children: "View Profile"
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/marketplace",
          onClick: () => setIsMenuOpen(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px",
            color: "#F2F1EE",
            textDecoration: "none",
            borderRadius: 8,
            transition: "background 0.2s"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
          onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
          children: [/* @__PURE__ */ jsx(ShoppingCart, {
            size: 20,
            color: "#C9A66B"
          }), " Marketplace"]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/resources",
          onClick: () => setIsMenuOpen(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px",
            color: "#F2F1EE",
            textDecoration: "none",
            borderRadius: 8,
            transition: "background 0.2s"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
          onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
          children: [/* @__PURE__ */ jsx(BookOpen, {
            size: 20,
            color: "#60A5FA"
          }), " Resources"]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/events",
          onClick: () => setIsMenuOpen(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px",
            color: "#F2F1EE",
            textDecoration: "none",
            borderRadius: 8,
            transition: "background 0.2s"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
          onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
          children: [/* @__PURE__ */ jsx(Calendar, {
            size: 20,
            color: "#F472B6"
          }), " Events"]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/grievances",
          onClick: () => setIsMenuOpen(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px",
            color: "#F2F1EE",
            textDecoration: "none",
            borderRadius: 8,
            transition: "background 0.2s"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
          onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
          children: [/* @__PURE__ */ jsx(Scale, {
            size: 20,
            color: "#F87171"
          }), " Grievances"]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/crisis",
          onClick: () => setIsMenuOpen(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px",
            color: "#F2F1EE",
            textDecoration: "none",
            borderRadius: 8,
            transition: "background 0.2s"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
          onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
          children: [/* @__PURE__ */ jsx(Radio, {
            size: 20,
            color: "#EF4444"
          }), " Crisis Alerts"]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/compliance",
          onClick: () => setIsMenuOpen(false),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px",
            color: "#F2F1EE",
            textDecoration: "none",
            borderRadius: 8,
            transition: "background 0.2s"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
          onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
          children: [/* @__PURE__ */ jsx(ClipboardList, {
            size: 20,
            color: "#34D399"
          }), " Compliance"]
        }), /* @__PURE__ */ jsxs("button", {
          onClick: () => {
            setIsMenuOpen(false);
            handleLogout();
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px",
            background: "transparent",
            border: "none",
            color: "#EF4444",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            marginTop: 8,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 16
          },
          children: [/* @__PURE__ */ jsx(LogOut, {
            size: 20
          }), " Logout"]
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 600,
        margin: "0 auto",
        padding: "20px 0"
      },
      children: [loading && page === 0 ? /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          padding: 40
        },
        children: /* @__PURE__ */ jsx(Loader2, {
          style: {
            color: "#4ADE80",
            width: 32,
            height: 32,
            animation: "spin 1s linear infinite"
          }
        })
      }) : posts.length === 0 ? /* @__PURE__ */ jsx("div", {
        style: {
          textAlign: "center",
          padding: 40,
          color: "#A7C7BC",
          background: "rgba(13, 77, 58, 0.6)",
          margin: 20,
          borderRadius: 16
        },
        children: /* @__PURE__ */ jsx("p", {
          children: t("auth.feed.no_posts")
        })
      }) : posts.map((post) => /* @__PURE__ */ jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        style: {
          background: "rgba(13, 77, 58, 0.6)",
          borderBottom: "1px solid #2E7D67",
          marginBottom: 16,
          padding: 16
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 12,
            marginBottom: 12
          },
          children: [/* @__PURE__ */ jsx(Link, {
            to: `/profile/${post.author?.id}`,
            children: post.author?.avatar_url ? /* @__PURE__ */ jsx("img", {
              src: post.author.avatar_url,
              alt: post.author.name,
              style: {
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover"
              }
            }) : /* @__PURE__ */ jsx("div", {
              style: {
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#2E7D67",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ jsx(User, {
                size: 20,
                color: "#A7C7BC"
              })
            })
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: 1
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              },
              children: [/* @__PURE__ */ jsx(Link, {
                to: `/profile/${post.author?.id}`,
                style: {
                  textDecoration: "none"
                },
                children: /* @__PURE__ */ jsx("h3", {
                  style: {
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#F2F1EE",
                    margin: 0
                  },
                  children: post.author?.name || "Unknown User"
                })
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 12,
                  color: "#A7C7BC"
                },
                children: getTimeAgo(post.created_at)
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 2
              },
              children: [post.author?.sector && /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 12,
                  color: "#4ADE80",
                  background: "rgba(74, 222, 128, 0.1)",
                  padding: "2px 6px",
                  borderRadius: 4
                },
                children: post.author.sector
              }), post.author?.location && /* @__PURE__ */ jsxs("span", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  fontSize: 12,
                  color: "#A7C7BC"
                },
                children: [/* @__PURE__ */ jsx(MapPin, {
                  size: 10
                }), " ", post.author.location]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            marginBottom: 12
          },
          children: [/* @__PURE__ */ jsx(Link, {
            to: `/post/${post.id}`,
            style: {
              textDecoration: "none",
              display: "block"
            },
            children: /* @__PURE__ */ jsx("p", {
              style: {
                color: "#F2F1EE",
                fontSize: 15,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap"
              },
              children: post.content
            })
          }), post.hashtags && post.hashtags.length > 0 && /* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 8
            },
            children: post.hashtags.map((tag, idx) => /* @__PURE__ */ jsx("span", {
              style: {
                color: "#4ADE80",
                fontSize: 14
              },
              children: tag
            }, idx))
          })]
        }), post.media_urls && post.media_urls.length > 0 && /* @__PURE__ */ jsx("div", {
          style: {
            marginBottom: 12,
            borderRadius: 12,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: post.media_urls.length > 1 ? "1fr 1fr" : "1fr",
            gap: 2
          },
          children: post.media_urls.map((url, idx) => {
            const isVideo = url.match(/\.(mp4|webm|ogg|mov|quicktime)$/i);
            return isVideo ? /* @__PURE__ */ jsx("video", {
              src: url,
              controls: true,
              style: {
                width: "100%",
                height: post.media_urls.length > 1 ? 150 : "auto",
                maxHeight: 400,
                objectFit: "cover"
              }
            }, idx) : /* @__PURE__ */ jsx("img", {
              src: url,
              alt: "Post content",
              style: {
                width: "100%",
                height: post.media_urls.length > 1 ? 150 : "auto",
                maxHeight: 400,
                objectFit: "cover"
              }
            }, idx);
          })
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 24,
            paddingTop: 12,
            borderTop: "1px solid rgba(46, 125, 103, 0.5)"
          },
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => handleLike(post.id),
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: likedPosts.has(post.id) ? "#EF4444" : "#A7C7BC",
              cursor: "pointer",
              padding: 0
            },
            children: [/* @__PURE__ */ jsx(Heart, {
              size: 20,
              fill: likedPosts.has(post.id) ? "#EF4444" : "none"
            }), /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 14
              },
              children: post.likes && post.likes[0]?.count > 0 ? post.likes[0].count : t("auth.feed.likes")
            })]
          }), /* @__PURE__ */ jsxs(Link, {
            to: `/post/${post.id}`,
            style: {
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#A7C7BC"
            },
            children: [/* @__PURE__ */ jsx(MessageCircle, {
              size: 20
            }), /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 14
              },
              children: post.comments && post.comments[0]?.count > 0 ? post.comments[0].count : t("auth.feed.comments")
            })]
          }), /* @__PURE__ */ jsx("button", {
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#A7C7BC",
              cursor: "pointer",
              padding: 0,
              marginLeft: "auto"
            },
            children: /* @__PURE__ */ jsx(Share2, {
              size: 20
            })
          })]
        })]
      }, post.id)), hasMore && !loading && posts.length > 0 && /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          marginTop: 20
        },
        children: /* @__PURE__ */ jsx("button", {
          onClick: loadMore,
          style: {
            background: "#2E7D67",
            color: "#F2F1EE",
            border: "none",
            padding: "10px 24px",
            borderRadius: 20,
            cursor: "pointer"
          },
          children: t("auth.feed.load_more")
        })
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
    })]
  });
};
const Feed$1 = UNSAFE_withComponentProps(Feed);
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Feed$1
}, Symbol.toStringTag, { value: "Module" }));
const MapUpdater$1 = ({
  RL,
  lat,
  lng,
  zoom
}) => {
  const map = RL.useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
};
const Profile = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  const {
    user: currentUser
  } = useAuth();
  const {
    toast
  } = useToast();
  useEffect(() => {
    import("leaflet").then((L) => {
      import("./assets/marker-icon-Dxo8DtlK.js").then((icon) => {
        import("./assets/marker-shadow-BWlltkiu.js").then((iconShadow) => {
          let DefaultIcon = L.default.icon({
            iconUrl: icon.default,
            shadowUrl: iconShadow.default,
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          });
          L.default.Marker.prototype.options.icon = DefaultIcon;
        });
      });
    });
  }, []);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [mapMounted, setMapMounted] = useState(false);
  const [RL, setRL] = useState(null);
  useEffect(() => {
    setMapMounted(true);
    import("react-leaflet").then((m) => setRL(m));
    Promise.resolve().then(() => leaflet);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    location: null,
    // { name, lat, lng }
    bio: "",
    sector: "",
    interests: [],
    badges: ""
  });
  const [newInterest, setNewInterest] = useState("");
  const isOwnProfile = currentUser?.id === id;
  const fetchProfile = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("users").select("*").eq("id", id).single();
      if (error) throw error;
      setProfile(data);
      setFormData({
        name: data.name || "",
        username: data.username || "",
        phone: data.phone || "",
        location: data.location ? {
          name: data.location,
          lat: data.location_lat || -18.91,
          lng: data.location_lng || 47.53
        } : null,
        bio: data.bio || "",
        sector: data.sector || "agriculture",
        interests: data.interests || [],
        badges: data.badges ? data.badges.join(", ") : ""
      });
      await fetchFollowData();
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Could not load profile");
    } finally {
      setLoading(false);
    }
  };
  const fetchFollowData = async () => {
    try {
      if (currentUser && !isOwnProfile) {
        const {
          data: followStatus
        } = await supabase.from("follows").select("follower_id").eq("follower_id", currentUser.id).eq("following_id", id).maybeSingle();
        setIsFollowing(!!followStatus);
      }
      const {
        count: followers
      } = await supabase.from("follows").select("follower_id", {
        count: "exact",
        head: true
      }).eq("following_id", id);
      setFollowersCount(followers || 0);
      const {
        count: following
      } = await supabase.from("follows").select("following_id", {
        count: "exact",
        head: true
      }).eq("follower_id", id);
      setFollowingCount(following || 0);
    } catch (error) {
      console.error("Error fetching follow stats:", error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [id, currentUser]);
  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      return;
    }
    const previousState = isFollowing;
    const previousFollowers = followersCount;
    setIsFollowing(!previousState);
    setFollowersCount((prev) => previousState ? prev - 1 : prev + 1);
    setFollowLoading(true);
    try {
      if (previousState) {
        const {
          error
        } = await supabase.from("follows").delete().eq("follower_id", currentUser.id).eq("following_id", id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("follows").insert({
          follower_id: currentUser.id,
          following_id: id
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Follow toggle error:", error);
      toast.error("Action failed. Please try again.");
      setIsFollowing(previousState);
      setFollowersCount(previousFollowers);
    } finally {
      setFollowLoading(false);
    }
  };
  const handleUpdate = async () => {
    try {
      setSaving(true);
      const {
        error
      } = await supabase.from("users").update({
        name: formData.name,
        username: formData.username,
        phone: formData.phone,
        location: formData.location?.name || null,
        location_lat: formData.location?.lat || null,
        location_lng: formData.location?.lng || null,
        bio: formData.bio,
        sector: formData.sector,
        interests: formData.interests
      }).eq("id", id);
      if (error) throw error;
      setProfile({
        ...profile,
        name: formData.name,
        username: formData.username,
        phone: formData.phone,
        location: formData.location?.name || null,
        location_lat: formData.location?.lat || null,
        location_lng: formData.location?.lng || null,
        bio: formData.bio,
        sector: formData.sector,
        interests: formData.interests
      });
      setEditing(false);
      toast.success(t("auth.profile.saved_success") || "Profile updated!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };
  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const {
        error: updateError
      } = await supabase.from("users").update({
        avatar_url: publicUrl
      }).eq("id", id);
      if (updateError) throw updateError;
      setProfile({
        ...profile,
        avatar_url: publicUrl
      });
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", {
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B3D2E"
      },
      children: [/* @__PURE__ */ jsx(Loader2, {
        style: {
          color: "#4ADE80",
          width: 40,
          height: 40,
          animation: "spin 1s linear infinite"
        }
      }), /* @__PURE__ */ jsx("style", {
        children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
      })]
    });
  }
  if (!profile) {
    return /* @__PURE__ */ jsx("div", {
      style: {
        minHeight: "100vh",
        padding: 40,
        textAlign: "center",
        color: "white",
        background: "#0B3D2E"
      },
      children: "Profile not found"
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsx("div", {
      style: {
        height: 200,
        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        position: "relative"
      },
      children: /* @__PURE__ */ jsx("div", {
        style: {
          position: "absolute",
          bottom: -50,
          left: "50%",
          transform: "translateX(-50%)"
        },
        children: /* @__PURE__ */ jsxs("div", {
          style: {
            position: "relative",
            width: 120,
            height: 120
          },
          children: [/* @__PURE__ */ jsx("img", {
            src: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D4D3A&color=4ADE80`,
            alt: profile.name,
            style: {
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "4px solid #0B3D2E",
              objectFit: "cover",
              background: "#0B3D2E"
            }
          }), isOwnProfile && /* @__PURE__ */ jsxs("label", {
            style: {
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#4ADE80",
              borderRadius: "50%",
              padding: 8,
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            },
            children: [uploading ? /* @__PURE__ */ jsx(Loader2, {
              size: 16,
              style: {
                animation: "spin 1s linear infinite"
              }
            }) : /* @__PURE__ */ jsx(Camera, {
              size: 16,
              color: "#0B3D2E"
            }), /* @__PURE__ */ jsx("input", {
              type: "file",
              hidden: true,
              accept: "image/*",
              onChange: handleAvatarUpload,
              disabled: uploading
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "60px auto 0",
        padding: "0 20px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          textAlign: "center",
          marginBottom: 32
        },
        children: [editing ? /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center"
          },
          children: [/* @__PURE__ */ jsx("input", {
            value: formData.name,
            onChange: (e) => setFormData({
              ...formData,
              name: e.target.value
            }),
            placeholder: "Name",
            style: {
              fontSize: 24,
              fontWeight: "bold",
              background: "rgba(0,0,0,0.2)",
              border: "1px solid #4ADE80",
              borderRadius: 8,
              padding: "4px 8px",
              color: "white",
              textAlign: "center"
            }
          }), /* @__PURE__ */ jsx("input", {
            value: formData.username,
            onChange: (e) => setFormData({
              ...formData,
              username: e.target.value
            }),
            placeholder: "Username",
            style: {
              fontSize: 16,
              background: "rgba(0,0,0,0.2)",
              border: "1px solid #4ADE80",
              borderRadius: 8,
              padding: "4px 8px",
              color: "#A7C7BC",
              textAlign: "center"
            }
          })]
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx("h1", {
            style: {
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 4
            },
            children: profile.name
          }), profile.username && /* @__PURE__ */ jsxs("p", {
            style: {
              color: "#A7C7BC",
              marginBottom: 8
            },
            children: ["@", profile.username]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginBottom: 12,
              fontSize: 14,
              color: "#D1D5DB"
            },
            children: [/* @__PURE__ */ jsxs("span", {
              children: [/* @__PURE__ */ jsx("strong", {
                style: {
                  color: "white"
                },
                children: followersCount
              }), " Followers"]
            }), /* @__PURE__ */ jsxs("span", {
              children: [/* @__PURE__ */ jsx("strong", {
                style: {
                  color: "white"
                },
                children: followingCount
              }), " Following"]
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "#A7C7BC",
            marginTop: 8,
            maxWidth: 300,
            margin: "8px auto 0"
          },
          children: editing ? /* @__PURE__ */ jsx(LocationPicker, {
            value: formData.location,
            onChange: (loc) => setFormData({
              ...formData,
              location: loc
            }),
            placeholder: "Search location in Madagascar..."
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx(MapPin, {
              size: 16
            }), " ", /* @__PURE__ */ jsx("span", {
              children: profile.location || "Unknown Location"
            })]
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          marginBottom: 32
        },
        children: isOwnProfile ? editing ? /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 12
          },
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => setEditing(false),
            disabled: saving,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 20,
              background: "#374151",
              color: "white",
              border: "none",
              cursor: "pointer",
              opacity: saving ? 0.6 : 1
            },
            children: [/* @__PURE__ */ jsx(X, {
              size: 16
            }), " ", t("auth.profile.cancel")]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: handleUpdate,
            disabled: saving,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 20,
              background: "#4ADE80",
              color: "#0B3D2E",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: saving ? 0.7 : 1
            },
            children: [saving ? /* @__PURE__ */ jsx(Loader2, {
              size: 16,
              style: {
                animation: "spin 1s linear infinite"
              }
            }) : /* @__PURE__ */ jsx(Save, {
              size: 16
            }), saving ? "Saving..." : t("auth.profile.save")]
          })]
        }) : /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 12
          },
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => setEditing(true),
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(74,222,128,0.1)",
              color: "#4ADE80",
              border: "1px solid #4ADE80",
              cursor: "pointer"
            },
            children: [/* @__PURE__ */ jsx(Edit2, {
              size: 16
            }), " ", t("auth.profile.edit")]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => navigate("/analytics"),
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(59, 130, 246, 0.1)",
              color: "#60A5FA",
              border: "1px solid #60A5FA",
              cursor: "pointer"
            },
            children: [/* @__PURE__ */ jsx(BarChart2, {
              size: 16
            }), " Analytics"]
          })]
        }) : /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 12
          },
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => navigate(`/messages/${id}`),
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 24px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              fontWeight: "bold",
              cursor: "pointer"
            },
            children: [/* @__PURE__ */ jsx(Mail, {
              size: 16
            }), " Message"]
          }), /* @__PURE__ */ jsx("button", {
            onClick: handleFollowToggle,
            disabled: followLoading,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 24px",
              borderRadius: 20,
              background: isFollowing ? "transparent" : "#4ADE80",
              color: isFollowing ? "#F2F1EE" : "#0B3D2E",
              border: isFollowing ? "1px solid #4ADE80" : "none",
              fontWeight: "bold",
              cursor: followLoading ? "wait" : "pointer",
              opacity: followLoading ? 0.7 : 1,
              transition: "all 0.2s"
            },
            children: isFollowing ? "Unfollow" : "Follow"
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(13, 77, 58, 0.6)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid #2E7D67"
          },
          children: [/* @__PURE__ */ jsxs("h2", {
            style: {
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8
            },
            children: [/* @__PURE__ */ jsx(User, {
              size: 20,
              color: "#4ADE80"
            }), " About"]
          }), editing ? /* @__PURE__ */ jsx("textarea", {
            value: formData.bio,
            onChange: (e) => setFormData({
              ...formData,
              bio: e.target.value
            }),
            style: {
              width: "100%",
              height: 100,
              background: "rgba(0,0,0,0.2)",
              border: "1px solid #4ADE80",
              borderRadius: 8,
              padding: 8,
              color: "white",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              resize: "vertical"
            }
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsx("p", {
              style: {
                color: "#D7D4CE",
                lineHeight: 1.6,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                margin: 0,
                ...profile.bio && profile.bio.length > 150 && !bioExpanded ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                } : {}
              },
              children: profile.bio || t("auth.profile.bio_placeholder")
            }), profile.bio && profile.bio.length > 150 && /* @__PURE__ */ jsx("button", {
              onClick: () => setBioExpanded(!bioExpanded),
              style: {
                marginTop: 8,
                background: "transparent",
                border: "none",
                color: "#4ADE80",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: "500",
                padding: 0,
                textAlign: "left"
              },
              children: bioExpanded ? "Show less" : "Show more"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 12
              },
              children: [/* @__PURE__ */ jsx(Briefcase, {
                size: 18,
                color: "#A7C7BC"
              }), editing ? /* @__PURE__ */ jsxs("select", {
                value: formData.sector,
                onChange: (e) => setFormData({
                  ...formData,
                  sector: e.target.value
                }),
                style: {
                  background: "#0B3D2E",
                  border: "1px solid #4ADE80",
                  color: "white",
                  padding: 4,
                  borderRadius: 4
                },
                children: [/* @__PURE__ */ jsx("option", {
                  value: "agriculture",
                  children: "Agriculture"
                }), /* @__PURE__ */ jsx("option", {
                  value: "mining",
                  children: "Mining"
                }), /* @__PURE__ */ jsx("option", {
                  value: "both",
                  children: "Both"
                }), /* @__PURE__ */ jsx("option", {
                  value: "other",
                  children: "Other"
                })]
              }) : /* @__PURE__ */ jsxs("span", {
                style: {
                  textTransform: "capitalize"
                },
                children: [profile.sector, " Sector"]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 12
              },
              children: [/* @__PURE__ */ jsx(Mail, {
                size: 18,
                color: "#A7C7BC"
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  color: "#D7D4CE"
                },
                children: profile.email
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 12
              },
              children: [/* @__PURE__ */ jsx(Calendar, {
                size: 18,
                color: "#A7C7BC"
              }), /* @__PURE__ */ jsxs("span", {
                children: [t("auth.profile.member_since"), " ", new Date(profile.created_at).toLocaleDateString()]
              })]
            }), (profile.phone || editing) && /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 12
              },
              children: [/* @__PURE__ */ jsx(Phone, {
                size: 18,
                color: "#A7C7BC"
              }), editing ? /* @__PURE__ */ jsx("input", {
                value: formData.phone,
                onChange: (e) => setFormData({
                  ...formData,
                  phone: e.target.value
                }),
                placeholder: "Phone number",
                style: {
                  background: "#0B3D2E",
                  border: "1px solid #4ADE80",
                  color: "white",
                  padding: 4,
                  borderRadius: 4,
                  flex: 1
                }
              }) : /* @__PURE__ */ jsx("span", {
                children: profile.phone
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(13, 77, 58, 0.6)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid #2E7D67"
          },
          children: [/* @__PURE__ */ jsxs("h2", {
            style: {
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8
            },
            children: [/* @__PURE__ */ jsx(Award, {
              size: 20,
              color: "#C9A66B"
            }), " ", t("auth.profile.badges")]
          }), /* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 8
            },
            children: profile.badges && profile.badges.length > 0 ? profile.badges.map((badge, idx) => /* @__PURE__ */ jsx("span", {
              style: {
                background: "rgba(201, 166, 107, 0.2)",
                color: "#C9A66B",
                padding: "4px 12px",
                borderRadius: 12,
                fontSize: 13,
                border: "1px solid rgba(201, 166, 107, 0.4)"
              },
              children: badge
            }, idx)) : /* @__PURE__ */ jsx("p", {
              style: {
                color: "#A7C7BC",
                fontStyle: "italic"
              },
              children: t("auth.profile.no_badges")
            })
          }), /* @__PURE__ */ jsx("h3", {
            style: {
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 24,
              marginBottom: 12
            },
            children: "Interests"
          }), editing ? /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 12
              },
              children: [formData.interests.map((interest, idx) => /* @__PURE__ */ jsxs("span", {
                style: {
                  background: "rgba(74, 222, 128, 0.1)",
                  color: "#4ADE80",
                  padding: "4px 8px 4px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  border: "1px solid rgba(74, 222, 128, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                },
                children: [interest, /* @__PURE__ */ jsx("button", {
                  onClick: () => {
                    const updated = formData.interests.filter((_, i) => i !== idx);
                    setFormData({
                      ...formData,
                      interests: updated
                    });
                  },
                  style: {
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0
                  },
                  children: /* @__PURE__ */ jsx(X, {
                    size: 12,
                    color: "#4ADE80"
                  })
                })]
              }, idx)), /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                },
                children: [/* @__PURE__ */ jsx("input", {
                  value: newInterest,
                  onChange: (e) => setNewInterest(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && newInterest.trim()) {
                      e.preventDefault();
                      setFormData({
                        ...formData,
                        interests: [...formData.interests, newInterest.trim()]
                      });
                      setNewInterest("");
                    }
                  },
                  placeholder: "Add interest...",
                  style: {
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid #2E7D67",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 12,
                    fontSize: 13,
                    width: 120
                  }
                }), /* @__PURE__ */ jsx("button", {
                  onClick: () => {
                    if (newInterest.trim()) {
                      setFormData({
                        ...formData,
                        interests: [...formData.interests, newInterest.trim()]
                      });
                      setNewInterest("");
                    }
                  },
                  style: {
                    background: "#4ADE80",
                    border: "none",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  },
                  children: /* @__PURE__ */ jsx(Plus, {
                    size: 14,
                    color: "#0B3D2E"
                  })
                })]
              })]
            })
          }) : /* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 8
            },
            children: profile.interests && profile.interests.length > 0 ? profile.interests.map((interest, idx) => /* @__PURE__ */ jsx("span", {
              style: {
                background: "rgba(74, 222, 128, 0.1)",
                color: "#4ADE80",
                padding: "4px 12px",
                borderRadius: 12,
                fontSize: 13,
                border: "1px solid rgba(74, 222, 128, 0.2)"
              },
              children: interest
            }, idx)) : /* @__PURE__ */ jsx("p", {
              style: {
                color: "#A7C7BC",
                fontStyle: "italic"
              },
              children: "No specific interests listed"
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          marginTop: 24,
          background: "rgba(13, 77, 58, 0.6)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #2E7D67",
          height: 400
        },
        children: [/* @__PURE__ */ jsxs("h2", {
          style: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(MapPin, {
            size: 20,
            color: "#4ADE80"
          }), " ", t("auth.profile.location_map")]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            height: "85%",
            width: "100%",
            borderRadius: 12,
            overflow: "hidden"
          },
          children: mapMounted && RL && /* @__PURE__ */ jsxs(RL.MapContainer, {
            center: [formData.location?.lat || profile.location_lat || -18.91, formData.location?.lng || profile.location_lng || 47.53],
            zoom: formData.location?.lat || profile.location_lat ? 12 : 6,
            style: {
              height: "100%",
              width: "100%"
            },
            children: [/* @__PURE__ */ jsx(MapUpdater$1, {
              RL,
              lat: formData.location?.lat || profile.location_lat || -18.91,
              lng: formData.location?.lng || profile.location_lng || 47.53,
              zoom: formData.location?.lat || profile.location_lat ? 12 : 6
            }), /* @__PURE__ */ jsx(RL.TileLayer, {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }), (profile.location_lat || formData.location?.lat) && /* @__PURE__ */ jsx(RL.Marker, {
              position: [profile.location_lat || formData.location?.lat, profile.location_lng || formData.location?.lng],
              children: /* @__PURE__ */ jsx(RL.Popup, {
                children: profile.location || formData.location?.name || "Your Location"
              })
            })]
          })
        })]
      })]
    })]
  });
};
const Profile$1 = UNSAFE_withComponentProps(Profile);
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Profile$1
}, Symbol.toStringTag, { value: "Module" }));
const CommentItem$1 = ({
  comment,
  allComments,
  onReply,
  onFlag,
  depth = 0
}) => {
  const {
    t
  } = useTranslation();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const children = allComments.filter((c) => c.parent_id === comment.id);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReply(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      paddingLeft: depth * 20,
      marginTop: 16
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        background: "rgba(13, 77, 58, 0.4)",
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(46, 125, 103, 0.3)"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [comment.author?.avatar_url ? /* @__PURE__ */ jsx("img", {
            src: comment.author.avatar_url,
            style: {
              width: 24,
              height: 24,
              borderRadius: "50%"
            },
            alt: ""
          }) : /* @__PURE__ */ jsx("div", {
            style: {
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#2E7D67",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            },
            children: /* @__PURE__ */ jsx(User, {
              size: 12,
              color: "#A7C7BC"
            })
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 13,
              fontWeight: "bold",
              color: "#F2F1EE"
            },
            children: comment.author?.name
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 11,
              color: "#A7C7BC"
            },
            children: new Date(comment.created_at).toLocaleDateString()
          })]
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => onFlag(comment.id),
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4
          },
          children: /* @__PURE__ */ jsx(Flag, {
            size: 12,
            color: "#A7C7BC"
          })
        })]
      }), /* @__PURE__ */ jsx("p", {
        style: {
          color: "#D1D5DB",
          fontSize: 14,
          margin: "0 0 8px 0",
          lineHeight: 1.4
        },
        children: comment.content
      }), /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          gap: 16
        },
        children: /* @__PURE__ */ jsxs("button", {
          onClick: () => setShowReply(!showReply),
          style: {
            background: "none",
            border: "none",
            color: "#4ADE80",
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [/* @__PURE__ */ jsx(MessageCircle, {
            size: 12
          }), " ", t("auth.discussion.reply")]
        })
      }), showReply && /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        style: {
          marginTop: 8,
          display: "flex",
          gap: 8
        },
        children: [/* @__PURE__ */ jsx("input", {
          value: replyContent,
          onChange: (e) => setReplyContent(e.target.value),
          placeholder: t("auth.discussion.nested_reply"),
          style: {
            flex: 1,
            background: "rgba(0,0,0,0.2)",
            border: "1px solid #2E7D67",
            borderRadius: 8,
            padding: "4px 8px",
            color: "white",
            fontSize: 13
          }
        }), /* @__PURE__ */ jsx("button", {
          type: "submit",
          disabled: !replyContent.trim(),
          style: {
            background: "#4ADE80",
            border: "none",
            borderRadius: 8,
            padding: "4px 8px",
            cursor: "pointer"
          },
          children: /* @__PURE__ */ jsx(SendHorizontal, {
            size: 14,
            color: "#0B3D2E"
          })
        })]
      })]
    }), children.map((child) => /* @__PURE__ */ jsx(CommentItem$1, {
      comment: child,
      allComments,
      onReply,
      onFlag,
      depth: depth + 1
    }, child.id))]
  });
};
const PostDetails = () => {
  const {
    id
  } = useParams();
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    fetchPostDetails();
    const channel = supabase.channel("comments").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "comments",
      filter: `post_id=eq.${id}`
    }, () => {
      fetchComments();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const {
        data: postData,
        error: postError
      } = await supabase.from("posts").select(`
          *,
          author:users!posts_user_id_fkey(id, name, avatar_url, sector, location),
          likes(count),
          comments!comments_post_id_fkey(count)
        `).eq("id", id).single();
      if (postError) throw postError;
      setPost(postData);
      setLikeCount(postData.likes[0]?.count || 0);
      if (user) {
        const {
          data: likeData
        } = await supabase.from("likes").select("user_id").eq("post_id", id).eq("user_id", user.id).maybeSingle();
        setHasLiked(!!likeData);
      }
      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Could not load post");
    } finally {
      setLoading(false);
    }
  };
  const fetchComments = async () => {
    const {
      data: commentsData,
      error: commentsError
    } = await supabase.from("comments").select(`
          *,
          author:users!comments_user_id_fkey(id, name, avatar_url)
        `).eq("post_id", id).order("created_at", {
      ascending: true
    });
    if (commentsError) console.error(commentsError);
    else setComments(commentsData || []);
  };
  const handleCreateComment = async (parentId = null, contentStr = newComment) => {
    if (!contentStr.trim()) return;
    if (!parentId) setSending(true);
    try {
      const {
        error
      } = await supabase.from("comments").insert({
        post_id: id,
        user_id: user.id,
        content: contentStr,
        parent_id: parentId
      });
      if (error) throw error;
      if (!parentId) setNewComment("");
      await fetchComments();
    } catch {
      toast.error("Failed to post comment");
    } finally {
      if (!parentId) setSending(false);
    }
  };
  const handleLike = async () => {
    const previousLiked = hasLiked;
    const previousCount = likeCount;
    setHasLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);
    try {
      if (previousLiked) {
        const {
          error
        } = await supabase.from("likes").delete().match({
          post_id: id,
          user_id: user.id
        });
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("likes").insert({
          post_id: id,
          user_id: user.id
        });
        if (error) throw error;
      }
    } catch (err) {
      console.error(err);
      setHasLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error("Failed to update like");
    }
  };
  const handleFlag = (commentId) => {
    console.log("Flagging comment:", commentId);
    toast.success("Content flagged for moderation");
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },
      children: [/* @__PURE__ */ jsx(Loader2, {
        style: {
          color: "#4ADE80",
          animation: "spin 1s linear infinite"
        }
      }), /* @__PURE__ */ jsx("style", {
        children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
      })]
    });
  }
  if (!post) return /* @__PURE__ */ jsx("div", {
    style: {
      background: "#0B3D2E",
      minHeight: "100vh",
      color: "white",
      padding: 20
    },
    children: "Post not found"
  });
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "10px 16px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 16
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate(-1),
        style: {
          background: "transparent",
          border: "none",
          color: "#F2F1EE",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {})
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#F2F1EE",
          margin: 0
        },
        children: "Discussion"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 640,
        margin: "0 auto",
        padding: "20px 16px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 24,
          paddingBottom: 24,
          borderBottom: "1px solid rgba(46, 125, 103, 0.5)"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 12,
            marginBottom: 12
          },
          children: [post.author?.avatar_url ? /* @__PURE__ */ jsx("img", {
            src: post.author.avatar_url,
            style: {
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover"
            },
            alt: ""
          }) : /* @__PURE__ */ jsx("div", {
            style: {
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#2E7D67",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            },
            children: /* @__PURE__ */ jsx(User, {
              size: 24,
              color: "#A7C7BC"
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              style: {
                fontSize: 16,
                fontWeight: "bold",
                color: "#F2F1EE",
                margin: 0
              },
              children: post.author?.name
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                fontSize: 12,
                color: "#A7C7BC",
                marginTop: 4
              },
              children: [post.author?.sector && /* @__PURE__ */ jsx("span", {
                style: {
                  marginRight: 8
                },
                children: post.author.sector
              }), /* @__PURE__ */ jsx("span", {
                children: new Date(post.created_at).toLocaleDateString()
              })]
            })]
          })]
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#F2F1EE",
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 16,
            whiteSpace: "pre-wrap"
          },
          children: post.content
        }), post.media_urls && post.media_urls.length > 0 && /* @__PURE__ */ jsx("div", {
          style: {
            marginBottom: 16,
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 4
          },
          className: "media-container",
          children: post.media_urls.map((url, i) => {
            const isVideo = url.match(/\.(mp4|webm|ogg|mov|quicktime)$/i);
            const MediaTag = isVideo ? "video" : "img";
            return /* @__PURE__ */ jsx(MediaTag, {
              src: url,
              controls: isVideo,
              className: "post-media-item",
              alt: !isVideo ? "Post content" : void 0
            }, i);
          })
        }), /* @__PURE__ */ jsx("style", {
          children: `
             .post-media-item {
               width: 100%;
               height: auto;
               max-height: 600px;
               object-fit: cover;
               border-radius: 8px;
             }
             @media (min-width: 768px) {
               .post-media-item {
                 max-height: 300px; /* Reduced height for PC */
                 width: auto;
                 max-width: 100%;
                 margin: 0 auto;
                 display: block;
                 object-fit: contain;
                 background: rgba(0,0,0,0.2);
               }
             }
           `
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 24,
            color: "#A7C7BC"
          },
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: handleLike,
            style: {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: hasLiked ? "#EF4444" : "#A7C7BC"
            },
            children: [/* @__PURE__ */ jsx(Heart, {
              size: 20,
              fill: hasLiked ? "#EF4444" : "none"
            }), /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 14
              },
              children: likeCount
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6
            },
            children: [/* @__PURE__ */ jsx(MessageCircle, {
              size: 20
            }), " ", /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 14
              },
              children: comments.length
            })]
          }), /* @__PURE__ */ jsx(Share2, {
            size: 20,
            style: {
              marginLeft: "auto"
            }
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 40
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 16,
            color: "#F2F1EE",
            marginBottom: 16
          },
          children: [t("auth.discussion.load_comments"), " (", comments.length, ")"]
        }), comments.filter((c) => !c.parent_id).length === 0 ? /* @__PURE__ */ jsx("p", {
          style: {
            color: "#A7C7BC",
            textAlign: "center",
            padding: 20
          },
          children: t("auth.discussion.no_comments")
        }) : comments.filter((c) => !c.parent_id).map((comment) => /* @__PURE__ */ jsx(CommentItem$1, {
          comment,
          allComments: comments,
          onReply: (parentId, content) => handleCreateComment(parentId, content),
          onFlag: handleFlag
        }, comment.id))]
      })]
    }), /* @__PURE__ */ jsx("div", {
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#0B3D2E",
        borderTop: "1px solid #2E7D67",
        padding: "12px 16px",
        zIndex: 40
      },
      children: /* @__PURE__ */ jsxs("div", {
        style: {
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          gap: 12
        },
        children: [/* @__PURE__ */ jsx("input", {
          value: newComment,
          onChange: (e) => setNewComment(e.target.value),
          placeholder: t("auth.discussion.write_reply"),
          style: {
            flex: 1,
            background: "rgba(0,0,0,0.2)",
            border: "1px solid #2E7D67",
            borderRadius: 20,
            padding: "10px 16px",
            color: "white",
            outline: "none"
          }
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => handleCreateComment(null),
          disabled: !newComment.trim() || sending,
          style: {
            background: "transparent",
            border: "none",
            padding: 8,
            cursor: !newComment.trim() || sending ? "not-allowed" : "pointer",
            opacity: !newComment.trim() || sending ? 0.5 : 1
          },
          children: sending ? /* @__PURE__ */ jsx(Loader2, {
            size: 24,
            style: {
              animation: "spin 1s linear infinite"
            },
            color: "#4ADE80"
          }) : /* @__PURE__ */ jsx(SendHorizontal, {
            size: 28,
            color: "#4ADE80"
          })
        })]
      })
    })]
  });
};
const PostDetails$1 = UNSAFE_withComponentProps(PostDetails);
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PostDetails$1
}, Symbol.toStringTag, { value: "Module" }));
const CommentItem = ({
  comment,
  allComments,
  onReply,
  onFlag,
  depth = 0
}) => {
  const {
    t
  } = useTranslation();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const children = allComments.filter((c) => c.parent_id === comment.id);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReply(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      paddingLeft: depth * 20,
      marginTop: 16
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        background: "rgba(13, 77, 58, 0.4)",
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(46, 125, 103, 0.3)"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [comment.author?.avatar_url ? /* @__PURE__ */ jsx("img", {
            src: comment.author.avatar_url,
            style: {
              width: 24,
              height: 24,
              borderRadius: "50%"
            },
            alt: ""
          }) : /* @__PURE__ */ jsx("div", {
            style: {
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#2E7D67",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            },
            children: /* @__PURE__ */ jsx(User, {
              size: 12,
              color: "#A7C7BC"
            })
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 13,
              fontWeight: "bold",
              color: "#F2F1EE"
            },
            children: comment.author?.name
          }), /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 11,
              color: "#A7C7BC"
            },
            children: new Date(comment.created_at).toLocaleDateString()
          })]
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => onFlag(comment.id),
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4
          },
          children: /* @__PURE__ */ jsx(Flag, {
            size: 12,
            color: "#A7C7BC"
          })
        })]
      }), /* @__PURE__ */ jsx("p", {
        style: {
          color: "#D1D5DB",
          fontSize: 14,
          margin: "0 0 8px 0",
          lineHeight: 1.4
        },
        children: comment.content
      }), /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          gap: 16
        },
        children: /* @__PURE__ */ jsxs("button", {
          onClick: () => setShowReply(!showReply),
          style: {
            background: "none",
            border: "none",
            color: "#4ADE80",
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [/* @__PURE__ */ jsx(MessageCircle, {
            size: 12
          }), " ", t("auth.discussion.reply")]
        })
      }), showReply && /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        style: {
          marginTop: 8,
          display: "flex",
          gap: 8
        },
        children: [/* @__PURE__ */ jsx("input", {
          value: replyContent,
          onChange: (e) => setReplyContent(e.target.value),
          placeholder: t("auth.discussion.nested_reply"),
          style: {
            flex: 1,
            background: "rgba(0,0,0,0.2)",
            border: "1px solid #2E7D67",
            borderRadius: 8,
            padding: "4px 8px",
            color: "white",
            fontSize: 13
          }
        }), /* @__PURE__ */ jsx("button", {
          type: "submit",
          disabled: !replyContent.trim(),
          style: {
            background: "#4ADE80",
            border: "none",
            borderRadius: 8,
            padding: "4px 8px",
            cursor: "pointer"
          },
          children: /* @__PURE__ */ jsx(SendHorizontal, {
            size: 14,
            color: "#0B3D2E"
          })
        })]
      })]
    }), children.map((child) => /* @__PURE__ */ jsx(CommentItem, {
      comment: child,
      allComments,
      onReply,
      onFlag,
      depth: depth + 1
    }, child.id))]
  });
};
const GroupPostDetails = () => {
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [userVote, setUserVote] = useState(0);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  useEffect(() => {
    fetchPostDetails();
    const channel = supabase.channel("group_comments").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "group_comments",
      filter: `post_id=eq.${id}`
    }, () => {
      fetchComments();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const {
        data: postData,
        error: postError
      } = await supabase.from("posts").select(`
          *,
          author:users!posts_user_id_fkey(id, name, avatar_url, sector, location),
          votes:votes(vote_value),
          group_comments!group_comments_post_id_fkey(count)
        `).eq("id", id).single();
      if (postError) throw postError;
      const uVotes = postData.votes.filter((v) => v.vote_value === 1).length;
      const dVotes = postData.votes.filter((v) => v.vote_value === -1).length;
      const myVote = user ? postData.votes.find((v) => v.user_id === user.id)?.vote_value || 0 : 0;
      setPost(postData);
      setUpvotes(uVotes);
      setDownvotes(dVotes);
      setUserVote(myVote);
      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Could not load discussion");
    } finally {
      setLoading(false);
    }
  };
  const fetchComments = async () => {
    const {
      data: commentsData,
      error: commentsError
    } = await supabase.from("group_comments").select(`
          *,
          author:users!group_comments_user_id_fkey(id, name, avatar_url)
        `).eq("post_id", id).order("created_at", {
      ascending: true
    });
    if (commentsError) console.error(commentsError);
    else setComments(commentsData || []);
  };
  const handleCreateComment = async (parentId = null, contentStr = newComment) => {
    if (!contentStr.trim()) return;
    if (!parentId) setSending(true);
    try {
      const {
        error
      } = await supabase.from("group_comments").insert({
        post_id: id,
        user_id: user.id,
        group_id: post.group_id,
        // Important for RLS
        content: contentStr,
        parent_id: parentId
      });
      if (error) throw error;
      if (!parentId) setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    } finally {
      if (!parentId) setSending(false);
    }
  };
  const handleVote = async (value) => {
    if (!user) return;
    const previousVote = userVote;
    const previousUp = upvotes;
    const previousDown = downvotes;
    const newValue = previousVote === value ? 0 : value;
    setUserVote(newValue);
    if (previousVote === 1) setUpvotes((prev) => prev - 1);
    if (previousVote === -1) setDownvotes((prev) => prev - 1);
    if (newValue === 1) setUpvotes((prev) => prev + 1);
    if (newValue === -1) setDownvotes((prev) => prev + 1);
    try {
      if (newValue === 0) {
        await supabase.from("votes").delete().match({
          post_id: id,
          user_id: user.id
        });
      } else {
        const {
          error
        } = await supabase.from("votes").upsert({
          group_id: post.group_id,
          post_id: id,
          user_id: user.id,
          vote_value: newValue
        }, {
          onConflict: "post_id, user_id"
        });
        if (error) throw error;
      }
    } catch (err) {
      console.error(err);
      setUserVote(previousVote);
      setUpvotes(previousUp);
      setDownvotes(previousDown);
      toast.error("Failed to vote");
    }
  };
  const handleFlag = (commentId) => {
    console.log("Flagging comment:", commentId);
    toast.success("Flagged for moderation");
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },
      children: [/* @__PURE__ */ jsx(Loader2, {
        style: {
          color: "#4ADE80",
          animation: "spin 1s linear infinite"
        }
      }), /* @__PURE__ */ jsx("style", {
        children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
      })]
    });
  }
  if (!post) return /* @__PURE__ */ jsx("div", {
    style: {
      background: "#0B3D2E",
      minHeight: "100vh",
      color: "white",
      padding: 20
    },
    children: "Discussion not found"
  });
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "10px 16px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 16
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate(-1),
        style: {
          background: "transparent",
          border: "none",
          color: "#F2F1EE",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {})
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#F2F1EE",
          margin: 0
        },
        children: "Group Discussion"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 640,
        margin: "0 auto",
        padding: "20px 16px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 24,
          paddingBottom: 24,
          borderBottom: "1px solid rgba(46, 125, 103, 0.5)"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 12,
            marginBottom: 12
          },
          children: [post.author?.avatar_url ? /* @__PURE__ */ jsx("img", {
            src: post.author.avatar_url,
            style: {
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover"
            },
            alt: ""
          }) : /* @__PURE__ */ jsx("div", {
            style: {
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#2E7D67",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            },
            children: /* @__PURE__ */ jsx(User, {
              size: 24,
              color: "#A7C7BC"
            })
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              style: {
                fontSize: 16,
                fontWeight: "bold",
                color: "#F2F1EE",
                margin: 0
              },
              children: post.author?.name
            }), /* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 12,
                color: "#A7C7BC",
                marginTop: 4
              },
              children: /* @__PURE__ */ jsx("span", {
                children: new Date(post.created_at).toLocaleDateString()
              })
            })]
          })]
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#F2F1EE",
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 16,
            whiteSpace: "pre-wrap"
          },
          children: post.content
        }), post.media_urls && post.media_urls.length > 0 && /* @__PURE__ */ jsx("div", {
          style: {
            marginBottom: 16,
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 4
          },
          children: post.media_urls.map((url, i) => url.match(/\.(mp4|webm|ogg|mov|quicktime)$/i) ? /* @__PURE__ */ jsx("video", {
            src: url,
            controls: true,
            style: {
              width: "100%",
              borderRadius: 8
            }
          }, i) : /* @__PURE__ */ jsx("img", {
            src: url,
            style: {
              width: "100%",
              borderRadius: 8
            },
            alt: ""
          }, i))
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 16,
            color: "#A7C7BC"
          },
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => handleVote(1),
            style: {
              background: userVote === 1 ? "rgba(74, 222, 128, 0.2)" : "transparent",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: userVote === 1 ? "#4ADE80" : "#A7C7BC"
            },
            children: [/* @__PURE__ */ jsx(ThumbsUp, {
              size: 20
            }), /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 14
              },
              children: upvotes
            })]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => handleVote(-1),
            style: {
              background: userVote === -1 ? "rgba(239, 68, 68, 0.2)" : "transparent",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: userVote === -1 ? "#EF4444" : "#A7C7BC"
            },
            children: [/* @__PURE__ */ jsx(ThumbsDown, {
              size: 20
            }), /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 14
              },
              children: downvotes
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginLeft: "auto"
            },
            children: [/* @__PURE__ */ jsx(MessageCircle, {
              size: 20
            }), " ", /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 14
              },
              children: comments.length
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 40
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 16,
            color: "#F2F1EE",
            marginBottom: 16
          },
          children: ["Comments (", comments.length, ")"]
        }), comments.filter((c) => !c.parent_id).length === 0 ? /* @__PURE__ */ jsx("p", {
          style: {
            color: "#A7C7BC",
            textAlign: "center",
            padding: 20
          },
          children: "No comments yet."
        }) : comments.filter((c) => !c.parent_id).map((comment) => /* @__PURE__ */ jsx(CommentItem, {
          comment,
          allComments: comments,
          onReply: (parentId, content) => handleCreateComment(parentId, content),
          onFlag: handleFlag
        }, comment.id))]
      })]
    }), /* @__PURE__ */ jsx("div", {
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#0B3D2E",
        borderTop: "1px solid #2E7D67",
        padding: "12px 16px",
        zIndex: 40
      },
      children: /* @__PURE__ */ jsxs("div", {
        style: {
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          gap: 12
        },
        children: [/* @__PURE__ */ jsx("input", {
          value: newComment,
          onChange: (e) => setNewComment(e.target.value),
          placeholder: "Write a reply...",
          style: {
            flex: 1,
            background: "rgba(0,0,0,0.2)",
            border: "1px solid #2E7D67",
            borderRadius: 20,
            padding: "10px 16px",
            color: "white",
            outline: "none"
          }
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => handleCreateComment(null),
          disabled: !newComment.trim() || sending,
          style: {
            background: "transparent",
            border: "none",
            padding: 8,
            cursor: !newComment.trim() || sending ? "not-allowed" : "pointer",
            opacity: !newComment.trim() || sending ? 0.5 : 1
          },
          children: sending ? /* @__PURE__ */ jsx(Loader2, {
            size: 24,
            style: {
              animation: "spin 1s linear infinite"
            },
            color: "#4ADE80"
          }) : /* @__PURE__ */ jsx(SendHorizontal, {
            size: 28,
            color: "#4ADE80"
          })
        })]
      })
    })]
  });
};
const GroupPostDetails$1 = UNSAFE_withComponentProps(GroupPostDetails);
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GroupPostDetails$1
}, Symbol.toStringTag, { value: "Module" }));
const Groups = () => {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchGroups();
  }, []);
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from("groups").select(`
          *,
          creator:users!groups_creator_id_fkey(name, avatar_url),
          members:group_members(count)
        `).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()) || group.description?.toLowerCase().includes(searchTerm.toLowerCase()));
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      paddingBottom: 80,
      color: "#F2F1EE"
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10
      },
      children: [/* @__PURE__ */ jsxs("h1", {
        style: {
          fontSize: 24,
          fontWeight: "bold",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 10
        },
        children: [/* @__PURE__ */ jsx(Users, {
          color: "#4ADE80"
        }), " ", t("auth.groups.title") || "Groups"]
      }), user && /* @__PURE__ */ jsxs(Link, {
        to: "/create-group",
        style: {
          background: "#4ADE80",
          color: "#0B3D2E",
          padding: "8px 16px",
          borderRadius: 20,
          textDecoration: "none",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 14,
          whiteSpace: "nowrap"
        },
        children: [/* @__PURE__ */ jsx(PlusSquare, {
          size: 18
        }), " ", t("auth.groups.create") || "Create Group"]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "20px auto",
        padding: "0 20px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          position: "relative",
          marginBottom: 24
        },
        children: [/* @__PURE__ */ jsx(Search, {
          size: 20,
          color: "#A7C7BC",
          style: {
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)"
          }
        }), /* @__PURE__ */ jsx("input", {
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: t("auth.groups.search_placeholder") || "Search for groups...",
          style: {
            width: "100%",
            background: "rgba(13, 77, 58, 0.6)",
            border: "1px solid #2E7D67",
            borderRadius: 12,
            padding: "12px 12px 12px 44px",
            color: "white",
            fontSize: 16,
            outline: "none",
            boxSizing: "border-box"
          }
        })]
      }), loading ? /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          padding: 40
        },
        children: [/* @__PURE__ */ jsx(Loader2, {
          style: {
            color: "#4ADE80",
            width: 32,
            height: 32,
            animation: "spin 1s linear infinite"
          }
        }), /* @__PURE__ */ jsx("style", {
          children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
        })]
      }) : filteredGroups.length === 0 ? /* @__PURE__ */ jsxs("div", {
        style: {
          textAlign: "center",
          padding: 40,
          color: "#A7C7BC",
          background: "rgba(13, 77, 58, 0.4)",
          borderRadius: 16
        },
        children: [/* @__PURE__ */ jsx(Users, {
          size: 48,
          style: {
            opacity: 0.5,
            marginBottom: 16
          }
        }), /* @__PURE__ */ jsx("p", {
          children: t("auth.groups.no_groups") || "No groups found. Create one!"
        })]
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 16
        },
        children: filteredGroups.map((group) => /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 10
          },
          animate: {
            opacity: 1,
            y: 0
          },
          style: {
            background: "rgba(13, 77, 58, 0.6)",
            border: "1px solid #2E7D67",
            borderRadius: 16,
            padding: 20,
            transition: "transform 0.2s",
            cursor: "pointer"
          },
          whileHover: {
            scale: 1.01,
            borderColor: "#4ADE80"
          },
          onClick: () => navigate(`/group/${group.id}`),
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8
            },
            children: [/* @__PURE__ */ jsx("h3", {
              style: {
                fontSize: 18,
                fontWeight: "bold",
                margin: 0,
                color: "#F2F1EE"
              },
              children: group.name
            }), /* @__PURE__ */ jsx("span", {
              style: {
                fontSize: 12,
                background: group.is_public ? "rgba(74, 222, 128, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: group.is_public ? "#4ADE80" : "#EF4444",
                padding: "2px 8px",
                borderRadius: 10
              },
              children: group.is_public ? "Public" : "Private"
            })]
          }), /* @__PURE__ */ jsx("p", {
            style: {
              color: "#A7C7BC",
              fontSize: 14,
              margin: "0 0 16px 0",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            },
            children: group.description
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(46, 125, 103, 0.3)",
              paddingTop: 12
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#A7C7BC"
              },
              children: [/* @__PURE__ */ jsx(Users, {
                size: 16
              }), /* @__PURE__ */ jsxs("span", {
                children: [group.members && group.members[0]?.count || 0, " Members"]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8
              },
              children: [/* @__PURE__ */ jsxs("span", {
                style: {
                  fontSize: 13,
                  color: "#A7C7BC"
                },
                children: ["Created by ", group.creator?.name || "Unknown"]
              }), group.creator?.avatar_url && /* @__PURE__ */ jsx("img", {
                src: group.creator.avatar_url,
                alt: "",
                style: {
                  width: 24,
                  height: 24,
                  borderRadius: "50%"
                }
              })]
            })]
          })]
        }, group.id))
      })]
    })]
  });
};
const Groups$1 = UNSAFE_withComponentProps(Groups);
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Groups$1
}, Symbol.toStringTag, { value: "Module" }));
const CreateGroup = () => {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: true
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }
    setLoading(true);
    try {
      const {
        data: groupData,
        error: groupError
      } = await supabase.from("groups").insert({
        name: formData.name,
        description: formData.description,
        is_public: formData.is_public,
        creator_id: user.id
      }).select().single();
      if (groupError) throw groupError;
      const {
        error: memberError
      } = await supabase.from("group_members").insert({
        group_id: groupData.id,
        user_id: user.id,
        role: "admin",
        status: "member"
      });
      if (memberError) throw memberError;
      toast.success(t("auth.groups.created_success") || "Group created successfully!");
      navigate(`/group/${groupData.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      paddingBottom: 80,
      color: "#F2F1EE"
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 600,
        margin: "0 auto",
        padding: "20px"
      },
      children: [/* @__PURE__ */ jsxs("button", {
        onClick: () => navigate(-1),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 18
        }), " Back"]
      }), /* @__PURE__ */ jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        style: {
          background: "rgba(13, 77, 58, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid #2E7D67",
          borderRadius: 16,
          padding: 32
        },
        children: [/* @__PURE__ */ jsxs("h1", {
          style: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 10
          },
          children: [/* @__PURE__ */ jsx(Users, {
            size: 28,
            color: "#4ADE80"
          }), " ", t("auth.groups.create_title") || "Create a New Group"]
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#A7C7BC",
            marginBottom: 24
          },
          children: "Start a community for your project or interest."
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleSubmit,
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 20
          },
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                color: "#F2F1EE",
                marginBottom: 8,
                fontSize: 14
              },
              children: "Group Name"
            }), /* @__PURE__ */ jsx("input", {
              value: formData.name,
              onChange: (e) => setFormData({
                ...formData,
                name: e.target.value
              }),
              placeholder: "e.g. Clean Water Project",
              style: {
                width: "100%",
                padding: "12px",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid #2E7D67",
                borderRadius: 8,
                color: "white",
                fontSize: 16,
                outline: "none"
              }
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                color: "#F2F1EE",
                marginBottom: 8,
                fontSize: 14
              },
              children: "Description"
            }), /* @__PURE__ */ jsx("textarea", {
              value: formData.description,
              onChange: (e) => setFormData({
                ...formData,
                description: e.target.value
              }),
              placeholder: "Describe the purpose of this group...",
              rows: 4,
              style: {
                width: "100%",
                padding: "12px",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid #2E7D67",
                borderRadius: 8,
                color: "white",
                fontSize: 16,
                resize: "none",
                outline: "none",
                fontFamily: "inherit"
              }
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12
            },
            children: [/* @__PURE__ */ jsx("input", {
              type: "checkbox",
              id: "is_public",
              checked: formData.is_public,
              onChange: (e) => setFormData({
                ...formData,
                is_public: e.target.checked
              }),
              style: {
                width: 18,
                height: 18,
                accentColor: "#4ADE80"
              }
            }), /* @__PURE__ */ jsx("label", {
              htmlFor: "is_public",
              style: {
                color: "#F2F1EE",
                fontSize: 14,
                cursor: "pointer"
              },
              children: "Public Group (Anyone can view and join)"
            })]
          }), /* @__PURE__ */ jsxs("button", {
            type: "submit",
            disabled: loading,
            style: {
              background: "#4ADE80",
              color: "#0B3D2E",
              border: "none",
              padding: "14px",
              borderRadius: 12,
              fontWeight: "bold",
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 10
            },
            children: [loading ? /* @__PURE__ */ jsx(Loader2, {
              className: "animate-spin"
            }) : /* @__PURE__ */ jsx(CheckCircle, {}), t("auth.groups.submit_create") || "Create Group"]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `
    })]
  });
};
const CreateGroup$1 = UNSAFE_withComponentProps(CreateGroup);
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CreateGroup$1
}, Symbol.toStringTag, { value: "Module" }));
const GroupDetails = () => {
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  useEffect(() => {
    if (id) {
      fetchGroupDetails();
      fetchMembers();
      fetchGroupPosts();
    }
  }, [id]);
  const [status, setStatus] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (id) {
      fetchGroupDetails();
      fetchMembers();
      fetchGroupPosts();
    }
  }, [id]);
  useEffect(() => {
    if (user && members.length > 0) {
      const membership = members.find((m) => m.user_id === user.id);
      if (membership) {
        setStatus(membership.status);
        setIsMember(["member", "admin"].includes(membership.status));
        setIsAdmin(membership.role === "admin" && ["member", "admin"].includes(membership.status));
      } else {
        setStatus(null);
        setIsMember(false);
        setIsAdmin(false);
      }
    } else {
      setStatus(null);
      setIsMember(false);
      setIsAdmin(false);
    }
  }, [user, members]);
  const fetchGroupDetails = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("groups").select("*, creator:users!groups_creator_id_fkey(name, avatar_url)").eq("id", id).single();
      if (error) throw error;
      setGroup(data);
    } catch (error) {
      console.error("Error fetching group:", error);
      toast.error("Could not load group details");
    } finally {
      setLoading(false);
    }
  };
  const fetchMembers = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("group_members").select("*, user:users(id, name, avatar_url)").eq("group_id", id);
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  const fetchGroupPosts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("posts").select(`
                    *,
                    author:users!posts_user_id_fkey(name, avatar_url),
                    votes:votes(vote_value),
                    group_comments!group_comments_post_id_fkey(count)
                `).eq("group_id", id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      const postsWithVotes = data.map((post) => {
        const upvotes = post.votes.filter((v) => v.vote_value === 1).length;
        const downvotes = post.votes.filter((v) => v.vote_value === -1).length;
        const userVote = user ? post.votes.find((v) => v.user_id === user.id)?.vote_value : 0;
        return {
          ...post,
          upvotes,
          downvotes,
          userVote
        };
      });
      setPosts(postsWithVotes);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const handleJoinToggle = async () => {
    if (!user) {
      toast.error("Please login to join groups");
      return;
    }
    setJoinLoading(true);
    try {
      if (status) {
        const {
          error
        } = await supabase.from("group_members").delete().eq("group_id", id).eq("user_id", user.id);
        if (error) throw error;
        setMembers((prev) => prev.filter((m) => m.user_id !== user.id));
        toast.success(status === "pending" ? "Request cancelled" : "Left group");
        setStatus(null);
      } else {
        const initialStatus = group.is_public ? "member" : "pending";
        const {
          error
        } = await supabase.from("group_members").insert({
          group_id: id,
          user_id: user.id,
          status: initialStatus
        });
        if (error) throw error;
        await fetchMembers();
        toast.success(initialStatus === "pending" ? "Request sent to admin" : "Joined group!");
      }
    } catch (error) {
      console.error("Error toggling join:", error);
      toast.error("Action failed");
    } finally {
      setJoinLoading(false);
    }
  };
  const handleAcceptRequest = async (userId) => {
    try {
      const {
        error
      } = await supabase.from("group_members").update({
        status: "member"
      }).eq("group_id", id).eq("user_id", userId);
      if (error) throw error;
      setMembers((prev) => prev.map((m) => m.user_id === userId ? {
        ...m,
        status: "member"
      } : m));
      toast.success("Member accepted!");
    } catch (error) {
      console.error("Error accepting member:", error);
      toast.error("Failed to accept member");
    }
  };
  const handleRejectRequest = async (userId) => {
    try {
      const {
        error
      } = await supabase.from("group_members").delete().eq("group_id", id).eq("user_id", userId);
      if (error) throw error;
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      toast.success("Request rejected");
    } catch (error) {
      console.error("Error rejecting member:", error);
      toast.error("Failed to reject member");
    }
  };
  const copyInviteLink = () => {
    const link = `https://ala-mg.com/group/${id}?invite=${group.invitation_code}`;
    navigator.clipboard.writeText(link);
    toast.success("Invite link copied!");
  };
  const handleVote = async (postId, value) => {
    if (!isMember) {
      toast.error("You must be a member to vote");
      return;
    }
    try {
      const postIndex = posts.findIndex((p) => p.id === postId);
      const currentVote = posts[postIndex].userVote;
      const newPosts = [...posts];
      const post = newPosts[postIndex];
      const newValue = currentVote === value ? 0 : value;
      if (currentVote === 1) post.upvotes--;
      if (currentVote === -1) post.downvotes--;
      if (newValue === 1) post.upvotes++;
      if (newValue === -1) post.downvotes++;
      post.userVote = newValue;
      setPosts(newPosts);
      if (newValue === 0) {
        await supabase.from("votes").delete().match({
          post_id: postId,
          user_id: user.id
        });
      } else {
        const {
          error
        } = await supabase.from("votes").upsert({
          group_id: id,
          post_id: postId,
          user_id: user.id,
          vote_value: newValue
        }, {
          onConflict: "post_id, user_id"
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Failed to vote");
      fetchGroupPosts();
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", {
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B3D2E"
      },
      children: [/* @__PURE__ */ jsx(Loader2, {
        style: {
          color: "#4ADE80",
          width: 40,
          height: 40,
          animation: "spin 1s linear infinite"
        }
      }), /* @__PURE__ */ jsx("style", {
        children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
      })]
    });
  }
  if (!group) return /* @__PURE__ */ jsx("div", {
    style: {
      padding: 40,
      color: "white",
      background: "#0B3D2E",
      minHeight: "100vh"
    },
    children: "Group not found"
  });
  return /* @__PURE__ */ jsx("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      paddingBottom: 80,
      color: "#F2F1EE"
    },
    children: /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: "20px"
      },
      children: [/* @__PURE__ */ jsxs("button", {
        onClick: () => navigate("/groups"),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 18
        }), " Back to Groups"]
      }), isAdmin && members.some((m) => m.status === "pending") && /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(251, 191, 36, 0.1)",
          border: "1px solid #FBBF24",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            color: "#FBBF24",
            fontSize: 18,
            fontWeight: "bold",
            margin: "0 0 16px 0"
          },
          children: ["Pending Requests (", members.filter((m) => m.status === "pending").length, ")"]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 12
          },
          children: members.filter((m) => m.status === "pending").map((request) => /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(0,0,0,0.2)",
              padding: 12,
              borderRadius: 12
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 12
              },
              children: [request.user?.avatar_url ? /* @__PURE__ */ jsx("img", {
                src: request.user.avatar_url,
                style: {
                  width: 40,
                  height: 40,
                  borderRadius: "50%"
                },
                alt: ""
              }) : /* @__PURE__ */ jsx("div", {
                style: {
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#2E7D67",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: /* @__PURE__ */ jsx(Users, {
                  size: 20,
                  color: "#A7C7BC"
                })
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("div", {
                  style: {
                    fontWeight: "bold"
                  },
                  children: request.user?.name || "Unknown User"
                }), /* @__PURE__ */ jsxs("div", {
                  style: {
                    fontSize: 12,
                    color: "#A7C7BC"
                  },
                  children: ["Requested ", new Date(request.joined_at).toLocaleDateString()]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                gap: 8
              },
              children: [/* @__PURE__ */ jsx("button", {
                onClick: () => handleAcceptRequest(request.user_id),
                style: {
                  background: "#4ADE80",
                  border: "none",
                  borderRadius: 8,
                  padding: 8,
                  cursor: "pointer",
                  color: "#0B3D2E"
                },
                title: "Accept",
                children: /* @__PURE__ */ jsx(Check, {
                  size: 20
                })
              }), /* @__PURE__ */ jsx("button", {
                onClick: () => handleRejectRequest(request.user_id),
                style: {
                  background: "#EF4444",
                  border: "none",
                  borderRadius: 8,
                  padding: 8,
                  cursor: "pointer",
                  color: "white"
                },
                title: "Reject",
                children: /* @__PURE__ */ jsx(X, {
                  size: 20
                })
              })]
            })]
          }, request.user_id))
        })]
      }), /* @__PURE__ */ jsx("div", {
        style: {
          background: "rgba(13, 77, 58, 0.6)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #2E7D67",
          marginBottom: 24
        },
        children: /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 20
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 300px"
            },
            children: [/* @__PURE__ */ jsx("h1", {
              style: {
                fontSize: 32,
                fontWeight: "bold",
                marginBottom: 8,
                wordBreak: "break-word"
              },
              children: group.name
            }), /* @__PURE__ */ jsx("p", {
              style: {
                color: "#A7C7BC",
                fontSize: 16,
                lineHeight: 1.6,
                marginBottom: 16
              },
              children: group.description
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                gap: 16,
                fontSize: 14,
                color: "#A7C7BC",
                flexWrap: "wrap"
              },
              children: [/* @__PURE__ */ jsx("span", {
                children: group.is_public ? "Public Group" : "Private Group"
              }), /* @__PURE__ */ jsxs("span", {
                children: ["Created by ", group.creator?.name]
              }), /* @__PURE__ */ jsxs("span", {
                children: [members.length, " Members"]
              })]
            })]
          }), user && /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              gap: 10,
              flexWrap: "wrap"
            },
            children: [isMember && /* @__PURE__ */ jsx("button", {
              onClick: copyInviteLink,
              style: {
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                padding: "10px 16px",
                borderRadius: 24,
                color: "#A7C7BC",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: "bold",
                fontSize: 14,
                whiteSpace: "nowrap"
              },
              children: "Share Invite"
            }), /* @__PURE__ */ jsx("button", {
              onClick: user.id === group.creator_id ? void 0 : handleJoinToggle,
              disabled: joinLoading || user.id === group.creator_id,
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: 24,
                background: user.id === group.creator_id ? "rgba(74, 222, 128, 0.1)" : status ? "transparent" : "#4ADE80",
                color: user.id === group.creator_id ? "#4ADE80" : status ? status === "pending" ? "#FBBF24" : "#F2F1EE" : "#0B3D2E",
                border: user.id === group.creator_id ? "1px solid #4ADE80" : status ? status === "pending" ? "1px solid #FBBF24" : "1px solid #EF4444" : "none",
                fontWeight: "bold",
                cursor: user.id === group.creator_id || joinLoading ? "default" : "pointer",
                whiteSpace: "nowrap"
              },
              children: status === "pending" ? /* @__PURE__ */ jsx("span", {
                children: "Request Sent"
              }) : isMember ? user.id === group.creator_id ? /* @__PURE__ */ jsx("span", {
                children: "Owner"
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(UserMinus, {
                  size: 18
                }), " Leave"]
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(UserPlus, {
                  size: 18
                }), " ", group.is_public ? "Join" : "Request to Join"]
              })
            })]
          })]
        })
      }), isMember && /* @__PURE__ */ jsx("div", {
        style: {
          marginBottom: 24
        },
        children: /* @__PURE__ */ jsxs("button", {
          onClick: () => navigate("/new-post", {
            state: {
              groupId: group.id,
              groupName: group.name
            }
          }),
          style: {
            width: "100%",
            background: "rgba(74, 222, 128, 0.1)",
            border: "1px dashed #4ADE80",
            borderRadius: 12,
            padding: 20,
            color: "#4ADE80",
            fontSize: 16,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer"
          },
          children: [/* @__PURE__ */ jsx(PlusSquare, {}), " Propose a Plan or Post Update"]
        })
      }), /* @__PURE__ */ jsx("h2", {
        style: {
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 16
        },
        children: "Community Plans & Discussions"
      }), posts.length === 0 ? /* @__PURE__ */ jsx("p", {
        style: {
          color: "#A7C7BC",
          fontStyle: "italic"
        },
        children: "No posts yet. Be the first to start a discussion!"
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 16
        },
        children: posts.map((post) => /* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(13, 77, 58, 0.4)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid rgba(46, 125, 103, 0.4)"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12
            },
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10
              },
              children: [post.author?.avatar_url && /* @__PURE__ */ jsx("img", {
                src: post.author.avatar_url,
                style: {
                  width: 32,
                  height: 32,
                  borderRadius: "50%"
                },
                alt: ""
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  fontWeight: "bold"
                },
                children: post.author?.name
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 12,
                  color: "#A7C7BC"
                },
                children: new Date(post.created_at).toLocaleDateString()
              })]
            })
          }), /* @__PURE__ */ jsx("p", {
            style: {
              fontSize: 16,
              lineHeight: 1.5,
              marginBottom: 16
            },
            children: post.content
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              gap: 16,
              alignItems: "center"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                gap: 8
              },
              children: [/* @__PURE__ */ jsxs("button", {
                onClick: () => handleVote(post.id, 1),
                style: {
                  background: post.userVote === 1 ? "rgba(74, 222, 128, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: post.userVote === 1 ? "#4ADE80" : "#A7C7BC",
                  cursor: "pointer"
                },
                children: [/* @__PURE__ */ jsx(ThumbsUp, {
                  size: 16
                }), " ", post.upvotes]
              }), /* @__PURE__ */ jsxs("button", {
                onClick: () => handleVote(post.id, -1),
                style: {
                  background: post.userVote === -1 ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: post.userVote === -1 ? "#EF4444" : "#A7C7BC",
                  cursor: "pointer"
                },
                children: [/* @__PURE__ */ jsx(ThumbsDown, {
                  size: 16
                }), " ", post.downvotes]
              })]
            }), /* @__PURE__ */ jsxs("button", {
              onClick: () => navigate(`/group-post/${post.id}`),
              style: {
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#A7C7BC",
                cursor: "pointer",
                padding: "6px 12px"
              },
              children: [/* @__PURE__ */ jsx(MessageCircle, {
                size: 18
              }), /* @__PURE__ */ jsxs("span", {
                style: {
                  fontSize: 14
                },
                children: [post.group_comments?.[0]?.count || 0, " Comments"]
              })]
            })]
          })]
        }, post.id))
      })]
    })
  });
};
const GroupDetails$1 = UNSAFE_withComponentProps(GroupDetails);
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GroupDetails$1
}, Symbol.toStringTag, { value: "Module" }));
const Marketplace = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  useEffect(() => {
    fetchListings();
  }, [category]);
  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = supabase.from("marketplace_listings").select("*, seller:users!marketplace_listings_seller_id_fkey(name, avatar_url, location)").eq("status", "active").order("created_at", {
        ascending: false
      });
      if (category !== "all") {
        query = query.eq("category", category);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "12px 16px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0
        },
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/feed"),
          style: {
            background: "transparent",
            border: "none",
            color: "#A7C7BC",
            cursor: "pointer",
            padding: 4
          },
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 22
          })
        }), /* @__PURE__ */ jsx("h1", {
          style: {
            fontSize: 18,
            fontWeight: "bold",
            margin: 0,
            whiteSpace: "nowrap"
          },
          children: "Marketplace"
        })]
      }), user && /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 6,
          flexShrink: 0
        },
        children: [/* @__PURE__ */ jsxs("button", {
          onClick: () => navigate("/my-orders"),
          style: {
            background: "rgba(255,255,255,0.1)",
            color: "#A7C7BC",
            border: "none",
            borderRadius: 20,
            padding: "7px 10px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            fontSize: 12
          },
          children: [/* @__PURE__ */ jsx(Package, {
            size: 15
          }), " ", /* @__PURE__ */ jsx("span", {
            children: "Orders"
          })]
        }), /* @__PURE__ */ jsxs("button", {
          onClick: () => navigate("/create-listing"),
          style: {
            background: "#4ADE80",
            color: "#0B3D2E",
            border: "none",
            borderRadius: 20,
            padding: "7px 10px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            fontSize: 12
          },
          children: [/* @__PURE__ */ jsx(Plus, {
            size: 16
          }), " ", /* @__PURE__ */ jsx("span", {
            children: "Sell"
          })]
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20
      },
      children: [/* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 16,
          marginBottom: 16
        },
        children: ["all", "vanilla", "spices", "mining", "crafts", "services"].map((cat) => /* @__PURE__ */ jsx("button", {
          onClick: () => setCategory(cat),
          style: {
            background: category === cat ? "#4ADE80" : "rgba(255, 255, 255, 0.1)",
            color: category === cat ? "#0B3D2E" : "#A7C7BC",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            textTransform: "capitalize",
            fontWeight: "bold"
          },
          children: cat
        }, cat))
      }), loading ? /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          padding: 40
        },
        children: [/* @__PURE__ */ jsx(Loader2, {
          style: {
            color: "#4ADE80",
            animation: "spin 1s linear infinite"
          }
        }), /* @__PURE__ */ jsx("style", {
          children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
        })]
      }) : listings.length === 0 ? /* @__PURE__ */ jsxs("div", {
        style: {
          textAlign: "center",
          padding: 40,
          color: "#A7C7BC",
          background: "rgba(13, 77, 58, 0.4)",
          borderRadius: 16
        },
        children: [/* @__PURE__ */ jsx(ShoppingBag, {
          size: 48,
          style: {
            marginBottom: 16,
            opacity: 0.5
          }
        }), /* @__PURE__ */ jsx("p", {
          children: "No listings found in this category."
        }), user && /* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/create-listing"),
          style: {
            marginTop: 16,
            background: "transparent",
            border: "1px solid #4ADE80",
            color: "#4ADE80",
            padding: "8px 16px",
            borderRadius: 20,
            cursor: "pointer"
          },
          children: "List an item"
        })]
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20
        },
        children: listings.map((item) => {
          const isExpired = item.expires_at && new Date(item.expires_at) < /* @__PURE__ */ new Date();
          return /* @__PURE__ */ jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 10
            },
            animate: {
              opacity: 1,
              y: 0
            },
            onClick: () => navigate(`/listing/${item.id}`),
            style: {
              background: "rgba(13, 77, 58, 0.6)",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(46, 125, 103, 0.5)",
              cursor: "pointer",
              transition: "transform 0.2s",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              opacity: isExpired ? 0.6 : 1
            },
            whileHover: {
              scale: 1.02
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                height: 180,
                background: "#2E7D67",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative"
              },
              children: [item.image_urls && item.image_urls[0] ? /* @__PURE__ */ jsx("img", {
                src: item.image_urls[0],
                alt: item.title,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }
              }) : /* @__PURE__ */ jsx(ShoppingBag, {
                size: 48,
                color: "rgba(255,255,255,0.2)"
              }), isExpired && /* @__PURE__ */ jsx("div", {
                style: {
                  position: "absolute",
                  top: 8,
                  left: 8,
                  background: "#F59E0B",
                  color: "#0B3D2E",
                  fontSize: 10,
                  fontWeight: "bold",
                  padding: "2px 8px",
                  borderRadius: 8,
                  textTransform: "uppercase"
                },
                children: "Expired"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                padding: 16
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: 8
                },
                children: [/* @__PURE__ */ jsx("h3", {
                  style: {
                    fontSize: 18,
                    fontWeight: "bold",
                    margin: 0,
                    color: "#F2F1EE",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "70%"
                  },
                  children: item.title
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    background: isExpired ? "#F59E0B" : "#4ADE80",
                    color: "#0B3D2E",
                    fontSize: 12,
                    fontWeight: "bold",
                    padding: "2px 8px",
                    borderRadius: 12
                  },
                  children: isExpired ? "Expired" : item.listing_type === "auction" ? "Bid" : "Buy"
                })]
              }), /* @__PURE__ */ jsx("p", {
                style: {
                  color: "#A7C7BC",
                  fontSize: 14,
                  margin: "0 0 12px 0",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  height: 40
                },
                children: item.description
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "#4ADE80"
                  },
                  children: [item.price.toLocaleString(), " ", /* @__PURE__ */ jsx("span", {
                    style: {
                      fontSize: 12
                    },
                    children: item.currency
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  style: {
                    fontSize: 12,
                    color: "#A7C7BC",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  },
                  children: ["Listing by ", item.seller?.name?.split(" ")[0]]
                })]
              })]
            })]
          }, item.id);
        })
      })]
    })]
  });
};
const Marketplace$1 = UNSAFE_withComponentProps(Marketplace);
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Marketplace$1
}, Symbol.toStringTag, { value: "Module" }));
const CreateListing = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "MGA",
    category: "vanilla",
    listing_type: "fixed",
    quantity: "",
    min_order_quantity: "1",
    expires_at: "",
    image_urls: []
  });
  const categories2 = ["vanilla", "spices", "mining", "crafts", "services"];
  const currencies = ["MGA", "EUR", "USD"];
  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    setUploading(true);
    try {
      const {
        error: uploadError
      } = await supabase.storage.from("marketplace").upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data
      } = supabase.storage.from("marketplace").getPublicUrl(filePath);
      setFormData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, data.publicUrl]
      }));
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const updates = {
        seller_id: user.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        listing_type: formData.listing_type,
        min_order_quantity: parseFloat(formData.min_order_quantity) || 1,
        image_urls: formData.image_urls.length > 0 ? formData.image_urls : null,
        status: "active",
        quantity: formData.quantity ? parseFloat(formData.quantity) : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
      };
      const {
        error
      } = await supabase.from("marketplace_listings").insert(updates);
      if (error) throw error;
      toast.success("Listing created successfully!");
      navigate("/marketplace");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 16
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/marketplace"),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 24
        })
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 20,
          fontWeight: "bold",
          margin: 0
        },
        children: "Create Listing"
      })]
    }), /* @__PURE__ */ jsx("div", {
      style: {
        maxWidth: 600,
        margin: "0 auto",
        padding: 20
      },
      children: /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 24
        },
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("input", {
            type: "file",
            ref: fileInputRef,
            onChange: handleFileChange,
            style: {
              display: "none"
            },
            accept: "image/*"
          }), formData.image_urls.length > 0 && /* @__PURE__ */ jsx("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 10,
              marginBottom: 16
            },
            children: formData.image_urls.map((url, index) => /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative",
                height: 100,
                borderRadius: 12,
                overflow: "hidden"
              },
              children: [/* @__PURE__ */ jsx("img", {
                src: url,
                alt: `Preview ${index}`,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }
              }), /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => handleRemoveImage(index),
                style: {
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "transparent",
                  border: "none",
                  padding: 4,
                  cursor: "pointer",
                  zIndex: 10,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                },
                children: /* @__PURE__ */ jsx(X, {
                  size: 24,
                  color: "white",
                  strokeWidth: 2.5
                })
              })]
            }, index))
          }), /* @__PURE__ */ jsx("div", {
            onClick: handleImageUploadClick,
            style: {
              height: 120,
              background: "rgba(13, 77, 58, 0.4)",
              border: "2px dashed #2E7D67",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#A7C7BC",
              opacity: uploading ? 0.7 : 1
            },
            children: uploading ? /* @__PURE__ */ jsx(Loader2, {
              className: "animate-spin",
              size: 32
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Upload, {
                size: 32,
                style: {
                  marginBottom: 8
                }
              }), /* @__PURE__ */ jsx("span", {
                children: formData.image_urls.length > 0 ? "Add Another Image" : "Upload Product Image"
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Title *"
          }), /* @__PURE__ */ jsx("input", {
            name: "title",
            value: formData.title,
            onChange: handleInputChange,
            placeholder: "e.g., Premium Bourbon Vanilla",
            style: {
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 16,
              boxSizing: "border-box"
            },
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 16,
            flexWrap: "wrap"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              flex: "2 1 200px"
            },
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: ["Unit Price (per ", formData.category === "vanilla" || formData.category === "spices" ? "kg" : "item", ") *"]
            }), /* @__PURE__ */ jsx("input", {
              name: "price",
              type: "number",
              step: "0.01",
              value: formData.price,
              onChange: handleInputChange,
              placeholder: "e.g., 25000",
              style: {
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 16,
                boxSizing: "border-box"
              },
              required: true
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                fontSize: 12,
                color: "#A7C7BC",
                marginTop: 4
              },
              children: ["Price for one ", formData.category === "vanilla" || formData.category === "spices" ? "kilogram" : "item"]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 120px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Currency"
            }), /* @__PURE__ */ jsx("select", {
              name: "currency",
              value: formData.currency,
              onChange: handleInputChange,
              style: {
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 16,
                boxSizing: "border-box"
              },
              children: currencies.map((c) => /* @__PURE__ */ jsx("option", {
                value: c,
                children: c
              }, c))
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 16,
            flexWrap: "wrap"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: ["Total Quantity Available (", formData.category === "vanilla" || formData.category === "spices" ? "kg" : "items", ")"]
            }), /* @__PURE__ */ jsx("input", {
              name: "quantity",
              type: "number",
              step: "0.001",
              value: formData.quantity,
              onChange: handleInputChange,
              placeholder: "e.g., 5",
              style: {
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 16,
                boxSizing: "border-box"
              }
            }), /* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 12,
                color: "#A7C7BC",
                marginTop: 4
              },
              children: "Total stock you have"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: ["Minimum Order (", formData.category === "vanilla" || formData.category === "spices" ? "kg" : "items", ")"]
            }), /* @__PURE__ */ jsx("input", {
              name: "min_order_quantity",
              type: "number",
              step: "0.001",
              value: formData.min_order_quantity,
              onChange: handleInputChange,
              placeholder: "e.g., 1",
              style: {
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 16,
                boxSizing: "border-box"
              }
            }), /* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 12,
                color: "#A7C7BC",
                marginTop: 4
              },
              children: "Minimum amount a buyer can purchase"
            })]
          })]
        }), formData.price && formData.quantity && /* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(74, 222, 128, 0.1)",
            border: "1px solid #4ADE80",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 14,
                color: "#A7C7BC",
                marginBottom: 4
              },
              children: "Total Value"
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                fontSize: 12,
                color: "#A7C7BC"
              },
              children: [formData.quantity, " × ", parseFloat(formData.price).toLocaleString(), " ", formData.currency]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              fontSize: 24,
              fontWeight: "bold",
              color: "#4ADE80"
            },
            children: [(parseFloat(formData.price) * parseFloat(formData.quantity)).toLocaleString(), " ", formData.currency]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 16,
            flexWrap: "wrap"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Category"
            }), /* @__PURE__ */ jsx("select", {
              name: "category",
              value: formData.category,
              onChange: handleInputChange,
              style: {
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 16,
                boxSizing: "border-box"
              },
              children: categories2.map((c) => /* @__PURE__ */ jsx("option", {
                value: c,
                children: c
              }, c))
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Listing Type"
            }), /* @__PURE__ */ jsxs("select", {
              name: "listing_type",
              value: formData.listing_type,
              onChange: handleInputChange,
              style: {
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 16,
                boxSizing: "border-box"
              },
              children: [/* @__PURE__ */ jsx("option", {
                value: "fixed",
                children: "Fixed Price"
              }), /* @__PURE__ */ jsx("option", {
                value: "auction",
                children: "Auction (Bidding)"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: formData.listing_type === "auction" ? "Auction Ends At *" : "Listing Expiration Date (optional)"
          }), /* @__PURE__ */ jsx("input", {
            name: "expires_at",
            type: "datetime-local",
            value: formData.expires_at,
            onChange: handleInputChange,
            style: {
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 16,
              boxSizing: "border-box"
            },
            required: formData.listing_type === "auction"
          }), /* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 12,
              color: "#A7C7BC",
              marginTop: 4
            },
            children: formData.listing_type === "auction" ? "When the auction closes and bidding ends" : "After this date, the listing will be shown as expired and cannot be purchased"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Description"
          }), /* @__PURE__ */ jsx("textarea", {
            name: "description",
            value: formData.description,
            onChange: handleInputChange,
            placeholder: "Describe your item...",
            rows: 5,
            style: {
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 16,
              resize: "vertical",
              boxSizing: "border-box"
            }
          })]
        }), /* @__PURE__ */ jsxs("button", {
          type: "submit",
          disabled: loading || uploading,
          style: {
            background: "#4ADE80",
            color: "#0B3D2E",
            border: "none",
            borderRadius: 12,
            padding: 16,
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: loading || uploading ? 0.7 : 1
          },
          children: [loading ? /* @__PURE__ */ jsx(Loader2, {
            className: "animate-spin"
          }) : /* @__PURE__ */ jsx(ShoppingBag, {}), "List Item"]
        })]
      })
    }), /* @__PURE__ */ jsx("style", {
      children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
    })]
  });
};
const CreateListing$1 = UNSAFE_withComponentProps(CreateListing);
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CreateListing$1
}, Symbol.toStringTag, { value: "Module" }));
const STATUS_COLORS$1 = {
  pending: {
    bg: "rgba(251, 191, 36, 0.15)",
    color: "#FBBF24",
    label: "Pending"
  },
  accepted: {
    bg: "rgba(74, 222, 128, 0.15)",
    color: "#4ADE80",
    label: "Accepted"
  },
  denied: {
    bg: "rgba(239, 68, 68, 0.15)",
    color: "#EF4444",
    label: "Denied"
  },
  completed: {
    bg: "rgba(96, 165, 250, 0.15)",
    color: "#60A5FA",
    label: "Completed"
  },
  cancelled: {
    bg: "rgba(156, 163, 175, 0.15)",
    color: "#9CA3AF",
    label: "Cancelled"
  }
};
const UNIT_LABEL = (category) => category === "vanilla" || category === "spices" || category === "mining" ? "kg" : "items";
const ListingDetails = () => {
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [bids, setBids] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  useEffect(() => {
    fetchListingDetails();
    const channel = supabase.channel(`listing_${id}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "transactions",
      filter: `listing_id=eq.${id}`
    }, () => {
      fetchTransactions();
      fetchListingDetails();
    }).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "bids",
      filter: `listing_id=eq.${id}`
    }, () => {
      fetchBids();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);
  const fetchListingDetails = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("marketplace_listings").select("*, seller:users!marketplace_listings_seller_id_fkey(id, name, avatar_url, location)").eq("id", id).single();
      if (error) throw error;
      setListing(data);
      if (data.min_order_quantity) setPurchaseQuantity(data.min_order_quantity);
      if (data.listing_type === "auction") fetchBids();
      fetchTransactions();
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Could not load listing");
    } finally {
      setLoading(false);
    }
  };
  const fetchBids = async () => {
    const {
      data,
      error
    } = await supabase.from("bids").select("*, bidder:users!bids_bidder_id_fkey(name)").eq("listing_id", id).order("amount", {
      ascending: false
    });
    if (!error) setBids(data || []);
  };
  const fetchTransactions = async () => {
    const {
      data,
      error
    } = await supabase.from("transactions").select("*, buyer:users!transactions_buyer_id_fkey(id, name, avatar_url)").eq("listing_id", id).order("created_at", {
      ascending: false
    });
    if (!error) setTransactions(data || []);
  };
  const isExpired = listing?.expires_at && new Date(listing.expires_at) < /* @__PURE__ */ new Date();
  const isOwner = user && listing && user.id === listing.seller_id;
  const isSold = listing?.status === "sold";
  const isClosed = listing?.status === "closed";
  const isActive = listing?.status === "active" && !isExpired;
  const hasPendingTransactions = transactions.some((t) => t.status === "pending" || t.status === "accepted");
  const handleSendRequest = async () => {
    if (!user) {
      toast.error("Please login to purchase");
      return;
    }
    const qty = parseFloat(purchaseQuantity);
    const minQty = listing.min_order_quantity || 1;
    if (isNaN(qty) || qty < minQty) {
      toast.error(`Minimum order is ${minQty} ${UNIT_LABEL(listing.category)}`);
      return;
    }
    if (listing.quantity && qty > listing.quantity) {
      toast.error(`Only ${listing.quantity} ${UNIT_LABEL(listing.category)} available`);
      return;
    }
    setProcessing(true);
    try {
      const totalAmount = qty * listing.price;
      const {
        error
      } = await supabase.from("transactions").insert({
        listing_id: id,
        seller_id: listing.seller_id,
        buyer_id: user.id,
        amount: totalAmount,
        quantity: qty,
        currency: listing.currency,
        status: "pending"
      });
      if (error) throw error;
      toast.success("Purchase request sent! The seller will review it.");
      fetchTransactions();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send purchase request");
    } finally {
      setProcessing(false);
    }
  };
  const handleTransactionAction = async (txId, action) => {
    setProcessing(true);
    try {
      const tx = transactions.find((t) => t.id === txId);
      if (action === "accept") {
        if (listing.quantity && tx.quantity > listing.quantity) {
          toast.error("Insufficient stock for this order");
          setProcessing(false);
          return;
        }
        const {
          error: txError
        } = await supabase.from("transactions").update({
          status: "accepted",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", txId);
        if (txError) throw txError;
        if (listing.quantity) {
          const newQty = listing.quantity - tx.quantity;
          const updateData = {
            quantity: Math.max(0, newQty),
            ...newQty <= 0 ? {
              status: "sold",
              sold_at: (/* @__PURE__ */ new Date()).toISOString()
            } : {}
          };
          await supabase.from("marketplace_listings").update(updateData).eq("id", id);
        }
        toast.success("Order accepted! Stock updated.");
      } else if (action === "deny") {
        const {
          error
        } = await supabase.from("transactions").update({
          status: "denied",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", txId);
        if (error) throw error;
        toast.success("Order denied.");
      } else if (action === "cancel") {
        const {
          error
        } = await supabase.from("transactions").update({
          status: "cancelled",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", txId);
        if (error) throw error;
        toast.success("Request cancelled.");
      }
      fetchTransactions();
      fetchListingDetails();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Action failed");
    } finally {
      setProcessing(false);
    }
  };
  const handleCloseListing = async () => {
    if (hasPendingTransactions) {
      toast.error("Cannot close listing: there are pending or accepted transactions. Please resolve them first.");
      return;
    }
    setProcessing(true);
    try {
      const {
        error
      } = await supabase.from("marketplace_listings").update({
        status: "closed"
      }).eq("id", id);
      if (error) throw error;
      toast.success("Listing closed.");
      fetchListingDetails();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to close listing");
    } finally {
      setProcessing(false);
    }
  };
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    const currentHighest = bids.length > 0 ? bids[0].amount : listing.price;
    if (amount <= currentHighest) {
      toast.error(`Bid must be higher than ${currentHighest} ${listing.currency}`);
      return;
    }
    setProcessing(true);
    try {
      const {
        error
      } = await supabase.from("bids").insert({
        listing_id: id,
        bidder_id: user.id,
        amount
      });
      if (error) throw error;
      toast.success("Bid placed!");
      setBidAmount("");
      fetchBids();
    } catch (error) {
      console.error("Error bidding:", error);
      toast.error("Failed to place bid");
    } finally {
      setProcessing(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },
      children: /* @__PURE__ */ jsx(Loader2, {
        style: {
          color: "#4ADE80",
          animation: "spin 1s linear infinite"
        }
      })
    });
  }
  if (!listing) return /* @__PURE__ */ jsx("div", {
    style: {
      background: "#0B3D2E",
      minHeight: "100vh",
      color: "white",
      padding: 20
    },
    children: "Listing not found"
  });
  const unit = UNIT_LABEL(listing.category);
  const statusLabel = isSold ? "Sold Out" : isClosed ? "Closed" : isExpired ? "Expired" : listing.listing_type;
  const statusColor = isSold || isClosed ? "#EF4444" : isExpired ? "#F59E0B" : "#4ADE80";
  const canPurchase = !isOwner && isActive && !isSold && !isClosed;
  const myPendingRequest = transactions.find((t) => t.buyer?.id === user?.id && t.status === "pending");
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "12px 16px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 10
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/marketplace"),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer",
          padding: 4
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 22
        })
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 18,
          fontWeight: "bold",
          margin: 0,
          flex: 1,
          whiteSpace: "nowrap"
        },
        children: "Item Details"
      }), isOwner && /* @__PURE__ */ jsxs("button", {
        onClick: () => setShowOrders(!showOrders),
        style: {
          background: showOrders ? "#4ADE80" : "rgba(255,255,255,0.1)",
          color: showOrders ? "#0B3D2E" : "#A7C7BC",
          border: "none",
          borderRadius: 20,
          padding: "7px 10px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 4,
          cursor: "pointer",
          fontSize: 12,
          flexShrink: 0
        },
        children: [/* @__PURE__ */ jsx(Package, {
          size: 15
        }), " Orders ", transactions.filter((t) => t.status === "pending").length > 0 && `(${transactions.filter((t) => t.status === "pending").length})`]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: "16px"
      },
      children: [isOwner && showOrders && /* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 24,
          background: "rgba(0,0,0,0.2)",
          borderRadius: 16,
          border: "1px solid #2E7D67",
          overflow: "hidden"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            padding: "16px 20px",
            borderBottom: "1px solid rgba(46,125,103,0.5)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          children: [/* @__PURE__ */ jsx("h3", {
            style: {
              margin: 0,
              fontSize: 16
            },
            children: "Purchase Requests & Orders"
          }), /* @__PURE__ */ jsxs("span", {
            style: {
              fontSize: 12,
              color: "#A7C7BC"
            },
            children: [transactions.length, " total"]
          })]
        }), transactions.length === 0 ? /* @__PURE__ */ jsx("div", {
          style: {
            padding: 24,
            textAlign: "center",
            color: "#A7C7BC"
          },
          children: "No orders yet."
        }) : /* @__PURE__ */ jsx("div", {
          style: {
            maxHeight: 400,
            overflowY: "auto"
          },
          children: transactions.map((tx) => {
            const st = STATUS_COLORS$1[tx.status] || STATUS_COLORS$1.pending;
            return /* @__PURE__ */ jsxs("div", {
              style: {
                padding: "14px 20px",
                borderBottom: "1px solid rgba(46,125,103,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap"
              },
              children: [tx.buyer?.avatar_url ? /* @__PURE__ */ jsx("img", {
                src: tx.buyer.avatar_url,
                style: {
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover"
                },
                alt: ""
              }) : /* @__PURE__ */ jsx("div", {
                style: {
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#2E7D67",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                },
                children: /* @__PURE__ */ jsx(User, {
                  size: 14,
                  color: "#A7C7BC"
                })
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  flex: "1 1 150px",
                  minWidth: 0
                },
                children: [/* @__PURE__ */ jsx("div", {
                  style: {
                    fontWeight: "bold",
                    fontSize: 14
                  },
                  children: tx.buyer?.name || "Unknown"
                }), /* @__PURE__ */ jsxs("div", {
                  style: {
                    fontSize: 12,
                    color: "#A7C7BC"
                  },
                  children: [tx.quantity, " ", unit, " • ", tx.amount?.toLocaleString(), " ", tx.currency]
                }), /* @__PURE__ */ jsx("div", {
                  style: {
                    fontSize: 11,
                    color: "#A7C7BC"
                  },
                  children: new Date(tx.created_at).toLocaleString()
                })]
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  background: st.bg,
                  color: st.color,
                  fontSize: 11,
                  fontWeight: "bold",
                  padding: "3px 10px",
                  borderRadius: 12,
                  textTransform: "uppercase"
                },
                children: st.label
              }), tx.status === "pending" && /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  gap: 6
                },
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: () => handleTransactionAction(tx.id, "accept"),
                  disabled: processing,
                  style: {
                    background: "rgba(74,222,128,0.2)",
                    border: "1px solid #4ADE80",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#4ADE80",
                    fontSize: 12,
                    fontWeight: "bold"
                  },
                  children: [/* @__PURE__ */ jsx(Check, {
                    size: 14
                  }), " Accept"]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: () => handleTransactionAction(tx.id, "deny"),
                  disabled: processing,
                  style: {
                    background: "rgba(239,68,68,0.2)",
                    border: "1px solid #EF4444",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#EF4444",
                    fontSize: 12,
                    fontWeight: "bold"
                  },
                  children: [/* @__PURE__ */ jsx(X, {
                    size: 14
                  }), " Deny"]
                })]
              })]
            }, tx.id);
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "listing-grid",
        style: {
          display: "grid",
          gap: 20,
          alignItems: "start"
        },
        children: [/* @__PURE__ */ jsx("div", {
          style: {
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #2E7D67"
          },
          children: listing.image_urls && listing.image_urls[0] ? /* @__PURE__ */ jsx("img", {
            src: listing.image_urls[0],
            alt: listing.title,
            style: {
              width: "100%",
              height: "auto",
              display: "block"
            }
          }) : /* @__PURE__ */ jsx("div", {
            style: {
              height: 300,
              background: "rgba(13, 77, 58, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsx(ShoppingBag, {
              size: 64,
              color: "rgba(255,255,255,0.2)"
            })
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("span", {
            style: {
              background: statusColor,
              color: statusColor === "#4ADE80" ? "#0B3D2E" : "white",
              fontSize: 12,
              fontWeight: "bold",
              padding: "4px 10px",
              borderRadius: 12,
              textTransform: "uppercase",
              marginBottom: 12,
              display: "inline-block"
            },
            children: statusLabel
          }), isExpired && listing.status === "active" && /* @__PURE__ */ jsx("span", {
            style: {
              background: "#F59E0B",
              color: "#0B3D2E",
              fontSize: 12,
              fontWeight: "bold",
              padding: "4px 10px",
              borderRadius: 12,
              textTransform: "uppercase",
              marginLeft: 8,
              display: "inline-block"
            },
            children: "Expired"
          }), /* @__PURE__ */ jsx("h2", {
            style: {
              fontSize: 28,
              fontWeight: "bold",
              margin: "0 0 12px 0"
            },
            children: listing.title
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24
            },
            children: [listing.seller?.avatar_url ? /* @__PURE__ */ jsx("img", {
              src: listing.seller.avatar_url,
              style: {
                width: 40,
                height: 40,
                borderRadius: "50%"
              },
              alt: ""
            }) : /* @__PURE__ */ jsx("div", {
              style: {
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#2E7D67",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              },
              children: /* @__PURE__ */ jsx(User, {
                size: 20,
                color: "#A7C7BC"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  fontWeight: "bold"
                },
                children: listing.seller?.name || "Unknown Seller"
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  fontSize: 12,
                  color: "#A7C7BC"
                },
                children: listing.seller?.location || "Unknown Location"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              background: "rgba(13, 77, 58, 0.4)",
              padding: 20,
              borderRadius: 16,
              border: "1px solid rgba(46, 125, 103, 0.5)",
              marginBottom: 24
            },
            children: [/* @__PURE__ */ jsx("p", {
              style: {
                color: "#A7C7BC",
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: "pre-wrap"
              },
              children: listing.description
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                gap: 24,
                fontSize: 14,
                flexWrap: "wrap"
              },
              children: [listing.quantity != null && /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column"
                },
                children: [/* @__PURE__ */ jsx("span", {
                  style: {
                    color: "#A7C7BC",
                    fontWeight: "bold"
                  },
                  children: "Available"
                }), /* @__PURE__ */ jsxs("span", {
                  style: {
                    color: "#F2F1EE"
                  },
                  children: [listing.quantity, " ", unit]
                })]
              }), listing.min_order_quantity > 1 && /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column"
                },
                children: [/* @__PURE__ */ jsx("span", {
                  style: {
                    color: "#A7C7BC",
                    fontWeight: "bold"
                  },
                  children: "Min Order"
                }), /* @__PURE__ */ jsxs("span", {
                  style: {
                    color: "#F2F1EE"
                  },
                  children: [listing.min_order_quantity, " ", unit]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column"
                },
                children: [/* @__PURE__ */ jsx("span", {
                  style: {
                    color: "#A7C7BC",
                    fontWeight: "bold"
                  },
                  children: "Category"
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    color: "#F2F1EE",
                    textTransform: "capitalize"
                  },
                  children: listing.category
                })]
              }), listing.expires_at && /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column"
                },
                children: [/* @__PURE__ */ jsx("span", {
                  style: {
                    color: "#A7C7BC",
                    fontWeight: "bold"
                  },
                  children: isExpired ? "Expired On" : "Expires"
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    color: isExpired ? "#F59E0B" : "#F2F1EE"
                  },
                  children: new Date(listing.expires_at).toLocaleString()
                })]
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              background: "rgba(0,0,0,0.2)",
              padding: 24,
              borderRadius: 16,
              border: "1px solid #2E7D67"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 8
              },
              children: [/* @__PURE__ */ jsxs("span", {
                style: {
                  color: "#A7C7BC"
                },
                children: [listing.listing_type === "auction" ? "Current Bid" : "Unit Price", listing.listing_type !== "auction" && ` (per ${unit})`]
              }), /* @__PURE__ */ jsxs("span", {
                style: {
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#4ADE80"
                },
                children: [listing.listing_type === "auction" && bids.length > 0 ? bids[0].amount.toLocaleString() : listing.price?.toLocaleString(), " ", listing.currency]
              })]
            }), listing.quantity && listing.listing_type === "fixed" && /* @__PURE__ */ jsx("div", {
              style: {
                background: "rgba(74, 222, 128, 0.05)",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
                border: "1px solid rgba(74, 222, 128, 0.2)"
              },
              children: /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("div", {
                    style: {
                      fontSize: 12,
                      color: "#A7C7BC",
                      marginBottom: 2
                    },
                    children: "Total Stock Value"
                  }), /* @__PURE__ */ jsxs("div", {
                    style: {
                      fontSize: 11,
                      color: "#A7C7BC"
                    },
                    children: [listing.quantity, " ", unit, " × ", listing.price?.toLocaleString(), " ", listing.currency]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  style: {
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#4ADE80"
                  },
                  children: [(listing.price * listing.quantity).toLocaleString(), " ", listing.currency]
                })]
              })
            }), canPurchase && !myPendingRequest && user && /* @__PURE__ */ jsx(Fragment, {
              children: listing.listing_type === "fixed" ? /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 12
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-end",
                    flexWrap: "wrap"
                  },
                  children: [/* @__PURE__ */ jsxs("div", {
                    style: {
                      flex: "1 1 120px"
                    },
                    children: [/* @__PURE__ */ jsxs("label", {
                      style: {
                        display: "block",
                        marginBottom: 6,
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#A7C7BC"
                      },
                      children: ["Quantity (", unit, ")"]
                    }), /* @__PURE__ */ jsx("input", {
                      type: "number",
                      step: "0.001",
                      value: purchaseQuantity,
                      onChange: (e) => setPurchaseQuantity(e.target.value),
                      min: listing.min_order_quantity || 1,
                      max: listing.quantity,
                      style: {
                        width: "100%",
                        padding: "12px",
                        borderRadius: 12,
                        border: "1px solid #2E7D67",
                        background: "rgba(0,0,0,0.2)",
                        color: "white",
                        boxSizing: "border-box"
                      }
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    style: {
                      paddingBottom: 12,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#4ADE80"
                    },
                    children: ["= ", (purchaseQuantity * listing.price).toLocaleString(), " ", listing.currency]
                  })]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: handleSendRequest,
                  disabled: processing,
                  style: {
                    width: "100%",
                    background: "#4ADE80",
                    color: "#0B3D2E",
                    border: "none",
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    opacity: processing ? 0.7 : 1
                  },
                  children: [/* @__PURE__ */ jsx(SendHorizontal, {
                    size: 20
                  }), " Send Purchase Request"]
                }), /* @__PURE__ */ jsx("div", {
                  style: {
                    fontSize: 12,
                    color: "#A7C7BC",
                    textAlign: "center"
                  },
                  children: "The seller will review your request before confirming the sale."
                })]
              }) : /* @__PURE__ */ jsxs("form", {
                onSubmit: handlePlaceBid,
                style: {
                  display: "flex",
                  gap: 10
                },
                children: [/* @__PURE__ */ jsx("input", {
                  type: "number",
                  value: bidAmount,
                  onChange: (e) => setBidAmount(e.target.value),
                  placeholder: `Min ${bids.length > 0 ? bids[0].amount + 1 : listing.price}`,
                  style: {
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "1px solid #2E7D67",
                    background: "rgba(0,0,0,0.2)",
                    color: "white",
                    boxSizing: "border-box"
                  },
                  required: true
                }), /* @__PURE__ */ jsx("button", {
                  type: "submit",
                  disabled: processing,
                  style: {
                    background: "#4ADE80",
                    color: "#0B3D2E",
                    border: "none",
                    borderRadius: 12,
                    padding: "0 24px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  },
                  children: "Bid"
                })]
              })
            }), myPendingRequest && /* @__PURE__ */ jsxs("div", {
              style: {
                background: "rgba(251, 191, 36, 0.1)",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                borderRadius: 12,
                padding: 16,
                textAlign: "center"
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  color: "#FBBF24",
                  fontWeight: "bold",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                },
                children: [/* @__PURE__ */ jsx(Clock, {
                  size: 16
                }), " Purchase Request Pending"]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  fontSize: 13,
                  color: "#A7C7BC",
                  marginBottom: 12
                },
                children: ["You requested ", myPendingRequest.quantity, " ", unit, " for ", myPendingRequest.amount?.toLocaleString(), " ", myPendingRequest.currency, ". Waiting for seller approval."]
              }), /* @__PURE__ */ jsx("button", {
                onClick: () => handleTransactionAction(myPendingRequest.id, "cancel"),
                disabled: processing,
                style: {
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid #EF4444",
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  color: "#EF4444",
                  fontSize: 12,
                  fontWeight: "bold"
                },
                children: "Cancel Request"
              })]
            }), isOwner && !isSold && !isClosed && /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 10
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  textAlign: "center",
                  color: "#A7C7BC",
                  fontStyle: "italic"
                },
                children: ["You are the seller of this item.", transactions.filter((t) => t.status === "pending").length > 0 && ` You have ${transactions.filter((t) => t.status === "pending").length} pending request(s).`]
              }), /* @__PURE__ */ jsxs("button", {
                onClick: handleCloseListing,
                disabled: processing || hasPendingTransactions,
                title: hasPendingTransactions ? "Resolve all pending/accepted transactions before closing" : "Close this listing",
                style: {
                  width: "100%",
                  background: hasPendingTransactions ? "rgba(156,163,175,0.2)" : "rgba(239,68,68,0.15)",
                  color: hasPendingTransactions ? "#9CA3AF" : "#EF4444",
                  border: `1px solid ${hasPendingTransactions ? "#9CA3AF" : "#EF4444"}`,
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 14,
                  fontWeight: "bold",
                  cursor: hasPendingTransactions ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                },
                children: [/* @__PURE__ */ jsx(Ban, {
                  size: 16
                }), " Close Listing"]
              }), hasPendingTransactions && /* @__PURE__ */ jsxs("div", {
                style: {
                  fontSize: 11,
                  color: "#F59E0B",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4
                },
                children: [/* @__PURE__ */ jsx(AlertTriangle, {
                  size: 12
                }), " Resolve pending or accepted orders first"]
              })]
            }), isSold && /* @__PURE__ */ jsx("div", {
              style: {
                textAlign: "center",
                color: "#EF4444",
                fontWeight: "bold",
                fontSize: 18,
                marginTop: 10
              },
              children: "This item has been sold out."
            }), isClosed && /* @__PURE__ */ jsx("div", {
              style: {
                textAlign: "center",
                color: "#EF4444",
                fontWeight: "bold",
                fontSize: 18,
                marginTop: 10
              },
              children: "This listing has been closed by the seller."
            }), isExpired && !isSold && !isClosed && /* @__PURE__ */ jsx("div", {
              style: {
                textAlign: "center",
                color: "#F59E0B",
                fontWeight: "bold",
                fontSize: 16,
                marginTop: 10
              },
              children: "This listing has expired and is no longer available for purchase."
            })]
          }), user && !isOwner && transactions.filter((t) => t.buyer?.id === user.id).length > 0 && /* @__PURE__ */ jsxs("div", {
            style: {
              marginTop: 24
            },
            children: [/* @__PURE__ */ jsxs("h3", {
              style: {
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8
              },
              children: [/* @__PURE__ */ jsx(Package, {
                size: 16
              }), " Your Orders"]
            }), /* @__PURE__ */ jsx("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 8
              },
              children: transactions.filter((t) => t.buyer?.id === user.id).map((tx) => {
                const st = STATUS_COLORS$1[tx.status] || STATUS_COLORS$1.pending;
                return /* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 12,
                    background: "rgba(13, 77, 58, 0.4)",
                    borderRadius: 8,
                    flexWrap: "wrap",
                    gap: 8
                  },
                  children: [/* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsxs("div", {
                      style: {
                        fontSize: 14,
                        fontWeight: "bold"
                      },
                      children: [tx.quantity, " ", unit, " • ", tx.amount?.toLocaleString(), " ", tx.currency]
                    }), /* @__PURE__ */ jsx("div", {
                      style: {
                        fontSize: 11,
                        color: "#A7C7BC"
                      },
                      children: new Date(tx.created_at).toLocaleString()
                    })]
                  }), /* @__PURE__ */ jsx("span", {
                    style: {
                      background: st.bg,
                      color: st.color,
                      fontSize: 11,
                      fontWeight: "bold",
                      padding: "3px 10px",
                      borderRadius: 12,
                      textTransform: "uppercase"
                    },
                    children: st.label
                  })]
                }, tx.id);
              })
            })]
          }), listing.listing_type === "auction" && /* @__PURE__ */ jsxs("div", {
            style: {
              marginTop: 24
            },
            children: [/* @__PURE__ */ jsxs("h3", {
              style: {
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8
              },
              children: [/* @__PURE__ */ jsx(Clock, {
                size: 18
              }), " Bid History"]
            }), bids.length === 0 ? /* @__PURE__ */ jsx("p", {
              style: {
                color: "#A7C7BC",
                fontStyle: "italic"
              },
              children: "No bids yet. Be the first!"
            }) : /* @__PURE__ */ jsx("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 10
              },
              children: bids.map((bid) => /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 12,
                  background: "rgba(13, 77, 58, 0.4)",
                  borderRadius: 8
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  },
                  children: [/* @__PURE__ */ jsx("span", {
                    style: {
                      fontWeight: "bold"
                    },
                    children: bid.bidder.name
                  }), /* @__PURE__ */ jsx("span", {
                    style: {
                      fontSize: 12,
                      color: "#A7C7BC"
                    },
                    children: new Date(bid.created_at).toLocaleTimeString()
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  style: {
                    color: "#4ADE80",
                    fontWeight: "bold"
                  },
                  children: [bid.amount.toLocaleString(), " ", listing.currency]
                })]
              }, bid.id))
            })]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .listing-grid { grid-template-columns: 1fr; }
                @media (min-width: 600px) {
                    .listing-grid { grid-template-columns: 1fr 1fr; }
                }
            `
    })]
  });
};
const ListingDetails$1 = UNSAFE_withComponentProps(ListingDetails);
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ListingDetails$1
}, Symbol.toStringTag, { value: "Module" }));
const STATUS_COLORS = {
  pending: {
    bg: "rgba(251, 191, 36, 0.15)",
    color: "#FBBF24",
    label: "Pending"
  },
  accepted: {
    bg: "rgba(74, 222, 128, 0.15)",
    color: "#4ADE80",
    label: "Accepted"
  },
  denied: {
    bg: "rgba(239, 68, 68, 0.15)",
    color: "#EF4444",
    label: "Denied"
  },
  completed: {
    bg: "rgba(96, 165, 250, 0.15)",
    color: "#60A5FA",
    label: "Completed"
  },
  cancelled: {
    bg: "rgba(156, 163, 175, 0.15)",
    color: "#9CA3AF",
    label: "Cancelled"
  }
};
const MyOrders = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("purchases");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) fetchOrders();
  }, [user, tab]);
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase.from("transactions").select(`
                    *,
                    listing:marketplace_listings!transactions_listing_id_fkey(id, title, image_urls, category, price, currency),
                    buyer:users!transactions_buyer_id_fkey(id, name, avatar_url),
                    seller:users!transactions_seller_id_fkey(id, name, avatar_url)
                `).order("created_at", {
        ascending: false
      });
      if (tab === "purchases") {
        query = query.eq("buyer_id", user.id);
      } else {
        query = query.eq("seller_id", user.id);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const handleAction = async (txId, action) => {
    try {
      const tx = transactions.find((t) => t.id === txId);
      if (action === "accept") {
        const {
          error: txError
        } = await supabase.from("transactions").update({
          status: "accepted",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", txId);
        if (txError) throw txError;
        if (tx.listing) {
          const {
            data: currentListing
          } = await supabase.from("marketplace_listings").select("quantity").eq("id", tx.listing.id).single();
          if (currentListing?.quantity != null) {
            const newQty = Math.max(0, currentListing.quantity - tx.quantity);
            await supabase.from("marketplace_listings").update({
              quantity: newQty,
              ...newQty <= 0 ? {
                status: "sold",
                sold_at: (/* @__PURE__ */ new Date()).toISOString()
              } : {}
            }).eq("id", tx.listing.id);
          }
        }
        toast.success("Order accepted! Stock updated.");
      } else if (action === "deny") {
        const {
          error
        } = await supabase.from("transactions").update({
          status: "denied",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", txId);
        if (error) throw error;
        toast.success("Order denied.");
      } else if (action === "cancel") {
        const {
          error
        } = await supabase.from("transactions").update({
          status: "cancelled",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", txId);
        if (error) throw error;
        toast.success("Request cancelled.");
      }
      fetchOrders();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Action failed");
    }
  };
  const unit = (category) => category === "vanilla" || category === "spices" || category === "mining" ? "kg" : "items";
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 16
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/marketplace"),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 24
        })
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 20,
          fontWeight: "bold",
          margin: 0
        },
        children: "My Orders"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 700,
        margin: "0 auto",
        padding: 20
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 8,
          marginBottom: 24,
          background: "rgba(0,0,0,0.2)",
          borderRadius: 12,
          padding: 4
        },
        children: [/* @__PURE__ */ jsxs("button", {
          onClick: () => setTab("purchases"),
          style: {
            flex: 1,
            padding: "12px 16px",
            borderRadius: 10,
            border: "none",
            background: tab === "purchases" ? "#4ADE80" : "transparent",
            color: tab === "purchases" ? "#0B3D2E" : "#A7C7BC",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(ShoppingBag, {
            size: 16
          }), " My Purchases"]
        }), /* @__PURE__ */ jsxs("button", {
          onClick: () => setTab("sales"),
          style: {
            flex: 1,
            padding: "12px 16px",
            borderRadius: 10,
            border: "none",
            background: tab === "sales" ? "#4ADE80" : "transparent",
            color: tab === "sales" ? "#0B3D2E" : "#A7C7BC",
            fontWeight: "bold",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(Store, {
            size: 16
          }), " My Sales"]
        })]
      }), loading ? /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          padding: 40
        },
        children: /* @__PURE__ */ jsx(Loader2, {
          style: {
            color: "#4ADE80",
            animation: "spin 1s linear infinite"
          }
        })
      }) : transactions.length === 0 ? /* @__PURE__ */ jsxs("div", {
        style: {
          textAlign: "center",
          padding: 40,
          color: "#A7C7BC",
          background: "rgba(13, 77, 58, 0.4)",
          borderRadius: 16
        },
        children: [/* @__PURE__ */ jsx(Package, {
          size: 48,
          style: {
            marginBottom: 16,
            opacity: 0.5
          }
        }), /* @__PURE__ */ jsx("p", {
          children: tab === "purchases" ? "No purchases yet." : "No incoming orders yet."
        }), tab === "purchases" && /* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/marketplace"),
          style: {
            marginTop: 16,
            background: "transparent",
            border: "1px solid #4ADE80",
            color: "#4ADE80",
            padding: "8px 16px",
            borderRadius: 20,
            cursor: "pointer"
          },
          children: "Browse Marketplace"
        })]
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 12
        },
        children: transactions.map((tx) => {
          const st = STATUS_COLORS[tx.status] || STATUS_COLORS.pending;
          const counterparty = tab === "purchases" ? tx.seller : tx.buyer;
          const listingUnit = unit(tx.listing?.category);
          return /* @__PURE__ */ jsxs("div", {
            style: {
              background: "rgba(13, 77, 58, 0.5)",
              borderRadius: 16,
              border: "1px solid rgba(46, 125, 103, 0.4)",
              overflow: "hidden"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              onClick: () => tx.listing && navigate(`/listing/${tx.listing.id}`),
              style: {
                display: "flex",
                gap: 14,
                padding: 16,
                cursor: tx.listing ? "pointer" : "default",
                alignItems: "center"
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#2E7D67",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: tx.listing?.image_urls?.[0] ? /* @__PURE__ */ jsx("img", {
                  src: tx.listing.image_urls[0],
                  alt: "",
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }
                }) : /* @__PURE__ */ jsx(ShoppingBag, {
                  size: 24,
                  color: "rgba(255,255,255,0.3)"
                })
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  flex: 1,
                  minWidth: 0
                },
                children: [/* @__PURE__ */ jsx("div", {
                  style: {
                    fontWeight: "bold",
                    fontSize: 15,
                    marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  },
                  children: tx.listing?.title || "Deleted Listing"
                }), /* @__PURE__ */ jsxs("div", {
                  style: {
                    fontSize: 13,
                    color: "#A7C7BC",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap"
                  },
                  children: [/* @__PURE__ */ jsxs("span", {
                    children: [tx.quantity, " ", listingUnit]
                  }), /* @__PURE__ */ jsx("span", {
                    children: "•"
                  }), /* @__PURE__ */ jsxs("span", {
                    style: {
                      fontWeight: "bold",
                      color: "#4ADE80"
                    },
                    children: [tx.amount?.toLocaleString(), " ", tx.currency]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  style: {
                    fontSize: 11,
                    color: "#A7C7BC",
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  },
                  children: [counterparty?.avatar_url ? /* @__PURE__ */ jsx("img", {
                    src: counterparty.avatar_url,
                    style: {
                      width: 14,
                      height: 14,
                      borderRadius: "50%"
                    },
                    alt: ""
                  }) : /* @__PURE__ */ jsx(User, {
                    size: 10
                  }), tab === "purchases" ? "Seller" : "Buyer", ": ", counterparty?.name || "Unknown", /* @__PURE__ */ jsx("span", {
                    style: {
                      marginLeft: 8
                    },
                    children: new Date(tx.created_at).toLocaleDateString()
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                  flexShrink: 0
                },
                children: [/* @__PURE__ */ jsx("span", {
                  style: {
                    background: st.bg,
                    color: st.color,
                    fontSize: 11,
                    fontWeight: "bold",
                    padding: "3px 10px",
                    borderRadius: 12,
                    textTransform: "uppercase"
                  },
                  children: st.label
                }), /* @__PURE__ */ jsx(ChevronRight, {
                  size: 16,
                  color: "#A7C7BC"
                })]
              })]
            }), tx.status === "pending" && /* @__PURE__ */ jsxs("div", {
              style: {
                padding: "0 16px 12px",
                display: "flex",
                gap: 8,
                justifyContent: "flex-end"
              },
              children: [tab === "sales" && /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsxs("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleAction(tx.id, "accept");
                  },
                  style: {
                    background: "rgba(74,222,128,0.2)",
                    border: "1px solid #4ADE80",
                    borderRadius: 8,
                    padding: "6px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#4ADE80",
                    fontSize: 12,
                    fontWeight: "bold"
                  },
                  children: [/* @__PURE__ */ jsx(Check, {
                    size: 14
                  }), " Accept"]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    handleAction(tx.id, "deny");
                  },
                  style: {
                    background: "rgba(239,68,68,0.2)",
                    border: "1px solid #EF4444",
                    borderRadius: 8,
                    padding: "6px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#EF4444",
                    fontSize: 12,
                    fontWeight: "bold"
                  },
                  children: [/* @__PURE__ */ jsx(X, {
                    size: 14
                  }), " Deny"]
                })]
              }), tab === "purchases" && /* @__PURE__ */ jsxs("button", {
                onClick: (e) => {
                  e.stopPropagation();
                  handleAction(tx.id, "cancel");
                },
                style: {
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid #EF4444",
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "#EF4444",
                  fontSize: 12,
                  fontWeight: "bold"
                },
                children: [/* @__PURE__ */ jsx(X, {
                  size: 14
                }), " Cancel"]
              })]
            })]
          }, tx.id);
        })
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
    })]
  });
};
const MyOrders$1 = UNSAFE_withComponentProps(MyOrders);
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MyOrders$1
}, Symbol.toStringTag, { value: "Module" }));
const typeIcons$1 = {
  article: /* @__PURE__ */ jsx(FileText, {
    size: 18
  }),
  video: /* @__PURE__ */ jsx(Video, {
    size: 18
  }),
  guide: /* @__PURE__ */ jsx(BookOpen, {
    size: 18
  }),
  quiz: /* @__PURE__ */ jsx(HelpCircle, {
    size: 18
  })
};
const typeColors$1 = {
  article: "#60A5FA",
  video: "#F472B6",
  guide: "#4ADE80",
  quiz: "#FBBF24"
};
const categories$2 = [{
  value: "all",
  label: "All"
}, {
  value: "regenerative",
  label: "Regenerative Practices"
}, {
  value: "vanilla",
  label: "Vanilla Cultivation"
}, {
  value: "agroforestry",
  label: "Agroforestry"
}, {
  value: "soil",
  label: "Soil Health"
}, {
  value: "water",
  label: "Water Management"
}, {
  value: "business",
  label: "Business & Trade"
}, {
  value: "guide",
  label: "General Guides"
}];
const languages$1 = [{
  value: "all",
  label: "All Languages"
}, {
  value: "en",
  label: "🇬🇧 English"
}, {
  value: "fr",
  label: "🇫🇷 Français"
}, {
  value: "mg",
  label: "🇲🇬 Malagasy"
}];
const Resources = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [resources2, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    fetchResources();
  }, []);
  const fetchResources = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("resources").select("*, author:users!resources_user_id_fkey(name, avatar_url)").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredResources = useMemo(() => {
    return resources2.filter((r) => {
      const matchesSearch = searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()) || r.tags && r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || r.category === selectedCategory;
      const matchesType = selectedType === "all" || r.type === selectedType;
      const matchesLanguage = selectedLanguage === "all" || r.language === selectedLanguage;
      return matchesSearch && matchesCategory && matchesType && matchesLanguage;
    });
  }, [resources2, searchQuery, selectedCategory, selectedType, selectedLanguage]);
  const activeFilterCount = [selectedCategory, selectedType, selectedLanguage].filter((v) => v !== "all").length;
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12
          },
          children: [/* @__PURE__ */ jsx("button", {
            onClick: () => navigate("/feed"),
            style: {
              background: "transparent",
              border: "none",
              color: "#A7C7BC",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              size: 24
            })
          }), /* @__PURE__ */ jsxs("h1", {
            style: {
              fontSize: 20,
              fontWeight: "bold",
              margin: 0
            },
            children: [/* @__PURE__ */ jsx(BookOpen, {
              size: 20,
              style: {
                verticalAlign: "middle",
                marginRight: 8
              }
            }), "Resources"]
          })]
        }), user && /* @__PURE__ */ jsxs("button", {
          onClick: () => navigate("/upload-resource"),
          style: {
            background: "#4ADE80",
            color: "#0B3D2E",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer"
          },
          children: [/* @__PURE__ */ jsx(Plus, {
            size: 18
          }), " Upload"]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 8
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            flex: 1,
            position: "relative"
          },
          children: [/* @__PURE__ */ jsx(Search, {
            size: 18,
            style: {
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#A7C7BC"
            }
          }), /* @__PURE__ */ jsx("input", {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: "Search tutorials, guides, videos...",
            style: {
              width: "100%",
              padding: "10px 12px 10px 40px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 14
            }
          }), searchQuery && /* @__PURE__ */ jsx("button", {
            onClick: () => setSearchQuery(""),
            style: {
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#A7C7BC",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ jsx(X, {
              size: 16
            })
          })]
        }), /* @__PURE__ */ jsxs("button", {
          onClick: () => setShowFilters(!showFilters),
          style: {
            background: activeFilterCount > 0 ? "#4ADE80" : "rgba(255,255,255,0.1)",
            color: activeFilterCount > 0 ? "#0B3D2E" : "#A7C7BC",
            border: "none",
            borderRadius: 12,
            padding: "10px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: "bold"
          },
          children: [/* @__PURE__ */ jsx(Filter, {
            size: 18
          }), activeFilterCount > 0 && /* @__PURE__ */ jsx("span", {
            children: activeFilterCount
          })]
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20
      },
      children: [/* @__PURE__ */ jsx(AnimatePresence, {
        children: showFilters && /* @__PURE__ */ jsx(motion.div, {
          initial: {
            height: 0,
            opacity: 0
          },
          animate: {
            height: "auto",
            opacity: 1
          },
          exit: {
            height: 0,
            opacity: 0
          },
          style: {
            overflow: "hidden",
            marginBottom: 20
          },
          children: /* @__PURE__ */ jsxs("div", {
            style: {
              background: "rgba(13, 77, 58, 0.4)",
              borderRadius: 16,
              padding: 20,
              border: "1px solid #2E7D67"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                marginBottom: 16
              },
              children: [/* @__PURE__ */ jsx("label", {
                style: {
                  display: "block",
                  marginBottom: 8,
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "#A7C7BC"
                },
                children: "Type"
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap"
                },
                children: ["all", "article", "video", "guide", "quiz"].map((type) => /* @__PURE__ */ jsxs("button", {
                  onClick: () => setSelectedType(type),
                  style: {
                    background: selectedType === type ? typeColors$1[type] || "#4ADE80" : "rgba(255,255,255,0.08)",
                    color: selectedType === type ? "#0B3D2E" : "#A7C7BC",
                    border: "none",
                    borderRadius: 20,
                    padding: "6px 14px",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  },
                  children: [type !== "all" && typeIcons$1[type], type]
                }, type))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                marginBottom: 16
              },
              children: [/* @__PURE__ */ jsx("label", {
                style: {
                  display: "block",
                  marginBottom: 8,
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "#A7C7BC"
                },
                children: "Category"
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap"
                },
                children: categories$2.map((cat) => /* @__PURE__ */ jsx("button", {
                  onClick: () => setSelectedCategory(cat.value),
                  style: {
                    background: selectedCategory === cat.value ? "#4ADE80" : "rgba(255,255,255,0.08)",
                    color: selectedCategory === cat.value ? "#0B3D2E" : "#A7C7BC",
                    border: "none",
                    borderRadius: 20,
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: 13
                  },
                  children: cat.label
                }, cat.value))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                style: {
                  display: "block",
                  marginBottom: 8,
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "#A7C7BC"
                },
                children: "Language"
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap"
                },
                children: languages$1.map((lang) => /* @__PURE__ */ jsx("button", {
                  onClick: () => setSelectedLanguage(lang.value),
                  style: {
                    background: selectedLanguage === lang.value ? "#4ADE80" : "rgba(255,255,255,0.08)",
                    color: selectedLanguage === lang.value ? "#0B3D2E" : "#A7C7BC",
                    border: "none",
                    borderRadius: 20,
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: 13
                  },
                  children: lang.label
                }, lang.value))
              })]
            }), activeFilterCount > 0 && /* @__PURE__ */ jsx("button", {
              onClick: () => {
                setSelectedCategory("all");
                setSelectedType("all");
                setSelectedLanguage("all");
              },
              style: {
                marginTop: 16,
                background: "transparent",
                border: "1px solid #A7C7BC",
                color: "#A7C7BC",
                borderRadius: 20,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 13
              },
              children: "Clear All Filters"
            })]
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        style: {
          marginBottom: 16,
          fontSize: 14,
          color: "#A7C7BC"
        },
        children: loading ? "Loading..." : `${filteredResources.length} resource${filteredResources.length !== 1 ? "s" : ""} found`
      }), loading ? /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          padding: 60
        },
        children: /* @__PURE__ */ jsx(Loader2, {
          size: 32,
          style: {
            color: "#4ADE80",
            animation: "spin 1s linear infinite"
          }
        })
      }) : filteredResources.length === 0 ? /* @__PURE__ */ jsxs("div", {
        style: {
          textAlign: "center",
          padding: 60,
          color: "#A7C7BC",
          background: "rgba(13, 77, 58, 0.4)",
          borderRadius: 16
        },
        children: [/* @__PURE__ */ jsx(BookOpen, {
          size: 48,
          style: {
            marginBottom: 16,
            opacity: 0.5
          }
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontSize: 16
          },
          children: "No resources found."
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontSize: 13,
            marginBottom: 16
          },
          children: "Try adjusting your search or filters."
        }), user && /* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/upload-resource"),
          style: {
            background: "transparent",
            border: "1px solid #4ADE80",
            color: "#4ADE80",
            padding: "8px 20px",
            borderRadius: 20,
            cursor: "pointer",
            fontWeight: "bold"
          },
          children: "Upload a Resource"
        })]
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 16
        },
        children: filteredResources.map((resource, i) => /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: i * 0.05
          },
          onClick: () => navigate(`/resource/${resource.id}`),
          style: {
            display: "flex",
            gap: 16,
            background: "rgba(13, 77, 58, 0.4)",
            borderRadius: 16,
            border: "1px solid #2E7D67",
            overflow: "hidden",
            cursor: "pointer",
            transition: "transform 0.2s, border-color 0.2s"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#4ADE80";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#2E7D67";
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              width: 140,
              minHeight: 120,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${typeColors$1[resource.type] || "#4ADE80"}33, rgba(0,0,0,0.3))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            },
            children: [resource.thumbnail_url ? /* @__PURE__ */ jsx("img", {
              src: resource.thumbnail_url,
              alt: "",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }
            }) : /* @__PURE__ */ jsx("div", {
              style: {
                color: typeColors$1[resource.type] || "#4ADE80",
                opacity: 0.6
              },
              children: typeIcons$1[resource.type] ? React.cloneElement(typeIcons$1[resource.type], {
                size: 36
              }) : /* @__PURE__ */ jsx(BookOpen, {
                size: 36
              })
            }), /* @__PURE__ */ jsx("span", {
              style: {
                position: "absolute",
                top: 8,
                left: 8,
                background: typeColors$1[resource.type] || "#4ADE80",
                color: "#0B3D2E",
                fontSize: 10,
                fontWeight: "bold",
                padding: "2px 8px",
                borderRadius: 8,
                textTransform: "uppercase"
              },
              children: resource.type
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: 1,
              padding: "14px 14px 14px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                style: {
                  margin: "0 0 6px 0",
                  fontSize: 16,
                  fontWeight: "bold",
                  lineHeight: 1.3
                },
                children: resource.title
              }), /* @__PURE__ */ jsx("p", {
                style: {
                  margin: 0,
                  fontSize: 13,
                  color: "#A7C7BC",
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                },
                children: resource.description
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 12,
                  color: "#A7C7BC"
                },
                children: [resource.author && /* @__PURE__ */ jsx("span", {
                  children: resource.author.name
                }), resource.duration && /* @__PURE__ */ jsxs("span", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  },
                  children: [/* @__PURE__ */ jsx(Clock, {
                    size: 12
                  }), " ", resource.duration]
                }), resource.view_count > 0 && /* @__PURE__ */ jsxs("span", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  },
                  children: [/* @__PURE__ */ jsx(Eye, {
                    size: 12
                  }), " ", resource.view_count]
                })]
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  display: "flex",
                  gap: 6
                },
                children: resource.language && resource.language !== "en" && /* @__PURE__ */ jsxs("span", {
                  style: {
                    fontSize: 11,
                    background: "rgba(255,255,255,0.1)",
                    padding: "2px 8px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  },
                  children: [/* @__PURE__ */ jsx(Globe, {
                    size: 10
                  }), " ", resource.language.toUpperCase()]
                })
              })]
            })]
          })]
        }, resource.id))
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
    })]
  });
};
const Resources$1 = UNSAFE_withComponentProps(Resources);
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Resources$1
}, Symbol.toStringTag, { value: "Module" }));
const typeIcons = {
  article: /* @__PURE__ */ jsx(FileText, {
    size: 20
  }),
  video: /* @__PURE__ */ jsx(Video, {
    size: 20
  }),
  guide: /* @__PURE__ */ jsx(BookOpen, {
    size: 20
  }),
  quiz: /* @__PURE__ */ jsx(HelpCircle, {
    size: 20
  })
};
const typeColors = {
  article: "#60A5FA",
  video: "#F472B6",
  guide: "#4ADE80",
  quiz: "#FBBF24"
};
const ResourceDetails = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchResource();
  }, [id]);
  const fetchResource = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("resources").select("*, author:users!resources_user_id_fkey(name, avatar_url, location)").eq("id", id).single();
      if (error) throw error;
      setResource(data);
      await supabase.from("resources").update({
        view_count: (data.view_count || 0) + 1
      }).eq("id", id);
    } catch (error) {
      console.error("Error fetching resource:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },
      children: /* @__PURE__ */ jsx(Loader2, {
        size: 32,
        style: {
          color: "#4ADE80",
          animation: "spin 1s linear infinite"
        }
      })
    });
  }
  if (!resource) {
    return /* @__PURE__ */ jsxs("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        color: "#F2F1EE",
        padding: 20
      },
      children: [/* @__PURE__ */ jsx("p", {
        children: "Resource not found."
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/resources"),
        style: {
          color: "#4ADE80",
          background: "none",
          border: "none",
          cursor: "pointer"
        },
        children: "← Back to Resources"
      })]
    });
  }
  const color = typeColors[resource.type] || "#4ADE80";
  const getLanguageLabel = (code) => {
    const map = {
      en: "🇬🇧 English",
      fr: "🇫🇷 Français",
      mg: "🇲🇬 Malagasy"
    };
    return map[code] || code;
  };
  const isVideo = resource.type === "video";
  const isYoutube = resource.content_url && (resource.content_url.includes("youtube.com") || resource.content_url.includes("youtu.be"));
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 16
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/resources"),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 24
        })
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 20,
          fontWeight: "bold",
          margin: 0,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        },
        children: resource.title
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20
      },
      children: [isYoutube ? /* @__PURE__ */ jsx("div", {
        style: {
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 24,
          aspectRatio: "16/9",
          background: "#000"
        },
        children: /* @__PURE__ */ jsx("iframe", {
          src: getYoutubeEmbedUrl(resource.content_url),
          style: {
            width: "100%",
            height: "100%",
            border: "none"
          },
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowFullScreen: true,
          title: resource.title
        })
      }) : resource.thumbnail_url ? /* @__PURE__ */ jsx("div", {
        style: {
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 24
        },
        children: /* @__PURE__ */ jsx("img", {
          src: resource.thumbnail_url,
          alt: resource.title,
          style: {
            width: "100%",
            height: "auto",
            display: "block"
          }
        })
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          height: 200,
          borderRadius: 16,
          marginBottom: 24,
          background: `linear-gradient(135deg, ${color}22, rgba(0,0,0,0.3))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #2E7D67"
        },
        children: typeIcons[resource.type] ? React.cloneElement(typeIcons[resource.type], {
          size: 64,
          color,
          style: {
            opacity: 0.4
          }
        }) : /* @__PURE__ */ jsx(BookOpen, {
          size: 64,
          style: {
            color,
            opacity: 0.4
          }
        })
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("span", {
          style: {
            background: color,
            color: "#0B3D2E",
            fontSize: 12,
            fontWeight: "bold",
            padding: "4px 12px",
            borderRadius: 12,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [typeIcons[resource.type], " ", resource.type]
        }), resource.category && /* @__PURE__ */ jsx("span", {
          style: {
            fontSize: 12,
            background: "rgba(255,255,255,0.1)",
            padding: "4px 12px",
            borderRadius: 12,
            color: "#A7C7BC",
            textTransform: "capitalize"
          },
          children: resource.category
        }), resource.language && /* @__PURE__ */ jsxs("span", {
          style: {
            fontSize: 12,
            background: "rgba(255,255,255,0.1)",
            padding: "4px 12px",
            borderRadius: 12,
            color: "#A7C7BC",
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [/* @__PURE__ */ jsx(Globe, {
            size: 12
          }), " ", getLanguageLabel(resource.language)]
        }), resource.duration && /* @__PURE__ */ jsxs("span", {
          style: {
            fontSize: 12,
            background: "rgba(255,255,255,0.1)",
            padding: "4px 12px",
            borderRadius: 12,
            color: "#A7C7BC",
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [/* @__PURE__ */ jsx(Clock, {
            size: 12
          }), " ", resource.duration]
        }), resource.view_count > 0 && /* @__PURE__ */ jsxs("span", {
          style: {
            fontSize: 12,
            background: "rgba(255,255,255,0.1)",
            padding: "4px 12px",
            borderRadius: 12,
            color: "#A7C7BC",
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [/* @__PURE__ */ jsx(Eye, {
            size: 12
          }), " ", resource.view_count, " views"]
        })]
      }), /* @__PURE__ */ jsx("h2", {
        style: {
          fontSize: 28,
          fontWeight: "bold",
          margin: "0 0 16px 0",
          lineHeight: 1.3
        },
        children: resource.title
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24
        },
        children: [resource.author?.avatar_url ? /* @__PURE__ */ jsx("img", {
          src: resource.author.avatar_url,
          style: {
            width: 40,
            height: 40,
            borderRadius: "50%"
          },
          alt: ""
        }) : /* @__PURE__ */ jsx("div", {
          style: {
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#2E7D67",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          },
          children: /* @__PURE__ */ jsx(User, {
            size: 20,
            color: "#A7C7BC"
          })
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              fontWeight: "bold"
            },
            children: resource.author?.name || "Anonymous"
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              fontSize: 12,
              color: "#A7C7BC",
              display: "flex",
              alignItems: "center",
              gap: 4
            },
            children: [/* @__PURE__ */ jsx(Calendar, {
              size: 12
            }), " ", new Date(resource.created_at).toLocaleDateString()]
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        style: {
          background: "rgba(13, 77, 58, 0.4)",
          padding: 24,
          borderRadius: 16,
          border: "1px solid rgba(46, 125, 103, 0.5)",
          marginBottom: 24
        },
        children: /* @__PURE__ */ jsx("p", {
          style: {
            color: "#D1D5D8",
            lineHeight: 1.8,
            margin: 0,
            whiteSpace: "pre-wrap",
            fontSize: 15
          },
          children: resource.description
        })
      }), resource.tags && resource.tags.length > 0 && /* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 24
        },
        children: [/* @__PURE__ */ jsxs("h4", {
          style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#A7C7BC",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6
          },
          children: [/* @__PURE__ */ jsx(Tag, {
            size: 14
          }), " Tags"]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
          },
          children: resource.tags.map((tag) => /* @__PURE__ */ jsxs("span", {
            style: {
              fontSize: 13,
              background: "rgba(255,255,255,0.08)",
              color: "#A7C7BC",
              padding: "4px 12px",
              borderRadius: 20
            },
            children: ["#", tag]
          }, tag))
        })]
      }), resource.content_url && !isYoutube && /* @__PURE__ */ jsxs("a", {
        href: resource.content_url,
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: color,
          color: "#0B3D2E",
          padding: 16,
          borderRadius: 12,
          fontWeight: "bold",
          fontSize: 16,
          textDecoration: "none",
          transition: "opacity 0.2s"
        },
        onMouseEnter: (e) => e.currentTarget.style.opacity = "0.9",
        onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
        children: [/* @__PURE__ */ jsx(ExternalLink, {
          size: 20
        }), isVideo ? "Watch Video" : "Open Resource"]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
    })]
  });
};
const ResourceDetails$1 = UNSAFE_withComponentProps(ResourceDetails);
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResourceDetails$1
}, Symbol.toStringTag, { value: "Module" }));
const types = [{
  value: "article",
  label: "Article",
  icon: /* @__PURE__ */ jsx(FileText, {
    size: 20
  }),
  color: "#60A5FA"
}, {
  value: "video",
  label: "Video",
  icon: /* @__PURE__ */ jsx(Video, {
    size: 20
  }),
  color: "#F472B6"
}, {
  value: "guide",
  label: "Guide",
  icon: /* @__PURE__ */ jsx(BookOpen, {
    size: 20
  }),
  color: "#4ADE80"
}, {
  value: "quiz",
  label: "Quiz",
  icon: /* @__PURE__ */ jsx(HelpCircle, {
    size: 20
  }),
  color: "#FBBF24"
}];
const categories$1 = [{
  value: "regenerative",
  label: "Regenerative Practices"
}, {
  value: "vanilla",
  label: "Vanilla Cultivation"
}, {
  value: "agroforestry",
  label: "Agroforestry"
}, {
  value: "soil",
  label: "Soil Health"
}, {
  value: "water",
  label: "Water Management"
}, {
  value: "business",
  label: "Business & Trade"
}, {
  value: "guide",
  label: "General Guides"
}];
const UploadResource = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const thumbnailInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content_url: "",
    type: "guide",
    category: "regenerative",
    language: "en",
    duration: "",
    thumbnail_url: "",
    tags: []
  });
  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput("");
  };
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag)
    }));
  };
  const handleThumbnailUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `thumb_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    setUploadingThumb(true);
    try {
      const {
        error: uploadError
      } = await supabase.storage.from("resources").upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data
      } = supabase.storage.from("resources").getPublicUrl(filePath);
      setFormData((prev) => ({
        ...prev,
        thumbnail_url: data.publicUrl
      }));
      toast.success("Thumbnail uploaded!");
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error("Failed to upload thumbnail");
    } finally {
      setUploadingThumb(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Please provide a title");
      return;
    }
    setLoading(true);
    try {
      const {
        error
      } = await supabase.from("resources").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        content_url: formData.content_url || null,
        type: formData.type,
        category: formData.category,
        language: formData.language,
        duration: formData.duration || null,
        thumbnail_url: formData.thumbnail_url || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        approved: true
        // Auto-approve for now
      });
      if (error) throw error;
      toast.success("Resource uploaded successfully!");
      navigate("/resources");
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error("Failed to upload resource");
    } finally {
      setLoading(false);
    }
  };
  const selectedType = types.find((t) => t.value === formData.type);
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 16
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/resources"),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 24
        })
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 20,
          fontWeight: "bold",
          margin: 0
        },
        children: "Upload Resource"
      })]
    }), /* @__PURE__ */ jsx("div", {
      style: {
        maxWidth: 600,
        margin: "0 auto",
        padding: 20
      },
      children: /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 24
        },
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 10,
              fontWeight: "bold"
            },
            children: "Resource Type"
          }), /* @__PURE__ */ jsx("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: 10
            },
            children: types.map((type) => /* @__PURE__ */ jsxs("button", {
              type: "button",
              onClick: () => setFormData((prev) => ({
                ...prev,
                type: type.value
              })),
              style: {
                background: formData.type === type.value ? `${type.color}22` : "rgba(255,255,255,0.05)",
                border: `2px solid ${formData.type === type.value ? type.color : "transparent"}`,
                borderRadius: 12,
                padding: "14px 8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                color: formData.type === type.value ? type.color : "#A7C7BC",
                transition: "all 0.2s"
              },
              children: [type.icon, /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 12,
                  fontWeight: "bold"
                },
                children: type.label
              })]
            }, type.value))
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Thumbnail"
          }), /* @__PURE__ */ jsx("input", {
            type: "file",
            ref: thumbnailInputRef,
            onChange: handleThumbnailUpload,
            style: {
              display: "none"
            },
            accept: "image/*"
          }), formData.thumbnail_url ? /* @__PURE__ */ jsxs("div", {
            style: {
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              height: 150
            },
            children: [/* @__PURE__ */ jsx("img", {
              src: formData.thumbnail_url,
              alt: "Thumbnail",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }
            }), /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => setFormData((prev) => ({
                ...prev,
                thumbnail_url: null
              })),
              style: {
                position: "absolute",
                top: 4,
                right: 4,
                background: "transparent",
                border: "none",
                padding: 4,
                cursor: "pointer",
                zIndex: 10,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
              },
              children: /* @__PURE__ */ jsx(X, {
                size: 24,
                color: "white",
                strokeWidth: 2.5
              })
            })]
          }) : /* @__PURE__ */ jsx("div", {
            onClick: () => thumbnailInputRef.current.click(),
            style: {
              height: 100,
              background: "rgba(13, 77, 58, 0.4)",
              border: "2px dashed #2E7D67",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#A7C7BC",
              opacity: uploadingThumb ? 0.6 : 1
            },
            children: uploadingThumb ? /* @__PURE__ */ jsx(Loader2, {
              size: 24,
              style: {
                animation: "spin 1s linear infinite"
              }
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Upload, {
                size: 24,
                style: {
                  marginBottom: 4
                }
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 13
                },
                children: "Upload Thumbnail"
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Title *"
          }), /* @__PURE__ */ jsx("input", {
            name: "title",
            value: formData.title,
            onChange: handleInputChange,
            placeholder: "e.g., How to Grow Shade Trees for Vanilla",
            style: {
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 16,
              boxSizing: "border-box"
            },
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: formData.type === "video" ? "Video URL (YouTube, etc.)" : "Resource Link (optional)"
          }), /* @__PURE__ */ jsx("input", {
            name: "content_url",
            value: formData.content_url,
            onChange: handleInputChange,
            placeholder: formData.type === "video" ? "https://youtube.com/watch?v=..." : "https://...",
            style: {
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 16,
              boxSizing: "border-box"
            }
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 16,
            flexWrap: "wrap"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Category"
            }), /* @__PURE__ */ jsx("select", {
              name: "category",
              value: formData.category,
              onChange: handleInputChange,
              style: {
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 16,
                boxSizing: "border-box"
              },
              children: categories$1.map((c) => /* @__PURE__ */ jsx("option", {
                value: c.value,
                children: c.label
              }, c.value))
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "flex",
                marginBottom: 8,
                fontWeight: "bold",
                alignItems: "center",
                gap: 6
              },
              children: [/* @__PURE__ */ jsx(Globe, {
                size: 16
              }), " Language"]
            }), /* @__PURE__ */ jsxs("select", {
              name: "language",
              value: formData.language,
              onChange: handleInputChange,
              style: {
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 16,
                boxSizing: "border-box"
              },
              children: [/* @__PURE__ */ jsx("option", {
                value: "en",
                children: "🇬🇧 English"
              }), /* @__PURE__ */ jsx("option", {
                value: "fr",
                children: "🇫🇷 Français"
              }), /* @__PURE__ */ jsx("option", {
                value: "mg",
                children: "🇲🇬 Malagasy"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: formData.type === "video" ? "Duration (e.g., 12:30)" : "Estimated Time (e.g., 5 min read)"
          }), /* @__PURE__ */ jsx("input", {
            name: "duration",
            value: formData.duration,
            onChange: handleInputChange,
            placeholder: formData.type === "video" ? "12:30" : "5 min read",
            style: {
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 16,
              boxSizing: "border-box"
            }
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Description / Content *"
          }), /* @__PURE__ */ jsx("textarea", {
            name: "description",
            value: formData.description,
            onChange: handleInputChange,
            placeholder: "Write the full article/guide content, or a summary for videos...",
            rows: 8,
            style: {
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 16,
              resize: "vertical",
              lineHeight: 1.6,
              boxSizing: "border-box"
            },
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Tags"
          }), /* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              gap: 8,
              marginBottom: formData.tags.length > 0 ? 10 : 0,
              flexWrap: "wrap"
            },
            children: formData.tags.map((tag) => /* @__PURE__ */ jsxs("span", {
              style: {
                background: "rgba(74, 222, 128, 0.15)",
                color: "#4ADE80",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 6
              },
              children: ["#", tag, /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => handleRemoveTag(tag),
                style: {
                  background: "none",
                  border: "none",
                  color: "#4ADE80",
                  cursor: "pointer",
                  padding: 0
                },
                children: /* @__PURE__ */ jsx(X, {
                  size: 12
                })
              })]
            }, tag))
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              gap: 8
            },
            children: [/* @__PURE__ */ jsx("input", {
              value: tagInput,
              onChange: (e) => setTagInput(e.target.value),
              onKeyDown: handleTagKeyDown,
              placeholder: "Add a tag and press Enter",
              style: {
                flex: 1,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 14,
                boxSizing: "border-box",
                minWidth: "150px"
              }
            }), /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: handleAddTag,
              style: {
                background: "rgba(255,255,255,0.1)",
                color: "#A7C7BC",
                border: "none",
                borderRadius: 12,
                padding: "0 14px",
                cursor: "pointer"
              },
              children: /* @__PURE__ */ jsx(Plus, {
                size: 18
              })
            })]
          })]
        }), /* @__PURE__ */ jsxs("button", {
          type: "submit",
          disabled: loading || uploadingThumb,
          style: {
            background: selectedType?.color || "#4ADE80",
            color: "#0B3D2E",
            border: "none",
            borderRadius: 12,
            padding: 16,
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: loading || uploadingThumb ? 0.7 : 1,
            transition: "opacity 0.2s"
          },
          children: [loading ? /* @__PURE__ */ jsx(Loader2, {
            style: {
              animation: "spin 1s linear infinite"
            }
          }) : selectedType?.icon, "Upload ", selectedType?.label || "Resource"]
        })]
      })
    }), /* @__PURE__ */ jsx("style", {
      children: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
    })]
  });
};
const UploadResource$1 = UNSAFE_withComponentProps(UploadResource);
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: UploadResource$1
}, Symbol.toStringTag, { value: "Module" }));
const statusConfig$1 = {
  open: {
    label: "Open",
    color: "#FBBF24",
    icon: /* @__PURE__ */ jsx(AlertTriangle, {
      size: 14
    })
  },
  under_review: {
    label: "Under Review",
    color: "#60A5FA",
    icon: /* @__PURE__ */ jsx(Clock, {
      size: 14
    })
  },
  mediation: {
    label: "In Mediation",
    color: "#A78BFA",
    icon: /* @__PURE__ */ jsx(Scale, {
      size: 14
    })
  },
  resolved: {
    label: "Resolved",
    color: "#4ADE80",
    icon: /* @__PURE__ */ jsx(CheckCircle2, {
      size: 14
    })
  },
  dismissed: {
    label: "Dismissed",
    color: "#EF4444",
    icon: /* @__PURE__ */ jsx(XCircle, {
      size: 14
    })
  }
};
const priorityColors$1 = {
  low: "#A7C7BC",
  medium: "#FBBF24",
  high: "#F97316",
  critical: "#EF4444"
};
const Grievances = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("all");
  useEffect(() => {
    fetchGrievances();
  }, [viewMode]);
  const fetchGrievances = async () => {
    setLoading(true);
    try {
      let query = supabase.from("grievances").select(`
                    *,
                    reporter:users!grievances_reporter_id_fkey(name, avatar_url),
                    respondent:users!grievances_against_user_id_fkey(name, avatar_url),
                    mediator:users!grievances_mediator_id_fkey(name, avatar_url),
                    group:groups!grievances_group_id_fkey(name),
                    resolution_notes(count),
                    grievance_votes(count)
                `).order("created_at", {
        ascending: false
      });
      if (viewMode === "mine") {
        query = query.eq("reporter_id", user.id);
      } else if (viewMode === "against_me") {
        query = query.eq("against_user_id", user.id);
      } else if (viewMode === "mediating") {
        query = query.eq("mediator_id", user.id);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      setGrievances(data || []);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredGrievances = grievances.filter((g) => statusFilter === "all" || g.status === statusFilter);
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          gap: 8
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0
          },
          children: [/* @__PURE__ */ jsx("button", {
            onClick: () => navigate("/feed"),
            style: {
              background: "transparent",
              border: "none",
              color: "#A7C7BC",
              cursor: "pointer",
              padding: 4,
              flexShrink: 0
            },
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              size: 22
            })
          }), /* @__PURE__ */ jsxs("h1", {
            style: {
              fontSize: 17,
              fontWeight: "bold",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            },
            children: [/* @__PURE__ */ jsx(Scale, {
              size: 18,
              style: {
                verticalAlign: "middle",
                marginRight: 6
              }
            }), "Conflict Resolution"]
          })]
        }), user && /* @__PURE__ */ jsxs("button", {
          onClick: () => navigate("/file-grievance"),
          style: {
            background: "#F97316",
            color: "white",
            border: "none",
            borderRadius: 20,
            padding: "7px 12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            fontSize: 12,
            flexShrink: 0,
            whiteSpace: "nowrap"
          },
          children: [/* @__PURE__ */ jsx(Plus, {
            size: 16
          }), " File Issue"]
        })]
      }), /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          gap: 6,
          marginBottom: 12,
          flexWrap: "wrap"
        },
        children: [{
          value: "all",
          label: "All Cases"
        }, {
          value: "mine",
          label: "My Filed"
        }, {
          value: "against_me",
          label: "Against Me"
        }, {
          value: "mediating",
          label: "Mediating"
        }].map((tab) => /* @__PURE__ */ jsx("button", {
          onClick: () => setViewMode(tab.value),
          style: {
            background: viewMode === tab.value ? "#4ADE80" : "rgba(255,255,255,0.08)",
            color: viewMode === tab.value ? "#0B3D2E" : "#A7C7BC",
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 13
          },
          children: tab.label
        }, tab.value))
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4
        },
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => setStatusFilter("all"),
          style: {
            background: statusFilter === "all" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
            color: statusFilter === "all" ? "#F2F1EE" : "#A7C7BC",
            border: "none",
            borderRadius: 20,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: 12,
            whiteSpace: "nowrap"
          },
          children: "All"
        }), Object.entries(statusConfig$1).map(([key, cfg]) => /* @__PURE__ */ jsxs("button", {
          onClick: () => setStatusFilter(key),
          style: {
            background: statusFilter === key ? `${cfg.color}33` : "rgba(255,255,255,0.05)",
            color: statusFilter === key ? cfg.color : "#A7C7BC",
            border: statusFilter === key ? `1px solid ${cfg.color}` : "1px solid transparent",
            borderRadius: 20,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: 12,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [cfg.icon, " ", cfg.label]
        }, key))]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20
      },
      children: [/* @__PURE__ */ jsx("div", {
        className: "grievance-stats",
        style: {
          display: "grid",
          gap: 10,
          marginBottom: 20
        },
        children: ["open", "under_review", "mediation", "resolved"].map((status) => {
          const count = grievances.filter((g) => g.status === status).length;
          const cfg = statusConfig$1[status];
          return /* @__PURE__ */ jsxs("div", {
            style: {
              background: "rgba(13, 77, 58, 0.4)",
              borderRadius: 12,
              padding: "12px 10px",
              border: "1px solid #2E7D67",
              textAlign: "center"
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 22,
                fontWeight: "bold",
                color: cfg.color
              },
              children: count
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                fontSize: 11,
                color: "#A7C7BC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4
              },
              children: [cfg.icon, " ", cfg.label]
            })]
          }, status);
        })
      }), loading ? /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          padding: 60
        },
        children: /* @__PURE__ */ jsx(Loader2, {
          size: 32,
          style: {
            color: "#4ADE80",
            animation: "spin 1s linear infinite"
          }
        })
      }) : filteredGrievances.length === 0 ? /* @__PURE__ */ jsxs("div", {
        style: {
          textAlign: "center",
          padding: 60,
          color: "#A7C7BC",
          background: "rgba(13, 77, 58, 0.4)",
          borderRadius: 16
        },
        children: [/* @__PURE__ */ jsx(Scale, {
          size: 48,
          style: {
            marginBottom: 16,
            opacity: 0.5
          }
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontSize: 16
          },
          children: "No grievances found."
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontSize: 13
          },
          children: "The community is at peace 🕊️"
        })]
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 12
        },
        children: filteredGrievances.map((grievance, i) => {
          const cfg = statusConfig$1[grievance.status] || statusConfig$1.open;
          return /* @__PURE__ */ jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 15
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              delay: i * 0.04
            },
            onClick: () => navigate(`/grievance/${grievance.id}`),
            style: {
              background: "rgba(13, 77, 58, 0.4)",
              borderRadius: 16,
              padding: 18,
              border: "1px solid #2E7D67",
              cursor: "pointer",
              transition: "border-color 0.2s"
            },
            onMouseEnter: (e) => e.currentTarget.style.borderColor = cfg.color,
            onMouseLeave: (e) => e.currentTarget.style.borderColor = "#2E7D67",
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  flex: 1
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 6,
                    flexWrap: "wrap"
                  },
                  children: [/* @__PURE__ */ jsxs("span", {
                    style: {
                      background: `${cfg.color}22`,
                      color: cfg.color,
                      fontSize: 11,
                      fontWeight: "bold",
                      padding: "3px 10px",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      border: `1px solid ${cfg.color}44`
                    },
                    children: [cfg.icon, " ", cfg.label]
                  }), /* @__PURE__ */ jsx("span", {
                    style: {
                      fontSize: 11,
                      fontWeight: "bold",
                      padding: "3px 8px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.05)",
                      color: priorityColors$1[grievance.priority] || "#A7C7BC",
                      textTransform: "uppercase"
                    },
                    children: grievance.priority
                  }), grievance.category && /* @__PURE__ */ jsx("span", {
                    style: {
                      fontSize: 11,
                      color: "#A7C7BC",
                      textTransform: "capitalize"
                    },
                    children: grievance.category.replace("_", " ")
                  })]
                }), /* @__PURE__ */ jsx("h3", {
                  style: {
                    margin: "0 0 6px 0",
                    fontSize: 16,
                    fontWeight: "bold"
                  },
                  children: grievance.title
                }), /* @__PURE__ */ jsx("p", {
                  style: {
                    margin: 0,
                    fontSize: 13,
                    color: "#A7C7BC",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  },
                  children: grievance.description
                })]
              }), /* @__PURE__ */ jsx(ChevronRight, {
                size: 20,
                style: {
                  color: "#A7C7BC",
                  flexShrink: 0,
                  marginLeft: 8
                }
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: "#A7C7BC",
                marginTop: 10,
                paddingTop: 10,
                borderTop: "1px solid rgba(255,255,255,0.06)"
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  gap: 12
                },
                children: [/* @__PURE__ */ jsxs("span", {
                  children: ["Filed by: ", /* @__PURE__ */ jsx("strong", {
                    style: {
                      color: "#F2F1EE"
                    },
                    children: grievance.reporter?.name || "Anonymous"
                  })]
                }), grievance.respondent ? /* @__PURE__ */ jsxs("span", {
                  children: ["Against: ", /* @__PURE__ */ jsx("strong", {
                    style: {
                      color: "#F2F1EE"
                    },
                    children: grievance.respondent.name
                  })]
                }) : grievance.group ? /* @__PURE__ */ jsxs("span", {
                  children: ["Against: ", /* @__PURE__ */ jsx("strong", {
                    style: {
                      color: "#F2F1EE"
                    },
                    children: grievance.group.name
                  })]
                }) : null]
              }), /* @__PURE__ */ jsx("span", {
                children: new Date(grievance.created_at).toLocaleDateString()
              })]
            })]
          }, grievance.id);
        })
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .grievance-stats { grid-template-columns: repeat(2, 1fr); }
                @media (min-width: 480px) {
                    .grievance-stats { grid-template-columns: repeat(4, 1fr); }
                }
            `
    })]
  });
};
const Grievances$1 = UNSAFE_withComponentProps(Grievances);
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Grievances$1
}, Symbol.toStringTag, { value: "Module" }));
const categories = [{
  value: "land_encroachment",
  label: "🏗️ Land Encroachment"
}, {
  value: "mining_pollution",
  label: "⛏️ Mining Pollution"
}, {
  value: "crop_damage",
  label: "🌿 Crop Damage"
}, {
  value: "health_impact",
  label: "🏥 Health Impact (dust/chemicals)"
}, {
  value: "water_contamination",
  label: "💧 Water Contamination"
}, {
  value: "land_dispute",
  label: "📄 Land Dispute"
}, {
  value: "contract_breach",
  label: "📝 Contract Breach"
}, {
  value: "price_dispute",
  label: "💰 Price Dispute"
}, {
  value: "theft",
  label: "🔒 Theft / Vandalism"
}, {
  value: "labor",
  label: "👷 Labor Issue"
}, {
  value: "environmental",
  label: "🌍 Environmental Damage"
}, {
  value: "general",
  label: "📋 General Grievance"
}];
const FileGrievance = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [groups, setGroups] = useState([]);
  const [againstType, setAgainstType] = useState("user");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
    against_user_id: null,
    against_user_name: "",
    group_id: null,
    group_name: "",
    location: "",
    evidence_urls: []
  });
  useEffect(() => {
    fetchGroups();
  }, []);
  const fetchGroups = async () => {
    const {
      data
    } = await supabase.from("groups").select("id, name").order("name");
    setGroups(data || []);
  };
  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSearchUser = async (query) => {
    setSearchUser(query);
    if (query.length < 2) {
      setUserResults([]);
      return;
    }
    try {
      const {
        data,
        error
      } = await supabase.from("users").select("id, name, avatar_url").ilike("name", `%${query}%`).neq("id", user.id).limit(5);
      if (error) {
        console.error("User search error:", error);
        const {
          data: fallbackData
        } = await supabase.from("users").select("id, name, avatar_url").neq("id", user.id).limit(20);
        const filtered = (fallbackData || []).filter((u) => u.name && u.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        setUserResults(filtered);
      } else {
        setUserResults(data || []);
      }
    } catch (err) {
      console.error("User search exception:", err);
    }
  };
  const selectUser = (u) => {
    setFormData((prev) => ({
      ...prev,
      against_user_id: u.id,
      against_user_name: u.name
    }));
    setSearchUser("");
    setUserResults([]);
  };
  const handleEvidenceUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    setUploading(true);
    try {
      const {
        error: uploadError
      } = await supabase.storage.from("grievances").upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data
      } = supabase.storage.from("grievances").getPublicUrl(fileName);
      setFormData((prev) => ({
        ...prev,
        evidence_urls: [...prev.evidence_urls, data.publicUrl]
      }));
      toast.success("Evidence uploaded!");
    } catch (error) {
      console.error("Error uploading evidence:", error);
      toast.error("Failed to upload evidence");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const removeEvidence = (index) => {
    setFormData((prev) => ({
      ...prev,
      evidence_urls: prev.evidence_urls.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please provide a title and description");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        reporter_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: formData.location || null,
        evidence_urls: formData.evidence_urls.length > 0 ? formData.evidence_urls : null,
        status: "open"
      };
      if (againstType === "user" && formData.against_user_id) {
        payload.against_user_id = formData.against_user_id;
      }
      if (againstType === "group" && formData.group_id) {
        payload.group_id = formData.group_id;
      }
      const {
        error
      } = await supabase.from("grievances").insert(payload);
      if (error) throw error;
      toast.success("Grievance filed successfully! Involved parties will be notified.");
      navigate("/grievances");
    } catch (error) {
      console.error("Error filing grievance:", error);
      toast.error("Failed to file grievance");
    } finally {
      setLoading(false);
    }
  };
  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid #2E7D67",
    background: "rgba(0,0,0,0.2)",
    color: "white",
    fontSize: 15,
    boxSizing: "border-box"
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "12px 16px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 12
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/grievances"),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer",
          padding: 4
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 22
        })
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 18,
          fontWeight: "bold",
          margin: 0
        },
        children: "File a Grievance"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 600,
        margin: "0 auto",
        padding: "16px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(249, 115, 22, 0.1)",
          border: "1px solid rgba(249, 115, 22, 0.3)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#F97316",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6
          },
          children: [/* @__PURE__ */ jsx(AlertTriangle, {
            size: 16
          }), " How it works"]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            fontSize: 13,
            color: "#A7C7BC",
            lineHeight: 1.6
          },
          children: [/* @__PURE__ */ jsx("strong", {
            children: "1."
          }), " File your complaint with evidence below", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("strong", {
            children: "2."
          }), " The respondent is notified and can respond", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("strong", {
            children: "3."
          }), " A mediator facilitates fair resolution", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("strong", {
            children: "4."
          }), " Community votes on proposals — majority wins", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("strong", {
            children: "5."
          }), " Resolution tracked and archived for transparency"]
        })]
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 20
        },
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Issue Title *"
          }), /* @__PURE__ */ jsx("input", {
            name: "title",
            value: formData.title,
            onChange: handleInputChange,
            placeholder: "e.g., Graphite mining damaging my rice fields",
            style: inputStyle,
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "grievance-form-row",
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Category"
            }), /* @__PURE__ */ jsx("select", {
              name: "category",
              value: formData.category,
              onChange: handleInputChange,
              style: inputStyle,
              children: categories.map((c) => /* @__PURE__ */ jsx("option", {
                value: c.value,
                children: c.label
              }, c.value))
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Priority"
            }), /* @__PURE__ */ jsxs("select", {
              name: "priority",
              value: formData.priority,
              onChange: handleInputChange,
              style: inputStyle,
              children: [/* @__PURE__ */ jsx("option", {
                value: "low",
                children: "🟢 Low"
              }), /* @__PURE__ */ jsx("option", {
                value: "medium",
                children: "🟡 Medium"
              }), /* @__PURE__ */ jsx("option", {
                value: "high",
                children: "🟠 High"
              }), /* @__PURE__ */ jsx("option", {
                value: "critical",
                children: "🔴 Critical"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Filed Against"
          }), /* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              gap: 6,
              marginBottom: 12
            },
            children: [{
              value: "user",
              label: "A Person",
              icon: /* @__PURE__ */ jsx(User, {
                size: 14
              })
            }, {
              value: "group",
              label: "A Group/Co-op",
              icon: /* @__PURE__ */ jsx(Users, {
                size: 14
              })
            }, {
              value: "general",
              label: "General",
              icon: /* @__PURE__ */ jsx(AlertTriangle, {
                size: 14
              })
            }].map((opt) => /* @__PURE__ */ jsxs("button", {
              type: "button",
              onClick: () => {
                setAgainstType(opt.value);
                setFormData((prev) => ({
                  ...prev,
                  against_user_id: null,
                  against_user_name: "",
                  group_id: null,
                  group_name: ""
                }));
              },
              style: {
                flex: 1,
                padding: "8px 6px",
                borderRadius: 10,
                border: "none",
                background: againstType === opt.value ? "#F97316" : "rgba(255,255,255,0.08)",
                color: againstType === opt.value ? "white" : "#A7C7BC",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4
              },
              children: [opt.icon, " ", opt.label]
            }, opt.value))
          }), againstType === "user" && (formData.against_user_id ? /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 12,
              background: "rgba(0,0,0,0.2)",
              borderRadius: 12,
              border: "1px solid #2E7D67"
            },
            children: [/* @__PURE__ */ jsx("span", {
              style: {
                fontWeight: "bold"
              },
              children: formData.against_user_name
            }), /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => setFormData((prev) => ({
                ...prev,
                against_user_id: null,
                against_user_name: ""
              })),
              style: {
                background: "none",
                border: "none",
                color: "#EF4444",
                cursor: "pointer"
              },
              children: /* @__PURE__ */ jsx(X, {
                size: 16
              })
            })]
          }) : /* @__PURE__ */ jsxs("div", {
            style: {
              position: "relative"
            },
            children: [/* @__PURE__ */ jsx("input", {
              value: searchUser,
              onChange: (e) => handleSearchUser(e.target.value),
              placeholder: "Search for a user...",
              style: inputStyle
            }), userResults.length > 0 && /* @__PURE__ */ jsx("div", {
              style: {
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#0D4D3A",
                borderRadius: "0 0 12px 12px",
                border: "1px solid #2E7D67",
                borderTop: "none",
                zIndex: 5,
                maxHeight: 200,
                overflowY: "auto"
              },
              children: userResults.map((u) => /* @__PURE__ */ jsxs("div", {
                onClick: () => selectUser(u),
                style: {
                  padding: "10px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderBottom: "1px solid rgba(255,255,255,0.05)"
                },
                onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)",
                onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
                children: [u.avatar_url ? /* @__PURE__ */ jsx("img", {
                  src: u.avatar_url,
                  style: {
                    width: 28,
                    height: 28,
                    borderRadius: "50%"
                  },
                  alt: ""
                }) : /* @__PURE__ */ jsx("div", {
                  style: {
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#2E7D67"
                  }
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: 14
                  },
                  children: u.name
                })]
              }, u.id))
            })]
          })), againstType === "group" && /* @__PURE__ */ jsxs("select", {
            value: formData.group_id || "",
            onChange: (e) => setFormData((prev) => ({
              ...prev,
              group_id: e.target.value || null
            })),
            style: inputStyle,
            children: [/* @__PURE__ */ jsx("option", {
              value: "",
              children: "Select a group or co-op..."
            }), groups.map((g) => /* @__PURE__ */ jsx("option", {
              value: g.id,
              children: g.name
            }, g.id))]
          }), againstType === "general" && /* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 12,
              color: "#A7C7BC",
              fontStyle: "italic"
            },
            children: "No specific party — this will be a general community grievance."
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("label", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: [/* @__PURE__ */ jsx(MapPin, {
              size: 16
            }), " Location"]
          }), /* @__PURE__ */ jsx("input", {
            name: "location",
            value: formData.location,
            onChange: handleInputChange,
            placeholder: "Where did this occur?",
            style: inputStyle
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Detailed Description *"
          }), /* @__PURE__ */ jsx("textarea", {
            name: "description",
            value: formData.description,
            onChange: handleInputChange,
            placeholder: "Describe the issue in detail: what happened, when, the impact on your livelihood, health risks, damages, etc.",
            rows: 6,
            style: {
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.6
            },
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("label", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: [/* @__PURE__ */ jsx(Camera, {
              size: 16
            }), " Evidence (Photos/Documents)"]
          }), /* @__PURE__ */ jsx("input", {
            type: "file",
            ref: fileInputRef,
            onChange: handleEvidenceUpload,
            style: {
              display: "none"
            },
            accept: "image/*,.pdf,.doc,.docx,video/*"
          }), formData.evidence_urls.length > 0 && /* @__PURE__ */ jsx("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
              gap: 8,
              marginBottom: 12
            },
            children: formData.evidence_urls.map((url, idx) => /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative",
                height: 90,
                borderRadius: 10,
                overflow: "hidden"
              },
              children: [/* @__PURE__ */ jsx("img", {
                src: url,
                alt: `Evidence ${idx + 1}`,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }
              }), /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => removeEvidence(idx),
                style: {
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  padding: 4,
                  cursor: "pointer",
                  borderRadius: 6,
                  zIndex: 10
                },
                children: /* @__PURE__ */ jsx(X, {
                  size: 16,
                  color: "white"
                })
              })]
            }, idx))
          }), /* @__PURE__ */ jsx("div", {
            onClick: () => fileInputRef.current.click(),
            style: {
              height: 80,
              background: "rgba(13, 77, 58, 0.4)",
              border: "2px dashed #2E7D67",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#A7C7BC",
              opacity: uploading ? 0.6 : 1
            },
            children: uploading ? /* @__PURE__ */ jsx(Loader2, {
              size: 24,
              style: {
                animation: "spin 1s linear infinite"
              }
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Upload, {
                size: 22,
                style: {
                  marginBottom: 4
                }
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 13
                },
                children: formData.evidence_urls.length > 0 ? "Add More Evidence" : "Upload Photos, Videos, or Documents"
              })]
            })
          }), /* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 11,
              color: "#A7C7BC",
              marginTop: 6
            },
            children: "Supports images, videos, PDFs, and documents. Strong evidence speeds up resolution."
          })]
        }), /* @__PURE__ */ jsxs("button", {
          type: "submit",
          disabled: loading || uploading,
          style: {
            background: "#F97316",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: loading || uploading ? 0.7 : 1
          },
          children: [loading ? /* @__PURE__ */ jsx(Loader2, {
            size: 20,
            style: {
              animation: "spin 1s linear infinite"
            }
          }) : /* @__PURE__ */ jsx(AlertTriangle, {
            size: 20
          }), "Submit Grievance"]
        })]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .grievance-form-row { display: flex; gap: 12px; flex-wrap: wrap; }
            `
    })]
  });
};
const FileGrievance$1 = UNSAFE_withComponentProps(FileGrievance);
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FileGrievance$1
}, Symbol.toStringTag, { value: "Module" }));
const statusConfig = {
  open: {
    label: "Open",
    color: "#FBBF24",
    icon: /* @__PURE__ */ jsx(AlertTriangle, {
      size: 16
    }),
    desc: "Awaiting review and response"
  },
  under_review: {
    label: "Under Review",
    color: "#60A5FA",
    icon: /* @__PURE__ */ jsx(Clock, {
      size: 16
    }),
    desc: "Being reviewed by mediator"
  },
  mediation: {
    label: "In Mediation",
    color: "#A78BFA",
    icon: /* @__PURE__ */ jsx(Scale, {
      size: 16
    }),
    desc: "Parties are negotiating a resolution"
  },
  resolved: {
    label: "Resolved",
    color: "#4ADE80",
    icon: /* @__PURE__ */ jsx(CheckCircle2, {
      size: 16
    }),
    desc: "Case resolved successfully"
  },
  dismissed: {
    label: "Dismissed",
    color: "#EF4444",
    icon: /* @__PURE__ */ jsx(XCircle, {
      size: 16
    }),
    desc: "Case dismissed"
  }
};
const priorityColors = {
  low: "#A7C7BC",
  medium: "#FBBF24",
  high: "#F97316",
  critical: "#EF4444"
};
const noteTypeConfig = {
  response: {
    label: "Response",
    color: "#60A5FA",
    icon: /* @__PURE__ */ jsx(MessageSquare, {
      size: 14
    })
  },
  note: {
    label: "Note",
    color: "#A7C7BC",
    icon: /* @__PURE__ */ jsx(FileText, {
      size: 14
    })
  },
  mediation: {
    label: "Mediation",
    color: "#A78BFA",
    icon: /* @__PURE__ */ jsx(Scale, {
      size: 14
    })
  },
  proposal: {
    label: "Proposal",
    color: "#FBBF24",
    icon: /* @__PURE__ */ jsx(AlertCircle, {
      size: 14
    })
  },
  decision: {
    label: "Decision",
    color: "#4ADE80",
    icon: /* @__PURE__ */ jsx(CheckCircle2, {
      size: 14
    })
  },
  escalation: {
    label: "Escalation",
    color: "#EF4444",
    icon: /* @__PURE__ */ jsx(AlertTriangle, {
      size: 14
    })
  }
};
const getAvailableTransitions = (currentStatus, isReporter, isRespondent, isMediator) => {
  const transitions = [];
  if (currentStatus === "open") {
    if (isMediator || isReporter) transitions.push("under_review");
  }
  if (currentStatus === "under_review") {
    if (isMediator) transitions.push("mediation");
    if (isMediator) transitions.push("dismissed");
  }
  if (currentStatus === "mediation") {
    if (isMediator || isReporter) transitions.push("resolved");
    if (isMediator) transitions.push("dismissed");
  }
  if (currentStatus === "open" || currentStatus === "under_review") {
    if (isMediator) transitions.push("mediation");
  }
  return [...new Set(transitions)];
};
const GrievanceDetails = () => {
  const {
    id
  } = useParams();
  const {
    user,
    isAdmin
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [grievance, setGrievance] = useState(null);
  const [notes, setNotes] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("response");
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [resolutionText, setResolutionText] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [noteEvidence, setNoteEvidence] = useState([]);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    fetchAll();
  }, [id]);
  useEffect(() => {
    if (grievance && user) {
      const isReporter2 = user.id === grievance.reporter_id;
      const isMediator2 = user.id === grievance.mediator_id;
      if (isMediator2 || isAdmin) setNoteType("mediation");
      else if (isReporter2) setNoteType("note");
      else setNoteType("response");
    }
  }, [grievance, user, isAdmin]);
  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchGrievance(), fetchNotes(), fetchVotes()]);
    setLoading(false);
  };
  const fetchGrievance = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("grievances").select(`
                    *,
                    reporter:users!grievances_reporter_id_fkey(id, name, avatar_url, location),
                    respondent:users!grievances_against_user_id_fkey(id, name, avatar_url, location),
                    mediator:users!grievances_mediator_id_fkey(id, name, avatar_url),
                    group:groups!grievances_group_id_fkey(id, name)
                `).eq("id", id).single();
      if (error) throw error;
      setGrievance(data);
    } catch (error) {
      console.error("Error fetching grievance:", error);
    }
  };
  const fetchNotes = async () => {
    const {
      data
    } = await supabase.from("resolution_notes").select("*, author:users!resolution_notes_author_id_fkey(id, name, avatar_url)").eq("grievance_id", id).order("created_at", {
      ascending: true
    });
    setNotes(data || []);
  };
  const fetchVotes = async () => {
    const {
      data
    } = await supabase.from("grievance_votes").select("*").eq("grievance_id", id);
    setVotes(data || []);
  };
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        grievance_id: id,
        author_id: user.id,
        content: newNote.trim(),
        note_type: noteType
      };
      if (noteEvidence.length > 0) payload.evidence_urls = noteEvidence;
      const {
        error
      } = await supabase.from("resolution_notes").insert(payload);
      if (error) throw error;
      setNewNote("");
      setNoteEvidence([]);
      fetchNotes();
      toast.success("Response added");
    } catch {
      toast.error("Failed to add response");
    } finally {
      setSubmitting(false);
    }
  };
  const handleNoteEvidenceUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    setUploading(true);
    try {
      const {
        error: uploadError
      } = await supabase.storage.from("grievances").upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data
      } = supabase.storage.from("grievances").getPublicUrl(fileName);
      setNoteEvidence((prev) => [...prev, data.publicUrl]);
      toast.success("Evidence attached");
    } catch {
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleVote = async (voteValue) => {
    setVoting(true);
    try {
      const existingVote = votes.find((v) => v.user_id === user.id);
      if (existingVote) {
        toast.info("You have already voted");
        return;
      }
      const {
        error
      } = await supabase.from("grievance_votes").insert({
        grievance_id: id,
        user_id: user.id,
        vote: voteValue
      });
      if (error) throw error;
      fetchVotes();
      toast.success("Vote recorded");
    } catch {
      toast.error("Failed to vote");
    } finally {
      setVoting(false);
    }
  };
  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === "resolved") {
      setShowResolveModal(true);
      return;
    }
    try {
      const updates = {
        status: newStatus,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const {
        error
      } = await supabase.from("grievances").update(updates).eq("id", id);
      if (error) throw error;
      await supabase.from("resolution_notes").insert({
        grievance_id: id,
        author_id: user.id,
        content: `Status changed to "${statusConfig[newStatus]?.label}"`,
        note_type: newStatus === "dismissed" ? "decision" : "mediation"
      });
      fetchAll();
      toast.success(`Status updated to ${statusConfig[newStatus]?.label}`);
    } catch {
      toast.error("Failed to update status");
    }
  };
  const handleResolve = async () => {
    if (!resolutionText.trim()) {
      toast.error("Please describe the resolution");
      return;
    }
    try {
      const {
        error
      } = await supabase.from("grievances").update({
        status: "resolved",
        resolution_text: resolutionText.trim(),
        resolved_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      if (error) throw error;
      await supabase.from("resolution_notes").insert({
        grievance_id: id,
        author_id: user.id,
        content: `✅ Case resolved: ${resolutionText.trim()}`,
        note_type: "decision"
      });
      setShowResolveModal(false);
      setResolutionText("");
      fetchAll();
      toast.success("Case resolved! Resolution recorded.");
    } catch {
      toast.error("Failed to resolve");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },
      children: /* @__PURE__ */ jsx(Loader2, {
        size: 32,
        style: {
          color: "#4ADE80",
          animation: "spin 1s linear infinite"
        }
      })
    });
  }
  if (!grievance) {
    return /* @__PURE__ */ jsxs("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        color: "#F2F1EE",
        padding: 20
      },
      children: [/* @__PURE__ */ jsx("p", {
        children: "Grievance not found."
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/grievances"),
        style: {
          color: "#4ADE80",
          background: "none",
          border: "none",
          cursor: "pointer"
        },
        children: "← Back"
      })]
    });
  }
  const cfg = statusConfig[grievance.status] || statusConfig.open;
  const isReporter = user?.id === grievance.reporter_id;
  const isRespondent = user?.id === grievance.against_user_id;
  const isMediator = user?.id === grievance.mediator_id;
  const canManage = isMediator || isAdmin;
  const isInvolved = isReporter || isRespondent || isMediator || isAdmin;
  const isClosed = grievance.status === "resolved" || grievance.status === "dismissed";
  const availableTransitions = getAvailableTransitions(grievance.status, isReporter, isRespondent, canManage);
  const supportReporter = votes.filter((v) => v.vote === "support_reporter").length;
  const supportRespondent = votes.filter((v) => v.vote === "support_respondent").length;
  const neutralVotes = votes.filter((v) => v.vote === "neutral").length;
  const userVote = votes.find((v) => v.user_id === user?.id);
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "12px 16px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 10
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/grievances"),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer",
          padding: 4
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 22
        })
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 18,
          fontWeight: "bold",
          margin: 0,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        },
        children: "Case Details"
      }), isInvolved && /* @__PURE__ */ jsx("span", {
        style: {
          background: `${cfg.color}22`,
          color: cfg.color,
          fontSize: 11,
          fontWeight: "bold",
          padding: "4px 10px",
          borderRadius: 10,
          border: `1px solid ${cfg.color}44`,
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexShrink: 0
        },
        children: isReporter ? "Reporter" : isRespondent ? "Respondent" : "Mediator"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: "16px"
      },
      children: [/* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          gap: 2,
          marginBottom: 20
        },
        children: ["open", "under_review", "mediation", "resolved"].map((s, i) => {
          const sCfg = statusConfig[s];
          const steps = ["open", "under_review", "mediation", "resolved"];
          const currentIdx = steps.indexOf(grievance.status);
          const isActive = i <= currentIdx && grievance.status !== "dismissed";
          return /* @__PURE__ */ jsxs("div", {
            style: {
              flex: 1,
              textAlign: "center"
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                height: 4,
                borderRadius: 2,
                background: isActive ? sCfg.color : "rgba(255,255,255,0.08)",
                marginBottom: 6,
                transition: "background 0.3s"
              }
            }), /* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 10,
                color: isActive ? sCfg.color : "#A7C7BC",
                fontWeight: isActive ? "bold" : "normal"
              },
              children: sCfg.label
            })]
          }, s);
        })
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center"
        },
        children: [/* @__PURE__ */ jsxs("span", {
          style: {
            background: `${cfg.color}22`,
            color: cfg.color,
            border: `1px solid ${cfg.color}44`,
            fontSize: 13,
            fontWeight: "bold",
            padding: "5px 14px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 6
          },
          children: [cfg.icon, " ", cfg.label]
        }), /* @__PURE__ */ jsxs("span", {
          style: {
            fontSize: 12,
            fontWeight: "bold",
            padding: "5px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.05)",
            color: priorityColors[grievance.priority],
            textTransform: "uppercase"
          },
          children: [grievance.priority, " priority"]
        }), grievance.category && /* @__PURE__ */ jsx("span", {
          style: {
            fontSize: 12,
            background: "rgba(255,255,255,0.05)",
            padding: "5px 12px",
            borderRadius: 12,
            color: "#A7C7BC",
            textTransform: "capitalize"
          },
          children: grievance.category.replace(/_/g, " ")
        })]
      }), /* @__PURE__ */ jsx("h2", {
        style: {
          fontSize: 22,
          fontWeight: "bold",
          margin: "0 0 16px 0",
          lineHeight: 1.3
        },
        children: grievance.title
      }), /* @__PURE__ */ jsxs("div", {
        className: "grievance-parties",
        style: {
          display: "grid",
          gap: 12,
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(13, 77, 58, 0.4)",
            borderRadius: 12,
            padding: 14,
            border: "1px solid #2E7D67"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 11,
              color: "#A7C7BC",
              fontWeight: "bold",
              marginBottom: 8,
              textTransform: "uppercase"
            },
            children: "Reporter"
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10
            },
            children: [grievance.reporter?.avatar_url ? /* @__PURE__ */ jsx("img", {
              src: grievance.reporter.avatar_url,
              style: {
                width: 36,
                height: 36,
                borderRadius: "50%"
              },
              alt: ""
            }) : /* @__PURE__ */ jsx("div", {
              style: {
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#2E7D67",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              },
              children: /* @__PURE__ */ jsx(User, {
                size: 18,
                color: "#A7C7BC"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  fontWeight: "bold",
                  fontSize: 14
                },
                children: grievance.reporter?.name || "Anonymous"
              }), grievance.reporter?.location && /* @__PURE__ */ jsx("div", {
                style: {
                  fontSize: 11,
                  color: "#A7C7BC"
                },
                children: grievance.reporter.location
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(13, 77, 58, 0.4)",
            borderRadius: 12,
            padding: 14,
            border: "1px solid #2E7D67"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 11,
              color: "#A7C7BC",
              fontWeight: "bold",
              marginBottom: 8,
              textTransform: "uppercase"
            },
            children: "Respondent"
          }), grievance.respondent ? /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10
            },
            children: [grievance.respondent?.avatar_url ? /* @__PURE__ */ jsx("img", {
              src: grievance.respondent.avatar_url,
              style: {
                width: 36,
                height: 36,
                borderRadius: "50%"
              },
              alt: ""
            }) : /* @__PURE__ */ jsx("div", {
              style: {
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#2E7D67",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              },
              children: /* @__PURE__ */ jsx(User, {
                size: 18,
                color: "#A7C7BC"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  fontWeight: "bold",
                  fontSize: 14
                },
                children: grievance.respondent.name
              }), grievance.respondent?.location && /* @__PURE__ */ jsx("div", {
                style: {
                  fontSize: 11,
                  color: "#A7C7BC"
                },
                children: grievance.respondent.location
              })]
            })]
          }) : grievance.group ? /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#F97316",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              },
              children: /* @__PURE__ */ jsx(Users, {
                size: 18,
                color: "white"
              })
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  fontWeight: "bold",
                  fontSize: 14
                },
                children: grievance.group.name
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  fontSize: 11,
                  color: "#A7C7BC"
                },
                children: "Group / Co-op"
              })]
            })]
          }) : /* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 13,
              color: "#A7C7BC",
              fontStyle: "italic"
            },
            children: "General grievance — no specific respondent"
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        style: {
          background: grievance.mediator ? "rgba(167, 139, 250, 0.1)" : "rgba(255,255,255,0.03)",
          borderRadius: 12,
          padding: 14,
          border: `1px solid ${grievance.mediator ? "rgba(167, 139, 250, 0.3)" : "#2E7D67"}`,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10
        },
        children: /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10
          },
          children: [/* @__PURE__ */ jsx(Shield, {
            size: 18,
            style: {
              color: "#A78BFA"
            }
          }), grievance.mediator ? /* @__PURE__ */ jsxs("span", {
            style: {
              fontSize: 13,
              color: "#A7C7BC"
            },
            children: ["Mediator: ", /* @__PURE__ */ jsx("strong", {
              style: {
                color: "#F2F1EE"
              },
              children: grievance.mediator.name
            })]
          }) : /* @__PURE__ */ jsx("span", {
            style: {
              fontSize: 13,
              color: "#A7C7BC",
              fontStyle: "italic"
            },
            children: "No mediator assigned yet"
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 16,
          marginBottom: 20,
          fontSize: 13,
          color: "#A7C7BC",
          flexWrap: "wrap"
        },
        children: [grievance.location && /* @__PURE__ */ jsxs("span", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6
          },
          children: [/* @__PURE__ */ jsx(MapPin, {
            size: 14
          }), " ", grievance.location]
        }), /* @__PURE__ */ jsxs("span", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6
          },
          children: [/* @__PURE__ */ jsx(Calendar, {
            size: 14
          }), " Filed ", new Date(grievance.created_at).toLocaleDateString()]
        }), grievance.resolved_at && /* @__PURE__ */ jsxs("span", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#4ADE80"
          },
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            size: 14
          }), " Resolved ", new Date(grievance.resolved_at).toLocaleDateString()]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(13, 77, 58, 0.4)",
          padding: 20,
          borderRadius: 16,
          border: "1px solid rgba(46, 125, 103, 0.5)",
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsx("h3", {
          style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#A7C7BC",
            marginTop: 0,
            marginBottom: 10
          },
          children: "Description"
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#D1D5D8",
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: "pre-wrap",
            fontSize: 14
          },
          children: grievance.description
        })]
      }), grievance.evidence_urls && grievance.evidence_urls.length > 0 && /* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#A7C7BC",
            marginBottom: 10
          },
          children: ["Evidence (", grievance.evidence_urls.length, ")"]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 8
          },
          children: grievance.evidence_urls.map((url, idx) => /* @__PURE__ */ jsx("a", {
            href: url,
            target: "_blank",
            rel: "noopener noreferrer",
            style: {
              display: "block",
              height: 100,
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #2E7D67"
            },
            children: /* @__PURE__ */ jsx("img", {
              src: url,
              alt: `Evidence ${idx + 1}`,
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }
            })
          }, idx))
        })]
      }), grievance.status === "resolved" && grievance.resolution_text && /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(74, 222, 128, 0.1)",
          border: "1px solid rgba(74, 222, 128, 0.3)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#4ADE80",
            marginTop: 0,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6
          },
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            size: 16
          }), " Resolution"]
        }), /* @__PURE__ */ jsx("p", {
          style: {
            margin: 0,
            color: "#D1D5D8",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap"
          },
          children: grievance.resolution_text
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(13, 77, 58, 0.4)",
          borderRadius: 16,
          padding: 18,
          border: "1px solid #2E7D67",
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 15,
            fontWeight: "bold",
            marginTop: 0,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(ThumbsUp, {
            size: 16
          }), " Community Vote (", votes.length, ")"]
        }), /* @__PURE__ */ jsxs("div", {
          className: "vote-grid",
          style: {
            display: "grid",
            gap: 8,
            marginBottom: 14
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              textAlign: "center",
              padding: 10,
              background: "rgba(74, 222, 128, 0.1)",
              borderRadius: 10,
              border: "1px solid rgba(74, 222, 128, 0.2)"
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#4ADE80"
              },
              children: supportReporter
            }), /* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 11,
                color: "#A7C7BC"
              },
              children: "Support Reporter"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              textAlign: "center",
              padding: 10,
              background: "rgba(167, 199, 188, 0.1)",
              borderRadius: 10,
              border: "1px solid rgba(167, 199, 188, 0.2)"
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#A7C7BC"
              },
              children: neutralVotes
            }), /* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 11,
                color: "#A7C7BC"
              },
              children: "Neutral"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              textAlign: "center",
              padding: 10,
              background: "rgba(251, 191, 36, 0.1)",
              borderRadius: 10,
              border: "1px solid rgba(251, 191, 36, 0.2)"
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#FBBF24"
              },
              children: supportRespondent
            }), /* @__PURE__ */ jsx("div", {
              style: {
                fontSize: 11,
                color: "#A7C7BC"
              },
              children: "Support Respondent"
            })]
          })]
        }), !userVote && !isReporter && !isRespondent && !isClosed ? /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 6
          },
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => handleVote("support_reporter"),
            disabled: voting,
            style: {
              flex: 1,
              background: "rgba(74, 222, 128, 0.15)",
              color: "#4ADE80",
              border: "1px solid rgba(74, 222, 128, 0.3)",
              borderRadius: 10,
              padding: "8px 6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4
            },
            children: [/* @__PURE__ */ jsx(ThumbsUp, {
              size: 14
            }), " Reporter"]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => handleVote("neutral"),
            disabled: voting,
            style: {
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              color: "#A7C7BC",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "8px 6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4
            },
            children: [/* @__PURE__ */ jsx(Minus, {
              size: 14
            }), " Neutral"]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => handleVote("support_respondent"),
            disabled: voting,
            style: {
              flex: 1,
              background: "rgba(251, 191, 36, 0.15)",
              color: "#FBBF24",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              borderRadius: 10,
              padding: "8px 6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4
            },
            children: [/* @__PURE__ */ jsx(ThumbsDown, {
              size: 14
            }), " Respondent"]
          })]
        }) : userVote ? /* @__PURE__ */ jsxs("div", {
          style: {
            textAlign: "center",
            fontSize: 13,
            color: "#A7C7BC",
            fontStyle: "italic"
          },
          children: ["You voted: ", /* @__PURE__ */ jsx("strong", {
            style: {
              color: "#F2F1EE"
            },
            children: userVote.vote.replace(/_/g, " ")
          })]
        }) : isReporter || isRespondent ? /* @__PURE__ */ jsx("div", {
          style: {
            textAlign: "center",
            fontSize: 13,
            color: "#A7C7BC",
            fontStyle: "italic"
          },
          children: "Involved parties cannot vote"
        }) : null]
      }), !isClosed && availableTransitions.length > 0 && /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(0,0,0,0.2)",
          borderRadius: 16,
          padding: 16,
          border: "1px solid #2E7D67",
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsx("h3", {
          style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#A7C7BC",
            marginTop: 0,
            marginBottom: 10
          },
          children: "Advance Case"
        }), /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
          },
          children: availableTransitions.map((key) => {
            const scfg = statusConfig[key];
            return /* @__PURE__ */ jsxs("button", {
              onClick: () => handleStatusUpdate(key),
              style: {
                background: `${scfg.color}15`,
                color: scfg.color,
                border: `1px solid ${scfg.color}33`,
                borderRadius: 10,
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6
              },
              children: [scfg.icon, " ", key === "resolved" ? "Mark Resolved" : scfg.label]
            }, key);
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(MessageSquare, {
            size: 16
          }), " Resolution Log (", notes.length, ")"]
        }), notes.length === 0 ? /* @__PURE__ */ jsx("div", {
          style: {
            textAlign: "center",
            padding: 30,
            color: "#A7C7BC",
            fontSize: 13,
            fontStyle: "italic",
            background: "rgba(13,77,58,0.3)",
            borderRadius: 12
          },
          children: isRespondent ? "No responses yet. Add your response below." : "No resolution notes yet. Be the first to respond."
        }) : /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 2
          },
          children: notes.map((note, i) => {
            const ntCfg = noteTypeConfig[note.note_type] || noteTypeConfig.note;
            const uid = note.author?.id;
            let roleCfg = {
              color: "#A7C7BC",
              bg: "rgba(255,255,255,0.05)"
            };
            if (uid === grievance.mediator_id) {
              roleCfg = {
                label: "Mediator",
                color: "#A78BFA",
                bg: "rgba(167, 139, 250, 0.15)"
              };
            } else if (uid === grievance.reporter_id) {
              roleCfg = {
                label: "Reporter",
                color: "#FBBF24",
                bg: "rgba(251, 191, 36, 0.08)"
              };
            } else if (uid === grievance.against_user_id || grievance.group && uid !== grievance.reporter_id && uid !== grievance.mediator_id) {
              roleCfg = {
                label: "Respondent",
                color: "#60A5FA",
                bg: "rgba(96, 165, 250, 0.08)"
              };
            }
            return /* @__PURE__ */ jsxs(motion.div, {
              initial: {
                opacity: 0,
                x: -10
              },
              animate: {
                opacity: 1,
                x: 0
              },
              transition: {
                delay: i * 0.04
              },
              style: {
                display: "flex",
                gap: 10
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 20,
                  flexShrink: 0
                },
                children: [/* @__PURE__ */ jsx("div", {
                  style: {
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: roleCfg.color,
                    flexShrink: 0,
                    marginTop: 14
                  }
                }), i < notes.length - 1 && /* @__PURE__ */ jsx("div", {
                  style: {
                    width: 2,
                    flex: 1,
                    background: "rgba(255,255,255,0.08)"
                  }
                })]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  flex: 1,
                  background: roleCfg.bg,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 8,
                  border: `1px solid ${roleCfg.color}44`,
                  minWidth: 0
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                    flexWrap: "wrap",
                    gap: 4
                  },
                  children: [/* @__PURE__ */ jsxs("div", {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    },
                    children: [/* @__PURE__ */ jsx("span", {
                      style: {
                        fontSize: 13,
                        fontWeight: "bold"
                      },
                      children: note.author?.name || "System"
                    }), /* @__PURE__ */ jsxs("span", {
                      style: {
                        fontSize: 10,
                        color: ntCfg.color,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        opacity: 0.8
                      },
                      children: [ntCfg.icon, " ", ntCfg.label]
                    })]
                  }), /* @__PURE__ */ jsxs("span", {
                    style: {
                      fontSize: 10,
                      color: "#A7C7BC"
                    },
                    children: [new Date(note.created_at).toLocaleDateString(), " ", new Date(note.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })]
                  })]
                }), /* @__PURE__ */ jsx("p", {
                  style: {
                    margin: 0,
                    fontSize: 13,
                    color: "#F2F1EE",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap"
                  },
                  children: note.content
                }), note.evidence_urls && note.evidence_urls.length > 0 && /* @__PURE__ */ jsx("div", {
                  style: {
                    display: "flex",
                    gap: 6,
                    marginTop: 8,
                    flexWrap: "wrap"
                  },
                  children: note.evidence_urls.map((url, ei) => /* @__PURE__ */ jsx("a", {
                    href: url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: /* @__PURE__ */ jsx("img", {
                      src: url,
                      alt: "",
                      style: {
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #2E7D67"
                      }
                    })
                  }, ei))
                })]
              })]
            }, note.id);
          })
        }), !isClosed && /* @__PURE__ */ jsxs("form", {
          onSubmit: handleAddNote,
          style: {
            marginTop: 14
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              gap: 6,
              marginBottom: 8,
              flexWrap: "wrap"
            },
            children: Object.entries(noteTypeConfig).filter(([key]) => {
              if (canManage) return ["mediation", "decision"].includes(key);
              if (isReporter) return ["note", "escalation"].includes(key);
              return ["response", "proposal"].includes(key);
            }).map(([key, ntCfg]) => /* @__PURE__ */ jsxs("button", {
              type: "button",
              onClick: () => setNoteType(key),
              style: {
                background: noteType === key ? `${ntCfg.color}22` : "rgba(255,255,255,0.05)",
                color: noteType === key ? ntCfg.color : "#A7C7BC",
                border: noteType === key ? `1px solid ${ntCfg.color}44` : "1px solid transparent",
                borderRadius: 8,
                padding: "3px 8px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 3
              },
              children: [ntCfg.icon, " ", ntCfg.label]
            }, key))
          }), noteEvidence.length > 0 && /* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              gap: 6,
              marginBottom: 8,
              flexWrap: "wrap"
            },
            children: noteEvidence.map((url, i) => /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative",
                width: 50,
                height: 50
              },
              children: [/* @__PURE__ */ jsx("img", {
                src: url,
                alt: "",
                style: {
                  width: "100%",
                  height: "100%",
                  borderRadius: 6,
                  objectFit: "cover"
                }
              }), /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => setNoteEvidence((prev) => prev.filter((_, j) => j !== i)),
                style: {
                  position: "absolute",
                  top: -4,
                  right: -4,
                  background: "#EF4444",
                  border: "none",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0
                },
                children: /* @__PURE__ */ jsx(X, {
                  size: 10,
                  color: "white"
                })
              })]
            }, i))
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              gap: 8
            },
            children: [/* @__PURE__ */ jsx("input", {
              type: "file",
              ref: fileInputRef,
              onChange: handleNoteEvidenceUpload,
              style: {
                display: "none"
              },
              accept: "image/*,.pdf,video/*"
            }), /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => fileInputRef.current?.click(),
              disabled: uploading,
              style: {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #2E7D67",
                borderRadius: 10,
                padding: "0 12px",
                cursor: "pointer",
                color: "#A7C7BC",
                display: "flex",
                alignItems: "center",
                flexShrink: 0
              },
              children: uploading ? /* @__PURE__ */ jsx(Loader2, {
                size: 16,
                style: {
                  animation: "spin 1s linear infinite"
                }
              }) : /* @__PURE__ */ jsx(Camera, {
                size: 16
              })
            }), /* @__PURE__ */ jsx("textarea", {
              value: newNote,
              onChange: (e) => setNewNote(e.target.value),
              placeholder: isRespondent ? "Add your response, counter-evidence, or proposal..." : isMediator ? "Add mediation notes or decisions..." : "Add a note or comment...",
              rows: 2,
              style: {
                flex: 1,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #2E7D67",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: 13,
                resize: "vertical",
                boxSizing: "border-box"
              }
            }), /* @__PURE__ */ jsx("button", {
              type: "submit",
              disabled: submitting || !newNote.trim(),
              style: {
                background: "#4ADE80",
                color: "#0B3D2E",
                border: "none",
                borderRadius: 10,
                padding: "0 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                opacity: submitting || !newNote.trim() ? 0.5 : 1,
                flexShrink: 0
              },
              children: /* @__PURE__ */ jsx(Send, {
                size: 16
              })
            })]
          })]
        })]
      })]
    }), showResolveModal && /* @__PURE__ */ jsx("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      },
      children: /* @__PURE__ */ jsxs("div", {
        style: {
          background: "#0D4D3A",
          borderRadius: 20,
          padding: 24,
          maxWidth: 500,
          width: "100%",
          border: "1px solid #2E7D67"
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            margin: "0 0 16px 0",
            fontSize: 18,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            size: 20,
            style: {
              color: "#4ADE80"
            }
          }), " Mark as Resolved"]
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#A7C7BC",
            fontSize: 13,
            marginBottom: 16,
            lineHeight: 1.5
          },
          children: "Describe the resolution — e.g., what actions were agreed upon, repairs funded, buffer zones established, or other outcomes."
        }), /* @__PURE__ */ jsx("textarea", {
          value: resolutionText,
          onChange: (e) => setResolutionText(e.target.value),
          placeholder: "e.g., Miners agreed to fund repairs for damaged rice fields. A 50m buffer zone was established between the mine and farmland. Monthly water quality testing will begin.",
          rows: 5,
          style: {
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #2E7D67",
            background: "rgba(0,0,0,0.2)",
            color: "white",
            fontSize: 14,
            resize: "vertical",
            boxSizing: "border-box",
            marginBottom: 16
          }
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 10,
            justifyContent: "flex-end"
          },
          children: [/* @__PURE__ */ jsx("button", {
            onClick: () => {
              setShowResolveModal(false);
              setResolutionText("");
            },
            style: {
              background: "rgba(255,255,255,0.08)",
              color: "#A7C7BC",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold"
            },
            children: "Cancel"
          }), /* @__PURE__ */ jsx("button", {
            onClick: handleResolve,
            disabled: !resolutionText.trim(),
            style: {
              background: "#4ADE80",
              color: "#0B3D2E",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold",
              opacity: !resolutionText.trim() ? 0.5 : 1
            },
            children: "Confirm Resolution"
          })]
        })]
      })
    }), /* @__PURE__ */ jsx("style", {
      children: `
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .grievance-parties { grid-template-columns: 1fr; }
                .vote-grid { grid-template-columns: 1fr 1fr 1fr; }
                @media (min-width: 480px) {
                    .grievance-parties { grid-template-columns: 1fr 1fr; }
                }
            `
    })]
  });
};
const GrievanceDetails$1 = UNSAFE_withComponentProps(GrievanceDetails);
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GrievanceDetails$1
}, Symbol.toStringTag, { value: "Module" }));
const crisisTypes$2 = {
  cyclone: {
    label: "Cyclone",
    icon: /* @__PURE__ */ jsx(CloudLightning, {
      size: 16
    }),
    color: "#A78BFA"
  },
  flood: {
    label: "Flood",
    icon: /* @__PURE__ */ jsx(Droplets, {
      size: 16
    }),
    color: "#60A5FA"
  },
  drought: {
    label: "Drought",
    icon: /* @__PURE__ */ jsx(Flame, {
      size: 16
    }),
    color: "#F97316"
  },
  fire: {
    label: "Fire",
    icon: /* @__PURE__ */ jsx(Flame, {
      size: 16
    }),
    color: "#EF4444"
  },
  locust: {
    label: "Locust",
    icon: /* @__PURE__ */ jsx(Bug, {
      size: 16
    }),
    color: "#FBBF24"
  },
  disease: {
    label: "Disease",
    icon: /* @__PURE__ */ jsx(ShieldAlert, {
      size: 16
    }),
    color: "#F472B6"
  },
  other: {
    label: "Other",
    icon: /* @__PURE__ */ jsx(AlertTriangle, {
      size: 16
    }),
    color: "#A7C7BC"
  }
};
const alertTypes$1 = {
  info: {
    label: "Info",
    color: "#60A5FA"
  },
  warning: {
    label: "Warning",
    color: "#FBBF24"
  },
  emergency: {
    label: "Emergency",
    color: "#F97316"
  },
  critical: {
    label: "Critical",
    color: "#EF4444"
  },
  all_clear: {
    label: "All Clear",
    color: "#4ADE80"
  }
};
const severityLabels$1 = ["", "Low", "Moderate", "Serious", "Severe", "Catastrophic"];
const severityColors$1 = ["", "#4ADE80", "#FBBF24", "#F97316", "#EF4444", "#DC2626"];
const CrisisAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [statusFilter, setStatusFilter] = useState("active");
  const [typeFilter, setTypeFilter] = useState("all");
  const [mapMounted, setMapMounted] = useState(false);
  const [RL, setRL] = useState(null);
  useEffect(() => {
    setMapMounted(true);
    import("react-leaflet").then((m) => setRL(m));
    fetchAlerts();
    const channel = supabase.channel("crisis-alerts").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "crisis_alerts"
    }, () => fetchAlerts()).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("crisis_alerts").select("*, creator:users!crisis_alerts_creator_id_fkey(name, avatar_url)").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching crisis alerts:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesType = typeFilter === "all" || a.crisis_type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [alerts, statusFilter, typeFilter]);
  const activeCount = alerts.filter((a) => a.status === "active").length;
  const criticalCount = alerts.filter((a) => a.status === "active" && (a.severity_level || 3) >= 4).length;
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 1e3,
        background: criticalCount > 0 ? "rgba(127, 29, 29, 0.95)" : "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: `1px solid ${criticalCount > 0 ? "#EF4444" : "#2E7D67"}`,
        transition: "background 0.3s"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        className: "header-top-row",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "header-left-group",
          children: [/* @__PURE__ */ jsx("button", {
            onClick: () => navigate("/feed"),
            style: {
              background: "transparent",
              border: "none",
              color: "#A7C7BC",
              cursor: "pointer",
              padding: 0
            },
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              size: 24
            })
          }), /* @__PURE__ */ jsxs("h1", {
            className: "header-title",
            children: [/* @__PURE__ */ jsx(Radio, {
              size: 20,
              style: {
                color: criticalCount > 0 ? "#EF4444" : "#F97316"
              }
            }), /* @__PURE__ */ jsx("span", {
              children: "Emergency Alerts"
            })]
          }), activeCount > 0 && /* @__PURE__ */ jsxs("span", {
            className: "active-badge",
            children: [activeCount, " ACTIVE"]
          })]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            gap: 8
          },
          children: /* @__PURE__ */ jsxs("button", {
            onClick: () => navigate("/create-alert"),
            className: "create-alert-btn",
            children: [/* @__PURE__ */ jsx(Plus, {
              size: 18
            }), " ", /* @__PURE__ */ jsx("span", {
              className: "btn-label",
              children: "Alert"
            })]
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 10
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            background: "rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: 2
          },
          children: [/* @__PURE__ */ jsxs("button", {
            onClick: () => setViewMode("list"),
            style: {
              background: viewMode === "list" ? "#4ADE80" : "transparent",
              color: viewMode === "list" ? "#0B3D2E" : "#A7C7BC",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontWeight: "bold",
              fontSize: 13
            },
            children: [/* @__PURE__ */ jsx(List, {
              size: 16
            }), " List"]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => setViewMode("map"),
            style: {
              background: viewMode === "map" ? "#4ADE80" : "transparent",
              color: viewMode === "map" ? "#0B3D2E" : "#A7C7BC",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontWeight: "bold",
              fontSize: 13
            },
            children: [/* @__PURE__ */ jsx(Map$1, {
              size: 16
            }), " Map"]
          })]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            flex: 1
          }
        }), /* @__PURE__ */ jsxs("select", {
          value: statusFilter,
          onChange: (e) => setStatusFilter(e.target.value),
          style: {
            background: "rgba(255,255,255,0.1)",
            color: "#F2F1EE",
            border: "1px solid #2E7D67",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 12
          },
          children: [/* @__PURE__ */ jsx("option", {
            value: "all",
            children: "All Status"
          }), /* @__PURE__ */ jsx("option", {
            value: "active",
            children: "Active"
          }), /* @__PURE__ */ jsx("option", {
            value: "monitoring",
            children: "Monitoring"
          }), /* @__PURE__ */ jsx("option", {
            value: "resolved",
            children: "Resolved"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4
        },
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => setTypeFilter("all"),
          style: {
            background: typeFilter === "all" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
            color: "#F2F1EE",
            border: "none",
            borderRadius: 20,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: 12,
            whiteSpace: "nowrap"
          },
          children: "All"
        }), Object.entries(crisisTypes$2).map(([key, cfg]) => /* @__PURE__ */ jsxs("button", {
          onClick: () => setTypeFilter(key),
          style: {
            background: typeFilter === key ? `${cfg.color}33` : "rgba(255,255,255,0.05)",
            color: typeFilter === key ? cfg.color : "#A7C7BC",
            border: typeFilter === key ? `1px solid ${cfg.color}` : "1px solid transparent",
            borderRadius: 20,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: 12,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [cfg.icon, " ", cfg.label]
        }, key))]
      })]
    }), /* @__PURE__ */ jsx("div", {
      style: {
        maxWidth: 900,
        margin: "0 auto",
        padding: 20
      },
      children: loading ? /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          justifyContent: "center",
          padding: 60
        },
        children: /* @__PURE__ */ jsx(Loader2, {
          size: 32,
          style: {
            color: "#4ADE80",
            animation: "spin 1s linear infinite"
          }
        })
      }) : viewMode === "map" ? (
        /* Map View */
        /* @__PURE__ */ jsx("div", {
          style: {
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #2E7D67",
            height: 500
          },
          children: mapMounted && RL && /* @__PURE__ */ jsxs(RL.MapContainer, {
            center: [-18.9, 47.5],
            zoom: 6,
            style: {
              height: "100%",
              width: "100%"
            },
            zoomControl: true,
            children: [/* @__PURE__ */ jsx(RL.TileLayer, {
              attribution: "© OpenStreetMap",
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }), filteredAlerts.filter((a) => a.latitude && a.longitude).map((alert) => {
              const ct = crisisTypes$2[alert.crisis_type] || crisisTypes$2.other;
              const sColor = severityColors$1[alert.severity_level || 3] || "#FBBF24";
              return /* @__PURE__ */ jsxs(React.Fragment, {
                children: [alert.affected_radius_km && /* @__PURE__ */ jsx(RL.Circle, {
                  center: [alert.latitude, alert.longitude],
                  radius: alert.affected_radius_km * 1e3,
                  pathOptions: {
                    color: sColor,
                    fillColor: sColor,
                    fillOpacity: 0.1,
                    weight: 1
                  }
                }), /* @__PURE__ */ jsx(RL.CircleMarker, {
                  center: [alert.latitude, alert.longitude],
                  radius: 8 + (alert.severity_level || 3) * 2,
                  pathOptions: {
                    color: sColor,
                    fillColor: sColor,
                    fillOpacity: 0.7,
                    weight: 2
                  },
                  children: /* @__PURE__ */ jsx(RL.Popup, {
                    children: /* @__PURE__ */ jsxs("div", {
                      style: {
                        minWidth: 180
                      },
                      children: [/* @__PURE__ */ jsx("strong", {
                        children: alert.title
                      }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsxs("span", {
                        style: {
                          fontSize: 12
                        },
                        children: [ct.label, " · ", severityLabels$1[alert.severity_level || 3], " · ", alert.status]
                      }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("button", {
                        onClick: () => navigate(`/crisis/${alert.id}`),
                        style: {
                          marginTop: 6,
                          background: "#0B3D2E",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          padding: "4px 10px",
                          cursor: "pointer",
                          fontSize: 12
                        },
                        children: "View Details →"
                      })]
                    })
                  })
                })]
              }, alert.id);
            })]
          })
        })
      ) : (
        /* List View */
        filteredAlerts.length === 0 ? /* @__PURE__ */ jsxs("div", {
          style: {
            textAlign: "center",
            padding: 60,
            color: "#A7C7BC",
            background: "rgba(13, 77, 58, 0.4)",
            borderRadius: 16
          },
          children: [/* @__PURE__ */ jsx(Radio, {
            size: 48,
            style: {
              marginBottom: 16,
              opacity: 0.5
            }
          }), /* @__PURE__ */ jsx("p", {
            style: {
              fontSize: 16
            },
            children: "No alerts found."
          }), /* @__PURE__ */ jsx("p", {
            style: {
              fontSize: 13
            },
            children: "No active emergencies — stay prepared! 🛡️"
          })]
        }) : /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 14
          },
          children: filteredAlerts.map((alert, i) => {
            const ct = crisisTypes$2[alert.crisis_type] || crisisTypes$2.other;
            const at = alertTypes$1[alert.alert_type] || alertTypes$1.warning;
            const sColor = severityColors$1[alert.severity_level || 3] || "#FBBF24";
            const isActive = alert.status === "active";
            return /* @__PURE__ */ jsxs(motion.div, {
              initial: {
                opacity: 0,
                y: 15
              },
              animate: {
                opacity: 1,
                y: 0
              },
              transition: {
                delay: i * 0.04
              },
              onClick: () => navigate(`/crisis/${alert.id}`),
              style: {
                background: isActive ? "rgba(239, 68, 68, 0.05)" : "rgba(13, 77, 58, 0.4)",
                borderRadius: 16,
                padding: 20,
                border: `1px solid ${isActive ? `${sColor}44` : "#2E7D67"}`,
                cursor: "pointer",
                transition: "transform 0.2s, border-color 0.2s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = sColor;
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isActive ? `${sColor}44` : "#2E7D67";
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  marginBottom: 10,
                  flexWrap: "wrap",
                  alignItems: "center"
                },
                children: [isActive && /* @__PURE__ */ jsxs("span", {
                  style: {
                    background: "#EF4444",
                    color: "white",
                    fontSize: 10,
                    fontWeight: "bold",
                    padding: "3px 8px",
                    borderRadius: 8,
                    textTransform: "uppercase",
                    animation: "pulse 2s infinite",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  },
                  children: [/* @__PURE__ */ jsx(Radio, {
                    size: 10
                  }), " ACTIVE"]
                }), /* @__PURE__ */ jsxs("span", {
                  style: {
                    background: `${ct.color}22`,
                    color: ct.color,
                    fontSize: 11,
                    fontWeight: "bold",
                    padding: "3px 10px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  },
                  children: [ct.icon, " ", ct.label]
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    background: `${at.color}22`,
                    color: at.color,
                    fontSize: 11,
                    fontWeight: "bold",
                    padding: "3px 10px",
                    borderRadius: 8
                  },
                  children: at.label
                }), /* @__PURE__ */ jsxs("span", {
                  style: {
                    fontSize: 11,
                    fontWeight: "bold",
                    padding: "3px 10px",
                    borderRadius: 8,
                    background: `${sColor}22`,
                    color: sColor
                  },
                  children: ["Severity: ", alert.severity_level || 3, "/5"]
                })]
              }), /* @__PURE__ */ jsx("h3", {
                style: {
                  margin: "0 0 6px 0",
                  fontSize: 18,
                  fontWeight: "bold"
                },
                children: alert.title
              }), /* @__PURE__ */ jsx("p", {
                style: {
                  margin: "0 0 12px 0",
                  fontSize: 13,
                  color: "#A7C7BC",
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                },
                children: alert.description
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12,
                  color: "#A7C7BC"
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    gap: 12
                  },
                  children: [alert.affected_area && /* @__PURE__ */ jsxs("span", {
                    children: ["📍 ", alert.affected_area]
                  }), alert.affected_radius_km && /* @__PURE__ */ jsxs("span", {
                    children: ["↔ ", alert.affected_radius_km, "km radius"]
                  })]
                }), /* @__PURE__ */ jsx("span", {
                  children: new Date(alert.created_at).toLocaleDateString()
                })]
              })]
            }, alert.id);
          })
        })
      )
    }), /* @__PURE__ */ jsx("style", {
      children: `
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
                .leaflet-container { background: #0B3D2E; }

                /* Header Responsive Styles */
                .header-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; gap: 8px; }
                .header-left-group { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
                .header-title { font-size: 20px; font-weight: bold; margin: 0; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
                .active-badge { background: #EF4444; color: white; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 10px; animation: pulse 2s infinite; white-space: nowrap; flex-shrink: 0; }
                .create-alert-btn { background: #EF4444; color: white; border: none; border-radius: 20px; padding: 8px 16px; font-weight: bold; display: flex; align-items: center; gap: 6; cursor: pointer; white-space: nowrap; }
                
                @media (max-width: 480px) {
                    .header-top-row { gap: 4px; }
                    .header-title { font-size: 16px; gap: 6px; }
                    .btn-label { display: none; }
                    .create-alert-btn { padding: 8px; border-radius: 50%; width: 36px; height: 36px; justify-content: center; } 
                    .active-badge { font-size: 9px; padding: 2px 6px; }
                    .header-left-group { gap: 6px; }
                }
            `
    })]
  });
};
const CrisisAlerts$1 = UNSAFE_withComponentProps(CrisisAlerts);
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CrisisAlerts$1
}, Symbol.toStringTag, { value: "Module" }));
const MapUpdater = ({
  RL,
  center
}) => {
  const map = RL.useMap();
  React.useEffect(() => {
    if (center) map.setView(center, 10);
  }, [center, map]);
  return null;
};
const MapClickHandler = ({
  RL,
  onLocationSelect
}) => {
  RL.useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};
const crisisTypes$1 = [{
  value: "cyclone",
  label: "Cyclone",
  icon: /* @__PURE__ */ jsx(CloudLightning, {
    size: 20
  }),
  color: "#A78BFA"
}, {
  value: "flood",
  label: "Flood",
  icon: /* @__PURE__ */ jsx(Droplets, {
    size: 20
  }),
  color: "#60A5FA"
}, {
  value: "drought",
  label: "Drought",
  icon: /* @__PURE__ */ jsx(Flame, {
    size: 20
  }),
  color: "#F97316"
}, {
  value: "fire",
  label: "Fire",
  icon: /* @__PURE__ */ jsx(Flame, {
    size: 20
  }),
  color: "#EF4444"
}, {
  value: "locust",
  label: "Locust",
  icon: /* @__PURE__ */ jsx(Bug, {
    size: 20
  }),
  color: "#FBBF24"
}, {
  value: "disease",
  label: "Disease",
  icon: /* @__PURE__ */ jsx(ShieldAlert, {
    size: 20
  }),
  color: "#F472B6"
}, {
  value: "other",
  label: "Other",
  icon: /* @__PURE__ */ jsx(AlertTriangle, {
    size: 20
  }),
  color: "#A7C7BC"
}];
const CreateAlert = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [RL, setRL] = useState(null);
  React.useEffect(() => {
    import("react-leaflet").then((m) => setRL(m));
    Promise.resolve().then(() => leaflet);
    import("leaflet").then((LModule) => {
      const L = LModule.default || LModule;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
      });
    });
  }, []);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mapPosition, setMapPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    crisis_type: "cyclone",
    alert_type: "warning",
    severity: 3,
    affected_area: "",
    affected_radius_km: 10,
    image_url: ""
  });
  const [mapMounted, setMapMounted] = useState(false);
  React.useEffect(() => setMapMounted(true), []);
  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleMapSelect = async (lat, lng) => {
    setMapPosition([lat, lng]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const name = addr.city || addr.town || addr.village || addr.county || data.display_name.split(",")[0];
        setFormData((prev) => ({
          ...prev,
          affected_area: name
        }));
      }
    } catch (e) {
      console.error("Reverse geocode failed", e);
    }
  };
  const handleImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    setUploading(true);
    try {
      const {
        error
      } = await supabase.storage.from("crisis").upload(fileName, file);
      if (error) throw error;
      const {
        data
      } = supabase.storage.from("crisis").getPublicUrl(fileName);
      setFormData((prev) => ({
        ...prev,
        image_url: data.publicUrl
      }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and description required");
      return;
    }
    setLoading(true);
    try {
      const {
        error
      } = await supabase.from("crisis_alerts").insert({
        created_by: user.id,
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions || null,
        crisis_type: formData.crisis_type,
        alert_type: formData.alert_type,
        severity_level: parseInt(formData.severity),
        location: formData.affected_area || null,
        affected_radius_km: parseFloat(formData.affected_radius_km) || 10,
        latitude: mapPosition ? mapPosition[0] : null,
        longitude: mapPosition ? mapPosition[1] : null,
        image_url: formData.image_url || null,
        status: "active"
      });
      if (error) throw error;
      toast.success("Emergency alert created!");
      navigate("/crisis");
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Failed to create alert");
    } finally {
      setLoading(false);
    }
  };
  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid #2E7D67",
    background: "rgba(0,0,0,0.2)",
    color: "white",
    fontSize: 16,
    boxSizing: "border-box"
  };
  const severityColors2 = ["", "#4ADE80", "#FBBF24", "#F97316", "#EF4444", "#DC2626"];
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 1e3,
        background: "rgba(127, 29, 29, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #EF4444",
        display: "flex",
        alignItems: "center",
        gap: 16
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/crisis"),
        style: {
          background: "transparent",
          border: "none",
          color: "#FCA5A5",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 24
        })
      }), /* @__PURE__ */ jsxs("h1", {
        style: {
          fontSize: 20,
          fontWeight: "bold",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 8
        },
        children: [/* @__PURE__ */ jsx(Radio, {
          size: 20,
          style: {
            color: "#EF4444"
          }
        }), "Create Emergency Alert"]
      })]
    }), /* @__PURE__ */ jsx("div", {
      style: {
        maxWidth: 600,
        margin: "0 auto",
        padding: 20
      },
      children: /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 24
        },
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 10,
              fontWeight: "bold"
            },
            children: "Crisis Type"
          }), /* @__PURE__ */ jsx("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: 8
            },
            children: crisisTypes$1.map((ct) => /* @__PURE__ */ jsxs("button", {
              type: "button",
              onClick: () => setFormData((prev) => ({
                ...prev,
                crisis_type: ct.value
              })),
              style: {
                background: formData.crisis_type === ct.value ? `${ct.color}22` : "rgba(255,255,255,0.05)",
                border: `2px solid ${formData.crisis_type === ct.value ? ct.color : "transparent"}`,
                borderRadius: 12,
                padding: "12px 6px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                color: formData.crisis_type === ct.value ? ct.color : "#A7C7BC",
                transition: "all 0.2s"
              },
              children: [ct.icon, /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 11,
                  fontWeight: "bold"
                },
                children: ct.label
              })]
            }, ct.value))
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 16,
            flexWrap: "wrap"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Alert Level"
            }), /* @__PURE__ */ jsxs("select", {
              name: "alert_type",
              value: formData.alert_type,
              onChange: handleInputChange,
              style: inputStyle,
              children: [/* @__PURE__ */ jsx("option", {
                value: "info",
                children: "ℹ️ Info"
              }), /* @__PURE__ */ jsx("option", {
                value: "warning",
                children: "⚠️ Warning"
              }), /* @__PURE__ */ jsx("option", {
                value: "emergency",
                children: "🚨 Emergency"
              }), /* @__PURE__ */ jsx("option", {
                value: "critical",
                children: "🔴 Critical"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 200px"
            },
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: ["Severity: ", /* @__PURE__ */ jsxs("span", {
                style: {
                  color: severityColors2[formData.severity]
                },
                children: [formData.severity, "/5"]
              })]
            }), /* @__PURE__ */ jsx("input", {
              type: "range",
              name: "severity",
              min: "1",
              max: "5",
              value: formData.severity,
              onChange: handleInputChange,
              style: {
                width: "100%",
                accentColor: severityColors2[formData.severity]
              }
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: "#A7C7BC"
              },
              children: [/* @__PURE__ */ jsx("span", {
                children: "Low"
              }), /* @__PURE__ */ jsx("span", {
                children: "Catastrophic"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Alert Title *"
          }), /* @__PURE__ */ jsx("input", {
            name: "title",
            value: formData.title,
            onChange: handleInputChange,
            placeholder: "e.g., Cyclone Gamane approaching SAVA",
            style: inputStyle,
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Description *"
          }), /* @__PURE__ */ jsx("textarea", {
            name: "description",
            value: formData.description,
            onChange: handleInputChange,
            placeholder: "Detailed situation report...",
            rows: 4,
            style: {
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.6
            },
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Safety Instructions"
          }), /* @__PURE__ */ jsx("textarea", {
            name: "instructions",
            value: formData.instructions,
            onChange: handleInputChange,
            placeholder: "What should people do? Evacuation routes, shelter info...",
            rows: 3,
            style: {
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.6
            }
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            gap: 16,
            flexWrap: "wrap"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              flex: "2 1 200px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Affected Area"
            }), /* @__PURE__ */ jsx(LocationPicker, {
              value: formData.affected_area ? {
                name: formData.affected_area,
                lat: mapPosition?.[0] || 0,
                lng: mapPosition?.[1] || 0
              } : null,
              onChange: (loc) => {
                if (loc) {
                  setFormData((prev) => ({
                    ...prev,
                    affected_area: loc.name
                  }));
                  setMapPosition([loc.lat, loc.lng]);
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    affected_area: ""
                  }));
                }
              },
              placeholder: "Search e.g., Antananarivo, Tamatave..."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: "1 1 120px"
            },
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontWeight: "bold"
              },
              children: "Radius (km)"
            }), /* @__PURE__ */ jsx("input", {
              name: "affected_radius_km",
              type: "number",
              value: formData.affected_radius_km,
              onChange: handleInputChange,
              placeholder: "10",
              style: inputStyle
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("label", {
            style: {
              marginBottom: 8,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 6
            },
            children: [/* @__PURE__ */ jsx(MapPin, {
              size: 16
            }), " Pin Location on Map"]
          }), /* @__PURE__ */ jsx("div", {
            style: {
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #2E7D67",
              height: 250
            },
            children: mapMounted && RL && /* @__PURE__ */ jsxs(RL.MapContainer, {
              center: [-18.9, 47.5],
              zoom: 6,
              style: {
                height: "100%",
                width: "100%"
              },
              children: [/* @__PURE__ */ jsx(RL.TileLayer, {
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }), /* @__PURE__ */ jsx(MapUpdater, {
                RL,
                center: mapPosition
              }), /* @__PURE__ */ jsx(MapClickHandler, {
                RL,
                onLocationSelect: handleMapSelect
              }), mapPosition && /* @__PURE__ */ jsx(RL.Marker, {
                position: mapPosition
              })]
            })
          }), mapPosition && /* @__PURE__ */ jsxs("div", {
            style: {
              fontSize: 12,
              color: "#A7C7BC",
              marginTop: 6,
              display: "flex",
              justifyContent: "space-between"
            },
            children: [/* @__PURE__ */ jsxs("span", {
              children: ["📍 ", mapPosition[0].toFixed(4), ", ", mapPosition[1].toFixed(4)]
            }), /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => setMapPosition(null),
              style: {
                background: "none",
                border: "none",
                color: "#EF4444",
                cursor: "pointer",
                fontSize: 12
              },
              children: "Clear"
            })]
          }), /* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 12,
              color: "#A7C7BC",
              marginTop: 4
            },
            children: "Click on the map to set the crisis epicenter"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            style: {
              display: "block",
              marginBottom: 8,
              fontWeight: "bold"
            },
            children: "Image"
          }), /* @__PURE__ */ jsx("input", {
            type: "file",
            ref: fileInputRef,
            onChange: handleImageUpload,
            style: {
              display: "none"
            },
            accept: "image/*"
          }), formData.image_url ? /* @__PURE__ */ jsxs("div", {
            style: {
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              height: 150
            },
            children: [/* @__PURE__ */ jsx("img", {
              src: formData.image_url,
              alt: "",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }
            }), /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => setFormData((prev) => ({
                ...prev,
                image_url: ""
              })),
              style: {
                position: "absolute",
                top: 4,
                right: 4,
                background: "transparent",
                border: "none",
                padding: 4,
                cursor: "pointer",
                zIndex: 10,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
              },
              children: /* @__PURE__ */ jsx(X, {
                size: 24,
                color: "white",
                strokeWidth: 2.5
              })
            })]
          }) : /* @__PURE__ */ jsx("div", {
            onClick: () => fileInputRef.current.click(),
            style: {
              height: 80,
              background: "rgba(13, 77, 58, 0.4)",
              border: "2px dashed #2E7D67",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#A7C7BC",
              opacity: uploading ? 0.6 : 1
            },
            children: uploading ? /* @__PURE__ */ jsx(Loader2, {
              size: 24,
              style: {
                animation: "spin 1s linear infinite"
              }
            }) : /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsx(Upload, {
                size: 22,
                style: {
                  marginBottom: 4
                }
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 13
                },
                children: "Upload Image"
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("button", {
          type: "submit",
          disabled: loading || uploading,
          style: {
            background: "#EF4444",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: 16,
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: loading || uploading ? 0.7 : 1
          },
          children: [loading ? /* @__PURE__ */ jsx(Loader2, {
            style: {
              animation: "spin 1s linear infinite"
            }
          }) : /* @__PURE__ */ jsx(Radio, {}), "Broadcast Alert"]
        })]
      })
    }), /* @__PURE__ */ jsx("style", {
      children: `
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .leaflet-container { background: #0B3D2E; }
            `
    })]
  });
};
const CreateAlert$1 = UNSAFE_withComponentProps(CreateAlert);
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CreateAlert$1
}, Symbol.toStringTag, { value: "Module" }));
const crisisTypes = {
  cyclone: {
    label: "Cyclone",
    icon: /* @__PURE__ */ jsx(CloudLightning, {
      size: 18
    }),
    color: "#A78BFA"
  },
  flood: {
    label: "Flood",
    icon: /* @__PURE__ */ jsx(Droplets, {
      size: 18
    }),
    color: "#60A5FA"
  },
  drought: {
    label: "Drought",
    icon: /* @__PURE__ */ jsx(Flame, {
      size: 18
    }),
    color: "#F97316"
  },
  fire: {
    label: "Fire",
    icon: /* @__PURE__ */ jsx(Flame, {
      size: 18
    }),
    color: "#EF4444"
  },
  locust: {
    label: "Locust",
    icon: /* @__PURE__ */ jsx(Bug, {
      size: 18
    }),
    color: "#FBBF24"
  },
  disease: {
    label: "Disease",
    icon: /* @__PURE__ */ jsx(ShieldAlert, {
      size: 18
    }),
    color: "#F472B6"
  },
  other: {
    label: "Other",
    icon: /* @__PURE__ */ jsx(AlertTriangle, {
      size: 18
    }),
    color: "#A7C7BC"
  }
};
const alertTypes = {
  info: {
    label: "Info",
    color: "#60A5FA"
  },
  warning: {
    label: "Warning",
    color: "#FBBF24"
  },
  emergency: {
    label: "Emergency",
    color: "#F97316"
  },
  critical: {
    label: "Critical",
    color: "#EF4444"
  },
  all_clear: {
    label: "All Clear",
    color: "#4ADE80"
  }
};
const severityLabels = ["", "Low", "Moderate", "Serious", "Severe", "Catastrophic"];
const severityColors = ["", "#4ADE80", "#FBBF24", "#F97316", "#EF4444", "#DC2626"];
const responseTypes = [{
  value: "info",
  label: "Info Update",
  icon: /* @__PURE__ */ jsx(Info, {
    size: 16
  }),
  color: "#60A5FA"
}, {
  value: "need_help",
  label: "Need Help",
  icon: /* @__PURE__ */ jsx(HelpingHand, {
    size: 16
  }),
  color: "#EF4444"
}, {
  value: "offering_help",
  label: "Offering Help",
  icon: /* @__PURE__ */ jsx(Heart, {
    size: 16
  }),
  color: "#4ADE80"
}, {
  value: "status_update",
  label: "Status Update",
  icon: /* @__PURE__ */ jsx(Radio, {
    size: 16
  }),
  color: "#FBBF24"
}, {
  value: "resource_available",
  label: "Resource Available",
  icon: /* @__PURE__ */ jsx(PackageOpen, {
    size: 16
  }),
  color: "#A78BFA"
}];
const CrisisDetails = () => {
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newResponse, setNewResponse] = useState("");
  const [responseType, setResponseType] = useState("info");
  const [submitting, setSubmitting] = useState(false);
  const [mapMounted, setMapMounted] = useState(false);
  const [RL, setRL] = useState(null);
  useEffect(() => {
    setMapMounted(true);
    import("react-leaflet").then((m) => setRL(m));
    fetchAll();
    const channel = supabase.channel(`crisis-${id}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "crisis_responses",
      filter: `alert_id=eq.${id}`
    }, () => fetchResponses()).subscribe();
    return () => supabase.removeChannel(channel);
  }, [id]);
  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchAlert(), fetchResponses()]);
    setLoading(false);
  };
  const fetchAlert = async () => {
    const {
      data,
      error
    } = await supabase.from("crisis_alerts").select("*, creator:users!crisis_alerts_creator_id_fkey(id, name, avatar_url)").eq("id", id).single();
    if (!error) setAlert(data);
  };
  const fetchResponses = async () => {
    const {
      data
    } = await supabase.from("crisis_responses").select("*, author:users!crisis_responses_user_id_fkey(name, avatar_url)").eq("alert_id", id).order("created_at", {
      ascending: true
    });
    setResponses(data || []);
  };
  const handleAddResponse = async (e) => {
    e.preventDefault();
    if (!newResponse.trim()) return;
    setSubmitting(true);
    try {
      const {
        error
      } = await supabase.from("crisis_responses").insert({
        alert_id: id,
        user_id: user.id,
        content: newResponse.trim(),
        response_type: responseType
      });
      if (error) throw error;
      setNewResponse("");
      fetchResponses();
      toast.success("Response posted");
    } catch {
      toast.error("Failed to post response");
    } finally {
      setSubmitting(false);
    }
  };
  const handleStatusUpdate = async (newStatus) => {
    try {
      const updates = {
        status: newStatus,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (newStatus === "resolved") updates.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
      const {
        error
      } = await supabase.from("crisis_alerts").update(updates).eq("id", id);
      if (error) throw error;
      fetchAlert();
      toast.success(`Status: ${newStatus}`);
    } catch {
      toast.error("Failed to update");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },
      children: /* @__PURE__ */ jsx(Loader2, {
        size: 32,
        style: {
          color: "#4ADE80",
          animation: "spin 1s linear infinite"
        }
      })
    });
  }
  if (!alert) {
    return /* @__PURE__ */ jsxs("div", {
      style: {
        minHeight: "100vh",
        background: "#0B3D2E",
        color: "#F2F1EE",
        padding: 20
      },
      children: [/* @__PURE__ */ jsx("p", {
        children: "Alert not found."
      }), /* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/crisis"),
        style: {
          color: "#4ADE80",
          background: "none",
          border: "none",
          cursor: "pointer"
        },
        children: "← Back"
      })]
    });
  }
  const ct = crisisTypes[alert.crisis_type] || crisisTypes.other;
  const at = alertTypes[alert.alert_type] || alertTypes.warning;
  const sColor = severityColors[alert.severity_level || 3] || "#FBBF24";
  const isCreator = user?.id === alert.created_by;
  const isActive = alert.status === "active";
  const needHelpCount = responses.filter((r) => r.response_type === "need_help").length;
  const offeringHelpCount = responses.filter((r) => r.response_type === "offering_help").length;
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 1e3,
        background: isActive ? "rgba(127, 29, 29, 0.95)" : "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: `1px solid ${isActive ? "#EF4444" : "#2E7D67"}`,
        display: "flex",
        alignItems: "center",
        gap: 16
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate("/crisis"),
        style: {
          background: "transparent",
          border: "none",
          color: "#FCA5A5",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 24
        })
      }), /* @__PURE__ */ jsx("h1", {
        style: {
          fontSize: 18,
          fontWeight: "bold",
          margin: 0,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        },
        children: alert.title
      }), isActive && /* @__PURE__ */ jsx("span", {
        style: {
          background: "#EF4444",
          color: "white",
          fontSize: 10,
          padding: "3px 8px",
          borderRadius: 8,
          animation: "pulse 2s infinite",
          fontWeight: "bold"
        },
        children: "ACTIVE"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          background: `${sColor}15`,
          border: `1px solid ${sColor}44`,
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16
        },
        children: [/* @__PURE__ */ jsx("div", {
          style: {
            fontSize: 48,
            lineHeight: 1
          },
          children: ct.icon ? React.cloneElement(ct.icon, {
            size: 40,
            color: ct.color
          }) : null
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            flex: 1
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              gap: 8,
              marginBottom: 6,
              flexWrap: "wrap"
            },
            children: [/* @__PURE__ */ jsxs("span", {
              style: {
                background: `${ct.color}22`,
                color: ct.color,
                fontSize: 12,
                fontWeight: "bold",
                padding: "3px 10px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 4
              },
              children: [ct.icon, " ", ct.label]
            }), /* @__PURE__ */ jsx("span", {
              style: {
                background: `${at.color}22`,
                color: at.color,
                fontSize: 12,
                fontWeight: "bold",
                padding: "3px 10px",
                borderRadius: 8
              },
              children: at.label
            })]
          }), /* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginBottom: 4
            },
            children: /* @__PURE__ */ jsxs("span", {
              style: {
                fontSize: 14,
                fontWeight: "bold",
                color: sColor
              },
              children: ["Severity ", alert.severity_level || 3, "/5 — ", severityLabels[alert.severity_level || 3]]
            })
          }), /* @__PURE__ */ jsx("div", {
            style: {
              height: 6,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 3,
              overflow: "hidden"
            },
            children: /* @__PURE__ */ jsx("div", {
              style: {
                height: "100%",
                width: `${(alert.severity_level || 3) / 5 * 100}%`,
                background: sColor,
                borderRadius: 3,
                transition: "width 0.5s"
              }
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(13, 77, 58, 0.4)",
            borderRadius: 12,
            padding: 14,
            border: "1px solid #2E7D67",
            textAlign: "center"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#EF4444"
            },
            children: needHelpCount
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              fontSize: 11,
              color: "#A7C7BC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4
            },
            children: [/* @__PURE__ */ jsx(HelpingHand, {
              size: 12
            }), " Need Help"]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(13, 77, 58, 0.4)",
            borderRadius: 12,
            padding: 14,
            border: "1px solid #2E7D67",
            textAlign: "center"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#4ADE80"
            },
            children: offeringHelpCount
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              fontSize: 11,
              color: "#A7C7BC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4
            },
            children: [/* @__PURE__ */ jsx(Heart, {
              size: 12
            }), " Offering Help"]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            background: "rgba(13, 77, 58, 0.4)",
            borderRadius: 12,
            padding: 14,
            border: "1px solid #2E7D67",
            textAlign: "center"
          },
          children: [/* @__PURE__ */ jsx("div", {
            style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#60A5FA"
            },
            children: responses.length
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              fontSize: 11,
              color: "#A7C7BC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4
            },
            children: [/* @__PURE__ */ jsx(Users, {
              size: 12
            }), " Responses"]
          })]
        })]
      }), /* @__PURE__ */ jsx("h2", {
        style: {
          fontSize: 26,
          fontWeight: "bold",
          margin: "0 0 12px",
          lineHeight: 1.3
        },
        children: alert.title
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          gap: 16,
          marginBottom: 20,
          fontSize: 13,
          color: "#A7C7BC",
          flexWrap: "wrap"
        },
        children: [alert.affected_area && /* @__PURE__ */ jsxs("span", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [/* @__PURE__ */ jsx(MapPin, {
            size: 14
          }), " ", alert.affected_area]
        }), alert.affected_radius_km && /* @__PURE__ */ jsxs("span", {
          children: ["↔ ", alert.affected_radius_km, "km radius"]
        }), /* @__PURE__ */ jsxs("span", {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 4
          },
          children: [/* @__PURE__ */ jsx(Calendar, {
            size: 14
          }), " ", new Date(alert.created_at).toLocaleString()]
        }), alert.creator && /* @__PURE__ */ jsxs("span", {
          children: ["by ", alert.creator.name]
        })]
      }), alert.latitude && alert.longitude && /* @__PURE__ */ jsx("div", {
        style: {
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #2E7D67",
          height: 280,
          marginBottom: 20
        },
        children: mapMounted && RL && /* @__PURE__ */ jsxs(RL.MapContainer, {
          center: [alert.latitude, alert.longitude],
          zoom: 9,
          style: {
            height: "100%",
            width: "100%"
          },
          children: [/* @__PURE__ */ jsx(RL.TileLayer, {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }), alert.affected_radius_km && /* @__PURE__ */ jsx(RL.Circle, {
            center: [alert.latitude, alert.longitude],
            radius: alert.affected_radius_km * 1e3,
            pathOptions: {
              color: sColor,
              fillColor: sColor,
              fillOpacity: 0.15,
              weight: 2
            }
          }), /* @__PURE__ */ jsx(RL.CircleMarker, {
            center: [alert.latitude, alert.longitude],
            radius: 10,
            pathOptions: {
              color: sColor,
              fillColor: sColor,
              fillOpacity: 0.8,
              weight: 2
            }
          })]
        })
      }), alert.image_url && /* @__PURE__ */ jsx("div", {
        style: {
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 20,
          border: "1px solid #2E7D67"
        },
        children: /* @__PURE__ */ jsx("img", {
          src: alert.image_url,
          alt: alert.title,
          style: {
            width: "100%",
            height: "auto",
            display: "block"
          }
        })
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(13, 77, 58, 0.4)",
          padding: 24,
          borderRadius: 16,
          border: "1px solid rgba(46, 125, 103, 0.5)",
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsx("h3", {
          style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#A7C7BC",
            marginTop: 0,
            marginBottom: 10
          },
          children: "Situation Report"
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#D1D5D8",
            lineHeight: 1.8,
            margin: 0,
            whiteSpace: "pre-wrap",
            fontSize: 15
          },
          children: alert.description
        })]
      }), alert.instructions && /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#EF4444",
            marginTop: 0,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6
          },
          children: [/* @__PURE__ */ jsx(Shield, {
            size: 16
          }), " Safety Instructions"]
        }), /* @__PURE__ */ jsx("p", {
          style: {
            color: "#FCA5A5",
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: "pre-wrap",
            fontSize: 14
          },
          children: alert.instructions
        })]
      }), isCreator && alert.status !== "resolved" && /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(0,0,0,0.2)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid #2E7D67",
          marginBottom: 20,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center"
        },
        children: [/* @__PURE__ */ jsx("span", {
          style: {
            fontSize: 13,
            color: "#A7C7BC",
            fontWeight: "bold",
            marginRight: 8
          },
          children: "Update Status:"
        }), [{
          status: "monitoring",
          label: "👁️ Monitoring",
          color: "#60A5FA"
        }, {
          status: "resolved",
          label: "✅ Resolved",
          color: "#4ADE80"
        }].filter((s) => s.status !== alert.status).map((s) => /* @__PURE__ */ jsx("button", {
          onClick: () => handleStatusUpdate(s.status),
          style: {
            background: `${s.color}15`,
            color: s.color,
            border: `1px solid ${s.color}33`,
            borderRadius: 10,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 12
          },
          children: s.label
        }, s.status))]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 20
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(Users, {
            size: 18
          }), " Coordination Feed (", responses.length, ")"]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            gap: 6,
            marginBottom: 12,
            overflowX: "auto",
            paddingBottom: 4
          },
          children: responseTypes.map((rt) => /* @__PURE__ */ jsxs("button", {
            type: "button",
            onClick: () => setResponseType(rt.value),
            style: {
              background: responseType === rt.value ? `${rt.color}22` : "rgba(255,255,255,0.05)",
              color: responseType === rt.value ? rt.color : "#A7C7BC",
              border: responseType === rt.value ? `1px solid ${rt.color}44` : "1px solid transparent",
              borderRadius: 20,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 4,
              whiteSpace: "nowrap"
            },
            children: [rt.icon, " ", rt.label]
          }, rt.value))
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleAddResponse,
          style: {
            display: "flex",
            gap: 10,
            marginBottom: 20
          },
          children: [/* @__PURE__ */ jsx("textarea", {
            value: newResponse,
            onChange: (e) => setNewResponse(e.target.value),
            placeholder: "Post a coordination update...",
            rows: 2,
            style: {
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #2E7D67",
              background: "rgba(0,0,0,0.2)",
              color: "white",
              fontSize: 14,
              resize: "vertical"
            }
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            disabled: submitting || !newResponse.trim(),
            style: {
              background: "#4ADE80",
              color: "#0B3D2E",
              border: "none",
              borderRadius: 12,
              padding: "0 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              opacity: submitting || !newResponse.trim() ? 0.5 : 1
            },
            children: /* @__PURE__ */ jsx(Send, {
              size: 18
            })
          })]
        }), responses.length === 0 ? /* @__PURE__ */ jsx("div", {
          style: {
            textAlign: "center",
            padding: 30,
            color: "#A7C7BC",
            fontSize: 13,
            fontStyle: "italic",
            background: "rgba(13,77,58,0.3)",
            borderRadius: 12
          },
          children: "No coordination responses yet. Be the first to respond!"
        }) : /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 10
          },
          children: responses.map((resp, i) => {
            const rt = responseTypes.find((r) => r.value === resp.response_type) || responseTypes[0];
            return /* @__PURE__ */ jsxs(motion.div, {
              initial: {
                opacity: 0,
                y: 10
              },
              animate: {
                opacity: 1,
                y: 0
              },
              transition: {
                delay: i * 0.03
              },
              style: {
                background: "rgba(13, 77, 58, 0.3)",
                borderRadius: 12,
                padding: 14,
                border: `1px solid ${rt.color}22`
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  },
                  children: [/* @__PURE__ */ jsxs("span", {
                    style: {
                      fontSize: 11,
                      background: `${rt.color}22`,
                      color: rt.color,
                      padding: "2px 8px",
                      borderRadius: 8,
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    },
                    children: [rt.icon, " ", rt.label]
                  }), /* @__PURE__ */ jsxs("div", {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    },
                    children: [resp.author?.avatar_url ? /* @__PURE__ */ jsx("img", {
                      src: resp.author.avatar_url,
                      style: {
                        width: 20,
                        height: 20,
                        borderRadius: "50%"
                      },
                      alt: ""
                    }) : /* @__PURE__ */ jsx("div", {
                      style: {
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#2E7D67"
                      }
                    }), /* @__PURE__ */ jsx("span", {
                      style: {
                        fontSize: 12,
                        fontWeight: "bold"
                      },
                      children: resp.author?.name || "Unknown"
                    })]
                  })]
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: 11,
                    color: "#A7C7BC"
                  },
                  children: new Date(resp.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                })]
              }), /* @__PURE__ */ jsx("p", {
                style: {
                  margin: 0,
                  fontSize: 14,
                  color: "#D1D5D8",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap"
                },
                children: resp.content
              })]
            }, resp.id);
          })
        })]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
                .leaflet-container { background: #0B3D2E; }
            `
    })]
  });
};
const CrisisDetails$1 = UNSAFE_withComponentProps(CrisisDetails);
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CrisisDetails$1
}, Symbol.toStringTag, { value: "Module" }));
const languages = {
  en: {
    label: "English",
    flag: "🇬🇧"
  },
  mg: {
    label: "Malagasy",
    flag: "🇲🇬"
  },
  fr: {
    label: "Français",
    flag: "🇫🇷"
  }
};
const activityTypes = [{
  value: "consultation",
  label: "Consultation",
  color: "#60A5FA"
}, {
  value: "inspection",
  label: "Inspection",
  color: "#FBBF24"
}, {
  value: "training",
  label: "Training",
  color: "#A78BFA"
}, {
  value: "audit",
  label: "Audit",
  color: "#EF4444"
}, {
  value: "other",
  label: "Other",
  color: "#A7C7BC"
}];
const Compliance = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const [form, setForm] = useState({
    activity_type: "consultation",
    description: "",
    flags: [],
    language: "en",
    location: ""
  });
  const [uiLang, setUiLang] = useState("en");
  useEffect(() => {
    fetchLogs();
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
          setForm((prev) => ({
            ...prev,
            description: prev.description + finalTranscript
          }));
        }
      };
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied");
        }
        setIsRecording(false);
      };
    } else {
      console.warn("Web Speech API not supported");
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = uiLang === "mg" ? "mg-MG" : uiLang === "fr" ? "fr-FR" : "en-US";
    }
    setForm((prev) => ({
      ...prev,
      language: uiLang
    }));
  }, [uiLang]);
  const fetchLogs = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from("compliance_logs").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    });
    if (error) {
      console.error("Error fetching logs:", error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info("Listening... Speak now");
      } catch (err) {
        console.error(err);
        setIsRecording(false);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) {
      toast.error("Description required");
      return;
    }
    try {
      const {
        error
      } = await supabase.from("compliance_logs").insert({
        user_id: user.id,
        activity_type: form.activity_type,
        details: {
          description: form.description,
          location: form.location,
          language: form.language,
          flags: form.flags
        }
      });
      if (error) throw error;
      toast.success("Activity logged successfully");
      setForm({
        ...form,
        description: "",
        flags: [],
        location: ""
      });
      setTranscript("");
      fetchLogs();
    } catch (error) {
      toast.error("Failed to save log");
      console.error(error);
    }
  };
  const toggleFlag = (flag) => {
    setForm((prev) => ({
      ...prev,
      flags: prev.flags.includes(flag) ? prev.flags.filter((f) => f !== flag) : [...prev.flags, flag]
    }));
  };
  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["Date", "Type", "Description", "Language", "Location", "Flags"];
    const csvContent = [headers.join(","), ...logs.map((log) => [new Date(log.created_at).toLocaleDateString(), log.activity_type, `"${(log.details?.description || "").replace(/"/g, '""')}"`, log.details?.language || "en", `"${(log.details?.location || "").replace(/"/g, '""')}"`, `"${(log.details?.flags || []).join("; ")}"`].join(","))].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `compliance_report_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const translations = {
    en: {
      title: "Compliance & Logging",
      subtitle: "Record activities, track violations, and generate reports.",
      logActivity: "Log Activity",
      voiceInput: "Voice Input",
      description: "Description / Notes",
      flags: "Flags / Issues",
      grantIssue: "Grant Issue",
      urgent: "Urgent",
      violation: "Violation",
      save: "Save Log",
      recentLogs: "Recent Logs",
      export: "Export Report",
      noLogs: "No logs found.",
      recording: "Recording..."
    },
    mg: {
      title: "Fanaraha-maso & Tatitra",
      subtitle: "Raketo ny asa, araho ny fandikan-dalàna, ary mamorona tatitra.",
      logActivity: "Raketo ny Asa",
      voiceInput: "Feo",
      description: "Fanazavana / Naoty",
      flags: "Olana / Fanamarihana",
      grantIssue: "Olana Famatsiam-bola",
      urgent: "Maika",
      violation: "Fandikan-dalàna",
      save: "Tehirizo",
      recentLogs: "Tatitra Farany",
      export: "Avoaka ny Tatitra",
      noLogs: "Tsy misy tatitra.",
      recording: "Mandraikitra..."
    },
    fr: {
      title: "Conformité & Rapports",
      subtitle: "Enregistrer les activités, suivre les violations et générer des rapports.",
      logActivity: "Enregistrer une Activité",
      voiceInput: "Entrée Vocale",
      description: "Description / Notes",
      flags: "Drapeaux / Problèmes",
      grantIssue: "Problème de Subvention",
      urgent: "Urgent",
      violation: "Violation",
      save: "Enregistrer",
      recentLogs: "Journaux Récents",
      export: "Exporter le Rapport",
      noLogs: "Aucun journal trouvé.",
      recording: "Enregistrement..."
    }
  };
  const t = translations[uiLang];
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      className: "compliance-header",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "header-left-group",
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/feed"),
          className: "back-btn",
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 24
          })
        }), /* @__PURE__ */ jsxs("h1", {
          className: "header-title",
          children: [/* @__PURE__ */ jsx(ClipboardList, {
            size: 20,
            style: {
              color: "#4ADE80",
              flexShrink: 0
            }
          }), /* @__PURE__ */ jsx("span", {
            children: t.title
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "lang-toggle",
        children: Object.entries(languages).map(([key, {
          flag
        }]) => /* @__PURE__ */ jsx("button", {
          onClick: () => setUiLang(key),
          className: `lang-btn ${uiLang === key ? "active" : ""}`,
          title: translations[key].title,
          children: flag
        }, key))
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20
      },
      children: [/* @__PURE__ */ jsx("p", {
        style: {
          color: "#A7C7BC",
          fontSize: 14,
          marginBottom: 24,
          padding: "0 4px"
        },
        children: t.subtitle
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(13, 77, 58, 0.4)",
          borderRadius: 16,
          padding: 20,
          border: "1px solid #2E7D67",
          marginBottom: 30
        },
        children: [/* @__PURE__ */ jsxs("h2", {
          style: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#4ADE80"
          },
          children: [/* @__PURE__ */ jsx(FileText, {
            size: 18
          }), " ", t.logActivity]
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleSubmit,
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 16
          },
          children: [/* @__PURE__ */ jsxs("div", {
            className: "compliance-grid",
            style: {
              display: "grid",
              gap: 12
            },
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                style: {
                  display: "block",
                  marginBottom: 6,
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#A7C7BC"
                },
                children: "Type"
              }), /* @__PURE__ */ jsx("select", {
                value: form.activity_type,
                onChange: (e) => setForm({
                  ...form,
                  activity_type: e.target.value
                }),
                style: {
                  width: "100%",
                  padding: "10px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid #2E7D67",
                  color: "white",
                  boxSizing: "border-box"
                },
                children: activityTypes.map((type) => /* @__PURE__ */ jsx("option", {
                  value: type.value,
                  children: type.label
                }, type.value))
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                style: {
                  display: "block",
                  marginBottom: 6,
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#A7C7BC"
                },
                children: "Location"
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  position: "relative"
                },
                children: [/* @__PURE__ */ jsx(MapPin, {
                  size: 16,
                  style: {
                    position: "absolute",
                    left: 10,
                    top: 12,
                    color: "#A7C7BC"
                  }
                }), /* @__PURE__ */ jsx("input", {
                  type: "text",
                  value: form.location,
                  onChange: (e) => setForm({
                    ...form,
                    location: e.target.value
                  }),
                  placeholder: "Site, Village...",
                  style: {
                    width: "100%",
                    padding: "10px 10px 10px 34px",
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid #2E7D67",
                    color: "white",
                    boxSizing: "border-box"
                  }
                })]
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("label", {
              style: {
                marginBottom: 6,
                fontSize: 12,
                fontWeight: "bold",
                color: "#A7C7BC",
                display: "flex",
                justifyContent: "space-between"
              },
              children: [/* @__PURE__ */ jsx("span", {
                children: t.description
              }), isRecording && /* @__PURE__ */ jsxs("span", {
                style: {
                  color: "#EF4444",
                  animation: "pulse 1.5s infinite"
                },
                children: ["🔴 ", t.recording]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative"
              },
              children: [/* @__PURE__ */ jsx("textarea", {
                value: form.description,
                onChange: (e) => setForm({
                  ...form,
                  description: e.target.value
                }),
                style: {
                  width: "100%",
                  minHeight: 120,
                  padding: 12,
                  paddingRight: 50,
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.2)",
                  border: isRecording ? "1px solid #EF4444" : "1px solid #2E7D67",
                  color: "white",
                  resize: "vertical",
                  lineHeight: 1.6,
                  boxSizing: "border-box"
                },
                placeholder: isRecording ? "Listening..." : "Type or record details..."
              }), /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: toggleRecording,
                style: {
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  background: "transparent",
                  color: isRecording ? "#EF4444" : "#4ADE80",
                  border: "none",
                  padding: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  transform: isRecording ? "scale(1.1)" : "scale(1)"
                },
                title: t.voiceInput,
                children: isRecording ? /* @__PURE__ */ jsx(Square, {
                  size: 20,
                  fill: "currentColor"
                }) : /* @__PURE__ */ jsx(Mic, {
                  size: 24
                })
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: "bold",
                color: "#A7C7BC"
              },
              children: t.flags
            }), /* @__PURE__ */ jsx("div", {
              style: {
                display: "flex",
                gap: 8,
                flexWrap: "wrap"
              },
              children: [{
                id: "grant_issue",
                label: t.grantIssue,
                color: "#FBBF24"
              }, {
                id: "urgent",
                label: t.urgent,
                color: "#EF4444"
              }, {
                id: "violation",
                label: t.violation,
                color: "#F472B6"
              }].map((flag) => {
                const active = form.flags.includes(flag.id);
                return /* @__PURE__ */ jsxs("button", {
                  type: "button",
                  onClick: () => toggleFlag(flag.id),
                  style: {
                    background: active ? flag.color : "rgba(255,255,255,0.05)",
                    color: active ? "#0B3D2E" : "#A7C7BC",
                    border: `1px solid ${active ? flag.color : "#2E7D67"}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s"
                  },
                  children: [active ? /* @__PURE__ */ jsx(CheckCircle2, {
                    size: 14
                  }) : /* @__PURE__ */ jsx(Flag, {
                    size: 14
                  }), flag.label]
                }, flag.id);
              })
            })]
          }), /* @__PURE__ */ jsxs("button", {
            type: "submit",
            style: {
              background: "#4ADE80",
              color: "#0B3D2E",
              border: "none",
              borderRadius: 12,
              padding: 14,
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 8
            },
            children: [/* @__PURE__ */ jsx(FileText, {
              size: 18
            }), " ", t.save]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16
        },
        children: [/* @__PURE__ */ jsxs("h2", {
          style: {
            fontSize: 18,
            fontWeight: "bold",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(Calendar, {
            size: 20
          }), " ", t.recentLogs]
        }), logs.length > 0 && /* @__PURE__ */ jsxs("button", {
          onClick: exportCSV,
          style: {
            background: "rgba(255,255,255,0.1)",
            color: "#A7C7BC",
            border: "1px solid #2E7D67",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6
          },
          children: [/* @__PURE__ */ jsx(Download, {
            size: 14
          }), " ", t.export]
        })]
      }), loading ? /* @__PURE__ */ jsx("div", {
        style: {
          textAlign: "center",
          padding: 40,
          color: "#A7C7BC"
        },
        children: "Loading logs..."
      }) : logs.length === 0 ? /* @__PURE__ */ jsx("div", {
        style: {
          textAlign: "center",
          padding: 40,
          background: "rgba(0,0,0,0.1)",
          borderRadius: 16,
          color: "#A7C7BC",
          fontStyle: "italic"
        },
        children: t.noLogs
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 12
        },
        children: logs.map((log) => {
          const typeCfg = activityTypes.find((t2) => t2.value === log.activity_type) || activityTypes[4];
          return /* @__PURE__ */ jsxs("div", {
            style: {
              background: "rgba(13, 77, 58, 0.2)",
              borderRadius: 12,
              padding: 16,
              borderLeft: `4px solid ${typeCfg.color}`
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  alignItems: "center"
                },
                children: [/* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: 12,
                    fontWeight: "bold",
                    color: typeCfg.color,
                    background: `${typeCfg.color}22`,
                    padding: "2px 8px",
                    borderRadius: 4
                  },
                  children: typeCfg.label
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: 12,
                    color: "#A7C7BC"
                  },
                  children: new Date(log.created_at).toLocaleDateString()
                })]
              }), log.details?.flags && log.details.flags.length > 0 && /* @__PURE__ */ jsx("div", {
                style: {
                  display: "flex",
                  gap: 4
                },
                children: log.details.flags.map((f) => /* @__PURE__ */ jsx(Flag, {
                  size: 14,
                  color: "#EF4444",
                  fill: f === "urgent" ? "#EF4444" : "none"
                }, f))
              })]
            }), /* @__PURE__ */ jsx("p", {
              style: {
                margin: "0 0 8px",
                fontSize: 14,
                lineHeight: 1.5,
                color: "#D1D5D8"
              },
              children: log.details?.description
            }), log.details?.location && /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#A7C7BC"
              },
              children: [/* @__PURE__ */ jsx(MapPin, {
                size: 12
              }), " ", log.details.location]
            })]
          }, log.id);
        })
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .compliance-grid { grid-template-columns: 1fr; }
                @media (min-width: 640px) { .compliance-grid { grid-template-columns: 1fr 1fr; } }

                .compliance-header {
                    position: sticky; top: 0; z-index: 1000;
                    background: rgba(11, 61, 46, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 16px 20px;
                    border-bottom: 1px solid #2E7D67;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 12px;
                }
                .header-left-group { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
                .back-btn { background: transparent; border: none; color: #A7C7BC; cursor: pointer; padding: 0; display: flex; align-items: center; flex-shrink: 0; }
                .header-title { font-size: 18px; font-weight: bold; margin: 0; display: flex; align-items: center; gap: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #F2F1EE; }
                .lang-toggle { display: flex; gap: 4px; flex-shrink: 0; }
                .lang-btn {
                    background: transparent; border: 1px solid transparent; border-radius: 8px;
                    padding: 4px 8px; cursor: pointer; font-size: 16px; opacity: 0.5;
                    transition: all 0.2s;
                }
                .lang-btn.active { background: rgba(255,255,255,0.2); opacity: 1; }

                @media (max-width: 480px) {
                    .compliance-header { padding: 12px 14px; gap: 8px; }
                    .header-left-group { gap: 8px; }
                    .header-title { font-size: 15px; gap: 6px; }
                    .back-btn svg { width: 22px; height: 22px; }
                    .lang-btn { padding: 4px 6px; font-size: 14px; }
                }
            `
    })]
  });
};
const Compliance$1 = UNSAFE_withComponentProps(Compliance);
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Compliance$1
}, Symbol.toStringTag, { value: "Module" }));
const Messages = () => {
  const {
    userId
  } = useParams();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  useEffect(() => {
    fetchConversations();
    const sub = supabase.channel("global-messages").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `receiver_id=eq.${user.id}`
    }, (payload) => {
      fetchConversations();
      if (userId && payload.new.sender_id === userId) {
        setMessages((prev) => [...prev, payload.new]);
      }
    }).subscribe();
    return () => supabase.removeChannel(sub);
  }, [user.id]);
  useEffect(() => {
    if (userId) {
      loadChat(userId);
    } else {
      setActiveUser(null);
      setMessages([]);
    }
  }, [userId]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const fetchConversations = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("messages").select(`
                    *,
                    sender:sender_id(id, name, avatar_url),
                    receiver:receiver_id(id, name, avatar_url)
                `).or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      const convMap = /* @__PURE__ */ new Map();
      data.forEach((msg) => {
        const other = msg.sender_id === user.id ? msg.receiver : msg.sender;
        if (!convMap.has(other.id)) {
          convMap.set(other.id, {
            user: other,
            lastMessage: msg,
            hasUnread: msg.receiver_id === user.id && !msg.read_at
          });
        }
      });
      setConversations(Array.from(convMap.values()));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };
  const loadChat = async (targetId) => {
    if (!activeUser || activeUser.id !== targetId) {
      const {
        data: userData
      } = await supabase.from("users").select("*").eq("id", targetId).single();
      setActiveUser(userData);
    }
    const {
      data,
      error
    } = await supabase.from("messages").select("*").or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${user.id})`).order("created_at", {
      ascending: true
    });
    if (!error) setMessages(data);
    await supabase.from("messages").update({
      read_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("sender_id", targetId).eq("receiver_id", user.id).is("read_at", null);
    fetchConversations();
  };
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;
    setSending(true);
    try {
      const {
        data,
        error
      } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: userId,
        content: newMessage.trim()
      }).select().single();
      if (error) throw error;
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };
  const listStyle = {
    display: "flex",
    flexDirection: "column",
    background: "rgba(11, 61, 46, 0.95)",
    borderRight: "1px solid #2E7D67",
    height: "100%"
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      height: "100vh",
      display: "flex",
      background: "#0B3D2E",
      color: "#F2F1EE",
      overflow: "hidden"
    },
    children: [/* @__PURE__ */ jsxs("div", {
      className: `sidebar-container ${userId ? "hidden-mobile" : ""}`,
      style: listStyle,
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          padding: 16,
          borderBottom: "1px solid #2E7D67",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        },
        children: [/* @__PURE__ */ jsx("h1", {
          style: {
            fontSize: 20,
            fontWeight: "bold",
            margin: 0
          },
          children: "Messages"
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/feed"),
          style: {
            background: "none",
            border: "none",
            color: "#A7C7BC",
            cursor: "pointer"
          },
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 20
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        style: {
          padding: 12
        },
        children: /* @__PURE__ */ jsxs("div", {
          style: {
            position: "relative"
          },
          children: [/* @__PURE__ */ jsx(Search, {
            size: 16,
            style: {
              position: "absolute",
              left: 12,
              top: 12,
              color: "#A7C7BC"
            }
          }), /* @__PURE__ */ jsx("input", {
            placeholder: "Search conversations...",
            style: {
              width: "100%",
              padding: "10px 10px 10px 36px",
              borderRadius: 20,
              border: "none",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              boxSizing: "border-box",
              outline: "none"
            }
          })]
        })
      }), /* @__PURE__ */ jsx("div", {
        style: {
          flex: 1,
          overflowY: "auto"
        },
        children: loading ? /* @__PURE__ */ jsx("div", {
          style: {
            padding: 20,
            textAlign: "center"
          },
          children: /* @__PURE__ */ jsx(Loader2, {
            className: "animate-spin"
          })
        }) : conversations.length === 0 ? /* @__PURE__ */ jsxs("div", {
          style: {
            padding: 40,
            textAlign: "center",
            color: "#A7C7BC"
          },
          children: [/* @__PURE__ */ jsx(MessageSquare, {
            size: 48,
            style: {
              opacity: 0.3,
              marginBottom: 10
            }
          }), /* @__PURE__ */ jsx("p", {
            children: "No messages yet."
          })]
        }) : conversations.map((c) => /* @__PURE__ */ jsxs("div", {
          onClick: () => navigate(`/messages/${c.user.id}`),
          style: {
            padding: 16,
            display: "flex",
            gap: 12,
            cursor: "pointer",
            background: userId === c.user.id ? "rgba(74, 222, 128, 0.1)" : "transparent",
            borderLeft: userId === c.user.id ? "3px solid #4ADE80" : "3px solid transparent"
          },
          children: [c.user.avatar_url ? /* @__PURE__ */ jsx("img", {
            src: c.user.avatar_url,
            style: {
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover"
            }
          }) : /* @__PURE__ */ jsx("div", {
            style: {
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#2E7D67",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsx(User, {
              color: "#A7C7BC"
            })
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              flex: 1,
              minWidth: 0
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4
              },
              children: [/* @__PURE__ */ jsx("span", {
                style: {
                  fontWeight: "bold",
                  color: c.hasUnread ? "white" : "#F2F1EE"
                },
                children: c.user.name
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 11,
                  color: "#A7C7BC"
                },
                children: new Date(c.lastMessage.created_at).toLocaleDateString()
              })]
            }), /* @__PURE__ */ jsxs("p", {
              style: {
                margin: 0,
                fontSize: 13,
                color: c.hasUnread ? "#4ADE80" : "#A7C7BC",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: c.hasUnread ? "bold" : "normal"
              },
              children: [c.lastMessage.sender_id === user.id ? "You: " : "", c.lastMessage.content]
            })]
          })]
        }, c.user.id))
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: `chat-container ${!userId ? "hidden-mobile" : ""}`,
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0B3D2E"
      },
      children: userId ? /* @__PURE__ */ jsxs(Fragment, {
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            padding: "10px 16px",
            borderBottom: "1px solid #2E7D67",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(11, 61, 46, 0.95)"
          },
          children: [/* @__PURE__ */ jsx("button", {
            onClick: () => navigate("/messages"),
            className: "mobile-only",
            style: {
              background: "none",
              border: "none",
              color: "#A7C7BC",
              cursor: "pointer",
              marginRight: 4,
              display: "flex"
            },
            children: /* @__PURE__ */ jsx(ArrowLeft, {
              size: 20
            })
          }), activeUser && /* @__PURE__ */ jsxs(Fragment, {
            children: [activeUser.avatar_url ? /* @__PURE__ */ jsx("img", {
              src: activeUser.avatar_url,
              style: {
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover"
              }
            }) : /* @__PURE__ */ jsx("div", {
              style: {
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#2E7D67",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ jsx(User, {
                size: 18,
                color: "#A7C7BC"
              })
            }), /* @__PURE__ */ jsx("div", {
              children: /* @__PURE__ */ jsx("div", {
                style: {
                  fontWeight: "bold"
                },
                children: activeUser.name
              })
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            flex: 1,
            overflowY: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12
          },
          ref: scrollRef,
          children: messages.map((msg) => {
            const isMe = msg.sender_id === user.id;
            return /* @__PURE__ */ jsxs("div", {
              style: {
                alignSelf: isMe ? "flex-end" : "flex-start",
                maxWidth: "75%"
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  background: isMe ? "#4ADE80" : "rgba(255,255,255,0.1)",
                  color: isMe ? "#0B3D2E" : "#F2F1EE",
                  padding: "10px 14px",
                  borderRadius: 16,
                  borderBottomRightRadius: isMe ? 4 : 16,
                  borderTopLeftRadius: isMe ? 16 : 4
                },
                children: msg.content
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  fontSize: 10,
                  color: "#A7C7BC",
                  marginTop: 4,
                  textAlign: isMe ? "right" : "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  gap: 4
                },
                children: [new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                }), isMe && (msg.read_at ? /* @__PURE__ */ jsx(CheckCheck, {
                  size: 12,
                  color: "#4ADE80"
                }) : /* @__PURE__ */ jsx(Check, {
                  size: 12
                }))]
              })]
            }, msg.id);
          })
        }), /* @__PURE__ */ jsx("div", {
          style: {
            padding: 16,
            borderTop: "1px solid #2E7D67",
            background: "rgba(11, 61, 46, 0.95)"
          },
          children: /* @__PURE__ */ jsxs("form", {
            onSubmit: handleSend,
            style: {
              display: "flex",
              gap: 10
            },
            children: [/* @__PURE__ */ jsx("input", {
              value: newMessage,
              onChange: (e) => setNewMessage(e.target.value),
              placeholder: "Type a message...",
              style: {
                flex: 1,
                padding: "12px 16px",
                borderRadius: 24,
                border: "none",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                outline: "none"
              }
            }), /* @__PURE__ */ jsx("button", {
              type: "submit",
              disabled: sending || !newMessage.trim(),
              style: {
                background: "transparent",
                border: "none",
                padding: 8,
                cursor: !newMessage.trim() || sending ? "not-allowed" : "pointer",
                opacity: sending || !newMessage.trim() ? 0.5 : 1
              },
              children: sending ? /* @__PURE__ */ jsx(Loader2, {
                className: "animate-spin",
                size: 24,
                color: "#4ADE80"
              }) : /* @__PURE__ */ jsx(Send, {
                size: 28,
                color: "#4ADE80"
              })
            })]
          })
        })]
      }) : /* @__PURE__ */ jsxs("div", {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#A7C7BC"
        },
        children: [/* @__PURE__ */ jsx(MessageSquare, {
          size: 64,
          style: {
            opacity: 0.2,
            marginBottom: 20
          }
        }), /* @__PURE__ */ jsx("p", {
          style: {
            fontSize: 18
          },
          children: "Select a conversation to start chatting"
        })]
      })
    }), /* @__PURE__ */ jsx("style", {
      children: `
                /* Default (Mobile First approach naturally, but here we style for basic shared styles) */
                .sidebar-container {
                    width: 100%;
                    flex: 1;
                }
                .chat-container {
                    /* Default hidden on mobile if sidebar is active (handled by hidden-mobile on sidebar logic actually) */
                    /* But if chat is active, we hide sidebar.
                       So by default if chat active, chat is flex 1. 
                    */
                }

                @media (max-width: 768px) {
                    .hidden-mobile {
                        display: none !important;
                    }
                    .mobile-only {
                        display: flex;
                    }
                }

                @media (min-width: 768px) {
                    .sidebar-container {
                        width: 350px !important;
                        min-width: 350px;
                        flex: none !important;
                        display: flex !important;
                        border-right: 1px solid #2E7D67;
                    }
                    .chat-container {
                        display: flex !important;
                        flex: 1;
                    }
                    /* Override hidden-mobile on desktop so both are visible */
                    .hidden-mobile {
                        display: flex !important;
                    }
                    .mobile-only {
                        display: none !important;
                    }
                }
            `
    })]
  });
};
const Messages$1 = UNSAFE_withComponentProps(Messages);
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Messages$1
}, Symbol.toStringTag, { value: "Module" }));
const Events = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    is_virtual: false
  });
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("events").select(`
                    *,
                    organizer:organizer_id(name, avatar_url),
                    participants:event_participants(user_id, status)
                `).order("start_time", {
        ascending: true
      });
      if (error) throw error;
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const {
        error
      } = await supabase.from("events").insert({
        organizer_id: user.id,
        ...formData
      });
      if (error) throw error;
      toast.success("Event created!");
      setShowCreate(false);
      setFormData({
        title: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
        is_virtual: false
      });
      fetchEvents();
    } catch {
      toast.error("Failed to create event");
    } finally {
      setCreating(false);
    }
  };
  const handleJoin = async (eventId, currentStatus) => {
    const newStatus = currentStatus === "going" ? "not_going" : "going";
    try {
      if (currentStatus) {
        if (newStatus === "not_going") {
          await supabase.from("event_participants").delete().eq("event_id", eventId).eq("user_id", user.id);
        } else {
          await supabase.from("event_participants").update({
            status: newStatus
          }).eq("event_id", eventId).eq("user_id", user.id);
        }
      } else {
        await supabase.from("event_participants").insert({
          event_id: eventId,
          user_id: user.id,
          status: "going"
        });
      }
      fetchEvents();
      toast.success(newStatus === "going" ? "You are going!" : "Removed from event");
    } catch {
      toast.error("Failed to update status");
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 1e3,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12
        },
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/feed"),
          style: {
            background: "transparent",
            border: "none",
            color: "#A7C7BC",
            cursor: "pointer"
          },
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 24
          })
        }), /* @__PURE__ */ jsxs("h1", {
          style: {
            fontSize: 20,
            fontWeight: "bold",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(Calendar, {
            size: 20,
            style: {
              color: "#FBBF24"
            }
          }), " Events"]
        })]
      }), /* @__PURE__ */ jsxs("button", {
        onClick: () => setShowCreate(true),
        style: {
          background: "#4ADE80",
          color: "#0B3D2E",
          border: "none",
          borderRadius: 20,
          padding: "8px 16px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer"
        },
        children: [/* @__PURE__ */ jsx(Plus, {
          size: 18
        }), " Create"]
      })]
    }), /* @__PURE__ */ jsx("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20
      },
      children: loading ? /* @__PURE__ */ jsx("div", {
        style: {
          padding: 40,
          textAlign: "center"
        },
        children: /* @__PURE__ */ jsx(Loader2, {
          className: "animate-spin"
        })
      }) : events.length === 0 ? /* @__PURE__ */ jsxs("div", {
        style: {
          textAlign: "center",
          padding: 60,
          color: "#A7C7BC"
        },
        children: [/* @__PURE__ */ jsx(Calendar, {
          size: 48,
          style: {
            opacity: 0.3,
            marginBottom: 16
          }
        }), /* @__PURE__ */ jsx("p", {
          children: "No upcoming events."
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => setShowCreate(true),
          style: {
            color: "#4ADE80",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginTop: 8
          },
          children: "Create the first one!"
        })]
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "grid",
          gap: 20
        },
        children: events.map((event) => {
          const isGoing = event.participants.some((p) => p.user_id === user.id && p.status === "going");
          const participantCount = event.participants.filter((p) => p.status === "going").length;
          const isOrganizer = event.organizer_id === user.id;
          return /* @__PURE__ */ jsxs("div", {
            style: {
              background: "rgba(13, 77, 58, 0.4)",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #2E7D67"
            },
            children: [event.image_url && /* @__PURE__ */ jsx("div", {
              style: {
                height: 160,
                overflow: "hidden"
              },
              children: /* @__PURE__ */ jsx("img", {
                src: event.image_url,
                alt: "",
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }
              })
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                padding: 20
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12
                },
                children: [/* @__PURE__ */ jsx("div", {
                  style: {
                    fontSize: 12,
                    color: "#FBBF24",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: 0.5
                  },
                  children: new Date(event.start_time).toLocaleDateString(void 0, {
                    month: "long",
                    day: "numeric",
                    weekday: "short"
                  })
                }), isOrganizer && /* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: 10,
                    background: "rgba(255,255,255,0.1)",
                    padding: "2px 8px",
                    borderRadius: 10
                  },
                  children: "Host"
                })]
              }), /* @__PURE__ */ jsx("h3", {
                style: {
                  fontSize: 20,
                  fontWeight: "bold",
                  margin: "0 0 8px 0"
                },
                children: event.title
              }), /* @__PURE__ */ jsx("p", {
                style: {
                  color: "#A7C7BC",
                  fontSize: 14,
                  lineHeight: 1.5,
                  margin: "0 0 16px 0"
                },
                children: event.description
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 20
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#D1D5D8"
                  },
                  children: [/* @__PURE__ */ jsx(Clock, {
                    size: 16,
                    color: "#4ADE80"
                  }), new Date(event.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  }), event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}`]
                }), event.location && /* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#D1D5D8"
                  },
                  children: [/* @__PURE__ */ jsx(MapPin, {
                    size: 16,
                    color: "#F97316"
                  }), event.location]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.1)"
                },
                children: [/* @__PURE__ */ jsxs("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  },
                  children: [/* @__PURE__ */ jsx("div", {
                    style: {
                      display: "flex",
                      marginRight: 4
                    },
                    children: participantCount > 0 && /* @__PURE__ */ jsx("div", {
                      style: {
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "#4ADE80",
                        color: "#0B3D2E",
                        fontSize: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold"
                      },
                      children: participantCount
                    })
                  }), /* @__PURE__ */ jsxs("span", {
                    style: {
                      fontSize: 12,
                      color: "#A7C7BC"
                    },
                    children: [participantCount, " ", participantCount === 1 ? "Going" : "Going"]
                  })]
                }), /* @__PURE__ */ jsxs("button", {
                  onClick: () => handleJoin(event.id, isGoing ? "going" : null),
                  style: {
                    background: isGoing ? "none" : "#FBBF24",
                    color: isGoing ? "#FBBF24" : "#0B3D2E",
                    border: isGoing ? "1px solid #FBBF24" : "none",
                    borderRadius: 20,
                    padding: "8px 20px",
                    fontWeight: "bold",
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  },
                  children: [isGoing ? /* @__PURE__ */ jsx(CheckCircle2, {
                    size: 16
                  }) : /* @__PURE__ */ jsx(Ticket, {
                    size: 16
                  }), isGoing ? "Going" : "Join"]
                })]
              })]
            })]
          }, event.id);
        })
      })
    }), showCreate && /* @__PURE__ */ jsx("div", {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 2e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      },
      children: /* @__PURE__ */ jsxs("div", {
        style: {
          background: "#0B3D2E",
          borderRadius: 20,
          width: "100%",
          maxWidth: 500,
          border: "1px solid #2E7D67",
          maxHeight: "90vh",
          overflowY: "auto"
        },
        children: [/* @__PURE__ */ jsxs("div", {
          style: {
            padding: 20,
            borderBottom: "1px solid #2E7D67",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          children: [/* @__PURE__ */ jsx("h2", {
            style: {
              fontSize: 18,
              fontWeight: "bold",
              margin: 0
            },
            children: "Create Event"
          }), /* @__PURE__ */ jsx("button", {
            onClick: () => setShowCreate(false),
            style: {
              background: "none",
              border: "none",
              color: "#A7C7BC",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ jsx(X, {
              size: 24
            })
          })]
        }), /* @__PURE__ */ jsxs("form", {
          onSubmit: handleCreate,
          style: {
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16
          },
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 4
              },
              children: "Title"
            }), /* @__PURE__ */ jsx("input", {
              required: true,
              value: formData.title,
              onChange: (e) => setFormData({
                ...formData,
                title: e.target.value
              }),
              style: {
                width: "100%",
                padding: 12,
                borderRadius: 12,
                background: "rgba(0,0,0,0.2)",
                border: "1px solid #2E7D67",
                color: "white",
                boxSizing: "border-box"
              }
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 4
              },
              children: "Description"
            }), /* @__PURE__ */ jsx("textarea", {
              required: true,
              value: formData.description,
              onChange: (e) => setFormData({
                ...formData,
                description: e.target.value
              }),
              rows: 3,
              style: {
                width: "100%",
                padding: 12,
                borderRadius: 12,
                background: "rgba(0,0,0,0.2)",
                border: "1px solid #2E7D67",
                color: "white",
                boxSizing: "border-box"
              }
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12
            },
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                style: {
                  display: "block",
                  fontSize: 12,
                  fontWeight: "bold",
                  marginBottom: 4
                },
                children: "Start"
              }), /* @__PURE__ */ jsx("input", {
                type: "datetime-local",
                required: true,
                value: formData.start_time,
                onChange: (e) => setFormData({
                  ...formData,
                  start_time: e.target.value
                }),
                style: {
                  width: "100%",
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid #2E7D67",
                  color: "white",
                  boxSizing: "border-box"
                }
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                style: {
                  display: "block",
                  fontSize: 12,
                  fontWeight: "bold",
                  marginBottom: 4
                },
                children: "End"
              }), /* @__PURE__ */ jsx("input", {
                type: "datetime-local",
                value: formData.end_time,
                onChange: (e) => setFormData({
                  ...formData,
                  end_time: e.target.value
                }),
                style: {
                  width: "100%",
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid #2E7D67",
                  color: "white",
                  boxSizing: "border-box"
                }
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              style: {
                display: "block",
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 4
              },
              children: "Location"
            }), /* @__PURE__ */ jsx("input", {
              value: formData.location,
              onChange: (e) => setFormData({
                ...formData,
                location: e.target.value
              }),
              placeholder: "e.g. Community Center or Online",
              style: {
                width: "100%",
                padding: 12,
                borderRadius: 12,
                background: "rgba(0,0,0,0.2)",
                border: "1px solid #2E7D67",
                color: "white",
                boxSizing: "border-box"
              }
            })]
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            disabled: creating,
            style: {
              background: "#4ADE80",
              color: "#0B3D2E",
              padding: 16,
              borderRadius: 12,
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              marginTop: 10,
              display: "flex",
              justifyContent: "center"
            },
            children: creating ? /* @__PURE__ */ jsx(Loader2, {
              className: "animate-spin"
            }) : "Create Event"
          })]
        })]
      })
    })]
  });
};
const Events$1 = UNSAFE_withComponentProps(Events);
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Events$1
}, Symbol.toStringTag, { value: "Module" }));
const Analytics = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    personal: {
      salesVolume: 0,
      salesCount: 0,
      resourcesViews: 0,
      grievancesResolved: 0
    },
    platform: {
      totalUsers: 0,
      totalVolume: 0,
      activeAlerts: 0,
      resolvedGrievances: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("personal");
  useEffect(() => {
    fetchAnalytics();
  }, [user.id]);
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const {
        data: sales
      } = await supabase.from("transactions").select("amount").eq("seller_id", user.id);
      const salesVolume = sales?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      const {
        data: resources2
      } = await supabase.from("resources").select("view_count").eq("user_id", user.id);
      const resourcesViews = resources2?.reduce((sum, r) => sum + (r.view_count || 0), 0) || 0;
      const {
        count: grievancesResolved
      } = await supabase.from("grievances").select("id", {
        count: "exact",
        head: true
      }).eq("reporter_id", user.id).eq("status", "resolved");
      const {
        count: totalUsers
      } = await supabase.from("users").select("id", {
        count: "exact",
        head: true
      });
      const {
        data: allSales
      } = await supabase.from("transactions").select("amount").limit(1e3);
      const totalVolume = allSales?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      const {
        count: activeAlerts
      } = await supabase.from("crisis_alerts").select("id", {
        count: "exact",
        head: true
      }).eq("status", "active");
      const {
        count: totalResolved
      } = await supabase.from("grievances").select("id", {
        count: "exact",
        head: true
      }).eq("status", "resolved");
      setStats({
        personal: {
          salesVolume,
          salesCount: sales?.length || 0,
          resourcesViews,
          grievancesResolved: grievancesResolved || 0
        },
        platform: {
          totalUsers: totalUsers || 0,
          totalVolume,
          activeAlerts: activeAlerts || 0,
          resolvedGrievances: totalResolved || 0
        }
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("mg-MG", {
      style: "currency",
      currency: "MGA",
      maximumFractionDigits: 0
    }).format(val);
  };
  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle
  }) => /* @__PURE__ */ jsxs("div", {
    style: {
      background: "rgba(13, 77, 58, 0.4)",
      borderRadius: 16,
      padding: 20,
      border: "1px solid #2E7D67",
      display: "flex",
      flexDirection: "column",
      gap: 8
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      },
      children: [/* @__PURE__ */ jsx("span", {
        style: {
          color: "#A7C7BC",
          fontSize: 13,
          fontWeight: "bold",
          textTransform: "uppercase"
        },
        children: title
      }), /* @__PURE__ */ jsx("div", {
        style: {
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `${color}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color
        },
        children: icon
      })]
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("div", {
        style: {
          fontSize: 24,
          fontWeight: "bold",
          color: "white"
        },
        children: value
      }), subtitle && /* @__PURE__ */ jsx("div", {
        style: {
          fontSize: 12,
          color: "#A7C7BC",
          marginTop: 4
        },
        children: subtitle
      })]
    })]
  });
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 1e3,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        gap: 12
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => navigate(-1),
        style: {
          background: "transparent",
          border: "none",
          color: "#A7C7BC",
          cursor: "pointer"
        },
        children: /* @__PURE__ */ jsx(ArrowLeft, {
          size: 24
        })
      }), /* @__PURE__ */ jsxs("h1", {
        style: {
          fontSize: 20,
          fontWeight: "bold",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 8
        },
        children: [/* @__PURE__ */ jsx(TrendingUp, {
          size: 20,
          style: {
            color: "#4ADE80"
          }
        }), "Analytics Dashboard"]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          background: "rgba(0,0,0,0.2)",
          padding: 4,
          borderRadius: 12,
          marginBottom: 24
        },
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => setTab("personal"),
          style: {
            flex: 1,
            padding: "10px",
            borderRadius: 10,
            background: tab === "personal" ? "#2E7D67" : "transparent",
            color: tab === "personal" ? "white" : "#A7C7BC",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          },
          children: "My Impact"
        }), /* @__PURE__ */ jsx("button", {
          onClick: () => setTab("platform"),
          style: {
            flex: 1,
            padding: "10px",
            borderRadius: 10,
            background: tab === "platform" ? "#2E7D67" : "transparent",
            color: tab === "platform" ? "white" : "#A7C7BC",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          },
          children: "Community Pulse"
        })]
      }), loading ? /* @__PURE__ */ jsx("div", {
        style: {
          textAlign: "center",
          padding: 40,
          color: "#A7C7BC"
        },
        children: "Loading specific data..."
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16
        },
        children: tab === "personal" ? /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx(StatCard, {
            title: "Total Sales",
            value: formatCurrency(stats.personal.salesVolume),
            icon: /* @__PURE__ */ jsx(DollarSign, {
              size: 18
            }),
            color: "#4ADE80",
            subtitle: `${stats.personal.salesCount} transactions`
          }), /* @__PURE__ */ jsx(StatCard, {
            title: "Knowledge Shared",
            value: stats.personal.resourcesViews,
            icon: /* @__PURE__ */ jsx(FileText, {
              size: 18
            }),
            color: "#60A5FA",
            subtitle: "Total views on resources"
          }), /* @__PURE__ */ jsx(StatCard, {
            title: "Issues Resolved",
            value: stats.personal.grievancesResolved,
            icon: /* @__PURE__ */ jsx(CheckCircle, {
              size: 18
            }),
            color: "#FBBF24",
            subtitle: "Grievances closed"
          })]
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx(StatCard, {
            title: "Community Size",
            value: stats.platform.totalUsers,
            icon: /* @__PURE__ */ jsx(Users, {
              size: 18
            }),
            color: "#A78BFA",
            subtitle: "Registered members"
          }), /* @__PURE__ */ jsx(StatCard, {
            title: "Economic Velocity",
            value: formatCurrency(stats.platform.totalVolume),
            icon: /* @__PURE__ */ jsx(BarChart3, {
              size: 18
            }),
            color: "#4ADE80",
            subtitle: "Marketplace volume"
          }), /* @__PURE__ */ jsx(StatCard, {
            title: "Active Alerts",
            value: stats.platform.activeAlerts,
            icon: /* @__PURE__ */ jsx(AlertTriangle, {
              size: 18
            }),
            color: "#EF4444",
            subtitle: "Ongoing crises"
          }), /* @__PURE__ */ jsx(StatCard, {
            title: "Justice Served",
            value: stats.platform.resolvedGrievances,
            icon: /* @__PURE__ */ jsx(CheckCircle, {
              size: 18
            }),
            color: "#FBBF24",
            subtitle: "Total solved cases"
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          marginTop: 24,
          background: "rgba(13, 77, 58, 0.4)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #2E7D67"
        },
        children: [/* @__PURE__ */ jsxs("h3", {
          style: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(PieChart, {
            size: 18,
            color: "#A7C7BC"
          }), tab === "personal" ? "Performance Overview" : "Sector Distribution"]
        }), /* @__PURE__ */ jsx("div", {
          style: {
            height: 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            paddingBottom: 10,
            borderBottom: "1px solid #2E7D67"
          },
          children: [60, 40, 75, 50, 80, 45, 90].map((h, i) => /* @__PURE__ */ jsx("div", {
            style: {
              width: "8%",
              height: `${h}%`,
              background: tab === "personal" ? "#4ADE80" : "#A78BFA",
              borderRadius: "4px 4px 0 0",
              opacity: 0.7
            }
          }, i))
        }), /* @__PURE__ */ jsx("div", {
          style: {
            marginTop: 12,
            textAlign: "center",
            fontSize: 12,
            color: "#A7C7BC"
          },
          children: tab === "personal" ? "Last 7 days activity" : "Activity across sectors (simulated)"
        })]
      })]
    })]
  });
};
const Analytics$1 = UNSAFE_withComponentProps(Analytics);
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Analytics$1
}, Symbol.toStringTag, { value: "Module" }));
const MediaPreview = ({
  file,
  url,
  onRemove
}) => {
  const [loading, setLoading] = useState(true);
  const isVideo = file.type.startsWith("video/");
  return /* @__PURE__ */ jsxs("div", {
    style: {
      position: "relative",
      flexShrink: 0,
      width: 100,
      height: 100,
      borderRadius: 8,
      overflow: "hidden",
      background: "#000"
    },
    children: [loading && /* @__PURE__ */ jsx("div", {
      style: {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1F2937",
        zIndex: 5
      },
      children: /* @__PURE__ */ jsx(Loader2, {
        size: 24,
        className: "animate-spin",
        color: "#4ADE80"
      })
    }), isVideo ? /* @__PURE__ */ jsx("video", {
      src: url,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: loading ? 0 : 1
      },
      muted: true,
      playsInline: true,
      onLoadedData: () => setLoading(false),
      onError: () => setLoading(false)
    }) : /* @__PURE__ */ jsx("img", {
      src: url,
      alt: "Preview",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: loading ? 0 : 1
      },
      onLoad: () => setLoading(false),
      onError: () => setLoading(false)
    }), /* @__PURE__ */ jsx("button", {
      onClick: onRemove,
      style: {
        position: "absolute",
        top: 4,
        right: 4,
        background: "transparent",
        border: "none",
        padding: 4,
        cursor: "pointer",
        zIndex: 10,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
      },
      children: /* @__PURE__ */ jsx(X, {
        size: 24,
        color: "white",
        strokeWidth: 2.5
      })
    }), isVideo && !loading && /* @__PURE__ */ jsx("div", {
      style: {
        position: "absolute",
        bottom: 4,
        left: 4,
        background: "rgba(0,0,0,0.6)",
        padding: "2px 6px",
        borderRadius: 4,
        color: "white",
        fontSize: 10,
        zIndex: 10
      },
      children: "VIDEO"
    })]
  });
};
const NewPost = () => {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    groupId,
    groupName
  } = location.state || {};
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [hashtags, setHashtags] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleMediaSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };
  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error(t("auth.errors.login_required") || "You must be logged in");
      return;
    }
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error("Post cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const uploadedUrls = [];
      if (mediaFiles.length > 0) {
        const uploadPromises = mediaFiles.map(async (file) => {
          const fileExt = file.name.split(".").pop();
          const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
          const fileName = `${user.id}/${Date.now()}_${cleanName}.${fileExt}`;
          const {
            error: uploadError
          } = await supabase.storage.from("post_media").upload(fileName, file, {
            cacheControl: "3600",
            upsert: false
          });
          if (uploadError) throw uploadError;
          const {
            data
          } = supabase.storage.from("post_media").getPublicUrl(fileName);
          return data.publicUrl;
        });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Media upload timed out. Please check your connection.")), 3e4));
        const results = await Promise.race([Promise.all(uploadPromises), timeoutPromise]);
        uploadedUrls.push(...results);
      }
      const processedHashtags = hashtags.split(/[ ,]+/).filter((tag) => tag.trim() !== "").map((tag) => tag.startsWith("#") ? tag : `#${tag}`);
      const {
        error: insertError
      } = await supabase.from("posts").insert({
        user_id: user.id,
        content,
        category,
        hashtags: processedHashtags,
        media_urls: uploadedUrls,
        group_id: groupId || null,
        is_emergency: false
        // Default for now
      });
      if (insertError) throw insertError;
      toast.success(t("auth.posts.success"));
      if (groupId) {
        navigate(`/group/${groupId}`);
      } else {
        navigate("/feed");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      if (error.message && error.message.includes("Bucket not found")) {
        toast.error("System error: Media storage bucket missing. Contact admin.");
      } else if (error.statusCode === "413") {
        toast.error("File too large. Please upload smaller files.");
      } else {
        toast.error(error.message || "Failed to create post");
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      display: "flex",
      justifyContent: "center",
      padding: "20px"
    },
    children: [/* @__PURE__ */ jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      style: {
        width: "100%",
        maxWidth: "600px"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10
        },
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => navigate(-1),
          style: {
            background: "transparent",
            border: "none",
            color: "#A7C7BC",
            cursor: "pointer"
          },
          children: /* @__PURE__ */ jsx(ArrowLeft, {})
        }), /* @__PURE__ */ jsx("h1", {
          style: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#F2F1EE"
          },
          children: t("auth.posts.create_title")
        })]
      }), groupId && /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(74, 222, 128, 0.1)",
          border: "1px solid #4ADE80",
          borderRadius: 12,
          padding: "12px 16px",
          marginBottom: 16,
          color: "#4ADE80",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: "bold"
        },
        children: [/* @__PURE__ */ jsx(Users, {
          size: 18
        }), " Posting to Group: ", groupName]
      }), /* @__PURE__ */ jsxs("div", {
        style: {
          background: "rgba(13, 77, 58, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid #2E7D67",
          borderRadius: 16,
          padding: 24
        },
        children: [/* @__PURE__ */ jsx("textarea", {
          value: content,
          onChange: (e) => setContent(e.target.value),
          placeholder: t("auth.posts.placeholder"),
          rows: 6,
          style: {
            width: "100%",
            background: "transparent",
            border: "none",
            color: "#F2F1EE",
            fontSize: 16,
            resize: "none",
            outline: "none",
            marginBottom: 20,
            fontFamily: "inherit"
          }
        }), mediaFiles.length > 0 && /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            gap: 10,
            overflowX: "auto",
            marginBottom: 20,
            paddingBottom: 10
          },
          children: mediaFiles.map((file, index) => /* @__PURE__ */ jsx(MediaPreview, {
            file,
            url: mediaPreviews[index],
            onRemove: () => removeMedia(index)
          }, index))
        }), /* @__PURE__ */ jsxs("div", {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 16
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              gap: 12
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                flex: 1
              },
              children: [/* @__PURE__ */ jsxs("label", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#A7C7BC",
                  fontSize: 13,
                  marginBottom: 4
                },
                children: [/* @__PURE__ */ jsx(Tag, {
                  size: 14
                }), " ", t("auth.posts.category")]
              }), /* @__PURE__ */ jsxs("select", {
                value: category,
                onChange: (e) => setCategory(e.target.value),
                style: {
                  width: "100%",
                  background: "#0B3D2E",
                  border: "1px solid #2E7D67",
                  color: "white",
                  padding: "10px",
                  borderRadius: 8,
                  fontSize: 14
                },
                children: [/* @__PURE__ */ jsx("option", {
                  value: "general",
                  children: t("auth.posts.categories.general")
                }), /* @__PURE__ */ jsx("option", {
                  value: "DroughtResilience",
                  children: t("auth.posts.categories.drought_resilience")
                }), /* @__PURE__ */ jsx("option", {
                  value: "MineRestoration",
                  children: t("auth.posts.categories.mine_restoration")
                }), /* @__PURE__ */ jsx("option", {
                  value: "MarketAccess",
                  children: t("auth.posts.categories.market_access")
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                flex: 1
              },
              children: [/* @__PURE__ */ jsxs("label", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#A7C7BC",
                  fontSize: 13,
                  marginBottom: 4
                },
                children: [/* @__PURE__ */ jsx(Hash, {
                  size: 14
                }), " ", t("auth.posts.hashtags")]
              }), /* @__PURE__ */ jsx("input", {
                value: hashtags,
                onChange: (e) => setHashtags(e.target.value),
                placeholder: t("auth.posts.hashtags_placeholder"),
                style: {
                  width: "100%",
                  background: "#0B3D2E",
                  border: "1px solid #2E7D67",
                  color: "white",
                  padding: "10px",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box"
                }
              })]
            })]
          }), /* @__PURE__ */ jsx("div", {
            style: {
              height: 1,
              background: "#2E7D67",
              margin: "8px 0"
            }
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                display: "flex",
                gap: 10
              },
              children: /* @__PURE__ */ jsxs("label", {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#4ADE80",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "rgba(74, 222, 128, 0.1)"
                },
                children: [/* @__PURE__ */ jsx(Image, {
                  size: 18
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: 14,
                    fontWeight: 500
                  },
                  children: t("auth.posts.upload_media")
                }), /* @__PURE__ */ jsx("input", {
                  type: "file",
                  multiple: true,
                  accept: "image/*,video/*",
                  onChange: (e) => {
                    handleMediaSelect(e);
                    e.target.value = null;
                  },
                  hidden: true
                })]
              })
            }), /* @__PURE__ */ jsxs("button", {
              onClick: handleSubmit,
              disabled: loading || !content && mediaFiles.length === 0,
              style: {
                background: "#4ADE80",
                color: "#0B3D2E",
                border: "none",
                padding: "10px 24px",
                borderRadius: 12,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading || !content && mediaFiles.length === 0 ? 0.6 : 1
              },
              children: [loading ? /* @__PURE__ */ jsx(Loader2, {
                size: 18,
                className: "animate-spin"
              }) : /* @__PURE__ */ jsx(Send, {
                size: 18
              }), t("auth.posts.submit")]
            })]
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("style", {
      children: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `
    })]
  });
};
const NewPost$1 = UNSAFE_withComponentProps(NewPost);
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NewPost$1
}, Symbol.toStringTag, { value: "Module" }));
const AdminLayout = UNSAFE_withComponentProps(function AdminLayout2() {
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) return /* @__PURE__ */ jsx(Navigate, {
    to: "/feed"
  });
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminLayout
}, Symbol.toStringTag, { value: "Module" }));
const AdminGrievances = () => {
  const {
    user,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [availableMediators, setAvailableMediators] = useState([]);
  const [excludedIds, setExcludedIds] = useState(/* @__PURE__ */ new Set());
  const [selectedMediatorId, setSelectedMediatorId] = useState("");
  const [mediatorBadgeId, setMediatorBadgeId] = useState(null);
  useEffect(() => {
    if (!isAdmin) {
      navigate("/feed");
      return;
    }
    fetchGrievances();
    fetchMediatorBadgeId();
  }, [isAdmin]);
  useEffect(() => {
    if (mediatorBadgeId) fetchMediators();
  }, [mediatorBadgeId]);
  const fetchMediatorBadgeId = async () => {
    const {
      data
    } = await supabase.from("badges").select("id").eq("name", "Mediator").single();
    if (data) setMediatorBadgeId(data.id);
  };
  const fetchMediators = async () => {
    try {
      const {
        data
      } = await supabase.from("users").select("id, name, avatar_url, user_badges!inner(badge_id)").eq("user_badges.badge_id", mediatorBadgeId);
      setAvailableMediators(data || []);
    } catch (error) {
      console.error("Error fetching mediators:", error);
    }
  };
  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("grievances").select(`
                    *,
                    reporter:users!grievances_reporter_id_fkey(name, avatar_url),
                    respondent:users!grievances_against_user_id_fkey(name, avatar_url),
                    mediator:users!grievances_mediator_id_fkey(name, avatar_url),
                    group:groups!grievances_group_id_fkey(name)
                `).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setGrievances(data || []);
    } catch (error) {
      console.error("Error fetching admin grievances:", error);
      toast.error("Failed to load grievances");
    } finally {
      setLoading(false);
    }
  };
  const handleStartAssign = async (grievance) => {
    if (assigningId === grievance.id) {
      setAssigningId(null);
      setSelectedMediatorId("");
      setExcludedIds(/* @__PURE__ */ new Set());
      return;
    }
    setAssigningId(grievance.id);
    setSelectedMediatorId("");
    const exclude = /* @__PURE__ */ new Set();
    if (grievance.reporter_id) exclude.add(grievance.reporter_id);
    if (grievance.against_user_id) exclude.add(grievance.against_user_id);
    if (grievance.group_id) {
      try {
        const {
          data
        } = await supabase.from("group_members").select("user_id").eq("group_id", grievance.group_id);
        (data || []).forEach((m) => exclude.add(m.user_id));
      } catch (e) {
        console.error(e);
      }
    }
    setExcludedIds(exclude);
  };
  const handleAssignMediator = async () => {
    if (!assigningId || !selectedMediatorId) return;
    try {
      const mediatorName = availableMediators.find((u) => u.id === selectedMediatorId)?.name || "Unknown";
      const {
        error
      } = await supabase.from("grievances").update({
        mediator_id: selectedMediatorId,
        status: "under_review",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", assigningId);
      if (error) throw error;
      await supabase.from("resolution_notes").insert({
        grievance_id: assigningId,
        author_id: user.id,
        content: `Admin assigned mediator: ${mediatorName}`,
        note_type: "mediation"
      });
      toast.success("Mediator assigned");
      setAssigningId(null);
      setSelectedMediatorId("");
      setExcludedIds(/* @__PURE__ */ new Set());
      fetchGrievances();
    } catch {
      toast.error("Failed to assign");
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    children: /* @__PURE__ */ jsx(Loader2, {
      size: 32,
      style: {
        color: "#4ADE80",
        animation: "spin 1s linear infinite"
      }
    })
  });
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsxs("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10
        },
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/feed"),
          style: {
            background: "transparent",
            border: "none",
            color: "#A7C7BC",
            cursor: "pointer",
            padding: 4
          },
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 22
          })
        }), /* @__PURE__ */ jsxs("h1", {
          style: {
            fontSize: 18,
            fontWeight: "bold",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(Shield, {
            size: 18,
            style: {
              color: "#F97316"
            }
          }), " Admin Grievance Panel"]
        })]
      }), /* @__PURE__ */ jsxs("button", {
        onClick: () => navigate("/admin/users"),
        style: {
          background: "rgba(255,255,255,0.05)",
          color: "#A7C7BC",
          border: "1px solid #2E7D67",
          borderRadius: 8,
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 6
        },
        children: [/* @__PURE__ */ jsx(Award, {
          size: 14,
          style: {
            color: "#FBBF24"
          }
        }), " Manage Badges"]
      })]
    }), /* @__PURE__ */ jsx("div", {
      style: {
        maxWidth: 1e3,
        margin: "0 auto",
        padding: 20
      },
      children: grievances.length === 0 ? /* @__PURE__ */ jsx("div", {
        style: {
          textAlign: "center",
          padding: 40,
          color: "#A7C7BC",
          fontStyle: "italic"
        },
        children: "No grievances found."
      }) : /* @__PURE__ */ jsx("div", {
        style: {
          display: "grid",
          gap: 16
        },
        children: grievances.map((g) => /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 10
          },
          animate: {
            opacity: 1,
            y: 0
          },
          style: {
            background: "rgba(13, 77, 58, 0.4)",
            border: "1px solid #2E7D67",
            borderRadius: 12,
            padding: 16
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 10
            },
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  gap: 8,
                  marginBottom: 4
                },
                children: [/* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 8,
                    background: "#2E7D67",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  },
                  children: g.status.replace("_", " ")
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.1)",
                    color: "#A7C7BC"
                  },
                  children: g.priority
                })]
              }), /* @__PURE__ */ jsx("h3", {
                style: {
                  margin: 0,
                  fontSize: 16,
                  fontWeight: "bold"
                },
                children: g.title
              })]
            }), /* @__PURE__ */ jsx("div", {
              style: {
                textAlign: "right",
                fontSize: 12,
                color: "#A7C7BC"
              },
              children: new Date(g.created_at).toLocaleDateString()
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              gap: 20,
              fontSize: 13,
              color: "#A7C7BC",
              marginBottom: 16,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              paddingBottom: 12
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6
              },
              children: [/* @__PURE__ */ jsx(User, {
                size: 14
              }), " Reporter: ", /* @__PURE__ */ jsx("span", {
                style: {
                  color: "white"
                },
                children: g.reporter?.name
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6
              },
              children: [g.group ? /* @__PURE__ */ jsx(Users, {
                size: 14
              }) : /* @__PURE__ */ jsx(User, {
                size: 14
              }), "Respondent: ", /* @__PURE__ */ jsx("span", {
                style: {
                  color: "white"
                },
                children: g.group ? g.group.name : g.respondent?.name || "General"
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                flex: 1
              },
              children: [/* @__PURE__ */ jsx(Shield, {
                size: 16,
                style: {
                  color: "#A78BFA"
                }
              }), g.mediator ? /* @__PURE__ */ jsxs("span", {
                style: {
                  fontSize: 13
                },
                children: ["Mediator: ", /* @__PURE__ */ jsx("strong", {
                  children: g.mediator.name
                })]
              }) : /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: 13,
                  color: "#F97316",
                  fontStyle: "italic"
                },
                children: "No mediator assigned"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                gap: 8
              },
              children: [/* @__PURE__ */ jsx("button", {
                onClick: () => navigate(`/grievance/${g.id}`),
                style: {
                  background: "transparent",
                  border: "1px solid #2E7D67",
                  color: "#A7C7BC",
                  padding: "6px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12
                },
                children: "View Details"
              }), /* @__PURE__ */ jsx("button", {
                onClick: () => handleStartAssign(g),
                style: {
                  background: assigningId === g.id ? "#F97316" : "#2E7D67",
                  border: "none",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: "bold"
                },
                children: g.mediator ? "Reassign" : "Assign Mediator"
              })]
            })]
          }), assigningId === g.id && /* @__PURE__ */ jsxs("div", {
            style: {
              marginTop: 16,
              padding: 12,
              background: "rgba(0,0,0,0.2)",
              borderRadius: 10,
              border: "1px solid #F97316"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8
              },
              children: [/* @__PURE__ */ jsx("span", {
                style: {
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "#F97316"
                },
                children: "Select Mediator"
              }), /* @__PURE__ */ jsx("button", {
                onClick: () => setAssigningId(null),
                style: {
                  background: "none",
                  border: "none",
                  color: "#A7C7BC",
                  cursor: "pointer"
                },
                children: /* @__PURE__ */ jsx(X, {
                  size: 14
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                position: "relative",
                marginBottom: 12
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  position: "absolute",
                  right: 12,
                  top: 12,
                  pointerEvents: "none"
                },
                children: /* @__PURE__ */ jsx(ChevronDown, {
                  size: 14,
                  color: "#A7C7BC"
                })
              }), /* @__PURE__ */ jsxs("select", {
                value: selectedMediatorId,
                onChange: (e) => setSelectedMediatorId(e.target.value),
                style: {
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid #2E7D67",
                  color: "white",
                  appearance: "none",
                  fontSize: 13
                },
                children: [/* @__PURE__ */ jsx("option", {
                  value: "",
                  children: "Select a certified mediator..."
                }), availableMediators.filter((u) => !excludedIds.has(u.id)).map((u) => /* @__PURE__ */ jsx("option", {
                  value: u.id,
                  children: u.name
                }, u.id))]
              })]
            }), availableMediators.filter((u) => !excludedIds.has(u.id)).length === 0 && /* @__PURE__ */ jsxs("div", {
              style: {
                marginBottom: 10,
                fontSize: 12,
                color: "#F97316",
                fontStyle: "italic",
                display: "flex",
                gap: 6,
                alignItems: "center"
              },
              children: [/* @__PURE__ */ jsx(AlertTriangle, {
                size: 14
              }), " No eligible mediators found."]
            }), /* @__PURE__ */ jsx("button", {
              onClick: handleAssignMediator,
              disabled: !selectedMediatorId,
              style: {
                width: "100%",
                background: selectedMediatorId ? "#F97316" : "rgba(255,255,255,0.05)",
                color: selectedMediatorId ? "white" : "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: 8,
                padding: 10,
                fontWeight: "bold",
                cursor: selectedMediatorId ? "pointer" : "default",
                transition: "all 0.2s"
              },
              children: "Confirm Assignment"
            })]
          })]
        }, g.id))
      })
    })]
  });
};
const AdminGrievances$1 = UNSAFE_withComponentProps(AdminGrievances);
const route35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminGrievances$1
}, Symbol.toStringTag, { value: "Module" }));
const AdminUsers = () => {
  const {
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (!isAdmin) {
      navigate("/feed");
      return;
    }
    fetchData();
  }, [isAdmin]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, badgesRes, userBadgesRes] = await Promise.all([supabase.from("users").select("*").order("created_at", {
        ascending: false
      }).limit(50), supabase.from("badges").select("*"), supabase.from("user_badges").select("*")]);
      if (usersRes.error) throw usersRes.error;
      if (badgesRes.error) throw badgesRes.error;
      setUsers(usersRes.data || []);
      setBadges(badgesRes.data || []);
      const ubMap = {};
      (userBadgesRes.data || []).forEach((ub) => {
        if (!ubMap[ub.user_id]) ubMap[ub.user_id] = /* @__PURE__ */ new Set();
        ubMap[ub.user_id].add(ub.badge_id);
      });
      setUserBadges(ubMap);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      if (query.length === 0) fetchData();
      return;
    }
    try {
      const {
        data,
        error
      } = await supabase.from("users").select("*").ilike("name", `%${query}%`).limit(50);
      if (error) throw error;
      setUsers(data || []);
      const userIds = data.map((u) => u.id);
      const {
        data: ubData
      } = await supabase.from("user_badges").select("*").in("user_id", userIds);
      const ubMap = {};
      (ubData || []).forEach((ub) => {
        if (!ubMap[ub.user_id]) ubMap[ub.user_id] = /* @__PURE__ */ new Set();
        ubMap[ub.user_id].add(ub.badge_id);
      });
      setUserBadges(ubMap);
    } catch (error) {
      console.error(error);
    }
  };
  const toggleBadge = async (userId, badgeId) => {
    const currentBadges = userBadges[userId] || /* @__PURE__ */ new Set();
    const hasBadge = currentBadges.has(badgeId);
    try {
      if (hasBadge) {
        const {
          error
        } = await supabase.from("user_badges").delete().match({
          user_id: userId,
          badge_id: badgeId
        });
        if (error) throw error;
        currentBadges.delete(badgeId);
        toast.success("Badge removed");
      } else {
        const {
          error
        } = await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badgeId
        });
        if (error) throw error;
        currentBadges.add(badgeId);
        toast.success("Badge assigned");
      }
      setUserBadges((prev) => ({
        ...prev,
        [userId]: new Set(currentBadges)
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to update badge");
    }
  };
  if (loading && users.length === 0) return /* @__PURE__ */ jsx("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    children: /* @__PURE__ */ jsx(Loader2, {
      size: 32,
      style: {
        color: "#4ADE80",
        animation: "spin 1s linear infinite"
      }
    })
  });
  return /* @__PURE__ */ jsxs("div", {
    style: {
      minHeight: "100vh",
      background: "#0B3D2E",
      color: "#F2F1EE",
      paddingBottom: 80
    },
    children: [/* @__PURE__ */ jsx("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(11, 61, 46, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderBottom: "1px solid #2E7D67",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      },
      children: /* @__PURE__ */ jsxs("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10
        },
        children: [/* @__PURE__ */ jsx("button", {
          onClick: () => navigate("/admin/grievances"),
          style: {
            background: "transparent",
            border: "none",
            color: "#A7C7BC",
            cursor: "pointer",
            padding: 4
          },
          children: /* @__PURE__ */ jsx(ArrowLeft, {
            size: 22
          })
        }), /* @__PURE__ */ jsxs("h1", {
          style: {
            fontSize: 18,
            fontWeight: "bold",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 8
          },
          children: [/* @__PURE__ */ jsx(Award, {
            size: 18,
            style: {
              color: "#FBBF24"
            }
          }), " User Badges"]
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      style: {
        maxWidth: 1e3,
        margin: "0 auto",
        padding: 20
      },
      children: [/* @__PURE__ */ jsxs("div", {
        style: {
          marginBottom: 20,
          position: "relative"
        },
        children: [/* @__PURE__ */ jsx(Search, {
          size: 16,
          style: {
            position: "absolute",
            left: 14,
            top: 12,
            color: "#A7C7BC"
          }
        }), /* @__PURE__ */ jsx("input", {
          value: searchQuery,
          onChange: (e) => handleSearch(e.target.value),
          placeholder: "Search users by name...",
          style: {
            width: "100%",
            padding: "10px 10px 10px 40px",
            borderRadius: 12,
            border: "1px solid #2E7D67",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            fontSize: 14,
            boxSizing: "border-box"
          }
        })]
      }), /* @__PURE__ */ jsx("div", {
        style: {
          display: "grid",
          gap: 12
        },
        children: users.map((u) => /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          style: {
            background: "rgba(13, 77, 58, 0.4)",
            borderRadius: 12,
            padding: 16,
            border: "1px solid #2E7D67"
          },
          children: [/* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#2E7D67",
                overflow: "hidden"
              },
              children: u.avatar_url ? /* @__PURE__ */ jsx("img", {
                src: u.avatar_url,
                style: {
                  width: "100%",
                  height: "100%"
                }
              }) : /* @__PURE__ */ jsx(User, {
                size: 24,
                color: "#A7C7BC",
                style: {
                  margin: 8
                }
              })
            }), /* @__PURE__ */ jsxs("div", {
              style: {
                flex: 1
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  fontWeight: "bold",
                  fontSize: 15
                },
                children: u.name
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  fontSize: 12,
                  color: "#A7C7BC"
                },
                children: u.location || "No location"
              })]
            })]
          }), /* @__PURE__ */ jsx("div", {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 8
            },
            children: badges.map((badge) => {
              const hasBadge = userBadges[u.id]?.has(badge.id);
              return /* @__PURE__ */ jsxs("button", {
                onClick: () => toggleBadge(u.id, badge.id),
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: hasBadge ? "rgba(249, 115, 22, 0.2)" : "rgba(255,255,255,0.05)",
                  color: hasBadge ? "#F97316" : "#A7C7BC",
                  border: hasBadge ? "1px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  padding: "6px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.2s"
                },
                children: [hasBadge ? /* @__PURE__ */ jsx(CheckCircle2, {
                  size: 14
                }) : /* @__PURE__ */ jsx("div", {
                  style: {
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1px solid #A7C7BC"
                  }
                }), badge.name]
              }, badge.id);
            })
          })]
        }, u.id))
      })]
    })]
  });
};
const AdminUsers$1 = UNSAFE_withComponentProps(AdminUsers);
const route36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminUsers$1
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C2uLy9Wa.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/index-bSs3seuc.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/root-Dc8mcFr4.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/index-bSs3seuc.js", "/assets/i18nInstance-CHFDjdcJ.js", "/assets/index.esm-S5nkEEnB.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/x-CmgEGQsR.js"], "css": ["/assets/root-Dp74hFXg.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "layouts/PublicLayout": { "id": "layouts/PublicLayout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/PublicLayout--649gkno.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Landing": { "id": "pages/Landing", "parentId": "layouts/PublicLayout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Landing-zRgdRNDV.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/proxy-M-F2Cna3.js", "/assets/SEOHead-C7Ob81AZ.js", "/assets/i18nInstance-CHFDjdcJ.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/index.esm-S5nkEEnB.js"], "css": ["/assets/leaflet-CIGW-MKW.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Login": { "id": "pages/Login", "parentId": "layouts/PublicLayout", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Login-IZUAus8L.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/SEOHead-C7Ob81AZ.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/mail-BehtABoB.js", "/assets/lock-CPGUI5XG.js", "/assets/arrow-right-KJNOnwvj.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/index-BfH8LDn_.js", "/assets/x-CmgEGQsR.js", "/assets/index.esm-S5nkEEnB.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Signup": { "id": "pages/Signup", "parentId": "layouts/PublicLayout", "path": "signup", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Signup-CGixoebp.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/SEOHead-C7Ob81AZ.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/arrow-right-KJNOnwvj.js", "/assets/mail-BehtABoB.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/lock-CPGUI5XG.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/index-BfH8LDn_.js", "/assets/x-CmgEGQsR.js", "/assets/index.esm-S5nkEEnB.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "layouts/OnboardingLayout": { "id": "layouts/OnboardingLayout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/OnboardingLayout-CoZRAraY.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Onboarding": { "id": "pages/Onboarding", "parentId": "layouts/OnboardingLayout", "path": "onboarding", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Onboarding-w6Bv7gJE.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/LocationPicker-fMlAcTkE.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/index-BfH8LDn_.js", "/assets/user-CWrWcOAj.js", "/assets/hash-D5DC09XA.js", "/assets/phone-CpUV1hSv.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/file-text-DJp7R9g4.js", "/assets/check-DkBDPIIC.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/arrow-right-KJNOnwvj.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/x-CmgEGQsR.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "layouts/ProtectedLayout": { "id": "layouts/ProtectedLayout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/ProtectedLayout-BIHhJSI-.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Feed": { "id": "pages/Feed", "parentId": "layouts/ProtectedLayout", "path": "feed", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Feed-B5GY8-7F.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/SEOHead-C7Ob81AZ.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/users-CMaxyTTn.js", "/assets/square-plus-D3h0WSxr.js", "/assets/message-circle-Y59WQwRe.js", "/assets/x-CmgEGQsR.js", "/assets/user-CWrWcOAj.js", "/assets/book-open-BC5jklgs.js", "/assets/calendar-CD48hIkk.js", "/assets/scale-CSAc66-m.js", "/assets/radio-Dfax0GBx.js", "/assets/clipboard-list-B9lYijSo.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/proxy-M-F2Cna3.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/heart-BkjR_Qam.js", "/assets/share-2-DvZl06Fy.js", "/assets/index.esm-S5nkEEnB.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Profile": { "id": "pages/Profile", "parentId": "layouts/ProtectedLayout", "path": "profile/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Profile-BbS3QljB.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/LocationPicker-fMlAcTkE.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/camera-C5MBtEUJ.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/x-CmgEGQsR.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/mail-BehtABoB.js", "/assets/user-CWrWcOAj.js", "/assets/phone-CpUV1hSv.js", "/assets/calendar-CD48hIkk.js", "/assets/award-tEnQAxKW.js", "/assets/plus-CO5Itgur.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": ["/assets/leaflet-CIGW-MKW.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/PostDetails": { "id": "pages/PostDetails", "parentId": "layouts/ProtectedLayout", "path": "post/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/PostDetails-CG9gpuUN.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/user-CWrWcOAj.js", "/assets/heart-BkjR_Qam.js", "/assets/message-circle-Y59WQwRe.js", "/assets/share-2-DvZl06Fy.js", "/assets/send-horizontal-Y0qJHYk9.js", "/assets/flag-Dper0dPT.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/x-CmgEGQsR.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/GroupPostDetails": { "id": "pages/GroupPostDetails", "parentId": "layouts/ProtectedLayout", "path": "group-post/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/GroupPostDetails-Cdxllvhd.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/user-CWrWcOAj.js", "/assets/thumbs-up-Bcofn5R1.js", "/assets/message-circle-Y59WQwRe.js", "/assets/send-horizontal-Y0qJHYk9.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/flag-Dper0dPT.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/x-CmgEGQsR.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Groups": { "id": "pages/Groups", "parentId": "layouts/ProtectedLayout", "path": "groups", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Groups-C-XsJoI5.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/users-CMaxyTTn.js", "/assets/square-plus-D3h0WSxr.js", "/assets/search-D-bhSeWo.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/proxy-M-F2Cna3.js", "/assets/i18nInstance-CHFDjdcJ.js", "/assets/createLucideIcon-dAkXvH6m.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/CreateGroup": { "id": "pages/CreateGroup", "parentId": "layouts/ProtectedLayout", "path": "create-group", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/CreateGroup-RgNYDpyT.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/proxy-M-F2Cna3.js", "/assets/users-CMaxyTTn.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/index-BfH8LDn_.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/x-CmgEGQsR.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/GroupDetails": { "id": "pages/GroupDetails", "parentId": "layouts/ProtectedLayout", "path": "group/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/GroupDetails-C401XK5T.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/users-CMaxyTTn.js", "/assets/check-DkBDPIIC.js", "/assets/x-CmgEGQsR.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/square-plus-D3h0WSxr.js", "/assets/thumbs-up-Bcofn5R1.js", "/assets/message-circle-Y59WQwRe.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/marketplace/Marketplace": { "id": "pages/marketplace/Marketplace", "parentId": "layouts/ProtectedLayout", "path": "marketplace", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Marketplace-B15dFw9S.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/package-CBtR6oVz.js", "/assets/plus-CO5Itgur.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/shopping-bag-Bnqi3TWB.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/CreateListing": { "id": "pages/CreateListing", "parentId": "layouts/ProtectedLayout", "path": "create-listing", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/CreateListing-fmUOFZKO.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/x-CmgEGQsR.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/upload-DEAA3UOs.js", "/assets/shopping-bag-Bnqi3TWB.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/ListingDetails": { "id": "pages/ListingDetails", "parentId": "layouts/ProtectedLayout", "path": "listing/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/ListingDetails-BLAhg8la.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/package-CBtR6oVz.js", "/assets/user-CWrWcOAj.js", "/assets/check-DkBDPIIC.js", "/assets/x-CmgEGQsR.js", "/assets/shopping-bag-Bnqi3TWB.js", "/assets/send-horizontal-Y0qJHYk9.js", "/assets/clock-BHcq9Wct.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/triangle-alert-Dhq0mmyu.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/MyOrders": { "id": "pages/MyOrders", "parentId": "layouts/ProtectedLayout", "path": "my-orders", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/MyOrders-insbhdUe.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/shopping-bag-Bnqi3TWB.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/package-CBtR6oVz.js", "/assets/user-CWrWcOAj.js", "/assets/chevron-right-CjuFVe40.js", "/assets/check-DkBDPIIC.js", "/assets/x-CmgEGQsR.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Resources": { "id": "pages/Resources", "parentId": "layouts/ProtectedLayout", "path": "resources", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Resources-DQzmrvDE.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/book-open-BC5jklgs.js", "/assets/plus-CO5Itgur.js", "/assets/search-D-bhSeWo.js", "/assets/x-CmgEGQsR.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/clock-BHcq9Wct.js", "/assets/eye-Bazze3V1.js", "/assets/video-CTWyB662.js", "/assets/file-text-DJp7R9g4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/ResourceDetails": { "id": "pages/ResourceDetails", "parentId": "layouts/ProtectedLayout", "path": "resource/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/ResourceDetails-DToNEcZO.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/book-open-BC5jklgs.js", "/assets/video-CTWyB662.js", "/assets/clock-BHcq9Wct.js", "/assets/eye-Bazze3V1.js", "/assets/user-CWrWcOAj.js", "/assets/calendar-CD48hIkk.js", "/assets/tag-DFYHlkCT.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/file-text-DJp7R9g4.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/UploadResource": { "id": "pages/UploadResource", "parentId": "layouts/ProtectedLayout", "path": "upload-resource", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/UploadResource-BO7GxNQ4.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/x-CmgEGQsR.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/upload-DEAA3UOs.js", "/assets/video-CTWyB662.js", "/assets/plus-CO5Itgur.js", "/assets/file-text-DJp7R9g4.js", "/assets/book-open-BC5jklgs.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Grievances": { "id": "pages/Grievances", "parentId": "layouts/ProtectedLayout", "path": "grievances", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Grievances-lMbb_FZz.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/scale-CSAc66-m.js", "/assets/plus-CO5Itgur.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/proxy-M-F2Cna3.js", "/assets/chevron-right-CjuFVe40.js", "/assets/circle-x-CenecJRM.js", "/assets/circle-check-DES_2gTj.js", "/assets/clock-BHcq9Wct.js", "/assets/triangle-alert-Dhq0mmyu.js", "/assets/createLucideIcon-dAkXvH6m.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/FileGrievance": { "id": "pages/FileGrievance", "parentId": "layouts/ProtectedLayout", "path": "file-grievance", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/FileGrievance-DeHUttnG.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/triangle-alert-Dhq0mmyu.js", "/assets/user-CWrWcOAj.js", "/assets/users-CMaxyTTn.js", "/assets/x-CmgEGQsR.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/camera-C5MBtEUJ.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/upload-DEAA3UOs.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/GrievanceDetails": { "id": "pages/GrievanceDetails", "parentId": "layouts/ProtectedLayout", "path": "grievance/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/GrievanceDetails-VnRBldJ4.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/user-CWrWcOAj.js", "/assets/users-CMaxyTTn.js", "/assets/shield--aQD5NZn.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/calendar-CD48hIkk.js", "/assets/circle-check-DES_2gTj.js", "/assets/thumbs-up-Bcofn5R1.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/message-square-Ct9cqEcT.js", "/assets/proxy-M-F2Cna3.js", "/assets/x-CmgEGQsR.js", "/assets/camera-C5MBtEUJ.js", "/assets/send-BYjrdRjg.js", "/assets/circle-x-CenecJRM.js", "/assets/scale-CSAc66-m.js", "/assets/clock-BHcq9Wct.js", "/assets/triangle-alert-Dhq0mmyu.js", "/assets/file-text-DJp7R9g4.js", "/assets/index-BfH8LDn_.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/CrisisAlerts": { "id": "pages/CrisisAlerts", "parentId": "layouts/ProtectedLayout", "path": "crisis", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/CrisisAlerts-CiiZcdkb.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/radio-Dfax0GBx.js", "/assets/plus-CO5Itgur.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/proxy-M-F2Cna3.js", "/assets/triangle-alert-Dhq0mmyu.js", "/assets/shield-alert-C9_NAdDn.js"], "css": ["/assets/leaflet-CIGW-MKW.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/CreateAlert": { "id": "pages/CreateAlert", "parentId": "layouts/ProtectedLayout", "path": "create-alert", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/CreateAlert-BXEUitTk.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/LocationPicker-fMlAcTkE.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/radio-Dfax0GBx.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/x-CmgEGQsR.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/upload-DEAA3UOs.js", "/assets/shield-alert-C9_NAdDn.js", "/assets/triangle-alert-Dhq0mmyu.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/CrisisDetails": { "id": "pages/CrisisDetails", "parentId": "layouts/ProtectedLayout", "path": "crisis/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/CrisisDetails-DvQbTSKN.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/heart-BkjR_Qam.js", "/assets/users-CMaxyTTn.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/calendar-CD48hIkk.js", "/assets/shield--aQD5NZn.js", "/assets/send-BYjrdRjg.js", "/assets/proxy-M-F2Cna3.js", "/assets/triangle-alert-Dhq0mmyu.js", "/assets/shield-alert-C9_NAdDn.js", "/assets/radio-Dfax0GBx.js", "/assets/index-BfH8LDn_.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/x-CmgEGQsR.js"], "css": ["/assets/leaflet-CIGW-MKW.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Compliance": { "id": "pages/Compliance", "parentId": "layouts/ProtectedLayout", "path": "compliance", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Compliance-CAE4PMXU.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/clipboard-list-B9lYijSo.js", "/assets/file-text-DJp7R9g4.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-DES_2gTj.js", "/assets/flag-Dper0dPT.js", "/assets/calendar-CD48hIkk.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/x-CmgEGQsR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Messages": { "id": "pages/Messages", "parentId": "layouts/ProtectedLayout", "path": "messages", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Messages-BNw4a1Sr.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/search-D-bhSeWo.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/message-square-Ct9cqEcT.js", "/assets/user-CWrWcOAj.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/check-DkBDPIIC.js", "/assets/send-BYjrdRjg.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "messages-userId": { "id": "messages-userId", "parentId": "layouts/ProtectedLayout", "path": "messages/:userId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Messages-BNw4a1Sr.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/search-D-bhSeWo.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/message-square-Ct9cqEcT.js", "/assets/user-CWrWcOAj.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/check-DkBDPIIC.js", "/assets/send-BYjrdRjg.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Events": { "id": "pages/Events", "parentId": "layouts/ProtectedLayout", "path": "events", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Events-DNUvP9Yf.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/calendar-CD48hIkk.js", "/assets/plus-CO5Itgur.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/clock-BHcq9Wct.js", "/assets/map-pin-CtZ_l0Ac.js", "/assets/circle-check-DES_2gTj.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/x-CmgEGQsR.js", "/assets/index-BfH8LDn_.js", "/assets/proxy-M-F2Cna3.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/Analytics": { "id": "pages/Analytics", "parentId": "layouts/ProtectedLayout", "path": "analytics", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/Analytics-DHmZyVqe.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/file-text-DJp7R9g4.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/users-CMaxyTTn.js", "/assets/triangle-alert-Dhq0mmyu.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/NewPost": { "id": "pages/NewPost", "parentId": "layouts/ProtectedLayout", "path": "new-post", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/NewPost-7sIuDUfb.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/useTranslation-CkUI7wDB.js", "/assets/proxy-M-F2Cna3.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/users-CMaxyTTn.js", "/assets/tag-DFYHlkCT.js", "/assets/hash-D5DC09XA.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/send-BYjrdRjg.js", "/assets/x-CmgEGQsR.js", "/assets/index-BfH8LDn_.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/i18nInstance-CHFDjdcJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "layouts/AdminLayout": { "id": "layouts/AdminLayout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/AdminLayout-CweDZssP.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/supabase-Cc_Lwtd_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/AdminGrievances": { "id": "pages/AdminGrievances", "parentId": "layouts/AdminLayout", "path": "admin/grievances", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/AdminGrievances-CIzOiUpT.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/shield--aQD5NZn.js", "/assets/award-tEnQAxKW.js", "/assets/proxy-M-F2Cna3.js", "/assets/user-CWrWcOAj.js", "/assets/users-CMaxyTTn.js", "/assets/x-CmgEGQsR.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/triangle-alert-Dhq0mmyu.js", "/assets/index-BfH8LDn_.js", "/assets/circle-check-big-CngUb5_d.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/AdminUsers": { "id": "pages/AdminUsers", "parentId": "layouts/AdminLayout", "path": "admin/users", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/AdminUsers-ISki5_mb.js", "imports": ["/assets/chunk-LFPYN7LY-CisNrVsk.js", "/assets/AuthContext-Cp18ztuo.js", "/assets/ToastContext-gleAVtgz.js", "/assets/supabase-Cc_Lwtd_.js", "/assets/loader-circle-3CKXh_uz.js", "/assets/arrow-left-KcxvKs1X.js", "/assets/award-tEnQAxKW.js", "/assets/search-D-bhSeWo.js", "/assets/proxy-M-F2Cna3.js", "/assets/user-CWrWcOAj.js", "/assets/circle-check-DES_2gTj.js", "/assets/index-BfH8LDn_.js", "/assets/createLucideIcon-dAkXvH6m.js", "/assets/circle-check-big-CngUb5_d.js", "/assets/x-CmgEGQsR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-2c270862.js", "version": "2c270862", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "layouts/PublicLayout": {
    id: "layouts/PublicLayout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "pages/Landing": {
    id: "pages/Landing",
    parentId: "layouts/PublicLayout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "pages/Login": {
    id: "pages/Login",
    parentId: "layouts/PublicLayout",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "pages/Signup": {
    id: "pages/Signup",
    parentId: "layouts/PublicLayout",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "layouts/OnboardingLayout": {
    id: "layouts/OnboardingLayout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "pages/Onboarding": {
    id: "pages/Onboarding",
    parentId: "layouts/OnboardingLayout",
    path: "onboarding",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "layouts/ProtectedLayout": {
    id: "layouts/ProtectedLayout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "pages/Feed": {
    id: "pages/Feed",
    parentId: "layouts/ProtectedLayout",
    path: "feed",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "pages/Profile": {
    id: "pages/Profile",
    parentId: "layouts/ProtectedLayout",
    path: "profile/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "pages/PostDetails": {
    id: "pages/PostDetails",
    parentId: "layouts/ProtectedLayout",
    path: "post/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "pages/GroupPostDetails": {
    id: "pages/GroupPostDetails",
    parentId: "layouts/ProtectedLayout",
    path: "group-post/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "pages/Groups": {
    id: "pages/Groups",
    parentId: "layouts/ProtectedLayout",
    path: "groups",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "pages/CreateGroup": {
    id: "pages/CreateGroup",
    parentId: "layouts/ProtectedLayout",
    path: "create-group",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "pages/GroupDetails": {
    id: "pages/GroupDetails",
    parentId: "layouts/ProtectedLayout",
    path: "group/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "pages/marketplace/Marketplace": {
    id: "pages/marketplace/Marketplace",
    parentId: "layouts/ProtectedLayout",
    path: "marketplace",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "pages/CreateListing": {
    id: "pages/CreateListing",
    parentId: "layouts/ProtectedLayout",
    path: "create-listing",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "pages/ListingDetails": {
    id: "pages/ListingDetails",
    parentId: "layouts/ProtectedLayout",
    path: "listing/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "pages/MyOrders": {
    id: "pages/MyOrders",
    parentId: "layouts/ProtectedLayout",
    path: "my-orders",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "pages/Resources": {
    id: "pages/Resources",
    parentId: "layouts/ProtectedLayout",
    path: "resources",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "pages/ResourceDetails": {
    id: "pages/ResourceDetails",
    parentId: "layouts/ProtectedLayout",
    path: "resource/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "pages/UploadResource": {
    id: "pages/UploadResource",
    parentId: "layouts/ProtectedLayout",
    path: "upload-resource",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "pages/Grievances": {
    id: "pages/Grievances",
    parentId: "layouts/ProtectedLayout",
    path: "grievances",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "pages/FileGrievance": {
    id: "pages/FileGrievance",
    parentId: "layouts/ProtectedLayout",
    path: "file-grievance",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "pages/GrievanceDetails": {
    id: "pages/GrievanceDetails",
    parentId: "layouts/ProtectedLayout",
    path: "grievance/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "pages/CrisisAlerts": {
    id: "pages/CrisisAlerts",
    parentId: "layouts/ProtectedLayout",
    path: "crisis",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "pages/CreateAlert": {
    id: "pages/CreateAlert",
    parentId: "layouts/ProtectedLayout",
    path: "create-alert",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "pages/CrisisDetails": {
    id: "pages/CrisisDetails",
    parentId: "layouts/ProtectedLayout",
    path: "crisis/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "pages/Compliance": {
    id: "pages/Compliance",
    parentId: "layouts/ProtectedLayout",
    path: "compliance",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "pages/Messages": {
    id: "pages/Messages",
    parentId: "layouts/ProtectedLayout",
    path: "messages",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "messages-userId": {
    id: "messages-userId",
    parentId: "layouts/ProtectedLayout",
    path: "messages/:userId",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "pages/Events": {
    id: "pages/Events",
    parentId: "layouts/ProtectedLayout",
    path: "events",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "pages/Analytics": {
    id: "pages/Analytics",
    parentId: "layouts/ProtectedLayout",
    path: "analytics",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "pages/NewPost": {
    id: "pages/NewPost",
    parentId: "layouts/ProtectedLayout",
    path: "new-post",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "layouts/AdminLayout": {
    id: "layouts/AdminLayout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route34
  },
  "pages/AdminGrievances": {
    id: "pages/AdminGrievances",
    parentId: "layouts/AdminLayout",
    path: "admin/grievances",
    index: void 0,
    caseSensitive: void 0,
    module: route35
  },
  "pages/AdminUsers": {
    id: "pages/AdminUsers",
    parentId: "layouts/AdminLayout",
    path: "admin/users",
    index: void 0,
    caseSensitive: void 0,
    module: route36
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
