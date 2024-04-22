// Import required modules
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Initialize Three.js components
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);

// DOM elements
const rightButton = document.getElementById("right");
const container3D = document.getElementById("container3D");
const carButton = document.getElementById("carBtn");
const vanButton = document.getElementById("vanBtn");
const truckButton = document.getElementById("truckBtn");
const headerText = document.getElementById("header");
const selectButton = document.getElementById("selectBtn");
const backButton = document.getElementById("backBtn");

// Three.js objects
let road, vehicle, car, van, truck, backgroundPlane, snowParticles;

// Array of texture objects
const textures = [
  { name: "Jungle", url: "./images/jungle.jpg" },
  { name: "Winter", url: "./images/winter.jpg" },
  { name: "Mountains", url: "./images/mountains.jpg" },
  { name: "Sea", url: "./images/sea.jpg" },
  { name: "Night", url: "./images/night.jpg" },
  { name: "Grass", url: "./images/grass.jpg" },
  { name: "Sand", url: "./images/sand.jpg" },
];
let currentTextureIndex = 0;
let loadBackground = false;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Initialize renderer
initRenderer();

// Setup lights
setupLights();

// Initialize the scene
selectVehicle();

// Start animation loop
animate();

// Function to initialize renderer
function initRenderer() {
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container3D").appendChild(renderer.domElement);
}

// Function to setup lights
function setupLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
}

// Function for animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update positions and rotations
  updatePositionsAndRotations();

  // Handle background texture movement
  handleBackgroundMovement();

  // Apply rendering
  render();
}

// Function to update positions and rotations
function updatePositionsAndRotations() {
  if (road) {
    road.position.x -= 0.7; // Adjust the speed of movement as needed
  }

  if (car) {
    car.rotation.y = mouseX / window.innerWidth;
  }

  if (van) {
    van.rotation.y = -0.8 + mouseX / window.innerWidth;
  }

  if (truck) {
    truck.rotation.y = -1.5 + mouseX / window.innerWidth;
  }
}

// Function to handle background texture movement
function handleBackgroundMovement() {
  if (loadBackground) {
    backgroundPlane = scene.getObjectByName("backgroundPlane");

    if (backgroundPlane) {
      const backgroundMaterial = backgroundPlane.material;
      if (backgroundMaterial.map) {
        backgroundMaterial.map.offset.x += 0.0005; // Adjust the speed of movement as needed

        if (backgroundMaterial.map.offset.x > 0.5) {
          currentTextureIndex = (currentTextureIndex + 1) % textures.length;
          const textureUrl = textures[currentTextureIndex].url;
          scene.remove(backgroundPlane);
          vehicle.visible = false;
          moveCarToLeftPosition(function () {
            vehicle.visible = true;
            moveCarFromLeftToRight();
          });
          setupForestBackground();
          road.position.x = 0;
        }
      }
    } else {
      setupForestBackground();
    }
  }
}

// Function to render the scene
function render() {
  rightButton.style.transform = `translateY(${Math.sin(Date.now() * 0.002) * 10}px)`;
  carButton.style.transform = `translateY(${Math.sin(Date.now() * 0.002) * 10}px)`;
  vanButton.style.transform = `translateY(${Math.sin(Date.now() * 0.002) * 10}px)`;
  truckButton.style.transform = `translateY(${Math.sin(Date.now() * 0.002) * 10}px)`;
  renderer.render(scene, camera);
}

// Event listener for right button
rightButton.addEventListener("click", function () {
  currentTextureIndex = (currentTextureIndex + 1) % textures.length;
  vehicle.visible = false;
  moveCarToLeftPosition(function () {
    vehicle.visible = true;
    moveCarFromLeftToRight();
  });
  road.position.x = 0;
  setupForestBackground();
});

// Function to move the vehicle to the left position
function moveCarToLeftPosition(onComplete) {
  const targetX = -500; // Target X position (left)
  const duration = 500; // Duration of the animation (milliseconds)
  const initialX = vehicle.position.x;
  const deltaX = targetX - initialX;
  const startTime = Date.now();

  function updateCarPosition() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const newX = initialX + deltaX * progress;
    vehicle.position.x = newX;

    if (progress < 1) {
      requestAnimationFrame(updateCarPosition);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  }

  updateCarPosition();
}

// Function to move the vehicle from left to right
function moveCarFromLeftToRight() {
  const initialX = -1200;
  const targetX = 1400;
  const duration = 17000;
  const startTime = Date.now();

  function updateCarPosition() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const newX = initialX + (targetX - initialX) * progress;
    vehicle.position.x = newX;

    if (progress < 1) {
      requestAnimationFrame(updateCarPosition);
    }
  }

  updateCarPosition();
}

// Event listener for mouse movement
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Event listeners for vehicle selection buttons
carButton.addEventListener("click", function () {
  headerText.style.display = "none";
  carButton.style.display = "none";
  vanButton.style.display = "none";
  truckButton.style.display = "none";
  selectButton.innerHTML = "Let's take a car ride";
  scene.remove(van);
  scene.remove(truck);
  car.position.x = 0;
  car.scale.set(4, 4, 4);
  setTimeout(() => {
    scene.remove(car);
    travel("car");
  }, 1000);
});

vanButton.addEventListener("click", function () {
  headerText.style.display = "none";
  carButton.style.display = "none";
  vanButton.style.display = "none";
  truckButton.style.display = "none";
  selectButton.innerHTML = "Let's take a van ride";
  scene.remove(car);
  scene.remove(truck);
  van.position.x = 30;
  van.position.y = -10;
  van.scale.set(60, 60, 60);
  setTimeout(() => {
    scene.remove(van);
    travel("van");
  }, 1000);
});

truckButton.addEventListener("click", function () {
  headerText.style.display = "none";
  carButton.style.display = "none";
  vanButton.style.display = "none";
  truckButton.style.display = "none";
  selectButton.innerHTML = "Let's take a cab ride";
  scene.remove(car);
  scene.remove(van);
  truck.position.x = 0;
  truck.scale.set(3, 3, 3);
  setTimeout(() => {
    scene.remove(truck);
    travel("truck");
  }, 1000);
});

// Event listener for going back to vehicle selection
backButton.addEventListener("click", function () {
  scene.remove(vehicle);
  scene.remove(road);
  scene.remove(backgroundPlane);
  scene.remove(snowParticles); // Remove snow particles when going back
  rightButton.style.display = "none";
  backButton.style.display = "none";
  carButton.style.display = "block";
  vanButton.style.display = "block";
  truckButton.style.display = "block";
  selectButton.style.display = "block";
  headerText.style.display = "block";
  selectButton.innerHTML = "Select a vehicle";
  loadBackground = false;
  selectVehicle();
});

// Function to select a vehicle
function selectVehicle() {
  loadCarModel("car");
  loadCarModel("van");
  loadCarModel("truck");
}

// Function to load GLTF model for a vehicle
function loadCarModel(model) {
  const loader = new GLTFLoader();
  let objToRender = model;

  loader.load(
    `models/${objToRender}/scene.gltf`,
    function (gltf) {
      if (model === "car") {
        car = gltf.scene;
        car.position.set(-500, -100, 10);
        car.scale.set(2, 2, 2);
        scene.add(car);
      } else if (model === "van") {
        van = gltf.scene;
        van.position.set(0, 0, 10);
        van.scale.set(50, 50, 50);
        van.rotation.y = THREE.MathUtils.degToRad(-20);
        van.rotation.x = THREE.MathUtils.degToRad(10);
        scene.add(van);
      } else if (model === "truck") {
        truck = gltf.scene;
        truck.position.set(450, -100, 10);
        truck.scale.set(2, 2, 2);
        truck.rotation.y = THREE.MathUtils.degToRad(-60);
        scene.add(truck);
      }
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );

  camera.position.z = 500;
}

// Function to initiate travel with a selected vehicle
function travel(model) {
  setupForestBackground();
  loadRoad();
  carModel(model);
  rightButton.style.display = "block";
  backButton.style.display = "block";
  selectButton.style.display = "none";
}

// Function to load GLTF model for road
function loadRoad() {
  const loader = new GLTFLoader();
  let objToRender = "road";

  loader.load(
    `models/${objToRender}/scene.gltf`,
    function (gltf) {
      road = gltf.scene;
      road.position.set(0, -220, 0);
      road.scale.set(12, 15, 15);
      road.rotation.y = THREE.MathUtils.degToRad(90);
      road.rotation.x = THREE.MathUtils.degToRad(15);
      scene.add(road);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );

  camera.position.z = 500;
}

// Function to load GLTF model for the selected vehicle
function carModel(model) {
  const loader = new GLTFLoader();
  let objToRender = model;

  loader.load(
    `models/${objToRender}/scene.gltf`,
    function (gltf) {
      vehicle = gltf.scene;
      vehicle.position.set(0, -220, 0);
      vehicle.scale.set(4, 4, 4);
      vehicle.rotation.y = THREE.MathUtils.degToRad(90);

      if (objToRender == "car") {
        vehicle.position.x = 100;
      } else if (objToRender == "van") {
        vehicle.scale.set(100, 100, 100);
        vehicle.position.x = -200;
      }
      scene.add(vehicle);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );

  camera.position.z = 500;
}

// Function to setup forest background
function setupForestBackground() {
  loadBackground = true;
  const geometry = new THREE.PlaneGeometry(100, 100, 32, 32);
  const textureUrl = textures[currentTextureIndex].url;
  loadTexture(textureUrl, geometry);

  function loadTexture(textureUrl, geometry) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textureUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    backgroundPlane = scene.getObjectByName("backgroundPlane");
    if (!backgroundPlane) {
      backgroundPlane = new THREE.Mesh(geometry, material);
      backgroundPlane.name = "backgroundPlane";
      scene.add(backgroundPlane);
    } else {
      backgroundPlane.material.map = texture;
      backgroundPlane.material.needsUpdate = true;
    }

    backgroundPlane.position.z = 0;
    backgroundPlane.position.y = 233;
    backgroundPlane.position.x = 720;
    backgroundPlane.scale.set(30, 7, 10);

    // Check if the current texture is "Winter"
    if (textures[currentTextureIndex].name === "Winter") {
      // Add snow particles
      addSnowParticles();
    } else {
      // Remove snow particles if texture is not "Winter"
      removeSnowParticles();
    }
  }
}

// Function to add snow particles
function addSnowParticles() {
  // Create snow particle geometry and material
  const snowGeometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 1000 - 500;
    const y = Math.random() * 500 - 250;
    const z = Math.random() * 1000 - 500;
    vertices.push(x, y, z);
  }

  snowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const snowMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 5,
    map: new THREE.TextureLoader().load("./images/snow.png"), // You need to provide the path to the snowflake texture
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  // Create snow particle system
  snowParticles = new THREE.Points(snowGeometry, snowMaterial);
  snowParticles.name = "snowParticles";
  scene.add(snowParticles);

  // Animation loop for snow particles
  function animateSnowParticles() {
    const positions = snowParticles.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      // Update Y position of each particle
      positions[i + 1] -= 0.1; // You can adjust the speed of falling snow here
      // Reset Y position if particle falls below a certain threshold
      if (positions[i + 1] < -250) {
        positions[i + 1] = 250;
      }
    }

    // Mark the buffer as needing an update
    snowParticles.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);

    // Request animation frame for next frame
    requestAnimationFrame(animateSnowParticles);
  }

  // Start animation loop
  animateSnowParticles();
}

// Function to remove snow particles
function removeSnowParticles() {
  // Check if snow particles exist in the scene
  const snowParticles = scene.getObjectByName("snowParticles");
  if (snowParticles) {
    scene.remove(snowParticles);
  }
}
