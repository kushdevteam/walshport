import { useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

interface ArcadeCabinetProps {
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

export default function ArcadeCabinet({ 
  position, 
  project, 
  isSelected, 
  onClick 
}: ArcadeCabinetProps) {
  const cabinetRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Load the gallery cubes 3D model
  const { scene } = useGLTF('/models/gallery_cubes.glb');
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (cabinetRef.current) {
      // Subtle floating animation
      cabinetRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    }

    if (cubeRef.current) {
      // Game cube special rotation pattern
      cubeRef.current.rotation.y += 0.015;
      cubeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
      
      // Scale effect when selected or hovered (more dramatic for games)
      const targetScale = isSelected ? 1.4 : isHovered ? 1.2 : 1;
      cubeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group 
      ref={cabinetRef} 
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
      {/* Game Gallery Cube 3D Model */}
      <group 
        ref={cubeRef}
        scale={[1.8, 1.8, 1.8]}
        position={[0, 0, 0]}
      >
        <primitive 
          object={clonedScene} 
          castShadow 
          receiveShadow
        />
      </group>

      {/* Game Information Display */}
      <group position={[0, 2.5, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.25}
          color={project.color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
          maxWidth={3}
        >
          {project.title}
        </Text>

        <Text
          position={[0, -0.4, 0]}
          fontSize={0.15}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          {project.type.toUpperCase()} GAME
        </Text>

        {/* Retro game indicator */}
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.1}
          color="#ffff00"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          ► PRESS START TO PLAY ◄
        </Text>
      </group>

      {/* Hover/Selection Effects */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[2.5, 2.5, 0.1, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {/* Pixelated energy effects for games */}
      {(isHovered || isSelected) && (
        <group>
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={i} position={[0, i * 0.8 - 1.5, 0]} rotation={[0, i * Math.PI * 0.25, 0]}>
              <torusGeometry args={[2 + i * 0.2, 0.08, 4, 8]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? project.color : "#00ff00"}
                transparent
                opacity={0.5 - i * 0.1}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Expanded Game Details */}
      {isSelected && (
        <group position={[0, -3, 0]}>
          {/* Retro-style info panel */}
          <mesh>
            <planeGeometry args={[5.5, 2.2]} />
            <meshBasicMaterial 
              color="#000000" 
              transparent 
              opacity={0.9} 
            />
          </mesh>
          
          {/* Pixelated border effect */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[5.6, 2.3]} />
            <meshBasicMaterial 
              color={project.color} 
              transparent 
              opacity={0.4} 
            />
          </mesh>
          
          <Text
            position={[0, 0.6, 0.01]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
            maxWidth={5}
          >
            {project.description}
          </Text>

          <Text
            position={[0, 0.1, 0.01]}
            fontSize={0.11}
            color={project.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            ENGINE: {project.tech.join(' | ')}
          </Text>

          <Text
            position={[0, -0.4, 0.01]}
            fontSize={0.1}
            color="#00ff00"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            ♦ INSERT COIN TO CONTINUE ♦
          </Text>
        </group>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/gallery_cubes.glb');