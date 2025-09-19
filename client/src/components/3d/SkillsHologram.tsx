import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { portfolioData } from "../../lib/constants/portfolioData";

export default function SkillsHologram() {
  const groupRef = useRef<THREE.Group>(null);
  const skillRefs = useRef<THREE.Mesh[]>([]);

  // Pre-calculate skill positions in a spiral
  const skillPositions = useMemo(() => {
    const skills = portfolioData.skills;
    return skills.map((_, i) => {
      const angle = (i / skills.length) * Math.PI * 2;
      const radius = 3;
      const height = Math.sin(i * 0.5) * 2;
      
      return {
        x: Math.cos(angle) * radius,
        y: height,
        z: Math.sin(angle) * radius,
        angle
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
    }

    skillRefs.current.forEach((skill, i) => {
      if (skill) {
        const pos = skillPositions[i];
        // Individual rotation
        skill.rotation.y += 0.02;
        skill.rotation.x = Math.sin(state.clock.elapsedTime + pos.angle) * 0.2;
        
        // Floating animation
        skill.position.y = pos.y + Math.sin(state.clock.elapsedTime + i) * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 8]}>
      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color="#f093fb"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        SKILLS
      </Text>

      {/* Central hologram projector */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 0.3, 8]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.8}
          roughness={0.2}
          emissive="#1a202c"
        />
      </mesh>

      {/* Holographic skills display */}
      {portfolioData.skills.map((skill, i) => {
        const pos = skillPositions[i];
        return (
          <group key={i} position={[pos.x, pos.y, pos.z]}>
            <mesh
              ref={(el) => {
                if (el) skillRefs.current[i] = el;
              }}
            >
              <octahedronGeometry args={[0.3]} />
              <meshStandardMaterial
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.8}
              />
            </mesh>

            <Text
              position={[0, -0.8, 0]}
              fontSize={0.2}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {skill.name}
            </Text>

            <Text
              position={[0, -1.1, 0]}
              fontSize={0.15}
              color={skill.color}
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {skill.level}
            </Text>
          </group>
        );
      })}

      {/* Hologram effects */}
      <mesh position={[0, 2, 0]}>
        <torusGeometry args={[4, 0.05, 8, 32]} />
        <meshBasicMaterial
          color="#f093fb"
          transparent
          opacity={0.3}
        />
      </mesh>

      <mesh position={[0, 1, 0]}>
        <torusGeometry args={[3.5, 0.03, 8, 32]} />
        <meshBasicMaterial
          color="#4fd1c7"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
