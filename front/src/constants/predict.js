export const PREDICTION_CONSTANTS = {
  ALLOWED_FILE_TYPES: ['csv', 'xlsx', 'xls'],
  REQUIRED_FEATURES: [
    'pl_orbper', 'pl_rade', 'st_teff', 'st_rad', 'st_mass', 
    'st_logg', 'sy_dist', 'sy_vmag', 'sy_kmag', 'sy_gaiamag'
  ],
  FEATURE_LABELS: {
    pl_orbper: 'Orbital Period (pl_orbper)',
    pl_rade: 'Planet Radius (pl_rade)',
    st_teff: 'Stellar Temperature (st_teff)',
    st_rad: 'Stellar Radius (st_rad)',
    st_mass: 'Stellar Mass (st_mass)',
    st_logg: 'Stellar Log g (st_logg)',
    sy_dist: 'System Distance (sy_dist)',
    sy_vmag: 'V Magnitude (sy_vmag)',
    sy_kmag: 'K Magnitude (sy_kmag)',
    sy_gaiamag: 'Gaia Magnitude (sy_gaiamag)'
  },
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
  }
};