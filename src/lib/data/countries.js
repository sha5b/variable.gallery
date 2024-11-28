export const countries = [
    // European Union
    { code: 'AT', name: 'Austria', phoneCode: '+43', flag: '🇦🇹', group: 'EU' },
    { code: 'BE', name: 'Belgium', phoneCode: '+32', flag: '🇧🇪', group: 'EU' },
    { code: 'BG', name: 'Bulgaria', phoneCode: '+359', flag: '🇧🇬', group: 'EU' },
    { code: 'HR', name: 'Croatia', phoneCode: '+385', flag: '🇭🇷', group: 'EU' },
    { code: 'CY', name: 'Cyprus', phoneCode: '+357', flag: '🇨🇾', group: 'EU' },
    { code: 'CZ', name: 'Czech Republic', phoneCode: '+420', flag: '🇨🇿', group: 'EU' },
    { code: 'DK', name: 'Denmark', phoneCode: '+45', flag: '🇩🇰', group: 'EU' },
    { code: 'EE', name: 'Estonia', phoneCode: '+372', flag: '🇪🇪', group: 'EU' },
    { code: 'FI', name: 'Finland', phoneCode: '+358', flag: '🇫🇮', group: 'EU' },
    { code: 'FR', name: 'France', phoneCode: '+33', flag: '🇫🇷', group: 'EU' },
    { code: 'DE', name: 'Germany', phoneCode: '+49', flag: '🇩🇪', group: 'EU' },
    { code: 'GR', name: 'Greece', phoneCode: '+30', flag: '🇬🇷', group: 'EU' },
    { code: 'HU', name: 'Hungary', phoneCode: '+36', flag: '🇭🇺', group: 'EU' },
    { code: 'IE', name: 'Ireland', phoneCode: '+353', flag: '🇮🇪', group: 'EU' },
    { code: 'IT', name: 'Italy', phoneCode: '+39', flag: '🇮🇹', group: 'EU' },
    { code: 'LV', name: 'Latvia', phoneCode: '+371', flag: '🇱🇻', group: 'EU' },
    { code: 'LT', name: 'Lithuania', phoneCode: '+370', flag: '🇱🇹', group: 'EU' },
    { code: 'LU', name: 'Luxembourg', phoneCode: '+352', flag: '🇱🇺', group: 'EU' },
    { code: 'MT', name: 'Malta', phoneCode: '+356', flag: '🇲🇹', group: 'EU' },
    { code: 'NL', name: 'Netherlands', phoneCode: '+31', flag: '🇳🇱', group: 'EU' },
    { code: 'PL', name: 'Poland', phoneCode: '+48', flag: '🇵🇱', group: 'EU' },
    { code: 'PT', name: 'Portugal', phoneCode: '+351', flag: '🇵🇹', group: 'EU' },
    { code: 'RO', name: 'Romania', phoneCode: '+40', flag: '🇷🇴', group: 'EU' },
    { code: 'SK', name: 'Slovakia', phoneCode: '+421', flag: '🇸🇰', group: 'EU' },
    { code: 'SI', name: 'Slovenia', phoneCode: '+386', flag: '🇸🇮', group: 'EU' },
    { code: 'ES', name: 'Spain', phoneCode: '+34', flag: '🇪🇸', group: 'EU' },
    { code: 'SE', name: 'Sweden', phoneCode: '+46', flag: '🇸🇪', group: 'EU' },

    // Other European Countries
    { code: 'AL', name: 'Albania', phoneCode: '+355', flag: '🇦🇱', group: 'Europe' },
    { code: 'AD', name: 'Andorra', phoneCode: '+376', flag: '🇦🇩', group: 'Europe' },
    { code: 'BY', name: 'Belarus', phoneCode: '+375', flag: '🇧🇾', group: 'Europe' },
    { code: 'BA', name: 'Bosnia and Herzegovina', phoneCode: '+387', flag: '🇧🇦', group: 'Europe' },
    { code: 'CH', name: 'Switzerland', phoneCode: '+41', flag: '🇨🇭', group: 'Europe' },
    { code: 'GB', name: 'United Kingdom', phoneCode: '+44', flag: '🇬🇧', group: 'Europe' },
    { code: 'IS', name: 'Iceland', phoneCode: '+354', flag: '🇮🇸', group: 'Europe' },
    { code: 'LI', name: 'Liechtenstein', phoneCode: '+423', flag: '🇱🇮', group: 'Europe' },
    { code: 'MC', name: 'Monaco', phoneCode: '+377', flag: '🇲🇨', group: 'Europe' },
    { code: 'ME', name: 'Montenegro', phoneCode: '+382', flag: '🇲🇪', group: 'Europe' },
    { code: 'NO', name: 'Norway', phoneCode: '+47', flag: '🇳🇴', group: 'Europe' },
    { code: 'RS', name: 'Serbia', phoneCode: '+381', flag: '🇷🇸', group: 'Europe' },
    { code: 'UA', name: 'Ukraine', phoneCode: '+380', flag: '🇺🇦', group: 'Europe' },

    // Other Developed Countries
    { code: 'AU', name: 'Australia', phoneCode: '+61', flag: '🇦🇺', group: 'Developed' },
    { code: 'CA', name: 'Canada', phoneCode: '+1', flag: '🇨🇦', group: 'Developed' },
    { code: 'IL', name: 'Israel', phoneCode: '+972', flag: '🇮🇱', group: 'Developed' },
    { code: 'JP', name: 'Japan', phoneCode: '+81', flag: '🇯🇵', group: 'Developed' },
    { code: 'KR', name: 'South Korea', phoneCode: '+82', flag: '🇰🇷', group: 'Developed' },
    { code: 'NZ', name: 'New Zealand', phoneCode: '+64', flag: '🇳🇿', group: 'Developed' },
    { code: 'SG', name: 'Singapore', phoneCode: '+65', flag: '🇸🇬', group: 'Developed' },
    { code: 'US', name: 'United States', phoneCode: '+1', flag: '🇺🇸', group: 'Developed' },

    // Rest of World (Major Countries)
    { code: 'AR', name: 'Argentina', phoneCode: '+54', flag: '🇦🇷', group: 'Other' },
    { code: 'BR', name: 'Brazil', phoneCode: '+55', flag: '🇧🇷', group: 'Other' },
    { code: 'CN', name: 'China', phoneCode: '+86', flag: '🇨🇳', group: 'Other' },
    { code: 'EG', name: 'Egypt', phoneCode: '+20', flag: '🇪🇬', group: 'Other' },
    { code: 'IN', name: 'India', phoneCode: '+91', flag: '🇮🇳', group: 'Other' },
    { code: 'ID', name: 'Indonesia', phoneCode: '+62', flag: '🇮🇩', group: 'Other' },
    { code: 'MX', name: 'Mexico', phoneCode: '+52', flag: '🇲🇽', group: 'Other' },
    { code: 'MY', name: 'Malaysia', phoneCode: '+60', flag: '🇲🇾', group: 'Other' },
    { code: 'PK', name: 'Pakistan', phoneCode: '+92', flag: '🇵🇰', group: 'Other' },
    { code: 'PH', name: 'Philippines', phoneCode: '+63', flag: '🇵🇭', group: 'Other' },
    { code: 'RU', name: 'Russia', phoneCode: '+7', flag: '🇷🇺', group: 'Other' },
    { code: 'SA', name: 'Saudi Arabia', phoneCode: '+966', flag: '🇸🇦', group: 'Other' },
    { code: 'ZA', name: 'South Africa', phoneCode: '+27', flag: '🇿🇦', group: 'Other' },
    { code: 'TH', name: 'Thailand', phoneCode: '+66', flag: '🇹🇭', group: 'Other' },
    { code: 'TR', name: 'Turkey', phoneCode: '+90', flag: '🇹🇷', group: 'Other' },
    { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971', flag: '🇦🇪', group: 'Other' },
    { code: 'VN', name: 'Vietnam', phoneCode: '+84', flag: '🇻🇳', group: 'Other' }
  ];
  
  export const getCountryByCode = (code) => countries.find(country => country.code === code);

  export const getPhoneCodeByCountry = (code) => {
    const country = getCountryByCode(code);
    return country ? country.phoneCode : '';
  };

  export const getCountriesByGroup = (group) => countries.filter(country => country.group === group);