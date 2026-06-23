import React from 'react';
import './LevelSelector.css';

const levels = [
  { id: 0, name: 'Freemove', desc: 'Interaktivní průzkum vrstev' },
  { id: 1, name: 'Beginner', desc: 'Základní vrstvy a PDU' },
  { id: 2, name: 'Advanced', desc: 'Hlavní protokoly a hardware' },
  { id: 3, name: 'Professional', desc: 'Procesy a porty' },
  { id: 4, name: 'Master', desc: 'Pokročilé mechanismy' },
  { id: 5, name: 'Mentor', desc: 'Kompletní detailní pohled' }
];

export default function LevelSelector({ currentLevel, setLevel, compact }) {
  return (
    <div className={`level-selector ${compact ? 'compact' : ''}`}>
      <div className="levels-container">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            className={`level-btn ${currentLevel === lvl.id ? 'active' : ''} ${currentLevel >= lvl.id ? 'unlocked' : ''}`}
            onClick={() => setLevel(lvl.id)}
            title={lvl.desc}
          >
            <div className="level-number">{lvl.id}</div>
            {!compact && (
              <div className="level-info">
                <div className="level-name">{lvl.name}</div>
                <div className="level-desc">{lvl.desc}</div>
              </div>
            )}
            {compact && <div className="level-name-compact">{lvl.name}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
