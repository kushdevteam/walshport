import { useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { portfolioData } from "../../lib/constants/portfolioData";

export default function AboutTerminal() {
  const terminalRef = useRef<THREE.Group>(null);
  const avatarRef = useRef<THREE.Group>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullText = portfolioData.about.description;
  
  // Load the avatar terminal 3D model
  const { scene } = useGLTF('/models/avatar_terminal.glb');
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  useFrame((state) => {
    if (terminalRef.current) {
      terminalRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      terminalRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    
    if (avatarRef.current) {
      // Additional floating animation for the avatar
      avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      avatarRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={terminalRef} position={[8, 0, 0]}>
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#4fd1c7"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        ABOUT
      </Text>

      {/* Avatar Terminal 3D Model */}
      <group 
        ref={avatarRef}
        scale={[2.5, 2.5, 2.5]}
        position={[0, 0, 0]}
      >
        <primitive 
          object={clonedScene} 
          castShadow 
          receiveShadow
        />
      </group>

      {/* Holographic text display overlay */}
      <group position={[0, 1, 2]}>

        {/* Terminal prompt */}
        <Text
          position={[-2, 1, 0]}
          fontSize={0.15}
          color="#4fd1c7"
          anchorX="left"
          anchorY="top"
          font="/fonts/inter.json"
        >
          user@wlsfx:~$ cat about.txt
        </Text>

        {/* About content with typewriter effect */}
        <Text
          position={[-2, 0.5, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          font="/fonts/inter.json"
          maxWidth={4}
        >
          {displayedText}
          {currentIndex < fullText.length && (
            <Text
              position={[0, 0, 0]}
              fontSize={0.12}
              color="#4fd1c7"
              anchorX="left"
              anchorY="top"
              font="/fonts/inter.json"
            >
              ▋
            </Text>
          )}
        </Text>

        {/* Developer details */}
        <Text
          position={[-2, -0.5, 0]}
          fontSize={0.1}
          color="#9f7aea"
          anchorX="left"
          anchorY="top"
          font="/fonts/inter.json"
        >
          Experience: {portfolioData.about.experience}
        </Text>

        <Text
          position={[-2, -0.8, 0]}
          fontSize={0.1}
          color="#9f7aea"
          anchorX="left"
          anchorY="top"
          font="/fonts/inter.json"
        >
          Location: {portfolioData.about.location}
        </Text>
      </group>

      {/* Particle effects around avatar */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 3;
        return (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle) * radius, 
              Math.sin(angle * 0.8) * 1.5, 
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial 
              color="#4fd1c7" 
              transparent 
              opacity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/avatar_terminal.glb');
