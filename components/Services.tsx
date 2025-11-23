import React from 'react';
import { Monitor, Camera, Share2, Clapperboard, Layers, Database } from 'lucide-react';
import { Service } from '../types';

const services: Service[] = [
  {
    title: "Web Development",
    description: "Full-stack applications using Next.js and Firebase. High performance and SEO optimized.",
    icon: Monitor
  },
  {
    title: "Video Production",
    description: "End-to-end video production from storyboarding to final post-production and color grading.",
    icon: Clapperboard
  },
  {
    title: "Motion Graphics",
    description: "Compelling 2D/3D animations for brand intros, explainers, and UI interactions.",
    icon: Layers
  },
  {
    title: "Photography",
    description: "Professional event and portrait photography with high-end retouching.",
    icon: Camera
  },
  {
    title: "Social Media Strategy",
    description: "Content planning and visual identity design for digital growth.",
    icon: Share2
  },
  {
    title: "Backend Architecture",
    description: "Scalable database design and API development using modern cloud solutions.",
    icon: Database
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Delivering value through technical expertise and creative vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                <service.icon className="text-white group-hover:text-blue-400 transition-colors" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};