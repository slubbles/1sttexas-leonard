import type { Listing } from "./listing-type"

import { baytownRentListings } from "./rentals-baytown"
import { clearlakeshoresRentListings } from "./rentals-clear-lake-shores"
import { deerparkRentListings } from "./rentals-deer-park"
import { dickinsonRentListings } from "./rentals-dickinson"
import { ellagoRentListings } from "./rentals-el-lago"
import { friendswoodRentListings } from "./rentals-friendswood"
import { galvestonRentListings } from "./rentals-galveston"
import { kemahRentListings } from "./rentals-kemah"
import { laporteRentListings } from "./rentals-la-porte"
import { leaguecityRentListings } from "./rentals-league-city"
import { nassaubayRentListings } from "./rentals-nassau-bay"
import { pasadenaRentListings } from "./rentals-pasadena"
import { pearlandRentListings } from "./rentals-pearland"
import { sanleonRentListings } from "./rentals-san-leon"
import { seabrookRentListings } from "./rentals-seabrook"
import { texascityRentListings } from "./rentals-texas-city"
import { tikiislandRentListings } from "./rentals-tiki-island"
import { websterRentListings } from "./rentals-webster"

// Central registry of scraped rental listings per area (from client IDX Broker widgets).
export const rentalsByArea: Record<string, Listing[]> = {
  'baytown': baytownRentListings,
  'clear-lake-shores': clearlakeshoresRentListings,
  'deer-park': deerparkRentListings,
  'dickinson': dickinsonRentListings,
  'el-lago': ellagoRentListings,
  'friendswood': friendswoodRentListings,
  'galveston': galvestonRentListings,
  'kemah': kemahRentListings,
  'la-porte': laporteRentListings,
  'league-city': leaguecityRentListings,
  'nassau-bay': nassaubayRentListings,
  'pasadena': pasadenaRentListings,
  'pearland': pearlandRentListings,
  'san-leon': sanleonRentListings,
  'seabrook': seabrookRentListings,
  'texas-city': texascityRentListings,
  'tiki-island': tikiislandRentListings,
  'webster': websterRentListings,
}
