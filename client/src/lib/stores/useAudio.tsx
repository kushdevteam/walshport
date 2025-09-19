import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  ambientVolume: number;
  effectsVolume: number;
  isMuted: boolean;
  isInitialized: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  initializeAudio: () => void;
  toggleMute: () => void;
  setAmbientVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  playHit: () => void;
  playSuccess: () => void;
  playNavigationSound: () => void;
  playBackgroundAmbient: () => void;
  stopBackgroundAmbient: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  ambientVolume: 0.3,
  effectsVolume: 0.5,
  isMuted: true, // Start muted by default for user interaction compliance
  isInitialized: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  initializeAudio: () => {
    if (get().isInitialized) return;
    
    try {
      // Create audio elements
      const backgroundMusic = new Audio('/sounds/background.mp3');
      const hitSound = new Audio('/sounds/hit.mp3');
      const successSound = new Audio('/sounds/success.mp3');
      
      // Configure background music
      backgroundMusic.loop = true;
      backgroundMusic.volume = get().ambientVolume;
      
      // Configure sound effects
      hitSound.volume = get().effectsVolume;
      successSound.volume = get().effectsVolume;
      
      set({
        backgroundMusic,
        hitSound,
        successSound,
        isInitialized: true
      });
      
      console.log('Audio system initialized');
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  },
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    // Handle background music
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(() => {
          console.log('Background music autoplay prevented');
        });
      }
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  setAmbientVolume: (volume) => {
    set({ ambientVolume: volume });
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.volume = volume;
    }
  },
  
  setEffectsVolume: (volume) => {
    set({ effectsVolume: volume });
    const { hitSound, successSound } = get();
    if (hitSound) hitSound.volume = volume;
    if (successSound) successSound.volume = volume;
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = get().effectsVolume;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playNavigationSound: () => {
    // Use hit sound for navigation feedback
    get().playHit();
  },
  
  playBackgroundAmbient: () => {
    const { backgroundMusic, isMuted } = get();
    if (backgroundMusic && !isMuted) {
      backgroundMusic.currentTime = 0;
      backgroundMusic.play().catch(() => {
        console.log('Background music autoplay prevented');
      });
    }
  },
  
  stopBackgroundAmbient: () => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  }
}));
