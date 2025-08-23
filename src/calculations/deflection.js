// Tool Deflection Calculation Module
// Comprehensive deflection analysis including bending, shear, and holder compliance

import { MATERIAL_CONSTANTS, DEFLECTION_CONSTANTS, GEOMETRY } from '../utils/constants.js';

/**
 * Calculate total tool deflection
 * @param {Object} params - Calculation parameters
 * @returns {Object} - Deflection analysis results
 */
export function calculateToolDeflection(params) {
    const {
        tool,
        cuttingForce,
        stickout,
        holderType = 'collet'
    } = params;
    
    // Tool geometry
    const diameter = tool.diameter_mm || 6;
    const length = stickout || tool.stickout_mm || 25;
    
    // Material properties
    const toolMaterial = tool.material || 'carbide';
    const E = getToolModulus(toolMaterial); // GPa
    
    // Calculate individual deflection components
    const bendingDeflection = calculateBendingDeflection(diameter, length, cuttingForce, E);
    const shearDeflection = calculateShearDeflection(diameter, length, cuttingForce, E);
    const holderCompliance = calculateHolderCompliance(cuttingForce, holderType);
    
    // Total deflection
    const totalDeflection = bendingDeflection + shearDeflection + holderCompliance;
    
    // Deflection analysis
    const deflectionAnalysis = analyzeDeflection(totalDeflection, tool);
    
    return {
        total_deflection_mm: totalDeflection,
        bending_deflection_mm: bendingDeflection,
        shear_deflection_mm: shearDeflection,
        holder_compliance_mm: holderCompliance,
        deflection_analysis: deflectionAnalysis,
        tool_geometry: {
            diameter_mm: diameter,
            length_mm: length,
            modulus_GPa: E
        }
    };
}

/**
 * Calculate bending deflection using cantilever beam theory
 * @param {number} diameter - Tool diameter (mm)
 * @param {number} length - Tool length (mm)
 * @param {number} force - Cutting force (N)
 * @param {number} E - Young's modulus (GPa)
 * @returns {number} - Bending deflection (mm)
 */
function calculateBendingDeflection(diameter, length, force, E) {
    // Second moment of area for circular cross-section (mm⁴)
    const I = (Math.PI * Math.pow(diameter, 4)) / 64;
    
    // Convert modulus to N/mm²
    const E_Pa = E * 1000;
    
    // Cantilever beam deflection: δ = FL³/(3EI)
    const deflection = (force * Math.pow(length, 3)) / (3 * E_Pa * I);
    
    return deflection;
}

/**
 * Calculate shear deflection for short, thick tools
 * @param {number} diameter - Tool diameter (mm)
 * @param {number} length - Tool length (mm)
 * @param {number} force - Cutting force (N)
 * @param {number} E - Young's modulus (GPa)
 * @returns {number} - Shear deflection (mm)
 */
function calculateShearDeflection(diameter, length, force, E) {
    // Shear modulus (approximately E/2.6 for most tool materials)
    const G = E / 2.6;
    
    // Cross-sectional area (mm²)
    const A = (Math.PI * diameter * diameter) / 4;
    
    // Shape factor for circular cross-section
    const k = 1.33;
    
    // Convert shear modulus to N/mm²
    const G_Pa = G * 1000;
    
    // Shear deflection: δ = kFL/(GA)
    const deflection = (k * force * length) / (G_Pa * A);
    
    return deflection;
}

/**
 * Calculate tool holder compliance contribution
 * @param {number} force - Cutting force (N)
 * @param {string} holderType - Type of tool holder
 * @returns {number} - Holder compliance deflection (mm)
 */
function calculateHolderCompliance(force, holderType) {
    const compliance = DEFLECTION_CONSTANTS.TOOL_HOLDER_COMPLIANCE[holderType.toUpperCase()] || 
                      DEFLECTION_CONSTANTS.TOOL_HOLDER_COMPLIANCE.COLLET;
    
    return force * compliance;
}

/**
 * Get tool material Young's modulus
 * @param {string} material - Tool material type
 * @returns {number} - Young's modulus in GPa
 */
function getToolModulus(material) {
    const moduli = {
        'carbide': MATERIAL_CONSTANTS.CARBIDE_E_GPA,
        'hss': MATERIAL_CONSTANTS.HSS_E_GPA,
        'cermet': 450,
        'ceramic': 380,
        'diamond': 1000,
        'cbn': 700
    };
    
    return moduli[material.toLowerCase()] || MATERIAL_CONSTANTS.CARBIDE_E_GPA;
}

/**
 * Analyze deflection and provide recommendations
 * @param {number} deflection - Total deflection (mm)
 * @param {Object} tool - Tool configuration
 * @returns {Object} - Deflection analysis
 */
function analyzeDeflection(deflection, tool) {
    const diameter = tool.diameter_mm || 6;
    
    // Deflection as percentage of tool diameter
    const deflectionPercent = (deflection / diameter) * 100;
    
    // Deflection limits
    const limits = DEFLECTION_CONSTANTS.DEFLECTION_LIMITS;
    
    let status, severity, message, recommendations = [];
    
    if (deflection <= limits.FINISH) {
        status = 'excellent';
        severity = 'info';
        message = 'Deflection within finishing tolerance';
    } else if (deflection <= limits.SEMI_FINISH) {
        status = 'good';
        severity = 'info';
        message = 'Deflection suitable for semi-finishing';
    } else if (deflection <= limits.ROUGH) {
        status = 'acceptable';
        severity = 'warning';
        message = 'Deflection acceptable for roughing only';
        recommendations.push('Consider reducing cutting parameters for better finish');
    } else {
        status = 'excessive';
        severity = 'danger';
        message = 'Excessive deflection - risk of poor finish or tool breakage';
        recommendations.push('Reduce cutting forces');
        recommendations.push('Use shorter/larger diameter tool');
        recommendations.push('Improve tool holder rigidity');
    }
    
    // Add specific recommendations based on deflection percentage
    if (deflectionPercent > 1.0) {
        recommendations.push('Deflection > 1% of tool diameter');
    }
    
    return {
        status,
        severity,
        message,
        deflection_percent_of_diameter: deflectionPercent,
        recommendations
    };
}

/**
 * Calculate critical cutting force for tool failure
 * @param {Object} tool - Tool configuration
 * @param {number} stickout - Tool stickout length (mm)
 * @returns {Object} - Critical force analysis
 */
export function calculateCriticalForce(tool, stickout) {
    const diameter = tool.diameter_mm || 6;
    const length = stickout || tool.stickout_mm || 25;
    const material = tool.material || 'carbide';
    
    // Tool material properties
    const E = getToolModulus(material); // GPa
    const yieldStrength = getToolYieldStrength(material); // MPa
    
    // Critical bending stress at failure
    const I = (Math.PI * Math.pow(diameter, 4)) / 64; // mm⁴
    const c = diameter / 2; // mm (distance to neutral axis)
    
    // Convert to consistent units
    const E_Pa = E * 1000; // N/mm²
    const sigma_yield = yieldStrength; // N/mm²
    
    // Critical force for yield: F = σyI/(cL)
    const criticalForceYield = (sigma_yield * I) / (c * length);
    
    // Critical force for excessive deflection (deflection = diameter/100)
    const maxDeflection = diameter / 100; // 1% of diameter
    const criticalForceDeflection = (3 * E_Pa * I * maxDeflection) / Math.pow(length, 3);
    
    // The limiting factor is the smaller of the two
    const criticalForce = Math.min(criticalForceYield, criticalForceDeflection);
    const limitingFactor = criticalForce === criticalForceYield ? 'yield_strength' : 'deflection';
    
    return {
        critical_force_N: criticalForce,
        critical_force_yield_N: criticalForceYield,
        critical_force_deflection_N: criticalForceDeflection,
        limiting_factor: limitingFactor,
        safety_margin: 2.0 // Recommended safety factor
    };
}

/**
 * Get tool material yield strength
 * @param {string} material - Tool material type
 * @returns {number} - Yield strength in MPa
 */
function getToolYieldStrength(material) {
    const yieldStrengths = {
        'carbide': 3000,  // MPa (compressive)
        'hss': 2000,
        'cermet': 2500,
        'ceramic': 1500,
        'diamond': 5000,
        'cbn': 4000
    };
    
    return yieldStrengths[material.toLowerCase()] || 3000;
}

/**
 * Optimize tool geometry for deflection
 * @param {Object} params - Optimization parameters
 * @returns {Object} - Optimization recommendations
 */
export function optimizeForDeflection(params) {
    const {
        targetDeflection,
        cuttingForce,
        availableDiameters = [3, 4, 5, 6, 8, 10, 12, 16, 20],
        maxStickout = 50
    } = params;
    
    const recommendations = [];
    
    for (const diameter of availableDiameters) {
        // Calculate maximum stickout for target deflection
        const E = MATERIAL_CONSTANTS.CARBIDE_E_GPA * 1000; // N/mm²
        const I = (Math.PI * Math.pow(diameter, 4)) / 64;
        
        // From bending equation: L = ∛(3EIδ/F)
        const maxLength = Math.pow(
            (3 * E * I * targetDeflection) / cuttingForce,
            1/3
        );
        
        if (maxLength >= 10 && maxLength <= maxStickout) { // Minimum practical length
            recommendations.push({
                diameter_mm: diameter,
                max_stickout_mm: Math.floor(maxLength),
                deflection_mm: targetDeflection,
                aspect_ratio: maxLength / diameter
            });
        }
    }
    
    // Sort by aspect ratio (lower is more rigid)
    recommendations.sort((a, b) => a.aspect_ratio - b.aspect_ratio);
    
    return {
        recommendations: recommendations.slice(0, 5), // Top 5 recommendations
        optimal_diameter: recommendations[0]?.diameter_mm,
        optimal_stickout: recommendations[0]?.max_stickout_mm
    };
}

/**
 * Calculate dynamic effects on deflection
 * @param {Object} params - Dynamic parameters
 * @returns {Object} - Dynamic deflection analysis
 */
export function calculateDynamicDeflection(params) {
    const {
        tool,
        rpm,
        staticDeflection,
        machineStiffness = 100 // N/mm
    } = params;
    
    // Calculate tool natural frequency
    const naturalFrequency = calculateToolNaturalFrequency(tool);
    
    // Operating frequency from spindle RPM
    const operatingFrequency = rpm / 60; // Hz
    
    // Calculate frequency ratio
    const frequencyRatio = operatingFrequency / naturalFrequency;
    
    // Dynamic amplification factor
    let amplificationFactor;
    if (frequencyRatio < 0.7) {
        // Below resonance
        amplificationFactor = 1.0 + 0.1 * frequencyRatio;
    } else if (frequencyRatio > 1.4) {
        // Above resonance
        amplificationFactor = 1.0 / (frequencyRatio * frequencyRatio);
    } else {
        // Near resonance - avoid this region
        amplificationFactor = 3.0 + Math.sin(frequencyRatio * Math.PI) * 2.0;
    }
    
    const dynamicDeflection = staticDeflection * amplificationFactor;
    
    return {
        natural_frequency_Hz: naturalFrequency,
        operating_frequency_Hz: operatingFrequency,
        frequency_ratio: frequencyRatio,
        amplification_factor: amplificationFactor,
        static_deflection_mm: staticDeflection,
        dynamic_deflection_mm: dynamicDeflection,
        resonance_warning: frequencyRatio > 0.7 && frequencyRatio < 1.4
    };
}

/**
 * Calculate tool natural frequency
 * @param {Object} tool - Tool configuration
 * @returns {number} - Natural frequency in Hz
 */
function calculateToolNaturalFrequency(tool) {
    const diameter = tool.diameter_mm || 6;
    const length = tool.stickout_mm || 25;
    const material = tool.material || 'carbide';
    
    // Material properties
    const E = getToolModulus(material) * 1e9; // Pa
    const density = 15000; // kg/m³ (typical for carbide)
    
    // Convert to SI units
    const D = diameter / 1000; // m
    const L = length / 1000; // m
    
    // Moment of inertia
    const I = Math.PI * Math.pow(D, 4) / 64; // m⁴
    
    // Mass per unit length
    const mu = density * Math.PI * D * D / 4; // kg/m
    
    // Natural frequency for cantilever beam (first mode)
    const lambda1 = 1.875; // First eigenvalue
    const frequency = (lambda1 * lambda1 / (2 * Math.PI)) * 
                     Math.sqrt((E * I) / (mu * Math.pow(L, 4)));
    
    return frequency; // Hz
}