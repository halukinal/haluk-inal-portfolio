import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from './ui/button';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest uppercase text-white/70 mb-6 backdrop-blur-sm">
            Based in Bursa / Kütahya
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6"
        >
          CREATIVE
          <br />
          TECHNOLOGIST
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
        >
          Bridging the gap between <span className="text-blue-400 font-semibold">Engineering Precision</span> and <span className="text-purple-400 font-semibold">Cinematic Storytelling</span>.
          I build scalable web applications and craft compelling visual narratives.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-200" onClick={() => document.getElementById('portfolio')?.scrollIntoView()}>
            View Work
          </Button>
          <Button size="lg" variant="outline" className="rounded-full border-white/20 hover:bg-white/10" onClick={() => document.getElementById('contact')?.scrollIntoView()}>
            Contact Me
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ArrowDown className="text-white/30" />
      </motion.div>
    </section>
  );
};