// Results Display Component
// Comprehensive visualization of calculation results with warnings and recommendations

import React, { useState, useMemo } from 'react';
import { TOOL_TYPES } from '../data/tools.js';
import { exportResultsAsCSV, copyResultsToClipboard } from '../utils/export-import.js';

export function ResultsDisplayComponent({ 
    results = [], 
    isCalculating = false,
    onExportResults
}) {
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
    const [sortBy, setSortBy] = useState('material');
    const [filterWarnings, setFilterWarnings] = useState('all'); // 'all', 'warnings', 'errors'
    
    // Sort and filter results
    const processedResults = useMemo(() => {
        let filtered = [...results];
        
        // Apply warning filter
        if (filterWarnings === 'warnings') {
            filtered = filtered.filter(r => r.warnings?.some(w => w.type === 'warning'));
        } else if (filterWarnings === 'errors') {
            filtered = filtered.filter(r => r.warnings?.some(w => w.type === 'danger'));
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'material':
                    return a.material.localeCompare(b.material);
                case 'cutType':
                    return a.cutType.localeCompare(b.cutType);
                case 'rpm':
                    return a.rpm - b.rpm;
                case 'feed':
                    return a.feed_rate_mm_min - b.feed_rate_mm_min;
                case 'power':
                    return a.power_required_W - b.power_required_W;
                case 'mrr':
                    return a.mrr_mm3_min - b.mrr_mm3_min;
                default:
                    return 0;
            }
        });
        
        return filtered;
    }, [results, sortBy, filterWarnings]);
    
    const handleExportCSV = () => {
        exportResultsAsCSV(processedResults);
    };
    
    const handleCopyToClipboard = async () => {
        try {
            await copyResultsToClipboard(processedResults);
            // Could add a toast notification here
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };
    
    if (isCalculating) {
        return (
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Calculating speeds and feeds...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (results.length === 0) {
        return (
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-gray-500 mb-2">No results to display</p>
                        <p className="text-sm text-gray-400">
                            Configure your machine, tool, and materials in the left panel to see calculations
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            {/* Header with Controls */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold">Calculation Results</h3>
                    <p className="text-sm text-gray-500">
                        {processedResults.length} of {results.length} results shown
                    </p>
                </div>
                
                <div className="flex space-x-2">
                    <button
                        onClick={handleCopyToClipboard}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Copy
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Export CSV
                    </button>
                </div>
            </div>
            
            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        View Mode
                    </label>
                    <div className="flex rounded-md shadow-sm">
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`px-3 py-1 text-sm rounded-l-md border ${
                                viewMode === 'cards' 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Cards
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1 text-sm rounded-r-md border-t border-r border-b ${
                                viewMode === 'table' 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Table
                        </button>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="material">Material</option>
                        <option value="cutType">Cut Type</option>
                        <option value="rpm">RPM</option>
                        <option value="feed">Feed Rate</option>
                        <option value="power">Power</option>
                        <option value="mrr">Material Removal Rate</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filter
                    </label>
                    <select
                        value={filterWarnings}
                        onChange={(e) => setFilterWarnings(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Results</option>
                        <option value="warnings">Warnings Only</option>
                        <option value="errors">Errors Only</option>
                    </select>
                </div>
            </div>
            
            {/* Results Display */}
            {viewMode === 'cards' ? (
                <ResultsCardsView results={processedResults} />
            ) : (
                <ResultsTableView results={processedResults} />
            )}
        </div>
    );
}

// Cards View Component
function ResultsCardsView({ results }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
                <ResultCard key={index} result={result} />
            ))}
        </div>
    );
}

// Individual Result Card
function ResultCard({ result }) {
    const getWarningColor = (warnings) => {
        if (warnings?.some(w => w.type === 'danger')) return 'border-red-300';
        if (warnings?.some(w => w.type === 'warning')) return 'border-yellow-300';
        return 'border-gray-200';
    };
    
    const getWarningBadge = (warnings) => {
        if (warnings?.some(w => w.type === 'danger')) return 'bg-red-100 text-red-800';
        if (warnings?.some(w => w.type === 'warning')) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };
    
    return (
        <div className={`border rounded-lg p-4 ${getWarningColor(result.warnings)}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-medium">{result.material}</h4>
                    <p className="text-sm text-gray-600">{result.cutType}</p>
                </div>
                <div className="flex space-x-2">
                    {result.warnings?.length > 0 && (
                        <span className={`px-2 py-1 text-xs rounded-full ${getWarningBadge(result.warnings)}`}>
                            {result.warnings.filter(w => w.type === 'danger').length > 0 ? '⚠️' : '⚠️'}
                        </span>
                    )}
                </div>
            </div>
            
            {/* Tool Info */}
            <div className="mb-3 p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                    <span className="text-lg mr-2">{TOOL_TYPES[result.toolType]?.icon}</span>
                    <span className="text-sm font-medium">{TOOL_TYPES[result.toolType]?.name}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                    Ø{result.tool?.diameter_mm}mm, {result.tool?.flutes} flutes
                </div>
            </div>
            
            {/* Key Parameters */}
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                    <span className="text-gray-500">RPM:</span>
                    <span className="ml-2 font-medium">{result.rpm}</span>
                </div>
                <div>
                    <span className="text-gray-500">Feed:</span>
                    <span className="ml-2 font-medium">{result.feed_rate_mm_min} mm/min</span>
                </div>
                <div>
                    <span className="text-gray-500">Chipload:</span>
                    <span className="ml-2 font-medium">{result.chipload_mm?.toFixed(3)} mm</span>
                </div>
                <div>
                    <span className="text-gray-500">MRR:</span>
                    <span className="ml-2 font-medium">{result.mrr_mm3_min} mm³/min</span>
                </div>
                <div>
                    <span className="text-gray-500">WOC:</span>
                    <span className="ml-2 font-medium">{result.woc_mm?.toFixed(1)} mm</span>
                </div>
                <div>
                    <span className="text-gray-500">DOC:</span>
                    <span className="ml-2 font-medium">{result.doc_mm?.toFixed(1)} mm</span>
                </div>
            </div>
            
            {/* Advanced Parameters */}
            <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                    <div>
                        <span className="text-gray-500">Power:</span>
                        <span className={`ml-2 font-medium ${
                            result.power_utilization_percent > 90 ? 'text-red-600' : 
                            result.power_utilization_percent > 80 ? 'text-yellow-600' : ''
                        }`}>
                            {result.power_required_W}W
                        </span>
                        <span className="text-xs text-gray-500">
                            ({result.power_utilization_percent?.toFixed(0)}%)
                        </span>
                    </div>
                    {result.tool_deflection_mm && (
                        <div>
                            <span className="text-gray-500">Deflection:</span>
                            <span className={`ml-2 font-medium ${
                                result.tool_deflection_mm > 0.05 ? 'text-red-600' : 
                                result.tool_deflection_mm > 0.02 ? 'text-yellow-600' : ''
                            }`}>
                                {(result.tool_deflection_mm * 1000).toFixed(0)}µm
                            </span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Warnings */}
            {result.warnings?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="space-y-1">
                        {result.warnings.slice(0, 2).map((warning, i) => (
                            <div key={i} className={`text-xs ${
                                warning.type === 'danger' ? 'text-red-600' : 
                                warning.type === 'warning' ? 'text-yellow-600' : 
                                'text-blue-600'
                            }`}>
                                • {warning.message}
                            </div>
                        ))}
                        {result.warnings.length > 2 && (
                            <div className="text-xs text-gray-500">
                                +{result.warnings.length - 2} more warnings
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Table View Component
function ResultsTableView({ results }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Material</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Cut Type</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Tool</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">RPM</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Feed (mm/min)</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Chipload (mm)</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">WOC (mm)</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">DOC (mm)</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">MRR (mm³/min)</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">Power (W)</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {results.map((result, index) => (
                        <ResultTableRow key={index} result={result} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Table Row Component
function ResultTableRow({ result }) {
    const getStatusIcon = (warnings) => {
        if (warnings?.some(w => w.type === 'danger')) return '🔴';
        if (warnings?.some(w => w.type === 'warning')) return '🟡';
        return '🟢';
    };
    
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-3">{result.material}</td>
            <td className="px-4 py-3">{result.cutType}</td>
            <td className="px-4 py-3">
                <div className="flex items-center">
                    <span className="mr-2">{TOOL_TYPES[result.toolType]?.icon}</span>
                    <div>
                        <div className="font-medium">{TOOL_TYPES[result.toolType]?.name}</div>
                        <div className="text-xs text-gray-500">
                            Ø{result.tool?.diameter_mm}mm
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 text-right">{result.rpm}</td>
            <td className="px-4 py-3 text-right">{result.feed_rate_mm_min}</td>
            <td className="px-4 py-3 text-right">{result.chipload_mm?.toFixed(4)}</td>
            <td className="px-4 py-3 text-right">{result.woc_mm?.toFixed(2)}</td>
            <td className="px-4 py-3 text-right">{result.doc_mm?.toFixed(2)}</td>
            <td className="px-4 py-3 text-right">{result.mrr_mm3_min}</td>
            <td className="px-4 py-3 text-right">
                <span className={
                    result.power_utilization_percent > 90 ? 'text-red-600' : 
                    result.power_utilization_percent > 80 ? 'text-yellow-600' : ''
                }>
                    {result.power_required_W}
                </span>
            </td>
            <td className="px-4 py-3 text-center">
                <span title={result.warnings?.map(w => w.message).join('\n')}>
                    {getStatusIcon(result.warnings)}
                </span>
            </td>
        </tr>
    );
}