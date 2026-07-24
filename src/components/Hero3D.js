import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Main glowing shape
    const geometry = new THREE.IcosahedronGeometry(1.6, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff4b3e,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0xff4b3e,
      emissiveIntensity: 0.25,
      flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Wireframe overlay for a "tech" look
    const wireGeometry = new THREE.IcosahedronGeometry(1.65, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireMesh);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const point1 = new THREE.PointLight(0xffffff, 1.2);
    point1.position.set(5, 5, 5);
    scene.add(point1);
    const point2 = new THREE.PointLight(0x2a9d8f, 0.8);
    point2.position.set(-5, -3, 2);
    scene.add(point2);

    // Mouse-based parallax rotation
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let frameId;
    const animate = () => {
      mesh.rotation.y += 0.004;
      mesh.rotation.x += 0.0015;
      wireMesh.rotation.y += 0.004;
      wireMesh.rotation.x += 0.0015;

      // Gentle parallax toward mouse
      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

export default Hero3D;