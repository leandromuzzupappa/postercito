import * as THREE from "three";
import { gsap } from "gsap";
import { Audio } from "./Audio";
import { vertexShaderData, fragmentShaderData } from "./shaders";

export class Experience {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    // prettier-ignore
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.camera.lookAt(new THREE.Vector3());
    this.camera.updateProjectionMatrix();

    // prettier-ignore
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });

    this.config = {};

    this.audio = new Audio();

    this.setLights();
    this.setObjects();
    this.loop();

    this.resize();
    this.getNote();
  }

  setLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);
  }

  setObjects() {
    this.uniforms = {
      uTime: { value: 1 },
      uAmplitude: { value: 1 },
      uFrequency: { value: 2 },
    };

    this.gometry = new THREE.SphereGeometry(1.5, 1000, 1000);
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragmentShaderData,
      vertexShader: vertexShaderData,
      uniforms: this.uniforms,
    });

    this.mesh = new THREE.Mesh(this.gometry, this.material);
    this.randMesh = this.mesh.clone();
    this.scene.add(this.mesh);
  }

  loop() {
    window.requestAnimationFrame(this.loop.bind(this));

    this.uniforms.uTime.value = this.clock.getElapsedTime() * 2;

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.camera.aspect = this.canvas.width / this.canvas.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.width, this.canvas.height, false);
    });
  }

  getNote() {
    window.addEventListener("note", (e) => {
      console.log("pepitos", e);

      this.mesh.rotation.x += 2.01;
      this.mesh.rotation.y += 2.01;

      this.randMesh.remove();

      this.randMesh.position.x = Math.random() * 10 - 5;
      this.randMesh.position.y = Math.random() * 10 - 5;
      this.randMesh.position.z = Math.random() * 10 - 5;

      this.scene.add(this.randMesh);

      gsap.to(this.uniforms.uFrequency, {
        duration: 1.2,
        value: (e.detail.frequency / Math.PI / 2) * 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(this.uniforms.uFrequency, {
            duration: 1,
            value: 0,
            ease: "power2.out",
          });
        },
      });
    });
  }
}
