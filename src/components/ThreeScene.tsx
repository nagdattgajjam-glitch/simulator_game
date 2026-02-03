import { useEffect, useRef } from "react";
import * as THREE from "three";

export const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(240, 240);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1.2, 0.8, 1.2);
    const material = new THREE.MeshStandardMaterial({ color: 0xa67755 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(4, 4, 4);
    scene.add(light);

    let animationFrameId = 0;
    const animate = () => {
      cube.rotation.y += 0.01;
      cube.rotation.x += 0.005;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="rounded-2xl border border-coffee-200 bg-white/70 p-2" />;
};
