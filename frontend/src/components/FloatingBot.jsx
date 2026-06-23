import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import dictionaryData from '../data/dictionary.json';
import './FloatingBot.css';

export default function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Ahoj! Jsem tvůj studijní CCNA asistent. Zeptej se mě na jakýkoliv síťový pojem nebo zkratku (např. "Co je to DHCP?" nebo "Vysvětli mi OSPF").'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // "Hloupá" logika bota - vyhledávání klíčových slov
  const generateBotResponse = (userText) => {
    const text = userText.toLowerCase();

    // 1. Zvláštní konverzační případy
    if (text.includes('ahoj') || text.includes('dobrý den') || text.includes('dobry den') || text.includes('cau')) {
      return 'Dobrý den! Jsem zde, abych vám pomohl se zkouškou CCNA. Jaký pojem si dnes probereme?';
    }
    if (text.includes('kdo jsi') || text.includes('co jsi') || text.includes('umíš')) {
      return 'Jsem simulovaný CCNA Asistent Školy VDF. Mám v hlavě nahraný slovník zkratek a základní protokoly. Zeptejte se mě na nějaký protokol!';
    }
    if (text.includes('dekuji') || text.includes('děkuji') || text.includes('diky') || text.includes('díky')) {
      return 'Rádo se stalo! Pokud máte další dotaz ohledně sítí, ptejte se.';
    }

    // 2. Prohledání slovníku zkratek (dictionary.json)
    // Seřadíme slovník od nejdelší zkratky po nejkratší, abychom předešli tomu, 
    // že "IP" se najde uvnitř slova "EIGRP" (pokud bychom hledali jen substringy), 
    // ale my budeme hledat přesná slova
    
    // Nejprve se pokusíme najít přesnou shodu zadaného textu se zkratkou
    const exactMatch = dictionaryData.find(item => 
      text === item.abbr.toLowerCase() || 
      text === `co je to ${item.abbr.toLowerCase()}` ||
      text === `co je ${item.abbr.toLowerCase()}`
    );

    if (exactMatch) {
      return `**${exactMatch.abbr} (${exactMatch.en}):** ${exactMatch.cs}. ${exactMatch.desc}`;
    }

    // Pokud ne, zkusíme najít, jestli dotaz OBSAHUJE některou zkratku jako samostatné slovo
    const words = text.split(/[\s,?.!]+/);
    for (const word of words) {
      if (word.length < 2) continue; // Ignorujeme jednoznaková slova
      
      const match = dictionaryData.find(item => item.abbr.toLowerCase() === word);
      if (match) {
        return `Našel jsem informaci k **${match.abbr}**: ${match.desc}`;
      }
    }

    // 3. Prohledání specifických tvrdě nakódovaných materiálů z našich modulů
    if (text.includes('osi') || text.includes('tcp')) {
      return 'OSI model má 7 vrstev (Fyzická, Linková, Síťová, Transportní, Relační, Prezentační, Aplikační). TCP/IP je zjednodušený na 4 vrstvy. Doporučuji prozkoumat první dlaždici "OSI Model" na úvodní stránce!';
    }
    if (text.includes('zapouzdř') || text.includes('encapsulation')) {
      return 'Při zapouzdření (encapsulation) data putují vrstvami shora dolů a každá vrstva k nim přidá hlavičku. Vzniká tak: Data -> Segment -> Paket -> Rámec -> Bity. Podívej se do Studijních materiálů na hlavní stránce!';
    }
    if (text.includes('subnet') || text.includes('mask')) {
      return 'K výpočtu masek a podsítí máme skvělou interaktivní Kalkulačku. Najdete ji v hlavním menu. Pokud maska končí na /24, znamená to, že 24 bitů je určeno pro síť a 8 bitů pro hostitele (tedy 254 použitelných adres).';
    }

    // 4. Fallback (Nenalezeno)
    return 'Omlouvám se, ale tento pojem ve své offline databázi zatím neznám. Zkuste se zeptat na některou ze známých CCNA zkratek (např. DHCP, OSPF, VLAN, STP...).';
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulace zpoždění bota pro reálnější pocit
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: generateBotResponse(userMessage.text)
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  return (
    <div className="floating-bot-container">
      {/* Bot Tlačítko */}
      <button 
        className={`bot-toggle-btn ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare size={28} />
      </button>

      {/* Chat okno */}
      <div className={`bot-chat-window ${isOpen ? 'open' : ''}`}>
        <div className="bot-header">
          <div className="bot-header-title">
            <Bot size={24} />
            <div>
              <h4>CCNA Asistent</h4>
              <span>Offline Bot</span>
            </div>
          </div>
          <button className="bot-close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="bot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`bot-message-row ${msg.sender}`}>
              <div className="bot-message-bubble">
                {/* Jednoduché vykreslení tučného textu pomocí split */}
                {msg.text.split('**').map((part, index) => 
                  index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="bot-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Napište pojem (např. VLAN)..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" disabled={!inputValue.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
