const canvas = document.querySelector("canvas.pepitos");
const stepBackground = document.querySelector(".step-background");

const rendererSize = {
  width: 1080,
  height: 1920,
};

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
});
renderer.setSize(rendererSize.width, rendererSize.height, false);
renderer.setClearColor(0x000000, 1);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

/* Steps */
stepBackground.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    renderer.setClearColor(button.dataset.color, 1);
  });
});

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect =
    canvas.parentNode.clientWidth / canvas.parentNode.clientHeight;
  camera.updateProjectionMatrix();
});
