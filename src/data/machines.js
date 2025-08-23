// Enhanced Machine Configurations with Detailed Motor Specifications
// Supports multiple motor types, reduction gears, and drive systems

export const MOTOR_TYPES = {
    stepper: {
        name: 'Stepper Motor',
        control_type: 'open_loop',
        typical_efficiency: 0.85,
        properties: ['holding_torque_Nm', 'max_speed_rpm', 'step_angle_deg', 'current_A']
    },
    ac_servo: {
        name: 'AC Servo Motor',
        control_type: 'closed_loop',
        typical_efficiency: 0.92,
        properties: ['continuous_torque_Nm', 'peak_torque_Nm', 'max_speed_rpm', 'encoder_resolution', 'power_rating_W']
    },
    dc_servo: {
        name: 'DC Servo Motor',
        control_type: 'closed_loop',
        typical_efficiency: 0.88,
        properties: ['continuous_torque_Nm', 'peak_torque_Nm', 'max_speed_rpm', 'encoder_resolution', 'voltage_V']
    },
    brushless_dc: {
        name: 'Brushless DC Motor',
        control_type: 'closed_loop',
        typical_efficiency: 0.90,
        properties: ['continuous_torque_Nm', 'peak_torque_Nm', 'max_speed_rpm', 'pole_pairs', 'power_rating_W']
    }
};

export const DRIVE_SYSTEMS = {
    ballscrew: {
        name: 'Ball Screw',
        typical_efficiency: 0.90,
        properties: ['lead_mm_per_rev', 'accuracy_class', 'preload_type', 'max_speed_rpm'],
        accuracy_classes: ['C10', 'C7', 'C5', 'C3'],
        preload_types: ['none', 'light', 'medium', 'heavy']
    },
    leadscrew: {
        name: 'Lead Screw (Acme)',
        typical_efficiency: 0.75,
        properties: ['lead_mm_per_rev', 'thread_angle_deg', 'max_speed_rpm'],
        typical_thread_angles: [29, 30] // Acme thread
    },
    belt_drive: {
        name: 'Belt Drive',
        typical_efficiency: 0.95,
        properties: ['pulley_ratio', 'belt_pitch_mm', 'belt_width_mm'],
        belt_pitches: [2, 3, 5, 8] // GT2, GT3, GT5, GT8
    },
    rack_pinion: {
        name: 'Rack & Pinion',
        typical_efficiency: 0.85,
        properties: ['module_mm', 'pinion_teeth', 'reduction_ratio'],
        typical_modules: [1.0, 1.25, 1.5, 2.0, 2.5, 3.0]
    },
    linear_motor: {
        name: 'Linear Motor',
        typical_efficiency: 0.95,
        properties: ['force_constant_N_A', 'max_force_N', 'max_speed_m_s'],
        advantages: ['no_backlash', 'high_speed', 'high_precision']
    }
};

export const MACHINE_PRESETS = {
    'custom': {
        name: 'Custom Configuration',
        description: 'User-defined machine parameters',
        rigidity_class: 'custom',
        K_rigidity: 1.0,
        aggressiveness: { radial: 1.0, axial: 1.0, feed: 1.0 },
        is_custom: true
    },
    'light_hobby': {
        name: 'Light Hobby CNC',
        description: '3018/6040 style router with basic components',
        rigidity_class: 'light_hobby',
        K_rigidity: 0.6,
        aggressiveness: { radial: 0.6, axial: 0.6, feed: 0.7 },
        max_feed_mm_min: { x: 3000, y: 3000, z: 1000 },
        max_accel_mm_s2: { x: 200, y: 200, z: 100 },
        axes: {
            x: {
                motor_count: 1,
                motor_type: 'stepper',
                motor_specs: {
                    holding_torque_Nm: 2.0,
                    max_speed_rpm: 1000,
                    step_angle_deg: 1.8,
                    current_A: 3.0
                },
                drive_system: 'leadscrew',
                drive_specs: {
                    lead_mm_per_rev: 8,
                    efficiency: 0.75,
                    max_speed_rpm: 300
                }
            },
            y: {
                motor_count: 1,
                motor_type: 'stepper',
                motor_specs: {
                    holding_torque_Nm: 2.0,
                    max_speed_rpm: 1000,
                    step_angle_deg: 1.8,
                    current_A: 3.0
                },
                drive_system: 'leadscrew',
                drive_specs: {
                    lead_mm_per_rev: 8,
                    efficiency: 0.75,
                    max_speed_rpm: 300
                }
            },
            z: {
                motor_count: 1,
                motor_type: 'stepper',
                motor_specs: {
                    holding_torque_Nm: 1.5,
                    max_speed_rpm: 800,
                    step_angle_deg: 1.8,
                    current_A: 2.5
                },
                drive_system: 'leadscrew',
                drive_specs: {
                    lead_mm_per_rev: 4,
                    efficiency: 0.75,
                    max_speed_rpm: 250
                }
            }
        }
    },
    'printnc': {
        name: 'PrintNC (Baseline)',
        description: 'Community PrintNC design with NEMA23 steppers',
        rigidity_class: 'printnc',
        K_rigidity: 1.0,
        aggressiveness: { radial: 1.0, axial: 1.0, feed: 1.0 },
        max_feed_mm_min: { x: 6000, y: 6000, z: 2000 },
        max_accel_mm_s2: { x: 500, y: 500, z: 200 },
        axes: {
            x: {
                motor_count: 1,
                motor_type: 'stepper',
                motor_specs: {
                    holding_torque_Nm: 3.0,
                    max_speed_rpm: 1200,
                    step_angle_deg: 1.8,
                    current_A: 4.2
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 5,
                    accuracy_class: 'C7',
                    preload_type: 'light',
                    efficiency: 0.85,
                    max_speed_rpm: 1000
                }
            },
            y: {
                motor_count: 2, // Dual motor gantry
                motor_type: 'stepper',
                motor_specs: {
                    holding_torque_Nm: 3.0,
                    max_speed_rpm: 1200,
                    step_angle_deg: 1.8,
                    current_A: 4.2
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 5,
                    accuracy_class: 'C7',
                    preload_type: 'light',
                    efficiency: 0.85,
                    max_speed_rpm: 1000
                }
            },
            z: {
                motor_count: 1,
                motor_type: 'stepper',
                motor_specs: {
                    holding_torque_Nm: 2.5,
                    max_speed_rpm: 1000,
                    step_angle_deg: 1.8,
                    current_A: 3.5
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 5,
                    accuracy_class: 'C7',
                    preload_type: 'medium',
                    efficiency: 0.85,
                    max_speed_rpm: 800
                }
            }
        }
    },
    'rigid_hobby': {
        name: 'Rigid Hobby Mill',
        description: 'Heavy hobby machine with servo motors',
        rigidity_class: 'rigid_hobby',
        K_rigidity: 1.2,
        aggressiveness: { radial: 1.1, axial: 1.1, feed: 1.1 },
        max_feed_mm_min: { x: 8000, y: 8000, z: 3000 },
        max_accel_mm_s2: { x: 800, y: 800, z: 300 },
        axes: {
            x: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 4.0,
                    peak_torque_Nm: 12.0,
                    max_speed_rpm: 3000,
                    encoder_resolution: 131072,
                    power_rating_W: 1000
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 5,
                    accuracy_class: 'C5',
                    preload_type: 'medium',
                    efficiency: 0.90,
                    max_speed_rpm: 2000
                }
            },
            y: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 4.0,
                    peak_torque_Nm: 12.0,
                    max_speed_rpm: 3000,
                    encoder_resolution: 131072,
                    power_rating_W: 1000
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 5,
                    accuracy_class: 'C5',
                    preload_type: 'medium',
                    efficiency: 0.90,
                    max_speed_rpm: 2000
                }
            },
            z: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 2.5,
                    peak_torque_Nm: 7.5,
                    max_speed_rpm: 2500,
                    encoder_resolution: 131072,
                    power_rating_W: 750
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 5,
                    accuracy_class: 'C5',
                    preload_type: 'heavy',
                    efficiency: 0.90,
                    max_speed_rpm: 1500
                }
            }
        }
    },
    'benchtop': {
        name: 'Benchtop Mill',
        description: 'Commercial benchtop mill with high-performance drives',
        rigidity_class: 'benchtop',
        K_rigidity: 1.5,
        aggressiveness: { radial: 1.2, axial: 1.2, feed: 1.2 },
        max_feed_mm_min: { x: 10000, y: 10000, z: 4000 },
        max_accel_mm_s2: { x: 1000, y: 1000, z: 400 },
        axes: {
            x: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 6.0,
                    peak_torque_Nm: 18.0,
                    max_speed_rpm: 3000,
                    encoder_resolution: 262144,
                    power_rating_W: 1500
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 10,
                    accuracy_class: 'C3',
                    preload_type: 'heavy',
                    efficiency: 0.92,
                    max_speed_rpm: 2500
                }
            },
            y: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 6.0,
                    peak_torque_Nm: 18.0,
                    max_speed_rpm: 3000,
                    encoder_resolution: 262144,
                    power_rating_W: 1500
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 10,
                    accuracy_class: 'C3',
                    preload_type: 'heavy',
                    efficiency: 0.92,
                    max_speed_rpm: 2500
                }
            },
            z: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 4.0,
                    peak_torque_Nm: 12.0,
                    max_speed_rpm: 2500,
                    encoder_resolution: 262144,
                    power_rating_W: 1000
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 5,
                    accuracy_class: 'C3',
                    preload_type: 'heavy',
                    efficiency: 0.92,
                    max_speed_rpm: 2000
                }
            }
        }
    },
    'vmc_like': {
        name: 'VMC-like Machine',
        description: 'Industrial vertical machining center specifications',
        rigidity_class: 'vmc_like',
        K_rigidity: 2.0,
        aggressiveness: { radial: 1.4, axial: 1.4, feed: 1.4 },
        max_feed_mm_min: { x: 15000, y: 15000, z: 6000 },
        max_accel_mm_s2: { x: 2000, y: 2000, z: 800 },
        axes: {
            x: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 15.0,
                    peak_torque_Nm: 45.0,
                    max_speed_rpm: 3000,
                    encoder_resolution: 1048576,
                    power_rating_W: 3000
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 10,
                    accuracy_class: 'C3',
                    preload_type: 'heavy',
                    efficiency: 0.95,
                    max_speed_rpm: 3000
                }
            },
            y: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 15.0,
                    peak_torque_Nm: 45.0,
                    max_speed_rpm: 3000,
                    encoder_resolution: 1048576,
                    power_rating_W: 3000
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 10,
                    accuracy_class: 'C3',
                    preload_type: 'heavy',
                    efficiency: 0.95,
                    max_speed_rpm: 3000
                }
            },
            z: {
                motor_count: 1,
                motor_type: 'ac_servo',
                motor_specs: {
                    continuous_torque_Nm: 10.0,
                    peak_torque_Nm: 30.0,
                    max_speed_rpm: 3000,
                    encoder_resolution: 1048576,
                    power_rating_W: 2200
                },
                drive_system: 'ballscrew',
                drive_specs: {
                    lead_mm_per_rev: 10,
                    accuracy_class: 'C3',
                    preload_type: 'heavy',
                    efficiency: 0.95,
                    max_speed_rpm: 2500
                }
            }
        }
    }
};

// Helper functions for machine calculations
export const MACHINE_UTILS = {
    calculateAxisForce(axis, acceleration_mm_s2, moving_mass_kg = 10) {
        const force_N = moving_mass_kg * acceleration_mm_s2 / 1000; // Convert mm/s² to m/s²
        return force_N;
    },
    
    calculateMotorTorque(axis, force_N) {
        const drive = axis.drive_specs;
        const efficiency = drive.efficiency || 0.85;
        
        switch (axis.drive_system) {
            case 'ballscrew':
            case 'leadscrew':
                const lead_m = drive.lead_mm_per_rev / 1000;
                return (force_N * lead_m) / (2 * Math.PI * efficiency);
                
            case 'belt_drive':
                const pulley_radius_m = (drive.pulley_diameter_mm || 20) / 2000;
                return (force_N * pulley_radius_m) / efficiency;
                
            case 'rack_pinion':
                const pinion_radius_m = ((drive.module_mm * drive.pinion_teeth) / 2) / 1000;
                return (force_N * pinion_radius_m) / efficiency;
                
            default:
                return 0;
        }
    },
    
    getMaxFeedForAxis(axis) {
        const motor = axis.motor_specs;
        const drive = axis.drive_specs;
        
        switch (axis.drive_system) {
            case 'ballscrew':
            case 'leadscrew':
                const max_rpm = Math.min(motor.max_speed_rpm || 3000, drive.max_speed_rpm || 2000);
                return max_rpm * drive.lead_mm_per_rev;
                
            case 'belt_drive':
                // Implementation for belt drives
                return 10000; // Placeholder
                
            default:
                return 5000; // Conservative default
        }
    }
};