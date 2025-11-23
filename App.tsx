import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { APP_NAME } from './constants';
import ChatWindow from './components/ChatWindow';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import Contact from './components/Contact';
import { Camera, Film, Video } from 'lucide-react';


function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-blue-500/30">
      <Navbar />
      <main>
        <Hero />
                {/* Branding Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
                  <Camera className="text-emerald-400 w-8 h-8" />
              </div>
              <div className="h-px w-8 bg-gray-700"></div>
              <div className="p-3 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
                  <Video className="text-blue-400 w-8 h-8" />
              </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            {APP_NAME}
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
            Profesyonel prodüksiyon çözümleri için yapay zeka asistanımızla projenizi planlayın.
          </p>
        </div>

        {/* Chat Component */}
        <ChatWindow />
        <About />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      
      <footer className="py-8 bg-zinc-950 border-t border-white/10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Haluk Inal. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
