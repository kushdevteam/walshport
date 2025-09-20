import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useState, useMemo, Suspense } from "react";
import * as THREE from "three";
import { usePortfolio } from "../../lib/stores/usePortfolio";
import { useAudio } from "../../lib/stores/useAudio";

interface Portal {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  section: string;
}

export default function NavigationPortals() {
  const { setCurrentSection, currentSection } = usePortfolio();
  const { playNavigationSound, playSuccess } = useAudio();
  const portalRefs = useRef<{ [key: string]: THREE.Group }>({});
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);

  // Pre-calculate portal data
  const portals: Portal[] = useMemo(() => [
    {
      id: 'about',
      label: 'ABOUT',
      position: [6, 2, 0],
      color: '#4fd1c7',
      section: 'about'
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      position: [-6, 2, 0],
      color: '#9f7aea',
      section: 'projects'
    },
    {
      id: 'skills',
      label: 'SKILLS',
      position: [0, 2, 6],
      color: '#f093fb',
      section: 'skills'
    },
    {
      id: 'contact',
      label: 'CONTACT',
      position: [0, 2, -6],
      color: '#4ecdc4',
      section: 'contact'
    }
  ], []);

  useFrame((state) => {
    portals.forEach((portal) => {
      const portalGroup = portalRefs.current[portal.id];
      if (portalGroup) {
        // Floating animation
        portalGroup.position.y = portal.position[1] + Math.sin(state.clock.elapsedTime + portal.position[0]) * 0.2;
        
        // Rotation
        portalGroup.rotation.y += 0.01;
        
        // Scale animation when hovered
        const targetScale = hoveredPortal === portal.id ? 1.2 : 1;
        portalGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
    });
  });

  const handlePortalClick = (section: string) => {
    playSuccess(); // Play success sound for navigation
    setCurrentSection(section);
  };

  const handlePortalHover = (portalId: string) => {
    playNavigationSound(); // Play navigation sound on hover
    setHoveredPortal(portalId);
  };

  return (
    <group>
      {portals.map((portal) => (
        <group
          key={portal.id}
          ref={(el) => {
            if (el) portalRefs.current[portal.id] = el;
          }}
          position={portal.position}
          onClick={() => handlePortalClick(portal.section)}
          onPointerOver={() => handlePortalHover(portal.id)}
          onPointerOut={() => setHoveredPortal(null)}
        >
          {/* Portal ring */}
          <mesh>
            <torusGeometry args={[1, 0.1, 8, 32]} />
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={currentSection === portal.section ? 0.5 : 0.2}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Portal center glow */}
          <mesh>
            <circleGeometry args={[0.8, 32]} />
            <meshBasicMaterial
              color={portal.color}
              transparent
              opacity={currentSection === portal.section ? 0.3 : 0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Portal label */}
          <Suspense fallback={null}>
            <Text
              position={[0, -1.5, 0]}
              fontSize={0.3}
              color={portal.color}
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter.json"
            >
              {portal.label}
            </Text>
          </Suspense>

          {/* Active indicator */}
          {currentSection === portal.section && (
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color={portal.color} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
