import { OrbitControls, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import SpaceStation from "./SpaceStation";
import StarField from "./StarField";
import NavigationPortals from "./NavigationPortals";
import ProjectShowcase from "./ProjectShowcase";
import SkillsHologram from "./SkillsHologram";
import ContactConsole from "./ContactConsole";
import AboutTerminal from "./AboutTerminal";
import CollectibleSystem from "./CollectibleSystem";
import ParticleEffects from "./ParticleEffects";
import { usePortfolio } from "../../lib/stores/usePortfolio";
import { useAudio } from "../../lib/stores/useAudio";

export default function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { currentSection } = usePortfolio();
  const { initializeAudio, playBackgroundAmbient } = useAudio();

  // Initialize audio system on component mount
  useEffect(() => {
    initializeAudio();
    
    // Start background ambient after a short delay
    const timer = setTimeout(() => {
      playBackgroundAmbient();
    }, 2000);

    return () => clearTimeout(timer);
  }, [initializeAudio, playBackgroundAmbient]);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation for the entire scene
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      {/* Enhanced Cyberpunk Lighting */}
      <ambientLight intensity={0.1} color="#0a0a1a" />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 15, 8]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Cyberpunk colored point lights */}
      <pointLight position={[0, 12, 0]} intensity={1.2} color="#4fd1c7" distance={25} />
      <pointLight position={[-15, 8, -15]} intensity={0.8} color="#9f7aea" distance={20} />
      <pointLight position={[15, 5, 15]} intensity={0.6} color="#f093fb" distance={20} />
      <pointLight position={[0, -5, -20]} intensity={0.4} color="#ff6b6b" distance={15} />
      
      {/* Accent lights for atmosphere */}
      <pointLight position={[8, 3, -8]} intensity={0.3} color="#00ff88" distance={10} />
      <pointLight position={[-8, 4, 8]} intensity={0.3} color="#ff3366" distance={10} />
      
      {/* Rim lighting */}
      <spotLight
        position={[20, 20, 20]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#4fd1c7"
        castShadow
      />
      <spotLight
        position={[-20, 15, -20]}
        angle={0.4}
        penumbra={1}
        intensity={0.4}
        color="#9f7aea"
        castShadow
      />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Main scene group */}
      <group ref={groupRef}>
        {/* Background stars */}
        <StarField />
        
        {/* Central space station */}
        <SpaceStation position={[0, 0, 0]} />
        
        {/* Navigation portals around the space station */}
        <NavigationPortals />
        
        {/* Section-specific content */}
        {currentSection === 'projects' && <ProjectShowcase />}
        {currentSection === 'skills' && <SkillsHologram />}
        {currentSection === 'contact' && <ContactConsole />}
        {currentSection === 'about' && <AboutTerminal />}
        
        {/* Collectible system - always active for gamification */}
        <CollectibleSystem />
        
        {/* Particle effects for cyberpunk atmosphere */}
        <ParticleEffects />
      </group>

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
}
