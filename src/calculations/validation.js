// Input Validation and Limits Module
// Comprehensive validation for all calculation parameters

import { VALIDATION_LIMITS, WARNING_THRESHOLDS } from '../utils/constants.js';

/**
 * Validate all calculation inputs
 * @param {Object} inputs - All calculation inputs
 * @returns {Object} - Validation results with errors and warnings
 */
export function validateCalculationInputs(inputs) {
    const errors = [];
    const warnings = [];
    
    // Validate machine configuration
    const machineValidation = validateMachine(inputs.machine);
    errors.push(...machineValidation.errors);
    warnings.push(...machineValidation.warnings);
    
    // Validate spindle configuration
    const spindleValidation = validateSpindle(inputs.spindle);
    errors.push(...spindleValidation.errors);
    warnings.push(...spindleValidation.warnings);
    
    // Validate tool configuration
    const toolValidation = validateTool(inputs.tool);
    errors.push(...toolValidation.errors);
    warnings.push(...toolValidation.warnings);
    
    // Validate material selection
    const materialValidation = validateMaterial(inputs.material);
    errors.push(...materialValidation.errors);
    warnings.push(...materialValidation.warnings);
    
    // Validate cut parameters
    const cutValidation = validateCutParameters(inputs.cutParams);
    errors.push(...cutValidation.errors);
    warnings.push(...cutValidation.warnings);
    
    // Cross-validate combinations
    const combinationValidation = validateCombinations(inputs);
    errors.push(...combinationValidation.errors);
    warnings.push(...combinationValidation.warnings);
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        hasWarnings: warnings.length > 0
    };
}

/**
 * Validate machine configuration
 * @param {Object} machine - Machine configuration
 * @returns {Object} - Validation results
 */
export function validateMachine(machine) {
    const errors = [];
    const warnings = [];
    
    if (!machine) {
        errors.push('Machine configuration is required');
        return { errors, warnings };
    }
    
    // Validate feed rate limits
    if (machine.max_feed_mm_min) {
        const { x, y, z } = machine.max_feed_mm_min;
        
        if (!isValidNumber(x) || x <= 0) {
            errors.push('X-axis maximum feed rate must be positive');
        } else if (x < 100) {
            warnings.push('X-axis feed rate seems very low for modern machines');
        } else if (x > 50000) {
            warnings.push('X-axis feed rate seems very high - verify specifications');
        }
        
        if (!isValidNumber(y) || y <= 0) {
            errors.push('Y-axis maximum feed rate must be positive');
        }
        
        if (!isValidNumber(z) || z <= 0) {
            errors.push('Z-axis maximum feed rate must be positive');
        }
    }
    
    // Validate rigidity factor
    if (machine.K_rigidity !== undefined) {
        if (!isValidNumber(machine.K_rigidity) || machine.K_rigidity <= 0) {
            errors.push('Machine rigidity factor must be positive');
        } else if (machine.K_rigidity < 0.5) {
            warnings.push('Very low rigidity factor - expect poor surface finish');
        } else if (machine.K_rigidity > 2.0) {
            warnings.push('Very high rigidity factor - verify machine specifications');
        }
    }
    
    return { errors, warnings };
}

/**
 * Validate spindle configuration
 * @param {Object} spindle - Spindle configuration
 * @returns {Object} - Validation results
 */
export function validateSpindle(spindle) {
    const errors = [];
    const warnings = [];
    
    if (!spindle) {
        errors.push('Spindle configuration is required');
        return { errors, warnings };
    }
    
    // Validate power rating
    const { rated_power_kW } = spindle;
    if (!isValidNumber(rated_power_kW) || rated_power_kW <= 0) {
        errors.push('Spindle power rating must be positive');
    } else if (rated_power_kW < VALIDATION_LIMITS.SPINDLE_POWER.min) {
        warnings.push(`Spindle power below typical minimum (${VALIDATION_LIMITS.SPINDLE_POWER.min} kW)`);
    } else if (rated_power_kW > VALIDATION_LIMITS.SPINDLE_POWER.max) {
        warnings.push(`Spindle power above typical maximum (${VALIDATION_LIMITS.SPINDLE_POWER.max} kW)`);
    }
    
    // Validate RPM range
    const { rpm_min, rpm_max, base_rpm } = spindle;
    
    if (!isValidNumber(rpm_min) || rpm_min <= 0) {
        errors.push('Minimum RPM must be positive');
    } else if (rpm_min < VALIDATION_LIMITS.SPINDLE_RPM.min) {
        warnings.push(`Minimum RPM very low (${rpm_min})`);
    }
    
    if (!isValidNumber(rpm_max) || rpm_max <= 0) {
        errors.push('Maximum RPM must be positive');
    } else if (rpm_max > VALIDATION_LIMITS.SPINDLE_RPM.max) {
        warnings.push(`Maximum RPM very high (${rpm_max})`);
    }
    
    if (rpm_min >= rpm_max) {
        errors.push('Maximum RPM must be greater than minimum RPM');
    }
    
    if (base_rpm && (base_rpm < rpm_min || base_rpm > rpm_max)) {
        errors.push('Base RPM must be within min/max RPM range');
    }
    
    return { errors, warnings };
}

/**
 * Validate tool configuration
 * @param {Object} tool - Tool configuration
 * @returns {Object} - Validation results
 */
export function validateTool(tool) {
    const errors = [];
    const warnings = [];
    
    if (!tool) {
        errors.push('Tool configuration is required');
        return { errors, warnings };
    }
    
    // Validate tool type
    if (!tool.type) {
        errors.push('Tool type is required');
    }
    
    // Validate diameter
    const { diameter_mm } = tool;
    if (!isValidNumber(diameter_mm) || diameter_mm <= 0) {
        errors.push('Tool diameter must be positive');
    } else if (diameter_mm < VALIDATION_LIMITS.TOOL_DIAMETER.min) {
        warnings.push(`Tool diameter very small (${diameter_mm}mm)`);
    } else if (diameter_mm > VALIDATION_LIMITS.TOOL_DIAMETER.max) {
        warnings.push(`Tool diameter very large (${diameter_mm}mm)`);
    }
    
    // Validate flutes
    const { flutes } = tool;
    if (flutes !== undefined) {
        if (!isValidNumber(flutes) || flutes < 1 || flutes > 20) {
            errors.push('Number of flutes must be between 1 and 20');
        } else if (flutes === 1) {
            warnings.push('Single-flute tools require special consideration');
        } else if (flutes > 8 && diameter_mm < 6) {
            warnings.push('Many flutes on small diameter may cause chip evacuation issues');
        }
    }
    
    // Validate stickout
    const { stickout_mm } = tool;
    if (stickout_mm !== undefined) {
        if (!isValidNumber(stickout_mm) || stickout_mm <= 0) {
            errors.push('Tool stickout must be positive');
        } else {
            const aspectRatio = stickout_mm / diameter_mm;
            if (aspectRatio > 6) {
                warnings.push(`High aspect ratio (${aspectRatio.toFixed(1)}:1) - expect high deflection`);
            } else if (aspectRatio > 10) {
                errors.push(`Extreme aspect ratio (${aspectRatio.toFixed(1)}:1) - likely to break`);
            }
        }
    }
    
    return { errors, warnings };
}

/**
 * Validate material properties
 * @param {Object} material - Material configuration
 * @returns {Object} - Validation results
 */
export function validateMaterial(material) {
    const errors = [];
    const warnings = [];
    
    if (!material) {
        errors.push('Material selection is required');
        return { errors, warnings };
    }
    
    // Validate chipload ranges
    if (material.chipload_range) {
        const [min, max] = material.chipload_range;
        if (!isValidNumber(min) || !isValidNumber(max) || min <= 0 || max <= 0) {
            errors.push('Material chipload range must be positive values');
        } else if (min >= max) {
            errors.push('Maximum chipload must be greater than minimum');
        }
    }
    
    // Validate surface speed ranges
    if (material.vc_range) {
        const [min, max] = material.vc_range;
        if (!isValidNumber(min) || !isValidNumber(max) || min <= 0 || max <= 0) {
            errors.push('Material surface speed range must be positive values');
        } else if (min >= max) {
            errors.push('Maximum surface speed must be greater than minimum');
        }
    }
    
    // Validate force coefficients
    if (material.force_coefficients) {
        const { Kt, Kr, Ka } = material.force_coefficients;
        if (Kt !== undefined && (!isValidNumber(Kt) || Kt <= 0)) {
            warnings.push('Tangential force coefficient should be positive');
        }
        if (Kr !== undefined && (!isValidNumber(Kr) || Kr < 0)) {
            warnings.push('Radial force coefficient should be non-negative');
        }
        if (Ka !== undefined && (!isValidNumber(Ka) || Ka < 0)) {
            warnings.push('Axial force coefficient should be non-negative');
        }
    }
    
    return { errors, warnings };
}

/**
 * Validate cut parameters
 * @param {Object} cutParams - Cut parameters
 * @returns {Object} - Validation results
 */
export function validateCutParameters(cutParams) {
    const errors = [];
    const warnings = [];
    
    if (!cutParams) {
        errors.push('Cut parameters are required');
        return { errors, warnings };
    }
    
    // Validate depth of cut (DOC)
    const { doc_mm } = cutParams;
    if (doc_mm !== undefined) {
        if (!isValidNumber(doc_mm) || doc_mm <= 0) {
            errors.push('Depth of cut must be positive');
        } else if (doc_mm < VALIDATION_LIMITS.DOC.min) {
            warnings.push(`Very shallow depth of cut (${doc_mm}mm)`);
        } else if (doc_mm > VALIDATION_LIMITS.DOC.max) {
            warnings.push(`Very deep depth of cut (${doc_mm}mm)`);
        }
    }
    
    // Validate aggressiveness factor
    const { aggressiveness } = cutParams;
    if (aggressiveness !== undefined) {
        if (!isValidNumber(aggressiveness) || aggressiveness <= 0) {
            errors.push('Aggressiveness factor must be positive');
        } else if (aggressiveness < VALIDATION_LIMITS.AGGRESSIVENESS.min) {
            warnings.push('Very conservative aggressiveness setting');
        } else if (aggressiveness > VALIDATION_LIMITS.AGGRESSIVENESS.max) {
            warnings.push('Very aggressive settings - high risk of tool breakage');
        }
    }
    
    return { errors, warnings };
}

/**
 * Validate combinations of parameters
 * @param {Object} inputs - All inputs
 * @returns {Object} - Validation results
 */
export function validateCombinations(inputs) {
    const errors = [];
    const warnings = [];
    
    const { tool, material, spindle, cutParams } = inputs;
    
    if (!tool || !material || !spindle) {
        return { errors, warnings };
    }
    
    // Tool diameter vs spindle collet capability
    if (tool.diameter_mm && spindle.collet_sizes) {
        const canHoldTool = spindle.collet_sizes.some(collet => {
            // Simplified check - in practice would need collet specification database
            return true; // Placeholder
        });
        
        if (!canHoldTool) {
            warnings.push('Tool diameter may not be compatible with spindle collets');
        }
    }
    
    // Material hardness vs tool capability
    if (material.hardness_hrc && tool.type) {
        if (material.hardness_hrc > 60 && tool.type.includes('hss')) {
            warnings.push('HSS tools may not be suitable for very hard materials');
        }
    }
    
    // High speed with large tools
    if (tool.diameter_mm && spindle.rpm_max) {
        const maxSurfaceSpeed = (Math.PI * tool.diameter_mm * spindle.rpm_max) / 1000; // m/min
        if (maxSurfaceSpeed > 1000) {
            warnings.push('Very high surface speeds possible - ensure tool rating');
        }
    }
    
    // Deep cuts with small tools
    if (cutParams?.doc_mm && tool.diameter_mm) {
        const docRatio = cutParams.doc_mm / tool.diameter_mm;
        if (docRatio > 2.0) {
            warnings.push('Deep cut relative to tool diameter - expect high forces');
        } else if (docRatio > 3.0) {
            errors.push('Extreme depth of cut - likely to break tool');
        }
    }
    
    return { errors, warnings };
}

/**
 * Validate calculation results
 * @param {Object} results - Calculation results
 * @returns {Object} - Result validation
 */
export function validateCalculationResults(results) {
    const warnings = [];
    const recommendations = [];
    
    // Power utilization check
    if (results.power_utilization_percent) {
        if (results.power_utilization_percent > WARNING_THRESHOLDS.POWER_WARNING * 100) {
            warnings.push({
                type: 'warning',
                category: 'power',
                message: `High power utilization (${results.power_utilization_percent.toFixed(1)}%)`
            });
            recommendations.push('Consider reducing feed rate or depth of cut');
        }
        
        if (results.power_utilization_percent > WARNING_THRESHOLDS.POWER_DANGER * 100) {
            warnings.push({
                type: 'danger',
                category: 'power',
                message: 'Power requirement exceeds spindle capability'
            });
            recommendations.push('Reduce cutting parameters significantly');
        }
    }
    
    // Deflection check
    if (results.tool_deflection_mm) {
        if (results.tool_deflection_mm > WARNING_THRESHOLDS.DEFLECTION_WARNING) {
            warnings.push({
                type: 'warning',
                category: 'deflection',
                message: `High tool deflection (${(results.tool_deflection_mm * 1000).toFixed(1)} µm)`
            });
            recommendations.push('Use shorter or larger diameter tool');
        }
        
        if (results.tool_deflection_mm > WARNING_THRESHOLDS.DEFLECTION_DANGER) {
            warnings.push({
                type: 'danger',
                category: 'deflection',
                message: 'Excessive tool deflection - poor surface finish expected'
            });
            recommendations.push('Significantly reduce cutting forces');
        }
    }
    
    // Feed rate check
    if (results.feed_rate_mm_min && results.max_feed_rate_mm_min) {
        const feedUtilization = results.feed_rate_mm_min / results.max_feed_rate_mm_min;
        if (feedUtilization > WARNING_THRESHOLDS.FEED_WARNING) {
            warnings.push({
                type: 'warning',
                category: 'feed',
                message: `High feed rate utilization (${(feedUtilization * 100).toFixed(1)}%)`
            });
        }
    }
    
    return {
        warnings,
        recommendations,
        overallStatus: warnings.some(w => w.type === 'danger') ? 'danger' : 
                      warnings.some(w => w.type === 'warning') ? 'warning' : 'good'
    };
}

/**
 * Check if a value is a valid number
 * @param {any} value - Value to check
 * @returns {boolean} - True if valid number
 */
function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Sanitize and validate input ranges
 * @param {Object} params - Parameters to sanitize
 * @returns {Object} - Sanitized parameters
 */
export function sanitizeInputs(params) {
    const sanitized = { ...params };
    
    // Clamp numeric values to valid ranges
    if (sanitized.tool?.diameter_mm) {
        sanitized.tool.diameter_mm = Math.max(
            VALIDATION_LIMITS.TOOL_DIAMETER.min,
            Math.min(VALIDATION_LIMITS.TOOL_DIAMETER.max, sanitized.tool.diameter_mm)
        );
    }
    
    if (sanitized.spindle?.rated_power_kW) {
        sanitized.spindle.rated_power_kW = Math.max(
            VALIDATION_LIMITS.SPINDLE_POWER.min,
            Math.min(VALIDATION_LIMITS.SPINDLE_POWER.max, sanitized.spindle.rated_power_kW)
        );
    }
    
    if (sanitized.cutParams?.aggressiveness) {
        sanitized.cutParams.aggressiveness = Math.max(
            VALIDATION_LIMITS.AGGRESSIVENESS.min,
            Math.min(VALIDATION_LIMITS.AGGRESSIVENESS.max, sanitized.cutParams.aggressiveness)
        );
    }
    
    return sanitized;
}

/**
 * Get validation summary for UI display
 * @param {Object} validation - Validation results
 * @returns {Object} - Summary for display
 */
export function getValidationSummary(validation) {
    const { errors, warnings } = validation;
    
    const errorCount = errors.length;
    const warningCount = warnings.length;
    
    let status = 'valid';
    let message = 'All parameters are valid';
    
    if (errorCount > 0) {
        status = 'error';
        message = `${errorCount} error${errorCount > 1 ? 's' : ''} must be fixed`;
    } else if (warningCount > 0) {
        status = 'warning';
        message = `${warningCount} warning${warningCount > 1 ? 's' : ''} detected`;
    }
    
    return {
        status,
        message,
        errorCount,
        warningCount,
        canCalculate: errorCount === 0
    };
}