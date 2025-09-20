import { useFrame } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { portfolioData } from "../../lib/constants/portfolioData";

export default function SkillsHologram() {
  const groupRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Group>(null);
  const skillRefs = useRef<THREE.Mesh[]>([]);
  
  // Load the hologram projector 3D model
  const { scene } = useGLTF('/models/hologram_projector.glb');
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);

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

    if (hologramRef.current) {
      // Hologram projector subtle animation
      hologramRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      hologramRef.current.rotation.y += 0.005;
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
        position={[0, 6, 0]}
        fontSize={1}
        color="#f093fb"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        SKILLS
      </Text>

      {/* Hologram Projector 3D Model */}
      <group 
        ref={hologramRef}
        scale={[2.5, 2.5, 2.5]}
        position={[0, -1, 0]}
      >
        <primitive 
          object={clonedScene} 
          castShadow 
          receiveShadow
        />
      </group>

      {/* Enhanced Holographic Skills Display */}
      {portfolioData.skills.map((skill, i) => {
        const pos = skillPositions[i];
        return (
          <group key={i} position={[pos.x, pos.y, pos.z]}>
            {/* Tech icon representation */}
            <mesh
              ref={(el) => {
                if (el) skillRefs.current[i] = el;
              }}
            >
              <dodecahedronGeometry args={[0.4]} />
              <meshStandardMaterial
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={0.4}
                transparent
                opacity={0.85}
                wireframe={false}
              />
            </mesh>

            {/* Holographic wireframe overlay */}
            <mesh
              position={[0, 0, 0]}
              scale={[1.1, 1.1, 1.1]}
            >
              <dodecahedronGeometry args={[0.4]} />
              <meshBasicMaterial
                color={skill.color}
                wireframe={true}
                transparent
                opacity={0.3}
              />
            </mesh>

            {/* Skill name with holographic effect */}
            <Text
              position={[0, -0.9, 0]}
              fontSize={0.18}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {skill.name}
            </Text>

            {/* Level indicator */}
            <Text
              position={[0, -1.2, 0]}
              fontSize={0.12}
              color={skill.color}
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {skill.level}
            </Text>

            {/* Orbiting particles */}
            {Array.from({ length: 3 }).map((_, j) => {
              const orbitAngle = (j / 3) * Math.PI * 2;
              const orbitRadius = 0.7;
              return (
                <mesh
                  key={j}
                  position={[
                    Math.cos(orbitAngle) * orbitRadius,
                    Math.sin(orbitAngle * 0.5) * 0.2,
                    Math.sin(orbitAngle) * orbitRadius
                  ]}
                >
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshBasicMaterial
                    color={skill.color}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Enhanced Hologram Energy Rings */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, 2 + i * 0.5, 0]} rotation={[0, i * Math.PI * 0.1, 0]}>
          <torusGeometry args={[4.5 - i * 0.3, 0.06, 6, 24]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#f093fb" : "#4fd1c7"}
            transparent
            opacity={0.4 - i * 0.05}
          />
        </mesh>
      ))}

      {/* Data stream effects */}
      {Array.from({ length: 12 }).map((_, i) => {
        const streamAngle = (i / 12) * Math.PI * 2;
        const streamRadius = 5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(streamAngle) * streamRadius,
              Math.sin(streamAngle * 0.3) * 3,
              Math.sin(streamAngle) * streamRadius
            ]}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/hologram_projector.glb');
