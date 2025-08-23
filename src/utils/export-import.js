// Settings Export/Import Utilities
// Handles saving and loading of application configurations

/**
 * Export current application settings to JSON file
 * @param {Object} settings - Application state to export
 * @param {string} filename - Custom filename (optional)
 */
export function exportSettings(settings, filename = 'cnc-speeds-feeds-settings.json') {
    try {
        const settingsData = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            ...settings
        };
        
        const blob = new Blob([JSON.stringify(settingsData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Export failed:', error);
        return false;
    }
}

/**
 * Import settings from JSON file
 * @param {File} file - File object to import
 * @returns {Promise<Object>} - Promise resolving to settings object
 */
export function importSettings(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const settings = JSON.parse(event.target.result);
                
                // Validate settings structure
                if (!validateSettingsStructure(settings)) {
                    reject(new Error('Invalid settings file structure'));
                    return;
                }
                
                resolve(settings);
            } catch (error) {
                reject(new Error('Invalid JSON file: ' + error.message));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file);
    });
}

/**
 * Export calculation results as CSV
 * @param {Array} results - Array of calculation results
 * @param {string} filename - Custom filename (optional)
 */
export function exportResultsAsCSV(results, filename = 'cnc-calculation-results.csv') {
    try {
        const headers = [
            'Material',
            'Cut Type', 
            'Tool Type',
            'Tool Diameter (mm)',
            'RPM',
            'Feed Rate (mm/min)',
            'Chipload (mm/tooth)',
            'WOC (mm)',
            'DOC (mm)',
            'MRR (mm³/min)',
            'Power Required (W)',
            'Cutting Force (N)',
            'Tool Deflection (mm)',
            'Warnings'
        ];
        
        const rows = results.map(result => [
            result.material || '',
            result.cutType || '',
            result.toolType || '',
            result.tool?.diameter_mm || '',
            result.rpm || '',
            result.feed_rate_mm_min || '',
            result.chipload_mm || '',
            result.woc_mm || '',
            result.doc_mm || '',
            result.mrr_mm3_min || '',
            result.power_required_W || '',
            result.cutting_force_N || '',
            result.tool_deflection_mm || '',
            result.warnings?.map(w => w.message).join('; ') || ''
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('CSV export failed:', error);
        return false;
    }
}

/**
 * Copy results to clipboard as formatted text
 * @param {Array} results - Array of calculation results
 */
export function copyResultsToClipboard(results) {
    try {
        const text = results.map(result => {
            return [
                `Material: ${result.material}`,
                `Cut Type: ${result.cutType}`,
                `RPM: ${result.rpm}`,
                `Feed: ${result.feed_rate_mm_min} mm/min`,
                `Chipload: ${result.chipload_mm} mm/tooth`,
                `Power: ${result.power_required_W} W`,
                `Deflection: ${result.tool_deflection_mm} mm`,
                result.warnings?.length > 0 ? `Warnings: ${result.warnings.map(w => w.message).join(', ')}` : '',
                '---'
            ].filter(line => line).join('\n');
        }).join('\n\n');
        
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    } catch (error) {
        console.error('Copy to clipboard failed:', error);
        return Promise.reject(error);
    }
}

/**
 * Validate the structure of imported settings
 * @param {Object} settings - Settings object to validate
 * @returns {boolean} - True if valid structure
 */
function validateSettingsStructure(settings) {
    // Check for required top-level properties
    const requiredProps = ['machine', 'spindle', 'tool'];
    const hasRequiredProps = requiredProps.some(prop => settings.hasOwnProperty(prop));
    
    if (!hasRequiredProps) {
        return false;
    }
    
    // Validate machine configuration
    if (settings.machine && typeof settings.machine !== 'string') {
        return false;
    }
    
    // Validate spindle configuration
    if (settings.spindle && typeof settings.spindle !== 'object') {
        return false;
    }
    
    // Validate tool configuration
    if (settings.tool && typeof settings.tool !== 'object') {
        return false;
    }
    
    return true;
}

/**
 * Create default settings structure
 * @returns {Object} - Default settings object
 */
export function createDefaultSettings() {
    return {
        version: '2.0.0',
        machine: 'printnc',
        spindle: {
            rated_power_kW: 2.2,
            rpm_min: 8000,
            rpm_max: 24000,
            base_rpm: 12000
        },
        tool: {
            type: 'endmill_flat',
            diameter_mm: 6,
            flutes: 4,
            stickout_mm: 25,
            shank_mm: 6
        },
        materials: ['al_6061_t6'],
        cutTypes: ['profile'],
        aggressiveness: 1.0,
        customDOC: {
            enabled: false,
            value: 1.0
        }
    };
}

/**
 * Merge imported settings with defaults
 * @param {Object} imported - Imported settings
 * @param {Object} defaults - Default settings
 * @returns {Object} - Merged settings
 */
export function mergeWithDefaults(imported, defaults = createDefaultSettings()) {
    return {
        ...defaults,
        ...imported,
        // Ensure nested objects are properly merged
        spindle: { ...defaults.spindle, ...imported.spindle },
        tool: { ...defaults.tool, ...imported.tool },
        customDOC: { ...defaults.customDOC, ...imported.customDOC }
    };
}

/**
 * Auto-save settings to localStorage
 * @param {Object} settings - Settings to save
 * @param {string} key - localStorage key
 */
export function autoSaveSettings(settings, key = 'justthechip_autosave') {
    try {
        const saveData = {
            ...settings,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(saveData));
        return true;
    } catch (error) {
        console.warn('Auto-save failed:', error);
        return false;
    }
}

/**
 * Load auto-saved settings from localStorage
 * @param {string} key - localStorage key
 * @returns {Object|null} - Loaded settings or null
 */
export function loadAutoSavedSettings(key = 'justthechip_autosave') {
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            const settings = JSON.parse(saved);
            
            // Check if auto-save is recent (within 7 days)
            const saveTime = new Date(settings.timestamp);
            const now = new Date();
            const daysDiff = (now - saveTime) / (1000 * 60 * 60 * 24);
            
            if (daysDiff <= 7) {
                return settings;
            }
        }
        return null;
    } catch (error) {
        console.warn('Failed to load auto-saved settings:', error);
        return null;
    }
}