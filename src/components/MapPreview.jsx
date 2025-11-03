import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function randomHubs(count = 6) {
  // Madagascar bbox approx: lat [-25.6, -11.9], lon [43.2, 50.5]
  const hubs = []
  for (let i = 0; i < count; i++) {
    const lat = -25.6 + Math.random() * (-11.9 + 25.6)
    const lon = 43.2 + Math.random() * (50.5 - 43.2)
    hubs.push({ id: i + 1, lat, lon })
  }
  return hubs
}

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

    const hubs = randomHubs(7)
    hubs.forEach((h) => {
      const marker = L.marker([h.lat, h.lon]).addTo(map)
      marker.bindPopup(`Hub #${h.id}<br/>Lat ${h.lat.toFixed(2)}, Lon ${h.lon.toFixed(2)}`)
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
        Tiles: &copy; OpenStreetMap contributors. Pins are random for preview.
      </div>
    </section>
  )
}
