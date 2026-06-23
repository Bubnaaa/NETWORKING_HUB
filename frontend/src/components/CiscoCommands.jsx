import React, { useState } from 'react';
import { Terminal, Settings, Network, Router, MonitorSpeaker, AlertTriangle } from 'lucide-react';
import './CiscoCommands.css';

export default function CiscoCommands() {
  const [activeCategory, setActiveCategory] = useState('basic');

  const renderTerminalBlock = (prompt, command, description) => (
    <div className="command-item">
      <div className="terminal-block">
        <span className="term-prompt">{prompt}</span>
        <span className="term-command">{command}</span>
      </div>
      <p className="command-desc">{description}</p>
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'basic':
        return (
          <div className="command-content">
            <h2>Základní konfigurace (Basic Device Config)</h2>
            <p>Příkazy pro prvotní nastavení každého routeru a switche po vybalení z krabice.</p>
            
            <h3 className="section-title">Přejmenování a Zabezpečení</h3>
            {renderTerminalBlock('Router>', 'enable', 'Přechod z uživatelského režimu do privilegovaného režimu (Enable mode).')}
            {renderTerminalBlock('Router#', 'configure terminal', 'Vstup do režimu globální konfigurace, kde se provádějí veškeré změny.')}
            {renderTerminalBlock('Router(config)#', 'hostname R1', 'Změna jména zařízení na "R1". V promptu se okamžitě projeví jako R1(config)#.')}
            {renderTerminalBlock('Router(config)#', 'enable secret cisco', 'Nastavení zašifrovaného hesla (např. "cisco") pro vstup do privilegovaného režimu.')}
            
            <h3 className="section-title">Zabezpečení linek (Konzole a VTY)</h3>
            {renderTerminalBlock('Router(config)#', 'line console 0', 'Vstup do konfigurace fyzického konzolového portu.')}
            {renderTerminalBlock('Router(config-line)#', 'password class\\nlogin', 'Nastavení hesla "class" a vynucení přihlášení přes konzoli.')}
            {renderTerminalBlock('Router(config)#', 'line vty 0 4', 'Vstup do konfigurace virtuálních linek pro vzdálený přístup (Telnet/SSH) pro až 5 současných spojení (0 až 4).')}
            {renderTerminalBlock('Router(config-line)#', 'transport input ssh', 'Povolení pouze zabezpečeného SSH připojení na VTY linkách (zakáže nebezpečný Telnet).')}

            <h3 className="section-title">Ukládání a správa</h3>
            {renderTerminalBlock('Router(config)#', 'service password-encryption', 'Zašifruje všechna hesla uložená v textové podobě v konfiguračním souboru.')}
            {renderTerminalBlock('Router#', 'copy running-config startup-config', 'Uloží aktuální běžící konfiguraci z RAM do paměti NVRAM. (Příkaz se zadává v privilegovaném režimu!)')}
          </div>
        );

      case 'interfaces':
        return (
          <div className="command-content">
            <h2>Konfigurace Rozhraní (Interfaces)</h2>
            <p>Aktivace a adresování jednotlivých portů routeru a switche.</p>
            
            <h3 className="section-title">Nastavení IPv4 a IPv6</h3>
            {renderTerminalBlock('Router(config)#', 'interface GigabitEthernet0/0', 'Vstup do konfigurace specifického rozhraní (lze použít i zkráceně: int g0/0).')}
            {renderTerminalBlock('Router(config-if)#', 'ip address 192.168.1.1 255.255.255.0', 'Přiřazení IPv4 adresy a masky sítě na dané rozhraní.')}
            {renderTerminalBlock('Router(config-if)#', 'ipv6 address 2001:db8:acad:1::1/64', 'Přiřazení IPv6 adresy s délkou prefixu.')}
            {renderTerminalBlock('Router(config-if)#', 'ipv6 address fe80::1 link-local', 'Přiřazení specifické Link-Local IPv6 adresy, která nekomunikuje přes routery.')}
            {renderTerminalBlock('Router(config-if)#', 'description Linka do reditelstvi', 'Přidání popisku k rozhraní pro lepší orientaci správce.')}
            {renderTerminalBlock('Router(config-if)#', 'no shutdown', 'ZAPNUTÍ rozhraní (porty routeru jsou z výroby administrativně vypnuté).')}

            <h3 className="section-title">Sub-Interfaces (Router-on-a-Stick)</h3>
            {renderTerminalBlock('Router(config)#', 'interface GigabitEthernet0/0.10', 'Vytvoření logického podrozhraní (Sub-interface) .10 pro směrování VLAN 10.')}
            {renderTerminalBlock('Router(config-subif)#', 'encapsulation dot1q 10', 'Nastavení enkapsulace 802.1Q a přiřazení k VLAN ID 10. (Nutno provést před zadáním IP adresy!)')}
          </div>
        );

      case 'switching':
        return (
          <div className="command-content">
            <h2>Přepínání a VLANy (Switching)</h2>
            <p>Rozdělování sítí pomocí VLAN, trunkování, EtherChannel a Port Security.</p>

            <h3 className="section-title">Vytvoření a přiřazení VLAN</h3>
            {renderTerminalBlock('Switch(config)#', 'vlan 10', 'Vytvoření VLAN s ID 10 v databázi switche.')}
            {renderTerminalBlock('Switch(config-vlan)#', 'name IT_Oddeleni', 'Pojmenování dané VLAN.')}
            {renderTerminalBlock('Switch(config)#', 'interface FastEthernet0/5', 'Vstup do konfigurace přístupového portu pro koncové PC.')}
            {renderTerminalBlock('Switch(config-if)#', 'switchport mode access', 'Zafixování portu do Access režimu (nikdy z něj nebude Trunk).')}
            {renderTerminalBlock('Switch(config-if)#', 'switchport access vlan 10', 'Zařazení tohoto portu trvale do VLAN 10.')}

            <h3 className="section-title">Trunkové porty</h3>
            {renderTerminalBlock('Switch(config-if)#', 'switchport mode trunk', 'Nastavení portu (obvykle propojujícího 2 switche) do režimu Trunk, aby přenášel všechny VLANy.')}
            {renderTerminalBlock('Switch(config-if)#', 'switchport trunk allowed vlan 10,20', 'Omezení Trunku pouze na propouštění VLAN 10 a 20 (z bezpečnostních důvodů).')}

            <h3 className="section-title">Zabezpečení portu (Port Security)</h3>
            {renderTerminalBlock('Switch(config-if)#', 'switchport port-security', 'Aktivace funkce Port Security na přístupovém portu.')}
            {renderTerminalBlock('Switch(config-if)#', 'switchport port-security mac-address sticky', 'Switch se dynamicky naučí první připojenou MAC adresu a trvale si ji uloží.')}
            {renderTerminalBlock('Switch(config-if)#', 'switchport port-security violation restrict', 'V případě připojení "cizího" zařízení zahodí jeho provoz, ale nevypne port úplně (pošle log zprávu).')}
          </div>
        );

      case 'routing':
        return (
          <div className="command-content">
            <h2>Směrování (Routing)</h2>
            <p>Nastavení cest a směrovacích protokolů pro předávání IP paketů mezi sítěmi.</p>

            <h3 className="section-title">Statické směrování (IPv4 & IPv6)</h3>
            {renderTerminalBlock('Router(config)#', 'ip route 192.168.2.0 255.255.255.0 10.1.1.2', 'Statická cesta: "Do sítě 192.168.2.0/24 se dostaneš přes sousední router na IP 10.1.1.2".')}
            {renderTerminalBlock('Router(config)#', 'ip route 0.0.0.0 0.0.0.0 Serial0/0/0', 'Výchozí statická cesta (Default route): Cokoliv, co router nezná, pošle automaticky na sériové rozhraní do Internetu.')}
            {renderTerminalBlock('Router(config)#', 'ipv6 unicast-routing', 'GLOBÁLNÍ PŘÍKAZ NUTNÝ PRO ZAPNUTÍ IPv6 SMĚROVÁNÍ NA ROUTERU!')}

            <h3 className="section-title">OSPF (Open Shortest Path First)</h3>
            {renderTerminalBlock('Router(config)#', 'router ospf 1', 'Spuštění procesu OSPF s lokálním ID 1.')}
            {renderTerminalBlock('Router(config-router)#', 'router-id 1.1.1.1', 'Nastavení identifikátoru (jména) routeru pro OSPF topologii.')}
            {renderTerminalBlock('Router(config-router)#', 'network 192.168.1.0 0.0.0.255 area 0', 'Zařazení specifické sítě s využitím INVERZNÍ MASKY (Wildcard mask) do OSPF Area 0.')}
            {renderTerminalBlock('Router(config-router)#', 'passive-interface GigabitEthernet0/0', 'Zamezení odesílání OSPF Hello paketů na rozhraní, kde jsou pouze PC (bezpečnost a úspora výkonu).')}

            <h3 className="section-title">DHCP Server konfigurace</h3>
            {renderTerminalBlock('Router(config)#', 'ip dhcp excluded-address 192.168.1.1 192.168.1.10', 'Zabránění přidělování adres .1 až .10 (rezervováno staticky např. pro router a servery).')}
            {renderTerminalBlock('Router(config)#', 'ip dhcp pool LAN_POOL', 'Vytvoření rozsahu (poolu) pro DHCP s názvem LAN_POOL.')}
            {renderTerminalBlock('Router(dhcp-config)#', 'network 192.168.1.0 255.255.255.0', 'Definování adresního rozsahu k přidělování.')}
            {renderTerminalBlock('Router(dhcp-config)#', 'default-router 192.168.1.1', 'Přiřazení výchozí brány počítačům z tohoto poolu.')}
            {renderTerminalBlock('Router(dhcp-config)#', 'dns-server 8.8.8.8', 'Přiřazení adresy DNS serveru.')}
          </div>
        );

      case 'trouble':
        return (
          <div className="command-content">
            <h2>Diagnostika (Show příkazy a Troubleshoot)</h2>
            <p>Příkazy, které jsou v CCNA nejpoužívanější k ověřování, co vlastně síť dělá a kde je chyba.</p>

            <h3 className="section-title">Ověřování tabulek a rozhraní</h3>
            {renderTerminalBlock('Router#', 'show ip interface brief', 'Rychlý přehled všech portů routeru, jejich IP adres a zda jsou zapnuté (Status = up). Tzv. "show ip int br".')}
            {renderTerminalBlock('Router#', 'show ip route', 'Zobrazí kompletní směrovací tabulku (kudy router posílá pakety). Vládnou jí značky C (Connected), L (Local), S (Static), O (OSPF).')}
            {renderTerminalBlock('Switch#', 'show mac address-table', 'Zobrazí MAC tabulku přepínače (na kterém fyzickém portu sedí jaká MAC adresa koncového zařízení).')}
            {renderTerminalBlock('Switch#', 'show vlan brief', 'Vypíše seznam vytvořených VLAN a zjistíte, do které VLAN patří které porty.')}
            
            <h3 className="section-title">Sledování sousedů a protokolů</h3>
            {renderTerminalBlock('Router#', 'show cdp neighbors', 'Zobrazí přehled přímo fyzicky připojených Cisco zařízení (model switche/routeru, na jakém portu sedí).')}
            {renderTerminalBlock('Router#', 'show ip ospf neighbor', 'Ověří, zda váš router úspěšně navázal OSPF sousedství s dalším routerem. Musí být ve stavu FULL.')}

            <h3 className="section-title">Komunikace a diagnostika konfigurace</h3>
            {renderTerminalBlock('Router#', 'show running-config', 'Vypíše kompletní aktuální konfiguraci routeru nebo switche do konzole.')}
            {renderTerminalBlock('Router#', 'ping 192.168.1.10', 'Pošle 5 ICMP Echo paketů na zadanou adresu k ověření dosledovatelnosti na L3.')}
            {renderTerminalBlock('Router#', 'traceroute 8.8.8.8', 'Sleduje cestu paketu po každém jednotlivém routeru (Hopu) po cestě do cíle.')}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cisco-commands-container">
      <div className="sidebar">
        <h3 className="sidebar-title">
          <Terminal size={20} />
          Tahák Příkazů
        </h3>
        <nav className="sidebar-nav">
          <button className={`nav-btn ${activeCategory === 'basic' ? 'active' : ''}`} onClick={() => setActiveCategory('basic')}>
            <Settings size={18} /> Základní nastavení
          </button>
          <button className={`nav-btn ${activeCategory === 'interfaces' ? 'active' : ''}`} onClick={() => setActiveCategory('interfaces')}>
            <MonitorSpeaker size={18} /> Konfigurace Rozhraní
          </button>
          <button className={`nav-btn ${activeCategory === 'switching' ? 'active' : ''}`} onClick={() => setActiveCategory('switching')}>
            <Network size={18} /> Přepínání a VLAN
          </button>
          <button className={`nav-btn ${activeCategory === 'routing' ? 'active' : ''}`} onClick={() => setActiveCategory('routing')}>
            <Router size={18} /> L3 Směrování (Routing)
          </button>
          <button className={`nav-btn ${activeCategory === 'trouble' ? 'active' : ''}`} onClick={() => setActiveCategory('trouble')}>
            <AlertTriangle size={18} /> Diagnostika (Show)
          </button>
        </nav>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}
