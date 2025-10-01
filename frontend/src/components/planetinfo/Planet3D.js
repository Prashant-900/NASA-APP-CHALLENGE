import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earth from "../../assets/earth.jpg";
import texture_1 from "../../assets/texture_1.jpg";
import texture_2 from "../../assets/texture_2.jpg";
import texture_3 from "../../assets/texture_3.jpg";
import texture_4 from "../../assets/texture_4.jpg";
import texture_5 from "../../assets/texture_5.jpg";
import texture_6 from "../../assets/texture_6.jpg";
import texture_7 from "../../assets/texture_7.jpg";
import texture_8 from "../../assets/texture_8.jpg";
import texture_9 from "../../assets/texture_9.jpg";

function Planet3D({ planetData }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!planetData) return;

    // Get dataset type and planet properties
    const isK2 = planetData.pl_rade !== undefined;
    const isTOI = planetData.pl_eqt !== undefined;
    const isCUM = planetData.koi_prad !== undefined;
    
    let planetRadius, planetName;
    if (isK2) {
      planetRadius = planetData.pl_rade || 1;
      planetName = planetData.pl_name || "Unknown Planet";
    } else if (isTOI) {
      planetRadius = planetData.pl_rade || 1;
      planetName = planetData.pl_name || "Unknown Planet";
    } else if (isCUM) {
      planetRadius = planetData.koi_prad || 1;
      planetName = planetData.kepler_name || "Unknown Planet";
    }
    
    // Random texture selection
    const textures = [texture_1, texture_2, texture_3, texture_4, texture_5, texture_6, texture_7, texture_8, texture_9];
    const randomTexture = textures[Math.floor(Math.random() * textures.length)];
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // soft ambient
    scene.add(ambientLight);

    // Directional light attached to camera
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 5); // in front of camera
    camera.add(directionalLight);
    scene.add(camera); // camera already in scene, adding light moves with it

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earth);
    const exoplanetTexture = textureLoader.load(randomTexture);

    // Earth
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 50,
    });
    const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
    earthSphere.position.x = -2.5;
    scene.add(earthSphere);

    // Exoplanet
    const exoplanetGeometry = new THREE.SphereGeometry(planetRadius, 64, 64);
    const exoplanetMaterial = new THREE.MeshPhongMaterial({
      map: exoplanetTexture,
      shininess: 30,
    });
    const exoplanetSphere = new THREE.Mesh(exoplanetGeometry, exoplanetMaterial);
    exoplanetSphere.position.x = 2.5;
    scene.add(exoplanetSphere);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      earthSphere.rotation.y += 0.002;
      exoplanetSphere.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      earthGeometry.dispose();
      earthMaterial.dispose();
      exoplanetGeometry.dispose();
      exoplanetMaterial.dispose();
      renderer.dispose();
    };
  }, [planetData]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}

export default Planet3D;
