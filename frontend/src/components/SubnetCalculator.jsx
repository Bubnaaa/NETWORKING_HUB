import React, { useState, useEffect } from 'react';
import { Network, Server, Globe, Monitor, HelpCircle, Sigma } from 'lucide-react';
import './SubnetCalculator.css';

// Pomocné funkce pro výpočty IP
function ip2int(ip) {
  return ip.split('.').reduce((ipInt, octet) => (ipInt << 8) + parseInt(octet, 10), 0) >>> 0;
}

function int2ip(ipInt) {
  return [
    (ipInt >>> 24),
    (ipInt >> 16 & 255),
    (ipInt >> 8 & 255),
    (ipInt & 255)
  ].join('.');
}

function toBinaryString(ipInt) {
  const bin = (ipInt >>> 0).toString(2).padStart(32, '0');
  return `${bin.slice(0, 8)}.${bin.slice(8, 16)}.${bin.slice(16, 24)}.${bin.slice(24, 32)}`;
}

export default function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState('192.168.1.10');
  const [cidr, setCidr] = useState(24);
  const [error, setError] = useState('');

  // Výsledky
  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateSubnet();
  }, [ipAddress, cidr]);

  const calculateSubnet = () => {
    setError('');

    // Jednoduchá validace IPv4
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress)) {
      setError('Neplatná IPv4 adresa');
      setResults(null);
      return;
    }

    const ipInt = ip2int(ipAddress);
    const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | (~maskInt)) >>> 0;

    let minHost = '-';
    let maxHost = '-';
    let totalHosts = 0;

    if (cidr <= 30) {
      minHost = int2ip(networkInt + 1);
      maxHost = int2ip(broadcastInt - 1);
      totalHosts = Math.pow(2, 32 - cidr) - 2;
    } else if (cidr === 31) {
      minHost = int2ip(networkInt);
      maxHost = int2ip(broadcastInt);
      totalHosts = 2; // Point-to-point
    } else if (cidr === 32) {
      minHost = int2ip(ipInt);
      maxHost = int2ip(ipInt);
      totalHosts = 1; // Host
    }

    setResults({
      ip: ipAddress,
      mask: int2ip(maskInt),
      network: int2ip(networkInt),
      broadcast: int2ip(broadcastInt),
      minHost,
      maxHost,
      totalHosts,
      ipBin: toBinaryString(ipInt),
      maskBin: toBinaryString(maskInt),
      networkBin: toBinaryString(networkInt),
    });
  };

  const handleIpChange = (e) => {
    setIpAddress(e.target.value);
  };

  const handleCidrChange = (e) => {
    setCidr(parseInt(e.target.value, 10));
  };

  return (
    <div className="subnet-container">
      <div className="subnet-header">
        <h2>IPv4 Subnet Kalkulačka</h2>
        <p>Vypočítejte parametry sítě a prozkoumejte binární reprezentaci</p>
      </div>

      <div className="subnet-input-card">
        <div className="input-group">
          <label>IP Adresa</label>
          <input 
            type="text" 
            value={ipAddress} 
            onChange={handleIpChange}
            placeholder="např. 192.168.1.10"
            className={error ? 'input-error' : ''}
          />
          {error && <span className="error-text">{error}</span>}
        </div>

        <div className="input-group">
          <label>Maska sítě (CIDR): /{cidr}</label>
          <input 
            type="range" 
            min="0" 
            max="32" 
            value={cidr} 
            onChange={handleCidrChange}
            className="cidr-slider"
          />
          <div className="mask-display">
            Maska: {results ? results.mask : '---'}
          </div>
        </div>
      </div>

      {results && (
        <>
          <div className="results-grid">
            <div className="result-card">
              <div className="icon-box"><Network /></div>
              <div className="result-info">
                <span>Síťová Adresa (Network ID)</span>
                <strong>{results.network}</strong>
              </div>
            </div>

            <div className="result-card">
              <div className="icon-box"><Globe /></div>
              <div className="result-info">
                <span>Broadcast Adresa</span>
                <strong>{results.broadcast}</strong>
              </div>
            </div>

            <div className="result-card">
              <div className="icon-box"><Monitor /></div>
              <div className="result-info">
                <span>První Využitelná IP</span>
                <strong>{results.minHost}</strong>
              </div>
            </div>

            <div className="result-card">
              <div className="icon-box"><Server /></div>
              <div className="result-info">
                <span>Poslední Využitelná IP</span>
                <strong>{results.maxHost}</strong>
              </div>
            </div>

            <div className="result-card total-hosts">
              <div className="icon-box"><Sigma /></div>
              <div className="result-info">
                <span>Celkem využitelných IP</span>
                <strong>{results.totalHosts.toLocaleString()} hostitelů</strong>
              </div>
            </div>
          </div>

          <div className="binary-card">
            <div className="binary-header">
              <HelpCircle size={20} />
              <h3>Binární Rozpad</h3>
            </div>
            <p className="binary-desc">Jak počítač vidí tuto síť v jedničkách a nulách. Operace logického AND.</p>
            
            <div className="binary-row">
              <span className="bin-label">IP Adresa:</span>
              <span className="bin-value">{results.ipBin}</span>
            </div>
            
            <div className="binary-row">
              <span className="bin-label">Maska sítě:</span>
              <span className="bin-value mask-bin">{results.maskBin}</span>
            </div>
            
            <hr className="bin-divider" />
            
            <div className="binary-row result-bin">
              <span className="bin-label">Síťová Adr.:</span>
              <span className="bin-value">{results.networkBin}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
