import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface HolographicTextProps {
  children: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: string;
  maxWidth?: number;
}

export default function HolographicText({
  children,
  position = [0, 0, 0],
  fontSize = 0.5,
  color = "#4fd1c7",
  maxWidth
}: HolographicTextProps) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current && textRef.current.material) {
      // Holographic flicker effect
      const flickerIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
      const material = Array.isArray(textRef.current.material) 
        ? textRef.current.material[0] 
        : textRef.current.material;
      if ('opacity' in material) {
        material.opacity = flickerIntensity;
      }
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      font="/fonts/inter.json"
      maxWidth={maxWidth}
    >
      {children}
    </Text>
  );
}
