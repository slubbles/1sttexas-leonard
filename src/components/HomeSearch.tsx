'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { allSearchListings, saleSearchListings, rentSearchListings } from '@/content/search-index'

// lazy-load leaflet map so it never blocks the page
const SearchMap = dynamic(() => import('./SearchMap'), { ssr: false, loading: () => <div className="search-map-loading">Loading map…</div> })

type Mode = 'buy' | 'rent' | 'sell'
type Tab = 'advanced' | 'listingid' | 'address' | 'map'

const LOCATIONS = Array.from(new Set([
  'Baytown', 'Clear Lake City', 'Clear Lake Shores', 'Deer Park', 'Dickinson',
  'El Lago', 'Friendswood', 'Galveston', 'Kemah', 'La Porte', 'League City',
  'Nassau Bay', 'Pasadena', 'Pearland', 'San Leon', 'Seabrook', 'Shoreacres',
  'Taylor Lake Village', 'Texas City', 'Tiki Island', 'Webster',
  ...allSearchListings.map(l => l.city).filter(Boolean),
])).sort()

const PROPERTY_TYPES = ['Residential', 'Single Family Residential', 'Rental Income', 'Lease', 'Farms', 'Lots and Land', 'Other', 'Townhouse', 'Condominium']
const num = (s?: string) => parseInt((s || '').replace(/[^0-9]/g, ''), 10) || 0

export function HomeSearch() {
  const [mode, setMode] = useState<Mode>('buy')
  const [tab, setTab] = useState<Tab>('advanced')
  // advanced + address + map filters
  const [query, setQuery] = useState('')
  const [address, setAddress] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [minSize, setMinSize] = useState('')
  const [beds, setBeds] = useState('')
  const [baths, setBaths] = useState('')
  const [acres, setAcres] = useState('')
  const [propType, setPropType] = useState('')
  const [mlsId, setMlsId] = useState('')
  const [sort, setSort] = useState('newest')
  const [showSugg, setShowSugg] = useState(false)

  const pool = mode === 'rent' ? rentSearchListings : mode === 'buy' ? saleSearchListings : []
  const maxP = num(maxPrice)
  const minP = num(minPrice)
  const minS = num(minSize)
  const minBeds = num(beds)
  const minBaths = num(baths)
  const minAcres = num(acres)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const a = address.trim().toLowerCase()
    let list = pool
      .filter(l => !q || `${l.address} ${l.city} ${l.area} ${l.zip}`.toLowerCase().includes(q))
      .filter(l => !a || `${l.address} ${l.city} ${l.zip}`.toLowerCase().includes(a))
      .filter(l => !maxP || num(l.price) <= maxP)
      .filter(l => !minP || num(l.price) >= minP)
      .filter(l => !minS || num(l.sqft) >= minS)
      .filter(l => !minBeds || num(l.beds) >= minBeds)
      .filter(l => !minBaths || num(l.baths) >= minBaths)
      .filter(l => !minAcres || num(l.acres) >= minAcres)
      .filter(l => !propType || `${l.city} ${l.subdivision} ${l.propertyType || ''}`.toLowerCase().includes(propType.toLowerCase()))
    if (sort === 'price-asc') list = [...list].sort((x, y) => num(x.price) - num(y.price))
    if (sort === 'price-desc') list = [...list].sort((x, y) => num(y.price) - num(x.price))
    return list
  }, [pool, query, address, maxP, minP, minS, minBeds, minBaths, minAcres, propType, sort])

  const results = useMemo(() => filtered.slice(0, 24), [filtered])
  const mlsResult = useMemo(() => {
    const id = mlsId.trim()
    if (!id) return null
    return allSearchListings.find(l => l.mls === id) || null
  }, [mlsId])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return LOCATIONS.slice(0, 8)
    return LOCATIONS.filter(l => l.toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  const priceOptions = ['Any price', '$100,000', '$150,000', '$200,000', '$250,000', '$300,000', '$400,000', '$500,000', '$750,000', '$1,000,000', '$1,500,000']
  const sizeOptions = ['Any size', '1,000 sqft', '1,500 sqft', '2,000 sqft', '2,500 sqft', '3,000 sqft', '4,000 sqft']
  const bedsOptions = ['Any beds', '1+', '2+', '3+', '4+', '5+']
  const bathsOptions = ['Any baths', '1+', '2+', '3+', '4+']
  const acresOptions = ['Any acres', '0.25+', '0.5+', '1+', '2+', '5+']

  return <div className="home-search-wrap">
    {/* Buy / Rent / Sell */}
    <div className="search-mode-tabs" role="tablist" aria-label="Choose what you are looking for">
      {(['buy', 'rent', 'sell'] as Mode[]).map(m => (
        <button key={m} role="tab" aria-selected={mode === m} className={`search-mode-tab${mode === m ? ' active' : ''}`} onClick={() => setMode(m)}>
          {m === 'buy' ? 'Buying a home' : m === 'rent' ? 'Renting a home' : 'Selling a home'}
        </button>
      ))}
    </div>

    {/* IDX-style search tabs */}
    <div className="idx-tabs" role="tablist" aria-label="Search method">
      {([['advanced', 'Advanced Search'], ['listingid', 'Listing ID'], ['address', 'Address'], ['map', 'Map Search']] as [Tab, string][]).map(([t, label]) => (
        <button key={t} role="tab" aria-selected={tab === t} className={`idx-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{label}</button>
      ))}
    </div>

    {mode === 'sell' ? (
      <div className="search-sell-card">
        <h2>Ready to sell?</h2>
        <p>We will complete a free Market Analysis to determine the most accurate price for your home — using comparable sales, current listings, and all amenities — with no obligation.</p>
        <Link className="button button-red" href="/contact/">Get a free Market Analysis <span>↗</span></Link>
      </div>
    ) : tab === 'listingid' ? (
      <div className="idx-panel">
        <div className="search-field">
          <label htmlFor="hs-mls">Listing ID (MLS number)</label>
          <input id="hs-mls" type="text" value={mlsId} onChange={e => setMlsId(e.target.value)} placeholder="e.g. 7317390" autoComplete="off" />
        </div>
        {mlsResult ? (
          <div className="listing-grid"><SearchResultCard l={mlsResult} /></div>
        ) : mlsId.trim() ? (
          <p className="search-empty">No listing found with that ID. Check the number, or contact a Realtor for help.</p>
        ) : (
          <p className="field-hint">Enter the MLS number from a listing to open it instantly.</p>
        )}
      </div>
    ) : tab === 'address' ? (
      <div className="idx-panel">
        <div className="search-filters">
          <div className="search-field">
            <label htmlFor="hs-ptype-addr">Property Type</label>
            <select id="hs-ptype-addr" value={propType} onChange={e => setPropType(e.target.value)}>
              <option value="">Residential</option>
              {PROPERTY_TYPES.filter(t => t !== 'Residential').map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="search-field">
            <label htmlFor="hs-city-addr">City</label>
            <input id="hs-city-addr" type="text" value={query} onChange={e => { setQuery(e.target.value); setShowSugg(true) }} onFocus={() => setShowSugg(true)} onBlur={() => setTimeout(() => setShowSugg(false), 150)} placeholder="City" autoComplete="off" />
            {showSugg && <ul className="search-suggestions">{suggestions.map(s => <li key={s} onMouseDown={() => { setQuery(s); setShowSugg(false) }}><span>📍</span>{s}</li>)}</ul>}
          </div>
          <div className="search-field">
            <label htmlFor="hs-street-addr">Address</label>
            <input id="hs-street-addr" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" autoComplete="off" />
          </div>
        </div>
        <SearchResults results={results} count={filtered.length} mode={mode} query={query} maxPrice={maxPrice} />
      </div>
    ) : tab === 'map' ? (
      <div className="idx-panel">
        <div className="search-filters map-filters">
          <div className="search-field"><label htmlFor="hs-map-min">Min Price</label><select id="hs-map-min" value={minPrice} onChange={e => setMinPrice(e.target.value)}>{priceOptions.map(p => <option key={p} value={p === 'Any price' ? '' : p}>{p}</option>)}</select></div>
          <div className="search-field"><label htmlFor="hs-map-max">Max Price</label><select id="hs-map-max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>{priceOptions.map(p => <option key={p} value={p === 'Any price' ? '' : p}>{p}</option>)}</select></div>
          <div className="search-field"><label htmlFor="hs-map-beds">Bedrooms</label><select id="hs-map-beds" value={beds} onChange={e => setBeds(e.target.value)}>{bedsOptions.map(b => <option key={b} value={b === 'Any beds' ? '' : b}>{b}</option>)}</select></div>
          <div className="search-field"><label htmlFor="hs-map-size">House size</label><select id="hs-map-size" value={minSize} onChange={e => setMinSize(e.target.value)}>{sizeOptions.map(s => <option key={s} value={s === 'Any size' ? '' : s}>{s}</option>)}</select></div>
        </div>
        <p className="search-count" role="status">Found {filtered.length} of {pool.length} listings</p>
        <SearchMap listings={filtered} mode={mode} />
      </div>
    ) : (
      <div className="idx-panel">
        <div className="search-filters">
          <div className="search-field"><label htmlFor="hs-ptype">Property Type</label><select id="hs-ptype" value={propType} onChange={e => setPropType(e.target.value)}><option value="">Residential</option>{PROPERTY_TYPES.filter(t => t !== 'Residential').map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div className="search-field">
            <label htmlFor="hs-city">City</label>
            <input id="hs-city" type="text" value={query} onChange={e => { setQuery(e.target.value); setShowSugg(true) }} onFocus={() => setShowSugg(true)} onBlur={() => setTimeout(() => setShowSugg(false), 150)} placeholder="City" autoComplete="off" role="combobox" aria-expanded={showSugg} aria-controls="hs-suggestions" />
            {showSugg && <ul className="search-suggestions" id="hs-suggestions" role="listbox">{suggestions.map(s => <li key={s} role="option" onMouseDown={() => { setQuery(s); setShowSugg(false) }}><span>📍</span>{s}</li>)}</ul>}
          </div>
          <div className="search-field"><label htmlFor="hs-beds">Bedrooms</label><select id="hs-beds" value={beds} onChange={e => setBeds(e.target.value)}>{bedsOptions.map(b => <option key={b} value={b === 'Any beds' ? '' : b}>{b}</option>)}</select></div>
          <div className="search-field"><label htmlFor="hs-size">SqFt</label><select id="hs-size" value={minSize} onChange={e => setMinSize(e.target.value)}>{sizeOptions.map(s => <option key={s} value={s === 'Any size' ? '' : s}>{s}</option>)}</select></div>
        </div>
        <div className="search-filters">
          <div className="search-field"><label htmlFor="hs-minprice">Min Price</label><select id="hs-minprice" value={minPrice} onChange={e => setMinPrice(e.target.value)}>{priceOptions.map(p => <option key={p} value={p === 'Any price' ? '' : p}>{p}</option>)}</select></div>
          <div className="search-field"><label htmlFor="hs-maxprice">Max Price</label><select id="hs-maxprice" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>{priceOptions.map(p => <option key={p} value={p === 'Any price' ? '' : p}>{p}</option>)}</select></div>
          <div className="search-field"><label htmlFor="hs-baths">Bathrooms</label><select id="hs-baths" value={baths} onChange={e => setBaths(e.target.value)}>{bathsOptions.map(b => <option key={b} value={b === 'Any baths' ? '' : b}>{b}</option>)}</select></div>
          <div className="search-field"><label htmlFor="hs-acres">Acres</label><select id="hs-acres" value={acres} onChange={e => setAcres(e.target.value)}>{acresOptions.map(a => <option key={a} value={a === 'Any acres' ? '' : a}>{a}</option>)}</select></div>
        </div>
        <div className="search-filters idx-sort-row">
          <div className="search-field"><label htmlFor="hs-sort">Sort by</label><select id="hs-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest Listings</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option></select></div>
        </div>
        <SearchResults results={results} count={filtered.length} mode={mode} query={query} maxPrice={maxPrice} />
      </div>
    )}
  </div>
}

function SearchResults({ results, count, mode, query, maxPrice }: { results: any[]; count: number; mode: Mode; query: string; maxPrice: string }) {
  return <>
    <p className="search-count" role="status">{count} {mode === 'rent' ? 'rental' : 'home'}{count === 1 ? '' : 's'} found{query && ` in ${query}`}{maxPrice && ` · up to ${maxPrice}`}</p>
    {results.length === 0 ? (
      <div className="search-empty"><p>No homes match those choices yet. Try a wider price, a smaller size, or a different area — or call us and we will find it for you.</p><Link className="button button-dark" href="/contact/">Ask a Realtor to find it <span>↗</span></Link></div>
    ) : (
      <div className="listing-grid">{results.map(l => <SearchResultCard key={l.mls} l={l} />)}</div>
    )}
  </>
}

function SearchResultCard({ l }: { l: any }) {
  return <article className="listing-card">
    <div className="listing-card-media"><Image src={l.photo} alt={`${l.address}, ${l.city} TX`} fill sizes="(max-width: 700px) 100vw, 33vw" className="listing-card-img" loading="lazy" /><span className="listing-card-price">{l.price}</span></div>
    <div className="listing-card-body"><h3>{l.address}</h3><p className="listing-card-loc">{l.city}, TX {l.zip}</p><div className="listing-card-stats"><span><b>{num(l.beds) || '—'}</b> Beds</span><span><b>{num(l.baths) || '—'}</b> Baths</span>{l.sqft && <span><b>{l.sqft}</b> SqFt</span>}</div>{l.remarks && <p className="listing-card-remarks">{l.remarks}</p>}<p className="listing-card-mls">MLS#{l.mls} · {l.area} · {l.status || 'Active'}</p></div>
  </article>
}
