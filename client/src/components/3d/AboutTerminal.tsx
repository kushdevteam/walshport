import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { portfolioData } from "../../lib/constants/portfolioData";

export default function AboutTerminal() {
  const terminalRef = useRef<THREE.Group>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullText = portfolioData.about.description;

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
  });

  return (
    <group ref={terminalRef} position={[8, 0, 0]}>
      <Text
        position={[0, 3, 0]}
        fontSize={1}
        color="#4fd1c7"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        ABOUT
      </Text>

      {/* Terminal body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 0.5]} />
        <meshStandardMaterial
          color="#1a202c"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Terminal screen */}
      <mesh position={[0, 0, 0.26]}>
        <planeGeometry args={[4.5, 2.5]} />
        <meshBasicMaterial color="#000" />
      </mesh>

      {/* Screen glow */}
      <mesh position={[0, 0, 0.27]}>
        <planeGeometry args={[4.6, 2.6]} />
        <meshBasicMaterial
          color="#4fd1c7"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Terminal prompt */}
      <Text
        position={[-2, 1, 0.28]}
        fontSize={0.15}
        color="#4fd1c7"
        anchorX="left"
        anchorY="top"
        font="/fonts/inter.json"
      >
        user@wlsfx:~$ cat about.txt
      </Text>

      {/* About content */}
      <Text
        position={[-2, 0.5, 0.28]}
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

      {/* Terminal details */}
      <Text
        position={[-2, -1, 0.28]}
        fontSize={0.1}
        color="#9f7aea"
        anchorX="left"
        anchorY="top"
        font="/fonts/inter.json"
      >
        Experience: {portfolioData.about.experience}
      </Text>

      <Text
        position={[-2, -1.3, 0.28]}
        fontSize={0.1}
        color="#9f7aea"
        anchorX="left"
        anchorY="top"
        font="/fonts/inter.json"
      >
        Location: {portfolioData.about.location}
      </Text>

      {/* Terminal stand */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 8]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Avatar representation */}
      <mesh position={[1.5, 1, 0.28]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#4fd1c7" transparent opacity={0.3} />
      </mesh>

      <mesh position={[1.5, 1, 0.29]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#9f7aea" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
