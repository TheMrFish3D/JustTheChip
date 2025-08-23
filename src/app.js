// Main Application Component
// Integrates all modules into the complete JustTheChip v2.0 application

import React, { useState, useEffect, useCallback } from 'react';

// Data imports
import { MACHINE_PRESETS } from './data/machines.js';
import { MATERIALS } from './data/materials.js';
import { TOOL_TYPES } from './data/tools.js';
import { SPINDLE_TYPES, DEFAULT_SPINDLE } from './data/spindles.js';

// Calculation engine imports
import { SpeedsFeedsCalculator } from './calculations/speeds-feeds.js';
import { calculateCuttingPower } from './calculations/power.js';
import { calculateToolDeflection } from './calculations/deflection.js';
import { validateCalculationInputs } from './calculations/validation.js';

// Component imports
import { MachineConfigComponent } from './components/MachineConfig.js';
import { DOCInputComponent } from './components/DOCInput.js';
import { ToolSelectorComponent } from './components/ToolSelector.js';
import { MaterialSelectorComponent } from './components/MaterialSelector.js';
import { ResultsDisplayComponent } from './components/ResultsDisplay.js';

// Utility imports
import { exportSettings, importSettings, autoSaveSettings, loadAutoSavedSettings } from './utils/export-import.js';

export function JustTheChipApp() {
    // Machine and spindle configuration
    const [selectedMachine, setSelectedMachine] = useState('printnc');
    const [customMachineConfig, setCustomMachineConfig] = useState(null);
    const [spindleConfig, setSpindleConfig] = useState(DEFAULT_SPINDLE.config);
    
    // Tool configuration
    const [selectedTool, setSelectedTool] = useState({
        type: 'endmill_flat',
        diameter_mm: 6,
        flutes: 4,
        stickout_mm: 25,
        shank_mm: 6,
        material: 'carbide',
        coating: 'uncoated'
    });
    
    // Material and cut type selection
    const [selectedMaterials, setSelectedMaterials] = useState(['al_6061_t6']);
    const [selectedCutTypes, setSelectedCutTypes] = useState(['profile']);
    
    // Cutting parameters
    const [aggressiveness, setAggressiveness] = useState(1.0);
    const [customDOC, setCustomDOC] = useState({ enabled: false, value: 1.0 });
    
    // Results and UI state
    const [results, setResults] = useState([]);
    const [isCalculating, setIsCalculating] = useState(false);
    const [validationResults, setValidationResults] = useState({ isValid: true, errors: [], warnings: [] });
    
    // Get effective machine configuration
    const getEffectiveMachine = useCallback(() => {
        if (selectedMachine === 'custom' && customMachineConfig) {
            return customMachineConfig;
        }
        return MACHINE_PRESETS[selectedMachine] || MACHINE_PRESETS.printnc;
    }, [selectedMachine, customMachineConfig]);
    
    // Main calculation function
    const calculateResults = useCallback(async () => {
        const machine = getEffectiveMachine();
        
        // Validate inputs
        const validation = validateCalculationInputs({
            machine,
            spindle: spindleConfig,
            tool: selectedTool,
            material: selectedMaterials.length > 0 ? MATERIALS[selectedMaterials[0]] : null,
            cutParams: {
                doc_mm: customDOC.enabled ? customDOC.value : null,
                aggressiveness
            }
        });
        
        setValidationResults(validation);
        
        if (!validation.isValid) {
            setResults([]);
            return;
        }
        
        setIsCalculating(true);
        
        try {
            const newResults = [];
            
            // Calculate for each material and cut type combination
            for (const materialKey of selectedMaterials) {
                const material = MATERIALS[materialKey];
                if (!material) continue;
                
                for (const cutType of selectedCutTypes) {
                    try {
                        // Create calculator instance
                        const calculator = new SpeedsFeedsCalculator(
                            machine,
                            spindleConfig,
                            selectedTool,
                            material,
                            cutType,
                            aggressiveness,
                            customDOC.enabled ? customDOC.value : null
                        );
                        
                        // Perform main calculation
                        const baseResult = calculator.calculate();
                        
                        // Calculate additional parameters
                        const powerResult = calculateCuttingPower({
                            material,
                            tool: selectedTool,
                            cutType,
                            rpm: baseResult.rpm,
                            feedRate: baseResult.feed_rate_mm_min,
                            doc: baseResult.doc_mm,
                            woc: baseResult.woc_mm,
                            machine,
                            spindle: spindleConfig
                        });
                        
                        const deflectionResult = calculateToolDeflection({
                            tool: selectedTool,
                            cuttingForce: baseResult.cutting_force_N,
                            stickout: selectedTool.stickout_mm
                        });
                        
                        // Combine results
                        const combinedResult = {
                            ...baseResult,
                            ...powerResult,
                            ...deflectionResult,
                            material: material.name,
                            materialKey,
                            cutType,
                            toolType: selectedTool.type,
                            tool: selectedTool,
                            power_utilization_percent: (powerResult.total_motor_power_W / (spindleConfig.rated_power_kW * 1000)) * 100
                        };
                        
                        newResults.push(combinedResult);
                        
                    } catch (error) {
                        console.error(`Calculation failed for ${materialKey} - ${cutType}:`, error);
                        // Add error result
                        newResults.push({
                            material: material.name,
                            materialKey,
                            cutType,
                            toolType: selectedTool.type,
                            tool: selectedTool,
                            error: error.message,
                            warnings: [{ type: 'danger', message: `Calculation failed: ${error.message}` }]
                        });
                    }
                }
            }
            
            setResults(newResults);
            
        } catch (error) {
            console.error('Calculation process failed:', error);
            setResults([]);
        } finally {
            setTimeout(() => setIsCalculating(false), 300); // Small delay for UI feedback
        }
    }, [
        selectedMachine,
        customMachineConfig,
        spindleConfig,
        selectedTool,
        selectedMaterials,
        selectedCutTypes,
        aggressiveness,
        customDOC,
        getEffectiveMachine
    ]);
    
    // Auto-calculate when parameters change
    useEffect(() => {
        if (selectedMaterials.length > 0 && selectedCutTypes.length > 0) {
            const timeoutId = setTimeout(calculateResults, 500); // Debounce calculations
            return () => clearTimeout(timeoutId);
        }
    }, [calculateResults, selectedMaterials, selectedCutTypes]);
    
    // Auto-save functionality
    useEffect(() => {
        const settings = {
            selectedMachine,
            customMachineConfig,
            spindleConfig,
            selectedTool,
            selectedMaterials,
            selectedCutTypes,
            aggressiveness,
            customDOC
        };
        
        autoSaveSettings(settings);
    }, [
        selectedMachine,
        customMachineConfig,
        spindleConfig,
        selectedTool,
        selectedMaterials,
        selectedCutTypes,
        aggressiveness,
        customDOC
    ]);
    
    // Load auto-saved settings on mount
    useEffect(() => {
        const savedSettings = loadAutoSavedSettings();
        if (savedSettings) {
            setSelectedMachine(savedSettings.selectedMachine || 'printnc');
            setCustomMachineConfig(savedSettings.customMachineConfig || null);
            setSpindleConfig(savedSettings.spindleConfig || DEFAULT_SPINDLE.config);
            setSelectedTool(savedSettings.selectedTool || selectedTool);
            setSelectedMaterials(savedSettings.selectedMaterials || ['al_6061_t6']);
            setSelectedCutTypes(savedSettings.selectedCutTypes || ['profile']);
            setAggressiveness(savedSettings.aggressiveness || 1.0);
            setCustomDOC(savedSettings.customDOC || { enabled: false, value: 1.0 });
        }
    }, []);
    
    // Export settings handler
    const handleExportSettings = () => {
        const settings = {
            machine: selectedMachine,
            customMachineConfig,
            spindle: spindleConfig,
            tool: selectedTool,
            materials: selectedMaterials,
            cutTypes: selectedCutTypes,
            aggressiveness,
            customDOC,
            results
        };
        
        exportSettings(settings);
    };
    
    // Import settings handler
    const handleImportSettings = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const settings = await importSettings(file);
            
            if (settings.machine) setSelectedMachine(settings.machine);
            if (settings.customMachineConfig) setCustomMachineConfig(settings.customMachineConfig);
            if (settings.spindle) setSpindleConfig(settings.spindle);
            if (settings.tool) setSelectedTool(settings.tool);
            if (settings.materials) setSelectedMaterials(settings.materials);
            if (settings.cutTypes) setSelectedCutTypes(settings.cutTypes);
            if (settings.aggressiveness !== undefined) setAggressiveness(settings.aggressiveness);
            if (settings.customDOC) setCustomDOC(settings.customDOC);
            
            // Clear file input
            event.target.value = '';
            
        } catch (error) {
            alert(`Import failed: ${error.message}`);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">JustTheChip v2.0</h1>
                            <p className="text-sm text-gray-600">CNC Speeds & Feeds Calculator</p>
                        </div>
                        
                        <div className="flex space-x-2">
                            <button
                                onClick={handleExportSettings}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Export Settings
                            </button>
                            
                            <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                                Import Settings
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportSettings}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Configuration */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Machine Configuration */}
                        <MachineConfigComponent
                            selectedMachine={selectedMachine}
                            onMachineChange={setSelectedMachine}
                            onCustomConfigChange={setCustomMachineConfig}
                        />
                        
                        {/* Spindle Configuration */}
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Spindle Configuration</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Spindle Type
                                    </label>
                                    <select
                                        value={Object.keys(SPINDLE_TYPES).find(key => 
                                            SPINDLE_TYPES[key].rated_power_kW === spindleConfig.rated_power_kW &&
                                            SPINDLE_TYPES[key].rpm_max === spindleConfig.rpm_max
                                        ) || 'custom'}
                                        onChange={(e) => {
                                            const spindleType = e.target.value;
                                            if (spindleType !== 'custom') {
                                                setSpindleConfig(SPINDLE_TYPES[spindleType]);
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {Object.entries(SPINDLE_TYPES).map(([key, spindle]) => (
                                            <option key={key} value={key}>{spindle.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Power (kW)
                                        </label>
                                        <input
                                            type="number"
                                            value={spindleConfig.rated_power_kW}
                                            onChange={(e) => setSpindleConfig({
                                                ...spindleConfig,
                                                rated_power_kW: parseFloat(e.target.value) || 0
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            step="0.1"
                                            min="0.1"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Base RPM
                                        </label>
                                        <input
                                            type="number"
                                            value={spindleConfig.base_rpm}
                                            onChange={(e) => setSpindleConfig({
                                                ...spindleConfig,
                                                base_rpm: parseInt(e.target.value) || 0
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            step="100"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min RPM
                                        </label>
                                        <input
                                            type="number"
                                            value={spindleConfig.rpm_min}
                                            onChange={(e) => setSpindleConfig({
                                                ...spindleConfig,
                                                rpm_min: parseInt(e.target.value) || 0
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            step="100"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max RPM
                                        </label>
                                        <input
                                            type="number"
                                            value={spindleConfig.rpm_max}
                                            onChange={(e) => setSpindleConfig({
                                                ...spindleConfig,
                                                rpm_max: parseInt(e.target.value) || 0
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            step="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Tool Configuration */}
                        <ToolSelectorComponent
                            selectedTool={selectedTool}
                            onToolChange={setSelectedTool}
                            selectedCutTypes={selectedCutTypes}
                            onCutTypesChange={setSelectedCutTypes}
                        />
                        
                        {/* Material Selection */}
                        <MaterialSelectorComponent
                            selectedMaterials={selectedMaterials}
                            onMaterialsChange={setSelectedMaterials}
                        />
                        
                        {/* Cutting Parameters */}
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Cutting Parameters</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Aggressiveness Factor: {aggressiveness.toFixed(1)}
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2.0"
                                        step="0.1"
                                        value={aggressiveness}
                                        onChange={(e) => setAggressiveness(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Conservative</span>
                                        <span>Aggressive</span>
                                    </div>
                                </div>
                                
                                {/* DOC Input Component */}
                                <DOCInputComponent
                                    tool={selectedTool}
                                    material={selectedMaterials.length > 0 ? MATERIALS[selectedMaterials[0]] : null}
                                    cutType={selectedCutTypes[0]}
                                    calculatedDOC={1.0} // This would come from main calculation
                                    maxRecommendedDOC={selectedTool.diameter_mm * 0.5}
                                    userDOC={customDOC.enabled ? customDOC.value : null}
                                    onDOCChange={(value) => setCustomDOC({ enabled: value !== null, value: value || 1.0 })}
                                    warnings={validationResults.warnings}
                                />
                            </div>
                        </div>
                        
                        {/* Validation Results */}
                        {(!validationResults.isValid || validationResults.warnings.length > 0) && (
                            <div className="bg-white rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">Validation</h3>
                                
                                {validationResults.errors.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-red-700 font-medium mb-2">Errors:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                                            {validationResults.errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {validationResults.warnings.length > 0 && (
                                    <div>
                                        <h4 className="text-yellow-700 font-medium mb-2">Warnings:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
                                            {validationResults.warnings.map((warning, index) => (
                                                <li key={index}>{warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Right Panel - Results */}
                    <div className="lg:col-span-2">
                        <ResultsDisplayComponent
                            results={results}
                            isCalculating={isCalculating}
                            onExportResults={handleExportSettings}
                        />
                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-sm text-gray-500">
                        <p>JustTheChip v2.0 - Professional CNC Speeds & Feeds Calculator</p>
                        <p className="mt-1">Enhanced with validated formulas and modular architecture</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}