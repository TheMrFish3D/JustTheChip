// Tool Selection Interface Component
// Provides intuitive tool selection with parameter configuration

import React, { useState, useEffect } from 'react';
import { TOOL_TYPES, CUT_TYPES, TOOL_UTILS } from '../data/tools.js';

export function ToolSelectorComponent({ 
    selectedTool, 
    onToolChange, 
    selectedCutTypes = [], 
    onCutTypesChange 
}) {
    const [toolParameters, setToolParameters] = useState({});
    const [showAdvancedTools, setShowAdvancedTools] = useState(false);
    
    // Initialize tool parameters when tool type changes
    useEffect(() => {
        if (selectedTool?.type) {
            const toolDef = TOOL_TYPES[selectedTool.type];
            if (toolDef) {
                const newParams = { ...toolParameters };
                
                // Set default values for missing parameters
                toolDef.parameters.forEach(param => {
                    if (!newParams[param]) {
                        newParams[param] = getDefaultParameterValue(param);
                    }
                });
                
                setToolParameters(newParams);
                
                // Update tool with parameters
                onToolChange({
                    ...selectedTool,
                    ...newParams
                });
            }
        }
    }, [selectedTool?.type]);
    
    const updateToolParameter = (parameter, value) => {
        const newParams = { ...toolParameters, [parameter]: value };
        setToolParameters(newParams);
        
        onToolChange({
            ...selectedTool,
            ...newParams
        });
    };
    
    const getAvailableCutTypes = () => {
        if (!selectedTool?.type) return [];
        
        return TOOL_UTILS.getCutTypesForTool(selectedTool.type);
    };
    
    const renderToolParameters = () => {
        if (!selectedTool?.type) return null;
        
        const toolDef = TOOL_TYPES[selectedTool.type];
        if (!toolDef) return null;
        
        return toolDef.parameters.map(param => (
            <div key={param}>
                <label className="block text-sm text-gray-600 mb-1">
                    {formatParameterName(param)}
                </label>
                <input 
                    type="number"
                    value={toolParameters[param] || ''}
                    onChange={(e) => updateToolParameter(param, parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                    step={getParameterStep(param)}
                    min="0"
                    placeholder={getParameterPlaceholder(param)}
                />
                {getParameterHint(param) && (
                    <p className="text-xs text-gray-500 mt-1">{getParameterHint(param)}</p>
                )}
            </div>
        ));
    };
    
    const toolCategories = {
        common: ['endmill_flat', 'endmill_ball', 'drill'],
        specialized: ['chamfer', 'vbit', 'facemill', 'threadmill', 'tapered'],
        advanced: ['boring', 'slitting']
    };
    
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Tool Configuration</h3>
            
            {/* Tool Type Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tool Type
                </label>
                <select 
                    value={selectedTool?.type || ''}
                    onChange={(e) => onToolChange({ ...selectedTool, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select tool type...</option>
                    
                    <optgroup label="Common Tools">
                        {toolCategories.common.map(toolKey => {
                            const tool = TOOL_TYPES[toolKey];
                            return (
                                <option key={toolKey} value={toolKey}>
                                    {tool.icon} {tool.name}
                                </option>
                            );
                        })}
                    </optgroup>
                    
                    <optgroup label="Specialized Tools">
                        {toolCategories.specialized.map(toolKey => {
                            const tool = TOOL_TYPES[toolKey];
                            return (
                                <option key={toolKey} value={toolKey}>
                                    {tool.icon} {tool.name}
                                </option>
                            );
                        })}
                    </optgroup>
                    
                    {showAdvancedTools && (
                        <optgroup label="Advanced Tools">
                            {toolCategories.advanced.map(toolKey => {
                                const tool = TOOL_TYPES[toolKey];
                                return (
                                    <option key={toolKey} value={toolKey}>
                                        {tool.icon} {tool.name}
                                    </option>
                                );
                            })}
                        </optgroup>
                    )}
                </select>
                
                {!showAdvancedTools && (
                    <button
                        onClick={() => setShowAdvancedTools(true)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                        Show advanced tools...
                    </button>
                )}
            </div>
            
            {/* Tool Parameters */}
            {selectedTool?.type && (
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">
                        Tool Parameters
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        {renderToolParameters()}
                    </div>
                </div>
            )}
            
            {/* Tool Material */}
            {selectedTool?.type && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tool Material
                    </label>
                    <select 
                        value={selectedTool?.material || 'carbide'}
                        onChange={(e) => onToolChange({ ...selectedTool, material: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="carbide">Carbide</option>
                        <option value="hss">High Speed Steel (HSS)</option>
                        <option value="cermet">Cermet</option>
                        <option value="ceramic">Ceramic</option>
                        <option value="diamond">Diamond</option>
                        <option value="cbn">Cubic Boron Nitride (CBN)</option>
                    </select>
                </div>
            )}
            
            {/* Tool Coating */}
            {selectedTool?.type && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tool Coating
                    </label>
                    <select 
                        value={selectedTool?.coating || 'uncoated'}
                        onChange={(e) => onToolChange({ ...selectedTool, coating: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="uncoated">Uncoated</option>
                        <option value="tin">TiN (Titanium Nitride)</option>
                        <option value="ticn">TiCN (Titanium Carbonitride)</option>
                        <option value="tialn">TiAlN (Titanium Aluminum Nitride)</option>
                        <option value="alcrn">AlCrN (Aluminum Chromium Nitride)</option>
                        <option value="diamond_like">DLC (Diamond-Like Carbon)</option>
                    </select>
                </div>
            )}
            
            {/* Available Cut Types */}
            {selectedTool?.type && (
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">
                        Available Operations
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {getAvailableCutTypes().length > 0 ? (
                            getAvailableCutTypes().map(cut => (
                                <label key={cut.key} className="flex items-center p-2 rounded hover:bg-gray-50">
                                    <input 
                                        type="checkbox"
                                        checked={selectedCutTypes.includes(cut.key)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                onCutTypesChange([...selectedCutTypes, cut.key]);
                                            } else {
                                                onCutTypesChange(selectedCutTypes.filter(t => t !== cut.key));
                                            }
                                        }}
                                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div>
                                        <div className="font-medium">{cut.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {getCutTypeDescription(cut)}
                                        </div>
                                    </div>
                                </label>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                Select a tool type to see available operations
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            {/* Tool Information */}
            {selectedTool?.type && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-700 mb-2">Tool Information</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Type:</strong> {TOOL_TYPES[selectedTool.type]?.name}</p>
                        <p><strong>Parameters:</strong> {TOOL_TYPES[selectedTool.type]?.parameters.length} required</p>
                        <p><strong>Operations:</strong> {TOOL_TYPES[selectedTool.type]?.supportedCuts.length} supported</p>
                        {selectedTool.diameter_mm && selectedTool.stickout_mm && (
                            <p><strong>Aspect Ratio:</strong> {(selectedTool.stickout_mm / selectedTool.diameter_mm).toFixed(1)}:1</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper functions
function formatParameterName(param) {
    const names = {
        diameter_mm: 'Diameter (mm)',
        flutes: 'Number of Flutes',
        stickout_mm: 'Stickout Length (mm)',
        shank_mm: 'Shank Diameter (mm)',
        angle_deg: 'Angle (degrees)',
        tip_diameter_mm: 'Tip Diameter (mm)',
        max_diameter_mm: 'Max Diameter (mm)',
        insert_count: 'Insert Count',
        insert_size_mm: 'Insert Size (mm)',
        max_doc_mm: 'Max DOC (mm)',
        point_angle_deg: 'Point Angle (degrees)',
        flute_length_mm: 'Flute Length (mm)',
        pitch_mm: 'Pitch (mm)',
        thread_depth_mm: 'Thread Depth (mm)',
        taper_angle_deg: 'Taper Angle (degrees)',
        min_bore_diameter_mm: 'Min Bore Diameter (mm)',
        bar_diameter_mm: 'Bar Diameter (mm)',
        max_depth_mm: 'Max Depth (mm)',
        insert_type: 'Insert Type',
        width_mm: 'Width (mm)',
        teeth: 'Number of Teeth',
        arbor_hole_mm: 'Arbor Hole (mm)'
    };
    
    return names[param] || param.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getDefaultParameterValue(param) {
    const defaults = {
        diameter_mm: 6,
        flutes: 4,
        stickout_mm: 25,
        shank_mm: 6,
        angle_deg: 90,
        tip_diameter_mm: 0.1,
        max_diameter_mm: 10,
        insert_count: 4,
        insert_size_mm: 8,
        max_doc_mm: 5,
        point_angle_deg: 118,
        flute_length_mm: 20,
        pitch_mm: 1.5,
        thread_depth_mm: 1,
        taper_angle_deg: 1,
        min_bore_diameter_mm: 10,
        bar_diameter_mm: 12,
        max_depth_mm: 50,
        width_mm: 2,
        teeth: 80,
        arbor_hole_mm: 22
    };
    
    return defaults[param] || 1;
}

function getParameterStep(param) {
    const steps = {
        diameter_mm: 0.1,
        flutes: 1,
        stickout_mm: 1,
        shank_mm: 0.1,
        angle_deg: 1,
        tip_diameter_mm: 0.01,
        max_diameter_mm: 0.1,
        insert_count: 1,
        insert_size_mm: 0.1,
        max_doc_mm: 0.1,
        point_angle_deg: 1,
        flute_length_mm: 1,
        pitch_mm: 0.1,
        thread_depth_mm: 0.1,
        taper_angle_deg: 0.1,
        min_bore_diameter_mm: 0.1,
        bar_diameter_mm: 0.1,
        max_depth_mm: 1,
        width_mm: 0.1,
        teeth: 1,
        arbor_hole_mm: 1
    };
    
    return steps[param] || 0.1;
}

function getParameterPlaceholder(param) {
    const placeholders = {
        diameter_mm: 'e.g., 6.0',
        flutes: 'e.g., 4',
        stickout_mm: 'e.g., 25',
        angle_deg: 'e.g., 90'
    };
    
    return placeholders[param] || '';
}

function getParameterHint(param) {
    const hints = {
        stickout_mm: 'Length from collet to tool tip',
        flutes: 'More flutes = better finish, fewer flutes = better chip evacuation',
        angle_deg: 'Tool cutting angle or taper angle',
        tip_diameter_mm: 'For V-bits and tapered tools'
    };
    
    return hints[param] || null;
}

function getCutTypeDescription(cut) {
    const descriptions = {
        slot: 'Full width engagement cutting',
        profile: 'Side milling with partial engagement',
        adaptive: 'High-efficiency roughing with trochoidal paths',
        facing: 'Surface milling operations',
        drilling: 'Straight hole drilling',
        chamfer: 'Edge chamfering and deburring',
        vcarve: 'V-groove carving and engraving'
    };
    
    return descriptions[cut.key] || cut.name;
}