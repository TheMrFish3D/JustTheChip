// Power and Torque Calculation Module
// Based on physics-based cutting models and validated formulas

import { POWER_CONSTANTS, CONVERSIONS } from '../utils/constants.js';

/**
 * Calculate cutting power requirements
 * @param {Object} params - Calculation parameters
 * @returns {Object} - Power calculation results
 */
export function calculateCuttingPower(params) {
    const {
        material,
        tool,
        cutType,
        rpm,
        feedRate,
        doc,        // Depth of cut (axial)
        woc,        // Width of cut (radial)
        machine
    } = params;
    
    // Material Removal Rate (mm³/min)
    const mrr = woc * doc * feedRate;
    
    // Get specific cutting energy for material
    const specificEnergy = getSpecificCuttingEnergy(material);
    
    // Base cutting power (W)
    const baseCuttingPower = (mrr * specificEnergy) / 60; // Convert mm³/min to mm³/s
    
    // Tool geometry factor
    const toolFactor = getToolPowerFactor(tool, cutType);
    
    // Tool efficiency factor (includes coating effects)
    const toolEfficiency = getToolEfficiency(tool);
    
    // Machine rigidity factor
    const rigidityFactor = machine.K_rigidity || 1.0;
    
    // Calculate net cutting power (applying efficiency to reduce power requirement)
    const netCuttingPower = baseCuttingPower * toolFactor * rigidityFactor / toolEfficiency;
    
    // Add spindle losses (empirical values)
    const spindleLosses = calculateSpindleLosses(rpm, params.spindle);
    
    // Total power at spindle
    const totalSpindlePower = netCuttingPower + spindleLosses;
    
    // Account for drive system efficiency
    const driveEfficiency = POWER_CONSTANTS.DRIVE_EFFICIENCY;
    const totalMotorPower = totalSpindlePower / driveEfficiency;
    
    return {
        mrr_mm3_min: mrr,
        net_cutting_power_W: netCuttingPower,
        spindle_losses_W: spindleLosses,
        total_spindle_power_W: totalSpindlePower,
        total_motor_power_W: totalMotorPower,
        specific_energy_J_mm3: specificEnergy,
        power_efficiency: driveEfficiency
    };
}

/**
 * Calculate spindle torque requirements
 * @param {Object} params - Calculation parameters
 * @returns {Object} - Torque calculation results
 */
export function calculateSpindleTorque(params) {
    const { rpm, power_W, tool, cutType } = params;
    
    // Convert RPM to rad/s
    const omega = (rpm * 2 * Math.PI) / 60;
    
    // Calculate torque from power
    const baseTorque = power_W / omega;
    
    // Tool-specific torque factors
    const torqueFactor = getToolTorqueFactor(tool, cutType);
    
    // Effective torque
    const effectiveTorque = baseTorque * torqueFactor;
    
    return {
        base_torque_Nm: baseTorque,
        effective_torque_Nm: effectiveTorque,
        omega_rad_s: omega,
        torque_factor: torqueFactor
    };
}

/**
 * Get available spindle power at given RPM
 * @param {Object} spindle - Spindle configuration
 * @param {number} rpm - Operating RPM
 * @returns {number} - Available power in watts
 */
export function getSpindlePowerAtRPM(spindle, rpm) {
    const { rated_power_kW, base_rpm, rpm_min, rpm_max } = spindle;
    
    // Check if RPM is within operating range
    if (rpm < rpm_min || rpm > rpm_max) return 0;
    
    const ratedPowerW = rated_power_kW * 1000;
    
    if (rpm <= base_rpm) {
        // Constant torque region - power increases linearly with RPM
        return ratedPowerW * (rpm / base_rpm);
    } else {
        // Constant power region - full power available
        return ratedPowerW;
    }
}

/**
 * Calculate power utilization percentage
 * @param {number} requiredPowerW - Required power in watts
 * @param {Object} spindle - Spindle configuration
 * @param {number} rpm - Operating RPM
 * @returns {Object} - Power utilization analysis
 */
export function analyzePowerUtilization(requiredPowerW, spindle, rpm) {
    const availablePowerW = getSpindlePowerAtRPM(spindle, rpm);
    
    if (availablePowerW === 0) {
        return {
            utilization_percent: 0,
            available_power_W: 0,
            required_power_W: requiredPowerW,
            status: 'error',
            message: 'RPM outside spindle operating range'
        };
    }
    
    const utilizationPercent = (requiredPowerW / availablePowerW) * 100;
    
    let status, message;
    if (utilizationPercent <= 80) {
        status = 'good';
        message = 'Power utilization within safe limits';
    } else if (utilizationPercent <= 95) {
        status = 'warning';
        message = 'High power utilization - consider reducing parameters';
    } else {
        status = 'danger';
        message = 'Power requirement exceeds spindle capability';
    }
    
    return {
        utilization_percent: utilizationPercent,
        available_power_W: availablePowerW,
        required_power_W: requiredPowerW,
        status,
        message
    };
}

/**
 * Get specific cutting energy for material
 * @param {Object} material - Material properties
 * @returns {number} - Specific cutting energy in J/mm³
 */
function getSpecificCuttingEnergy(material) {
    // Use material-specific value if available
    if (material.specific_cutting_energy_J_mm3) {
        return material.specific_cutting_energy_J_mm3;
    }
    
    // Fallback to generic values based on material type
    const materialType = material.category || 'aluminum';
    return POWER_CONSTANTS.SPECIFIC_CUTTING_ENERGY[materialType] || 1.0;
}

/**
 * Get tool-specific power factor
 * @param {Object} tool - Tool configuration
 * @param {string} cutType - Cut type
 * @returns {number} - Power factor multiplier
 */
function getToolPowerFactor(tool, cutType) {
    const toolType = tool.type;
    
    // Base factors by tool type
    const toolFactors = {
        endmill_flat: 1.0,
        endmill_ball: 1.1,
        chamfer: 0.9,
        vbit: 0.8,
        facemill: 1.3,
        drill: 0.7,
        threadmill: 0.6,
        tapered: 1.05,
        boring: 0.8,
        slitting: 1.4
    };
    
    // Modification factors by cut type
    const cutFactors = {
        slot: 1.2,
        profile: 1.0,
        adaptive: 0.8,
        facing: 1.1,
        plunge: 1.5,
        drilling: 1.0,
        chamfer: 0.9,
        vcarve: 0.7
    };
    
    const baseFactor = toolFactors[toolType] || 1.0;
    const cutFactor = cutFactors[cutType] || 1.0;
    
    return baseFactor * cutFactor;
}

/**
 * Get tool-specific torque factor
 * @param {Object} tool - Tool configuration
 * @param {string} cutType - Cut type
 * @returns {number} - Torque factor multiplier
 */
function getToolTorqueFactor(tool, cutType) {
    // Tools with more flutes generally need higher torque
    const fluteCount = tool.flutes || 4;
    const fluteFactor = 1.0 + (fluteCount - 2) * 0.05;
    
    // Cut type factors
    const cutTorqueFactors = {
        slot: 1.2,
        profile: 1.0,
        adaptive: 0.9,
        facing: 1.1,
        plunge: 1.4,
        drilling: 1.3
    };
    
    const cutFactor = cutTorqueFactors[cutType] || 1.0;
    
    return fluteFactor * cutFactor;
}

/**
 * Calculate spindle losses (bearing friction, air resistance, etc.)
 * @param {number} rpm - Operating RPM
 * @param {Object} spindle - Spindle configuration
 * @returns {number} - Spindle losses in watts
 */
function calculateSpindleLosses(rpm, spindle) {
    const ratedPowerW = spindle.rated_power_kW * 1000;
    
    // Base losses as percentage of rated power
    const baseLossPercent = 0.05; // 5% base losses
    const baseLosses = ratedPowerW * baseLossPercent;
    
    // RPM-dependent losses (air resistance, bearing friction)
    const rpmFactor = Math.pow(rpm / spindle.base_rpm, 1.5);
    const rpmLosses = baseLosses * 0.3 * rpmFactor;
    
    return baseLosses + rpmLosses;
}

/**
 * Calculate thermal considerations
 * @param {Object} params - Calculation parameters
 * @returns {Object} - Thermal analysis
 */
export function calculateThermalEffects(params) {
    const { power_W, material, tool, coolant = false } = params;
    
    // Heat generation rate (most power becomes heat)
    const heatGenerationW = power_W * 0.85; // 85% of power becomes heat
    
    // Tool thermal limits
    const toolThermalLimit = getToolThermalLimit(tool);
    
    // Material thermal properties
    const thermalConductivity = material.thermal_conductivity || 50; // W/m·K
    
    // Coolant effectiveness
    const coolantFactor = coolant ? 0.3 : 1.0; // 70% heat reduction with coolant
    
    // Effective heat in tool
    const effectiveHeat = heatGenerationW * coolantFactor * 0.2; // 20% of heat goes to tool
    
    return {
        heat_generation_W: heatGenerationW,
        effective_tool_heat_W: effectiveHeat,
        tool_thermal_limit_W: toolThermalLimit,
        thermal_utilization_percent: (effectiveHeat / toolThermalLimit) * 100,
        coolant_recommended: effectiveHeat > toolThermalLimit * 0.6
    };
}

/**
 * Get tool thermal limit based on material and geometry
 * @param {Object} tool - Tool configuration
 * @returns {number} - Thermal limit in watts
 */
function getToolThermalLimit(tool) {
    const diameter = tool.diameter_mm || 6;
    const toolArea = Math.PI * diameter * diameter / 4; // mm²
    
    // Base thermal capacity per mm² (empirical values)
    const thermalCapacityPerArea = 0.5; // W/mm²
    
    return toolArea * thermalCapacityPerArea;
}

/**
 * Get tool efficiency based on material and coating
 * @param {Object} tool - Tool configuration
 * @returns {number} - Tool efficiency (0.0 to 1.0)
 */
function getToolEfficiency(tool) {
    let baseEfficiency = 0.8; // Default efficiency
    
    // Coating adjustments
    if (tool.coating === 'tialn') {
        baseEfficiency = 0.85; // TiAlN provides best efficiency
    } else if (tool.coating === 'alcrn') {
        baseEfficiency = 0.84; // AlCrN similar to TiAlN
    } else if (tool.coating === 'ticn') {
        baseEfficiency = 0.83; // TiCN good performance
    } else if (tool.coating === 'tin') {
        baseEfficiency = 0.82; // TiN standard coating
    } else if (tool.coating === 'diamond_like') {
        baseEfficiency = 0.87; // DLC excellent for non-ferrous
    } else if (tool.coating === 'uncoated') {
        baseEfficiency = 0.75; // Lower efficiency uncoated
    }
    
    // Tool type adjustments
    if (tool.type === 'endmill_ball') {
        baseEfficiency *= 0.9; // Ball end less efficient
    } else if (tool.type === 'vbit') {
        baseEfficiency *= 0.85; // V-bits less efficient
    }
    
    return baseEfficiency;
}