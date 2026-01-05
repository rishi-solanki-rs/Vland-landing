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

// Replace old interactive plot grid with the new bulging 3D model from model.html
document.addEventListener('DOMContentLoaded', () => {
const canvas = document.getElementById('plot-canvas');
if (!canvas) return;

    // Scene & renderer
const scene = new THREE.Scene();
  // Use a transparent scene background so the parent `.map-wrapper` color shows through
  scene.background = null;

function getCanvasSize() {
  // Prefer layout size (clientWidth/clientHeight) so CSS-controlled heights (vh) are respected
  const width = canvas.clientWidth || canvas.getBoundingClientRect().width || window.innerWidth;
  const height = canvas.clientHeight || canvas.getBoundingClientRect().height || Math.round(window.innerHeight * 0.6);
  return { width, height };
}

    const sizeInfo = getCanvasSize();
    const camera = new THREE.PerspectiveCamera(
        60,
        sizeInfo.width / sizeInfo.height,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    // Make sure the canvas DOM element matches CSS sizing
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // Ensure renderer accounts for device pixel ratio for correct sizing and sharpness
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    // Make clear color fully transparent (alpha 0) so parent background is visible
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(sizeInfo.width, sizeInfo.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights (copied from model.html)
    scene.add(new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.7));
    const sun = new THREE.DirectionalLight(0xfff8e7, 1.0);
    sun.position.set(100, 150, 50);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 500;
    scene.add(sun);

    // Transparent base just for shadows
    const base = new THREE.Mesh(
        new THREE.PlaneGeometry(140, 120),
        new THREE.ShadowMaterial({ opacity: 0.15 })
    );
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.01;
    base.receiveShadow = true;
    scene.add(base);

    // Plot settings (same as model.html)
    const rows = 5;
    const cols = 6;
    const plotSize = 18;
    const plotHeight = 2.5;
    const gap = 3;
    const bulgeFactor = 1.2;

    const status = [
      0,0,0,0,1,2,
      0,0,0,1,2,2,
      0,0,1,0,0,2,
      0,1,0,0,2,1,
      1,0,2,1,2,0
    ];

    const colors = {
      0: 0x90ee90,
      1: 0xff0000,
      2: 0xff8c00
    };

    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const plotGeo = new THREE.BoxGeometry(plotSize, plotHeight, plotSize, 8, 8, 8);
        const position = plotGeo.attributes.position;

        for (let v = 0; v < position.count; v++) {
          const y = position.getY(v);
          if (y > plotHeight / 2 - 0.1) {
            const x = position.getX(v);
            const z = position.getZ(v);
            const distFromCenter = Math.sqrt(x * x + z * z) / (plotSize / 2);
            const bulge = (1 - distFromCenter) * bulgeFactor;
            position.setY(v, y + bulge * 0.5);
            position.setX(v, x * (1 + bulge * 0.05));
            position.setZ(v, z * (1 + bulge * 0.05));
          }
        }
        plotGeo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
          color: colors[status[i]],
            transparent: true,
          opacity: 0.8,
          roughness: 0.4,
          metalness: 0.1,
          emissive: 0x222222,
          emissiveIntensity: 0.2
        });

        const plot = new THREE.Mesh(plotGeo, mat);
        plot.position.y = plotHeight / 2;
        plot.position.x = (c - cols / 2 + 0.5) * (plotSize + gap);
        plot.position.z = (r - rows / 2 + 0.5) * (plotSize + gap);
        plot.castShadow = true;
        plot.receiveShadow = true;
        scene.add(plot);

        // Wireframe overlay
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          wireframe: true,
          transparent: true,
          opacity: 0.6
        });
        const wire = new THREE.Mesh(plotGeo.clone(), wireMat);
        plot.add(wire);

        i++;
      }
    }

    // Fog for depth
    scene.fog = new THREE.Fog(0xffffff, 100, 400);

    // Camera setup (adapted from model.html)
    camera.position.set(100, 90, 150);
    camera.lookAt(0, 10, 0);

    // Responsive camera tweaks so the model appears larger on small screens
    function adjustCameraForViewport(width, height) {
      if (width <= 420) {
        camera.position.set(70, 55, 90);
        camera.fov = 68;
      } else if (width <= 768) {
        camera.position.set(85, 70, 120);
        camera.fov = 62;
      } else {
        camera.position.set(100, 90, 150);
        camera.fov = 60;
      }
      camera.updateProjectionMatrix();
    }

    // Initial adjustment
    adjustCameraForViewport(sizeInfo.width, sizeInfo.height);

    // OrbitControls for smooth rotation & zoom
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 40;
    controls.maxDistance = 400;

    // Animation loop
function animate() {
    requestAnimationFrame(animate);
      controls.update();
    renderer.render(scene, camera);
}
animate();
  // Resize handling so model fits plot area
function handleResize() {
  const { width, height } = getCanvasSize();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  // Update pixel ratio in case devicePixelRatio changed (e.g., when moving between displays)
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(width, height);
  // Keep camera framing responsive
  adjustCameraForViewport(width, height);
}

// Call handleResize after initialization to ensure renderer matches final CSS layout
setTimeout(handleResize, 50);
window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

// Observe layout changes to the canvas parent (useful when CSS animations or dynamic content changes size)
if (window.ResizeObserver) {
  try {
    const ro = new ResizeObserver(() => {
      handleResize();
    });
    ro.observe(canvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
  } catch (e) {
    // ResizeObserver may throw in some older environments - fallback to resize event only
    console.warn('ResizeObserver not available or failed:', e);
  }
}
});
