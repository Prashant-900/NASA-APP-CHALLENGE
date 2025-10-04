export const PREDICTION_CONSTANTS = {
  ALLOWED_FILE_TYPES: ['csv', 'xlsx', 'xls'],
  
  // K2 Model Features (Top 10 required, rest optional)
  K2_REQUIRED_FEATURES: [
    'sy_snum', 'sy_pnum', 'disc_year', 'pl_orbper', 'pl_orbpererr1',
    'pl_rade', 'pl_radeerr1', 'pl_radeerr2', 'ttv_flag', 'st_teff'
  ],
  
  K2_OPTIONAL_FEATURES: [
    'st_tefferr1', 'st_rad', 'st_raderr1', 'st_raderr2', 'st_mass',
    'st_masserr1', 'st_met', 'st_logg', 'ra', 'dec', 'sy_dist',
    'sy_disterr1', 'sy_vmag', 'sy_vmagerr1', 'sy_kmag', 'discoverymethod',
    'pl_bmassprov', 'st_metratio'
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
    sy_snum: 'Number of Stars',
    sy_pnum: 'Number of Planets', 
    disc_year: 'Discovery Year',
    pl_orbper: 'Orbital Period (days)',
    pl_orbpererr1: 'Orbital Period Error 1',
    pl_rade: 'Planet Radius (Earth radii)',
    pl_radeerr1: 'Planet Radius Error 1',
    pl_radeerr2: 'Planet Radius Error 2',
    ttv_flag: 'TTV Flag',
    st_teff: 'Stellar Temperature (K)',
    st_tefferr1: 'Stellar Temperature Error 1',
    st_rad: 'Stellar Radius (Solar radii)',
    st_raderr1: 'Stellar Radius Error 1',
    st_raderr2: 'Stellar Radius Error 2',
    st_mass: 'Stellar Mass (Solar masses)',
    st_masserr1: 'Stellar Mass Error 1',
    st_met: 'Stellar Metallicity',
    st_logg: 'Stellar Log g',
    ra: 'Right Ascension (deg)',
    sy_dist: 'System Distance (pc)',
    sy_disterr1: 'System Distance Error 1',
    sy_vmag: 'V Magnitude',
    sy_vmagerr1: 'V Magnitude Error 1',
    sy_kmag: 'K Magnitude',
    discoverymethod: 'Discovery Method',
    pl_bmassprov: 'Planet Mass Provenance',
    st_metratio: 'Stellar Metallicity Ratio',
    
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
    koi_kepmag: 'Kepler Magnitude',
    
    // TOI Features
    pl_eqt: 'Equilibrium Temperature (K)',
    pl_tranmid_snr: 'Transit Midpoint SNR',
    st_tmag: 'TESS Magnitude',
    pl_orbper_snr: 'Orbital Period SNR',
    pl_trandurherr2: 'Transit Duration Error 2',
    st_dist: 'Stellar Distance (pc)',
    pl_insol: 'Insolation Flux',
    depth_mag_ratio: 'Depth Magnitude Ratio',
    pl_tranmid: 'Transit Midpoint (BJD)',
    dec: 'Declination (deg)'
  },
  
  DEFAULT_K2_FEATURES: {
    sy_snum: '',
    sy_pnum: '',
    disc_year: '',
    pl_orbper: '',
    pl_orbpererr1: '',
    pl_rade: '',
    pl_radeerr1: '',
    pl_radeerr2: '',
    ttv_flag: '',
    st_teff: ''
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
  
  // TOI Model Features
  TOI_REQUIRED_FEATURES: [
    'pl_eqt', 'pl_tranmid_snr', 'st_tmag', 'pl_orbper_snr', 'pl_trandurherr2',
    'st_dist', 'pl_insol', 'depth_mag_ratio', 'pl_tranmid', 'dec', 'pl_orbper', 'pl_rade'
  ],
  
  TOI_OPTIONAL_FEATURES: [
    'rowupdate', 'toi_created', 'st_rad', 'pl_trandep_snr', 'st_tefferr2',
    'st_rad_snr', 'st_logg', 'st_loggerr2', 'absolute_mag', 'st_logg_snr',
    'pl_radeerr2', 'st_teff_snr', 'pl_rade_snr', 'st_disterr2', 'st_pmra',
    'st_teff', 'pl_trandeperr2', 'st_pmdecerr2', 'st_pmdec', 'ra', 'pl_trandurh'
  ],
  
  DEFAULT_TOI_FEATURES: {
    pl_eqt: '',
    pl_tranmid_snr: '',
    st_tmag: '',
    pl_orbper_snr: '',
    pl_trandurherr2: '',
    st_dist: '',
    pl_insol: '',
    depth_mag_ratio: '',
    pl_tranmid: '',
    dec: '',
    pl_orbper: '',
    pl_rade: ''
  },
  
  // Legacy support
  get REQUIRED_FEATURES() {
    return this.K2_REQUIRED_FEATURES;
  },
  
  get DEFAULT_MANUAL_FEATURES() {
    return this.DEFAULT_K2_FEATURES;
  }
};