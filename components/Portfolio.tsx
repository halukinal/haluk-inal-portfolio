import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Github, Play } from 'lucide-react';
import { Button } from './ui/button';

const projects: Project[] = [
  {
    id: '1',
    title: 'Neon City Commercial',
    category: 'media',
    description: 'A cyberpunk-themed commercial for a local fashion brand shot on Sony A7SIII.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    tags: ['Premiere Pro', 'After Effects', 'Color Grading']
  },
  {
    id: '2',
    title: 'E-Commerce Dashboard',
    category: 'engineering',
    description: 'Full-stack analytics dashboard with real-time sales tracking via WebSockets.',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    tags: ['Next.js', 'TypeScript', 'Firebase'],
    link: '#'
  },
  {
    id: '3',
    title: 'University AI Research',
    category: 'engineering',
    description: 'Machine learning model for image recognition integrated into a React Native app.',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    tags: ['Python', 'TensorFlow', 'React Native']
  },
  {
    id: '4',
    title: 'Travel Vlog 2023',
    category: 'media',
    description: 'Cinematic travel documentation of Turkey\'s Aegean coast.',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    tags: ['Direction', 'Editing', 'Sound Design']
  },
  {
    id: '5',
    title: 'Portfolio V1',
    category: 'engineering',
    description: 'My previous portfolio site built with Gatsby and GSAP.',
    imageUrl: 'https://picsum.photos/800/600?random=5',
    tags: ['Gatsby', 'GSAP', 'CSS']
  },
  {
    id: '6',
    title: 'Tech Review Series',
    category: 'media',
    description: 'YouTube tech review channel branding and video editing package.',
    imageUrl: 'https://picsum.photos/800/600?random=6',
    tags: ['YouTube', 'Branding', 'Motion Graphics']
  }
];

export const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'engineering' | 'media'>('all');

  const filteredProjects = projects.filter(p => filter === 'all' || p.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-zinc-950/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-display text-4xl font-bold mb-2">Selected Works</h2>
            <p className="text-muted-foreground">A mix of pixels and keyframes.</p>
          </div>
          
          <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-black shadow-sm' : 'text-muted-foreground hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('engineering')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'engineering' ? 'bg-blue-500 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
            >
              Engineering
            </button>
            <button
              onClick={() => setFilter('media')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'media' ? 'bg-purple-500 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
            >
              Media
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 ${project.category === 'engineering' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs text-white/60 border border-white/10 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.category === 'engineering' ? (
                         <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black w-full">
                            View Code <Github className="ml-2 h-3 w-3" />
                         </Button>
                      ) : (
                        <Button size="sm" variant="default" className="bg-white text-black hover:bg-gray-200 w-full">
                           Watch Video <Play className="ml-2 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};