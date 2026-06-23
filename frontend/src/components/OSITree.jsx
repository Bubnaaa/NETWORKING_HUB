import React, { useState, useEffect } from 'react';
import { Layers, Network, Zap, Shield, Globe, Cpu, Server } from 'lucide-react';
import './OSITree.css';
import HardwareDetail from './HardwareDetail';

const iconMap = {
  7: <Globe size={24} />,
  6: <Shield size={24} />,
  5: <Server size={24} />,
  4: <Network size={24} />,
  3: <Globe size={24} />,
  2: <Layers size={24} />,
  1: <Zap size={24} />
};

export default function OSITree({ currentLevel }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHardware, setSelectedHardware] = useState(null);

  useEffect(() => {
    // Fetch data from backend
    fetch('http://localhost:3001/api/osi-model')
      .then(res => res.json())
      .then(fetchedData => {
        // Sort descending so Layer 7 is on top
        const sortedData = fetchedData.sort((a, b) => b.layer - a.layer);
        setData(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Načítání architektury sítě...</div>;

  return (
    <div className="osi-tree-container">
      {data.map((layer) => {
        if (layer.level > currentLevel) return null;

        return (
          <div key={layer.id} className={`layer-card glass-card layer-${layer.layer}`}>
            <div className="layer-header">
              <div className="layer-icon-wrapper">
                {iconMap[layer.layer] || <Layers size={24} />}
              </div>
              <div className="layer-title-group">
                <h3>{layer.layer}. {layer.name}</h3>
                <span className="layer-english">{layer.englishName}</span>
              </div>
              <div className="layer-pdu">
                <span className="badge">PDU: {layer.pdu}</span>
              </div>
            </div>

            <div className="layer-body">
              <p className="layer-description">{layer.description}</p>
              
              <div className="details-grid">
                {layer.details && layer.details.some(d => d.level <= currentLevel) && (
                  <div className="detail-section">
                    <h4>Funkce a detaily</h4>
                    <ul>
                      {layer.details.filter(d => d.level <= currentLevel).map((d, i) => (
                        <li key={i} className="animate-in">{d.text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {layer.protocols && layer.protocols.some(p => p.level <= currentLevel) && (
                  <div className="detail-section">
                    <h4>Protokoly</h4>
                    <div className="tags">
                      {layer.protocols.filter(p => p.level <= currentLevel).map((p, i) => (
                        <div key={i} className="tag animate-in protocol-tag" title={p.description}>
                          <span className="tag-name">{p.name}</span>
                          {p.port && currentLevel >= 3 && <span className="tag-port">Port: {p.port}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {layer.hardware && layer.hardware.some(h => h.level <= currentLevel) && (
                  <div className="detail-section">
                    <h4>Hardware</h4>
                    <div className="tags">
                      {layer.hardware.filter(h => h.level <= currentLevel).map((h, i) => (
                        <div 
                          key={i} 
                          className={`tag animate-in hardware-tag ${h.image ? 'clickable' : ''}`}
                          onClick={() => h.image && setSelectedHardware(h)}
                        >
                          <Cpu size={14} className="hw-icon"/>
                          {h.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {layer.concepts && layer.concepts.some(c => c.level <= currentLevel) && (
                  <div className="detail-section full-width">
                    <h4>Pokročilé koncepty</h4>
                    <div className="concept-cards">
                      {layer.concepts.filter(c => c.level <= currentLevel).map((c, i) => (
                        <div key={i} className="concept-card animate-in">
                          <h5>{c.name}</h5>
                          <p>{c.description}</p>
                          {c.code && currentLevel >= 5 && (
                            <pre className="code-block">{c.code}</pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {selectedHardware && (
        <HardwareDetail 
          hardware={selectedHardware} 
          onClose={() => setSelectedHardware(null)} 
        />
      )}
    </div>
  );
}
