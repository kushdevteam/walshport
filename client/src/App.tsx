import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/inter";
import Scene from "./components/3d/Scene";
import UIOverlay from "./components/ui/UIOverlay";
import WebGLFallback from "./components/ui/WebGLFallback";
import { detectWebGL, createWebGLGate, setupHMRListeners, type WebGLGate } from "./lib/utils/webgl";

const queryClient = new QueryClient();

function App() {
  // WebGL Gate - Single Source of Truth
  const [webglGate, setWebglGate] = useState<WebGLGate>(createWebGLGate);
  const [canvasKey, setCanvasKey] = useState(0);
  
  console.log('[WebGL Gate] Current state:', webglGate);

  // Reset WebGL gate (for HMR and retry)
  const resetWebGLGate = useCallback(() => {
    console.log('[WebGL Gate] Resetting gate state');
    setWebglGate(createWebGLGate());
    setCanvasKey(k => k + 1); // Force Canvas remount
  }, []);

  // Check WebGL support
  const checkWebGLSupport = useCallback(() => {
    if (webglGate.support !== undefined) {
      console.log('[WebGL Gate] Support already determined, skipping check');
      return;
    }
    
    console.log('[WebGL Gate] Checking support...');
    try {
      const support = detectWebGL();
      setWebglGate(prev => ({
        ...prev,
        support: support.isSupported,
        error: support.error
      }));
      
      console.log(`[WebGL Gate] Support check complete: ${support.isSupported ? 'SUPPORTED' : 'NOT SUPPORTED'}`);
    } catch (error) {
      console.error('[WebGL Gate] Support check failed:', error);
      setWebglGate(prev => ({
        ...prev,
        support: false,
        error: error instanceof Error ? error.message : 'WebGL detection failed'
      }));
    }
  }, [webglGate.support]);

  // Initial WebGL support check and HMR setup
  useEffect(() => {
    // Check WebGL support on mount
    checkWebGLSupport();
    
    // Set up HMR listeners to reset gate on hot updates
    const cleanupHMR = setupHMRListeners(resetWebGLGate);
    
    return cleanupHMR || undefined;
  }, [checkWebGLSupport, resetWebGLGate]);

  // RENDER LOGIC based on WebGL Gate states
  
  // Loading state: support is undefined (still checking)
  if (webglGate.support === undefined) {
    console.log('[WebGL Gate] Rendering: LOADING state');
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-center">
          <div className="text-4xl mb-4">🌌 WLSFX</div>
          <div className="text-lg animate-pulse">Checking WebGL support...</div>
        </div>
      </div>
    );
  }

  // Fallback state: support is false OR ready failed with error
  if (webglGate.support === false || (webglGate.support === true && !webglGate.ready && webglGate.error)) {
    console.log('[WebGL Gate] Rendering: FALLBACK state');
    return (
      <QueryClientProvider client={queryClient}>
        <WebGLFallback 
          error={webglGate.error} 
          onRetry={resetWebGLGate}
        />
      </QueryClientProvider>
    );
  }


  // 3D state: support is true, mounting Canvas (ready will be set by onCreated)
  console.log('[WebGL Gate] Rendering: 3D state - mounting Canvas');
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
        <Canvas
          key={canvasKey}
          dpr={[1, 1]}
          gl={{ 
            antialias: false, 
            powerPreference: 'low-power', 
            failIfMajorPerformanceCaveat: false, 
            alpha: true, 
            stencil: false, 
            depth: true, 
            preserveDrawingBuffer: false 
          }}
          camera={{
            position: [0, 5, 15],
            fov: 60
          }}
          onCreated={({ gl }) => {
            console.log('[WebGL Gate] Canvas onCreated fired - WebGL renderer ready');
            
            // Mark gate as ready - this is the key moment!
            setWebglGate(prev => ({ 
              ...prev, 
              ready: true,
              error: undefined  // Clear any previous errors
            }));
            
            const canvas = gl.domElement as HTMLCanvasElement;
            
            // Context event handlers
            const onLost = (e: Event) => { 
              e.preventDefault(); 
              console.warn('[WebGL Gate] WebGL context lost - switching to fallback');
              setWebglGate(prev => ({
                ...prev,
                ready: false,
                error: 'WebGL context was lost'
              }));
            };
            
            const onRestored = () => { 
              console.info('[WebGL Gate] WebGL context restored - resetting gate');
              resetWebGLGate(); // This will re-detect and remount
            };
            
            const onCreationError = (e: any) => { 
              console.error('[WebGL Gate] WebGL context creation error:', e?.statusMessage); 
              setWebglGate(prev => ({
                ...prev,
                ready: false,
                error: 'WebGL context creation failed: ' + (e?.statusMessage || 'Unknown error')
              }));
            };
            
            // Add event listeners
            canvas.addEventListener('webglcontextlost', onLost as EventListener, { passive: false });
            canvas.addEventListener('webglcontextrestored', onRestored as EventListener);
            canvas.addEventListener('webglcontextcreationerror', onCreationError as EventListener);
          }}
          onError={(error) => {
            console.error('[WebGL Gate] Canvas error occurred:', error);
            
            // Only fallback on critical WebGL context errors
            if (error && (error.toString().includes('context') || error.toString().includes('WebGL'))) {
              console.error('[WebGL Gate] Critical WebGL error - switching to fallback');
              setWebglGate(prev => ({
                ...prev,
                ready: false,
                error: 'Canvas rendering failed: ' + error.toString()
              }));
            } else {
              console.warn('[WebGL Gate] Non-critical Canvas error, continuing:', error);
            }
          }}
        >
          <color attach="background" args={["#000"]} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
        {/* Only show UI overlay when gate is ready */}
        {webglGate.ready && <UIOverlay />}
      </div>
    </QueryClientProvider>
  );
}

export default App;
