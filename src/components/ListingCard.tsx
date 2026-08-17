import Image from 'next/image'
import type { Listing } from '@/content/listing-type'

export function ListingCard({ listing }: { listing: Listing }) {
  const beds = listing.beds?.replace(' Bedrooms', '') || '—'
  const baths = listing.baths?.replace(' Total Baths', '') || '—'
  return <article className="listing-card">
    <div className="listing-card-media">
      <Image src={listing.photo} alt={`${listing.address}, ${listing.city} TX`} fill sizes="(max-width: 700px) 100vw, 33vw" className="listing-card-img" loading="lazy" />
      <span className="listing-card-price">{listing.price}</span>
    </div>
    <div className="listing-card-body">
      <h3>{listing.address}</h3>
      <p className="listing-card-loc">{listing.city}, TX {listing.zip}</p>
      <div className="listing-card-stats">
        <span><b>{beds}</b> Beds</span>
        <span><b>{baths}</b> Baths</span>
        {listing.sqft && <span><b>{listing.sqft}</b> SqFt</span>}
        {listing.acres && listing.acres !== 'None' && <span><b>{listing.acres}</b> Acres</span>}
      </div>
      <div className="listing-card-meta">
        {listing.yearBuilt && <span>Built {listing.yearBuilt}</span>}
        {listing.subdivision && <span>{listing.subdivision}</span>}
        {listing.county && <span>{listing.county} County</span>}
      </div>
      {listing.remarks && <p className="listing-card-remarks">{listing.remarks}</p>}
      <p className="listing-card-mls">MLS#{listing.mls} · {listing.status || 'Active'}</p>
    </div>
  </article>
}
