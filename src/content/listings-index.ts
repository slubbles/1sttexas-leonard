import type { Listing } from "./listing-type"

import { baytownListings } from "./listings-baytown"
import { clearlakeshoresListings } from "./listings-clear-lake-shores"
import { deerparkListings } from "./listings-deer-park"
import { dickinsonListings } from "./listings-dickinson"
import { ellagoListings } from "./listings-el-lago"
import { friendswoodListings } from "./listings-friendswood"
import { galvestonListings } from "./listings-galveston"
import { kemahListings } from "./listings-kemah"
import { laporteListings } from "./listings-la-porte"
import { leaguecityListings } from "./listings-league-city"
import { nassaubayListings } from "./listings-nassau-bay"
import { pasadenaListings } from "./listings-pasadena"
import { pearlandListings } from "./listings-pearland"
import { sanleonListings } from "./listings-san-leon"
import { seabrookListings } from "./listings-seabrook"
import { shoreacresListings } from "./listings-shoreacres"
import { taylorlakevillageListings } from "./listings-taylor-lake-village"
import { texascityListings } from "./listings-texas-city"
import { tikiislandListings } from "./listings-tiki-island"
import { websterListings } from "./listings-webster"

// Central registry of scraped property listings per area (from client IDX Broker widgets).
export const listingsByArea: Record<string, Listing[]> = {
  'baytown': baytownListings,
  'clear-lake-shores': clearlakeshoresListings,
  'deer-park': deerparkListings,
  'dickinson': dickinsonListings,
  'el-lago': ellagoListings,
  'friendswood': friendswoodListings,
  'galveston': galvestonListings,
  'kemah': kemahListings,
  'la-porte': laporteListings,
  'league-city': leaguecityListings,
  'nassau-bay': nassaubayListings,
  'pasadena': pasadenaListings,
  'pearland': pearlandListings,
  'san-leon': sanleonListings,
  'seabrook': seabrookListings,
  'shoreacres': shoreacresListings,
  'taylor-lake-village': taylorlakevillageListings,
  'texas-city': texascityListings,
  'tiki-island': tikiislandListings,
  'webster': websterListings,
}
