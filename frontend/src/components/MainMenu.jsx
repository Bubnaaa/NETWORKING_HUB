import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Calculator, BookA, BookOpen, Terminal } from 'lucide-react';
import './MainMenu.css';

function MainMenu() {
  return (
    <div className="main-menu-container">
      <h1 className="main-menu-title">Networking hub</h1>
      <p className="main-menu-subtitle">
        Vítejte v interaktivním průvodci počítačovými sítěmi. Vyberte si modul, se kterým chcete začít.
      </p>

      <div className="menu-grid">
        {/* OSI Model Card - Active */}
        <Link to="/osi" className="menu-card active">

          <div className="icon-wrapper">
            <Network size={36} />
          </div>
          <h3>ISO OSI a TCP/IP</h3>
          <p>
            Kompletní interaktivní myšlenková mapa vrstev, protokolů a technologií od kabelů až po webový prohlížeč.
          </p>
        </Link>

        {/* IP Subnet Calculator */}
        <Link to="/subnet" className="menu-card active">

          <div className="icon-wrapper">
            <Calculator size={36} />
          </div>
          <h3>IP Subnet Calculator</h3>
          <p>
            Nástroj pro výpočet IPv4 podsítí, masky, broadcast adres a hostitelů včetně binárního rozpisu.
          </p>
        </Link>

        {/* Slovník zkratek */}
        <Link to="/dictionary" className="menu-card active">

          <div className="icon-wrapper">
            <BookA size={36} />
          </div>
          <h3>Slovník zkratek</h3>
          <p>
            Masivní interaktivní slovník všech důležitých CCNA zkratek s fulltextovým vyhledáváním.
          </p>
        </Link>

        {/* Studijní materiály */}
        <Link to="/materials" className="menu-card active">

          <div className="icon-wrapper">
            <BookOpen size={36} />
          </div>
          <h3>Studijní materiály</h3>
          <p>
            Teoretické podklady a interaktivní vizualizace protokolů jako DHCP, SLAAC, Frame a Packet.
          </p>
        </Link>

        {/* Cisco Příkazy */}
        <Link to="/commands" className="menu-card active">

          <div className="icon-wrapper">
            <Terminal size={36} />
          </div>
          <h3>Cisco IOS Příkazy</h3>
          <p>
            Tahák s nejdůležitějšími konfiguračními příkazy a jejich vysvětlením stylizovaný do CLI terminálu.
          </p>
        </Link>
      </div>

      <footer className="main-footer">
        <p>Michal Bubna &copy; 2026</p>
        <div className="footer-links">
          <a href="https://github.com/Bubnaaa" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.skolavdf.cz" target="_blank" rel="noopener noreferrer">Škola VDF</a>
        </div>
      </footer>
    </div>
  );
}

export default MainMenu;
