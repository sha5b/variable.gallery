export const countries = [
    // European Union
    { code: 'AT', name: 'Austria', phoneCode: '+43', flag: '🇦🇹', group: 'EU' },
    { code: 'DE', name: 'Germany', phoneCode: '+49', flag: '🇩🇪', group: 'EU' },
    { code: 'FR', name: 'France', phoneCode: '+33', flag: '🇫🇷', group: 'EU' },
    { code: 'IT', name: 'Italy', phoneCode: '+39', flag: '🇮🇹', group: 'EU' },
    { code: 'ES', name: 'Spain', phoneCode: '+34', flag: '🇪🇸', group: 'EU' },
    
    // Non-EU Europe
    { code: 'CH', name: 'Switzerland', phoneCode: '+41', flag: '🇨🇭', group: 'Europe' },
    { code: 'GB', name: 'United Kingdom', phoneCode: '+44', flag: '🇬🇧', group: 'Europe' },
    { code: 'NO', name: 'Norway', phoneCode: '+47', flag: '🇳🇴', group: 'Europe' },
    
    // Other Developed
    { code: 'US', name: 'United States', phoneCode: '+1', flag: '🇺🇸', group: 'Developed' },
    { code: 'CA', name: 'Canada', phoneCode: '+1', flag: '🇨🇦', group: 'Developed' },
    { code: 'JP', name: 'Japan', phoneCode: '+81', flag: '🇯🇵', group: 'Developed' },
    
    // Rest of World
    { code: 'CN', name: 'China', phoneCode: '+86', flag: '🇨🇳', group: 'Other' },
    { code: 'IN', name: 'India', phoneCode: '+91', flag: '🇮🇳', group: 'Other' },
    { code: 'BR', name: 'Brazil', phoneCode: '+55', flag: '🇧🇷', group: 'Other' }
  ];
  
  export const getCountryByCode = (code) => countries.find(country => country.code === code);