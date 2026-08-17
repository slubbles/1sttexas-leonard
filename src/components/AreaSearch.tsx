'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { listingsByArea } from '@/content/listings-index'
import { rentalsByArea } from '@/content/rentals-index'

const num = (s?: string) => parseInt((s || '').replace(/[^0-9]/g, ''), 10) || 0

// Same filter options as the Home Search — scoped to ONE area (buy or rent)
export function AreaSearch({ area, rent, count }: { area: string; rent: boolean; count: number }) {
  const [maxPrice, setMaxPrice] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [minSize, setMinSize] = useState('')
  const [beds, setBeds] = useState('')
  const [baths, setBaths] = useState('')
  const [acres, setAcres] = useState('')
  const [sort, setSort] = useState('newest')

  const pool = (rent ? rentalsByArea : listingsByArea)[area] || []
  const maxP = num(maxPrice)
  const minP = num(minPrice)
  const minS = num(minSize)
  const minBeds = num(beds)
  const minBaths = num(baths)
  const minAcres = num(acres)

  const results = useMemo(() => {
    let list = pool
      .filter(l => !maxP || num(l.price) <= maxP)
      .filter(l => !minP || num(l.price) >= minP)
      .filter(l => !minS || num(l.sqft) >= minS)
      .filter(l => !minBeds || num(l.beds) >= minBeds)
      .filter(l => !minBaths || num(l.baths) >= minBaths)
      .filter(l => !minAcres || num(l.acres) >= minAcres)
    if (sort === 'price-asc') list = [...list].sort((x, y) => num(x.price) - num(y.price))
    if (sort === 'price-desc') list = [...list].sort((x, y) => num(y.price) - num(x.price))
    return list
  }, [pool, maxP, minP, minS, minBeds, minBaths, minAcres, sort])

  const priceOptions = ['Any price', '$100,000', '$150,000', '$200,000', '$250,000', '$300,000', '$400,000', '$500,000', '$750,000', '$1,000,000', '$1,500,000']
  const sizeOptions = ['Any size', '1,000 sqft', '1,500 sqft', '2,000 sqft', '2,500 sqft', '3,000 sqft', '4,000 sqft']
  const bedsOptions = ['Any beds', '1+', '2+', '3+', '4+', '5+']
  const bathsOptions = ['Any baths', '1+', '2+', '3+', '4+']
  const acresOptions = ['Any acres', '0.25+', '0.5+', '1+', '2+', '5+']

  return <div className="area-search">
    <div className="search-filters">
      <div className="search-field"><label htmlFor={`${area}-min`}>Min Price</label><select id={`${area}-min`} value={minPrice} onChange={e => setMinPrice(e.target.value)}>{priceOptions.map(p => <option key={p} value={p === 'Any price' ? '' : p}>{p}</option>)}</select></div>
      <div className="search-field"><label htmlFor={`${area}-max`}>Max Price</label><select id={`${area}-max`} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>{priceOptions.map(p => <option key={p} value={p === 'Any price' ? '' : p}>{p}</option>)}</select></div>
      <div className="search-field"><label htmlFor={`${area}-beds`}>Bedrooms</label><select id={`${area}-beds`} value={beds} onChange={e => setBeds(e.target.value)}>{bedsOptions.map(b => <option key={b} value={b === 'Any beds' ? '' : b}>{b}</option>)}</select></div>
      <div className="search-field"><label htmlFor={`${area}-baths`}>Bathrooms</label><select id={`${area}-baths`} value={baths} onChange={e => setBaths(e.target.value)}>{bathsOptions.map(b => <option key={b} value={b === 'Any baths' ? '' : b}>{b}</option>)}</select></div>
    </div>
    <div className="search-filters">
      <div className="search-field"><label htmlFor={`${area}-size`}>House size</label><select id={`${area}-size`} value={minSize} onChange={e => setMinSize(e.target.value)}>{sizeOptions.map(s => <option key={s} value={s === 'Any size' ? '' : s}>{s}</option>)}</select></div>
      <div className="search-field"><label htmlFor={`${area}-acres`}>Acres</label><select id={`${area}-acres`} value={acres} onChange={e => setAcres(e.target.value)}>{acresOptions.map(a => <option key={a} value={a === 'Any acres' ? '' : a}>{a}</option>)}</select></div>
      <div className="search-field"><label htmlFor={`${area}-sort`}>Sort by</label><select id={`${area}-sort`} value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest Listings</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option></select></div>
    </div>
    <p className="search-count" role="status">{results.length} of {count} {rent ? 'rental' : 'home'}{count === 1 ? '' : 's'} in {area}{maxP && ` · up to ${maxPrice}`}{minS && ` · min ${minSize}`}</p>
    {results.length === 0 ? (
      <div className="search-empty"><p>No homes match those choices in {area} yet. Try a wider price or smaller size — or call us and we will find it for you.</p><Link className="button button-dark" href="/contact/">Ask a Realtor to find it <span>↗</span></Link></div>
    ) : (
      <div className="listing-grid">{results.map(l => <article className="listing-card" key={l.mls}>
        <div className="listing-card-media"><Image src={l.photo} alt={`${l.address}, ${l.city} TX`} fill sizes="(max-width: 700px) 100vw, 33vw" className="listing-card-img" loading="lazy" /><span className="listing-card-price">{l.price}</span></div>
        <div className="listing-card-body"><h3>{l.address}</h3><p className="listing-card-loc">{l.city}, TX {l.zip}</p><div className="listing-card-stats"><span><b>{num(l.beds) || '—'}</b> Beds</span><span><b>{num(l.baths) || '—'}</b> Baths</span>{l.sqft && <span><b>{l.sqft}</b> SqFt</span>}</div>{l.remarks && <p className="listing-card-remarks">{l.remarks}</p>}<p className="listing-card-mls">MLS#{l.mls} · {area} · {l.status || 'Active'}</p></div>
      </article>)}</div>
    )}
  </div>
}
