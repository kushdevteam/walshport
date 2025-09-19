import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function ParticleEffects() {
  const particlesRef = useRef<THREE.Points>(null);
  const cyberpunkParticlesRef = useRef<THREE.Points>(null);

  // Create floating data particles
  const { positions: dataPositions, velocities: dataVelocities } = useMemo(() => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a large sphere around the scene
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random velocities for floating motion
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, []);

  // Create cyberpunk grid particles
  const { positions: gridPositions, colors: gridColors } = useMemo(() => {
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Grid-like positions
      const x = (Math.random() - 0.5) * 60;
      const y = -10 + Math.random() * 5;
      const z = (Math.random() - 0.5) * 60;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Cyberpunk colors - cyan, purple, pink
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Cyan
        colors[i3] = 0.3;
        colors[i3 + 1] = 0.8;
        colors[i3 + 2] = 1;
      } else if (colorChoice < 0.7) {
        // Purple
        colors[i3] = 0.6;
        colors[i3 + 1] = 0.4;
        colors[i3 + 2] = 0.9;
      } else {
        // Pink
        colors[i3] = 1;
        colors[i3 + 1] = 0.3;
        colors[i3 + 2] = 0.8;
      }
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    // Animate floating data particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += dataVelocities[i];
        positions[i + 1] += dataVelocities[i + 1];
        positions[i + 2] += dataVelocities[i + 2];

        // Wrap particles around the scene
        if (Math.abs(positions[i]) > 50) dataVelocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 50) dataVelocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 50) dataVelocities[i + 2] *= -1;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate cyberpunk grid particles
    if (cyberpunkParticlesRef.current) {
      cyberpunkParticlesRef.current.rotation.y += 0.001;
      const positions = cyberpunkParticlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.01;
      }
      
      cyberpunkParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Floating data particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dataPositions.length / 3}
            array={dataPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          color="#4fd1c7"
          transparent
          opacity={0.6}
          sizeAttenuation={true}
          alphaTest={0.1}
        />
      </points>

      {/* Cyberpunk grid particles */}
      <points ref={cyberpunkParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={gridPositions.length / 3}
            array={gridPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={gridColors.length / 3}
            array={gridColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.4}
          sizeAttenuation={false}
          alphaTest={0.1}
        />
      </points>

      {/* Energy streams */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 15 - 15, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 20, 8]} />
          <meshBasicMaterial
            color={i === 0 ? "#4fd1c7" : i === 1 ? "#9f7aea" : "#f093fb"}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Floating holographic panels */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 25;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh 
            key={i} 
            position={[x, 3 + Math.sin(i) * 2, z]}
            rotation={[0, -angle, 0]}
          >
            <planeGeometry args={[2, 3]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#4fd1c7" : "#9f7aea"}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </>
  );
}