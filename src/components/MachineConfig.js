// Enhanced Machine Configuration Component
// Supports detailed motor and drive system specification

import React, { useState, useEffect } from 'react';
import { MACHINE_PRESETS, MOTOR_TYPES, DRIVE_SYSTEMS, MACHINE_UTILS } from '../data/machines.js';

export function MachineConfigComponent({ selectedMachine, onMachineChange, onCustomConfigChange }) {
    const [showCustomConfig, setShowCustomConfig] = useState(false);
    const [customConfig, setCustomConfig] = useState(null);
    
    useEffect(() => {
        setShowCustomConfig(selectedMachine === 'custom');
        if (selectedMachine !== 'custom') {
            setCustomConfig(null);
        } else if (!customConfig) {
            // Initialize custom config with default values
            setCustomConfig({
                name: 'Custom Machine',
                rigidity_class: 'custom',
                K_rigidity: 1.0,
                aggressiveness: { radial: 1.0, axial: 1.0, feed: 1.0 },
                axes: {
                    x: createDefaultAxis(),
                    y: createDefaultAxis(),
                    z: createDefaultAxis()
                }
            });
        }
    }, [selectedMachine]);
    
    function createDefaultAxis() {
        return {
            motor_count: 1,
            motor_type: 'stepper',
            motor_specs: {
                holding_torque_Nm: 3.0,
                max_speed_rpm: 1200,
                step_angle_deg: 1.8,
                current_A: 4.0
            },
            drive_system: 'ballscrew',
            drive_specs: {
                lead_mm_per_rev: 5,
                accuracy_class: 'C7',
                preload_type: 'light',
                efficiency: 0.85,
                max_speed_rpm: 1000
            }
        };
    }
    
    const updateCustomAxis = (axisName, updates) => {
        if (!customConfig) return;
        
        const newConfig = {
            ...customConfig,
            axes: {
                ...customConfig.axes,
                [axisName]: {
                    ...customConfig.axes[axisName],
                    ...updates
                }
            }
        };
        setCustomConfig(newConfig);
        onCustomConfigChange(newConfig);
    };
    
    const updateMotorSpecs = (axisName, motorSpecs) => {
        updateCustomAxis(axisName, { motor_specs: motorSpecs });
    };
    
    const updateDriveSpecs = (axisName, driveSpecs) => {
        updateCustomAxis(axisName, { drive_specs: driveSpecs });
    };
    
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Machine Configuration</h3>
            
            {/* Machine Preset Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Machine Type</label>
                <select
                    value={selectedMachine}
                    onChange={(e) => onMachineChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    {Object.entries(MACHINE_PRESETS).map(([key, machine]) => (
                        <option key={key} value={key}>
                            {machine.name}
                        </option>
                    ))}
                </select>
                {selectedMachine !== 'custom' && (
                    <p className="text-sm text-gray-600 mt-1">
                        {MACHINE_PRESETS[selectedMachine]?.description}
                    </p>
                )}
            </div>
            
            {/* Custom Configuration */}
            {showCustomConfig && customConfig && (
                <div className="space-y-6">
                    <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Machine Properties</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600">Rigidity Factor</label>
                                <input
                                    type="number"
                                    value={customConfig.K_rigidity}
                                    onChange={(e) => setCustomConfig({
                                        ...customConfig,
                                        K_rigidity: parseFloat(e.target.value) || 1.0
                                    })}
                                    step="0.1"
                                    min="0.1"
                                    max="3.0"
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Aggressiveness</label>
                                <input
                                    type="number"
                                    value={customConfig.aggressiveness.radial}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value) || 1.0;
                                        setCustomConfig({
                                            ...customConfig,
                                            aggressiveness: {
                                                radial: value,
                                                axial: value,
                                                feed: value
                                            }
                                        });
                                    }}
                                    step="0.1"
                                    min="0.1"
                                    max="2.0"
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Axis Configuration */}
                    {Object.entries(customConfig.axes).map(([axisName, axis]) => (
                        <AxisConfigComponent
                            key={axisName}
                            axisName={axisName.toUpperCase()}
                            axis={axis}
                            onMotorChange={(specs) => updateMotorSpecs(axisName, specs)}
                            onDriveChange={(specs) => updateDriveSpecs(axisName, specs)}
                            onAxisChange={(updates) => updateCustomAxis(axisName, updates)}
                        />
                    ))}
                </div>
            )}
            
            {/* Machine Summary for Non-Custom */}
            {!showCustomConfig && selectedMachine !== 'custom' && (
                <MachineSummaryComponent machine={MACHINE_PRESETS[selectedMachine]} />
            )}
        </div>
    );
}

function AxisConfigComponent({ axisName, axis, onMotorChange, onDriveChange, onAxisChange }) {
    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <h5 className="font-medium mb-3">{axisName} Axis</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Motor Configuration */}
                <div className="space-y-3">
                    <h6 className="text-sm font-medium text-gray-700">Motor Configuration</h6>
                    
                    <div>
                        <label className="block text-xs text-gray-600">Motor Count</label>
                        <select
                            value={axis.motor_count}
                            onChange={(e) => onAxisChange({ motor_count: parseInt(e.target.value) })}
                            className="w-full px-2 py-1 text-sm border rounded"
                        >
                            <option value={1}>Single Motor</option>
                            <option value={2}>Dual Motors</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs text-gray-600">Motor Type</label>
                        <select
                            value={axis.motor_type}
                            onChange={(e) => {
                                const newType = e.target.value;
                                onAxisChange({ motor_type: newType });
                                // Reset motor specs when type changes
                                const motorType = MOTOR_TYPES[newType];
                                const defaultSpecs = getDefaultMotorSpecs(newType);
                                onMotorChange(defaultSpecs);
                            }}
                            className="w-full px-2 py-1 text-sm border rounded"
                        >
                            {Object.entries(MOTOR_TYPES).map(([key, type]) => (
                                <option key={key} value={key}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <MotorSpecsComponent
                        motorType={axis.motor_type}
                        specs={axis.motor_specs}
                        onChange={onMotorChange}
                    />
                </div>
                
                {/* Drive Configuration */}
                <div className="space-y-3">
                    <h6 className="text-sm font-medium text-gray-700">Drive System</h6>
                    
                    <div>
                        <label className="block text-xs text-gray-600">Drive Type</label>
                        <select
                            value={axis.drive_system}
                            onChange={(e) => {
                                const newType = e.target.value;
                                onAxisChange({ drive_system: newType });
                                // Reset drive specs when type changes
                                const defaultSpecs = getDefaultDriveSpecs(newType);
                                onDriveChange(defaultSpecs);
                            }}
                            className="w-full px-2 py-1 text-sm border rounded"
                        >
                            {Object.entries(DRIVE_SYSTEMS).map(([key, drive]) => (
                                <option key={key} value={key}>{drive.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <DriveSpecsComponent
                        driveType={axis.drive_system}
                        specs={axis.drive_specs}
                        onChange={onDriveChange}
                    />
                </div>
            </div>
            
            {/* Calculated Performance */}
            <div className="mt-4 pt-3 border-t">
                <h6 className="text-sm font-medium text-gray-700 mb-2">Calculated Performance</h6>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-gray-600">Max Feed Rate:</span>
                        <span className="ml-1 font-medium">
                            {Math.round(MACHINE_UTILS.getMaxFeedForAxis(axis))} mm/min
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600">Control Type:</span>
                        <span className="ml-1 font-medium">
                            {MOTOR_TYPES[axis.motor_type]?.control_type || 'unknown'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MotorSpecsComponent({ motorType, specs, onChange }) {
    const motorDef = MOTOR_TYPES[motorType];
    if (!motorDef) return null;
    
    const updateSpec = (key, value) => {
        onChange({ ...specs, [key]: value });
    };
    
    return (
        <div className="space-y-2">
            {motorDef.properties.map(prop => (
                <div key={prop}>
                    <label className="block text-xs text-gray-600">{formatPropertyName(prop)}</label>
                    <input
                        type="number"
                        value={specs[prop] || ''}
                        onChange={(e) => updateSpec(prop, parseFloat(e.target.value) || 0)}
                        step={getStepForProperty(prop)}
                        className="w-full px-2 py-1 text-sm border rounded"
                    />
                </div>
            ))}
        </div>
    );
}

function DriveSpecsComponent({ driveType, specs, onChange }) {
    const driveDef = DRIVE_SYSTEMS[driveType];
    if (!driveDef) return null;
    
    const updateSpec = (key, value) => {
        onChange({ ...specs, [key]: value });
    };
    
    return (
        <div className="space-y-2">
            {driveDef.properties.map(prop => {
                if (prop === 'accuracy_class' && driveDef.accuracy_classes) {
                    return (
                        <div key={prop}>
                            <label className="block text-xs text-gray-600">{formatPropertyName(prop)}</label>
                            <select
                                value={specs[prop] || ''}
                                onChange={(e) => updateSpec(prop, e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded"
                            >
                                {driveDef.accuracy_classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    );
                } else if (prop === 'preload_type' && driveDef.preload_types) {
                    return (
                        <div key={prop}>
                            <label className="block text-xs text-gray-600">{formatPropertyName(prop)}</label>
                            <select
                                value={specs[prop] || ''}
                                onChange={(e) => updateSpec(prop, e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded"
                            >
                                {driveDef.preload_types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    );
                } else {
                    return (
                        <div key={prop}>
                            <label className="block text-xs text-gray-600">{formatPropertyName(prop)}</label>
                            <input
                                type="number"
                                value={specs[prop] || ''}
                                onChange={(e) => updateSpec(prop, parseFloat(e.target.value) || 0)}
                                step={getStepForProperty(prop)}
                                className="w-full px-2 py-1 text-sm border rounded"
                            />
                        </div>
                    );
                }
            })}
        </div>
    );
}

function MachineSummaryComponent({ machine }) {
    return (
        <div className="bg-gray-50 rounded p-4">
            <h4 className="font-medium mb-3">Machine Summary</h4>
            <div className="space-y-2 text-sm">
                <div>
                    <span className="text-gray-600">Rigidity Class:</span>
                    <span className="ml-2 font-medium">{machine.rigidity_class}</span>
                </div>
                <div>
                    <span className="text-gray-600">K Rigidity:</span>
                    <span className="ml-2 font-medium">{machine.K_rigidity}</span>
                </div>
                {machine.axes && (
                    <div className="pt-2">
                        <span className="text-gray-600 block mb-1">Drive Systems:</span>
                        {Object.entries(machine.axes).map(([axis, config]) => (
                            <div key={axis} className="ml-2 text-xs">
                                <span className="font-medium">{axis.toUpperCase()}:</span>
                                <span className="ml-1">{config.motor_count}× {MOTOR_TYPES[config.motor_type]?.name}</span>
                                <span className="ml-1">+ {DRIVE_SYSTEMS[config.drive_system]?.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper functions
function getDefaultMotorSpecs(motorType) {
    switch (motorType) {
        case 'stepper':
            return {
                holding_torque_Nm: 3.0,
                max_speed_rpm: 1200,
                step_angle_deg: 1.8,
                current_A: 4.0
            };
        case 'ac_servo':
            return {
                continuous_torque_Nm: 4.0,
                peak_torque_Nm: 12.0,
                max_speed_rpm: 3000,
                encoder_resolution: 131072,
                power_rating_W: 1000
            };
        case 'dc_servo':
            return {
                continuous_torque_Nm: 3.5,
                peak_torque_Nm: 10.5,
                max_speed_rpm: 2800,
                encoder_resolution: 2000,
                voltage_V: 48
            };
        default:
            return {};
    }
}

function getDefaultDriveSpecs(driveType) {
    switch (driveType) {
        case 'ballscrew':
            return {
                lead_mm_per_rev: 5,
                accuracy_class: 'C7',
                preload_type: 'light',
                efficiency: 0.90,
                max_speed_rpm: 1000
            };
        case 'leadscrew':
            return {
                lead_mm_per_rev: 8,
                thread_angle_deg: 29,
                efficiency: 0.75,
                max_speed_rpm: 300
            };
        case 'belt_drive':
            return {
                pulley_ratio: 1.0,
                belt_pitch_mm: 2,
                belt_width_mm: 6,
                efficiency: 0.95
            };
        default:
            return { efficiency: 0.85 };
    }
}

function formatPropertyName(prop) {
    return prop
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/Nm/g, '(Nm)')
        .replace(/Rpm/g, '(RPM)')
        .replace(/Deg/g, '(°)')
        .replace(/A$/g, '(A)')
        .replace(/W$/g, '(W)')
        .replace(/V$/g, '(V)');
}

function getStepForProperty(prop) {
    if (prop.includes('torque') || prop.includes('current')) return 0.1;
    if (prop.includes('angle') || prop.includes('lead')) return 0.1;
    if (prop.includes('rpm') || prop.includes('resolution')) return 1;
    if (prop.includes('power') || prop.includes('voltage')) return 1;
    return 0.01;
}