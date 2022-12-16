import {
  sources,
  audioStatus,
  initAudio,
  audioLoop,
  togglePlay,
} from "./assets/scripts/audio.js";
import textureFragmentShader from "./assets/scripts/texture-fragment-shader.js";
import textureVertexShader from "./assets/scripts/texture-vertex-shader.js";
import sphereFragmentShader from "./assets/scripts/sphere-fragment-shader.js";
import sphereVertexShader from "./assets/scripts/sphere-vertex-shader.js";
//import background from "./assets/images/bg4.jpeg";
import background from "./assets/images/bg33.png";

const canvas = document.querySelector("canvas.pepitos");
const stepBackground = document.querySelector(".step-background");
const stepMusic = document.querySelector(".step-music");
const stepAsset = document.querySelector(".step-asset");
const stepDownload = document.querySelector(".step-download");

const rendererSize = {
  width: 1080,
  height: 1920,
};

//initAudio(sources.amonkeys);

canvas.addEventListener("click", downloadImage);

const scene = new THREE.Scene();
// prettier-ignore
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.aspect = canvas.parentNode.clientWidth / canvas.parentNode.clientHeight;
camera.position.z = 5;
camera.lookAt(new THREE.Vector3());
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setSize(rendererSize.width, rendererSize.height, false);
renderer.setClearColor(0x000000, 1);

/* const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.z = 2;
scene.add(cube); */

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color("black") },
    uTime: { value: 0 },
    uAmplitude: { value: 0 },
    uFrequency: { value: 0 },
  },
  vertexShader: sphereVertexShader,
  fragmentShader: sphereFragmentShader,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const textureImage = new THREE.TextureLoader().load(background);

const texturePlane = new THREE.PlaneGeometry(4.3, 8);
const textureMaterial = new THREE.ShaderMaterial({
  vertexShader: textureVertexShader,
  fragmentShader: textureFragmentShader,
  uniforms: {
    uTexture: { type: "t", value: textureImage },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uFrequency: { value: 0 },
    uAmplitude: { value: 0 },
  },
});

textureMaterial.transparent = true;

const textureMesh = new THREE.Mesh(texturePlane, textureMaterial);
scene.add(textureMesh);

/* Steps */
stepBackground.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    renderer.setClearColor(button.dataset.color, 1);
  });
});

stepMusic.querySelector("select").addEventListener("change", (event) => {
  const value = event.target.value;
  initAudio(sources[value]);
});

stepMusic.querySelector("button").addEventListener("click", () => {
  togglePlay();
});

stepAsset.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const color = button.dataset.color;
    sphereMaterial.uniforms.uColor.value = new THREE.Color(color);
  });
});

stepDownload.querySelector("button").addEventListener("click", downloadImage);

function animate(time) {
  requestAnimationFrame(animate);

  /* cube.rotation.x += 0.01;
  cube.rotation.y += 0.01; */

  if (audioStatus === "playing") {
    textureMaterial.uniforms.uAmplitude.value = audioLoop().amplitude;
    textureMaterial.uniforms.uFrequency.value = audioLoop().frequency;
    sphereMaterial.uniforms.uAmplitude.value = audioLoop().amplitude;
    sphereMaterial.uniforms.uFrequency.value = audioLoop().frequency;
  }

  textureMaterial.uniforms.uTime.value = time * 0.001;
  textureMaterial.needsUpdate = true;
  sphereMaterial.uniforms.uTime.value = time * 0.001;
  sphereMaterial.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

function downloadImage() {
  const link = document.createElement("a");
  link.download = `pepitos-${Date.now()}.png`;
  console.log(renderer.domElement);
  link.href = renderer.domElement.toDataURL("image/png");
  link.click();
}

window.addEventListener("resize", () => {
  camera.aspect =
    canvas.parentNode.clientWidth / canvas.parentNode.clientHeight;
  camera.updateProjectionMatrix();
});
