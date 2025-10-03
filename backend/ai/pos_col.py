k2_col = '''pl_name TEXT
hostname TEXT
default_flag BIGINT
disposition TEXT
disp_refname TEXT
sy_snum BIGINT
sy_pnum BIGINT
discoverymethod TEXT
disc_year BIGINT
disc_facility TEXT
soltype TEXT
pl_controv_flag BIGINT
pl_refname TEXT
pl_orbper DOUBLE PRECISION
pl_orbpererr1 DOUBLE PRECISION
pl_orbpererr2 DOUBLE PRECISION
pl_orbperlim DOUBLE PRECISION
pl_orbsmax DOUBLE PRECISION
pl_orbsmaxerr1 DOUBLE PRECISION
pl_orbsmaxerr2 DOUBLE PRECISION
pl_orbsmaxlim DOUBLE PRECISION
pl_rade DOUBLE PRECISION
pl_radeerr1 DOUBLE PRECISION
pl_radeerr2 DOUBLE PRECISION
pl_radelim DOUBLE PRECISION
pl_radj DOUBLE PRECISION
pl_radjerr1 DOUBLE PRECISION
pl_radjerr2 DOUBLE PRECISION
pl_radjlim DOUBLE PRECISION
pl_bmasse DOUBLE PRECISION
pl_bmasseerr1 DOUBLE PRECISION
pl_bmasseerr2 DOUBLE PRECISION
pl_bmasselim DOUBLE PRECISION
pl_bmassj DOUBLE PRECISION
pl_bmassjerr1 DOUBLE PRECISION
pl_bmassjerr2 DOUBLE PRECISION
pl_bmassjlim DOUBLE PRECISION
pl_bmassprov TEXT
pl_orbeccen DOUBLE PRECISION
pl_orbeccenerr1 DOUBLE PRECISION
pl_orbeccenerr2 DOUBLE PRECISION
pl_orbeccenlim DOUBLE PRECISION
pl_insol DOUBLE PRECISION
pl_insolerr1 DOUBLE PRECISION
pl_insolerr2 DOUBLE PRECISION
pl_insollim DOUBLE PRECISION
pl_eqt DOUBLE PRECISION
pl_eqterr1 DOUBLE PRECISION
pl_eqterr2 DOUBLE PRECISION
pl_eqtlim DOUBLE PRECISION
ttv_flag BIGINT
st_refname TEXT
st_spectype TEXT
st_teff DOUBLE PRECISION
st_tefferr1 DOUBLE PRECISION
st_tefferr2 DOUBLE PRECISION
st_tefflim DOUBLE PRECISION
st_rad DOUBLE PRECISION
st_raderr1 DOUBLE PRECISION
st_raderr2 DOUBLE PRECISION
st_radlim DOUBLE PRECISION
st_mass DOUBLE PRECISION
st_masserr1 DOUBLE PRECISION
st_masserr2 DOUBLE PRECISION
st_masslim DOUBLE PRECISION
st_met DOUBLE PRECISION
st_meterr1 DOUBLE PRECISION
st_meterr2 DOUBLE PRECISION
st_metlim DOUBLE PRECISION
st_metratio TEXT
st_logg DOUBLE PRECISION
st_loggerr1 DOUBLE PRECISION
st_loggerr2 DOUBLE PRECISION
st_logglim DOUBLE PRECISION
sy_refname TEXT
rastr TEXT
ra DOUBLE PRECISION
decstr TEXT
dec DOUBLE PRECISION
sy_dist DOUBLE PRECISION
sy_disterr1 DOUBLE PRECISION
sy_disterr2 DOUBLE PRECISION
sy_vmag DOUBLE PRECISION
sy_vmagerr1 DOUBLE PRECISION
sy_vmagerr2 DOUBLE PRECISION
sy_kmag DOUBLE PRECISION
sy_kmagerr1 DOUBLE PRECISION
sy_kmagerr2 DOUBLE PRECISION
sy_gaiamag DOUBLE PRECISION
sy_gaiamagerr1 DOUBLE PRECISION
sy_gaiamagerr2 DOUBLE PRECISION
rowupdate TIMESTAMP
pl_pubdate TEXT
releasedate TIMESTAMP'''

cum_col='''kepid BIGINT
kepoi_name TEXT
kepler_name TEXT
koi_disposition TEXT
koi_pdisposition TEXT
koi_score DOUBLE PRECISION
koi_fpflag_nt BIGINT
koi_fpflag_ss BIGINT
koi_fpflag_co BIGINT
koi_fpflag_ec BIGINT
koi_period DOUBLE PRECISION
koi_period_err1 DOUBLE PRECISION
koi_period_err2 DOUBLE PRECISION
koi_time0bk DOUBLE PRECISION
koi_time0bk_err1 DOUBLE PRECISION
koi_time0bk_err2 DOUBLE PRECISION
koi_impact DOUBLE PRECISION
koi_impact_err1 DOUBLE PRECISION
koi_impact_err2 DOUBLE PRECISION
koi_duration DOUBLE PRECISION
koi_duration_err1 DOUBLE PRECISION
koi_duration_err2 DOUBLE PRECISION
koi_depth DOUBLE PRECISION
koi_depth_err1 DOUBLE PRECISION
koi_depth_err2 DOUBLE PRECISION
koi_prad DOUBLE PRECISION
koi_prad_err1 DOUBLE PRECISION
koi_prad_err2 DOUBLE PRECISION
koi_teq DOUBLE PRECISION
koi_teq_err1 DOUBLE PRECISION
koi_teq_err2 DOUBLE PRECISION
koi_insol DOUBLE PRECISION
koi_insol_err1 DOUBLE PRECISION
koi_insol_err2 DOUBLE PRECISION
koi_model_snr DOUBLE PRECISION
koi_tce_plnt_num DOUBLE PRECISION
koi_tce_delivname TEXT
koi_steff DOUBLE PRECISION
koi_steff_err1 DOUBLE PRECISION
koi_steff_err2 DOUBLE PRECISION
koi_slogg DOUBLE PRECISION
koi_slogg_err1 DOUBLE PRECISION
koi_slogg_err2 DOUBLE PRECISION
koi_srad DOUBLE PRECISION
koi_srad_err1 DOUBLE PRECISION
koi_srad_err2 DOUBLE PRECISION
ra DOUBLE PRECISION
dec DOUBLE PRECISION
koi_kepmag DOUBLE PRECISION'''

toi_col='''toi DOUBLE PRECISION
tid BIGINT
tfopwg_disp TEXT
rastr TEXT
ra DOUBLE PRECISION
decstr TEXT
dec DOUBLE PRECISION
st_pmra DOUBLE PRECISION
st_pmraerr1 DOUBLE PRECISION
st_pmraerr2 DOUBLE PRECISION
st_pmralim DOUBLE PRECISION
st_pmdec DOUBLE PRECISION
st_pmdecerr1 DOUBLE PRECISION
st_pmdecerr2 DOUBLE PRECISION
st_pmdeclim DOUBLE PRECISION
pl_tranmid DOUBLE PRECISION
pl_tranmiderr1 DOUBLE PRECISION
pl_tranmiderr2 DOUBLE PRECISION
pl_tranmidlim BIGINT
pl_orbper DOUBLE PRECISION
pl_orbpererr1 DOUBLE PRECISION
pl_orbpererr2 DOUBLE PRECISION
pl_orbperlim BIGINT
pl_trandurh DOUBLE PRECISION
pl_trandurherr1 DOUBLE PRECISION
pl_trandurherr2 DOUBLE PRECISION
pl_trandurhlim BIGINT
pl_trandep DOUBLE PRECISION
pl_trandeperr1 DOUBLE PRECISION
pl_trandeperr2 DOUBLE PRECISION
pl_trandeplim BIGINT
pl_rade DOUBLE PRECISION
pl_radeerr1 DOUBLE PRECISION
pl_radeerr2 DOUBLE PRECISION
pl_radelim BIGINT
pl_insol DOUBLE PRECISION
pl_insolerr1 DOUBLE PRECISION
pl_insolerr2 DOUBLE PRECISION
pl_insollim DOUBLE PRECISION
pl_eqt DOUBLE PRECISION
pl_eqterr1 DOUBLE PRECISION
pl_eqterr2 DOUBLE PRECISION
pl_eqtlim DOUBLE PRECISION
st_tmag DOUBLE PRECISION
st_tmagerr1 DOUBLE PRECISION
st_tmagerr2 DOUBLE PRECISION
st_tmaglim BIGINT
st_dist DOUBLE PRECISION
st_disterr1 DOUBLE PRECISION
st_disterr2 DOUBLE PRECISION
st_distlim BIGINT
st_teff DOUBLE PRECISION
st_tefferr1 DOUBLE PRECISION
st_tefferr2 DOUBLE PRECISION
st_tefflim BIGINT
st_logg DOUBLE PRECISION
st_loggerr1 DOUBLE PRECISION
st_loggerr2 DOUBLE PRECISION
st_logglim BIGINT
st_rad DOUBLE PRECISION
st_raderr1 DOUBLE PRECISION
st_raderr2 DOUBLE PRECISION
st_radlim BIGINT
toi_created TIMESTAMP
rowupdate TIMESTAMP'''