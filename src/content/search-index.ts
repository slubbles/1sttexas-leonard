import { listingsByArea } from './listings-index'
import { rentalsByArea } from './rentals-index'

// Flat searchable arrays for the Home Search page
// sale listings get kind 'buy', rentals get kind 'rent'
export const saleSearchListings = Object.entries(listingsByArea).flatMap(([area, list]) =>
  list.map(l => ({ ...l, area, kind: 'buy' as const })),
)
export const rentSearchListings = Object.entries(rentalsByArea).flatMap(([area, list]) =>
  list.map(l => ({ ...l, area, kind: 'rent' as const })),
)
export const allSearchListings = [...saleSearchListings, ...rentSearchListings]
