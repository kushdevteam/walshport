import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { portfolioData } from "../../lib/constants/portfolioData";
import InteractiveLaptop from "./InteractiveLaptop";
import ArcadeCabinet from "./ArcadeCabinet";
import { useAudio } from "../../lib/stores/useAudio";

export default function ProjectShowcase() {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const { playSuccess, playNavigationSound } = useAudio();

  // Pre-calculate project positions
  const projectPositions = useMemo(() => {
    return portfolioData.projects.map((_, i) => ({
      x: (i - portfolioData.projects.length / 2) * 6,
      y: 0,
      z: -5
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const handleProjectClick = (projectIndex: number) => {
    playSuccess();
    setSelectedProject(selectedProject === projectIndex ? null : projectIndex);
  };

  return (
    <group ref={groupRef} position={[-8, 0, 0]}>
      <Text
        position={[portfolioData.projects.length * 2, 6, -5]}
        fontSize={1.2}
        color="#9f7aea"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        PROJECT SHOWCASE
      </Text>

      {portfolioData.projects.map((project, i) => {
        const pos = projectPositions[i];
        
        // Use different 3D models based on project type
        if (project.type === 'game') {
          return (
            <ArcadeCabinet
              key={i}
              position={[pos.x, pos.y, pos.z] as [number, number, number]}
              project={project}
              isSelected={selectedProject === i}
              onClick={() => handleProjectClick(i)}
            />
          );
        } else {
          return (
            <InteractiveLaptop
              key={i}
              position={[pos.x, pos.y, pos.z] as [number, number, number]}
              project={project}
              isSelected={selectedProject === i}
              onClick={() => handleProjectClick(i)}
            />
          );
        }
      })}

      {/* Interactive hint */}
      <Text
        position={[0, -5, -3]}
        fontSize={0.3}
        color="#4fd1c7"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        Click on projects to explore interactive demos
      </Text>
    </group>
  );
}
