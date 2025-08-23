// Enhanced Speeds & Feeds Calculation Engine
// Based on validated formulas and industry standards

import { MATERIAL_CONSTANTS } from '../data/materials.js';

export class SpeedsFeedsCalculator {
    constructor(machine, spindle, tool, material, cutType, aggressiveness = 1.0, userDOC = null) {
        this.machine = machine;
        this.spindle = spindle;
        this.tool = tool;
        this.material = material;
        this.cutType = cutType;
        this.aggressiveness = aggressiveness;
        this.userDOC = userDOC; // User-specified Depth of Cut override
        this.warnings = [];
    }

    calculate() {
        this.warnings = [];
        
        // Get effective diameter based on tool type
        const D = this.getEffectiveDiameter();
        const z = this.getEffectiveFlutes();
        
        // Get tool-specific speed factor
        const speedFactor = this.getSpeedFactor();
        
        // Calculate surface speed (vc) from material properties
        const vcRange = this.material.vc_range;
        const vc = (vcRange[0] + vcRange[1]) / 2 * speedFactor * this.aggressiveness;
        
        // Calculate RPM from surface speed
        let rpm = (vc * 1000) / (Math.PI * D);
        
        // Clamp RPM to spindle limits
        const { rpm_min, rpm_max } = this.spindle;
        if (rpm < rpm_min) {
            rpm = rpm_min;
            this.warnings.push({ type: 'warning', message: 'RPM limited by spindle minimum' });
        } else if (rpm > rpm_max) {
            rpm = rpm_max;
            this.warnings.push({ type: 'warning', message: 'RPM limited by spindle maximum' });
        }
        
        // Get chipload range and calculate feed per tooth
        const fzRange = this.getChiploadRange(D);
        const toolFactor = this.material.toolChiploadFactors[this.tool.type] || 1.0;
        let fz = (fzRange[0] + fzRange[1]) / 2 * this.aggressiveness * toolFactor;
        
        // Get engagement parameters with user DOC override
        const { ae, ap } = this.getEngagementParams(D);
        
        // Apply chip thinning correction if needed
        if (this.material.chip_thinning && ae < D * this.material.chip_thinning.enable_below_fraction) {
            const thinningFactor = Math.sqrt(D / ae);
            fz *= thinningFactor;
            this.warnings.push({ type: 'info', message: 'Chip thinning compensation applied' });
        }
        
        // Calculate feed rate
        let vf = rpm * z * fz;
        let fzAdjusted = fz;
        
        // Check machine feed limits
        const maxFeed = Math.min(
            this.machine.max_feed_mm_min.x,
            this.machine.max_feed_mm_min.y,
            this.machine.max_feed_mm_min.z
        );
        if (vf > maxFeed) {
            vf = maxFeed;
            fzAdjusted = vf / (rpm * z);
            this.warnings.push({ type: 'warning', message: 'Feed limited by machine' });
        }
        
        // Calculate MRR (Material Removal Rate)
        let mrr = this.calculateMRR(D, ae, ap, vf);
        
        // Calculate power requirement using improved model
        const powerRequired = this.calculateImprovedPower(ae, ap, vf);
        const powerAvailable = this.getSpindlePowerAtRPM(rpm);
        
        // Power limiting
        if (powerRequired > powerAvailable * 0.9) {
            const powerRatio = (powerAvailable * 0.85) / powerRequired;
            vf *= powerRatio;
            fzAdjusted *= powerRatio;
            mrr *= powerRatio;
            this.warnings.push({ type: 'warning', message: 'Power limited' });
        }
        
        // Calculate cutting forces
        const cuttingForce = this.calculateCuttingForce(ae, ap, fzAdjusted);
        
        // Calculate tool deflection
        let deflection = 0;
        if (['endmill_flat', 'endmill_ball', 'tapered'].includes(this.tool.type)) {
            deflection = this.calculateImprovedDeflection(cuttingForce);
            if (deflection > 0.05) {
                this.warnings.push({ type: 'danger', message: `High deflection: ${deflection.toFixed(3)}mm` });
            } else if (deflection > 0.02) {
                this.warnings.push({ type: 'warning', message: `Moderate deflection: ${deflection.toFixed(3)}mm` });
            }
        }
        
        // Validate minimum chipload
        this.validateChipload(fzAdjusted, fzRange);
        
        // Tool-specific warnings
        this.addToolSpecificWarnings(D, ap, vf, cuttingForce);
        
        // Calculate actual surface speeds
        const vcActual = (Math.PI * D * rpm) / 1000;
        const sfmActual = vcActual * 3.28084;
        
        return {
            rpm: Math.round(rpm),
            feed_mm_min: Math.round(vf),
            fz_mm: parseFloat(fzAdjusted.toFixed(4)),
            fz_actual_mm: parseFloat(fz.toFixed(4)),
            ae_mm: parseFloat(ae.toFixed(2)),
            ap_mm: parseFloat(ap.toFixed(2)), // This is the DOC (Depth of Cut)
            doc_mm: parseFloat(ap.toFixed(2)), // Explicit DOC field
            mrr_mm3_min: Math.round(mrr),
            power_W: Math.round(powerRequired),
            power_available_W: Math.round(powerAvailable),
            force_N: Math.round(cuttingForce),
            deflection_mm: parseFloat(deflection.toFixed(4)),
            vc_m_min: Math.round(vcActual),
            sfm: Math.round(sfmActual),
            warnings: this.warnings,
            toolType: this.tool.type,
            effectiveDiameter: parseFloat(D.toFixed(2)),
            user_doc_override: this.userDOC !== null
        };
    }
    
    getEngagementParams(D) {
        // Get base engagement parameters
        const { ae: baseAe, ap: baseAp } = this.getBaseEngagementParams(D);
        
        // Apply user DOC override if specified
        const ap = this.userDOC !== null ? this.userDOC : baseAp;
        
        // Validate user DOC against material limits
        if (this.userDOC !== null) {
            const maxAp = this.getMaxAllowableDOC(D);
            if (ap > maxAp) {
                this.warnings.push({ 
                    type: 'warning', 
                    message: `User DOC (${ap.toFixed(2)}mm) exceeds recommended maximum (${maxAp.toFixed(2)}mm)` 
                });
            }
        }
        
        return { ae: baseAe, ap };
    }
    
    getBaseEngagementParams(D) {
        const cutDef = this.getCutDefinition();
        const matLimits = this.material;
        
        let ae, ap;
        
        // Special handling for different tool types
        if (this.tool.type === 'drill') {
            ae = D; // Full diameter
            ap = D * 0.5; // Conservative drilling depth
        } else if (this.tool.type === 'vbit') {
            const angle_rad = (this.tool.angle_deg * Math.PI) / 180;
            const estimatedDepth = this.tool.tip_diameter_mm + 2;
            ae = estimatedDepth * Math.tan(angle_rad / 2) * 2;
            ap = estimatedDepth;
        } else {
            // Standard engagement calculation
            if (this.cutType === 'slot') {
                ae = D;
            } else {
                const aeRange = cutDef.ae_fraction_range || [cutDef.ae_fraction, cutDef.ae_fraction];
                const aeFraction = (aeRange[0] + aeRange[1]) / 2;
                const maxAe = D * (matLimits.max_radial_engagement_fraction[this.cutType] || 0.3);
                ae = Math.min(D * aeFraction, maxAe) * this.machine.aggressiveness.radial;
            }
            
            const apRange = cutDef.ap_fraction_range;
            const apFraction = (apRange[0] + apRange[1]) / 2;
            const maxAp = D * (matLimits.max_axial_per_pass_D[this.cutType] || 1.0);
            ap = Math.min(D * apFraction, maxAp) * this.machine.aggressiveness.axial;
        }
        
        return { ae, ap };
    }
    
    getMaxAllowableDOC(D) {
        const matLimits = this.material.max_axial_per_pass_D[this.cutType] || 1.0;
        return D * matLimits;
    }
    
    calculateImprovedPower(ae, ap, vf) {
        // More accurate power calculation based on specific cutting energy
        const MRR_mm3_min = ae * ap * vf;
        const MRR_cm3_min = MRR_mm3_min / 1000;
        
        // Get specific cutting energy for material
        const specificEnergy = this.material.specific_cutting_energy_J_mm3 || 
                              this.getSpecificCuttingEnergy();
        
        // Calculate cutting power
        let cuttingPower = (MRR_mm3_min * specificEnergy) / 60; // Watts
        
        // Tool-specific adjustments
        const toolFactor = this.getToolPowerFactor();
        cuttingPower *= toolFactor;
        
        // Apply machine rigidity factor
        cuttingPower *= this.machine.K_rigidity;
        
        // Add spindle losses (typically 10-20% of cutting power)
        const spindleLosses = cuttingPower * 0.15;
        
        return cuttingPower + spindleLosses;
    }
    
    getSpecificCuttingEnergy() {
        // Fallback specific cutting energy based on material category
        const category = this.material.category;
        switch (category) {
            case 'metal':
                if (this.material.id.includes('aluminum')) return 0.5;
                if (this.material.id.includes('steel')) return 2.5;
                if (this.material.id.includes('stainless')) return 3.5;
                if (this.material.id.includes('titanium')) return 5.0;
                return 2.0; // Default for metals
            case 'plastic':
                return 0.1;
            case 'wood':
                return 0.05;
            default:
                return 1.0;
        }
    }
    
    getToolPowerFactor() {
        switch (this.tool.type) {
            case 'facemill':
                return 0.7; // Intermittent engagement
            case 'slitting':
                return 1.2; // Higher due to chip evacuation
            case 'drill':
                return 1.1; // Thrust component
            case 'endmill_ball':
                return 0.9; // Lower cutting efficiency at tip
            default:
                return 1.0;
        }
    }
    
    calculateImprovedDeflection(force) {
        const L = this.tool.stickout_mm || 20;
        const d = this.tool.shank_mm || this.tool.diameter_mm;
        
        // Use improved Young's modulus values
        let E = MATERIAL_CONSTANTS.CARBIDE_YOUNGS_MODULUS; // Default carbide
        if (this.tool.material === 'hss') {
            E = MATERIAL_CONSTANTS.HSS_YOUNGS_MODULUS;
        }
        
        // Bending deflection (cantilever beam)
        const I = Math.PI * Math.pow(d, 4) / 64;
        const bendingDeflection = (force * Math.pow(L, 3)) / (3 * E * I);
        
        // Shear deflection (significant for short, thick tools)
        const G = E / 2.6; // Shear modulus approximation
        const A = Math.PI * Math.pow(d, 2) / 4;
        const shearDeflection = (1.2 * force * L) / (G * A);
        
        // Tool holder compliance (empirical value)
        const holderCompliance = 0.002; // mm/N for typical holders
        const holderDeflection = force * holderCompliance;
        
        return bendingDeflection + shearDeflection + holderDeflection;
    }
    
    calculateMRR(D, ae, ap, vf) {
        if (this.tool.type === 'drill') {
            return (Math.PI * D * D / 4) * vf; // Circular cross-section
        } else {
            return ae * ap * vf; // Rectangular cross-section
        }
    }
    
    validateChipload(fzAdjusted, fzRange) {
        const minChipload = fzRange[0] * 0.5;
        if (fzAdjusted < minChipload && !['drill', 'boring'].includes(this.tool.type)) {
            this.warnings.push({ type: 'danger', message: 'Chipload too low - rubbing risk' });
        }
        
        const maxChipload = fzRange[1] * 1.5;
        if (fzAdjusted > maxChipload) {
            this.warnings.push({ type: 'warning', message: 'Chipload very high - check tool strength' });
        }
    }
    
    addToolSpecificWarnings(D, ap, vf, cuttingForce) {
        // V-bit specific warnings
        if (this.tool.type === 'vbit' && ap > D * 0.5) {
            this.warnings.push({ type: 'warning', message: 'Deep V-carve - consider multiple passes' });
        }
        
        // Slitting saw warnings
        if (this.tool.type === 'slitting' && vf > 500) {
            this.warnings.push({ type: 'warning', message: 'High feed for slitting saw - watch for blade flex' });
        }
        
        // Boring bar warnings
        if (this.tool.type === 'boring' && cuttingForce > 100) {
            this.warnings.push({ type: 'warning', message: 'High boring force - check bar rigidity' });
        }
        
        // Small tool warnings
        if (D < 1.0 && cuttingForce > 10) {
            this.warnings.push({ type: 'warning', message: 'Small tool - risk of breakage' });
        }
        
        // DOC warnings
        if (this.userDOC !== null && this.userDOC > D * 2) {
            this.warnings.push({ type: 'warning', message: 'Very deep DOC - ensure adequate chip evacuation' });
        }
    }
    
    // ... (include other existing methods like getEffectiveDiameter, getEffectiveFlutes, etc.)
    
    getEffectiveDiameter() {
        switch (this.tool.type) {
            case 'vbit':
                const angle_rad = (this.tool.angle_deg * Math.PI) / 180;
                const ap_assumed = 2;
                return this.tool.tip_diameter_mm + 2 * ap_assumed * Math.tan(angle_rad / 2);
            case 'chamfer':
                return this.tool.diameter_mm;
            case 'tapered':
                const taper_rad = (this.tool.taper_angle_deg * Math.PI) / 180;
                const depth = this.tool.flute_length_mm || 10;
                return this.tool.tip_diameter_mm + depth * Math.tan(taper_rad);
            case 'boring':
                return this.tool.min_bore_diameter_mm;
            case 'slitting':
            case 'facemill':
                return this.tool.diameter_mm;
            default:
                return this.tool.diameter_mm;
        }
    }
    
    getEffectiveFlutes() {
        switch (this.tool.type) {
            case 'facemill':
                return this.tool.insert_count || 4;
            case 'slitting':
                return this.tool.teeth || 40;
            case 'boring':
                return 1;
            default:
                return this.tool.flutes || 2;
        }
    }
    
    getSpeedFactor() {
        // Implementation for speed factors based on cut type
        const speedFactors = {
            slot: 1.0,
            profile: 1.2,
            adaptive: 1.3,
            facing: 1.1,
            drilling: 0.8,
            boring: 0.9
        };
        return speedFactors[this.cutType] || 1.0;
    }
    
    getChiploadRange(diameter) {
        const ranges = this.material.fz_mm_per_tooth_by_diameter;
        for (let i = 0; i < ranges.length; i++) {
            if (diameter <= ranges[i].max_d_mm) {
                return ranges[i].range;
            }
        }
        return ranges[ranges.length - 1].range;
    }
    
    getCutDefinition() {
        // This would come from cut types data
        // For now, return basic structure
        return {
            ae_fraction: 0.3,
            ap_fraction_range: [0.5, 1.0]
        };
    }
    
    calculateCuttingForce(ae, ap, fz) {
        const K = this.material.force_coeff_KN_mm2;
        const area = ae * fz;
        
        let forceFactor = 1.0;
        if (this.tool.type === 'drill') {
            forceFactor = 1.5;
        } else if (this.tool.type === 'vbit' || this.tool.type === 'chamfer') {
            forceFactor = 0.7;
        } else if (this.tool.type === 'facemill') {
            forceFactor = 0.6;
        }
        
        return K * area * 1000 * forceFactor;
    }
    
    getSpindlePowerAtRPM(rpm) {
        const { rated_power_kW, base_rpm, rpm_min, rpm_max } = this.spindle;
        const efficiency = 0.85; // Typical spindle efficiency
        
        if (rpm < rpm_min || rpm > rpm_max) return 0;
        
        let availablePower;
        
        if (rpm <= base_rpm) {
            // Constant torque region with gradual buildup
            const torqueRatio = Math.min(rpm / (rpm_min * 1.5), 1.0);
            availablePower = rated_power_kW * 1000 * (rpm / base_rpm) * torqueRatio;
        } else {
            // Constant power region
            availablePower = rated_power_kW * 1000;
        }
        
        return availablePower * efficiency;
    }
}