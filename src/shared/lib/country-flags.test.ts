import { describe, it, expect } from 'vitest'
import { getCountryFlag } from './country-flags'

describe('Country Flags', () => {
  describe('getCountryFlag', () => {
    it('should return correct flag for England', () => {
      expect(getCountryFlag('England')).toBe('🏴󠁧󠁢󠁥󠁮󠁧󠁿')
    })

    it('should return correct flag for Spain', () => {
      expect(getCountryFlag('Spain')).toBe('🇪🇸')
    })

    it('should return correct flag for Germany', () => {
      expect(getCountryFlag('Germany')).toBe('🇩🇪')
    })

    it('should return correct flag for France', () => {
      expect(getCountryFlag('France')).toBe('🇫🇷')
    })

    it('should return correct flag for Italy', () => {
      expect(getCountryFlag('Italy')).toBe('🇮🇹')
    })

    it('should return correct flag for Portugal', () => {
      expect(getCountryFlag('Portugal')).toBe('🇵🇹')
    })

    it('should return correct flag for Netherlands', () => {
      expect(getCountryFlag('Netherlands')).toBe('🇳🇱')
    })

    it('should return correct flag for Brazil', () => {
      expect(getCountryFlag('Brazil')).toBe('🇧🇷')
    })

    it('should return correct flag for Argentina', () => {
      expect(getCountryFlag('Argentina')).toBe('🇦🇷')
    })

    it('should return default world flag for unknown country', () => {
      expect(getCountryFlag('Unknown Country')).toBe('🌍')
    })

    it('should return default world flag for empty string', () => {
      expect(getCountryFlag('')).toBe('🌍')
    })

    it('should be case sensitive', () => {
      expect(getCountryFlag('spain')).toBe('🌍') // lowercase should not match
      expect(getCountryFlag('SPAIN')).toBe('🌍') // uppercase should not match
      expect(getCountryFlag('Spain')).toBe('🇪🇸') // exact case should match
    })

    it('should handle null or undefined gracefully', () => {
      // TypeScript would prevent this, but let's test runtime behavior
      expect(getCountryFlag(null as any)).toBe('🌍')
      expect(getCountryFlag(undefined as any)).toBe('🌍')
    })

    it('should handle non-string inputs', () => {
      expect(getCountryFlag(123 as any)).toBe('🌍')
      expect(getCountryFlag([] as any)).toBe('🌍')
      expect(getCountryFlag({} as any)).toBe('🌍')
    })

    it('should handle whitespace and special characters', () => {
      expect(getCountryFlag(' Spain ')).toBe('🌍') // spaces should not match
      expect(getCountryFlag('Spain!')).toBe('🌍') // special chars should not match
      expect(getCountryFlag('Spain\n')).toBe('🌍') // newlines should not match
    })

    it('should return all originally supported countries correctly', () => {
      const originalCountries = {
        'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'Spain': '🇪🇸',
        'Germany': '🇩🇪',
        'France': '🇫🇷',
        'Italy': '🇮🇹',
        'Portugal': '🇵🇹',
        'Netherlands': '🇳🇱',
        'Brazil': '🇧🇷',
        'Argentina': '🇦🇷'
      }

      Object.entries(originalCountries).forEach(([country, expectedFlag]) => {
        expect(getCountryFlag(country)).toBe(expectedFlag)
      })
    })

    it('should return correct flags for new European countries', () => {
      const europeanCountries = {
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
        'Turkey': '🇹🇷'
      }

      Object.entries(europeanCountries).forEach(([country, expectedFlag]) => {
        expect(getCountryFlag(country)).toBe(expectedFlag)
      })
    })

    it('should return correct flags for South American countries', () => {
      const southAmericanCountries = {
        'Uruguay': '🇺🇾',
        'Colombia': '🇨🇴',
        'Chile': '🇨🇱',
        'Peru': '🇵🇪',
        'Ecuador': '🇪🇨',
        'Paraguay': '🇵🇾',
        'Bolivia': '🇧🇴',
        'Venezuela': '🇻🇪'
      }

      Object.entries(southAmericanCountries).forEach(([country, expectedFlag]) => {
        expect(getCountryFlag(country)).toBe(expectedFlag)
      })
    })

    it('should return correct flags for North American countries', () => {
      const northAmericanCountries = {
        'United States': '🇺🇸',
        'Mexico': '🇲🇽',
        'Canada': '🇨🇦',
        'Costa Rica': '🇨🇷',
        'Jamaica': '🇯🇲',
        'Panama': '🇵🇦',
        'Honduras': '🇭🇳'
      }

      Object.entries(northAmericanCountries).forEach(([country, expectedFlag]) => {
        expect(getCountryFlag(country)).toBe(expectedFlag)
      })
    })

    it('should return correct flags for Asian countries', () => {
      const asianCountries = {
        'Japan': '🇯🇵',
        'South Korea': '🇰🇷',
        'Australia': '🇦🇺',
        'Iran': '🇮🇷',
        'Saudi Arabia': '🇸🇦',
        'Qatar': '🇶🇦',
        'China': '🇨🇳',
        'India': '🇮🇳'
      }

      Object.entries(asianCountries).forEach(([country, expectedFlag]) => {
        expect(getCountryFlag(country)).toBe(expectedFlag)
      })
    })

    it('should return correct flags for African countries', () => {
      const africanCountries = {
        'Nigeria': '🇳🇬',
        'Morocco': '🇲🇦',
        'Egypt': '🇪🇬',
        'Algeria': '🇩🇿',
        'Tunisia': '🇹🇳',
        'Senegal': '🇸🇳',
        'Ghana': '🇬🇭',
        'South Africa': '🇿🇦'
      }

      Object.entries(africanCountries).forEach(([country, expectedFlag]) => {
        expect(getCountryFlag(country)).toBe(expectedFlag)
      })
    })

    it('should consistently return world flag for unsupported countries', () => {
      const unsupportedCountries = [
        'Random Country', 'NonExistent', '123456', 'Atlantis',
        'Wakanda', 'Middle Earth', 'Test Country'
      ]

      unsupportedCountries.forEach(country => {
        expect(getCountryFlag(country)).toBe('🌍')
      })
    })
  })
})
