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
    isSupported: false,
    isChecking: true
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
          <div className="text-4xl mb-4">🌌 DEVVERSE</div>
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
          shadows
          camera={{
            position: [0, 5, 15],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default", // Changed to default instead of high-performance
            failIfMajorPerformanceCaveat: false,
            alpha: true,
            preserveDrawingBuffer: false
          }}
          onCreated={({ gl }) => {
            console.log('WebGL renderer initialized successfully');
          }}
          onError={(error) => {
            console.error('Canvas creation error:', error);
            // Fallback to 2D mode if Canvas fails
            setWebglSupport({
              isSupported: false,
              error: 'WebGL context creation failed',
              isChecking: false
            });
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
