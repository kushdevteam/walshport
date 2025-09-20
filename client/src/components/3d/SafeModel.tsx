import { useGLTF } from "@react-three/drei";
import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";

interface SafeModelProps {
  url: string;
  fallback?: React.ReactNode;
  children: (scene: THREE.Group) => React.ReactNode;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function SafeModel({ 
  url, 
  fallback = null, 
  children, 
  scale = [1, 1, 1], 
  position = [0, 0, 0], 
  rotation = [0, 0, 0] 
}: SafeModelProps) {
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Always call hooks in the same order - this is crucial for React
  const gltfData = useGLTF(url);
  const { scene } = gltfData;
  
  // Clone the scene safely without calling setState inside useMemo
  const clonedScene = useMemo(() => {
    if (!scene) {
      return null;
    }
    
    try {
      return scene.clone();
    } catch (cloneError) {
      console.warn(`Failed to clone model scene: ${url}`, cloneError);
      // Return original scene as fallback instead of calling setState
      return scene;
    }
  }, [scene, url]);
  
  // Handle error states with useEffect (proper React pattern)
  useEffect(() => {
    // Clear any previous errors when a new scene loads successfully
    if (scene && clonedScene && loadError) {
      setLoadError(null);
      return;
    }
    
    // Set error if scene is null after GLTF should have loaded
    if (!scene && !loadError) {
      const timer = setTimeout(() => {
        setLoadError('Model loading timeout');
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [scene, clonedScene, loadError, url]);
  
  // Additional check for clone failure
  useEffect(() => {
    if (scene && !clonedScene && !loadError) {
      setLoadError('Failed to process model scene');
    }
  }, [scene, clonedScene, loadError]);
  
  // Show fallback if there's an error or no scene
  if (loadError || !clonedScene) {
    return <>{fallback}</>;
  }
  
  return (
    <group scale={scale} position={position} rotation={rotation}>
      <primitive 
        object={clonedScene} 
        castShadow 
        receiveShadow
      />
      {children(clonedScene)}
    </group>
  );
}

// Simple fallback component for when models fail to load
export function ModelFallback({ 
  color = "#4fd1c7", 
  scale = [1, 1, 1] 
}: { 
  color?: string; 
  scale?: [number, number, number]; 
}) {
  return (
    <mesh scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.6}
        wireframe 
      />
    </mesh>
  );
}