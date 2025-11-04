import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
// Real hub coordinates
const HUBS = [
  { region: 'SAVA', name: 'Sambava', lat: -14.27, lon: 50.17 },
  { region: 'SAVA', name: 'Antalaha', lat: -14.91, lon: 50.28 },
  { region: 'SAVA', name: 'Vohemar', lat: -13.37, lon: 50.0 },
  { region: 'SAVA', name: 'Andapa', lat: -14.66, lon: 49.65 },
  { region: 'Anosy', name: 'Taolagnaro (Fort Dauphin)', lat: -25.04, lon: 46.99 },
  { region: 'Analanjirofo', name: 'Mananara (Nord)', lat: -16.17, lon: 49.77 },
  { region: 'Analanjirofo', name: 'Maroantsetra', lat: -15.43, lon: 49.75 },
  { region: 'Toamasina', name: 'Toamasina (general)', lat: -18.15, lon: 49.4 },
  { region: 'Toamasina', name: 'Ambatovy Mine Area', lat: -18.82, lon: 48.3 },
  { region: 'Vakinankaratra', name: 'Antsirabe', lat: -19.87, lon: 47.03 },
]

export default function MapPreview() {
  const mapEl = useRef(null)

  useEffect(() => {
    if (!mapEl.current) return
    const center = [-19.0, 46.5]
    const zoom = 5.5
    const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView(center, zoom)
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    })
    tiles.addTo(map)

    // Add red pins
    HUBS.forEach((h) => {
      const marker = L.circleMarker([h.lat, h.lon], {
        radius: 6,
        color: '#B91C1C', // red stroke
        weight: 2,
        fillColor: '#EF4444', // red fill
        fillOpacity: 0.85,
      }).addTo(map)
      marker.bindPopup(`${h.name} — ${h.region}<br/>Lat ${h.lat.toFixed(2)}, Lon ${h.lon.toFixed(2)}`)
    })

    // Cleanup on unmount
    return () => {
      map.remove()
    }
  }, [])

  return (
    <section style={{ padding: '48px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ color: '#F2F1EE', fontSize: 'clamp(22px,3.2vw,36px)', margin: '0 0 18px' }}>Restoration Hubs — Preview</h2>
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid #1E5A49' }}>
        <div ref={mapEl} style={{ height: 400, width: '100%' }} />
      </div>
      <div style={{ color: '#A7A39B', fontSize: 12, marginTop: 8 }}>
        Tiles: &copy; OpenStreetMap contributors. Hub pins shown are approximate placeholders pending field verification.
      </div>
    </section>
  )
}
