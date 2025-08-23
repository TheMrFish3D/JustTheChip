// Material Selection Interface Component
// Provides material selection with filtering and detailed information

import React, { useState, useMemo } from 'react';
import { MATERIALS } from '../data/materials.js';

export function MaterialSelectorComponent({ 
    selectedMaterials = [], 
    onMaterialsChange 
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showDetails, setShowDetails] = useState({});
    
    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set();
        Object.values(MATERIALS).forEach(material => {
            if (material.category) {
                cats.add(material.category);
            }
        });
        return ['all', ...Array.from(cats).sort()];
    }, []);
    
    // Filter materials based on search and category
    const filteredMaterials = useMemo(() => {
        return Object.entries(MATERIALS).filter(([key, material]) => {
            const matchesSearch = !searchTerm || 
                material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                material.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || 
                material.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);
    
    const toggleMaterial = (materialKey) => {
        if (selectedMaterials.includes(materialKey)) {
            onMaterialsChange(selectedMaterials.filter(m => m !== materialKey));
        } else {
            onMaterialsChange([...selectedMaterials, materialKey]);
        }
    };
    
    const toggleMaterialDetails = (materialKey) => {
        setShowDetails(prev => ({
            ...prev,
            [materialKey]: !prev[materialKey]
        }));
    };
    
    const selectAllInCategory = () => {
        const categoryMaterials = filteredMaterials.map(([key, _]) => key);
        const newSelection = [...new Set([...selectedMaterials, ...categoryMaterials])];
        onMaterialsChange(newSelection);
    };
    
    const clearAllInCategory = () => {
        const categoryMaterials = filteredMaterials.map(([key, _]) => key);
        const newSelection = selectedMaterials.filter(m => !categoryMaterials.includes(m));
        onMaterialsChange(newSelection);
    };
    
    const clearAll = () => {
        onMaterialsChange([]);
    };
    
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Material Selection</h3>
                <div className="text-sm text-gray-500">
                    {selectedMaterials.length} selected
                </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Materials
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : 
                                 category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Bulk Actions */}
                <div className="flex space-x-2">
                    <button
                        onClick={selectAllInCategory}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Select All
                    </button>
                    <button
                        onClick={clearAllInCategory}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Clear Category
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Clear All
                    </button>
                </div>
            </div>
            
            {/* Material List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMaterials.length > 0 ? (
                    filteredMaterials.map(([materialKey, material]) => (
                        <div key={materialKey} className="border border-gray-200 rounded-lg">
                            <div className="flex items-center p-3 hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={selectedMaterials.includes(materialKey)}
                                    onChange={() => toggleMaterial(materialKey)}
                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-medium">{material.name}</div>
                                            {material.description && (
                                                <div className="text-sm text-gray-500">
                                                    {material.description}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            {material.category && (
                                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                                    {material.category}
                                                </span>
                                            )}
                                            
                                            <button
                                                onClick={() => toggleMaterialDetails(materialKey)}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {showDetails[materialKey] ? 'Hide' : 'Details'}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Info */}
                                    <div className="flex space-x-4 mt-2 text-xs text-gray-600">
                                        {material.hardness_hrc && (
                                            <span>Hardness: {material.hardness_hrc} HRC</span>
                                        )}
                                        {material.vc_range && (
                                            <span>
                                                Surface Speed: {material.vc_range[0]}-{material.vc_range[1]} m/min
                                            </span>
                                        )}
                                        {material.chipload_range && (
                                            <span>
                                                Chipload: {material.chipload_range[0]}-{material.chipload_range[1]} mm/tooth
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Detailed Information */}
                            {showDetails[materialKey] && (
                                <div className="border-t border-gray-200 p-3 bg-gray-50">
                                    <MaterialDetailsView material={material} />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No materials found matching your criteria</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
            
            {/* Selected Materials Summary */}
            {selectedMaterials.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Selected Materials:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedMaterials.map(materialKey => {
                            const material = MATERIALS[materialKey];
                            return material ? (
                                <span
                                    key={materialKey}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                    {material.name}
                                    <button
                                        onClick={() => toggleMaterial(materialKey)}
                                        className="ml-1 hover:text-blue-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            ) : null;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// Material Details Component
function MaterialDetailsView({ material }) {
    return (
        <div className="space-y-3">
            {/* Basic Properties */}
            <div>
                <h5 className="font-medium text-gray-700 mb-2">Basic Properties</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {material.density_g_cm3 && (
                        <div>
                            <span className="text-gray-600">Density:</span> {material.density_g_cm3} g/cm³
                        </div>
                    )}
                    {material.hardness_hrc && (
                        <div>
                            <span className="text-gray-600">Hardness:</span> {material.hardness_hrc} HRC
                        </div>
                    )}
                    {material.tensile_strength_mpa && (
                        <div>
                            <span className="text-gray-600">Tensile Strength:</span> {material.tensile_strength_mpa} MPa
                        </div>
                    )}
                    {material.thermal_conductivity && (
                        <div>
                            <span className="text-gray-600">Thermal Conductivity:</span> {material.thermal_conductivity} W/m·K
                        </div>
                    )}
                </div>
            </div>
            
            {/* Cutting Parameters */}
            <div>
                <h5 className="font-medium text-gray-700 mb-2">Cutting Parameters</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {material.vc_range && (
                        <div>
                            <span className="text-gray-600">Surface Speed:</span> {material.vc_range[0]}-{material.vc_range[1]} m/min
                        </div>
                    )}
                    {material.chipload_range && (
                        <div>
                            <span className="text-gray-600">Chipload:</span> {material.chipload_range[0]}-{material.chipload_range[1]} mm/tooth
                        </div>
                    )}
                    {material.specific_cutting_energy_J_mm3 && (
                        <div>
                            <span className="text-gray-600">Cutting Energy:</span> {material.specific_cutting_energy_J_mm3} J/mm³
                        </div>
                    )}
                </div>
            </div>
            
            {/* Force Coefficients */}
            {material.force_coefficients && (
                <div>
                    <h5 className="font-medium text-gray-700 mb-2">Force Coefficients</h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        {material.force_coefficients.Kt && (
                            <div>
                                <span className="text-gray-600">Kt:</span> {material.force_coefficients.Kt} N/mm²
                            </div>
                        )}
                        {material.force_coefficients.Kr && (
                            <div>
                                <span className="text-gray-600">Kr:</span> {material.force_coefficients.Kr} N/mm²
                            </div>
                        )}
                        {material.force_coefficients.Ka && (
                            <div>
                                <span className="text-gray-600">Ka:</span> {material.force_coefficients.Ka} N/mm²
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Tool-Specific Factors */}
            {material.toolChiploadFactors && (
                <div>
                    <h5 className="font-medium text-gray-700 mb-2">Tool-Specific Chipload Factors</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(material.toolChiploadFactors).map(([toolType, factor]) => (
                            <div key={toolType}>
                                <span className="text-gray-600">{formatToolType(toolType)}:</span> {factor}×
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Recommendations */}
            {material.recommendations && (
                <div>
                    <h5 className="font-medium text-gray-700 mb-2">Recommendations</h5>
                    <div className="text-sm text-gray-600">
                        <ul className="list-disc list-inside space-y-1">
                            {material.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to format tool type names
function formatToolType(toolType) {
    const names = {
        endmill_flat: 'Flat End Mill',
        endmill_ball: 'Ball End Mill',
        drill: 'Drill',
        chamfer: 'Chamfer Mill',
        vbit: 'V-Bit',
        facemill: 'Face Mill',
        threadmill: 'Thread Mill',
        tapered: 'Tapered End Mill',
        boring: 'Boring Bar',
        slitting: 'Slitting Saw'
    };
    
    return names[toolType] || toolType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}