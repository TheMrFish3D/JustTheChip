// Physical Constants and Engineering Values
// Used throughout the calculation engine

// Material properties
export const MATERIAL_CONSTANTS = {
    // Young's modulus (GPa)
    CARBIDE_E_GPA: 600,
    HSS_E_GPA: 210,
    ALUMINUM_E_GPA: 70,
    STEEL_E_GPA: 200,
    
    // Poisson's ratio
    CARBIDE_POISSON: 0.24,
    HSS_POISSON: 0.27,
    ALUMINUM_POISSON: 0.33,
    STEEL_POISSON: 0.27
};

// Conversion factors
export const CONVERSIONS = {
    MM_TO_INCH: 0.0393701,
    INCH_TO_MM: 25.4,
    
    KW_TO_HP: 1.34102,
    HP_TO_KW: 0.745699,
    
    MM_MIN_TO_IPM: 0.0393701,
    IPM_TO_MM_MIN: 25.4,
    
    RAD_TO_DEG: 180 / Math.PI,
    DEG_TO_RAD: Math.PI / 180,
    
    J_MM3_TO_HP_IN3: 2.373e-8
};

// Tool deflection constants
export const DEFLECTION_CONSTANTS = {
    // Tool holder compliance (mm/N)
    TOOL_HOLDER_COMPLIANCE: {
        COLLET: 0.001,
        SHRINK_FIT: 0.0005,
        HYDRAULIC: 0.0003,
        POOR_SETUP: 0.005
    },
    
    // Safety factors for deflection limits
    DEFLECTION_LIMITS: {
        FINISH: 0.005,    // 5 microns for finishing
        SEMI_FINISH: 0.02, // 20 microns for semi-finishing
        ROUGH: 0.05       // 50 microns for roughing
    }
};

// Cutting force coefficients (industry standard values)
export const FORCE_COEFFICIENTS = {
    // Specific cutting force coefficients (N/mm²)
    KC1: {
        'aluminum': 600,
        'steel': 1800,
        'stainless': 2000,
        'titanium': 2500,
        'brass': 500,
        'copper': 400,
        'plastic': 200
    },
    
    // Material exponent for chip thickness effect
    MC: {
        'aluminum': 0.25,
        'steel': 0.3,
        'stainless': 0.28,
        'titanium': 0.35,
        'brass': 0.2,
        'copper': 0.2,
        'plastic': 0.15
    }
};

// Machining parameters
export const MACHINING_CONSTANTS = {
    // Chipload ranges (mm/tooth) for different materials
    CHIPLOAD_RANGES: {
        ALUMINUM: { min: 0.05, max: 0.5 },
        STEEL: { min: 0.03, max: 0.3 },
        STAINLESS: { min: 0.02, max: 0.25 },
        TITANIUM: { min: 0.01, max: 0.15 },
        BRASS: { min: 0.05, max: 0.4 },
        PLASTIC: { min: 0.1, max: 0.8 }
    },
    
    // Surface speed ranges (m/min)
    SURFACE_SPEED_RANGES: {
        HSS: { min: 10, max: 100 },
        CARBIDE: { min: 50, max: 500 },
        COATED_CARBIDE: { min: 100, max: 800 },
        CERAMIC: { min: 200, max: 1200 }
    },
    
    // Recommended DOC as fraction of tool diameter
    DOC_RECOMMENDATIONS: {
        ROUGHING: { min: 0.5, max: 2.0 },
        SEMI_FINISHING: { min: 0.1, max: 0.5 },
        FINISHING: { min: 0.05, max: 0.2 }
    }
};

// Power calculation constants
export const POWER_CONSTANTS = {
    // Machine efficiency factors
    SPINDLE_EFFICIENCY: 0.85,
    DRIVE_EFFICIENCY: 0.9,
    
    // Power safety factors
    POWER_SAFETY_FACTOR: 1.2,
    
    // Specific cutting energy (J/mm³) - material dependent
    SPECIFIC_CUTTING_ENERGY: {
        'aluminum': 0.7,
        'steel': 2.5,
        'stainless': 3.0,
        'titanium': 4.0,
        'brass': 0.5,
        'copper': 0.4,
        'plastic': 0.2
    }
};

// Warning thresholds
export const WARNING_THRESHOLDS = {
    // Power utilization warnings
    POWER_WARNING: 0.8,    // 80% of available power
    POWER_DANGER: 0.95,    // 95% of available power
    
    // Deflection warnings (mm)
    DEFLECTION_WARNING: 0.02,  // 20 microns
    DEFLECTION_DANGER: 0.05,   // 50 microns
    
    // RPM variance from optimal
    RPM_WARNING: 0.3,      // 30% from optimal
    RPM_DANGER: 0.5,       // 50% from optimal
    
    // Feed rate limits (% of maximum)
    FEED_WARNING: 0.8,     // 80% of max feed
    FEED_DANGER: 0.95      // 95% of max feed
};

// Geometry constants
export const GEOMETRY = {
    PI: Math.PI,
    TWO_PI: 2 * Math.PI,
    HALF_PI: Math.PI / 2,
    
    // Common angles in radians
    ANGLES: {
        deg_90: Math.PI / 2,
        deg_45: Math.PI / 4,
        deg_30: Math.PI / 6,
        deg_60: Math.PI / 3
    }
};

// Time constants
export const TIME_CONSTANTS = {
    SECONDS_PER_MINUTE: 60,
    MINUTES_PER_HOUR: 60,
    HOURS_PER_DAY: 24
};

// Validation limits
export const VALIDATION_LIMITS = {
    TOOL_DIAMETER: { min: 0.1, max: 50 },      // mm
    SPINDLE_POWER: { min: 0.1, max: 50 },      // kW
    SPINDLE_RPM: { min: 100, max: 100000 },    // rpm
    FEED_RATE: { min: 1, max: 50000 },         // mm/min
    DOC: { min: 0.01, max: 25 },               // mm
    AGGRESSIVENESS: { min: 0.1, max: 3.0 }     // multiplier
};

// Default values for calculations
export const DEFAULTS = {
    AGGRESSIVENESS: 1.0,
    TOOL_STICKOUT: 25,        // mm
    TOOL_FLUTES: 4,
    TOOL_COATING: 'uncoated',
    MACHINE_RIGIDITY: 1.0,
    COOLANT: false
};

// Export all constants as a single object for convenience
export const CONSTANTS = {
    MATERIAL_CONSTANTS,
    CONVERSIONS,
    DEFLECTION_CONSTANTS,
    FORCE_COEFFICIENTS,
    MACHINING_CONSTANTS,
    POWER_CONSTANTS,
    WARNING_THRESHOLDS,
    GEOMETRY,
    TIME_CONSTANTS,
    VALIDATION_LIMITS,
    DEFAULTS
};