import { useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
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
  const cubeRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Load the gallery cubes 3D model
  const { scene } = useGLTF('/models/gallery_cubes.glb');
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (laptopRef.current) {
      // Floating animation
      laptopRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Gentle rotation
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    if (cubeRef.current) {
      // Gallery cube rotation and expansion
      cubeRef.current.rotation.y += 0.01;
      cubeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Scale effect when selected or hovered
      const targetScale = isSelected ? 1.3 : isHovered ? 1.1 : 1;
      cubeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
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
      {/* Gallery Cube 3D Model */}
      <group 
        ref={cubeRef}
        scale={[1.5, 1.5, 1.5]}
        position={[0, 0, 0]}
      >
        <primitive 
          object={clonedScene} 
          castShadow 
          receiveShadow
        />
      </group>

      {/* Project Information Display */}
      <group position={[0, 2, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.2}
          color={project.color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
          maxWidth={3}
        >
          {project.title}
        </Text>

        <Text
          position={[0, -0.3, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          {project.type.toUpperCase()}
        </Text>
      </group>

      {/* Hover/Selection Effects */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[2, 2, 0.1, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Holographic energy rings around cube */}
      {(isHovered || isSelected) && (
        <group>
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={i} position={[0, i * 0.5 - 1, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[1.5 + i * 0.3, 0.05, 8, 32]} />
              <meshBasicMaterial
                color={project.color}
                transparent
                opacity={0.4 - i * 0.1}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Expanded Project Details */}
      {isSelected && (
        <group position={[0, -2.5, 0]}>
          {/* Holographic info panel */}
          <mesh>
            <planeGeometry args={[5, 2]} />
            <meshBasicMaterial 
              color="#1a202c" 
              transparent 
              opacity={0.8} 
            />
          </mesh>
          
          {/* Glowing border */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[5.1, 2.1]} />
            <meshBasicMaterial 
              color={project.color} 
              transparent 
              opacity={0.3} 
            />
          </mesh>
          
          <Text
            position={[0, 0.5, 0.01]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
            maxWidth={4.5}
          >
            {project.description}
          </Text>

          <Text
            position={[0, 0, 0.01]}
            fontSize={0.11}
            color={project.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            Tech Stack: {project.tech.join(', ')}
          </Text>

          <Text
            position={[0, -0.5, 0.01]}
            fontSize={0.09}
            color="#4fd1c7"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            ▶ Click to explore interactive demo
          </Text>
        </group>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/gallery_cubes.glb');