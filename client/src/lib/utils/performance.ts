import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private meshCache: Map<string, THREE.Mesh> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();
  private gltfCache: Map<string, GLTF> = new Map();
  private disposed: Set<string> = new Set();

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Cache and reuse geometries
  cacheGeometry(key: string, geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    if (this.disposed.has(key)) {
      return geometry.clone();
    }
    return geometry;
  }

  // Cache and reuse textures
  cacheTexture(key: string, texture: THREE.Texture): THREE.Texture {
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!;
    }
    this.textureCache.set(key, texture);
    return texture;
  }

  // Optimize materials for performance
  createOptimizedMaterial(options: {
    color?: THREE.ColorRepresentation;
    transparent?: boolean;
    opacity?: number;
    emissive?: THREE.ColorRepresentation;
    wireframe?: boolean;
  }): THREE.MeshBasicMaterial | THREE.MeshStandardMaterial {
    const isSimple = !options.emissive && !options.wireframe;
    
    if (isSimple) {
      return new THREE.MeshBasicMaterial({
        color: options.color,
        transparent: options.transparent,
        opacity: options.opacity,
      });
    }

    return new THREE.MeshStandardMaterial({
      color: options.color,
      transparent: options.transparent,
      opacity: options.opacity,
      emissive: options.emissive,
      wireframe: options.wireframe,
      metalness: 0.1,
      roughness: 0.8,
    });
  }

  // Frustum culling for better performance
  enableFrustumCulling(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
      }
    });
  }

  // Level of Detail system
  createLOD(meshes: THREE.Mesh[], distances: number[]): THREE.LOD {
    const lod = new THREE.LOD();
    
    meshes.forEach((mesh, index) => {
      lod.addLevel(mesh, distances[index] || 0);
    });

    return lod;
  }

  // Dispose of unused resources
  disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }

  // Get performance stats
  getPerformanceStats(): {
    geometries: number;
    textures: number;
    programs: number;
  } {
    return {
      geometries: (THREE as any).Cache?.files?.size || 0,
      textures: this.textureCache.size,
      programs: 0, // Would need renderer access
    };
  }

  // Clear all caches
  clearCaches(): void {
    this.meshCache.clear();
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
    this.gltfCache.clear();
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Performance monitoring utilities
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;

  update(): number {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    return this.fps;
  }

  getFPS(): number {
    return this.fps;
  }

  getMemoryUsage(): MemoryInfo | undefined {
    return (performance as any).memory;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const optimizeGeometry = (geometry: THREE.BufferGeometry): THREE.BufferGeometry => {
  // Merge vertices that are close together
  geometry.mergeVertices();
  
  // Compute vertex normals for better lighting
  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals();
  }
  
  return geometry;
};

export const createInstancedMesh = (
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number
): THREE.InstancedMesh => {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = true;
  return mesh;
};