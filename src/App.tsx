/**
 * Abdul Rehman — Creative Portfolio
 * Production-ready, fully animated editorial portfolio.
 */

import React, { useState, useCallback } from 'react';
import { SmoothScrollProvider } from './components/SmoothScroll';
import { CursorProvider } from './components/CustomCursor';
import { GrainOverlay } from './components/GrainOverlay';
import { ScrollProgress } from './components/ScrollProgress';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VelocityMarquee } from './components/VelocityMarquee';
import { About } from './components/About';
import { Services } from './components/Services';
import { Work } from './components/Work';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <SmoothScrollProvider>
      <CursorProvider>
        {/* Grain Film Overlay */}
        <GrainOverlay />

        {/* Scroll Progress Bar at very top */}
        <ScrollProgress />

        {/* First visit Preloader */}
        <Preloader onComplete={handlePreloaderComplete} />

        <div className="relative min-h-screen bg-[#0E0E0E] text-[#F5F5F5] overflow-x-clip selection:bg-[#7B5CFF] selection:text-white">
          {/* Navigation Bar */}
          <Navbar isLoaded={isLoaded} />

          {/* Main Landmark */}
          <main>
            {/* Hero Section */}
            <Hero isLoaded={isLoaded} />

            {/* Velocity Marquee */}
            <VelocityMarquee />

            {/* (01) About Section */}
            <About />

            {/* (02) Services Section */}
            <Services />

            {/* (03) Selected Work Section */}
            <Work />

            {/* (04) Experience Section */}
            <Experience />

            {/* (05) Skills & Toolkit */}
            <Skills />

            {/* (06) Education */}
            <Education />

            {/* (07) Contact & Project Form */}
            <Contact onShowToast={showToast} />
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notification Container */}
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div>
      </CursorProvider>
    </SmoothScrollProvider>
  );
}
