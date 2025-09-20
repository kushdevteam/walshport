import { useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo, Suspense } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface SpaceStationProps {
  position: [number, number, number];
}

export default function SpaceStation({ position }: SpaceStationProps) {
  const mainRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const [hovered, setHovered] = useState(false);

  // Pre-calculate random values for rings
  const ringData = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      radius: 2 + i * 0.5,
      speed: 0.01 + i * 0.005,
      offset: (i * Math.PI) / 3,
    }));
  }, []);

  useFrame((state) => {
    if (mainRef.current) {
      // Main station rotation
      mainRef.current.rotation.y += 0.005;
      mainRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Rotating rings
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        const data = ringData[i];
        ring.rotation.z += data.speed;
        ring.rotation.x = Math.sin(state.clock.elapsedTime + data.offset) * 0.2;
      }
    });
  });

  return (
    <group position={position}>
      {/* Main station body */}
      <group ref={mainRef}>
        {/* Central core */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color={hovered ? "#4fd1c7" : "#2d3748"}
            metalness={0.8}
            roughness={0.2}
            emissive={hovered ? "#1a202c" : "#000"}
          />
        </mesh>

        {/* Station details */}
        <mesh position={[0, 0, 1.6]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.8, 8]} />
          <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0} />
        </mesh>
      </group>

      {/* Rotating rings */}
      {ringData.map((data, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) ringRefs.current[i] = el;
          }}
          position={[0, 0, 0]}
        >
          <torusGeometry args={[data.radius, 0.1, 8, 32]} />
          <meshStandardMaterial
            color="#4fd1c7"
            metalness={0.5}
            roughness={0.3}
            emissive="#0d4d4a"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Holographic title */}
      <Suspense fallback={null}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.8}
          color="#4fd1c7"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          WLSFX
        </Text>

        <Text
          position={[0, 2.2, 0]}
          fontSize={0.3}
          color="#9f7aea"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          Web3 & Game Developer Portfolio
        </Text>
      </Suspense>
    </group>
  );
}
