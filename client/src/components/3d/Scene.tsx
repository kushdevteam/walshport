import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";

// Import all 3D components
import SpaceStation from "./SpaceStation";
import NavigationPortals from "./NavigationPortals";
import StarField from "./StarField";
import AboutTerminal from "./AboutTerminal";
import ProjectShowcase from "./ProjectShowcase";
import SkillsHologram from "./SkillsHologram";
import ContactConsole from "./ContactConsole";
import CollectibleSystem from "./CollectibleSystem";
import ParticleEffects from "./ParticleEffects";

// Import stores
import { usePortfolio } from "../../lib/stores/usePortfolio";

export default function Scene() {
  const { currentSection, setLoading } = usePortfolio();

  useEffect(() => {
    // Mark loading as complete when scene mounts
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <>
      {/* Advanced lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#4fd1c7" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#9f7aea" />
      
      {/* Background star field */}
      <StarField />
      
      {/* Particle effects */}
      <ParticleEffects />

      {/* Main 3D portfolio components - render immediately */}
      {/* Central space station hub */}
      <SpaceStation position={[0, 0, 0]} />
      
      {/* Navigation portals */}
      <NavigationPortals />
      
      {/* Collectible system */}
      <CollectibleSystem />
      
      {/* Section-specific components - wrapped individually */}
      {currentSection === 'about' && (
        <Suspense fallback={null}>
          <AboutTerminal />
        </Suspense>
      )}
      {currentSection === 'projects' && (
        <Suspense fallback={null}>
          <ProjectShowcase />
        </Suspense>
      )}
      {currentSection === 'skills' && (
        <Suspense fallback={null}>
          <SkillsHologram />
        </Suspense>
      )}
      {currentSection === 'contact' && (
        <Suspense fallback={null}>
          <ContactConsole />
        </Suspense>
      )}

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={30}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
        autoRotate={currentSection === 'home'}
        autoRotateSpeed={0.5}
      />
    </>
  );
}
