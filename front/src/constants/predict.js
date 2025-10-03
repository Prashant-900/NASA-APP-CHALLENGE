export const PREDICTION_CONSTANTS = {
  ALLOWED_FILE_TYPES: ['csv', 'xlsx', 'xls'],
  
  // K2 Model Features
  K2_REQUIRED_FEATURES: [
    'pl_orbper', 'pl_rade', 'st_teff', 'st_rad', 'st_mass', 
    'st_logg', 'sy_dist', 'sy_vmag', 'sy_kmag', 'sy_gaiamag'
  ],
  
  // Kepler Model Features
  KEPLER_TOP_FEATURES: [
    'koi_score', 'koi_period', 'koi_depth', 'koi_prad',
    'koi_teq', 'koi_insol', 'koi_model_snr', 'koi_steff', 'koi_slogg', 'koi_srad'
  ],
  
  KEPLER_OPTIONAL_FEATURES: [
    'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
    'koi_period_err1', 'koi_period_err2', 'koi_time0bk_err1', 'koi_time0bk_err2',
    'koi_impact', 'koi_impact_err1', 'koi_impact_err2', 'koi_duration', 'koi_duration_err1',
    'koi_duration_err2', 'koi_depth_err1', 'koi_depth_err2', 'koi_prad_err1', 'koi_prad_err2',
    'koi_insol_err1', 'koi_insol_err2', 'koi_tce_plnt_num', 'koi_steff_err1',
    'koi_steff_err2', 'koi_slogg_err1', 'koi_slogg_err2', 'koi_srad_err1', 'koi_srad_err2', 'koi_kepmag'
  ],
  
  FEATURE_LABELS: {
    // K2 Features
    pl_orbper: 'Orbital Period (pl_orbper)',
    pl_rade: 'Planet Radius (pl_rade)',
    st_teff: 'Stellar Temperature (st_teff)',
    st_rad: 'Stellar Radius (st_rad)',
    st_mass: 'Stellar Mass (st_mass)',
    st_logg: 'Stellar Log g (st_logg)',
    sy_dist: 'System Distance (sy_dist)',
    sy_vmag: 'V Magnitude (sy_vmag)',
    sy_kmag: 'K Magnitude (sy_kmag)',
    sy_gaiamag: 'Gaia Magnitude (sy_gaiamag)',
    
    // Kepler Features
    koi_score: 'KOI Score',
    koi_period: 'Orbital Period (days)',
    koi_depth: 'Transit Depth (ppm)',
    koi_prad: 'Planet Radius (Earth radii)',
    koi_teq: 'Equilibrium Temperature (K)',
    koi_insol: 'Insolation Flux (Earth flux)',
    koi_model_snr: 'Transit Signal-to-Noise',
    koi_steff: 'Stellar Effective Temperature (K)',
    koi_slogg: 'Stellar Surface Gravity (log10(cm/s**2))',
    koi_srad: 'Stellar Radius (Solar radii)',
    koi_fpflag_nt: 'Not Transit-Like Flag',
    koi_fpflag_ss: 'Stellar Eclipse Flag',
    koi_fpflag_co: 'Centroid Offset Flag',
    koi_fpflag_ec: 'Ephemeris Match Flag',
    koi_kepmag: 'Kepler Magnitude'
  },
  
  DEFAULT_K2_FEATURES: {
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
  
  DEFAULT_KEPLER_FEATURES: {
    koi_score: '',
    koi_period: '',
    koi_depth: '',
    koi_prad: '',
    koi_teq: '',
    koi_insol: '',
    koi_model_snr: '',
    koi_steff: '',
    koi_slogg: '',
    koi_srad: ''
  },
  
  // Legacy support
  get REQUIRED_FEATURES() {
    return this.K2_REQUIRED_FEATURES;
  },
  
  get DEFAULT_MANUAL_FEATURES() {
    return this.DEFAULT_K2_FEATURES;
  }
};