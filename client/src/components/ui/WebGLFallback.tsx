import { useState } from "react";
import { portfolioData } from "../../lib/constants/portfolioData";

interface WebGLFallbackProps {
  error?: string;
}

export default function WebGLFallback({ error }: WebGLFallbackProps) {
  const [activeSection, setActiveSection] = useState<string>('about');

  const sections = [
    { id: 'about', name: 'About', color: 'text-cyan-400' },
    { id: 'projects', name: 'Projects', color: 'text-purple-400' },
    { id: 'skills', name: 'Skills', color: 'text-pink-400' },
    { id: 'contact', name: 'Contact', color: 'text-blue-400' }
  ];

  const handleContactClick = (contact: any) => {
    if (contact.type === 'email') {
      window.location.href = `mailto:${contact.value}`;
    } else {
      window.open(contact.value, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #4fd1c7 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #9f7aea 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, #f093fb 0%, transparent 50%)`,
          backgroundSize: '300px 300px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center pt-12 pb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            WLSFX
          </h1>
          <p className="text-xl text-purple-300 mb-4">
            Web3 & Game Developer Portfolio
          </p>
          
          {/* WebGL Error Notice */}
          <div className="max-w-2xl mx-auto bg-gray-900 border border-red-400/30 rounded-lg p-4 mb-8">
            <div className="text-red-400 text-sm mb-2">⚠️ 3D Mode Unavailable</div>
            <div className="text-gray-300 text-xs">
              {error || 'WebGL is not supported in your browser. Showing fallback 2D interface.'}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-900/80 backdrop-blur-sm rounded-lg p-2 border border-cyan-400/30">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded text-sm transition-all ${
                  activeSection === section.id
                    ? `bg-gradient-to-r from-cyan-500 to-purple-500 text-white`
                    : `${section.color} hover:bg-gray-700`
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          {/* About Section */}
          {activeSection === 'about' && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-cyan-400/30">
              <h2 className="text-2xl text-cyan-400 mb-4">About Me</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {portfolioData.about.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-purple-400 text-sm">Experience</div>
                    <div className="text-white text-lg">{portfolioData.about.experience}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-purple-400 text-sm">Location</div>
                    <div className="text-white text-lg">{portfolioData.about.location}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-400/30">
              <h2 className="text-2xl text-purple-400 mb-6">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolioData.projects.map((project) => (
                  <div key={project.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-pink-400/30">
              <h2 className="text-2xl text-pink-400 mb-6">Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioData.skills.map((skill, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-white font-semibold">{skill.name}</div>
                    <div className="text-sm text-gray-400">{skill.level}</div>
                    <div className="mt-2 h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
                        style={{
                          width: skill.level === 'Expert' ? '100%' :
                                 skill.level === 'Advanced' ? '80%' : '60%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-blue-400/30">
              <h2 className="text-2xl text-blue-400 mb-6">Contact</h2>
              <div className="text-center mb-6">
                <p className="text-gray-300 mb-4">
                  Ready to collaborate? Choose your preferred communication channel:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioData.contact.map((contact, i) => (
                  <button
                    key={i}
                    onClick={() => handleContactClick(contact)}
                    className="bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-400/50 transition-all duration-300 group"
                  >
                    <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      {contact.label}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {contact.type === 'email' ? 'Send message' : 'Visit profile'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm pb-8">
          <p>© 2024 DevMaster. Built with React & Three.js (when WebGL is available)</p>
        </div>
      </div>
    </div>
  );
}