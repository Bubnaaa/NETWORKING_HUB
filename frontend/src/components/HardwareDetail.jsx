import React from 'react';
import { X, Ruler } from 'lucide-react';
import './HardwareDetail.css';

export default function HardwareDetail({ hardware, onClose }) {
  if (!hardware) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <h3>{hardware.name}</h3>
        </div>
        
        <div className="modal-body">
          <div className="image-container">
            {/* V reálném použití by se načítal obrázek ze složky /images/ */}
            {hardware.image ? (
              <img src={hardware.image} alt={hardware.name} className="hw-image" onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/400x300/1e293b/3b82f6?text=" + encodeURIComponent(hardware.name);
              }}/>
            ) : (
              <div className="hw-image-placeholder">Obrázek není k dispozici</div>
            )}
            
            {hardware.scale && (
              <div className="scale-indicator">
                <Ruler size={16} />
                <span>Měřítko: {hardware.scale}</span>
              </div>
            )}
          </div>
          
          <div className="hw-description">
            <p>{hardware.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
