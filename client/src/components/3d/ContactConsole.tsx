import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { portfolioData } from "../../lib/constants/portfolioData";

export default function ContactConsole() {
  const consoleRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const buttonRefs = useRef<THREE.Mesh[]>([]);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);

  // Pre-calculate button positions
  const buttonPositions = useMemo(() => {
    return portfolioData.contact.map((_, i) => ({
      x: (i - portfolioData.contact.length / 2) * 0.8,
      y: -0.3,
      z: 0.51
    }));
  }, []);

  useFrame((state) => {
    if (consoleRef.current) {
      consoleRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    if (screenRef.current) {
      // Screen glow effect
      const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }

    buttonRefs.current.forEach((button, i) => {
      if (button) {
        const targetScale = selectedButton === i ? 1.2 : 1;
        button.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
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
        position={[0, 3, 0]}
        fontSize={1}
        color="#4ecdc4"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        CONTACT
      </Text>

      {/* Console base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 1]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Console screen */}
      <mesh
        ref={screenRef}
        position={[0, 0.3, 0.51]}
      >
        <planeGeometry args={[3, 1.2]} />
        <meshStandardMaterial
          color="#000"
          emissive="#4ecdc4"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Screen content */}
      <Text
        position={[0, 0.6, 0.52]}
        fontSize={0.15}
        color="#4ecdc4"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        COMMUNICATION TERMINAL
      </Text>

      <Text
        position={[0, 0.3, 0.52]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        Select a communication channel:
      </Text>

      {/* Contact buttons */}
      {portfolioData.contact.map((contact, i) => {
        const pos = buttonPositions[i];
        return (
          <group key={i} position={[pos.x, pos.y, pos.z]}>
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
              <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
              <meshStandardMaterial
                color={contact.color}
                emissive={contact.color}
                emissiveIntensity={selectedButton === i ? 0.5 : 0.2}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>

            <Text
              position={[0, -0.6, 0]}
              fontSize={0.1}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {contact.label}
            </Text>
          </group>
        );
      })}

      {/* Console details */}
      <mesh position={[-1.8, -0.8, 0.51]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>

      <mesh position={[-1.5, -0.8, 0.51]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#4ecdc4" />
      </mesh>

      <mesh position={[-1.2, -0.8, 0.51]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#45b7d1" />
      </mesh>
    </group>
  );
}
