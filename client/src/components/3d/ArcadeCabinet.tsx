import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useState } from "react";
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
  const screenRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (cabinetRef.current) {
      // Subtle floating animation
      cabinetRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    }

    if (screenRef.current && screenRef.current.material) {
      // Screen scanline effect
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      const intensity = isSelected 
        ? 0.6 + Math.sin(state.clock.elapsedTime * 8) * 0.3 
        : 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      material.emissiveIntensity = intensity;
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
      {/* Cabinet Base */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 3, 1.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Cabinet Top */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.2, 0.4, 1.7]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Screen Bezel */}
      <mesh position={[0, 0.5, 0.76]} castShadow>
        <boxGeometry args={[1.8, 1.4, 0.2]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Screen */}
      <mesh 
        ref={screenRef}
        position={[0, 0.5, 0.87]}
      >
        <planeGeometry args={[1.5, 1.1]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Game Title on Screen */}
      <Text
        position={[0, 0.8, 0.88]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
        maxWidth={1.3}
      >
        {project.title}
      </Text>

      {/* Game Type */}
      <Text
        position={[0, 0.2, 0.88]}
        fontSize={0.08}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {project.type.toUpperCase()} GAME
      </Text>

      {/* Control Panel */}
      <mesh position={[0, -0.3, 0.5]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.8, 0.3]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Joystick */}
      <mesh position={[-0.4, -0.2, 0.65]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Joystick Ball */}
      <mesh position={[-0.4, -0.05, 0.65]} castShadow>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial
          color="#ff6b6b"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Action Buttons */}
      {[0.2, 0.5, 0.8].map((xPos, i) => (
        <mesh key={i} position={[xPos, -0.25, 0.65]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial
            color={i === 0 ? "#4fd1c7" : i === 1 ? "#9f7aea" : "#f093fb"}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Coin Slot */}
      <mesh position={[0.7, 0.8, 0.76]}>
        <boxGeometry args={[0.2, 0.05, 0.1]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Coin Slot Label */}
      <Text
        position={[0.7, 0.9, 0.88]}
        fontSize={0.06}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        INSERT COIN
      </Text>

      {/* Hover/Selection Effects */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -2, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Cabinet Label */}
      <Text
        position={[0, -2.5, 0]}
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
        <group position={[0, -3, 0]}>
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
            Built with: {project.tech.join(', ')}
          </Text>

          <Text
            position={[0, -0.3, 0.01]}
            fontSize={0.08}
            color="#00ff00"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            PRESS START TO PLAY
          </Text>
        </group>
      )}
    </group>
  );
}