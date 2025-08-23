// Enhanced Depth of Cut (DOC) Input Component
// Provides direct user control over axial depth of cut with validation

import React, { useState, useEffect } from 'react';

export function DOCInputComponent({ 
    tool, 
    material, 
    cutType, 
    calculatedDOC, 
    maxRecommendedDOC, 
    userDOC, 
    onDOCChange,
    warnings = [] 
}) {
    const [docInputValue, setDocInputValue] = useState('');
    const [useCustomDOC, setUseCustomDOC] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    useEffect(() => {
        if (userDOC !== null && userDOC !== undefined) {
            setDocInputValue(userDOC.toString());
            setUseCustomDOC(true);
        } else {
            setDocInputValue('');
            setUseCustomDOC(false);
        }
    }, [userDOC]);
    
    const handleDOCToggle = (enabled) => {
        setUseCustomDOC(enabled);
        if (enabled) {
            const initialValue = calculatedDOC || 1.0;
            setDocInputValue(initialValue.toString());
            onDOCChange(initialValue);
        } else {
            setDocInputValue('');
            onDOCChange(null);
        }
    };
    
    const handleDOCInputChange = (value) => {
        setDocInputValue(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            onDOCChange(numValue);
        }
    };
    
    const getDocStatus = () => {
        if (!useCustomDOC || !userDOC) return 'auto';
        
        if (userDOC > maxRecommendedDOC * 1.5) return 'danger';
        if (userDOC > maxRecommendedDOC) return 'warning';
        if (userDOC < maxRecommendedDOC * 0.1) return 'too-low';
        return 'good';
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'danger': return 'text-red-600 border-red-300 bg-red-50';
            case 'warning': return 'text-yellow-600 border-yellow-300 bg-yellow-50';
            case 'too-low': return 'text-blue-600 border-blue-300 bg-blue-50';
            case 'good': return 'text-green-600 border-green-300 bg-green-50';
            default: return 'text-gray-600 border-gray-300 bg-gray-50';
        }
    };
    
    const getMultiPassSuggestion = () => {
        if (!useCustomDOC || !userDOC || userDOC <= maxRecommendedDOC) return null;
        
        const numPasses = Math.ceil(userDOC / maxRecommendedDOC);
        const passDepth = userDOC / numPasses;
        
        return {
            passes: numPasses,
            depthPerPass: passDepth
        };
    };
    
    const status = getDocStatus();
    const multiPassSuggestion = getMultiPassSuggestion();
    
    return (
        <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Depth of Cut (DOC)</h4>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced
                </button>
            </div>
            
            <div className="space-y-3">
                {/* DOC Mode Toggle */}
                <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            checked={!useCustomDOC}
                            onChange={() => handleDOCToggle(false)}
                            className="mr-2"
                        />
                        <span className="text-sm">Auto Calculate</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            checked={useCustomDOC}
                            onChange={() => handleDOCToggle(true)}
                            className="mr-2"
                        />
                        <span className="text-sm">Manual Override</span>
                    </label>
                </div>
                
                {/* Current DOC Display */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Current DOC</label>
                        <div className="text-lg font-semibold text-gray-900">
                            {useCustomDOC && userDOC ? userDOC.toFixed(2) : calculatedDOC?.toFixed(2) || '—'} mm
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Recommended Max</label>
                        <div className="text-lg font-medium text-green-600">
                            {maxRecommendedDOC?.toFixed(2) || '—'} mm
                        </div>
                    </div>
                </div>
                
                {/* Manual DOC Input */}
                {useCustomDOC && (
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Custom DOC (mm)</label>
                        <input
                            type="number"
                            value={docInputValue}
                            onChange={(e) => handleDOCInputChange(e.target.value)}
                            placeholder="Enter depth of cut"
                            step="0.1"
                            min="0.1"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${getStatusColor(status)}`}
                        />
                        
                        {/* Status Indicator */}
                        {userDOC && (
                            <div className="mt-2">
                                <DOCStatusIndicator 
                                    status={status} 
                                    userDOC={userDOC} 
                                    maxDOC={maxRecommendedDOC}
                                />
                            </div>
                        )}
                    </div>
                )}
                
                {/* Multi-Pass Suggestion */}
                {multiPassSuggestion && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-blue-800 mb-1">Multi-Pass Suggestion</h5>
                        <p className="text-sm text-blue-700">
                            Consider {multiPassSuggestion.passes} passes at {multiPassSuggestion.depthPerPass.toFixed(2)}mm each
                            for better tool life and surface finish.
                        </p>
                    </div>
                )}
                
                {/* Advanced Information */}
                {showAdvanced && (
                    <div className="border-t pt-3 space-y-3">
                        <h5 className="text-sm font-medium text-gray-700">DOC Guidelines</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Conservative:</span>
                                <span className="ml-2 font-medium">
                                    {(maxRecommendedDOC * 0.5)?.toFixed(2)} mm
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Aggressive:</span>
                                <span className="ml-2 font-medium">
                                    {(maxRecommendedDOC * 1.2)?.toFixed(2)} mm
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Material Factor:</span>
                                <span className="ml-2 font-medium">
                                    {material?.max_axial_per_pass_D?.[cutType]?.toFixed(1) || 'N/A'}×D
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Tool Diameter:</span>
                                <span className="ml-2 font-medium">
                                    {tool?.diameter_mm?.toFixed(1) || 'N/A'} mm
                                </span>
                            </div>
                        </div>
                        
                        {/* Material-Specific Notes */}
                        {material?.notes && (
                            <div className="bg-gray-50 rounded p-2">
                                <span className="text-xs text-gray-600 font-medium">Material Notes:</span>
                                <p className="text-xs text-gray-700 mt-1">{material.notes}</p>
                            </div>
                        )}
                        
                        {/* DOC-Related Warnings */}
                        {warnings.filter(w => w.message.toLowerCase().includes('doc') || 
                                             w.message.toLowerCase().includes('depth')).map((warning, idx) => (
                            <div key={idx} className={`p-2 rounded text-sm ${
                                warning.type === 'danger' ? 'bg-red-50 text-red-700 border border-red-200' :
                                warning.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                                {warning.message}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DOCStatusIndicator({ status, userDOC, maxDOC }) {
    const getStatusMessage = () => {
        const ratio = userDOC / maxDOC;
        
        switch (status) {
            case 'danger':
                return `Very deep cut (${ratio.toFixed(1)}× recommended) - high risk of tool failure`;
            case 'warning':
                return `Aggressive cut (${ratio.toFixed(1)}× recommended) - monitor carefully`;
            case 'too-low':
                return `Very shallow cut (${ratio.toFixed(1)}× recommended) - may cause rubbing`;
            case 'good':
                return `Good DOC within safe limits`;
            default:
                return '';
        }
    };
    
    const getIcon = () => {
        switch (status) {
            case 'danger': return '⚠️';
            case 'warning': return '⚡';
            case 'too-low': return '🔍';
            case 'good': return '✅';
            default: return '📏';
        }
    };
    
    return (
        <div className="flex items-center space-x-2">
            <span className="text-lg">{getIcon()}</span>
            <span className="text-sm">{getStatusMessage()}</span>
        </div>
    );
}

// Visual DOC Engagement Display
export function DOCVisualizationComponent({ tool, userDOC, calculatedDOC, maxDOC }) {
    const activeDOC = userDOC || calculatedDOC || 0;
    const toolDiameter = tool?.diameter_mm || 10;
    
    // Calculate visual proportions
    const maxHeight = 100; // pixels
    const docRatio = Math.min(activeDOC / maxDOC, 2.0); // Cap at 2× for visualization
    const docHeight = docRatio * 50; // Max 50% of visual height
    
    return (
        <div className="bg-gray-100 rounded-lg p-4">
            <h5 className="text-sm font-medium mb-3">Tool Engagement</h5>
            
            <div className="flex items-end justify-center space-x-4" style={{ height: `${maxHeight}px` }}>
                {/* Tool representation */}
                <div className="relative">
                    <div 
                        className="bg-gray-400 rounded-t-full"
                        style={{ 
                            width: '20px', 
                            height: '60px',
                            marginBottom: '10px'
                        }}
                    />
                    <div className="text-xs text-center text-gray-600">Tool</div>
                </div>
                
                {/* Workpiece with DOC visualization */}
                <div className="relative">
                    <div 
                        className="bg-blue-200 border-2 border-blue-400"
                        style={{ 
                            width: '40px', 
                            height: '60px',
                            marginBottom: '10px'
                        }}
                    >
                        {/* DOC engagement area */}
                        <div 
                            className="bg-red-300 border-r-2 border-red-500"
                            style={{ 
                                width: '100%', 
                                height: `${docHeight}px`,
                                position: 'absolute',
                                top: 0
                            }}
                        />
                    </div>
                    <div className="text-xs text-center text-gray-600">Workpiece</div>
                </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-300 border border-red-500"></div>
                    <span>Cut Depth: {activeDOC.toFixed(2)}mm</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-200 border border-blue-400"></div>
                    <span>Remaining Material</span>
                </div>
            </div>
            
            {activeDOC > maxDOC && (
                <div className="mt-2 text-xs text-red-600">
                    ⚠️ DOC exceeds recommended maximum
                </div>
            )}
        </div>
    );
}