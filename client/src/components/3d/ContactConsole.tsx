import { useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { portfolioData } from "../../lib/constants/portfolioData";

export default function ContactConsole() {
  const consoleRef = useRef<THREE.Group>(null);
  const commandConsoleRef = useRef<THREE.Group>(null);
  const buttonRefs = useRef<THREE.Mesh[]>([]);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  
  // Load the command console 3D model
  const { scene } = useGLTF('/models/command_console.glb');
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Pre-calculate button positions for the futuristic console
  const buttonPositions = useMemo(() => {
    return portfolioData.contact.map((_, i) => ({
      x: (i - portfolioData.contact.length / 2) * 1.2,
      y: 1.5,
      z: 2
    }));
  }, []);

  useFrame((state) => {
    if (consoleRef.current) {
      consoleRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    if (commandConsoleRef.current) {
      // Console subtle animation
      commandConsoleRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      commandConsoleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }

    buttonRefs.current.forEach((button, i) => {
      if (button) {
        const targetScale = selectedButton === i ? 1.3 : 1;
        button.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        
        // Floating button animation
        button.position.y = buttonPositions[i].y + Math.sin(state.clock.elapsedTime + i) * 0.05;
      }
    });
  });

  const handleButtonClick = (contact: any) => {
    if (contact.type === 'email') {
      window.location.href = `mailto:${contact.value}`;
    } else {
      window.open(contact.value, '_blank');
    }
  };

  return (
    <group ref={consoleRef} position={[0, 0, -8]}>
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#4ecdc4"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        CONTACT
      </Text>

      {/* Command Console 3D Model */}
      <group 
        ref={commandConsoleRef}
        scale={[2.5, 2.5, 2.5]}
        position={[0, 0, 0]}
      >
        <primitive 
          object={clonedScene} 
          castShadow 
          receiveShadow
        />
      </group>

      {/* Holographic interface display */}
      <group position={[0, 2, 2]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="#4ecdc4"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          COMMUNICATION TERMINAL
        </Text>

        <Text
          position={[0, 0.1, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          Select a communication channel:
        </Text>
      </group>

      {/* Enhanced Futuristic Contact Buttons */}
      {portfolioData.contact.map((contact, i) => {
        const pos = buttonPositions[i];
        return (
          <group key={i} position={[pos.x, pos.y, pos.z]}>
            {/* Main interactive button */}
            <mesh
              ref={(el) => {
                if (el) buttonRefs.current[i] = el;
              }}
              onClick={() => handleButtonClick(contact)}
              onPointerOver={() => {
                setSelectedButton(i);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setSelectedButton(null);
                document.body.style.cursor = 'default';
              }}
              castShadow
            >
              <dodecahedronGeometry args={[0.3]} />
              <meshStandardMaterial
                color={contact.color}
                emissive={contact.color}
                emissiveIntensity={selectedButton === i ? 0.8 : 0.4}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Holographic button ring */}
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[0.5, 0.05, 8, 32]} />
              <meshBasicMaterial
                color={contact.color}
                transparent
                opacity={selectedButton === i ? 0.8 : 0.4}
              />
            </mesh>

            {/* Contact label */}
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.12}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {contact.label}
            </Text>

            {/* Button type indicator */}
            <Text
              position={[0, -1, 0]}
              fontSize={0.08}
              color={contact.color}
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {contact.type === 'email' ? '📧' : '🔗'} {contact.type.toUpperCase()}
            </Text>

            {/* Energy streams from buttons */}
            {selectedButton === i && (
              <group>
                {Array.from({ length: 6 }).map((_, j) => {
                  const streamAngle = (j / 6) * Math.PI * 2;
                  return (
                    <mesh
                      key={j}
                      position={[
                        Math.cos(streamAngle) * 0.8,
                        0,
                        Math.sin(streamAngle) * 0.8
                      ]}
                      rotation={[0, streamAngle, 0]}
                    >
                      <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
                      <meshBasicMaterial
                        color={contact.color}
                        transparent
                        opacity={0.6}
                      />
                    </mesh>
                  );
                })}
              </group>
            )}
          </group>
        );
      })}

      {/* Status indicators and data streams */}
      <group position={[0, 3, 0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 4;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 0.5) * 0.5,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? "#4ecdc4" : i % 3 === 1 ? "#45b7d1" : "#ff6b6b"}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>

      {/* Communication status display */}
      <Text
        position={[0, -2, 2]}
        fontSize={0.1}
        color="#4ecdc4"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        SYSTEM STATUS: ONLINE | COMMUNICATIONS: ACTIVE | ENCRYPTION: ENABLED
      </Text>
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/command_console.glb');
