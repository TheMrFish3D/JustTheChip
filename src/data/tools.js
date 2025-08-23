// Tool Types and Cut Operations Database
// Extracted from original JustTheChip.html and enhanced for modular architecture

export const TOOL_TYPES = {
    endmill_flat: {
        name: 'Flat End Mill',
        icon: '🔧',
        parameters: ['diameter_mm', 'flutes', 'stickout_mm', 'shank_mm'],
        supportedCuts: ['slot', 'profile', 'adaptive', 'facing', 'plunge'],
        speedFactors: { slot: 1.0, profile: 1.2, adaptive: 1.3, facing: 1.1 }
    },
    endmill_ball: {
        name: 'Ball End Mill',
        icon: '⚪',
        parameters: ['diameter_mm', 'flutes', 'stickout_mm', 'shank_mm'],
        supportedCuts: ['profile', 'adaptive', '3d_contour'],
        speedFactors: { profile: 0.9, adaptive: 1.0, '3d_contour': 0.8 }
    },
    chamfer: {
        name: 'Chamfer Mill',
        icon: '⟋',
        parameters: ['diameter_mm', 'angle_deg', 'flutes', 'tip_diameter_mm'],
        supportedCuts: ['chamfer', 'deburr', 'countersink'],
        speedFactors: { chamfer: 1.2, deburr: 1.5, countersink: 1.0 }
    },
    vbit: {
        name: 'V-Bit / V-Carve',
        icon: '▼',
        parameters: ['angle_deg', 'tip_diameter_mm', 'max_diameter_mm', 'flutes'],
        supportedCuts: ['vcarve', 'engraving', 'chamfer'],
        speedFactors: { vcarve: 0.8, engraving: 1.0, chamfer: 0.9 }
    },
    facemill: {
        name: 'Face Mill (Insert)',
        icon: '⬡',
        parameters: ['diameter_mm', 'insert_count', 'insert_size_mm', 'max_doc_mm'],
        supportedCuts: ['facing', 'shoulder', 'ramping'],
        speedFactors: { facing: 1.4, shoulder: 1.2, ramping: 0.8 }
    },
    drill: {
        name: 'Drill Bit',
        icon: '⫸',
        parameters: ['diameter_mm', 'flutes', 'point_angle_deg', 'flute_length_mm'],
        supportedCuts: ['drilling', 'spot_drill', 'peck_drill'],
        speedFactors: { drilling: 1.0, spot_drill: 1.2, peck_drill: 0.9 }
    },
    threadmill: {
        name: 'Thread Mill',
        icon: '⟿',
        parameters: ['diameter_mm', 'pitch_mm', 'flutes', 'thread_depth_mm'],
        supportedCuts: ['thread_mill', 'helical'],
        speedFactors: { thread_mill: 0.7, helical: 0.8 }
    },
    tapered: {
        name: 'Tapered End Mill',
        icon: '⩙',
        parameters: ['tip_diameter_mm', 'taper_angle_deg', 'flutes', 'flute_length_mm'],
        supportedCuts: ['profile', '3d_contour', 'draft_angle'],
        speedFactors: { profile: 0.9, '3d_contour': 0.85, draft_angle: 1.0 }
    },
    boring: {
        name: 'Boring Bar',
        icon: '○',
        parameters: ['min_bore_diameter_mm', 'bar_diameter_mm', 'max_depth_mm', 'insert_type'],
        supportedCuts: ['boring', 'internal_profile'],
        speedFactors: { boring: 0.8, internal_profile: 0.7 }
    },
    slitting: {
        name: 'Slitting Saw',
        icon: '⊕',
        parameters: ['diameter_mm', 'width_mm', 'teeth', 'arbor_hole_mm'],
        supportedCuts: ['slitting', 'grooving'],
        speedFactors: { slitting: 0.6, grooving: 0.7 }
    }
};

export const CUT_TYPES = {
    // Standard milling operations
    slot: { 
        name: 'Slotting', 
        ae_fraction: 1.0, 
        ap_fraction_range: [0.8, 1.0],
        toolTypes: ['endmill_flat', 'endmill_ball']
    },
    profile: { 
        name: 'Profile (Side)', 
        ae_fraction_range: [0.2, 0.4], 
        ap_fraction_range: [1.0, 1.5],
        toolTypes: ['endmill_flat', 'endmill_ball', 'tapered']
    },
    adaptive: { 
        name: 'Adaptive/Trochoidal', 
        ae_fraction_range: [0.1, 0.2], 
        ap_fraction_range: [1.5, 3.0],
        toolTypes: ['endmill_flat', 'endmill_ball']
    },
    facing: { 
        name: 'Facing', 
        ae_fraction_range: [0.6, 0.8], 
        ap_fraction_range: [0.1, 0.3],
        toolTypes: ['endmill_flat', 'facemill']
    },
    plunge: {
        name: 'Plunging',
        ae_fraction: 1.0,
        ap_fraction_range: [0.1, 0.3],
        toolTypes: ['endmill_flat']
    },
    
    // Specialized operations
    chamfer: {
        name: 'Chamfering',
        ae_fraction_range: [0.3, 0.5],
        ap_fraction_range: [0.5, 1.0],
        toolTypes: ['chamfer', 'vbit']
    },
    deburr: {
        name: 'Deburring',
        ae_fraction_range: [0.1, 0.2],
        ap_fraction_range: [0.1, 0.3],
        toolTypes: ['chamfer']
    },
    countersink: {
        name: 'Countersinking',
        ae_fraction: 1.0,
        ap_fraction_range: [0.2, 0.5],
        toolTypes: ['chamfer']
    },
    vcarve: {
        name: 'V-Carving',
        ae_fraction_range: [0.8, 1.0],
        ap_fraction_range: [0.5, 1.0],
        toolTypes: ['vbit']
    },
    engraving: {
        name: 'Engraving',
        ae_fraction_range: [0.5, 0.8],
        ap_fraction_range: [0.1, 0.3],
        toolTypes: ['vbit']
    },
    shoulder: {
        name: 'Shoulder Milling',
        ae_fraction_range: [0.3, 0.5],
        ap_fraction_range: [0.8, 1.2],
        toolTypes: ['facemill']
    },
    ramping: {
        name: 'Ramping',
        ae_fraction_range: [0.4, 0.6],
        ap_fraction_range: [0.2, 0.4],
        toolTypes: ['facemill']
    },
    drilling: {
        name: 'Drilling',
        ae_fraction: 1.0,
        ap_fraction_range: [2.0, 5.0],
        toolTypes: ['drill']
    },
    spot_drill: {
        name: 'Spot Drilling',
        ae_fraction: 1.0,
        ap_fraction_range: [0.2, 0.5],
        toolTypes: ['drill']
    },
    peck_drill: {
        name: 'Peck Drilling',
        ae_fraction: 1.0,
        ap_fraction_range: [0.5, 1.5],
        toolTypes: ['drill']
    },
    thread_mill: {
        name: 'Thread Milling',
        ae_fraction_range: [0.6, 0.8],
        ap_fraction_range: [0.3, 0.5],
        toolTypes: ['threadmill']
    },
    helical: {
        name: 'Helical Interpolation',
        ae_fraction_range: [0.4, 0.6],
        ap_fraction_range: [0.2, 0.4],
        toolTypes: ['threadmill']
    },
    '3d_contour': {
        name: '3D Contouring',
        ae_fraction_range: [0.1, 0.3],
        ap_fraction_range: [0.1, 0.5],
        toolTypes: ['endmill_ball', 'tapered']
    },
    draft_angle: {
        name: 'Draft Angle',
        ae_fraction_range: [0.2, 0.4],
        ap_fraction_range: [0.8, 1.5],
        toolTypes: ['tapered']
    },
    boring: {
        name: 'Boring',
        ae_fraction: 1.0,
        ap_fraction_range: [0.3, 0.6],
        toolTypes: ['boring']
    },
    internal_profile: {
        name: 'Internal Profiling',
        ae_fraction_range: [0.2, 0.4],
        ap_fraction_range: [0.5, 1.0],
        toolTypes: ['boring']
    },
    slitting: {
        name: 'Slitting',
        ae_fraction: 1.0,
        ap_fraction_range: [8.0, 15.0],
        toolTypes: ['slitting']
    },
    grooving: {
        name: 'Grooving',
        ae_fraction: 1.0,
        ap_fraction_range: [5.0, 10.0],
        toolTypes: ['slitting']
    }
};

// Helper functions for tool operations
export const TOOL_UTILS = {
    getToolsByType: (toolType) => {
        return TOOL_TYPES[toolType] || null;
    },
    
    getSupportedCutsForTool: (toolType) => {
        const tool = TOOL_TYPES[toolType];
        return tool ? tool.supportedCuts : [];
    },
    
    getCutTypesForTool: (toolType) => {
        return Object.entries(CUT_TYPES)
            .filter(([_, cutType]) => cutType.toolTypes.includes(toolType))
            .map(([key, cutType]) => ({ key, ...cutType }));
    },
    
    getSpeedFactor: (toolType, cutType) => {
        const tool = TOOL_TYPES[toolType];
        if (!tool || !tool.speedFactors) return 1.0;
        return tool.speedFactors[cutType] || 1.0;
    },
    
    validateToolParameters: (toolType, parameters) => {
        const tool = TOOL_TYPES[toolType];
        if (!tool) return false;
        
        return tool.parameters.every(param => 
            parameters.hasOwnProperty(param) && 
            typeof parameters[param] === 'number' && 
            parameters[param] > 0
        );
    }
};