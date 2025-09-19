import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useAudio } from "../../lib/stores/useAudio";

interface CollectibleTokenProps {
  position: [number, number, number];
  type: 'coin' | 'nft' | 'gem';
  isCollected: boolean;
  onCollect: () => void;
}

export default function CollectibleToken({ 
  position, 
  type, 
  isCollected, 
  onCollect 
}: CollectibleTokenProps) {
  const tokenRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { playSuccess } = useAudio();

  // Token properties based on type
  const tokenData = useMemo(() => {
    switch (type) {
      case 'coin':
        return {
          color: '#ffd700',
          emissive: '#ffaa00',
          shape: 'cylinder',
          size: 0.3,
          label: '💰',
          name: 'CRYPTO COIN',
          points: 10
        };
      case 'nft':
        return {
          color: '#ff6b6b',
          emissive: '#ff3333',
          shape: 'octahedron',
          size: 0.4,
          label: '🎨',
          name: 'RARE NFT',
          points: 50
        };
      case 'gem':
        return {
          color: '#4fd1c7',
          emissive: '#2dd4bf',
          shape: 'dodecahedron',
          size: 0.35,
          label: '💎',
          name: 'CRYSTAL GEM',
          points: 25
        };
      default:
        return {
          color: '#ffffff',
          emissive: '#cccccc',
          shape: 'sphere',
          size: 0.3,
          label: '⭐',
          name: 'TOKEN',
          points: 5
        };
    }
  }, [type]);

  useFrame((state) => {
    if (tokenRef.current && !isCollected) {
      // Floating animation
      tokenRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
      
      // Rotation animation
      tokenRef.current.rotation.y += 0.02;
      tokenRef.current.rotation.x += 0.01;
    }

    if (glowRef.current && !isCollected) {
      // Glow pulsing effect
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = intensity;
      
      // Scale pulsing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const handleCollect = () => {
    if (!isCollected) {
      playSuccess();
      onCollect();
    }
  };

  // Don't render if collected
  if (isCollected) {
    return null;
  }

  return (
    <group 
      ref={tokenRef} 
      position={position}
      onClick={handleCollect}
      onPointerOver={() => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[tokenData.size * 2, 16, 16]} />
        <meshBasicMaterial
          color={tokenData.emissive}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Main token geometry */}
      <mesh castShadow>
        {tokenData.shape === 'cylinder' && (
          <cylinderGeometry args={[tokenData.size, tokenData.size, 0.1, 32]} />
        )}
        {tokenData.shape === 'octahedron' && (
          <octahedronGeometry args={[tokenData.size]} />
        )}
        {tokenData.shape === 'dodecahedron' && (
          <dodecahedronGeometry args={[tokenData.size]} />
        )}
        {tokenData.shape === 'sphere' && (
          <sphereGeometry args={[tokenData.size, 32, 32]} />
        )}
        
        <meshStandardMaterial
          color={tokenData.color}
          emissive={tokenData.emissive}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Hover/Selection effects */}
      {isHovered && (
        <>
          <mesh>
            <torusGeometry args={[tokenData.size * 1.5, 0.02, 8, 32]} />
            <meshBasicMaterial
              color={tokenData.color}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Floating label */}
          <Text
            position={[0, tokenData.size + 0.8, 0]}
            fontSize={0.2}
            color={tokenData.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            {tokenData.name}
          </Text>
          
          <Text
            position={[0, tokenData.size + 0.5, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter.json"
          >
            +{tokenData.points} pts
          </Text>
        </>
      )}

      {/* Particle trail effect */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0, tokenData.size * 0.5, 1, 8]} />
        <meshBasicMaterial
          color={tokenData.emissive}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}