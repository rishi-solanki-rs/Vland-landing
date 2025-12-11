// --- threejs-map.js CONCEPTUAL CODE ---

// THREE is loaded from CDN in HTML, so it's available globally
// For OrbitControls, we'll use the CDN version or implement basic controls

// Nav scroll effect - runs immediately
(function() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
})();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
// 1. Scene Setup
const canvas = document.getElementById('plot-canvas');
if (!canvas) return;

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const scene = new THREE.Scene();

// Function to get canvas dimensions properly
function getCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    return {
        width: rect.width || canvas.clientWidth || window.innerWidth,
        height: rect.height || canvas.clientHeight || 500
    };
}

const initialSize = getCanvasSize();
// FOV - Web me bhi initial size bada, phone me size bada + zoom
const initialFOV = isMobile ? 60 : 70; // Mobile: bigger size/zoom (60), Desktop: bigger size (70)
const camera = new THREE.PerspectiveCamera(initialFOV, initialSize.width / initialSize.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: !isMobile, // Disable antialiasing on mobile for performance
    powerPreference: isMobile ? "low-power" : "high-performance"
});

// Set initial size
renderer.setSize(initialSize.width, initialSize.height, false);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)); // Limit pixel ratio on mobile
renderer.setClearColor(0x689F38); // Darker grass green background to match ground plane

// Camera position - Web me open hote hi es size ka dikhe (image jaisa) - BADA SIZE
// Desktop: Initial size bada karo (bigger view)
// Mobile: Size bada karo khulte hi (bigger initial size) + zoom functionality
if (isMobile) {
    // Mobile: Size bada karo khulte hi (bigger initial size) + zoom functionality
    camera.position.set(0, 28, 18); // Even bigger size - much closer for bigger zoomed view
    camera.fov = 60; // Narrower FOV for bigger/more zoomed view on mobile
} else {
    // Desktop: Web me initial size bada karo (bigger view)
    camera.position.set(0, 42, 28); // Bigger size - closer view for desktop
    camera.fov = 70; // Narrower FOV for bigger view on desktop
}
camera.lookAt(0, 0, 0); // Look at center
camera.updateProjectionMatrix(); // Update camera with new FOV

// 2. Lighting and Controls
// Basic mouse and touch controls
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let previousTouchDistance = 0;
let isPinching = false;

// Mouse controls (desktop)
canvas.addEventListener('mousedown', (e) => {
    if (isTouchDevice) return; // Skip mouse events on touch devices
    e.preventDefault();
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
    if (isTouchDevice || !isDragging) return;
    e.preventDefault();
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    
    // Rotate camera around the scene
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position);
    spherical.theta -= deltaX * 0.01;
    spherical.phi += deltaY * 0.01;
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
    
    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, 0);
    
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mouseup', () => {
    if (isTouchDevice) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', () => {
    if (isTouchDevice) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
});

// Touch controls (mobile)
let touchStartTime = 0;
let touchStartPosition = { x: 0, y: 0 };
let hasMoved = false;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartTime = Date.now();
    hasMoved = false;
    
    if (e.touches.length === 1) {
        // Single touch - prepare for rotate or tap
        isDragging = false; // Don't set to true yet, wait for movement
        touchStartPosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
        previousMousePosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
    } else if (e.touches.length === 2) {
        // Two touches - pinch to zoom
        isPinching = true;
        isDragging = false;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        previousTouchDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
        // Check if user has moved enough to consider it a drag
        const deltaX = Math.abs(e.touches[0].clientX - touchStartPosition.x);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartPosition.y);
        
        if (deltaX > 5 || deltaY > 5) {
            hasMoved = true;
            isDragging = true;
        }
        
        if (isDragging) {
            // Single touch drag - rotate
            const moveDeltaX = e.touches[0].clientX - previousMousePosition.x;
            const moveDeltaY = e.touches[0].clientY - previousMousePosition.y;
            
            const spherical = new THREE.Spherical();
            spherical.setFromVector3(camera.position);
            spherical.theta -= moveDeltaX * 0.015; // Slightly faster on mobile
            spherical.phi += moveDeltaY * 0.015;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
            
            camera.position.setFromSpherical(spherical);
            camera.lookAt(0, 0, 0);
            
            previousMousePosition = { 
                x: e.touches[0].clientX, 
                y: e.touches[0].clientY 
            };
        }
    } else if (e.touches.length === 2 && isPinching) {
        // Pinch to zoom
        hasMoved = true; // Pinch is definitely a gesture, not a tap
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
        
        const distance = camera.position.length();
        const zoomFactor = previousTouchDistance / currentDistance;
        const newDistance = distance * zoomFactor;
        
        // Mobile zoom limits - allow more zoom in and out
        const minDistance = isMobile ? 15 : 10; // Closer zoom on mobile
        const maxDistance = isMobile ? 80 : 60; // More zoom out on mobile
        
        if (newDistance > minDistance && newDistance < maxDistance) {
            camera.position.normalize().multiplyScalar(newDistance);
            camera.lookAt(0, 0, 0); // Keep looking at center during zoom
        }
        
        previousTouchDistance = currentDistance;
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    
    // Check if it was a tap (not a drag)
    const touchDuration = Date.now() - touchStartTime;
    const wasTap = !hasMoved && touchDuration < 300; // Less than 300ms and no movement
    
    if (e.touches.length === 0) {
        // All touches ended
        if (wasTap && !isPinching) {
            // It was a tap - trigger plot click
            const lastTouch = e.changedTouches[0];
            const fakeEvent = {
                clientX: lastTouch.clientX,
                clientY: lastTouch.clientY,
                touches: [],
                preventDefault: () => {}
            };
            onPlotClick(fakeEvent);
        }
        
        isDragging = false;
        isPinching = false;
        hasMoved = false;
        
        // Hide mobile instructions after first interaction
        if (isMobile || isTouchDevice) {
            hideMobileInstructions();
        }
    } else if (e.touches.length === 1) {
        // Switch from pinch to drag
        isPinching = false;
        isDragging = false; // Reset, will be set on next touchmove if movement detected
        hasMoved = false;
        touchStartPosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
        previousMousePosition = { 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
        };
    }
}, { passive: false });

canvas.addEventListener('touchcancel', () => {
    isDragging = false;
    isPinching = false;
}, { passive: false });

// Wheel zoom (desktop)
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const distance = camera.position.length();
    const newDistance = distance + e.deltaY * 0.01;
    if (newDistance > 10 && newDistance < 60) {
        camera.position.normalize().multiplyScalar(newDistance);
    }
}, { passive: false });
// Lighting adjusted to show green properly without yellow tint
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // brighter ambient light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(15, 25, 15);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Add a second light for better visibility
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-15, 20, -15);
scene.add(directionalLight2);

// Add a subtle green-tinted light to enhance the grass green color
const greenLight = new THREE.DirectionalLight(0x8BC34A, 0.2);
greenLight.position.set(0, 30, 0);
scene.add(greenLight);

// Data structure for plots - More plots added
const plotData = [
    { id: 1, status: 'Sold', location: 'Sector A1', area: '0.5 Acres', return: 'N/A' },
    { id: 2, status: 'Available', location: 'Sector B4', area: '1 Acre', return: '12%' },
    { id: 3, status: 'Hot', location: 'Sector C2', area: '0.75 Acres', return: '15%' },
    { id: 4, status: 'Available', location: 'Sector D3', area: '1.2 Acres', return: '14%' },
    { id: 5, status: 'Hot', location: 'Sector E1', area: '0.8 Acres', return: '18%' },
    { id: 6, status: 'Available', location: 'Sector F2', area: '1.5 Acres', return: '13%' },
    { id: 7, status: 'Sold', location: 'Sector G4', area: '0.6 Acres', return: 'N/A' },
    { id: 8, status: 'Hot', location: 'Sector H3', area: '1.1 Acres', return: '16%' },
    { id: 9, status: 'Available', location: 'Sector I5', area: '0.9 Acres', return: '11%' },
    { id: 10, status: 'Available', location: 'Sector J2', area: '1.3 Acres', return: '15%' },
    { id: 11, status: 'Hot', location: 'Sector K1', area: '0.7 Acres', return: '17%' },
    { id: 12, status: 'Available', location: 'Sector L4', area: '1.4 Acres', return: '12%' },
    { id: 13, status: 'Available', location: 'Sector M1', area: '1.6 Acres', return: '14%' },
    { id: 14, status: 'Hot', location: 'Sector N2', area: '0.9 Acres', return: '19%' },
    { id: 15, status: 'Sold', location: 'Sector O3', area: '0.7 Acres', return: 'N/A' },
    { id: 16, status: 'Available', location: 'Sector P4', area: '1.2 Acres', return: '13%' },
    { id: 17, status: 'Hot', location: 'Sector Q1', area: '1.0 Acres', return: '16%' },
    { id: 18, status: 'Available', location: 'Sector R2', area: '1.5 Acres', return: '12%' },
    { id: 19, status: 'Sold', location: 'Sector S3', area: '0.8 Acres', return: 'N/A' },
    { id: 20, status: 'Available', location: 'Sector T4', area: '1.3 Acres', return: '15%' },
    { id: 21, status: 'Hot', location: 'Sector U1', area: '0.9 Acres', return: '18%' },
    { id: 22, status: 'Available', location: 'Sector V2', area: '1.4 Acres', return: '14%' },
    { id: 23, status: 'Available', location: 'Sector W3', area: '1.1 Acres', return: '13%' },
    { id: 24, status: 'Hot', location: 'Sector X4', area: '1.2 Acres', return: '17%' },
    { id: 25, status: 'Available', location: 'Sector Y1', area: '1.0 Acres', return: '13%' },
    { id: 26, status: 'Hot', location: 'Sector Z2', area: '0.8 Acres', return: '16%' },
    { id: 27, status: 'Available', location: 'Sector AA3', area: '1.3 Acres', return: '14%' },
    { id: 28, status: 'Sold', location: 'Sector BB4', area: '0.9 Acres', return: 'N/A' },
    { id: 29, status: 'Available', location: 'Sector CC1', area: '1.5 Acres', return: '12%' },
    { id: 30, status: 'Hot', location: 'Sector DD2', area: '1.1 Acres', return: '18%' },
    { id: 31, status: 'Available', location: 'Sector EE3', area: '1.2 Acres', return: '15%' },
    { id: 32, status: 'Available', location: 'Sector FF4', area: '0.9 Acres', return: '13%' },
    { id: 33, status: 'Hot', location: 'Sector GG1', area: '1.4 Acres', return: '17%' },
    { id: 34, status: 'Available', location: 'Sector HH2', area: '1.1 Acres', return: '14%' },
    { id: 35, status: 'Sold', location: 'Sector II3', area: '0.7 Acres', return: 'N/A' },
    { id: 36, status: 'Available', location: 'Sector JJ4', area: '1.3 Acres', return: '15%' },
];

const plotObjects = []; // To store the 3D meshes for raycasting

// Color Map - Bright and clear colors
const COLORS = {
    Available: new THREE.Color(0x4CAF50), // Bright Green
    Hot: new THREE.Color(0xFFC107),     // Bright Yellow/Gold
    Sold: new THREE.Color(0xE91E63),      // Bright Pink/Red
    Base: new THREE.Color(0x7CB342)      // Grass Green matching wishlist button (#7CB342)
};

// 3. Create Plot Grid (Simplified example)
function createPlotGrid() {
    // Create the base ground plane - Size for balanced view with equal margins
    // 6 columns * 4.8 spacing = 28.8, add equal margins = 36 (for balanced spacing on all sides)
    // 6 rows * 4.8 spacing = 28.8, add equal margins = 36
    const groundGeometry = new THREE.PlaneGeometry(36, 36); // Larger ground for equal visible margins on all sides
    // Use MeshStandardMaterial for better color accuracy and make it clearly green
    // Using a more vibrant green to ensure it looks green, not yellow
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x689F38, // Darker, more saturated green to ensure it's clearly green (not yellow)
        roughness: 0.7,
        metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    // Start ground below for animation
    ground.position.y = -25;
    scene.add(ground);
    
    // Animate ground coming up smoothly
    if (typeof gsap !== 'undefined') {
        gsap.to(ground.position, {
            y: 0,
            duration: 1.8,
            ease: "power2.out",
            delay: 0.2
        });
    } else {
        // Fallback if GSAP not loaded
        setTimeout(() => {
            ground.position.y = 0;
        }, 100);
    }

    // Position plots to center them exactly - no empty space on right
    // 6 columns * 4.8 = 28.8, center at 0, so start at -14.4
    let xOffset = -14.4; // Center horizontally
    let zOffset = 0; // Center vertically  
    const gridSize = 6; // 6 plots per row

    plotData.forEach((data, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        
        // Create a group to hold all plot elements
        const plotGroup = new THREE.Group();
        
        // Base ground layer (like actual land/terrain) - Much smaller plots to show more grey background
        const plotSize = 3.5; // Further reduced to show more grey area around plots
        const baseGeometry = new THREE.BoxGeometry(plotSize, 0.3, plotSize);
        
        // Different base colors based on status - grass theme
        let baseColor;
        if (data.status === 'Available') {
            baseColor = new THREE.Color(0x66BB6A); // Green grass-like
        } else if (data.status === 'Hot') {
            baseColor = new THREE.Color(0xFFD54F); // Yellow/golden
        } else {
            baseColor = new THREE.Color(0xF48FB1); // Pink/coral
        }
        
        const baseMaterial = new THREE.MeshLambertMaterial({ 
            color: baseColor,
            transparent: true,
            opacity: 0.9
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.15;
        plotGroup.add(base);
        
        // Add internal features: Roads, Park, Gate
        
        // Add roads inside the plot (cross pattern) - scaled for smaller plots
        const roadWidth = 0.2;
        const roadHeight = 0.32;
        const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x424242 }); // Dark gray road
        
        // Horizontal road
        const roadH = new THREE.Mesh(
            new THREE.BoxGeometry(plotSize, roadHeight, roadWidth),
            roadMaterial
        );
        roadH.position.set(0, roadHeight/2 + 0.15, 0);
        plotGroup.add(roadH);
        
        // Vertical road
        const roadV = new THREE.Mesh(
            new THREE.BoxGeometry(roadWidth, roadHeight, plotSize),
            roadMaterial
        );
        roadV.position.set(0, roadHeight/2 + 0.15, 0);
        plotGroup.add(roadV);
        
        // Add park/green area in one corner - scaled for smaller plots
        const parkSize = plotSize * 0.35;
        const parkGeometry = new THREE.BoxGeometry(parkSize, 0.31, parkSize);
        const parkMaterial = new THREE.MeshLambertMaterial({ color: 0x4CAF50 }); // Green park
        const park = new THREE.Mesh(parkGeometry, parkMaterial);
        park.position.set(-plotSize/3, 0.155, plotSize/3); // Top-left corner
        plotGroup.add(park);
        
        // Add small trees in park - scaled down
        for (let i = 0; i < 2; i++) {
            const treeTrunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.06, 0.3, 6),
                new THREE.MeshPhongMaterial({ color: 0x5D4037 })
            );
            treeTrunk.position.set(-plotSize/3 + (i - 0.5) * 0.4, 0.45, plotSize/3 + (i - 0.5) * 0.4);
            plotGroup.add(treeTrunk);
            
            const treeLeaves = new THREE.Mesh(
                new THREE.ConeGeometry(0.2, 0.4, 6),
                new THREE.MeshPhongMaterial({ color: 0x2E7D32 })
            );
            treeLeaves.position.set(-plotSize/3 + (i - 0.5) * 0.4, 0.7, plotSize/3 + (i - 0.5) * 0.4);
            plotGroup.add(treeLeaves);
        }
        
        // Add gate at front (one side) - scaled for smaller plots
        const gateWidth = 0.9;
        const gateHeight = 0.8;
        const gateGeometry = new THREE.BoxGeometry(gateWidth, gateHeight, 0.15);
        const gateMaterial = new THREE.MeshPhongMaterial({ color: 0x8D6E63 }); // Brown gate
        const gate = new THREE.Mesh(gateGeometry, gateMaterial);
        gate.position.set(0, gateHeight/2 + 0.15, plotSize/2 - 0.1); // Front center
        plotGroup.add(gate);
        
        // Add border/fence around the plot
        const borderHeight = 0.5;
        const borderGeometry = new THREE.BoxGeometry(plotSize + 0.2, borderHeight, 0.1);
        const borderMaterial = new THREE.MeshPhongMaterial({ color: 0x8D6E63 }); // Brown fence
        
        // Create fence around the plot
        const positions = [
            [0, borderHeight/2 + 0.15, plotSize/2], // Front
            [0, borderHeight/2 + 0.15, -plotSize/2], // Back
            [plotSize/2, borderHeight/2 + 0.15, 0], // Right
            [-plotSize/2, borderHeight/2 + 0.15, 0] // Left
        ];
        
        positions.forEach((pos, i) => {
            const border = new THREE.Mesh(borderGeometry, borderMaterial);
            border.position.set(pos[0], pos[1], pos[2]);
            if (i >= 2) {
                border.rotation.y = Math.PI / 2;
            }
            plotGroup.add(border);
        });
        
        // Add 3D elements based on status (positioned to avoid roads) - scaled for smaller plots
        if (data.status === 'Hot') {
            // Add a small building/structure for Hot plots (in bottom-right area, away from park)
            const buildingGeometry = new THREE.BoxGeometry(0.9, 1.4, 0.9);
            const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.set(plotSize/3, 1.0, -plotSize/3); // Bottom-right area
            plotGroup.add(building);
            
            // Add a roof
            const roofGeometry = new THREE.ConeGeometry(0.8, 0.5, 4);
            const roofMaterial = new THREE.MeshPhongMaterial({ color: 0xD32F2F });
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.set(plotSize/3, 2.0, -plotSize/3);
            roof.rotation.y = Math.PI / 4;
            plotGroup.add(roof);
        } else if (data.status === 'Available') {
            // Add trees for Available plots (in areas not occupied by park/roads) - scaled down
            const treePositions = [
                [plotSize/3, -plotSize/3], // Bottom-right
                [-plotSize/4, -plotSize/3]  // Bottom-left
            ];
            
            treePositions.forEach((pos, i) => {
                // Tree trunk
                const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
                const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x5D4037 });
                const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                trunk.position.set(pos[0], 0.6, pos[1]);
                plotGroup.add(trunk);
                
                // Tree leaves
                const leavesGeometry = new THREE.ConeGeometry(0.4, 0.6, 8);
                const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x2E7D32 });
                const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
                leaves.position.set(pos[0], 1.1, pos[1]);
                plotGroup.add(leaves);
            });
        } else {
            // Add a "Sold" marker/sign for Sold plots - scaled down
            const signGeometry = new THREE.BoxGeometry(0.6, 0.5, 0.1);
            const signMaterial = new THREE.MeshPhongMaterial({ color: 0xE91E63 });
            const sign = new THREE.Mesh(signGeometry, signMaterial);
            sign.position.set(plotSize/3, 0.4, -plotSize/3); // Bottom-right area
            plotGroup.add(sign);
        }
        
        // Add a colored flag/pole to indicate status - scaled down
        const poleHeight = 1.5;
        const poleGeometry = new THREE.CylinderGeometry(0.06, 0.06, poleHeight, 8);
        const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x424242 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(plotSize/2 - 0.4, poleHeight/2 + 0.15, plotSize/2 - 0.4);
        plotGroup.add(pole);
        
        // Add flag on top of pole - scaled down
        const flagGeometry = new THREE.PlaneGeometry(0.6, 0.4);
        const flagMaterial = new THREE.MeshPhongMaterial({ 
            color: COLORS[data.status],
            side: THREE.DoubleSide
        });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(plotSize/2 - 0.4, poleHeight + 0.15, plotSize/2 - 0.4);
        flag.rotation.y = -Math.PI / 4;
        plotGroup.add(flag);

        // Position the entire plot group - Horizontal layout (agal bagal)
        // Start plots above for animation
        // Reduced spacing to minimize empty space on right
        plotGroup.position.set(
            xOffset + col * 4.8, // Reduced horizontal spacing (4.8 instead of 5.5)
            -15, // Start below
            zOffset - row * 4.8 + (gridSize * 4.8 / 2) // Reduced vertical spacing, center vertically
        );
        
        // Attach custom data to the group
        plotGroup.userData = data; 
        plotObjects.push(plotGroup);
        scene.add(plotGroup);
        
        // Animate plot coming up from bottom
        if (typeof gsap !== 'undefined') {
            gsap.to(plotGroup.position, {
                y: 0,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.5 + (index * 0.02) // Stagger animation
            });
        } else {
            // Fallback if GSAP not loaded
            plotGroup.position.y = 0;
        }
    });
}

// Create all plots first, then animate them
createPlotGrid();

// Animate camera to come from top with proper front-facing view
if (typeof gsap !== 'undefined') {
    // Start camera much higher and animate down to final position
    const finalPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    camera.position.set(finalPosition.x, finalPosition.y + 40, finalPosition.z + 20); // Start higher and further back
    
    gsap.to(camera.position, {
        x: finalPosition.x,
        y: finalPosition.y,
        z: finalPosition.z,
        duration: 1.8,
        ease: "power2.out",
        delay: 0.3,
        onUpdate: () => {
            camera.lookAt(0, 0, 0);
            // Ensure camera always looks at center of plot grid
        },
        onComplete: () => {
            // After animation, ensure camera stays fixed
            camera.lookAt(0, 0, 0);
        }
    });
} else {
    // Fallback: ensure camera is positioned correctly
    camera.lookAt(0, 0, 0);
}

// 5. & 6. Raycasting and Click Handler
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const conversionPanel = document.getElementById('conversion-panel');
const plotDetailsDiv = document.getElementById('plot-micro-details');
let selectedPlot = null;

// Set default plot details on load
if (plotDetailsDiv && plotData.length > 0) {
    const defaultPlot = plotData.find(p => p.status === 'Hot') || plotData.find(p => p.status === 'Available') || plotData[0];
    plotDetailsDiv.innerHTML = `
        <p><strong>Location:</strong> ${defaultPlot.location}</p>
        <p><strong>Total Area:</strong> ${defaultPlot.area}</p>
        <p><strong>Est. Return:</strong> ${defaultPlot.return}</p>
    `;
}

// Handle form submission
const form = conversionPanel ? conversionPanel.querySelector('form') : null;
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! We will send you updates about this plot soon.');
        form.reset();
    });
}

function onPlotClick(event) {
    // Prevent default to avoid scrolling on mobile
    event.preventDefault();
    
    // Get coordinates from mouse or touch event
    let clientX, clientY;
    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    
    // Calculate position in normalized device coordinates (-1 to +1)
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with plot objects (including children)
    const intersects = raycaster.intersectObjects(plotObjects, true);

    if (intersects.length > 0) {
        // Find the parent plot group
        let clickedPlot = intersects[0].object;
        while (clickedPlot && !clickedPlot.userData.location) {
            if (clickedPlot.parent) {
                clickedPlot = clickedPlot.parent;
            } else {
                break;
            }
        }
        
        if (!clickedPlot || !clickedPlot.userData || !clickedPlot.userData.location) return;
        
        if (selectedPlot) {
            // Reset color of previously selected plot base
            const prevBase = selectedPlot.children.find(child => child.type === 'Mesh' && child.geometry.type === 'BoxGeometry' && child.position.y < 1);
            if (prevBase) {
                if (selectedPlot.userData.status === 'Available') {
                    prevBase.material.color.set(new THREE.Color(0x66BB6A));
                } else if (selectedPlot.userData.status === 'Hot') {
                    prevBase.material.color.set(new THREE.Color(0xFFD54F));
                } else {
                    prevBase.material.color.set(new THREE.Color(0xF48FB1));
                }
            }
        }
        
        // Only proceed if the plot is Available or Hot
        if (clickedPlot.userData.status === 'Available' || clickedPlot.userData.status === 'Hot') {
            selectedPlot = clickedPlot;
            
            // Highlight by changing base color to brighter version
            const base = clickedPlot.children.find(child => child.type === 'Mesh' && child.geometry.type === 'BoxGeometry' && child.position.y < 1);
            if (base) {
                base.material.color.set(new THREE.Color(0x52C4B1)); // Brighter highlight green
            }

            // Update Conversion Panel HTML
            plotDetailsDiv.innerHTML = `
                <p><strong>Location:</strong> ${clickedPlot.userData.location}</p>
                <p><strong>Total Area:</strong> ${clickedPlot.userData.area}</p>
                <p><strong>Est. Return:</strong> ${clickedPlot.userData.return}</p>
                <p><strong>Status:</strong> <span style="color: ${clickedPlot.userData.status === 'Hot' ? '#FFC107' : '#4CAF50'}">${clickedPlot.userData.status}</span></p>
            `;
            
            // Panel is always visible now, no need to add/remove active class

        } else {
            // Plot is Sold - Show message
            plotDetailsDiv.innerHTML = `
                <p><strong>Location:</strong> ${clickedPlot.userData.location}</p>
                <p><strong>Total Area:</strong> ${clickedPlot.userData.area}</p>
                <p><strong>Status:</strong> <span style="color: #E91E63">Sold</span></p>
                <p style="color: #999; font-style: italic;">This plot is no longer available.</p>
            `;
        }

    } else {
        // Clicked outside a plot - Deselect
        if (selectedPlot) {
            const base = selectedPlot.children.find(child => child.type === 'Mesh' && child.geometry.type === 'BoxGeometry' && child.position.y < 1);
            if (base) {
                if (selectedPlot.userData.status === 'Available') {
                    base.material.color.set(new THREE.Color(0x66BB6A));
                } else if (selectedPlot.userData.status === 'Hot') {
                    base.material.color.set(new THREE.Color(0xFFD54F));
                } else {
                    base.material.color.set(new THREE.Color(0xF48FB1));
                }
            }
            selectedPlot = null;
        }
    }
}

// Add click event for plot selection (desktop)
canvas.addEventListener('click', onPlotClick, false);

// Mobile instructions handler
const mobileInstructions = document.getElementById('mobile-instructions');
let instructionsTimeout;

function showMobileInstructions() {
    if (mobileInstructions && (isMobile || isTouchDevice)) {
        mobileInstructions.classList.add('show');
        mobileInstructions.classList.remove('hide');
        
        // Auto-hide after 5 seconds
        clearTimeout(instructionsTimeout);
        instructionsTimeout = setTimeout(() => {
            hideMobileInstructions();
        }, 5000);
    }
}

function hideMobileInstructions() {
    if (mobileInstructions) {
        mobileInstructions.classList.add('hide');
        mobileInstructions.classList.remove('show');
    }
}

// Show instructions on mobile after a short delay
if (isMobile || isTouchDevice) {
    setTimeout(showMobileInstructions, 1000);
}


// Animation loop - ensure camera stays fixed and all objects remain visible
function animate() {
    requestAnimationFrame(animate);
    
    // Always ensure camera looks at center of plot grid
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
function handleResize() {
    const size = getCanvasSize();
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    // Ensure camera still looks at center after resize
    camera.lookAt(0, 0, 0);
    renderer.setSize(size.width, size.height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
}

window.addEventListener('resize', handleResize);

// Also handle orientation change on mobile
window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100); // Small delay to ensure proper dimensions
});

// Initial resize to ensure proper sizing
setTimeout(handleResize, 100);

}); // End of DOMContentLoaded