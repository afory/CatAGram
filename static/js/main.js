// main.js

import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

export default class Viewer3D {

    constructor(containerId, modelUrl, options = {}) {
        this.container = document.getElementById(containerId);
        this.modelUrl = modelUrl;
        this.options = options;

        if (!this.container) {
            console.error(`No se encontró el contenedor con el ID: ${containerId}`);
            return;
        }

        // --- NUEVO: Buscar el spinner y preparar el canvas ---
        this.loadingSpinner = this.container.querySelector('.loading-spinner');
        
        this.init();
    }

    init() {
        // --- NUEVO: Crear un LoadingManager ---
        this.loadingManager = new THREE.LoadingManager(
            // onLoad: se ejecuta cuando todo está cargado
            () => {
                if (this.loadingSpinner) {
                    this.loadingSpinner.style.display = 'none';
                }
                // Hacemos visible el canvas con una suave transición
                this.renderer.domElement.style.opacity = 1;
                console.log("All assets loaded successfully.");
            },
            // onProgress: se ejecuta mientras se carga
            (url, itemsLoaded, itemsTotal) => {
                const progress = (itemsLoaded / itemsTotal) * 100;
                console.log(`Loading file: ${url} (${progress.toFixed(2)}%)`);
            },
            // onError: se ejecuta si hay un error
            (url) => {
                console.error('Hubo un error al cargar ' + url);
                if (this.loadingSpinner) {
                    this.loadingSpinner.textContent = 'Error';
                }
            }
        );

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.z = this.options.initialZoom || 25;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // --- NUEVO: Ocultar el canvas al principio ---
        this.renderer.domElement.style.opacity = 0;
        this.renderer.domElement.style.transition = 'opacity .5s';
        
        this.container.appendChild(this.renderer.domElement);

        this.addLights();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.loadModel();
        this.animate();
        window.addEventListener("resize", () => this.onWindowResize());
    }
    
    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(2, 5, 5);
        this.scene.add(directionalLight);
    }

    loadModel() {
        // --- NUEVO: Pasar el manager al loader ---
        const loader = new GLTFLoader(this.loadingManager); 
        loader.load(
            this.modelUrl,
            (gltf) => {
                const object = gltf.scene;

                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);
                this.controls.target.set(0, 0, 0);

                if (this.options.initialRotation) {
                    object.rotation.y = this.options.initialRotation.y || 0;
                    object.rotation.x = this.options.initialRotation.x || 0;
                    object.rotation.z = this.options.initialRotation.z || 0;
                }

                this.scene.add(object);
            },
            undefined,
            (error) => { /* El onError del manager ya lo maneja */ }
        );
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}