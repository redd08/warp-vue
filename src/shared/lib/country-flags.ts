const flags: Record<string, string> = {
  // UEFA European countries
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Spain': '🇪🇸',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Italy': '🇮🇹',
  'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Croatia': '🇭🇷',
  'Denmark': '🇩🇰',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Poland': '🇵🇱',
  'Czech Republic': '🇨🇿',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Ukraine': '🇺🇦',
  'Turkey': '🇹🇷',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Northern Ireland': '🇬🇧',
  'Republic of Ireland': '🇮🇪',
  'Serbia': '🇷🇸',
  'Slovenia': '🇸🇮',
  'Slovakia': '🇸🇰',
  'Hungary': '🇭🇺',
  'Romania': '🇷🇴',
  'Bulgaria': '🇧🇬',
  'Greece': '🇬🇷',
  'Finland': '🇫🇮',
  'Iceland': '🇮🇸',
  'Russia': '🇷🇺',
  
  // South American (CONMEBOL)
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Uruguay': '🇺🇾',
  'Colombia': '🇨🇴',
  'Chile': '🇨🇱',
  'Peru': '🇵🇪',
  'Ecuador': '🇪🇨',
  'Paraguay': '🇵🇾',
  'Bolivia': '🇧🇴',
  'Venezuela': '🇻🇪',
  
  // North/Central America (CONCACAF)
  'United States': '🇺🇸',
  'Mexico': '🇲🇽',
  'Canada': '🇨🇦',
  'Costa Rica': '🇨🇷',
  'Jamaica': '🇯🇲',
  'Panama': '🇵🇦',
  'Honduras': '🇭🇳',
  'Guatemala': '🇬🇹',
  'El Salvador': '🇸🇻',
  
  // Asian (AFC)
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'Australia': '🇦🇺',
  'Iran': '🇮🇷',
  'Saudi Arabia': '🇸🇦',
  'Qatar': '🇶🇦',
  'UAE': '🇦🇪',
  'Iraq': '🇮🇶',
  'China': '🇨🇳',
  'India': '🇮🇳',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Malaysia': '🇲🇾',
  'Singapore': '🇸🇬',
  'Indonesia': '🇮🇩',
  'Philippines': '🇵🇭',
  
  // African (CAF)
  'Nigeria': '🇳🇬',
  'Morocco': '🇲🇦',
  'Egypt': '🇪🇬',
  'Algeria': '🇩🇿',
  'Tunisia': '🇹🇳',
  'Senegal': '🇸🇳',
  'Ghana': '🇬🇭',
  'Cameroon': '🇨🇲',
  'Ivory Coast': '🇨🇮',
  'South Africa': '🇿🇦',
  'Kenya': '🇰🇪',
  'Mali': '🇲🇱',
  'Burkina Faso': '🇧🇫',
  'Cape Verde': '🇨🇻',
  'Guinea': '🇬🇳',
  
  // Oceania (OFC)
  'New Zealand': '🇳🇿',
  'Fiji': '🇫🇯',
  'Papua New Guinea': '🇵🇬'
}

export const getCountryFlag = (country: string): string => {
  return flags[country] || '🌍'
}

export interface CountryOption {
  value: string
  label: string
  flag: string
}

export const getCountries = (): CountryOption[] => {
  return Object.entries(flags)
    .map(([country, flag]) => ({
      value: country.toLowerCase().replace(/\s+/g, '-'),
      label: country,
      flag: flag
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
