import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

function Hero3DText({ text = 'Cravio' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const point1 = new THREE.PointLight(0xffffff, 1.5);
    point1.position.set(5, 5, 10);
    scene.add(point1);
    const point2 = new THREE.PointLight(0xff4b3e, 1, 20);
    point2.position.set(-5, -2, 5);
    scene.add(point2);

    let textMesh;
    const loader = new FontLoader();
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      (font) => {
        const geometry = new TextGeometry(text, {
          font,
          size: 2.2,
          height: 0.6,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.08,
          bevelSize: 0.05,
          bevelSegments: 5
        });
        geometry.center(); // center the text at origin

        const material = new THREE.MeshStandardMaterial({
          color: 0xff4b3e,
          metalness: 0.4,
          roughness: 0.25
        });

        textMesh = new THREE.Mesh(geometry, material);
        scene.add(textMesh);
      }
    );

    let mouseX = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let frameId;
    const animate = () => {
      if (textMesh) {
        textMesh.rotation.y += (mouseX * 0.4 - textMesh.rotation.y) * 0.04;
        textMesh.rotation.x = Math.sin(Date.now() * 0.0006) * 0.08;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [text]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

export default Hero3DText;