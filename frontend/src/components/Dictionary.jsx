import React, { useState } from 'react';
import { Search, BookA } from 'lucide-react';
import dictionaryData from '../data/dictionary.json';
import './Dictionary.css';

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrace podle zkratky, anglického názvu nebo českého překladu
  const filteredWords = dictionaryData.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.abbr.toLowerCase().includes(term) ||
      item.en.toLowerCase().includes(term) ||
      item.cs.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dictionary-container">
      <div className="dictionary-header">
        <h2>Slovník CCNA Zkratek</h2>
        <p>Rychlý přehled nejdůležitějších pojmů z oblasti počítačových sítí</p>
      </div>

      <div className="search-bar-wrapper">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text"
            placeholder="Hledat zkratku (např. VLAN, OSPF...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="dictionary-grid">
        {filteredWords.length > 0 ? (
          filteredWords.map((item, index) => (
            <div key={index} className="dict-card">
              <div className="dict-card-header">
                <h3>{item.abbr}</h3>
                <span className="dict-en">{item.en}</span>
              </div>
              <div className="dict-card-body">
                <span className="dict-cs">{item.cs}</span>
                <p className="dict-desc">{item.desc}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <BookA size={48} className="no-results-icon" />
            <h3>Nebyly nalezeny žádné zkratky pro "{searchTerm}"</h3>
            <p>Zkuste zadat jiný výraz nebo zkontrolujte překlepy.</p>
          </div>
        )}
      </div>
    </div>
  );
}
