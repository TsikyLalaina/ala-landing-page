import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const SITE_URL = 'https://ala-mg.com'
const DEFAULT_IMAGE = `${SITE_URL}/images/After.png`
const SITE_NAME = 'Ala'

/**
 * Reusable SEO head component.
 *
 * @param {Object} props
 * @param {string}  props.title       – Page title (50-60 chars recommended)
 * @param {string}  props.description – Page description (150-160 chars)
 * @param {string}  [props.path]      – Path portion of the canonical URL (e.g. '/login')
 * @param {string}  [props.image]     – OG image absolute URL
 * @param {string}  [props.type]      – OG type, defaults to 'website'
 * @param {boolean} [props.noindex]   – Set true for private / auth-gated pages
 * @param {Object}  [props.jsonLd]    – JSON-LD structured data object(s)
 */
export default function SEOHead({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const canonicalUrl = `${SITE_URL}${path}`

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Language alternates */}
      <html lang={lang} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="mg" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === 'mg' ? 'mg_MG' : lang === 'fr' ? 'fr_FR' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
