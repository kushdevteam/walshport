import { OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#4fd1c7" />

      {/* Main scene group */}
      <group ref={groupRef}>
        {/* Central spinning cube */}
        <mesh ref={cubeRef} position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#4fd1c7" />
        </mesh>

        {/* Title text */}
        <Text
          position={[0, 3, 0]}
          fontSize={1}
          color="#4fd1c7"
          anchorX="center"
          anchorY="middle"
        >
          WLSFX
        </Text>

        {/* Subtitle */}
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color="#9f7aea"
          anchorX="center"
          anchorY="middle"
        >
          3D Portfolio Loading...
        </Text>

        {/* Simple star field - stationary points */}
        {Array.from({ length: 100 }).map((_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
          ]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="white" />
          </mesh>
        ))}
      </group>

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}
