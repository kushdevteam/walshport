import { useFrame } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import SafeModel, { ModelFallback } from "./SafeModel";

interface SpaceStationProps {
  position: [number, number, number];
}

export default function SpaceStation({ position }: SpaceStationProps) {
  const mainRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (mainRef.current) {
      // Main station rotation
      mainRef.current.rotation.y += 0.005;
      mainRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Scale effect when hovered
      const targetScale = hovered ? 1.1 : 1;
      mainRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      {/* 3D Space Station Model */}
      <group 
        ref={mainRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <SafeModel 
          url="/models/space_station.glb"
          scale={[2.5, 2.5, 2.5]}
          fallback={<ModelFallback color="#4fd1c7" scale={[2.5, 2.5, 2.5]} />}
        >
          {() => null}
        </SafeModel>
      </group>

      {/* Holographic title */}
      <Suspense fallback={null}>
        <Text
          position={[0, 4, 0]}
          fontSize={0.8}
          color="#4fd1c7"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          WLSFX
        </Text>

        <Text
          position={[0, 3.2, 0]}
          fontSize={0.3}
          color="#9f7aea"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          Web3 & Game Developer Portfolio
        </Text>
      </Suspense>

      {/* Floating particles around station */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 5;
        return (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle) * radius, 
              Math.sin(angle * 0.5) * 2, 
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color="#4fd1c7" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Model is loaded safely by SafeModel component
