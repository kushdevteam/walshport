import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface HeartModelProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
}

export default function HeartModel({ 
  position, 
  scale = 1, 
  color = "#ff6b6b" 
}: HeartModelProps) {
  const heartRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/geometries/heart.gltf");

  useFrame((state) => {
    if (heartRef.current) {
      // Gentle floating animation
      heartRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Gentle rotation
      heartRef.current.rotation.y += 0.01;
      
      // Pulsing scale effect
      const pulseScale = scale + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      heartRef.current.scale.setScalar(pulseScale);
    }
  });

  return (
    <group ref={heartRef} position={position}>
      <primitive 
        object={scene.clone()} 
        scale={scale}
      />
    </group>
  );
}

useGLTF.preload("/geometries/heart.gltf");