'use client';

import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Hero from '../components/Hero';
import ExteraSection from '../components/ExteraSection';
import KdeSection from '../components/KdeSection';
import ThemesSection from '../components/ThemesSection';
import Footer from '../components/Footer';
import FloatingDock from '../components/FloatingDock';
import FdroidModal from '../components/FdroidModal';
import PaletteModal from '../components/PaletteModal';
import Toast from '../components/Toast';
import { applyColorScheme, getSystemThemePreference } from '../lib/monet';

export default function Home() {
  const [mode, setMode] = useState('dark');
  const [scheme, setScheme] = useState('molten');
  const [isFdroidOpen, setIsFdroidOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Initialize theme on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('molten_mode') || getSystemThemePreference();
    const savedScheme = localStorage.getItem('molten_scheme') || 'molten';
    setMode(savedMode);
    setScheme(savedScheme);
    applyColorScheme(savedScheme, savedMode);
  }, []);

  const handleSelectScheme = (newScheme) => {
    setScheme(newScheme);
    localStorage.setItem('molten_scheme', newScheme);
    applyColorScheme(newScheme, mode);
  };

  const handleSelectMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('molten_mode', newMode);
    applyColorScheme(scheme, newMode);
  };

  const handleToggleMode = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    handleSelectMode(nextMode);
  };

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2800);
  };

  return (
    <div className="page-wrapper">
      <TopBar
        onOpenPalette={() => setIsPaletteOpen(true)}
        onOpenFdroid={() => setIsFdroidOpen(true)}
        mode={mode}
        onToggleMode={handleToggleMode}
      />

      <main className="content-container">
        <Hero
          onOpenFdroid={() => setIsFdroidOpen(true)}
          onShowToast={showToast}
        />

        <ExteraSection
          onOpenFdroid={() => setIsFdroidOpen(true)}
          onShowToast={showToast}
        />

        <KdeSection
          onShowToast={showToast}
        />

        <ThemesSection
          onShowToast={showToast}
        />
      </main>

      <Footer />

      <FloatingDock
        onOpenPalette={() => setIsPaletteOpen(true)}
        onOpenFdroid={() => setIsFdroidOpen(true)}
        mode={mode}
        onToggleMode={handleToggleMode}
      />

      <FdroidModal
        isOpen={isFdroidOpen}
        onClose={() => setIsFdroidOpen(false)}
        onShowToast={showToast}
      />

      <PaletteModal
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        currentScheme={scheme}
        onSelectScheme={handleSelectScheme}
        mode={mode}
        onSelectMode={handleSelectMode}
      />

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
