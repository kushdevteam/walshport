import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function StarField() {
  const starsRef = useRef<THREE.Points>(null);

  // Pre-calculate star positions
  const { positions, colors } = useMemo(() => {
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere
      const radius = Math.random() * 100 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random star colors (blue to purple to white)
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        // Blue stars
        colors[i3] = 0.3 + Math.random() * 0.4;
        colors[i3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i3 + 2] = 1;
      } else if (colorChoice < 0.6) {
        // Purple stars
        colors[i3] = 0.6 + Math.random() * 0.4;
        colors[i3 + 1] = 0.4 + Math.random() * 0.3;
        colors[i3 + 2] = 0.8 + Math.random() * 0.2;
      } else {
        // White stars
        const brightness = 0.8 + Math.random() * 0.2;
        colors[i3] = brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = brightness;
      }
    }

    return { positions, colors };
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
      starsRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}
