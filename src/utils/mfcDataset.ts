import { MFCDataRow, FeatureKey, TargetKey, MFC_COLUMNS_METADATA } from '../types/mfc';

export const BENCHMARK_LITERATURE_MFC_DATA: MFCDataRow[] = [
  {
    id: 1,
    anode_material: 1,
    cathode_material: 1,
    membrane: 1,
    substrate: 1,
    COD_mgL: 800,
    pH: 7.0,
    temperature_C: 30,
    electrode_area_cm2: 7.0,
    reactor_volume_mL: 28,
    coulombic_efficiency_pct: 55.4,
    internal_resistance_ohm: 85,
    power_density_mWm2: 1250,
    reference: 'Cheng & Logan (2007) PNAS',
  },
  {
    id: 2,
    anode_material: 1,
    cathode_material: 2,
    membrane: 1,
    substrate: 1,
    COD_mgL: 800,
    pH: 7.0,
    temperature_C: 30,
    electrode_area_cm2: 7.0,
    reactor_volume_mL: 28,
    coulombic_efficiency_pct: 42.1,
    internal_resistance_ohm: 120,
    power_density_mWm2: 1010,
    reference: 'Cheng & Logan (2007) ES&T',
  },
  {
    id: 3,
    anode_material: 3,
    cathode_material: 1,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1000,
    pH: 7.2,
    temperature_C: 25,
    electrode_area_cm2: 50.0,
    reactor_volume_mL: 120,
    coulombic_efficiency_pct: 68.0,
    internal_resistance_ohm: 45,
    power_density_mWm2: 1540,
    reference: 'Logan et al. (2007) ES&T',
  },
  {
    id: 4,
    anode_material: 2,
    cathode_material: 1,
    membrane: 1,
    substrate: 2,
    COD_mgL: 1200,
    pH: 6.8,
    temperature_C: 30,
    electrode_area_cm2: 25.0,
    reactor_volume_mL: 200,
    coulombic_efficiency_pct: 35.0,
    internal_resistance_ohm: 160,
    power_density_mWm2: 720,
    reference: 'Rabaey et al. (2005) Trends Biotech',
  },
  {
    id: 5,
    anode_material: 2,
    cathode_material: 5,
    membrane: 1,
    substrate: 2,
    COD_mgL: 600,
    pH: 7.0,
    temperature_C: 22,
    electrode_area_cm2: 25.0,
    reactor_volume_mL: 250,
    coulombic_efficiency_pct: 18.2,
    internal_resistance_ohm: 480,
    power_density_mWm2: 210,
    reference: 'Liu & Logan (2004) ES&T',
  },
  {
    id: 6,
    anode_material: 1,
    cathode_material: 2,
    membrane: 3,
    substrate: 3,
    COD_mgL: 450,
    pH: 7.4,
    temperature_C: 20,
    electrode_area_cm2: 12.0,
    reactor_volume_mL: 50,
    coulombic_efficiency_pct: 22.5,
    internal_resistance_ohm: 190,
    power_density_mWm2: 430,
    reference: 'Wang & Ren (2013) ES: Proc Imp',
  },
  {
    id: 7,
    anode_material: 3,
    cathode_material: 2,
    membrane: 3,
    substrate: 3,
    COD_mgL: 520,
    pH: 7.3,
    temperature_C: 23,
    electrode_area_cm2: 40.0,
    reactor_volume_mL: 130,
    coulombic_efficiency_pct: 28.0,
    internal_resistance_ohm: 135,
    power_density_mWm2: 610,
    reference: 'Pant et al. (2010) RSC Adv',
  },
  {
    id: 8,
    anode_material: 1,
    cathode_material: 1,
    membrane: 2,
    substrate: 1,
    COD_mgL: 1000,
    pH: 7.0,
    temperature_C: 30,
    electrode_area_cm2: 7.0,
    reactor_volume_mL: 28,
    coulombic_efficiency_pct: 49.0,
    internal_resistance_ohm: 110,
    power_density_mWm2: 1120,
    reference: 'Rozendal et al. (2008) Trends Biotech',
  },
  {
    id: 9,
    anode_material: 4,
    cathode_material: 3,
    membrane: 1,
    substrate: 4,
    COD_mgL: 2200,
    pH: 6.5,
    temperature_C: 28,
    electrode_area_cm2: 15.0,
    reactor_volume_mL: 100,
    coulombic_efficiency_pct: 31.4,
    internal_resistance_ohm: 210,
    power_density_mWm2: 540,
    reference: 'Feng et al. (2008) Bioresour Technol',
  },
  {
    id: 10,
    anode_material: 3,
    cathode_material: 1,
    membrane: 1,
    substrate: 1,
    COD_mgL: 1500,
    pH: 7.0,
    temperature_C: 35,
    electrode_area_cm2: 60.0,
    reactor_volume_mL: 150,
    coulombic_efficiency_pct: 62.0,
    internal_resistance_ohm: 55,
    power_density_mWm2: 1780,
    reference: 'Hutchinson et al. (2011) J Power Sources',
  },
  {
    id: 11,
    anode_material: 5,
    cathode_material: 5,
    membrane: 1,
    substrate: 5,
    COD_mgL: 400,
    pH: 6.2,
    temperature_C: 18,
    electrode_area_cm2: 10.0,
    reactor_volume_mL: 300,
    coulombic_efficiency_pct: 12.0,
    internal_resistance_ohm: 580,
    power_density_mWm2: 140,
    reference: 'Min & Logan (2004) ES&T',
  },
  {
    id: 12,
    anode_material: 2,
    cathode_material: 2,
    membrane: 4,
    substrate: 1,
    COD_mgL: 900,
    pH: 7.5,
    temperature_C: 26,
    electrode_area_cm2: 18.0,
    reactor_volume_mL: 90,
    coulombic_efficiency_pct: 44.0,
    internal_resistance_ohm: 150,
    power_density_mWm2: 890,
    reference: 'Kim et al. (2007) ES&T',
  },
  {
    id: 13,
    anode_material: 1,
    cathode_material: 1,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1100,
    pH: 7.1,
    temperature_C: 30,
    electrode_area_cm2: 8.0,
    reactor_volume_mL: 30,
    coulombic_efficiency_pct: 58.5,
    internal_resistance_ohm: 65,
    power_density_mWm2: 1420,
    reference: 'Liu et al. (2005) ES&T',
  },
  {
    id: 14,
    anode_material: 2,
    cathode_material: 3,
    membrane: 1,
    substrate: 2,
    COD_mgL: 1400,
    pH: 6.9,
    temperature_C: 25,
    electrode_area_cm2: 20.0,
    reactor_volume_mL: 180,
    coulombic_efficiency_pct: 38.0,
    internal_resistance_ohm: 175,
    power_density_mWm2: 680,
    reference: 'Zhang et al. (2009) Biosens Bioelectron',
  },
  {
    id: 15,
    anode_material: 3,
    cathode_material: 2,
    membrane: 1,
    substrate: 4,
    COD_mgL: 2800,
    pH: 6.8,
    temperature_C: 32,
    electrode_area_cm2: 45.0,
    reactor_volume_mL: 160,
    coulombic_efficiency_pct: 41.0,
    internal_resistance_ohm: 95,
    power_density_mWm2: 1150,
    reference: 'Zhuang et al. (2012) Bioresour Technol',
  },
  {
    id: 16,
    anode_material: 1,
    cathode_material: 4,
    membrane: 1,
    substrate: 1,
    COD_mgL: 750,
    pH: 7.0,
    temperature_C: 24,
    electrode_area_cm2: 15.0,
    reactor_volume_mL: 120,
    coulombic_efficiency_pct: 36.0,
    internal_resistance_ohm: 230,
    power_density_mWm2: 510,
    reference: 'He & Angenent (2006) ES&T',
  },
  {
    id: 17,
    anode_material: 3,
    cathode_material: 1,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1250,
    pH: 7.2,
    temperature_C: 32,
    electrode_area_cm2: 55.0,
    reactor_volume_mL: 140,
    coulombic_efficiency_pct: 71.0,
    internal_resistance_ohm: 38,
    power_density_mWm2: 1920,
    reference: 'Logan et al. (2008) J Power Sources',
  },
  {
    id: 18,
    anode_material: 2,
    cathode_material: 2,
    membrane: 5,
    substrate: 3,
    COD_mgL: 500,
    pH: 7.2,
    temperature_C: 22,
    electrode_area_cm2: 30.0,
    reactor_volume_mL: 250,
    coulombic_efficiency_pct: 19.5,
    internal_resistance_ohm: 320,
    power_density_mWm2: 340,
    reference: 'Behera et al. (2010) Bioresour Technol',
  },
  {
    id: 19,
    anode_material: 1,
    cathode_material: 2,
    membrane: 1,
    substrate: 5,
    COD_mgL: 700,
    pH: 6.7,
    temperature_C: 25,
    electrode_area_cm2: 10.0,
    reactor_volume_mL: 60,
    coulombic_efficiency_pct: 33.0,
    internal_resistance_ohm: 215,
    power_density_mWm2: 590,
    reference: 'Santoro et al. (2017) ChemSusChem',
  },
  {
    id: 20,
    anode_material: 3,
    cathode_material: 2,
    membrane: 3,
    substrate: 1,
    COD_mgL: 850,
    pH: 7.0,
    temperature_C: 27,
    electrode_area_cm2: 40.0,
    reactor_volume_mL: 110,
    coulombic_efficiency_pct: 52.0,
    internal_resistance_ohm: 78,
    power_density_mWm2: 1310,
    reference: 'Zhang et al. (2011) Bioresour Technol',
  },
  {
    id: 21,
    anode_material: 4,
    cathode_material: 5,
    membrane: 2,
    substrate: 2,
    COD_mgL: 1100,
    pH: 6.4,
    temperature_C: 20,
    electrode_area_cm2: 12.0,
    reactor_volume_mL: 220,
    coulombic_efficiency_pct: 15.0,
    internal_resistance_ohm: 460,
    power_density_mWm2: 240,
    reference: 'Chae et al. (2009) Int J Hydrogen Energy',
  },
  {
    id: 22,
    anode_material: 2,
    cathode_material: 1,
    membrane: 1,
    substrate: 1,
    COD_mgL: 1300,
    pH: 7.1,
    temperature_C: 30,
    electrode_area_cm2: 22.0,
    reactor_volume_mL: 150,
    coulombic_efficiency_pct: 48.0,
    internal_resistance_ohm: 105,
    power_density_mWm2: 1080,
    reference: 'Aelterman et al. (2006) ES&T',
  },
  {
    id: 23,
    anode_material: 3,
    cathode_material: 3,
    membrane: 3,
    substrate: 4,
    COD_mgL: 3100,
    pH: 6.9,
    temperature_C: 33,
    electrode_area_cm2: 50.0,
    reactor_volume_mL: 170,
    coulombic_efficiency_pct: 46.5,
    internal_resistance_ohm: 88,
    power_density_mWm2: 1290,
    reference: 'Wen et al. (2014) J Power Sources',
  },
  {
    id: 24,
    anode_material: 1,
    cathode_material: 2,
    membrane: 4,
    substrate: 3,
    COD_mgL: 420,
    pH: 7.6,
    temperature_C: 21,
    electrode_area_cm2: 14.0,
    reactor_volume_mL: 80,
    coulombic_efficiency_pct: 21.0,
    internal_resistance_ohm: 260,
    power_density_mWm2: 410,
    reference: 'Lefebvre et al. (2011) Bioresour Technol',
  },
  {
    id: 25,
    anode_material: 3,
    cathode_material: 1,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1600,
    pH: 7.0,
    temperature_C: 35,
    electrode_area_cm2: 65.0,
    reactor_volume_mL: 140,
    coulombic_efficiency_pct: 74.5,
    internal_resistance_ohm: 32,
    power_density_mWm2: 2120,
    reference: 'Fan et al. (2007) ES&T',
  },
  {
    id: 26,
    anode_material: 2,
    cathode_material: 4,
    membrane: 1,
    substrate: 1,
    COD_mgL: 950,
    pH: 7.3,
    temperature_C: 25,
    electrode_area_cm2: 20.0,
    reactor_volume_mL: 130,
    coulombic_efficiency_pct: 39.0,
    internal_resistance_ohm: 210,
    power_density_mWm2: 580,
    reference: 'Clauwaert et al. (2007) ES&T',
  },
  {
    id: 27,
    anode_material: 5,
    cathode_material: 2,
    membrane: 1,
    substrate: 2,
    COD_mgL: 800,
    pH: 6.6,
    temperature_C: 23,
    electrode_area_cm2: 12.0,
    reactor_volume_mL: 280,
    coulombic_efficiency_pct: 16.5,
    internal_resistance_ohm: 510,
    power_density_mWm2: 230,
    reference: 'Bond & Lovley (2003) Science',
  },
  {
    id: 28,
    anode_material: 1,
    cathode_material: 1,
    membrane: 1,
    substrate: 1,
    COD_mgL: 1050,
    pH: 7.0,
    temperature_C: 28,
    electrode_area_cm2: 7.0,
    reactor_volume_mL: 28,
    coulombic_efficiency_pct: 53.0,
    internal_resistance_ohm: 92,
    power_density_mWm2: 1180,
    reference: 'Call & Logan (2008) ES&T',
  },
  {
    id: 29,
    anode_material: 3,
    cathode_material: 2,
    membrane: 1,
    substrate: 3,
    COD_mgL: 550,
    pH: 7.5,
    temperature_C: 24,
    electrode_area_cm2: 35.0,
    reactor_volume_mL: 120,
    coulombic_efficiency_pct: 30.0,
    internal_resistance_ohm: 145,
    power_density_mWm2: 710,
    reference: 'Velvizhi & Mohan (2012) Bioresour Technol',
  },
  {
    id: 30,
    anode_material: 2,
    cathode_material: 3,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1150,
    pH: 7.1,
    temperature_C: 29,
    electrode_area_cm2: 24.0,
    reactor_volume_mL: 160,
    coulombic_efficiency_pct: 47.0,
    internal_resistance_ohm: 125,
    power_density_mWm2: 960,
    reference: 'You et al. (2008) J Power Sources',
  },
  {
    id: 31,
    anode_material: 1,
    cathode_material: 2,
    membrane: 2,
    substrate: 4,
    COD_mgL: 1900,
    pH: 6.7,
    temperature_C: 27,
    electrode_area_cm2: 16.0,
    reactor_volume_mL: 110,
    coulombic_efficiency_pct: 34.0,
    internal_resistance_ohm: 240,
    power_density_mWm2: 520,
    reference: 'Mathuriya & Sharma (2009) Int J Green Energy',
  },
  {
    id: 32,
    anode_material: 3,
    cathode_material: 1,
    membrane: 1,
    substrate: 1,
    COD_mgL: 1400,
    pH: 7.0,
    temperature_C: 31,
    electrode_area_cm2: 48.0,
    reactor_volume_mL: 130,
    coulombic_efficiency_pct: 65.0,
    internal_resistance_ohm: 60,
    power_density_mWm2: 1650,
    reference: 'Liu et al. (2008) ES&T',
  },
  {
    id: 33,
    anode_material: 4,
    cathode_material: 1,
    membrane: 1,
    substrate: 1,
    COD_mgL: 800,
    pH: 6.8,
    temperature_C: 26,
    electrode_area_cm2: 10.0,
    reactor_volume_mL: 50,
    coulombic_efficiency_pct: 40.0,
    internal_resistance_ohm: 180,
    power_density_mWm2: 780,
    reference: 'Deng et al. (2010) Biosens Bioelectron',
  },
  {
    id: 34,
    anode_material: 2,
    cathode_material: 5,
    membrane: 3,
    substrate: 3,
    COD_mgL: 380,
    pH: 7.2,
    temperature_C: 19,
    electrode_area_cm2: 20.0,
    reactor_volume_mL: 190,
    coulombic_efficiency_pct: 14.0,
    internal_resistance_ohm: 420,
    power_density_mWm2: 260,
    reference: 'Puig et al. (2011) Water Res',
  },
  {
    id: 35,
    anode_material: 1,
    cathode_material: 2,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1200,
    pH: 7.2,
    temperature_C: 30,
    electrode_area_cm2: 12.0,
    reactor_volume_mL: 45,
    coulombic_efficiency_pct: 54.0,
    internal_resistance_ohm: 98,
    power_density_mWm2: 1230,
    reference: 'Cheng et al. (2006) ES&T',
  },
  {
    id: 36,
    anode_material: 3,
    cathode_material: 2,
    membrane: 3,
    substrate: 5,
    COD_mgL: 900,
    pH: 7.0,
    temperature_C: 25,
    electrode_area_cm2: 42.0,
    reactor_volume_mL: 125,
    coulombic_efficiency_pct: 46.0,
    internal_resistance_ohm: 115,
    power_density_mWm2: 1040,
    reference: 'Zhang et al. (2013) ES&T',
  },
  {
    id: 37,
    anode_material: 2,
    cathode_material: 1,
    membrane: 2,
    substrate: 2,
    COD_mgL: 1600,
    pH: 6.9,
    temperature_C: 28,
    electrode_area_cm2: 25.0,
    reactor_volume_mL: 210,
    coulombic_efficiency_pct: 37.5,
    internal_resistance_ohm: 195,
    power_density_mWm2: 650,
    reference: 'Catal et al. (2008) J Power Sources',
  },
  {
    id: 38,
    anode_material: 1,
    cathode_material: 3,
    membrane: 1,
    substrate: 1,
    COD_mgL: 1000,
    pH: 7.1,
    temperature_C: 29,
    electrode_area_cm2: 9.0,
    reactor_volume_mL: 35,
    coulombic_efficiency_pct: 49.5,
    internal_resistance_ohm: 130,
    power_density_mWm2: 910,
    reference: 'Roche et al. (2010) Bioelectrochemistry',
  },
  {
    id: 39,
    anode_material: 5,
    cathode_material: 5,
    membrane: 5,
    substrate: 3,
    COD_mgL: 320,
    pH: 6.5,
    temperature_C: 17,
    electrode_area_cm2: 15.0,
    reactor_volume_mL: 350,
    coulombic_efficiency_pct: 9.8,
    internal_resistance_ohm: 640,
    power_density_mWm2: 110,
    reference: 'Park & Zeikus (2000) Appl Environ Microbiol',
  },
  {
    id: 40,
    anode_material: 3,
    cathode_material: 1,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1750,
    pH: 7.1,
    temperature_C: 34,
    electrode_area_cm2: 62.0,
    reactor_volume_mL: 135,
    coulombic_efficiency_pct: 72.0,
    internal_resistance_ohm: 35,
    power_density_mWm2: 2040,
    reference: 'Logan et al. (2015) Environ Sci Technol Lett',
  },
  {
    id: 41,
    anode_material: 2,
    cathode_material: 2,
    membrane: 1,
    substrate: 4,
    COD_mgL: 2500,
    pH: 6.7,
    temperature_C: 30,
    electrode_area_cm2: 28.0,
    reactor_volume_mL: 190,
    coulombic_efficiency_pct: 35.0,
    internal_resistance_ohm: 170,
    power_density_mWm2: 760,
    reference: 'Wang et al. (2009) Bioresour Technol',
  },
  {
    id: 42,
    anode_material: 1,
    cathode_material: 4,
    membrane: 3,
    substrate: 1,
    COD_mgL: 850,
    pH: 7.2,
    temperature_C: 25,
    electrode_area_cm2: 11.0,
    reactor_volume_mL: 70,
    coulombic_efficiency_pct: 38.0,
    internal_resistance_ohm: 205,
    power_density_mWm2: 620,
    reference: 'Freguia et al. (2008) ES&T',
  },
  {
    id: 43,
    anode_material: 3,
    cathode_material: 2,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1350,
    pH: 7.0,
    temperature_C: 31,
    electrode_area_cm2: 52.0,
    reactor_volume_mL: 130,
    coulombic_efficiency_pct: 59.0,
    internal_resistance_ohm: 70,
    power_density_mWm2: 1470,
    reference: 'Hutchinson et al. (2013) J Power Sources',
  },
  {
    id: 44,
    anode_material: 4,
    cathode_material: 2,
    membrane: 1,
    substrate: 5,
    COD_mgL: 650,
    pH: 6.8,
    temperature_C: 22,
    electrode_area_cm2: 12.0,
    reactor_volume_mL: 90,
    coulombic_efficiency_pct: 27.0,
    internal_resistance_ohm: 290,
    power_density_mWm2: 440,
    reference: 'Song et al. (2012) Biosens Bioelectron',
  },
  {
    id: 45,
    anode_material: 2,
    cathode_material: 3,
    membrane: 4,
    substrate: 2,
    COD_mgL: 1300,
    pH: 7.0,
    temperature_C: 27,
    electrode_area_cm2: 22.0,
    reactor_volume_mL: 175,
    coulombic_efficiency_pct: 36.0,
    internal_resistance_ohm: 210,
    power_density_mWm2: 590,
    reference: 'Lu et al. (2011) Bioresour Technol',
  },
  {
    id: 46,
    anode_material: 1,
    cathode_material: 1,
    membrane: 1,
    substrate: 3,
    COD_mgL: 600,
    pH: 7.4,
    temperature_C: 24,
    electrode_area_cm2: 10.0,
    reactor_volume_mL: 40,
    coulombic_efficiency_pct: 32.0,
    internal_resistance_ohm: 165,
    power_density_mWm2: 730,
    reference: 'Rodrigo et al. (2007) ES&T',
  },
  {
    id: 47,
    anode_material: 3,
    cathode_material: 1,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1100,
    pH: 7.0,
    temperature_C: 30,
    electrode_area_cm2: 45.0,
    reactor_volume_mL: 120,
    coulombic_efficiency_pct: 64.0,
    internal_resistance_ohm: 50,
    power_density_mWm2: 1600,
    reference: 'Ahn & Logan (2010) Bioresour Technol',
  },
  {
    id: 48,
    anode_material: 2,
    cathode_material: 2,
    membrane: 2,
    substrate: 1,
    COD_mgL: 950,
    pH: 7.1,
    temperature_C: 28,
    electrode_area_cm2: 26.0,
    reactor_volume_mL: 140,
    coulombic_efficiency_pct: 45.0,
    internal_resistance_ohm: 140,
    power_density_mWm2: 870,
    reference: 'Ki et al. (2017) Water Res',
  },
  {
    id: 49,
    anode_material: 5,
    cathode_material: 1,
    membrane: 1,
    substrate: 1,
    COD_mgL: 750,
    pH: 6.9,
    temperature_C: 25,
    electrode_area_cm2: 15.0,
    reactor_volume_mL: 180,
    coulombic_efficiency_pct: 31.0,
    internal_resistance_ohm: 350,
    power_density_mWm2: 460,
    reference: 'Chaudhuri & Lovley (2003) Nat Biotechnol',
  },
  {
    id: 50,
    anode_material: 3,
    cathode_material: 2,
    membrane: 3,
    substrate: 4,
    COD_mgL: 2600,
    pH: 6.8,
    temperature_C: 31,
    electrode_area_cm2: 48.0,
    reactor_volume_mL: 150,
    coulombic_efficiency_pct: 43.5,
    internal_resistance_ohm: 82,
    power_density_mWm2: 1340,
    reference: 'Feng et al. (2014) J Power Sources',
  },
  {
    id: 51,
    anode_material: 1,
    cathode_material: 2,
    membrane: 1,
    substrate: 1,
    COD_mgL: 880,
    pH: 7.2,
    temperature_C: 29,
    electrode_area_cm2: 8.5,
    reactor_volume_mL: 32,
    coulombic_efficiency_pct: 46.0,
    internal_resistance_ohm: 112,
    power_density_mWm2: 1060,
    reference: 'Cheng et al. (2008) Electrochem Commun',
  },
  {
    id: 52,
    anode_material: 2,
    cathode_material: 5,
    membrane: 5,
    substrate: 3,
    COD_mgL: 410,
    pH: 7.1,
    temperature_C: 21,
    electrode_area_cm2: 24.0,
    reactor_volume_mL: 260,
    coulombic_efficiency_pct: 13.5,
    internal_resistance_ohm: 490,
    power_density_mWm2: 220,
    reference: 'Ghangrekar & Shinde (2007) Bioresour Technol',
  },
  {
    id: 53,
    anode_material: 3,
    cathode_material: 3,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1200,
    pH: 7.0,
    temperature_C: 30,
    electrode_area_cm2: 46.0,
    reactor_volume_mL: 130,
    coulombic_efficiency_pct: 57.0,
    internal_resistance_ohm: 80,
    power_density_mWm2: 1380,
    reference: 'Zhang et al. (2010) ES&T',
  },
  {
    id: 54,
    anode_material: 4,
    cathode_material: 4,
    membrane: 1,
    substrate: 2,
    COD_mgL: 1050,
    pH: 6.6,
    temperature_C: 23,
    electrode_area_cm2: 14.0,
    reactor_volume_mL: 140,
    coulombic_efficiency_pct: 29.0,
    internal_resistance_ohm: 310,
    power_density_mWm2: 390,
    reference: 'Huang et al. (2011) Bioresour Technol',
  },
  {
    id: 55,
    anode_material: 3,
    cathode_material: 1,
    membrane: 3,
    substrate: 1,
    COD_mgL: 1550,
    pH: 7.1,
    temperature_C: 33,
    electrode_area_cm2: 58.0,
    reactor_volume_mL: 135,
    coulombic_efficiency_pct: 70.0,
    internal_resistance_ohm: 40,
    power_density_mWm2: 1860,
    reference: 'Logan et al. (2018) Chem Rev',
  },
];

export interface ColumnSummaryStats {
  key: string;
  name: string;
  unit: string;
  count: number;
  missingCount: number;
  mean: number;
  std: number;
  min: number;
  q25: number;
  median: number;
  q75: number;
  max: number;
  iqr: number;
  outlierCount: number;
}

export function computeSummaryStats(data: MFCDataRow[]): ColumnSummaryStats[] {
  if (data.length === 0) return [];

  const keys = MFC_COLUMNS_METADATA.map((c) => c.key);

  return keys.map((key) => {
    const meta = MFC_COLUMNS_METADATA.find((m) => m.key === key)!;
    const values: number[] = [];
    let missingCount = 0;

    data.forEach((row) => {
      const val = row[key];
      if (val !== undefined && val !== null && !isNaN(Number(val))) {
        values.push(Number(val));
      } else {
        missingCount++;
      }
    });

    if (values.length === 0) {
      return {
        key,
        name: meta.name,
        unit: meta.unit,
        count: 0,
        missingCount,
        mean: 0,
        std: 0,
        min: 0,
        q25: 0,
        median: 0,
        q75: 0,
        max: 0,
        iqr: 0,
        outlierCount: 0,
      };
    }

    values.sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, v) => acc + v, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (count > 1 ? count - 1 : 1);
    const std = Math.sqrt(variance);

    const min = values[0];
    const max = values[count - 1];

    const getPercentile = (p: number) => {
      const index = (count - 1) * p;
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;
      return values[lower] * (1 - weight) + values[upper] * weight;
    };

    const q25 = getPercentile(0.25);
    const median = getPercentile(0.5);
    const q75 = getPercentile(0.75);
    const iqr = q75 - q25;

    const lowerBound = q25 - 1.5 * iqr;
    const upperBound = q75 + 1.5 * iqr;
    const outlierCount = values.filter((v) => v < lowerBound || v > upperBound).length;

    return {
      key,
      name: meta.name,
      unit: meta.unit,
      count,
      missingCount,
      mean: Number(mean.toFixed(2)),
      std: Number(std.toFixed(2)),
      min: Number(min.toFixed(2)),
      q25: Number(q25.toFixed(2)),
      median: Number(median.toFixed(2)),
      q75: Number(q75.toFixed(2)),
      max: Number(max.toFixed(2)),
      iqr: Number(iqr.toFixed(2)),
      outlierCount,
    };
  });
}

export function computeCorrelationMatrix(data: MFCDataRow[]): {
  features: string[];
  labels: string[];
  matrix: number[][];
} {
  const keys = MFC_COLUMNS_METADATA.map((c) => c.key);
  const labels = MFC_COLUMNS_METADATA.map((c) => c.name);
  const n = data.length;

  if (n < 2) {
    return {
      features: keys,
      labels,
      matrix: keys.map(() => keys.map(() => 0)),
    };
  }

  // Precompute means and standard deviations
  const means: Record<string, number> = {};
  const stds: Record<string, number> = {};

  keys.forEach((key) => {
    const vals = data.map((d) => Number(d[key]) || 0);
    const mean = vals.reduce((a, b) => a + b, 0) / n;
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
    means[key] = mean;
    stds[key] = Math.sqrt(variance) || 1e-9;
  });

  const matrix: number[][] = [];

  for (let i = 0; i < keys.length; i++) {
    const row: number[] = [];
    const keyA = keys[i];
    for (let j = 0; j < keys.length; j++) {
      if (i === j) {
        row.push(1.0);
        continue;
      }
      const keyB = keys[j];
      let sumCov = 0;
      for (let k = 0; k < n; k++) {
        const valA = Number(data[k][keyA]) || 0;
        const valB = Number(data[k][keyB]) || 0;
        sumCov += (valA - means[keyA]) * (valB - means[keyB]);
      }
      const cov = sumCov / (n - 1);
      const r = cov / (stds[keyA] * stds[keyB]);
      row.push(Number(Math.max(-1, Math.min(1, r)).toFixed(3)));
    }
    matrix.push(row);
  }

  return {
    features: keys,
    labels,
    matrix,
  };
}

export function parseCSV(csvText: string): {
  rows: MFCDataRow[];
  errors: string[];
  matchedColumns: string[];
  missingRequiredColumns: string[];
} {
  const errors: string[] = [];
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      rows: [],
      errors: ['CSV must contain at least a header row and 1 data row.'],
      matchedColumns: [],
      missingRequiredColumns: MFC_COLUMNS_METADATA.map((c) => c.key),
    };
  }

  // Detect delimiter: comma, semicolon, tab
  const headerLine = lines[0];
  let delimiter = ',';
  if (headerLine.includes('\t')) delimiter = '\t';
  else if (headerLine.includes(';') && !headerLine.includes(',')) delimiter = ';';

  const rawHeaders = headerLine.split(delimiter).map((h) => h.replace(/['"]/g, '').trim());

  // Normalize column mapping (case-insensitive and alias matching)
  const keyAliases: Record<string, FeatureKey | TargetKey> = {
    anode_material: 'anode_material',
    anode: 'anode_material',
    anode_mat: 'anode_material',
    cathode_material: 'cathode_material',
    cathode: 'cathode_material',
    cathode_mat: 'cathode_material',
    membrane: 'membrane',
    separator: 'membrane',
    membrane_type: 'membrane',
    substrate: 'substrate',
    fuel: 'substrate',
    cod_mgl: 'COD_mgL',
    cod: 'COD_mgL',
    cod_mg_l: 'COD_mgL',
    ph: 'pH',
    temperature_c: 'temperature_C',
    temperature: 'temperature_C',
    temp_c: 'temperature_C',
    temp: 'temperature_C',
    electrode_area_cm2: 'electrode_area_cm2',
    electrode_area: 'electrode_area_cm2',
    area_cm2: 'electrode_area_cm2',
    reactor_volume_ml: 'reactor_volume_mL',
    volume_ml: 'reactor_volume_mL',
    reactor_volume: 'reactor_volume_mL',
    coulombic_efficiency_pct: 'coulombic_efficiency_pct',
    coulombic_efficiency: 'coulombic_efficiency_pct',
    ce_pct: 'coulombic_efficiency_pct',
    ce: 'coulombic_efficiency_pct',
    internal_resistance_ohm: 'internal_resistance_ohm',
    internal_resistance: 'internal_resistance_ohm',
    r_int: 'internal_resistance_ohm',
    rint: 'internal_resistance_ohm',
    power_density_mwm2: 'power_density_mWm2',
    power_density: 'power_density_mWm2',
    power_density_mw_m2: 'power_density_mWm2',
    power: 'power_density_mWm2',
  };

  const colIdxToKey: Record<number, FeatureKey | TargetKey> = {};
  const matchedColumns: string[] = [];

  rawHeaders.forEach((rawH, idx) => {
    const clean = rawH.toLowerCase().replace(/[\s\-_/]/g, '_');
    const matched = keyAliases[clean] || keyAliases[rawH.toLowerCase()];
    if (matched) {
      colIdxToKey[idx] = matched;
      if (!matchedColumns.includes(matched)) matchedColumns.push(matched);
    }
  });

  const expectedKeys = MFC_COLUMNS_METADATA.map((c) => c.key);
  const missingRequired = expectedKeys.filter((k) => !matchedColumns.includes(k));

  if (missingRequired.length > 0) {
    errors.push(`Missing columns: ${missingRequired.join(', ')}`);
  }

  const rows: MFCDataRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(delimiter).map((p) => p.replace(/['"]/g, '').trim());
    const row: any = { id: i };

    // Fill defaults
    expectedKeys.forEach((key) => {
      row[key] = NaN;
    });

    parts.forEach((val, colIdx) => {
      const targetKey = colIdxToKey[colIdx];
      if (targetKey) {
        const num = parseFloat(val);
        row[targetKey] = isNaN(num) ? NaN : num;
      }
    });

    rows.push(row as MFCDataRow);
  }

  return {
    rows,
    errors,
    matchedColumns,
    missingRequiredColumns: missingRequired,
  };
}

export function exportToCSV(data: MFCDataRow[]): string {
  const headers = MFC_COLUMNS_METADATA.map((c) => c.key);
  const headerLine = headers.join(',');
  const rowLines = data.map((row) => headers.map((h) => row[h] ?? '').join(','));
  return [headerLine, ...rowLines].join('\n');
}
