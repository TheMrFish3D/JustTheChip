# JustTheChip - CNC Speeds & Feeds Calculator

JustTheChip is a single-file React web application for calculating optimal CNC machining parameters (speeds and feeds) for various materials, cutting tools, and operations. The application runs entirely in the browser and provides real-time calculations with warnings and recommendations.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Run the Application
- **CRITICAL**: This application requires internet access to load external CDN dependencies (React, Tailwind CSS, Babel)
- Clone or download the repository: `git clone https://github.com/TheMrFish3D/JustTheChip.git`
- Navigate to repository: `cd JustTheChip`
- Start local web server: `python3 -m http.server 8080` (takes ~2 seconds to start)
- **NEVER CANCEL**: Wait for "Serving HTTP on 0.0.0.0 port 8080" message before proceeding
- **TIMEOUT WARNING**: Allow up to 30 seconds for server startup if system is busy
- Open browser to: `http://localhost:8080/JustTheChip.html`
- **VALIDATION REQUIRED**: Application loads successfully with:
  - HTML title shows "CNC Speeds & Feeds Calculator"
  - Page displays header with application title
  - Left panel with machine/spindle configuration forms
  - Right panel for calculation results display
  - All UI elements properly styled with Tailwind CSS (if CDN accessible)

### Sandbox Environment Limitations
- **CDN ACCESS**: In restricted environments, external CDN resources may be blocked
- **FALLBACK TESTING**: If CDN is blocked, validate HTML structure loads correctly
- **ALTERNATIVE PORTS**: If port 8080 is busy, use `python3 -m http.server 8081` (or 8082, 8083, etc.)
- **NO OFFLINE MODE**: Application cannot function without external dependencies

### Development Environment Requirements
- **NO BUILD PROCESS**: This is a static HTML file with no compilation step
- **NO PACKAGE.JSON**: All dependencies loaded from CDN
- **NO NODE_MODULES**: Pure browser-based application
- **INTERNET REQUIRED**: Application will not function without external CDN access
- **BROWSER REQUIRED**: Must be run through web server (file:// protocol blocked by browser security)

### File Structure
```
JustTheChip/
├── .git/                    # Git repository
├── .github/                 # GitHub configuration (you are here)
│   └── copilot-instructions.md
└── JustTheChip.html        # Complete application (83KB, ~1,640 lines)
```

## Validation

### Testing Application Functionality
Always manually validate any code changes by running through these complete user scenarios:

1. **Basic Application Loading Test**:
   - Start local server: `python3 -m http.server 8080` (or available port)
   - **TIMEOUT**: Allow 30 seconds for startup. NEVER CANCEL.
   - Open `http://localhost:8080/JustTheChip.html`
   - **MINIMUM VALIDATION**: HTML structure loads with correct title "CNC Speeds & Feeds Calculator"
   - **FULL VALIDATION** (with internet): Complete UI loads with styled components

2. **Basic Calculation Test** (requires internet access):
   - Verify UI loads completely (all panels visible and styled)
   - Select a machine type (dropdown should show options like "Light Hobby", "PrintNC", etc.)
   - Configure spindle power (default values should be present)
   - Set tool parameters (diameter, flutes, etc.)
   - Select at least one material (checkboxes for Al 6061-T6, Steel, etc.)
   - Select at least one cut type (Profile, Slot, Adaptive, etc.)
   - **VALIDATION**: Results should appear in right panel with calculated RPM, feed rates, warnings

3. **Export/Import Test** (requires internet access):
   - Configure a complete calculation setup
   - Click "Export" button
   - Verify JSON file downloads with name `cnc-speeds-feeds-settings.json`
   - Click "Import" button and select the exported file
   - **VALIDATION**: All settings should restore exactly as exported

4. **Warning System Test** (requires internet access):
   - Set aggressive parameters (high aggressiveness slider, small tool, hard material)
   - **VALIDATION**: Warning badges should appear (red for danger, yellow for warning)
   - Hover over warnings to see detailed messages

### Performance Expectations
- **Server Startup**: 2-3 seconds for `python3 -m http.server` command
- **CDN Load Time**: 2-5 seconds on first load (dependent on internet speed)
- **CDN Failure**: Immediate (blocked resources show console errors)
- **UI Response**: Immediate (<100ms) for all interactions when fully loaded
- **Calculation Time**: Instant (<50ms) for parameter changes
- **Export/Download**: Immediate file generation
- **NEVER CANCEL**: Allow full 30 seconds for initial page load if internet is slow
- **PORT CONFLICTS**: If "Address already in use" error, increment port number (8081, 8082, etc.)

## Common Tasks

### Making Code Changes
- **SINGLE FILE**: All application code is in `JustTheChip.html`
- **SEARCH PATTERNS**: Use these to find specific sections:
  - Tool configurations: Search for "TOOL_TYPES"
  - Material properties: Search for "MATERIALS"
  - Calculation engine: Search for "CALCULATION ENGINE"
  - UI components: Search for "className=" or "React"
- **TEST IMMEDIATELY**: After any change, refresh browser and run validation scenarios
- **NO COMPILATION**: Changes are immediately reflected on page refresh

### Understanding the Codebase
The application is structured in clear sections within the HTML file:

1. **HTML Head** (lines 1-35): External dependencies and CSS
2. **Tool Types** (lines 42-115): Cutting tool definitions and parameters
3. **Cut Types** (lines 118-260): Machining operation definitions
4. **Materials** (lines 261-715): Material properties and machining parameters
5. **Calculation Engine** (lines 716-1100): Core speeds/feeds algorithms
6. **React UI** (lines 1101-1640): User interface components

### Key Application Features
- **Machine Presets**: Pre-configured machine types (hobby to industrial)
- **Tool Library**: Extensive cutting tool database (end mills, drills, chamfers, etc.)
- **Material Database**: Common machining materials with cutting parameters
- **Smart Warnings**: Real-time feedback on parameter safety
- **Export/Import**: Settings persistence via JSON files
- **Responsive Design**: Works on desktop and mobile browsers

### Debugging Issues
- **Check Browser Console**: Press F12 to see JavaScript errors
- **Verify CDN Access**: Network tab should show successful loads from unpkg.com, cdn.tailwindcss.com
- **Test Server Running**: Ensure `python3 -m http.server` is active and shows "Serving HTTP" message
- **File Path Correct**: Must access via `http://localhost:PORT/JustTheChip.html`
- **Port Conflicts**: Use `netstat -tulpn | grep :8080` to check port usage
- **Alternative Ports**: Try `python3 -m http.server 8081` if default port is busy

### Quick Diagnostic Commands
```bash
# Check file exists and size (should be ~83KB)
ls -la JustTheChip.html

# Verify HTML structure
grep -n "CNC Speeds & Feeds Calculator" JustTheChip.html

# Find application sections
grep -n "TOOL_TYPES\|MATERIALS\|CALCULATION ENGINE" JustTheChip.html

# Test server startup
python3 -m http.server 8080 &
sleep 3
kill %1

# Verify file line count (should be ~1,640 lines)
wc -l JustTheChip.html
```

### External Dependencies (CDN)
The application loads these external libraries:
- `https://cdn.tailwindcss.com` - CSS framework (required for styling)
- `https://unpkg.com/react@18/umd/react.production.min.js` - React library
- `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js` - React DOM
- `https://unpkg.com/@babel/standalone/babel.min.js` - JSX transpilation
- `https://cdn.jsdelivr.net/npm/zustand@4.4.7/vanilla.mjs` - State management

**CRITICAL**: Application will not function without internet access to these CDNs.

## Workflow Summary

### Complete Setup and Validation Checklist
1. **Repository Setup**:
   ```bash
   git clone https://github.com/TheMrFish3D/JustTheChip.git
   cd JustTheChip
   ```

2. **File Validation**:
   ```bash
   ls -la JustTheChip.html  # Should show ~83KB file
   wc -l JustTheChip.html   # Should show ~1,641 lines
   ```

3. **Server Startup**:
   ```bash
   python3 -m http.server 8080  # NEVER CANCEL - wait for "Serving HTTP" message
   ```

4. **Application Testing**:
   - Open browser to `http://localhost:8080/JustTheChip.html`
   - Verify HTML title loads: "CNC Speeds & Feeds Calculator"
   - **With Internet**: Full React UI with styled components
   - **Without Internet**: Basic HTML structure only

5. **Development Workflow**:
   - Edit `JustTheChip.html` directly
   - Refresh browser to see changes immediately
   - Use browser console (F12) for debugging
   - Test complete calculation workflow before committing

### Critical Reminders
- **Single file simplicity**: All changes go in `JustTheChip.html` only
- **No build process**: Changes are immediately reflected on page refresh
- **Internet dependency**: Full functionality requires CDN access
- **Always validate**: Complete calculation workflow before committing changes
- **Never skip server**: Must use HTTP server, not file:// protocol