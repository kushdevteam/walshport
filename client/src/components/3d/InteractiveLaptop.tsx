import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

interface InteractiveLaptopProps {
  position: [number, number, number];
  project: {
    id: number;
    title: string;
    description: string;
    tech: string[];
    color: string;
    type: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function InteractiveLaptop({ 
  position, 
  project, 
  isSelected, 
  onClick 
}: InteractiveLaptopProps) {
  const laptopRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (laptopRef.current) {
      // Floating animation
      laptopRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Gentle rotation
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    if (screenRef.current && screenRef.current.material) {
      // Screen glow animation
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      const intensity = isSelected ? 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2 : 0.3;
      material.emissiveIntensity = intensity;
    }
  });

  return (
    <group 
      ref={laptopRef} 
      position={position}
      onClick={onClick}
      onPointerOver={() => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Laptop Base */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.2, 2]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Laptop Screen */}
      <mesh position={[0, 0.8, -0.9]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[3, 1.8, 0.1]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Screen Display */}
      <mesh 
        ref={screenRef}
        position={[0, 0.8, -0.85]} 
        rotation={[-0.2, 0, 0]}
      >
        <planeGeometry args={[2.6, 1.5]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Project Title on Screen */}
      <Text
        position={[0, 1.2, -0.8]}
        rotation={[-0.2, 0, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
        maxWidth={2.4}
      >
        {project.title}
      </Text>

      {/* Project Type Indicator */}
      <Text
        position={[0, 0.5, -0.8]}
        rotation={[-0.2, 0, 0]}
        fontSize={0.1}
        color={project.color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {project.type.toUpperCase()}
      </Text>

      {/* Keyboard */}
      <mesh position={[0, 0.02, 0.3]} castShadow>
        <boxGeometry args={[2.4, 0.05, 1]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.05, 0.6]} castShadow>
        <boxGeometry args={[1, 0.02, 0.6]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Hover/Selection Effects */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[2, 2, 0.1, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Project Label */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {project.title}
      </Text>

      {/* Selected Project Details */}
      {isSelected && (
        <group position={[0, -1.5, 0]}>
          <mesh>
            <planeGeometry args={[4, 1.5]} />
            <meshBasicMaterial 
              color="#1a202c" 
              transparent 
              opacity={0.9} 
            />
          </mesh>
          
          <Text
            position={[0, 0.3, 0.01]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
            maxWidth={3.5}
          >
            {project.description}
          </Text>

          <Text
            position={[0, 0, 0.01]}
            fontSize={0.1}
            color={project.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            Tech Stack: {project.tech.join(', ')}
          </Text>

          <Text
            position={[0, -0.3, 0.01]}
            fontSize={0.08}
            color="#9f7aea"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            Click to view live demo
          </Text>
        </group>
      )}
    </group>
  );
}