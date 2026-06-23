import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import LevelSelector from './components/LevelSelector';
import OSIMindMap from './components/OSIMindMap';
import MainMenu from './components/MainMenu';
import SubnetCalculator from './components/SubnetCalculator';
import Dictionary from './components/Dictionary';
import StudyMaterials from './components/StudyMaterials';
import CiscoCommands from './components/CiscoCommands';
import FloatingBot from './components/FloatingBot';
import '@xyflow/react/dist/style.css'; // Import base styles for React Flow

function AppContent() {
  const [level, setLevel] = useState(0);
  const [theme, setTheme] = useState('light');
  const location = useLocation(); // Potrebujeme k detekci, kde jsme

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isOSIPage = location.pathname === '/osi';
  const isSubnetPage = location.pathname === '/subnet';
  const isDictionaryPage = location.pathname === '/dictionary';
  const isMaterialsPage = location.pathname === '/materials';
  const isCommandsPage = location.pathname === '/commands';

  // Určení dynamického nadpisu podle stránky
  let pageTitle = "Networking Hub";
  if (isOSIPage) pageTitle = "OSI / TCP IP Model";
  if (isSubnetPage) pageTitle = "Subnet Kalkulačka";
  if (isDictionaryPage) pageTitle = "Slovník Zkratek";
  if (isMaterialsPage) pageTitle = "Studijní Materiály";
  if (isCommandsPage) pageTitle = "IOS Příkazy";

  return (
    <div className="app-container">
      <header>
        <div className="header-left">
          {/* Pokud jsme na podstránce, zobrazíme tlačítko zpět */}
          {location.pathname !== '/' && (
            <Link to="/" className="back-button" title="Zpět do Menu">
              <ArrowLeft size={24} />
            </Link>
          )}
          <img src="/images/logo.png" alt="Škola VDF Logo" className="school-logo" />
          <h1>{pageTitle}</h1>
        </div>
        <div className="header-controls">
          {/* LevelSelector zobrazit POUZE na OSI mapě */}
          {isOSIPage && (
            <LevelSelector currentLevel={level} setLevel={setLevel} compact={true} />
          )}
          <button className="theme-toggle" onClick={toggleTheme} title="Přepnout motiv">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main className="flow-wrapper">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/osi" element={<OSIMindMap currentLevel={level} />} />
          <Route path="/subnet" element={<SubnetCalculator />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/materials" element={<StudyMaterials />} />
          <Route path="/commands" element={<CiscoCommands />} />
        </Routes>
      </main>

      {/* Globální prvek napříč všemi podstránkami */}
      <FloatingBot />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
