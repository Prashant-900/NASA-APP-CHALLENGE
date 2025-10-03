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
import { PLANET_FEATURE_MAPPING } from "../../constants/planetMapping";

function Planet3D({ planetData }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!planetData) return;

    // Identify dataset type
    const isPredictionData = planetData.model_type !== undefined;
    let datasetType = null;

    if (isPredictionData) {
      datasetType = planetData.model_type;
    } else {
      if (planetData.hostname !== undefined) datasetType = "k2";
      else if (planetData.toi !== undefined) datasetType = "toi";
      else if (planetData.kepler_name !== undefined) datasetType = "cum";
    }

    let planetRadius, planetWeight, planetName, planetDistance;

    if (isPredictionData) {
      const mapping =
        PLANET_FEATURE_MAPPING[datasetType] || PLANET_FEATURE_MAPPING.k2;
      planetRadius = planetData[mapping.radius] || planetData.pl_rade || 1;
      planetWeight = mapping.weight ? planetData[mapping.weight] : null;
      planetDistance = mapping.distance ? planetData[mapping.distance] : null;
      planetName = `Predicted ${
        planetData.prediction ? "Exoplanet" : "Non-Exoplanet"
      }`;
    } else if (datasetType && PLANET_FEATURE_MAPPING[datasetType]) {
      const mapping = PLANET_FEATURE_MAPPING[datasetType];
      planetRadius = planetData[mapping.radius] || null;
      planetWeight = mapping.weight ? planetData[mapping.weight] : null;
      planetDistance = mapping.distance ? planetData[mapping.distance] : null;
      planetName = planetData[mapping.name] || null;
    } else {
      planetRadius = 1;
      planetWeight = null;
      planetDistance = null;
      planetName = "Unknown Planet";
    }

    const earthRadius = 1;
    const earthWeight = 1;
    const earthName = "Earth";

    const textures = [
      texture_1,
      texture_2,
      texture_3,
      texture_4,
      texture_5,
      texture_6,
      texture_7,
      texture_8,
      texture_9,
    ];
    const randomTexture =
      textures[Math.floor(Math.random() * textures.length)];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const mount = mountRef.current;
    renderer.setSize(mount.clientWidth, mount.clientHeight);

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.margin = "0";
    canvas.style.padding = "0";
    canvas.style.border = "none";
    canvas.style.outline = "none";
    canvas.style.verticalAlign = "top";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    mount.appendChild(canvas);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 5);
    camera.add(directionalLight);
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earth);
    const exoplanetTexture = textureLoader.load(randomTexture);

    // Dimension + radius lines
    const createDimensionLine = (radius, posX) => {
      const group = new THREE.Group();

      // Solid white diameter through center
      const diameterGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-radius, 0, 0),
        new THREE.Vector3(radius, 0, 0),
      ]);
      const diameterMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const diameterLine = new THREE.Line(diameterGeometry, diameterMaterial);
      group.add(diameterLine);

      // Dashed line from center → left edge
      const leftRadiusGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-radius, 0, 0),
      ]);
      const leftRadiusMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.2,
        gapSize: 0.1,
      });
      const leftRadiusLine = new THREE.Line(
        leftRadiusGeometry,
        leftRadiusMaterial
      );
      leftRadiusLine.computeLineDistances();
      group.add(leftRadiusLine);

      // Dashed line from center → right edge
      const rightRadiusGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(radius, 0, 0),
      ]);
      const rightRadiusMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.2,
        gapSize: 0.1,
      });
      const rightRadiusLine = new THREE.Line(
        rightRadiusGeometry,
        rightRadiusMaterial
      );
      rightRadiusLine.computeLineDistances();
      group.add(rightRadiusLine);

      group.position.x = posX;
      return group;
    };

    // Text sprite
    const createTextSprite = (text, position) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 256;
      canvas.height = 64;
      ctx.fillStyle = "white";
      ctx.font = "28px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(2, 0.5, 1);
      return sprite;
    };

    // Add planet + labels + lines
    const addPlanet = (radius, weight, name, texture, posX) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 64, 64),
        new THREE.MeshPhongMaterial({ map: texture, shininess: 30 })
      );
      sphere.position.x = posX;
      scene.add(sphere);

      // Dimension line through center
      const dimensionLine = createDimensionLine(radius, posX);
      scene.add(dimensionLine);

      const nameLabel = createTextSprite(
        name || "Unknown",
        new THREE.Vector3(posX, radius + 0.5, 0)
      );
      scene.add(nameLabel);

      const massLabel = createTextSprite(
        `Mass: ${weight || "N/A"}${weight ? " Earth masses" : ""}`,
        new THREE.Vector3(posX, -(radius + 0.5), 0)
      );
      scene.add(massLabel);

      const radiusLabel = createTextSprite(
        `Radius: ${radius} Earth radii`,
        new THREE.Vector3(posX, 0.3, radius + 0.3)
      );
      scene.add(radiusLabel);
    };

    // Calculate positions
    const displayRadius = planetRadius || 1;
    const minDistance = earthRadius + displayRadius + 4;
    const earthPos = -minDistance / 2;
    const planetPos = minDistance / 2;

    addPlanet(earthRadius, earthWeight, earthName, earthTexture, earthPos);
    addPlanet(displayRadius, planetWeight, planetName, exoplanetTexture, planetPos);

    // Distance line (white, dashed)
    const distanceMargin = Math.max(earthRadius, displayRadius) + 0.8;
    const distanceGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(earthPos, -distanceMargin, 0),
      new THREE.Vector3(planetPos, -distanceMargin, 0),
    ]);
    const distanceMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.3,
      gapSize: 0.2,
    });
    const distanceLine = new THREE.Line(distanceGeometry, distanceMaterial);
    distanceLine.computeLineDistances();
    scene.add(distanceLine);

    // Vertical dashed line from Earth center to horizontal distance line
    const earthVerticalGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(earthPos, 0, 0),
      new THREE.Vector3(earthPos, -distanceMargin, 0),
    ]);
    const earthVerticalMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.3,
      gapSize: 0.2,
    });
    const earthVerticalLine = new THREE.Line(earthVerticalGeometry, earthVerticalMaterial);
    earthVerticalLine.computeLineDistances();
    scene.add(earthVerticalLine);

    // Vertical dashed line from Planet center to horizontal distance line
    const planetVerticalGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(planetPos, 0, 0),
      new THREE.Vector3(planetPos, -distanceMargin, 0),
    ]);
    const planetVerticalMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.3,
      gapSize: 0.2,
    });
    const planetVerticalLine = new THREE.Line(planetVerticalGeometry, planetVerticalMaterial);
    planetVerticalLine.computeLineDistances();
    scene.add(planetVerticalLine);

    if (planetDistance) {
      const distanceLabel = createTextSprite(
        `${planetDistance} pc`,
        new THREE.Vector3(
          (earthPos + planetPos) / 2,
          -distanceMargin - 0.5,
          0
        )
      );
      scene.add(distanceLabel);
    }

    // Fixed info labels
    const createFixedLabel = (text, x, y) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 40;
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 10, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(x, y, -5);
      sprite.scale.set(3, 0.3, 1);
      camera.add(sprite);
      return sprite;
    };

    createFixedLabel("Distance: Earth to Host Star", 2.5, 1.8);
    createFixedLabel("Exoplanet texture: Random", 2.5, 1.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.enableZoom = true;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mount && mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [planetData]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        display: "block",
        border: "none",
        outline: "none",
        overflow: "hidden",
        lineHeight: 0,
        boxSizing: "border-box",
      }}
    />
  );
}

export default Planet3D;