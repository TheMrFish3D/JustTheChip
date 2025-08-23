# JustTheChip - CNC Speeds & Feeds Calculator

## Overview

JustTheChip is a comprehensive CNC machining calculator that provides accurate speeds, feeds, and cutting parameters for various materials, tools, and machine configurations. The application has been completely redesigned with a modular architecture, validated formulas, and enhanced features for professional CNC programming.

## Key Features

### ✅ Enhanced Architecture
- **Modular Design**: Separated data, calculations, and UI components
- **Validated Formulas**: Based on industry standards and machining handbooks
- **Enhanced Motor Configuration**: Detailed specifications for steppers, servos, and drive systems
- **Direct DOC Control**: User-specified depth of cut with validation and recommendations

### ✅ Accurate Calculations
- **Improved Power Model**: Based on specific cutting energy and material properties
- **Tool Deflection Analysis**: Includes bending, shear, and tool holder compliance
- **Chip Thinning Compensation**: Automatic adjustment for light radial cuts
- **Multi-Pass Recommendations**: Intelligent suggestions for deep cuts

### ✅ Comprehensive Machine Support
- **Motor Types**: Stepper, AC Servo, DC Servo, Brushless DC
- **Drive Systems**: Ball screws, lead screws, belt drives, rack & pinion
- **Multi-Motor Axes**: Support for dual-motor gantry configurations
- **Performance Calculations**: Real-time feed rate and torque analysis

## File Structure

```
/src/
  /data/
    materials.js          - Validated material database
    machines.js          - Enhanced machine configurations
    tools.js             - Tool definitions and parameters
    spindles.js          - Spindle/motor specifications
  /calculations/
    speeds-feeds.js      - Core calculation engine
    power.js             - Power and torque calculations
    deflection.js        - Tool deflection modeling
    validation.js        - Input validation and limits
  /components/
    MachineConfig.js     - Machine configuration interface
    DOCInput.js          - Depth of cut input component
    ToolSelector.js      - Tool selection interface
    MaterialSelector.js  - Material selection interface
    ResultsDisplay.js    - Results visualization
  /utils/
    export-import.js     - Settings export/import
    constants.js         - Physical constants
  app.js                 - Main application
  index.html            - Clean HTML structure
```

## Usage Guide

### Basic Operation

1. **Select Machine Configuration**
   - Choose from preset machines or create custom configuration
   - Specify motor types (stepper/servo) and drive systems
   - Configure individual axes with motor counts and specifications

2. **Choose Material and Tool**
   - Select from validated material database
   - Configure tool parameters (diameter, flutes, coating, etc.)
   - Tool-specific parameters adjust automatically

3. **Set Cut Type and Parameters**
   - Choose machining operation (profile, slot, adaptive, etc.)
   - Adjust aggressiveness factor (0.5 = conservative, 1.5 = aggressive)
   - Override DOC (Depth of Cut) if needed

4. **Review Results**
   - Optimized RPM and feed rates
   - Power requirements and availability
   - Tool deflection analysis
   - Safety warnings and recommendations

### Advanced Features

#### Custom DOC (Depth of Cut)
- **Manual Override**: Specify exact cutting depth
- **Multi-Pass Suggestions**: Automatic recommendations for deep cuts
- **Real-Time Validation**: Warnings for excessive or insufficient DOC
- **Visual Engagement**: Graphical representation of tool-workpiece interaction

#### Motor Configuration
- **Detailed Specifications**: Torque curves, encoder resolution, power ratings
- **Drive System Modeling**: Ball screw efficiency, backlash, speed limits
- **Performance Calculations**: Maximum feed rates based on motor/drive capabilities
- **Multi-Motor Support**: Dual-motor gantry configurations

#### Material Database
- **Validated Properties**: Force coefficients based on industry data
- **Specific Cutting Energy**: Accurate power calculations
- **Tool-Specific Factors**: Chipload adjustments for different tool types
- **Thermal Properties**: Heat dissipation considerations

## Formula Validation

### Power Calculations
**Previous Formula:**
```javascript
const power = K * Q * 16.67; // Arbitrary constant
```

**Improved Formula:**
```javascript
const MRR = ae * ap * vf; // Material removal rate
const specificEnergy = material.specific_cutting_energy_J_mm3;
const cuttingPower = (MRR * specificEnergy) / 60; // Watts
const totalPower = cuttingPower * toolFactor * rigidityFactor + spindleLosses;
```

### Force Coefficients (Validated)
| Material | Previous | Validated | Source |
|----------|----------|-----------|---------|
| Aluminum 6061-T6 | 0.7 | 0.7 ✓ | Machining Data Handbook |
| Steel 1018 | 1.2 | 1.8 | ASM Metals Handbook |
| Stainless 304 | 2.5 | 2.0 | Sandvik Technical Guide |
| Titanium Ti-6Al-4V | 3.0 | 2.5 | Kennametal Catalog |

### Deflection Model
- **Bending Deflection**: Cantilever beam theory
- **Shear Deflection**: For short, thick tools
- **Tool Holder Compliance**: Empirical values (0.001-0.005 mm/N)
- **Improved E Values**: Carbide 600 GPa (vs. previous 200 GPa)

## Machine Configuration Guide

### Motor Selection

#### Stepper Motors
- **Best For**: Light to medium-duty applications
- **Control**: Open-loop positioning
- **Typical Specs**: 1-5 Nm holding torque, 1.8° step angle
- **Advantages**: Simple control, good low-speed torque
- **Limitations**: Speed limited, can lose steps under high load

#### AC Servo Motors
- **Best For**: High-performance applications
- **Control**: Closed-loop with encoder feedback
- **Typical Specs**: 2-20 Nm continuous torque, 2000-4000 RPM
- **Advantages**: High speed, excellent accuracy, overload protection
- **Considerations**: Higher cost, more complex control

#### DC Servo Motors
- **Best For**: Cost-effective servo applications
- **Control**: Closed-loop with encoder or resolver
- **Typical Specs**: 1-15 Nm continuous torque, 1500-3000 RPM
- **Advantages**: Good speed range, simpler than AC servo
- **Considerations**: Brush maintenance (brushed types)

### Drive System Selection

#### Ball Screws
- **Efficiency**: 90-95%
- **Accuracy Classes**: C10 (±52μm/300mm) to C3 (±8μm/300mm)
- **Preload**: None, light, medium, heavy
- **Best For**: High precision, high speed applications

#### Lead Screws (Acme)
- **Efficiency**: 70-80%
- **Accuracy**: ±100-500μm/300mm typical
- **Cost**: Lower than ball screws
- **Best For**: Budget builds, moderate precision requirements

#### Belt Drives
- **Efficiency**: 95-98%
- **Speed**: Very high speed capability
- **Accuracy**: Limited by belt stretch
- **Best For**: High-speed positioning, long travel distances

## Troubleshooting

### Common Issues

#### High Tool Deflection Warning
- **Causes**: Long tool, high cutting forces, inadequate rigidity
- **Solutions**: Reduce DOC, increase tool diameter, shorter tool length
- **Calculation**: Check deflection formula includes all compliance sources

#### Power Limited Message
- **Causes**: Insufficient spindle power, aggressive parameters
- **Solutions**: Reduce feed rate, lower DOC, check spindle power curve
- **Verification**: Ensure spindle efficiency losses are included

#### Chipload Too Low Warning
- **Causes**: High RPM, low feed rate, small chip load
- **Solutions**: Reduce RPM, increase feed rate, check minimum chip load
- **Risk**: Tool rubbing, poor surface finish, work hardening

#### Machine Feed Rate Limited
- **Causes**: Motor torque insufficient, drive system speed limit
- **Solutions**: Check motor specs, verify drive calculations
- **Validation**: Use MACHINE_UTILS.getMaxFeedForAxis()

### Validation Checklist

1. **Material Properties**
   - ✅ Force coefficients match industry data
   - ✅ Specific cutting energies are realistic
   - ✅ Chipload ranges reflect modern tooling

2. **Machine Configuration**
   - ✅ Motor torque calculations include efficiency
   - ✅ Drive system limits properly modeled
   - ✅ Multiple motors per axis supported

3. **Calculation Engine**
   - ✅ Power formula based on physical principles
   - ✅ Deflection includes all compliance sources
   - ✅ Chip thinning compensation applied correctly

4. **User Interface**
   - ✅ DOC input with validation and warnings
   - ✅ Machine configuration supports all motor types
   - ✅ Results display includes all relevant parameters

## API Documentation

### SpeedsFeedsCalculator Class

```javascript
// Initialize calculator
const calc = new SpeedsFeedsCalculator(
    machine,     // Machine configuration object
    spindle,     // Spindle specifications
    tool,        // Tool parameters
    material,    // Material properties
    cutType,     // Cutting operation type
    aggressiveness = 1.0,  // Aggressiveness factor
    userDOC = null         // User-specified DOC override
);

// Calculate results
const results = calc.calculate();
```

### Results Object Structure

```javascript
{
    rpm: 12000,                    // Spindle speed
    feed_mm_min: 1200,            // Feed rate
    fz_mm: 0.05,                  // Chip load per tooth
    ae_mm: 3.0,                   // Radial engagement
    ap_mm: 2.5,                   // Axial engagement (DOC)
    doc_mm: 2.5,                  // Explicit DOC field
    mrr_mm3_min: 18000,           // Material removal rate
    power_W: 450,                 // Required power
    power_available_W: 1500,      // Available spindle power
    force_N: 125,                 // Cutting force
    deflection_mm: 0.015,         // Tool deflection
    warnings: [...],              // Warning messages
    user_doc_override: false      // DOC override flag
}
```

## Contributing

### Adding New Materials
1. Research force coefficients from reliable sources
2. Validate chipload ranges with tool manufacturers
3. Include specific cutting energy values
4. Add material to `src/data/materials.js`

### Adding Machine Presets
1. Gather motor and drive specifications
2. Validate performance calculations
3. Test with representative cutting scenarios
4. Add to `src/data/machines.js`

### Formula Improvements
1. Reference peer-reviewed sources
2. Validate against known test cases
3. Include uncertainty estimates
4. Document assumptions and limitations

## References

1. **Machining Data Handbook** (3rd Edition) - Metcut Research Associates
2. **ASM Metals Handbook Volume 16: Machining** - ASM International
3. **Modern Machining Technology** - Trent & Wright
4. **Sandvik Coromant Technical Guide** - Metal Cutting Technology
5. **Kennametal Master Catalog** - Tooling Solutions
6. **Manufacturing Engineering and Technology** - Kalpakjian & Schmid

## Version History

### v2.0.0 (Current)
- ✅ Complete architectural redesign
- ✅ Validated calculation formulas
- ✅ Enhanced machine configuration
- ✅ Direct DOC input with validation
- ✅ Comprehensive documentation

### v1.0.0 (Previous)
- Single-file monolithic structure
- Basic calculation engine
- Limited machine presets
- No DOC override capability

---

**License**: MIT License  
**Maintainer**: JustTheChip Development Team  
**Last Updated**: December 2024