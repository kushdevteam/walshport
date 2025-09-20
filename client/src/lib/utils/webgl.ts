/**
 * WebGL Detection and Error Handling Utilities
 */

export interface WebGLSupport {
  isSupported: boolean;
  error?: string;
  version?: number;
}

/**
 * WebGL Gate State - Single Source of Truth for WebGL Status
 */
export interface WebGLGate {
  support: boolean | undefined; // undefined = checking, false = not supported, true = supported
  ready: boolean;               // true only after Canvas onCreated fires successfully
  error?: string;              // error message if any step fails
}

/**
 * Creates initial WebGL Gate state
 */
export function createWebGLGate(): WebGLGate {
  return {
    support: undefined,
    ready: false,
    error: undefined
  };
}

/**
 * Detects WebGL support in the current browser environment
 */
export function detectWebGL(): WebGLSupport {
  console.log('[WebGL Gate] Running WebGL detection...');
  try {
    const canvas = document.createElement('canvas');
    
    // Try WebGL 2 first
    let gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2');
    if (gl) {
      console.log('[WebGL Gate] ✓ WebGL 2 support detected');
      return {
        isSupported: true,
        version: 2
      };
    }

    // Fall back to WebGL 1
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      console.log('[WebGL Gate] ✓ WebGL 1 support detected');
      return {
        isSupported: true,
        version: 1
      };
    }

    console.log('[WebGL Gate] ✗ No WebGL support detected');
    return {
      isSupported: false,
      error: 'WebGL not supported by browser'
    };
  } catch (error) {
    console.error('[WebGL Gate] ✗ WebGL detection error:', error);
    return {
      isSupported: false,
      error: `WebGL detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Creates a WebGL context with proper error handling
 */
export function createWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | WebGL2RenderingContext | null {
  const contextOptions = {
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: false,
    powerPreference: 'default' as WebGLPowerPreference,
    failIfMajorPerformanceCaveat: false,
    desynchronized: false
  };

  try {
    // Try WebGL 2 first
    let context = canvas.getContext('webgl2', contextOptions) as WebGL2RenderingContext;
    if (context) return context;

    // Fall back to WebGL 1
    const webgl1Context = canvas.getContext('webgl', contextOptions) as WebGLRenderingContext;
    if (webgl1Context) return webgl1Context;

    // Try experimental contexts
    const expWebgl2Context = canvas.getContext('experimental-webgl2', contextOptions) as WebGL2RenderingContext;
    if (expWebgl2Context) return expWebgl2Context;

    const expWebgl1Context = canvas.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext;
    if (expWebgl1Context) return expWebgl1Context;

    return null;
  } catch (error) {
    console.error('WebGL context creation failed:', error);
    return null;
  }
}

/**
 * Handles HMR (Hot Module Replacement) detection for development
 * Returns true if we're in an HMR environment
 */
export function isHMREnvironment(): boolean {
  return !!import.meta.hot;
}

/**
 * Sets up HMR listeners to reset WebGL gate on hot updates
 */
export function setupHMRListeners(resetCallback: () => void): (() => void) | null {
  if (import.meta.hot) {
    console.log('[WebGL Gate] Setting up HMR listeners');
    
    const handleHMRUpdate = () => {
      console.log('[WebGL Gate] HMR update detected - resetting gate');
      resetCallback();
    };
    
    import.meta.hot.on('vite:beforeUpdate', handleHMRUpdate);
    
    // Return cleanup function
    return () => {
      if (import.meta.hot) {
        import.meta.hot.off('vite:beforeUpdate', handleHMRUpdate);
      }
    };
  }
  return null;
}

/**
 * Gets WebGL error information
 */
export function getWebGLError(gl: WebGLRenderingContext | WebGL2RenderingContext): string | null {
  const error = gl.getError();
  switch (error) {
    case gl.NO_ERROR:
      return null;
    case gl.INVALID_ENUM:
      return 'Invalid enum';
    case gl.INVALID_VALUE:
      return 'Invalid value';
    case gl.INVALID_OPERATION:
      return 'Invalid operation';
    case gl.OUT_OF_MEMORY:
      return 'Out of memory';
    case gl.CONTEXT_LOST_WEBGL:
      return 'Context lost';
    default:
      return `Unknown error: ${error}`;
  }
}