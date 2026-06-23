import React, { useState } from 'react';
import { Network, Server, FileDigit, List, Layers, Search, GitBranch, Cpu, ShieldAlert } from 'lucide-react';
import './StudyMaterials.css';

export default function StudyMaterials() {
  const [activeTab, setActiveTab] = useState('dhcp');

  const renderContent = () => {
    switch (activeTab) {
      case 'dhcp':
        return (
          <div className="material-content">
            <h2>DHCP (Dynamic Host Configuration Protocol)</h2>
            <p>DHCP slouží k automatickému přidělování IP adres, masky, výchozí brány a DNS serverů hostitelům v síti. Využívá porty UDP 67 (server) a UDP 68 (klient).</p>
            
            <h3>Proces D.O.R.A.</h3>
            <p>Při získávání IP adresy probíhá komunikace ve čtyřech krocích, označovaných jako D.O.R.A.:</p>
            <div className="dora-steps">
              <div className="dora-card">
                <div className="dora-icon">D</div>
                <h4>Discover (Objev)</h4>
                <p>Klient odešle všesměrový (Broadcast) paket <code>DHCPDISCOVER</code>, kterým hledá jakýkoliv dostupný DHCP server v síti. Zdrojová IP je 0.0.0.0, cílová 255.255.255.255.</p>
              </div>
              <div className="dora-card">
                <div className="dora-icon">O</div>
                <h4>Offer (Nabídka)</h4>
                <p>DHCP server odpoví zprávou <code>DHCPOFFER</code>. Nabízí v ní klientovi konkrétní IP adresu a další parametry ze svého adresního poolu (fondu).</p>
              </div>
              <div className="dora-card">
                <div className="dora-icon">R</div>
                <h4>Request (Žádost)</h4>
                <p>Klient si vybere jednu nabídku (pokud by bylo v síti více DHCP serverů) a odešle <code>DHCPREQUEST</code>. Tím oficiálně žádá o pronájem dané IP adresy a informuje o tom ostatní servery, aby si své nabídky stáhly.</p>
              </div>
              <div className="dora-card">
                <div className="dora-icon">A</div>
                <h4>Acknowledge (Potvrzení)</h4>
                <p>Server pošle zprávu <code>DHCPACK</code>. Potvrzuje, že adresa je pronajata na určitou dobu (Lease Time), a klient ji může začít používat.</p>
              </div>
            </div>
            <div className="info-alert">
              <strong>Tip pro CCNA:</strong> Pokud router odděluje sítě a DHCP server je v jiné síti než klienti, musíme na routeru nakonfigurovat <code>ip helper-address</code>. Router pak přeposílá DHCP broadcasty jako unicasty přímo na server (funguje jako tzv. DHCP Relay).
            </div>
          </div>
        );

      case 'slaac':
        return (
          <div className="material-content">
            <h2>SLAAC (Stateless Address Autoconfiguration)</h2>
            <p>SLAAC je mechanismus v sítích IPv6, který umožňuje zařízením automaticky vygenerovat svou vlastní unikátní IPv6 adresu bez nutnosti kontaktovat stavový DHCPv6 server.</p>
            
            <h3>Jak SLAAC funguje?</h3>
            <ul className="material-list">
              <li><strong>1. Fáze - Router Solicitation (RS):</strong> Po připojení do sítě odešle počítač všesměrovou (Multicast) zprávu RS (ICMPv6 typ 133) a ptá se: <em>"Je tu nějaký IPv6 router?"</em></li>
              <li><strong>2. Fáze - Router Advertisement (RA):</strong> Router v síti odpoví zprávou RA (ICMPv6 typ 134). Zpráva obsahuje tzv. <strong>Prefix sítě</strong> (např. prvních 64 bitů adresy) a informaci o výchozí bráně. Počítače tuto RA zprávu navíc dostávají od routeru automaticky každých zhruba 200 sekund.</li>
              <li><strong>3. Fáze - Generování Interface ID:</strong> Počítač si vezme prefix od routeru a chybějící část adresy (zbylých 64 bitů) si vygeneruje sám, buď zcela náhodně, nebo pomocí procesu EUI-64.</li>
            </ul>

            <h3>Tvorba adresy pomocí EUI-64</h3>
            <p>EUI-64 je metoda, jak ze své fyzické MAC adresy (48 bitů) vygenerovat jedinečné IPv6 rozhraní (64 bitů).</p>
            <div className="eui-process">
              <div className="eui-step"><strong>MAC adresa:</strong> <br/>00:1A:2B:3C:4D:5E</div>
              <div className="eui-step"><strong>Rozdělení napůl:</strong> <br/>00:1A:2B | 3C:4D:5E</div>
              <div className="eui-step"><strong>Vložení FFFE:</strong> <br/>00:1A:2B : <strong>FF:FE</strong> : 3C:4D:5E</div>
              <div className="eui-step"><strong>Překlopení 7. bitu:</strong> <br/><strong>02</strong>:1A:2B : FF:FE : 3C:4D:5E</div>
            </div>
            
            <div className="info-alert warning">
              <strong>Zabezpečení (DAD):</strong> Předtím, než klient začne IPv6 adresu vytvořenou přes SLAAC naplno používat, vždy spustí tzv. DAD (Duplicate Address Detection), aby se ujistil, že si stejnou adresu náhodou nevygeneroval ještě někdo jiný.
            </div>
          </div>
        );

      case 'frame':
        return (
          <div className="material-content">
            <h2>Struktura Ethernetového Rámce (L2)</h2>
            <p>Při komunikaci na linkové vrstvě (L2 - např. uvnitř switche) se data balí do tzv. rámců (Frames). Standardní rámec IEEE 802.3 má maximální velikost 1518 Bytů (bez preambule) a vypadá následovně:</p>
            
            <div className="protocol-diagram frame-diagram">
              <div className="pd-field size-7 bg-gray" title="Slouží k synchronizaci taktu mezi odesílatelem a příjemcem (strídání 1 a 0).">
                <span className="pd-name">Preambule</span>
                <span className="pd-size">7 Bytů</span>
              </div>
              <div className="pd-field size-1 bg-gray" title="Start Frame Delimiter. Konec preambule a začátek samotného rámce.">
                <span className="pd-name">SFD</span>
                <span className="pd-size">1 Byte</span>
              </div>
              <div className="pd-field size-6 bg-red" title="Fyzická MAC adresa cílového zařízení.">
                <span className="pd-name">Dest. MAC</span>
                <span className="pd-size">6 Bytů</span>
              </div>
              <div className="pd-field size-6 bg-blue" title="Fyzická MAC adresa odesílajícího zařízení.">
                <span className="pd-name">Source MAC</span>
                <span className="pd-size">6 Bytů</span>
              </div>
              <div className="pd-field size-2 bg-yellow" title="Identifikuje, jaký protokol vyšší vrstvy je zabalen uvnitř (např. 0x0800 pro IPv4, 0x86DD pro IPv6).">
                <span className="pd-name">Type / EtherType</span>
                <span className="pd-size">2 Byty</span>
              </div>
              <div className="pd-field size-flex bg-green" title="Samotná odesílaná data (PDU z vrstvy 3 - např. celý IP paket). Pokud jsou data menší než 46 Bytů, musí se doplnit (Padding).">
                <span className="pd-name">Data (Payload) + Pad</span>
                <span className="pd-size">46 - 1500 Bytů</span>
              </div>
              <div className="pd-field size-4 bg-orange" title="Frame Check Sequence. Využívá algoritmus CRC k detekci chyb způsobených poškozením rámce při cestě po kabelu.">
                <span className="pd-name">FCS</span>
                <span className="pd-size">4 Byty</span>
              </div>
            </div>

            <ul className="material-list mt-2">
              <li><strong>MTU (Maximum Transmission Unit):</strong> Standardní Ethernet zvládne do svého těla (Payloadu) nacpat max 1500 Bytů dat.</li>
              <li><strong>FCS vs. Checksum:</strong> Zatímco protokoly na vyšších vrstvách kontrolují jen hlavičky, FCS počítá kontrolní součet z celého rámce. Switch rámec s vadným FCS okamžitě zahodí a neopravuje ho.</li>
            </ul>
          </div>
        );

      case 'packet':
        return (
          <div className="material-content">
            <h2>Struktura IP Paketu (L3)</h2>
            <p>Základním kamenem síťové komunikace v Internetu je IPv4 Paket. Hlavička IP paketu má standardně délku 20 Bytů (pokud neobsahuje volitelné Options) a jejím úkolem je doručit data napříč routery z bodu A do bodu B.</p>
            
            <div className="protocol-diagram packet-diagram">
              <div className="pd-row">
                <div className="pd-field w-10" title="Verze protokolu. U IPv4 je to vždy hodnota 4 (binárně 0100).">Version (4)</div>
                <div className="pd-field w-10" title="Internet Header Length. Určuje délku celé hlavičky (typicky 20 Bytů, hodnota 5 x 32bit slov).">IHL (4)</div>
                <div className="pd-field w-20" title="Type of Service (dnes DSCP). Využívá se pro mechanismy QoS (Quality of Service) pro prioritizaci provozu (např. hlasu).">ToS / DSCP (8)</div>
                <div className="pd-field w-60 bg-yellow" title="Total Length. Celková délka celého IP paketu (hlavička + data) v Bytech.">Total Length (16 bitů)</div>
              </div>
              <div className="pd-row">
                <div className="pd-field w-50 bg-red" title="Identifikační číslo používané, pokud dojde k fragmentaci (rozdělení paketu na menší kusy), aby je šlo u cíle spojit dohromady.">Identification (16 bitů)</div>
                <div className="pd-field w-15" title="Tři vlajky: Reserved, Don't Fragment (DF) a More Fragments (MF).">Flags (3)</div>
                <div className="pd-field w-35 bg-orange" title="Fragment Offset. Pokud je paket rozdělen na kusy, tato hodnota určuje, kam přesně do celku tento daný kus patří.">Fragment Offset (13)</div>
              </div>
              <div className="pd-row">
                <div className="pd-field w-20 bg-green" title="Time To Live. Každý router, kterým paket projde, sníží tuto hodnotu o 1. Pokud klesne na 0, paket se zahodí, aby neobíhal síť navždy.">TTL (8 bitů)</div>
                <div className="pd-field w-20 bg-blue" title="Protokol vyšší vrstvy schovaný uvnitř (např. 1 = ICMP, 6 = TCP, 17 = UDP).">Protocol (8)</div>
                <div className="pd-field w-60" title="Kontrolní součet POUZE samotné IP hlavičky (nikoliv celého těla).">Header Checksum (16 bitů)</div>
              </div>
              <div className="pd-row">
                <div className="pd-field w-100 bg-red" title="IP adresa stroje, který tento paket vytvořil a odesílá.">Source IP Address (32 bitů)</div>
              </div>
              <div className="pd-row">
                <div className="pd-field w-100 bg-blue" title="IP adresa koncového příjemce. Routery kontrolují primárně tuto hodnotu vůči své směrovací tabulce.">Destination IP Address (32 bitů)</div>
              </div>
              <div className="pd-row dashed">
                <div className="pd-field w-100" title="Volitelná pole a padding. Zřídkakdy se používají.">Options (pokud je IHL &gt; 5) a Padding</div>
              </div>
              <div className="pd-row data-payload">
                <div className="pd-field w-100" title="Zde začínají data vyšší vrstvy (hlavička TCP/UDP a aplikační data).">TĚLO PAKETU (PAYLOAD)</div>
              </div>
            </div>
            
            <p className="mt-2 text-secondary">
              * Čísla v závorkách a šířka buněk znázorňují délku pole v <strong>bitech</strong>. Celková šířka jednoho řádku hlavičky je 32 bitů (4 Byty).
            </p>
          </div>
        );

      case 'encapsulation':
        return (
          <div className="material-content">
            <h2>Proces zapouzdření (Encapsulation)</h2>
            <p>Když počítač odesílá data po síti, data postupně procházejí vrstvami OSI nebo TCP/IP modelu odshora dolů. Během tohoto procesu každá vrstva přidá ke zprávě svou vlastní řídící hlavičku. Tomuto procesu se říká <strong>zapouzdření (Encapsulation)</strong>.</p>
            
            <h3>Jak se tvoří PDU (Protocol Data Unit)</h3>
            <ul className="material-list">
              <li><strong>1. Data (L7 - Aplikační):</strong> Uživatel vytvoří zprávu (např. e-mail nebo webový požadavek).</li>
              <li><strong>2. Segment (L4 - Transportní):</strong> Data jsou předána transportní vrstvě, která je rozseká na menší části a přidá TCP nebo UDP hlavičku se zdrojovým a cílovým <strong>portem</strong>.</li>
              <li><strong>3. Paket (L3 - Síťová):</strong> Segment sestoupí na síťovou vrstvu. Zde je přidána IP hlavička se zdrojovou a cílovou <strong>IP adresou</strong>.</li>
              <li><strong>4. Rámec (L2 - Linková):</strong> Paket se obalí hlavičkou a patičkou, čímž vznikne rámec (Frame). Hlavička obsahuje fyzické <strong>MAC adresy</strong> a patička kontrolní součet (FCS) pro detekci chyb.</li>
              <li><strong>5. Bity (L1 - Fyzická):</strong> Hotový rámec se převede na proud jedniček a nul a odešle se jako elektrický, světelný nebo rádiový signál po médiu.</li>
            </ul>

            <div className="info-alert">
              <strong>De-enkapsulace:</strong> Na přijímající straně probíhá proces opačně (odspoda nahoru). Každá vrstva zkontroluje "svou" hlavičku, odtrhne ji a zbytek pošle o vrstvu výš, dokud se k uživateli nedostanou čistá data.
            </div>
          </div>
        );

      case 'arp':
        return (
          <div className="material-content">
            <h2>ARP (Address Resolution Protocol)</h2>
            <p>Počítače používají k logickému nalezení cíle IP adresy (L3). Aby ale mohly data fyzicky doručit uvnitř lokální sítě přes switche, potřebují znát fyzickou MAC adresu (L2) cílového stroje. K překladu IP adres na MAC adresy se používá protokol ARP.</p>
            
            <h3>Jak ARP funguje?</h3>
            <p>Pokud počítač 192.168.1.10 chce komunikovat s 192.168.1.20, ale nezná jeho MAC adresu, zahájí tento proces:</p>
            
            <div className="dora-steps">
              <div className="dora-card">
                <div className="dora-icon">Q</div>
                <h4>ARP Request (Dotaz)</h4>
                <p>Odesílatel křikne do celé sítě (Broadcast zpráva na MAC <code>FF:FF:FF:FF:FF:FF</code>): <em>"Kdo má IP 192.168.1.20? Oznamte mi svou MAC adresu!"</em></p>
              </div>
              <div className="dora-card">
                <div className="dora-icon">A</div>
                <h4>ARP Reply (Odpověď)</h4>
                <p>Počítač, kterému tato IP adresa patří, odpoví (Unicast zpráva přímo odesílateli): <em>"To jsem já, a moje MAC adresa je 00:1A:2B:3C:4D:5E."</em></p>
              </div>
            </div>

            <ul className="material-list">
              <li><strong>ARP Tabulka (Cache):</strong> Každé zařízení si zjištěné překlady (IP = MAC) ukládá do své dočasné ARP tabulky. Díky tomu se nemusí ptát před každým odesláním paketu znovu. Ve Windows se tato tabulka zobrazí příkazem <code>arp -a</code>.</li>
              <li><strong>A co když je cíl v jiné síti?</strong> Pokud počítač zjistí, že cíl (např. 8.8.8.8) neleží v jeho lokální síti, pošle ARP dotaz na MAC adresu své <strong>Výchozí brány (Default Gateway / Routeru)</strong>.</li>
            </ul>
          </div>
        );

      case 'stp':
        return (
          <div className="material-content">
            <h2>STP (Spanning Tree Protocol)</h2>
            <p>V moderních sítích se pro zajištění spolehlivosti (redundance) často propojují switche více kabely (do kruhu). Pokud by ale ethernetový rámec (např. Broadcast) začal obíhat v tomto kruhu donekonečna, vznikla by tzv. <strong>Broadcast Storm (Broadcastová bouře)</strong>, která by okamžitě zahltila a shodila celou síť. K zabránění tohoto problému slouží protokol STP (IEEE 802.1D).</p>
            
            <h3>Jak STP funguje?</h3>
            <ul className="material-list">
              <li><strong>Volba Root Bridge:</strong> Všechny switche si začnou posílat zprávy BPDU (Bridge Protocol Data Unit). Switch s nejnižším Bridge ID (kombinace Priority a MAC adresy) se stane "Králem" sítě – tzv. <strong>Root Bridge</strong>.</li>
              <li><strong>Blokování portů:</strong> STP strom matematicky spočítá nejkratší cesty od všech switchů k Root Bridge. Všechny nadbytečné (záložní) kabely, které by tvořily smyčku, STP logicky "odstřihne" tím, že příslušné porty přepne do stavu <strong>Blocking</strong>.</li>
              <li><strong>Výpadek kabelu:</strong> Pokud se hlavní kabel přeruší, STP si toho všimne (díky absenci BPDU zpráv), přepočítá topologii a původně zablokovaný záložní port automaticky "odemkne" (přejde do Forwarding), čímž síť zachrání.</li>
            </ul>

            <h3>Stavy portu u klasického STP</h3>
            <div className="dora-steps">
              <div className="dora-card">
                <div className="dora-icon">B</div>
                <h4>Blocking (20s)</h4>
                <p>Port přijímá BPDU zprávy, ale neposílá data. Zabraňuje smyčkám.</p>
              </div>
              <div className="dora-card">
                <div className="dora-icon">L</div>
                <h4>Listening (15s)</h4>
                <p>Port se chystá otevřít. Odesílá a přijímá BPDU, ale zatím se neučí MAC adresy.</p>
              </div>
              <div className="dora-card">
                <div className="dora-icon">L</div>
                <h4>Learning (15s)</h4>
                <p>Port se začíná učit MAC adresy z příchozích rámců, ale data ještě nepřeposílá.</p>
              </div>
              <div className="dora-card">
                <div className="dora-icon">F</div>
                <h4>Forwarding</h4>
                <p>Port normálně funguje, odesílá a přijímá data. Standardní provozní stav.</p>
              </div>
            </div>
            
            <div className="info-alert warning">
              <strong>RSTP (Rapid Spanning Tree Protocol - 802.1w):</strong> Klasické STP potřebuje na odemčení portu 50 vteřin, což je dnes příliš pomalé. Moderní RSTP dokáže zareagovat a odemknout záložní linku v řádu několika milisekund!
            </div>
          </div>
        );

      case 'trunk':
        return (
          <div className="material-content">
            <h2>VLAN Trunking (802.1Q)</h2>
            <p>Pokud máme v síti vytvořené VLANy (Virtuální LAN) a potřebujeme je přenést z jednoho switche na druhý přes JEDEN fyzický kabel, musíme tento port nakonfigurovat jako <strong>Trunk</strong>.</p>

            <h3>Jak funguje 802.1Q Tagging?</h3>
            <p>Trunkový kabel funguje jako dálnice pro všechny VLANy. Aby ale druhý switch poznal, do které VLAN konkrétní rámec patří, musí mu první switch přidat "jmenovku" (VLAN Tag). Tento standard se nazývá IEEE 802.1Q.</p>
            <ul className="material-list">
              <li>Předtím, než switch odešle rámec do trunk portu, rozřízne Ethernetovou hlavičku.</li>
              <li>Přímo za pole "Source MAC" vloží novou <strong>4-Bytovou značku (Tag)</strong>, která obsahuje číslo dané VLANy (VLAN ID).</li>
              <li>Přepočítá kontrolní součet (FCS) a rámec odešle.</li>
              <li>Druhý switch rámec přijme, přečte si VLAN ID, značku odstraní a rámec pošle do příslušného Access portu.</li>
            </ul>

            <div className="info-alert warning">
              <strong>Native VLAN:</strong> Existuje jedna výjimka. Protzv. Native VLAN (ve výchozím stavu VLAN 1) se rámce <strong>netagují</strong>. Pokud trunkem projde rámec bez VLAN Tagu, switch ho automaticky zařadí do Native VLANy. Z bezpečnostních důvodů se doporučuje u trunku Native VLAN změnit z 1 na nějakou nepoužívanou (např. 999).
            </div>
          </div>
        );

      case 'hardware':
        return (
          <div className="material-content">
            <h2>Síťový Hardware podle vrstev OSI</h2>
            <p>Abyste správně pochopili, jak sítě fungují, je nutné vědět, na jaké vrstvě modelu (a s jakým PDU) jednotlivá fyzická zařízení pracují.</p>

            <h3>Vrstva 1: Fyzická (Bity a Signály)</h3>
            <ul className="material-list">
              <li><strong>Repeater (Opakovač):</strong> Nehloupější zařízení. Přijme zesláblý signál z jednoho konce kabelu, zesílí ho a pošle dál. Nechápe IP ani MAC adresy, jen kopíruje bity (elektrické impulsy).</li>
              <li><strong>Hub (Rozbočovač):</strong> V podstatě víceportový opakovač. Pokud do něj vstoupí signál na portu 1, Hub ho zkopíruje a rozešle na VŠECHNY ostatní porty najednou. Je to neefektivní a vznikají zde kolize (všichni sdílí jednu kolizní doménu). Dnes už se nepoužívá.</li>
            </ul>

            <h3>Vrstva 2: Linková (Rámce a MAC adresy)</h3>
            <ul className="material-list">
              <li><strong>Switch (Přepínač):</strong> Inteligentní náhrada Hubu. Switch se dokáže "učit". Každý příchozí rámec prozkoumá, přečte si zdrojovou MAC adresu a uloží si ji do své <strong>MAC Adress Table</strong>. Když pak přijde rámec pro konkrétní cíl, switch přesně ví, na který port ho má odeslat, a neobtěžuje tím ostatní počítače. Tím rozděluje síť na více kolizních domén.</li>
              <li><strong>Access Point (AP):</strong> Zajišťuje bezdrátové připojení (Wi-Fi). Funguje de facto jako "bezdrátový Hub / Switch" na L1 a L2 vrstvě – převádí rádiové signály na ethernetové rámce a posílá je do drátové sítě. Sám o sobě nesměruje IP adresy (to dělá router).</li>
            </ul>

            <h3>Vrstva 3: Síťová (Pakety a IP adresy)</h3>
            <ul className="material-list">
              <li><strong>Router (Směrovač):</strong> Jeho úkolem je propojovat odlišné počítačové sítě (např. vaši domácí síť s Internetem). Router čte hlavičky IP paketů, hledá Cílovou IP adresu a na základě své <strong>Směrovací tabulky (Routing Table)</strong> se rozhoduje, kudy pošle paket dál. Na rozdíl od Switche odděluje tzv. Broadcastové domény (Broadcasty přes router neprojdou).</li>
              <li><strong>Multilayer Switch (L3 Switch):</strong> Speciální druh drahého switche, který má v sobě zabudovaný procesor pro L3 vrstvu. Dokáže tedy dělat běžné přepínání na základě MAC adres (velmi rychle hardwarově), ale umí i směrovat (routovat) IP pakety mezi různými VLANami přímo uvnitř sebe, aniž by k tomu potřeboval externí Router ("Router-on-a-stick").</li>
            </ul>
          </div>
        );

      default:
        return <div>Vyberte studijní materiál z levého menu.</div>;
    }
  };

  return (
    <div className="study-materials-container">
      <div className="sidebar">
        <h3 className="sidebar-title">
          <List size={20} />
          Seznam materiálů
        </h3>
        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${activeTab === 'dhcp' ? 'active' : ''}`}
            onClick={() => setActiveTab('dhcp')}
          >
            <Server size={18} /> DHCP Protokol
          </button>
          <button 
            className={`nav-btn ${activeTab === 'slaac' ? 'active' : ''}`}
            onClick={() => setActiveTab('slaac')}
          >
            <Network size={18} /> SLAAC (IPv6)
          </button>
          <button 
            className={`nav-btn ${activeTab === 'frame' ? 'active' : ''}`}
            onClick={() => setActiveTab('frame')}
          >
            <FileDigit size={18} /> L2 Ethernet Frame
          </button>
          <button 
            className={`nav-btn ${activeTab === 'packet' ? 'active' : ''}`}
            onClick={() => setActiveTab('packet')}
          >
            <FileDigit size={18} /> L3 IP Packet
          </button>
          <button 
            className={`nav-btn ${activeTab === 'encapsulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('encapsulation')}
          >
            <Layers size={18} /> Proces zapouzdření
          </button>
          <button 
            className={`nav-btn ${activeTab === 'arp' ? 'active' : ''}`}
            onClick={() => setActiveTab('arp')}
          >
            <Search size={18} /> ARP Protokol
          </button>
          <button 
            className={`nav-btn ${activeTab === 'stp' ? 'active' : ''}`}
            onClick={() => setActiveTab('stp')}
          >
            <GitBranch size={18} /> STP Protokol
          </button>
          <button 
            className={`nav-btn ${activeTab === 'trunk' ? 'active' : ''}`}
            onClick={() => setActiveTab('trunk')}
          >
            <ShieldAlert size={18} /> VLAN Trunking
          </button>
          <button 
            className={`nav-btn ${activeTab === 'hardware' ? 'active' : ''}`}
            onClick={() => setActiveTab('hardware')}
          >
            <Cpu size={18} /> Síťový Hardware
          </button>
        </nav>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}
