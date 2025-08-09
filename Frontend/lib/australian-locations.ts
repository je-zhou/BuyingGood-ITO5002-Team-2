export interface AustralianLocation {
  state: string;
  suburbs: { name: string; postcode: string }[];
}

export const australianStates = [
  "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"
] as const;

export const australianStatesOptions = [
  { value: "NSW", label: "NSW" },
  { value: "VIC", label: "VIC" },
  { value: "QLD", label: "QLD" },
  { value: "WA", label: "WA" },
  { value: "SA", label: "SA" },
  { value: "TAS", label: "TAS" },
  { value: "ACT", label: "ACT" },
  { value: "NT", label: "NT" }
];

export type AustralianState = typeof australianStates[number];

export const australianLocations: Record<AustralianState, { name: string; postcode: string }[]> = {
  NSW: [
    { name: "Sydney", postcode: "2000" },
    { name: "Newcastle", postcode: "2300" },
    { name: "Wollongong", postcode: "2500" },
    { name: "Central Coast", postcode: "2250" },
    { name: "Tamworth", postcode: "2340" },
    { name: "Albury", postcode: "2640" },
    { name: "Dubbo", postcode: "2830" },
    { name: "Orange", postcode: "2800" },
    { name: "Lismore", postcode: "2480" },
    { name: "Wagga Wagga", postcode: "2650" },
    { name: "Port Macquarie", postcode: "2444" },
    { name: "Coffs Harbour", postcode: "2450" },
    { name: "Bathurst", postcode: "2795" },
    { name: "Nowra", postcode: "2541" },
    { name: "Queanbeyan", postcode: "2620" },
    { name: "Griffith", postcode: "2680" },
    { name: "Armidale", postcode: "2350" },
    { name: "Broken Hill", postcode: "2880" },
    { name: "Camden", postcode: "2570" },
    { name: "Campbelltown", postcode: "2560" }
  ],
  VIC: [
    { name: "Melbourne", postcode: "3000" },
    { name: "Geelong", postcode: "3220" },
    { name: "Ballarat", postcode: "3350" },
    { name: "Bendigo", postcode: "3550" },
    { name: "Latrobe Valley", postcode: "3840" },
    { name: "Shepparton", postcode: "3630" },
    { name: "Wodonga", postcode: "3690" },
    { name: "Warrnambool", postcode: "3280" },
    { name: "Horsham", postcode: "3400" },
    { name: "Sale", postcode: "3850" },
    { name: "Mildura", postcode: "3500" },
    { name: "Wangaratta", postcode: "3677" },
    { name: "Hamilton", postcode: "3300" },
    { name: "Portland", postcode: "3305" },
    { name: "Colac", postcode: "3250" },
    { name: "Castlemaine", postcode: "3450" },
    { name: "Kyneton", postcode: "3444" },
    { name: "Daylesford", postcode: "3460" },
    { name: "Echuca", postcode: "3564" },
    { name: "Swan Hill", postcode: "3585" }
  ],
  QLD: [
    { name: "Brisbane", postcode: "4000" },
    { name: "Gold Coast", postcode: "4217" },
    { name: "Sunshine Coast", postcode: "4558" },
    { name: "Townsville", postcode: "4810" },
    { name: "Cairns", postcode: "4870" },
    { name: "Toowoomba", postcode: "4350" },
    { name: "Rockhampton", postcode: "4700" },
    { name: "Mackay", postcode: "4740" },
    { name: "Bundaberg", postcode: "4670" },
    { name: "Hervey Bay", postcode: "4655" },
    { name: "Gladstone", postcode: "4680" },
    { name: "Ipswich", postcode: "4305" },
    { name: "Logan", postcode: "4114" },
    { name: "Redlands", postcode: "4163" },
    { name: "Moreton Bay", postcode: "4506" },
    { name: "Mount Isa", postcode: "4825" },
    { name: "Maryborough", postcode: "4650" },
    { name: "Gympie", postcode: "4570" },
    { name: "Warwick", postcode: "4370" },
    { name: "Roma", postcode: "4455" }
  ],
  WA: [
    { name: "Perth", postcode: "6000" },
    { name: "Fremantle", postcode: "6160" },
    { name: "Bunbury", postcode: "6230" },
    { name: "Geraldton", postcode: "6530" },
    { name: "Kalgoorlie", postcode: "6430" },
    { name: "Albany", postcode: "6330" },
    { name: "Mandurah", postcode: "6210" },
    { name: "Rockingham", postcode: "6168" },
    { name: "Joondalup", postcode: "6027" },
    { name: "Armadale", postcode: "6112" },
    { name: "Port Hedland", postcode: "6721" },
    { name: "Karratha", postcode: "6714" },
    { name: "Broome", postcode: "6725" },
    { name: "Busselton", postcode: "6280" },
    { name: "Esperance", postcode: "6450" },
    { name: "Northam", postcode: "6401" },
    { name: "Merredin", postcode: "6415" },
    { name: "Narrogin", postcode: "6312" },
    { name: "Collie", postcode: "6225" },
    { name: "Katanning", postcode: "6317" }
  ],
  SA: [
    { name: "Adelaide", postcode: "5000" },
    { name: "Mount Gambier", postcode: "5290" },
    { name: "Whyalla", postcode: "5600" },
    { name: "Murray Bridge", postcode: "5253" },
    { name: "Port Augusta", postcode: "5700" },
    { name: "Port Pirie", postcode: "5540" },
    { name: "Port Lincoln", postcode: "5606" },
    { name: "Victor Harbor", postcode: "5211" },
    { name: "Gawler", postcode: "5118" },
    { name: "Kadina", postcode: "5554" },
    { name: "Berri", postcode: "5343" },
    { name: "Naracoorte", postcode: "5271" },
    { name: "Clare", postcode: "5453" },
    { name: "Millicent", postcode: "5280" },
    { name: "Renmark", postcode: "5341" },
    { name: "Loxton", postcode: "5333" },
    { name: "Kingscote", postcode: "5223" },
    { name: "Ceduna", postcode: "5690" },
    { name: "Coober Pedy", postcode: "5723" },
    { name: "Roxby Downs", postcode: "5725" }
  ],
  TAS: [
    { name: "Hobart", postcode: "7000" },
    { name: "Launceston", postcode: "7250" },
    { name: "Devonport", postcode: "7310" },
    { name: "Burnie", postcode: "7320" },
    { name: "Ulverstone", postcode: "7315" },
    { name: "Glenorchy", postcode: "7010" },
    { name: "Clarence", postcode: "7018" },
    { name: "Kingborough", postcode: "7051" },
    { name: "Sorell", postcode: "7172" },
    { name: "Brighton", postcode: "7030" },
    { name: "New Norfolk", postcode: "7140" },
    { name: "Smithton", postcode: "7330" },
    { name: "Wynyard", postcode: "7325" },
    { name: "George Town", postcode: "7253" },
    { name: "St Helens", postcode: "7216" },
    { name: "Scottsdale", postcode: "7260" },
    { name: "Queenstown", postcode: "7467" },
    { name: "Zeehan", postcode: "7469" },
    { name: "Strahan", postcode: "7468" },
    { name: "Swansea", postcode: "7190" }
  ],
  ACT: [
    { name: "Canberra", postcode: "2600" },
    { name: "Belconnen", postcode: "2617" },
    { name: "Woden", postcode: "2606" },
    { name: "Tuggeranong", postcode: "2900" },
    { name: "Gungahlin", postcode: "2912" },
    { name: "Molonglo Valley", postcode: "2611" },
    { name: "Jerrabomberra", postcode: "2619" }
  ],
  NT: [
    { name: "Darwin", postcode: "0800" },
    { name: "Alice Springs", postcode: "0870" },
    { name: "Katherine", postcode: "0850" },
    { name: "Tennant Creek", postcode: "0860" },
    { name: "Nhulunbuy", postcode: "0880" },
    { name: "Palmerston", postcode: "0830" },
    { name: "Casuarina", postcode: "0810" },
    { name: "Nightcliff", postcode: "0814" },
    { name: "Stuart Park", postcode: "0820" },
    { name: "Marrara", postcode: "0812" },
    { name: "Humpty Doo", postcode: "0836" },
    { name: "Howard Springs", postcode: "0835" },
    { name: "Batchelor", postcode: "0845" },
    { name: "Pine Creek", postcode: "0847" },
    { name: "Jabiru", postcode: "0886" }
  ]
};

export function getSuburbsForState(state: AustralianState): { name: string; postcode: string }[] {
  return australianLocations[state] || [];
}

export function getSuburbsOptionsForState(state: AustralianState): { value: string; label: string }[] {
  const suburbs = australianLocations[state] || [];
  return suburbs.map(suburb => ({
    value: suburb.name,
    label: suburb.name
  }));
}

export function getPostcodeForSuburb(state: AustralianState, suburb: string): string | null {
  const suburbs = australianLocations[state] || [];
  const found = suburbs.find(s => s.name === suburb);
  return found ? found.postcode : null;
}