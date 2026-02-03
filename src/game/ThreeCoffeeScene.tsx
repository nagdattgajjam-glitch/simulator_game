import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGameStore } from "../store/gameStore";

const SCENE_HEIGHT = 420;

export const ThreeCoffeeScene = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const clickCoffee = useGameStore((state) => state.clickCoffee);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f3ebe2");

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 4.2, 8);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(4, 6, 2);
    scene.add(sun);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 12),
      new THREE.MeshStandardMaterial({ color: 0xe4d3c2 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 6),
      new THREE.MeshStandardMaterial({ color: 0xf9f5f1 })
    );
    backWall.position.set(0, 3, -4);
    scene.add(backWall);

    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(6, 1, 2),
      new THREE.MeshStandardMaterial({ color: 0xa67755 })
    );
    counter.position.set(0, 0.5, -1);
    scene.add(counter);

    const cupGroup = new THREE.Group();
    const cupBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.55, 1, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    cupBody.position.y = 1.1;
    cupGroup.add(cupBody);

    const coffee = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.46, 0.2, 24),
      new THREE.MeshStandardMaterial({ color: 0x5b3d2a })
    );
    coffee.position.y = 1.6;
    cupGroup.add(coffee);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.25, 0.08, 12, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0.55, 1.2, 0);
    cupGroup.add(handle);

    const steamMaterial = new THREE.MeshStandardMaterial({ color: 0xf3ebe2 });
    const steam1 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 16), steamMaterial);
    steam1.position.set(-0.2, 2.2, 0);
    const steam2 = steam1.clone();
    steam2.position.set(0.2, 2.3, 0);
    cupGroup.add(steam1, steam2);

    cupGroup.position.set(0, 0.2, -1);
    cupGroup.name = "cup";
    scene.add(cupGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pulse = 0;

    const onPointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(cupGroup, true);
      if (hits.length > 0) {
        clickCoffee();
        pulse = 0.25;
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    mount.appendChild(renderer.domElement);

    const resize = () => {
      const width = mount.clientWidth;
      const height = SCENE_HEIGHT;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      steam1.rotation.y += delta * 0.6;
      steam2.rotation.y -= delta * 0.4;
      if (pulse > 0) {
        const scale = 1 + pulse;
        cupGroup.scale.set(scale, scale, scale);
        pulse = Math.max(0, pulse - delta * 0.6);
      } else {
        cupGroup.scale.set(1, 1, 1);
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [clickCoffee]);

  return (
    <div
      ref={mountRef}
      className="w-full overflow-hidden rounded-3xl border border-coffee-200 shadow-lg"
    />
  );
};
