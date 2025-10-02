export const PLANET_FEATURE_MAPPING = {
  k2: {
    radius: 'pl_rade',
    name: 'hostname', 
    weight: 'pl_bmasse',
    distance: 'sy_dist'
  },
  toi: {
    radius: 'pl_rade',
    name: 'toi',
    weight: null,
    distance: 'st_dist'
  },
  cum: {
    radius: 'kep_srad',
    name: 'kepler_name',
    weight: null,
    distance: 'sy_dist'
  }
};