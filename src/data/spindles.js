// Spindle and Motor Specifications Database
// Common spindle configurations for CNC machining

export const SPINDLE_TYPES = {
    // Router spindles
    dewalt_611: {
        name: 'DeWalt DWP611 (Fixed Speed)',
        type: 'router',
        rated_power_kW: 1.25,
        rpm_min: 16000,
        rpm_max: 27000,
        base_rpm: 16000,
        collet_sizes: ['6mm', '1/4"'],
        cooling: 'air',
        runout_um: 25,
        features: ['fixed_speed']
    },
    
    dewalt_611_vfd: {
        name: 'DeWalt DWP611 (VFD Controlled)',
        type: 'router',
        rated_power_kW: 1.25,
        rpm_min: 8000,
        rpm_max: 27000,
        base_rpm: 16000,
        collet_sizes: ['6mm', '1/4"'],
        cooling: 'air',
        runout_um: 25,
        features: ['vfd_controlled']
    },
    
    makita_rt0701c: {
        name: 'Makita RT0701C',
        type: 'router',
        rated_power_kW: 1.25,
        rpm_min: 10000,
        rpm_max: 30000,
        base_rpm: 15000,
        collet_sizes: ['6mm', '1/4"'],
        cooling: 'air',
        runout_um: 30,
        features: ['variable_speed']
    },
    
    // Water-cooled spindles
    water_2_2kw: {
        name: '2.2kW Water-Cooled Spindle',
        type: 'water_cooled',
        rated_power_kW: 2.2,
        rpm_min: 6000,
        rpm_max: 24000,
        base_rpm: 12000,
        collet_sizes: ['ER20'],
        cooling: 'water',
        runout_um: 10,
        features: ['vfd_controlled', 'precision']
    },
    
    water_1_5kw: {
        name: '1.5kW Water-Cooled Spindle',
        type: 'water_cooled',
        rated_power_kW: 1.5,
        rpm_min: 8000,
        rpm_max: 24000,
        base_rpm: 12000,
        collet_sizes: ['ER16'],
        cooling: 'water',
        runout_um: 8,
        features: ['vfd_controlled', 'precision']
    },
    
    water_3_2kw: {
        name: '3.2kW Water-Cooled Spindle',
        type: 'water_cooled',
        rated_power_kW: 3.2,
        rpm_min: 6000,
        rpm_max: 18000,
        base_rpm: 10000,
        collet_sizes: ['ER25'],
        cooling: 'water',
        runout_um: 8,
        features: ['vfd_controlled', 'precision', 'heavy_duty']
    },
    
    // Air-cooled spindles
    air_2_2kw: {
        name: '2.2kW Air-Cooled Spindle',
        type: 'air_cooled',
        rated_power_kW: 2.2,
        rpm_min: 8000,
        rpm_max: 24000,
        base_rpm: 12000,
        collet_sizes: ['ER20'],
        cooling: 'air',
        runout_um: 15,
        features: ['vfd_controlled']
    },
    
    air_1_5kw: {
        name: '1.5kW Air-Cooled Spindle',
        type: 'air_cooled',
        rated_power_kW: 1.5,
        rpm_min: 10000,
        rpm_max: 24000,
        base_rpm: 12000,
        collet_sizes: ['ER16'],
        cooling: 'air',
        runout_um: 20,
        features: ['vfd_controlled']
    },
    
    // High-speed spindles
    high_speed_24k: {
        name: 'High-Speed 24k RPM Spindle',
        type: 'high_speed',
        rated_power_kW: 1.5,
        rpm_min: 12000,
        rpm_max: 24000,
        base_rpm: 18000,
        collet_sizes: ['ER11'],
        cooling: 'air',
        runout_um: 5,
        features: ['precision', 'high_speed']
    },
    
    high_speed_40k: {
        name: 'High-Speed 40k RPM Spindle',
        type: 'high_speed',
        rated_power_kW: 1.0,
        rpm_min: 20000,
        rpm_max: 40000,
        base_rpm: 30000,
        collet_sizes: ['ER11'],
        cooling: 'air',
        runout_um: 3,
        features: ['precision', 'high_speed', 'pcb_routing']
    },
    
    // Manual/belt-driven
    manual_r8: {
        name: 'Manual Mill (R8 Spindle)',
        type: 'manual',
        rated_power_kW: 1.5,
        rpm_min: 100,
        rpm_max: 4000,
        base_rpm: 1000,
        collet_sizes: ['R8'],
        cooling: 'none',
        runout_um: 50,
        features: ['belt_driven', 'variable_speed']
    },
    
    // Custom spindle for flexibility
    custom: {
        name: 'Custom Spindle',
        type: 'custom',
        rated_power_kW: 2.2,
        rpm_min: 8000,
        rpm_max: 24000,
        base_rpm: 12000,
        collet_sizes: ['ER20'],
        cooling: 'water',
        runout_um: 10,
        features: ['vfd_controlled']
    }
};

// Collet information
export const COLLET_INFO = {
    'ER11': {
        name: 'ER11',
        size_range: '1-7mm',
        max_tool_dia: 7,
        typical_runout_um: 5,
        applications: ['PCB routing', 'engraving', 'small tools']
    },
    'ER16': {
        name: 'ER16',
        size_range: '1-10mm',
        max_tool_dia: 10,
        typical_runout_um: 8,
        applications: ['General milling', 'small parts']
    },
    'ER20': {
        name: 'ER20',
        size_range: '1-13mm',
        max_tool_dia: 13,
        typical_runout_um: 10,
        applications: ['General milling', 'medium parts']
    },
    'ER25': {
        name: 'ER25',
        size_range: '2-16mm',
        max_tool_dia: 16,
        typical_runout_um: 12,
        applications: ['Heavy milling', 'large tools']
    },
    'R8': {
        name: 'R8',
        size_range: '6-22mm',
        max_tool_dia: 22,
        typical_runout_um: 25,
        applications: ['Manual mills', 'large tools']
    },
    '6mm': {
        name: '6mm Fixed',
        size_range: '6mm',
        max_tool_dia: 6,
        typical_runout_um: 25,
        applications: ['Router bits', '1/4" shank tools']
    },
    '1/4"': {
        name: '1/4" Fixed',
        size_range: '6.35mm',
        max_tool_dia: 6.35,
        typical_runout_um: 25,
        applications: ['Router bits', '1/4" shank tools']
    }
};

// Utility functions for spindle operations
export const SPINDLE_UTILS = {
    getSpindleByType: (spindleType) => {
        return SPINDLE_TYPES[spindleType] || null;
    },
    
    getSpindlePowerAtRPM: (spindle, rpm) => {
        const { rated_power_kW, base_rpm, rpm_min, rpm_max } = spindle;
        
        if (rpm < rpm_min || rpm > rpm_max) return 0;
        
        if (rpm <= base_rpm) {
            // Constant torque region
            return (rated_power_kW * 1000) * (rpm / base_rpm);
        } else {
            // Constant power region
            return rated_power_kW * 1000;
        }
    },
    
    validateRPMRange: (spindle, rpm) => {
        return rpm >= spindle.rpm_min && rpm <= spindle.rpm_max;
    },
    
    getOptimalRPMRange: (spindle) => {
        // Return the range where spindle operates most efficiently
        return {
            min: Math.max(spindle.rpm_min, spindle.base_rpm * 0.5),
            max: Math.min(spindle.rpm_max, spindle.base_rpm * 1.5)
        };
    },
    
    getColletCapability: (spindleType, toolDiameter) => {
        const spindle = SPINDLE_TYPES[spindleType];
        if (!spindle) return false;
        
        return spindle.collet_sizes.some(colletType => {
            const collet = COLLET_INFO[colletType];
            return collet && toolDiameter <= collet.max_tool_dia;
        });
    },
    
    getSpindlesByPowerRange: (minPowerKW, maxPowerKW) => {
        return Object.entries(SPINDLE_TYPES)
            .filter(([_, spindle]) => 
                spindle.rated_power_kW >= minPowerKW && 
                spindle.rated_power_kW <= maxPowerKW
            )
            .map(([key, spindle]) => ({ key, ...spindle }));
    },
    
    getRecommendedSpindle: (application) => {
        const recommendations = {
            'hobby': ['dewalt_611', 'air_1_5kw'],
            'professional': ['water_2_2kw', 'air_2_2kw'],
            'production': ['water_3_2kw'],
            'pcb': ['high_speed_24k', 'high_speed_40k'],
            'engraving': ['high_speed_24k'],
            'heavy_cutting': ['water_3_2kw']
        };
        
        return recommendations[application] || ['water_2_2kw'];
    }
};

// Default spindle configuration for new setups
export const DEFAULT_SPINDLE = {
    type: 'water_2_2kw',
    config: SPINDLE_TYPES.water_2_2kw
};