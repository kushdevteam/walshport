import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/inter";
import Scene from "./components/3d/Scene";
import UIOverlay from "./components/ui/UIOverlay";
import WebGLFallback from "./components/ui/WebGLFallback";
import { detectWebGL } from "./lib/utils/webgl";

const queryClient = new QueryClient();

function App() {
  const [webglSupport, setWebglSupport] = useState<{
    isSupported: boolean;
    error?: string;
    isChecking: boolean;
  }>({
    isSupported: true, // Start with true for faster loading
    isChecking: false
  });

  useEffect(() => {
    // Check WebGL support on component mount
    const checkWebGL = () => {
      try {
        const support = detectWebGL();
        console.log('WebGL Support Check:', support);
        
        setWebglSupport({
          isSupported: support.isSupported,
          error: support.error,
          isChecking: false
        });
      } catch (error) {
        console.error('WebGL detection error:', error);
        setWebglSupport({
          isSupported: false,
          error: error instanceof Error ? error.message : 'WebGL detection failed',
          isChecking: false
        });
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkWebGL, 100);
  }, []);

  // Show loading state while checking WebGL
  if (webglSupport.isChecking) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-center">
          <div className="text-4xl mb-4">🌌 WLSFX</div>
          <div className="text-lg animate-pulse">Initializing...</div>
        </div>
      </div>
    );
  }

  // Show fallback UI if WebGL is not supported
  if (!webglSupport.isSupported) {
    return (
      <QueryClientProvider client={queryClient}>
        <WebGLFallback error={webglSupport.error} />
      </QueryClientProvider>
    );
  }


  // Show 3D portfolio if WebGL is supported
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
        <Canvas
          camera={{
            position: [0, 5, 15],
            fov: 60
          }}
          onCreated={({ gl }) => {
            console.log('WebGL renderer initialized successfully');
          }}
        >
          <color attach="background" args={["#000"]} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
        <UIOverlay />
      </div>
    </QueryClientProvider>
  );
}

export default App;
