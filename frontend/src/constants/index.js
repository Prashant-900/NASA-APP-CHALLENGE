export const TABLE_NAMES = {
  K2: 'k2',
  TOI: 'toi',
  CUM: 'cum'
};

export const TABLE_LABELS = {
  [TABLE_NAMES.K2]: 'K2 Mission Data',
  [TABLE_NAMES.TOI]: 'TESS Objects of Interest',
  [TABLE_NAMES.CUM]: 'Cumulative Exoplanet Data'
};

export const PAGINATION = {
  DEFAULT_ROWS_PER_PAGE: 50,
  ROWS_PER_PAGE_OPTIONS: [25, 50, 100]
};

export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:5000/api'
};

export const FILE_UPLOAD = {
  ACCEPTED_TYPES: ['csv', 'xlsx', 'xls'],
  REQUIRED_FIELDS: ['pl_orbper', 'pl_rade', 'st_teff', 'st_rad', 'st_mass', 'st_logg', 'sy_dist', 'sy_vmag', 'sy_kmag', 'sy_gaiamag'],
  DEFAULT_MANUAL_FEATURES: {
    pl_orbper: '',
    pl_rade: '',
    st_teff: '',
    st_rad: '',
    st_mass: '',
    st_logg: '',
    sy_dist: '',
    sy_vmag: '',
    sy_kmag: '',
    sy_gaiamag: ''
  },
  MESSAGES: {
    INVALID_FILE_TYPE: 'Please select a CSV or Excel file',
    NO_FILE_SELECTED: 'Please select a file first',
    FILL_REQUIRED_FIELDS: 'Please fill all required fields:'
  }
};