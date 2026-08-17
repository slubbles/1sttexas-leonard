'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type MapListing = {
  mls: string
  address: string
  city: string
  zip: string
  price: string
  beds: string
  baths: string
  sqft?: string
  photo: string
  lat?: number
  lon?: number
}

export default function SearchMap({ listings, mode }: { listings: MapListing[]; mode: 'buy' | 'rent' }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const map = L.map(ref.current, { center: [29.545, -95.06], zoom: 11 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)
    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null; layerRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    layer.clearLayers()
    if (!listings.length) return

    const withCoords = listings.filter(l => l.lat != null && l.lon != null)
    const markerIcon = L.divIcon({
      className: 'idx-marker-wrap',
      html: `<div class="idx-marker">${mode === 'rent' ? '🔑' : '🏠'}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    })

    withCoords.forEach(l => {
      const marker = L.marker([l.lat!, l.lon!], { icon: markerIcon })
      marker.bindPopup(`
        <div class="idx-popup">
          <img src="${l.photo}" alt="" />
          <div class="idx-popup-body">
            <strong>${l.price}</strong>
            <span>${l.address}, ${l.city} TX ${l.zip}</span>
            <span>${l.beds ? l.beds + ' · ' : ''}${l.baths ? l.baths : ''}${l.sqft ? ' · ' + l.sqft + ' SqFt' : ''}</span>
            <small>MLS#${l.mls}</small>
          </div>
        </div>`)
      marker.addTo(layer)
    })

    if (withCoords.length === 1) {
      map.setView([withCoords[0].lat!, withCoords[0].lon!], 14)
    } else if (withCoords.length > 1) {
      map.fitBounds(L.latLngBounds(withCoords.map(l => [l.lat!, l.lon!] as [number, number])), { padding: [40, 40], maxZoom: 14 })
    }
  }, [listings, mode])

  return <div className="search-map" ref={ref} aria-label="Map of homes" />
}
