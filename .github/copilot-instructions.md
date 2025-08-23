# JustTheChip - CNC Speeds & Feeds Calculator

JustTheChip is a comprehensive CNC machining calculator with dual architecture: a single-file React application (original) and a new modular system (v2.0). Both versions provide optimal CNC machining parameters (speeds and feeds) for various materials, cutting tools, and operations. The applications run entirely in the browser and provide real-time calculations with warnings and recommendations.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Run the Application
- **CRITICAL**: Both applications require internet access to load external CDN dependencies (React, Tailwind CSS, Babel)
- Clone or download the repository: `git clone https://github.com/TheMrFish3D/JustTheChip.git`
- Navigate to repository: `cd JustTheChip`
- Start local web server: `python3 -m http.server 8080` (takes 2-3 seconds to start)
- **NEVER CANCEL**: Wait for "Serving HTTP on 0.0.0.0 port 8080" message before proceeding
- **TIMEOUT WARNING**: Allow up to 30 seconds for server startup if system is busy
- **DUAL ARCHITECTURE**: Choose which version to run:
  - **Original Version**: `http://localhost:8080/JustTheChip.html` (fully functional)
  - **Landing Page**: `http://localhost:8080/index.html` (shows progress and features)
  - **Modular Version**: `http://localhost:8080/src/index.html` (v2.0, in development)
- **VALIDATION REQUIRED**: Applications load successfully with:
  - HTML title shows "CNC Speeds & Feeds Calculator" 
  - Page displays header with application title
  - UI components load (if CDN accessible) or basic HTML structure (if CDN blocked)

### Sandbox Environment Limitations
- **CDN ACCESS**: In restricted environments, external CDN resources may be blocked
- **FALLBACK TESTING**: If CDN is blocked, validate HTML structure loads correctly
- **ALTERNATIVE PORTS**: If port 8080 is busy, use `python3 -m http.server 8081` (or 8082, 8083, etc.)
- **NO OFFLINE MODE**: Application cannot function without external dependencies

### Development Environment Requirements
- **NO BUILD PROCESS**: Static HTML files with no compilation step required
- **NO PACKAGE.JSON**: All dependencies loaded from CDN (React, Tailwind, Babel, Zustand)
- **NO NODE_MODULES**: Pure browser-based applications
- **INTERNET REQUIRED**: Applications will not function without external CDN access
- **BROWSER REQUIRED**: Must be run through web server (file:// protocol blocked by browser security)
- **DUAL VERSIONS**: 
  - Original: Single-file `JustTheChip.html` (83KB, 1,641 lines)
  - Modular: ES6 modules in `src/` directory (288KB total, separated by function)

### File Structure
```
JustTheChip/
├── .git/                    # Git repository  
├── .github/                 # GitHub configuration
│   └── copilot-instructions.md
├── JustTheChip.html        # Original complete application (83KB, 1,641 lines)
├── index.html              # Landing page showing v2.0 progress (14KB)
├── README.md               # Comprehensive documentation (11KB)
├── ARCHITECTURE_ANALYSIS.md # Technical analysis (6.5KB)
├── FORMULA_VALIDATION.md   # Formula improvements (5.9KB)
├── IMPLEMENTATION_SUMMARY.md # Development summary (9.2KB)
└── src/                    # Modular v2.0 architecture (288KB total)
    ├── app.js              # Main application entry point (25KB)
    ├── index.html          # Modular version HTML (16KB)
    ├── data/               # Data models (48KB total)
    │   ├── materials.js    # Validated material database (10.8KB)
    │   ├── machines.js     # Enhanced machine configs (15.8KB)
    │   ├── tools.js        # Tool definitions (7.9KB)
    │   └── spindles.js     # Spindle/motor specs (7.9KB)
    ├── calculations/       # Calculation engines (68KB total)
    │   ├── speeds-feeds.js # Core calculation engine (16.5KB)
    │   ├── power.js        # Power calculations (9.2KB)
    │   ├── deflection.js   # Tool deflection modeling (12.3KB)
    │   └── validation.js   # Input validation (17.1KB)
    ├── components/         # UI components (96KB total)
    │   ├── MachineConfig.js # Machine configuration (22KB)
    │   ├── DOCInput.js     # Depth of cut input (11KB)
    │   ├── ToolSelector.js # Tool selection (18KB)
    │   ├── MaterialSelector.js # Material selection (20KB)
    │   └── ResultsDisplay.js # Results visualization (25KB)
    └── utils/              # Utilities (24KB total)
        ├── constants.js    # Physical constants (5.1KB)
        └── export-import.js # Settings persistence (9.1KB)
```

## Validation

### Testing Application Functionality
Always manually validate any code changes by running through these complete user scenarios:

1. **Basic Application Loading Test**:
   - Start local server: `python3 -m http.server 8080` (or available port)
   - **TIMEOUT**: Allow 30 seconds for startup. NEVER CANCEL.
   - Test each version:
     - Original: `http://localhost:8080/JustTheChip.html`
     - Landing: `http://localhost:8080/index.html` 
     - Modular: `http://localhost:8080/src/index.html`
   - **MINIMUM VALIDATION**: HTML structure loads with correct titles
   - **FULL VALIDATION** (with internet): Complete UI loads with styled components

2. **Original Version Calculation Test** (requires internet access):
   - Navigate to `http://localhost:8080/JustTheChip.html`
   - Verify complete UI loads (left panel forms, right panel results)
   - Select a machine type (dropdown shows "Light Hobby", "PrintNC", "Heavy CNC", etc.)
   - Configure spindle power (default values should populate)
   - Set tool parameters (diameter, flutes, tool type)
   - Select at least one material (checkboxes for Al 6061-T6, Steel, Stainless, etc.)
   - Select at least one cut type (Profile, Slot, Adaptive, Facing, etc.)
   - **VALIDATION**: Results appear in right panel with calculated RPM, feed rates, power requirements, warnings

3. **Export/Import Test** (requires internet access):
   - Configure a complete calculation setup in original version
   - Click "Export Settings" button
   - Verify JSON file downloads with name `cnc-speeds-feeds-settings-[timestamp].json`
   - Click "Import Settings" button and select the exported file
   - **VALIDATION**: All settings restore exactly as exported

4. **Warning System Test** (requires internet access):
   - Set aggressive parameters (high aggressiveness slider, small tool diameter, hard material)
   - **VALIDATION**: Warning badges appear (red for danger, yellow for caution)
   - Hover over warning icons to see detailed messages
   - Test power requirements exceed spindle capacity warnings

5. **Landing Page Features Test**:
   - Navigate to `http://localhost:8080/index.html`
   - Verify progress indicators show implementation status (75% complete)
   - Click "Try Original Version" button - should navigate to JustTheChip.html
   - Verify feature descriptions and architecture improvements are displayed

6. **Modular Version Test** (CDN-dependent):
   - Navigate to `http://localhost:8080/src/index.html`
   - **With CDN**: Should show modular application interface
   - **Without CDN**: Shows error page with troubleshooting instructions

### Performance Expectations
- **Server Startup**: 2-3 seconds for `python3 -m http.server` command (confirmed)
- **CDN Load Time**: 2-5 seconds on first load (dependent on internet speed)
- **CDN Failure**: Immediate (blocked resources show console errors, basic HTML still loads)
- **UI Response**: Immediate (<100ms) for all interactions when fully loaded
- **Calculation Time**: Instant (<50ms) for parameter changes in original version
- **Export/Download**: Immediate file generation and download
- **File Operations**: <10ms for reading/writing (validated)
- **NEVER CANCEL**: Allow full 30 seconds for initial page load if internet is slow
- **PORT CONFLICTS**: If "Address already in use" error, increment port number (8081, 8082, etc.)

### CDN Dependencies and Limitations
- **In Sandboxed Environments**: External CDN resources are blocked by security policies
- **Expected CDN Errors**: net::ERR_BLOCKED_BY_CLIENT for external resources
- **Fallback Behavior**: Basic HTML structure loads correctly, but no React functionality
- **Required for Full Functionality**: React, Tailwind CSS, Babel transpilation, Zustand state management
- **Testing in Restricted Environments**: Focus on HTML structure validation and server functionality

## Common Tasks

### Making Code Changes

#### Original Version (JustTheChip.html)
- **SINGLE FILE**: All application code is in `JustTheChip.html` (83KB, 1,641 lines)
- **SEARCH PATTERNS**: Use these to find specific sections:
  - Tool configurations: Search for "TOOL_TYPES" (line 44)
  - Material properties: Search for "MATERIALS" (line 316)  
  - Calculation engine: Search for "CALCULATION ENGINE" (line 716)
  - UI components: Search for "className=" or "React"
- **TEST IMMEDIATELY**: After any change, refresh browser and run validation scenarios
- **NO COMPILATION**: Changes are immediately reflected on page refresh

#### Modular Version (src/ directory)
- **SEPARATED CONCERNS**: Code split into logical modules for maintainability
- **ES6 MODULES**: Uses import/export syntax, requires proper module bundler for production
- **CURRENT STATUS**: In development, requires CDN access to test
- **KEY FILES**:
  - `src/app.js`: Main application entry point (25KB)
  - `src/data/materials.js`: Material database with validated coefficients
  - `src/calculations/speeds-feeds.js`: Core calculation algorithms
  - `src/components/`: React UI components
- **DEVELOPMENT**: Currently shows placeholder/error page without proper bundling

### Understanding the Codebase

#### Original Version Structure (JustTheChip.html)
The application is structured in clear sections within the HTML file:

1. **HTML Head** (lines 1-38): External dependencies and custom CSS
2. **Tool Types** (lines 44-115): Cutting tool definitions and parameters  
3. **Cut Types** (lines 118-260): Machining operation definitions
4. **Materials** (lines 316-715): Material properties and machining parameters
5. **Calculation Engine** (lines 716-1100): Core speeds/feeds algorithms
6. **React UI** (lines 1101-1640): User interface components and state management

#### Modular Version Structure (src/)
Clean separation of concerns with dedicated files:

1. **Data Layer**: Validated databases for materials, tools, machines, spindles
2. **Calculation Layer**: Separated algorithms for speeds/feeds, power, deflection, validation
3. **Component Layer**: Reusable React components for UI sections  
4. **Utility Layer**: Helper functions for export/import and constants

### Key Application Features

#### Original Version (JustTheChip.html)
- **Machine Presets**: Pre-configured machine types (Light Hobby, PrintNC, Heavy CNC, etc.)
- **Tool Library**: Extensive cutting tool database (end mills, drills, chamfers, v-bits, etc.)
- **Material Database**: Common machining materials with cutting parameters (Al, Steel, Stainless, etc.)
- **Smart Warnings**: Real-time feedback on parameter safety and power requirements
- **Export/Import**: Settings persistence via JSON files with timestamp
- **Responsive Design**: Works on desktop and mobile browsers
- **Real-time Calculations**: Instant updates as parameters change

#### Modular Version (src/)
- **Enhanced Architecture**: Separated data models, calculation engines, and UI components
- **Validated Formulas**: Industry-standard calculations based on machining handbooks
- **Enhanced Motor Configuration**: Detailed specifications for steppers, servos, and drive systems  
- **Direct DOC Control**: User-specified depth of cut with validation and recommendations
- **Improved Power Model**: Based on specific cutting energy and material properties
- **Tool Deflection Analysis**: Includes bending, shear, and tool holder compliance
- **Multi-Pass Recommendations**: Intelligent suggestions for deep cuts

### Debugging Issues
- **Check Browser Console**: Press F12 to see JavaScript errors and network issues
- **Verify CDN Access**: Network tab should show successful loads from:
  - `https://cdn.tailwindcss.com` (CSS framework)
  - `https://unpkg.com/react@18/` (React library)
  - `https://unpkg.com/react-dom@18/` (React DOM)
  - `https://unpkg.com/@babel/standalone/` (JSX transpilation)
  - `https://cdn.jsdelivr.net/npm/zustand@4.4.7/` (State management)
- **Test Server Running**: Ensure `python3 -m http.server` is active and shows "Serving HTTP" message
- **File Path Correct**: Must access via `http://localhost:PORT/[filename]`
- **Port Conflicts**: Use `netstat -tulpn | grep :8080` to check port usage  
- **Alternative Ports**: Try `python3 -m http.server 8081` if default port is busy
- **CDN Blocking**: In restricted environments, expect "Failed to load resource" errors but HTML structure should still load

### Quick Diagnostic Commands
```bash
# Check repository structure and sizes
ls -la                                    # Should show ~708KB total
ls -la JustTheChip.html                  # Should show 83KB file (confirmed)
ls -la src/                              # Should show 288KB total modular files  
du -h .                                  # Check total repository size

# Verify file integrity and structure  
wc -l JustTheChip.html                   # Should show 1,641 lines (confirmed)
grep -n "CNC Speeds & Feeds Calculator" JustTheChip.html  # Should find title on line 6
grep -n "TOOL_TYPES\|MATERIALS\|CALCULATION ENGINE" JustTheChip.html  # Find major sections

# Test server and connectivity
python3 -m http.server 8080 &           # Start server in background
sleep 3                                  # Wait for startup  
curl -I http://localhost:8080/JustTheChip.html  # Test HTTP response
kill %1                                  # Stop background server

# Check for port conflicts
netstat -tulpn | grep :8080             # Check if port is in use
lsof -i :8080                           # Alternative port check

# Validate modular structure
find src -name "*.js" | wc -l           # Should show 14 JavaScript files
ls -la src/data/ src/calculations/ src/components/ src/utils/  # Check module directories
```

### Repository Statistics (Validated)
- **Total Size**: ~708KB
- **Original Version**: 83KB (1,641 lines) - fully functional
- **Modular Version**: 288KB (14+ files) - in development
- **Documentation**: 42KB (README, analysis, validation docs)
- **File Count**: ~30 total files across all directories

### External Dependencies (CDN)
The applications load these external libraries:
- `https://cdn.tailwindcss.com` - CSS framework (required for styling)
- `https://unpkg.com/react@18/umd/react.production.min.js` - React library
- `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js` - React DOM
- `https://unpkg.com/@babel/standalone/babel.min.js` - JSX transpilation
- `https://cdn.jsdelivr.net/npm/zustand@4.4.7/vanilla.mjs` - State management

**CRITICAL**: Applications will not function without internet access to these CDNs. In sandboxed environments, expect "Failed to load resource" errors but basic HTML structure should still validate correctly.

## Workflow Summary

### Complete Setup and Validation Checklist
1. **Repository Setup**:
   ```bash
   git clone https://github.com/TheMrFish3D/JustTheChip.git
   cd JustTheChip
   ```

2. **File Validation**:
   ```bash
   ls -la JustTheChip.html  # Should show 83KB file (confirmed)
   wc -l JustTheChip.html   # Should show 1,641 lines (confirmed)
   ls -la src/              # Should show 288KB modular architecture
   du -h .                  # Should show ~708KB total repository
   ```

3. **Server Startup**:
   ```bash
   python3 -m http.server 8080  # NEVER CANCEL - wait for "Serving HTTP" message (2-3 seconds)
   ```

4. **Application Testing**:
   - **Original Version**: Open `http://localhost:8080/JustTheChip.html`
     - Verify HTML title loads: "CNC Speeds & Feeds Calculator"
     - **With Internet**: Full React UI with machine configs and calculation results
     - **Without Internet**: Basic HTML structure loads correctly
   - **Landing Page**: Open `http://localhost:8080/index.html`
     - Shows v2.0 progress and feature descriptions
     - "Try Original Version" button should work
   - **Modular Version**: Open `http://localhost:8080/src/index.html`
     - **With Internet**: Should load modular application (in development)
     - **Without Internet**: Shows error page with troubleshooting instructions

5. **Development Workflow**:
   - **Original Version Changes**: Edit `JustTheChip.html` directly, refresh browser immediately
   - **Modular Version Changes**: Edit appropriate files in `src/` directory structure
   - Use browser console (F12) for debugging JavaScript and CDN loading issues
   - **ALWAYS** test complete calculation workflow before committing changes
   - Run validation scenarios after any code modifications

### Build and Test Procedures
- **NO BUILD PROCESS REQUIRED**: Both versions are static HTML with CDN dependencies
- **NO COMPILATION**: Changes are immediately reflected on page refresh
- **NO LINTING SETUP**: No package.json or build tools configured
- **TESTING**: Manual browser testing only - no automated test suite
- **NEVER CANCEL**: Allow full 30 seconds for CDN loading in slow internet conditions

### Critical Timing Expectations
- **Server Startup**: 2-3 seconds (confirmed)
- **File Operations**: <10ms (confirmed)
- **CDN Loading**: 2-5 seconds on first load (internet-dependent)
- **Page Refresh**: Immediate (<100ms)
- **Browser Navigation**: Immediate (<100ms)
- **Calculation Updates**: Instant (<50ms when fully loaded)

### Critical Reminders
- **Dual architecture**: Both single-file and modular versions exist and serve different purposes
- **No build process**: Changes are immediately reflected on page refresh
- **Internet dependency**: Full functionality requires CDN access, but HTML structure validates without it
- **Always validate**: Test complete calculation workflow in original version before committing changes
- **Never skip server**: Must use HTTP server, not file:// protocol
- **Sandbox limitations**: CDN resources will be blocked, but basic structure should still load