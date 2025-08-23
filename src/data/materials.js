// Validated Materials Database with Corrected Force Coefficients
// Based on industry standards and machining handbooks

export const MATERIALS = {
    'al_6061_t6': {
        id: 'al_6061_t6',
        name: 'Aluminum 6061-T6',
        category: 'metal',
        sfm_range: [250, 1000],
        vc_range: [76, 305],
        fz_mm_per_tooth_by_diameter: [
            { max_d_mm: 3, range: [0.008, 0.025] },    // Increased for modern carbide
            { max_d_mm: 6, range: [0.020, 0.050] },    // Increased for modern carbide
            { max_d_mm: 10, range: [0.040, 0.080] },   // Increased for modern carbide
            { max_d_mm: 20, range: [0.060, 0.120] }    // Increased for modern carbide
        ],
        // Tool-specific chipload multipliers
        toolChiploadFactors: {
            endmill_flat: 1.0,
            endmill_ball: 0.8,
            chamfer: 0.7,
            vbit: 0.6,
            facemill: 1.3,
            drill: 0.5,
            threadmill: 0.4,
            tapered: 0.85,
            boring: 0.7,
            slitting: 0.6
        },
        max_radial_engagement_fraction: { 
            slot: 1.0, profile: 0.35, adaptive: 0.15, facing: 0.75,
            chamfer: 0.4, vcarve: 0.8, drilling: 1.0, boring: 1.0
        },
        max_axial_per_pass_D: { 
            slot: 1.0, profile: 1.5, adaptive: 2.0, facing: 0.2,
            chamfer: 0.5, vcarve: 0.8, drilling: 3.0, boring: 0.5
        },
        chip_thinning: { enable_below_fraction: 0.5 },
        force_coeff_KN_mm2: 0.7,  // Validated - good value
        specific_cutting_energy_J_mm3: 0.5,  // New property for accurate power calculations
        thermal_conductivity: 167,  // W/m·K
        notes: 'Excellent machinability; avoid work hardening at low speeds.'
    },
    'steel_1018': {
        id: 'steel_1018',
        name: 'Steel 1018 (Low Carbon)',
        category: 'metal',
        sfm_range: [80, 300],
        vc_range: [24, 91],
        fz_mm_per_tooth_by_diameter: [
            { max_d_mm: 3, range: [0.003, 0.012] },
            { max_d_mm: 6, range: [0.008, 0.025] },
            { max_d_mm: 10, range: [0.015, 0.040] },
            { max_d_mm: 20, range: [0.025, 0.060] }
        ],
        toolChiploadFactors: {
            endmill_flat: 1.0,
            endmill_ball: 0.7,
            chamfer: 0.6,
            vbit: 0.5,
            facemill: 1.2,
            drill: 0.4,
            threadmill: 0.3,
            tapered: 0.75,
            boring: 0.6,
            slitting: 0.5
        },
        max_radial_engagement_fraction: { 
            slot: 1.0, profile: 0.25, adaptive: 0.10, facing: 0.6,
            chamfer: 0.3, vcarve: 0.6, drilling: 1.0, boring: 1.0
        },
        max_axial_per_pass_D: { 
            slot: 0.5, profile: 0.8, adaptive: 1.2, facing: 0.1,
            chamfer: 0.3, vcarve: 0.4, drilling: 2.0, boring: 0.3
        },
        chip_thinning: { enable_below_fraction: 0.5 },
        force_coeff_KN_mm2: 1.8,  // Corrected from 1.2 to validated range
        specific_cutting_energy_J_mm3: 2.5,
        thermal_conductivity: 51,  // W/m·K
        notes: 'Good general-purpose steel; consistent machining properties.'
    },
    'stainless_304': {
        id: 'stainless_304',
        name: '304 Stainless Steel',
        category: 'metal',
        sfm_range: [40, 150],
        vc_range: [12, 46],
        fz_mm_per_tooth_by_diameter: [
            { max_d_mm: 3, range: [0.002, 0.008] },
            { max_d_mm: 6, range: [0.006, 0.015] },
            { max_d_mm: 10, range: [0.012, 0.025] },
            { max_d_mm: 20, range: [0.020, 0.040] }
        ],
        toolChiploadFactors: {
            endmill_flat: 1.0,
            endmill_ball: 0.6,
            chamfer: 0.5,
            vbit: 0.4,
            facemill: 1.1,
            drill: 0.3,
            threadmill: 0.2,
            tapered: 0.65,
            boring: 0.5,
            slitting: 0.4
        },
        max_radial_engagement_fraction: { 
            slot: 1.0, profile: 0.15, adaptive: 0.06, facing: 0.4,
            chamfer: 0.2, vcarve: 0.4, drilling: 1.0, boring: 1.0
        },
        max_axial_per_pass_D: { 
            slot: 0.3, profile: 0.5, adaptive: 0.8, facing: 0.06,
            chamfer: 0.2, vcarve: 0.25, drilling: 1.0, boring: 0.2
        },
        chip_thinning: { enable_below_fraction: 0.5 },
        force_coeff_KN_mm2: 2.0,  // Corrected from 2.5 to validated range
        specific_cutting_energy_J_mm3: 3.5,
        thermal_conductivity: 16,  // W/m·K
        notes: 'Work hardens easily; maintain consistent chipload.'
    },
    'titanium': {
        id: 'titanium',
        name: 'Titanium (Ti-6Al-4V)',
        category: 'metal',
        sfm_range: [30, 120],
        vc_range: [9, 37],
        fz_mm_per_tooth_by_diameter: [
            { max_d_mm: 3, range: [0.001, 0.006] },
            { max_d_mm: 6, range: [0.004, 0.012] },
            { max_d_mm: 10, range: [0.008, 0.020] },
            { max_d_mm: 20, range: [0.015, 0.030] }
        ],
        toolChiploadFactors: {
            endmill_flat: 1.0,
            endmill_ball: 0.55,
            chamfer: 0.45,
            vbit: 0.35,
            facemill: 1.05,
            drill: 0.25,
            threadmill: 0.18,
            tapered: 0.6,
            boring: 0.45,
            slitting: 0.35
        },
        max_radial_engagement_fraction: { 
            slot: 1.0, profile: 0.10, adaptive: 0.04, facing: 0.3,
            chamfer: 0.15, vcarve: 0.3, drilling: 1.0, boring: 1.0
        },
        max_axial_per_pass_D: { 
            slot: 0.2, profile: 0.3, adaptive: 0.5, facing: 0.04,
            chamfer: 0.15, vcarve: 0.2, drilling: 0.75, boring: 0.15
        },
        chip_thinning: { enable_below_fraction: 0.5 },
        force_coeff_KN_mm2: 2.5,  // Corrected from 3.0 to validated range
        specific_cutting_energy_J_mm3: 5.0,
        thermal_conductivity: 7,   // W/m·K
        notes: 'Extremely tough; requires sharp tools and flood coolant.'
    },
    'acrylic': {
        id: 'acrylic',
        name: 'Acrylic (PMMA)',
        category: 'plastic',
        sfm_range: [300, 1200],
        vc_range: [91, 366],
        fz_mm_per_tooth_by_diameter: [
            { max_d_mm: 3, range: [0.01, 0.04] },
            { max_d_mm: 6, range: [0.03, 0.08] },
            { max_d_mm: 10, range: [0.06, 0.12] },
            { max_d_mm: 20, range: [0.10, 0.20] }
        ],
        toolChiploadFactors: {
            endmill_flat: 1.0,
            endmill_ball: 0.9,
            chamfer: 0.8,
            vbit: 0.7,
            facemill: 1.5,
            drill: 0.7,
            threadmill: 0.5,
            tapered: 0.95,
            boring: 0.8,
            slitting: 0.85
        },
        max_radial_engagement_fraction: { 
            slot: 1.0, profile: 0.50, adaptive: 0.25, facing: 0.85,
            chamfer: 0.55, vcarve: 0.9, drilling: 1.0, boring: 1.0
        },
        max_axial_per_pass_D: { 
            slot: 2.0, profile: 3.0, adaptive: 4.0, facing: 0.35,
            chamfer: 1.2, vcarve: 1.8, drilling: 5.0, boring: 1.2
        },
        chip_thinning: { enable_below_fraction: 0.5 },
        force_coeff_KN_mm2: 0.25,  // Corrected from 0.4
        specific_cutting_energy_J_mm3: 0.1,
        thermal_conductivity: 0.19,  // W/m·K
        notes: 'Sharp tools essential; avoid melting from heat buildup.'
    },
    'delrin': {
        id: 'delrin',
        name: 'Delrin (POM)',
        category: 'plastic',
        sfm_range: [400, 1500],
        vc_range: [122, 457],
        fz_mm_per_tooth_by_diameter: [
            { max_d_mm: 3, range: [0.015, 0.05] },
            { max_d_mm: 6, range: [0.04, 0.10] },
            { max_d_mm: 10, range: [0.08, 0.15] },
            { max_d_mm: 20, range: [0.12, 0.25] }
        ],
        toolChiploadFactors: {
            endmill_flat: 1.0,
            endmill_ball: 0.9,
            chamfer: 0.8,
            vbit: 0.75,
            facemill: 1.2,
            drill: 0.8,
            threadmill: 0.6,
            tapered: 1.0,
            boring: 0.85,
            slitting: 0.9
        },
        max_radial_engagement_fraction: { 
            slot: 1.0, profile: 0.45, adaptive: 0.20, facing: 0.8,
            chamfer: 0.5, vcarve: 0.85, drilling: 1.0, boring: 1.0
        },
        max_axial_per_pass_D: { 
            slot: 1.8, profile: 2.5, adaptive: 3.5, facing: 0.25,
            chamfer: 0.8, vcarve: 1.2, drilling: 4.5, boring: 0.8
        },
        chip_thinning: { enable_below_fraction: 0.5 },
        force_coeff_KN_mm2: 0.35,  // New validated value
        specific_cutting_energy_J_mm3: 0.15,
        thermal_conductivity: 0.31,  // W/m·K
        notes: 'Tougher than acrylic; good chip evacuation needed.'
    },
    'mdf': {
        id: 'mdf',
        name: 'MDF',
        category: 'wood',
        sfm_range: [400, 2000],
        vc_range: [122, 610],
        fz_mm_per_tooth_by_diameter: [
            { max_d_mm: 3, range: [0.02, 0.06] },
            { max_d_mm: 6, range: [0.05, 0.12] },
            { max_d_mm: 10, range: [0.10, 0.20] },
            { max_d_mm: 20, range: [0.15, 0.30] }
        ],
        toolChiploadFactors: {
            endmill_flat: 1.0,
            endmill_ball: 0.95,
            chamfer: 0.9,
            vbit: 0.85,
            facemill: 1.4,
            drill: 0.9,
            threadmill: 0.7,
            tapered: 1.1,
            boring: 0.9,
            slitting: 1.0
        },
        max_radial_engagement_fraction: { 
            slot: 1.0, profile: 0.50, adaptive: 0.25, facing: 0.85,
            chamfer: 0.55, vcarve: 0.9, drilling: 1.0, boring: 1.0
        },
        max_axial_per_pass_D: { 
            slot: 2.0, profile: 3.0, adaptive: 4.0, facing: 0.35,
            chamfer: 1.2, vcarve: 1.8, drilling: 5.0, boring: 1.2
        },
        chip_thinning: { enable_below_fraction: 0.5 },
        force_coeff_KN_mm2: 0.15,  // Corrected from 0.25
        specific_cutting_energy_J_mm3: 0.05,
        thermal_conductivity: 0.05,  // W/m·K
        notes: 'Watch for grain direction; sharp tools essential.'
    }
};

// Material categories for easier filtering
export const MATERIAL_CATEGORIES = {
    metal: ['al_6061_t6', 'steel_1018', 'stainless_304', 'titanium'],
    plastic: ['acrylic', 'delrin'],
    wood: ['mdf']
};

// Physical constants for calculations
export const MATERIAL_CONSTANTS = {
    // Young's modulus for tool materials (MPa)
    CARBIDE_YOUNGS_MODULUS: 600000,      // Increased from 200000
    HSS_YOUNGS_MODULUS: 210000,
    
    // Specific cutting energies (J/mm³) - for power calculations
    SPECIFIC_CUTTING_ENERGIES: {
        aluminum: 0.5,
        steel_mild: 2.5,
        steel_hard: 4.0,
        stainless: 3.5,
        titanium: 5.0,
        acrylic: 0.1,
        delrin: 0.15,
        wood: 0.05
    }
};