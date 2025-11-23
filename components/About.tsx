import React from 'react';
import { motion } from 'framer-motion';
import { Code, Video, Cpu, Film } from 'lucide-react';
import { TimelineItem } from '../types';

const timelineData: TimelineItem[] = [
  {
    year: '2024',
    title: 'Senior Computer Engineering Student',
    description: 'Specializing in Full Stack Development and AI integration at university.',
    type: 'engineering'
  },
  {
    year: '2023',
    title: 'Freelance Video Producer',
    description: 'Directed and edited commercial projects for local brands using Premiere Pro & After Effects.',
    type: 'media'
  },
  {
    year: '2022',
    title: 'Frontend Internship',
    description: 'Developed internal tools using React and TypeScript for a tech startup.',
    type: 'engineering'
  },
  {
    year: '2021',
    title: 'Started Content Creation',
    description: 'Launched a YouTube channel focusing on tech reviews and cinematic vlogs.',
    type: 'media'
  }
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative bg-zinc-950/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Bio Side */}
          <div className="md:w-1/3">
            <h2 className="font-display text-4xl font-bold mb-6">About Me</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mb-8" />
            <p className="text-muted-foreground leading-relaxed mb-6">
              I am Haluk Inal, a Computer Engineering student with a deep passion for visual arts. 
              While my code runs on logic and efficiency, my creative work thrives on emotion and aesthetics.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              My goal is to merge these two worlds—using code to create interactive visual experiences and using cinematic techniques to present technical products.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                <Cpu className="text-blue-400 mb-2" />
                <h3 className="font-bold text-white">Engineering</h3>
                <p className="text-xs text-muted-foreground">React, Next.js, Node.js</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                <Film className="text-purple-400 mb-2" />
                <h3 className="font-bold text-white">Production</h3>
                <p className="text-xs text-muted-foreground">Premiere, AE, DaVinci</p>
              </div>
            </div>
          </div>

          {/* Timeline Side */}
          <div className="md:w-2/3 relative">
            <div className="absolute left-4 md:left-1/2 h-full w-px bg-white/10 transform -translate-x-1/2" />
            
            <div className="space-y-12">
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-zinc-950 border-2 border-white rounded-full transform -translate-x-1/2 z-10 flex items-center justify-center">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'engineering' ? 'bg-blue-400' : 'bg-purple-400'}`} />
                  </div>

                  {/* Content Wrapper */}
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-12">
                    <div className={`p-6 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors ${index % 2 === 0 ? 'text-left' : 'md:text-right'}`}>
                      <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? '' : 'md:justify-end'}`}>
                        {item.type === 'engineering' ? <Code size={14} className="text-blue-400"/> : <Video size={14} className="text-purple-400"/>}
                        <span className="text-sm font-mono text-white/50">{item.year}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};