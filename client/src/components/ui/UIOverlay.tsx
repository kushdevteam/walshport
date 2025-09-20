import { usePortfolio } from "../../lib/stores/usePortfolio";
import { useAudio } from "../../lib/stores/useAudio";

export default function UIOverlay() {
  const { currentSection, setCurrentSection } = usePortfolio();
  const { toggleMute, isMuted, ambientVolume, setAmbientVolume } = useAudio();

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Navigation instructions */}
      <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-sm pointer-events-auto">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30">
          <p className="mb-1">🚀 Use mouse to explore WLSFX</p>
          <p className="mb-1">🎯 Click portals to navigate sections</p>
          <p className="text-xs text-cyan-300">Current: {currentSection || 'home'}</p>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="absolute bottom-4 right-4 text-cyan-400 font-mono text-sm pointer-events-auto">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 transition-all"
              title={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? "🔇 Audio Off" : "🔊 Audio On"}
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs">Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-16 accent-cyan-400"
                disabled={isMuted}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section indicator */}
      <div className="absolute top-4 right-4 text-purple-400 font-mono text-lg pointer-events-auto">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30">
          <div className="flex space-x-2">
            {['home', 'about', 'projects', 'skills', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  currentSection === section
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {section.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
