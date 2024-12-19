import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


const loader = new GLTFLoader();
let presentSmall = null; // reference to store the smaller present
let presentLarge = null; // reference to store the larger present

loader.load('christmas_present.glb', function (gltf) {
  // Clone the scene for each present
  presentSmall = gltf.scene.clone();
  presentLarge = gltf.scene.clone();

  // Assign unique materials to prevent shared state issues
  presentSmall.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone(); // Ensure unique material
    }
  });

  presentLarge.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone(); // Ensure unique material
    }
  });

  // Set scale, position, and rotation
  presentSmall.scale.set(1, 1, 1); // Adjust the scale as needed
  presentLarge.scale.set(1.5, 1.25, 1.5);
  presentSmall.position.set(1, 0, 1); // Position the small present
  presentLarge.position.set(-1.5, 0, -1.5); // Position the large present
  presentSmall.rotateY(45);
  presentLarge.rotateY(60);

  // Add presents to the scene
  scene.add(presentSmall);
  scene.add(presentLarge);
}, undefined, function (error) {
  console.error(error);
});

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7a1d1d); //set background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });


renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Platform
const platformGeometry = new THREE.CylinderGeometry(6.5, 6.5, 2, 54); // radius top, radius bottom, height, num segments
const platformMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); // white platform
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.translateY(-1);
scene.add(platform);

const decorationGeometry = new THREE.TorusGeometry(6.5, 0.1, 64);
const decorationMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500});
const decorationTop = new THREE.Mesh(decorationGeometry, decorationMaterial);
const decorationBottom = new THREE.Mesh(decorationGeometry, decorationMaterial);
decorationTop.rotateX(Math.PI/2);
decorationBottom.rotateX(Math.PI/2);
decorationBottom.translateZ(2);
scene.add(decorationTop);
scene.add(decorationBottom);

// Globe
const globeGeometry = new THREE.SphereGeometry(6.5, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2); // math.pi / 2 makes the vertical angle of the sphere only half  
const globeMaterial = new THREE.MeshPhongMaterial({ 
  color: 0xffffff, 
  transparent: true,
  opacity: 0.3,
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Tree Trunk
const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8b5a2b }); // Brown trunk
const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
trunk.position.set(0, 1, 0); // Center the trunk above the platform
scene.add(trunk);

// Tree Foliage
const leavesGeometry = new THREE.ConeGeometry(2, 5, 32);
const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 }); // Green foliage
const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
leaves.position.set(0, 3.5, 0); // Position above the trunk
scene.add(leaves);

// Load Font and Create Text
const fontLoader = new FontLoader();
fontLoader.load(
  'https://threejs.org/examples/fonts/gentilis_regular.typeface.json',
  (font) => {
    const text = 'MERRY CHRISTMAS HALLE!';
    const radius = 6.5; // Radius of the curve
    const baseAngleStep = Math.PI * 4.75 / 180; // Base angle step for most letters
    let currentAngle = 0; // Start from angle 0

    for (let i = text.length - 1; i >= 0; i--) {
      const letter = text[i];
      const letterGeometry = new TextGeometry(letter, {
        font: font,
        size: 0.5,
        depth: 0.05,
        bevelEnabled: true,
        bevelSegments: 100,
        bevelThickness: 0.05,
        bevelSize: 0.03,
      });

      const letterMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
      const letterMesh = new THREE.Mesh(letterGeometry, letterMaterial);

      // Adjust angleStep for the letter "I" (index 9)
      let angleStep = baseAngleStep;
      if (i === 10 || i === 11 || i === 12) {
        angleStep = baseAngleStep * 0.8; // Reduce spacing for "I"
      }

      if (i == 13) {
        angleStep = baseAngleStep * 1.1;
      }

      // Calculate angle for the current letter
      const angle = currentAngle - angleStep / 2; // Center letter at the current angle

      // Position each letter along the circle
      letterMesh.position.x = radius * Math.cos(angle);
      letterMesh.position.z = radius * Math.sin(angle);
      letterMesh.position.y = -1.25; // Slight elevation
      letterMesh.rotation.y = -angle + Math.PI / 2; // Face the center of the circle

      scene.add(letterMesh);

      // Update the current angle for the next letter
      currentAngle += angleStep;
    }
  }
);

// Function to create a light
function createLight(x, y, z, color) {
    // Sphere for the light bulb
    const lightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const lightMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color, // Make the light glow
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
  
    // Add PointLight for the glow effect
    const pointLight = new THREE.PointLight(color, 1, 2); // Color, intensity, distance
    pointLight.position.set(x, y, z);
  
    // Position the light bulb and point light
    light.position.set(x, y, z);
    scene.add(light);
    scene.add(pointLight);
  }

  // Add lights in a spiral around the cone
const colors = [0xff0000, 0x00ff00, 0xffffff]; // Red, Green, Blue, Yellow
const numLights = 80; // Number of lights
for (let i = 0; i < numLights; i++) {
  const angle = (i / numLights) * 90; // Spiral angle
  const height = 1 + 5 * i/numLights; // Spiral height (from top to base)
  const radius = 2 * (1 - (height - 1)/5); // Radius decreases toward the top
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = height;

  const color = colors[i % colors.length]; // Cycle through colors
  createLight(x, y, z, color);
}

// Snowflake Parameters
const snowflakeCount = 100; // Number of snowflakes
const snowflakes = []; // Array to hold snowflake meshes

// Create Snowflakes
const snowflakeGeometry = new THREE.SphereGeometry(0.1, 8, 8); // Small spheres for snowflakes
const snowflakeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); // White snowflakes

for (let i = 0; i < snowflakeCount; i++) {
  const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);

  // Random initial position within a box-shaped area
  const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
  const y = Math.random() * 6.5; // Random Y within the top half of the sphere (0 to 6.5)
  const effectiveRadius = Math.sqrt(6.5 ** 2 - y ** 2); // Max radius at the current height (Pythagoras)
  const radius = Math.random() * effectiveRadius; // Random radius constrained by the height
  const x = radius * Math.cos(angle); // Polar to Cartesian X
  const z = radius * Math.sin(angle); // Polar to Cartesian Z

  snowflake.position.set(x, y, z);
  scene.add(snowflake); // Add snowflake to the scene
  snowflakes.push(snowflake); // Store the snowflake
}


// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Camera position
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);
const zoomFactor = 1; // Control the zoom speed
const minZoom = 8; // min distance
const maxZoom = 20; // max distance

// Zoom using spherical coordinates
window.addEventListener('wheel', (event) => {
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position); // Convert current position to spherical coordinates

    if (event.deltaY > 0) {
        spherical.radius = Math.min(spherical.radius + zoomFactor, maxZoom); // zoom out
    } else {
        spherical.radius = Math.max(spherical.radius - zoomFactor, minZoom); // zoom in
    }

    camera.position.setFromSpherical(spherical); // Apply the updated spherical coordinates
    camera.lookAt(0, 0, 0); // Keep the camera looking at the center
});

// Variables for mouse control
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationSpeed = 0.005;

// Mouse down event
window.addEventListener('mousedown', (event) => {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
});

// Mouse move event
window.addEventListener('mousemove', (event) => {
  if (!isDragging) return;

  // Calculate movement
  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y,
  };

  // Rotate the scene (affects the camera)
  const deltaRotation = {
    x: deltaMove.y * rotationSpeed,
    y: deltaMove.x * rotationSpeed,
  };

  // Apply rotation to the camera's position
  const spherical = new THREE.Spherical();
  spherical.setFromVector3(camera.position);
  spherical.theta -= deltaRotation.y; // Horizontal rotation
  spherical.phi -= deltaRotation.x; // Vertical rotation
  spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi)); // Clamp vertical rotation

  camera.position.setFromSpherical(spherical);
  camera.lookAt(0, 0, 0);

  // Update mouse position
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
});

// Mouse up event
window.addEventListener('mouseup', () => {
  isDragging = false;
});

// logic for selecting presents:
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null; // Store the object currently hovered
let selectedObject = null; // Store the object currently clicked

// Ensure popups exist
const popupSmall = document.getElementById("popup-small");
const closePopupSmall = document.getElementById("closePopupSmall");

const popupLarge = document.getElementById("popup-large");
const closePopupLarge = document.getElementById("closePopupLarge");

if (!popupSmall || !popupLarge) {
  console.error('Popup elements are missing in the HTML.');
}

// Click event for selecting presents
window.addEventListener('click', (event) => {
  if (!presentSmall || !presentLarge) {
    console.log('Models not loaded yet.');
    return;
  }

  // Update mouse position
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Check intersections for both presents
  const intersectsSmall = raycaster.intersectObjects(presentSmall.children, true);
  const intersectsLarge = raycaster.intersectObjects(presentLarge.children, true);

  if (intersectsSmall.length > 0) {
    console.log('Small present clicked!');
    popupSmall.style.display = 'block'; // Show popup for small present
    popupLarge.style.display = 'none'; // Hide large popup
  } else if (intersectsLarge.length > 0) {
    console.log('Large present clicked!');
    popupLarge.style.display = 'block'; // Show popup for large present
    popupSmall.style.display = 'none'; // Hide small popup
  } else {
    popupSmall.style.display = 'none'; // Hide all popups if no intersection
    popupLarge.style.display = 'none';
  }
});


// Close popup logic
closePopupSmall.addEventListener("click", () => {
  popupSmall.style.display = "none";
});

closePopupLarge.addEventListener("click", () => {
  popupLarge.style.display = "none";
});


window.addEventListener('mousemove', (event) => {
  if (!presentSmall || !presentLarge) return; // Ensure models are loaded

  // Update mouse position in normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with each present
  const intersectsSmall = raycaster.intersectObjects(presentSmall.children, true);
  const intersectsLarge = raycaster.intersectObjects(presentLarge.children, true);

  let newHoveredObject = null;

  if (intersectsSmall.length > 0) {
    newHoveredObject = presentSmall; // Hovered small present
  } else if (intersectsLarge.length > 0) {
    newHoveredObject = presentLarge; // Hovered large present
  }

  // Handle hover changes
  if (newHoveredObject !== hoveredObject) {
    // Clear previous hover highlight
    if (hoveredObject && hoveredObject !== selectedObject) {
      hoveredObject.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive.set(0x000000); // Remove highlight
        }
      });
    }

    // Apply new hover highlight
    hoveredObject = newHoveredObject;
    if (hoveredObject && hoveredObject !== selectedObject) {
      hoveredObject.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive.set(0x888888); // Add hover highlight
        }
      });
    }
  }
});




// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Animate snowflakes
  snowflakes.forEach(snowflake => {
    snowflake.position.y -= 0.03; // Move down slightly
    snowflake.position.x += (Math.random() - 0.5) * 0.01; // Optional horizontal drift
    snowflake.position.z += (Math.random() - 0.5) * 0.01; // Optional horizontal drift

    // Reset snowflake to the top if it falls below a certain point
    if (snowflake.position.y < 0.1) {
      const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
      const y = Math.random() * 6.5; // Random Y within the top half of the sphere (0 to 6.5)
      const effectiveRadius = Math.sqrt(6.5 ** 2 - y ** 2); // Max radius at the current height (Pythagoras)
      const radius = Math.random() * effectiveRadius; // Random radius constrained by the height
      const x = radius * Math.cos(angle); // Polar to Cartesian X
      const z = radius * Math.sin(angle); // Polar to Cartesian Z

      snowflake.position.set(x, y, z);
    }
  });

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
