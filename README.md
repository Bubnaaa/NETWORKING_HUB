# CCNA Networking Hub - Škola VDF

Komplexní a interaktivní výuková aplikace navržená pro studenty počítačových sítí (zejména pro osnovy Cisco CCNA 1 a CCNA 2). Tento projekt poskytuje vizuální, teoretické i praktické nástroje, jak pochopit složité síťové principy v moderním a profesionálním uživatelském prostředí.

## 🚀 Hlavní moduly aplikace

1. **OSI a TCP/IP Model (Interaktivní mapa)**
   - Myšlenková mapa (vytvořená pomocí `React Flow`) pro zkoumání 7 vrstev modelu OSI a 4 vrstev modelu TCP/IP.
   - Možnost plynulého přepínání mezi OSI a TCP/IP zobrazením.
   - 3 obtížnosti:
     - **Lvl 1 (Základy):** Přehled vrstev a jejich PDU (bity, rámce, pakety, segmenty).
     - **Lvl 2 (Protokoly):** Zařazení protokolů (HTTP, TCP, UDP, IP, Ethernet) k příslušným vrstvám.
     - **Lvl 3 (Detaily):** Fyzické konektory, MAC a IP adresy, typy propustností a konkrétní ukázky.
   - Interaktivní detaily při rozkliknutí každého uzlu s obrázky a vysvětlením.

2. **IP Subnet Calculator (Kalkulačka podsítí)**
   - Nástroj pro okamžitý výpočet IPv4 rozsahů.
   - Obsahuje výpočet Masek, Network adresy, První/Poslední použitelné adresy a Broadcast adresy.
   - Binární reprezentace výpočtů pro lepší pochopení mechanismu ANDingu.

3. **Slovník CCNA Zkratek**
   - Obrovská, plně prohledávatelná databáze zkratek používaných v síťařině.
   - Okamžité filtrování zkratek na základě uživatelského vstupu.
   - Karty zkratek v elegantním moderním designu (bez těžkého glassmorphismu pro čistší vzhled).

4. **Studijní Materiály**
   - Teoretické a vizuální ukázky nejrůznějších síťových fenoménů:
     - **Protokoly:** DHCP proces (DORA), IPv6 SLAAC.
     - **Zapouzdření (Encapsulation):** Jak vypadá L2 Ethernet Frame a L3 IPv4 Packet.
     - **Další mechanismy:** ARP protokol, STP (Spanning Tree), VLAN Trunking (802.1Q).
     - **Síťový Hardware:** Rozdělení L1, L2 a L3 zařízení (Repeater, Switch, Router).
   - Obohaceno o schémata, informační boxy a konkrétní doporučení z praxe.

5. **Cisco IOS Příkazy (Tahák)**
   - Vizuálně zpracované do podoby modrého terminálu.
   - Nejčastěji používané příkazy pro konfiguraci Cisco switchů a routerů.
   - Komplet pro Základní nastavení, VLAN, STP, OSPF a IPv6.

6. **Lokální CCNA AI Asistent (Offline Chatbot)**
   - V pravém dolním rohu se skrývá plovoucí bot.
   - Je napsán čistě pomocí vlastní logiky (bez použití drahých API).
   - Dokáže prohledávat lokální `dictionary.json` a odpovídat na dotazy ohledně termínů.
   - Chytře navádí studenty do konkrétních modulů aplikace (Kalkulačka atd.).

## 🛠 Použité technologie

Aplikace je postavena na moderním JavaScriptovém stacku s důrazem na rychlost a plynulé animace.

- **Frontend Framework:** React 18
- **Build Nástroj:** Vite (zajišťuje neuvěřitelně rychlý Hot Module Replacement a optimální build).
- **Routování:** React Router DOM (Použito `HashRouter` pro kompatibilitu s GitHub Pages).
- **Stylování:** Čisté Vanilla CSS s důrazem na CSS Proměnné (Variables) pro snadnou správu motivů a responzivity.
- **Ikony:** Lucide React (Konzistentní a krásné vektorové ikony).
- **Myšlenková mapa:** `@xyflow/react` (Dříve React Flow - pro renderování OSI mapy s node/edge architekturou).
- **Přepínání motivů:** Integrovaný Dark / Light mode (ukládání preference do `localStorage`).

## 🎨 Design

Aplikace byla původně stylizována do "Glassmorphism" designu, avšak prošla revizí na **čistší, profesionální (Enterprise / Edu) plochý design**.  
Základní barvou aplikace je **#006783** (Tmavá azurová) a žlutá **#F7D117** převzatá z loga Školy VDF. Karty v dark módu využívají poloprůhledné černé barvy (`rgba(0,0,0,0.5)`), zatímco hrany byly zjemněny pro serióznější pocit.

## 📦 Nasazení (Deployment) na GitHub Pages

Projekt je připraven k automatizovanému nasazení přes **GitHub Actions**.
1. Pokaždé, když se kód pošle (push) do větve `main`, GitHub automaticky spustí Workflow definované v `.github/workflows/deploy.yml`.
2. Akce nainstaluje závislosti (`npm install`), postaví projekt (`npm run build`) a výslednou složku `dist` nasadí (publish) na Github Pages (přes `gh-pages` větev).
3. Díky použití `HashRouter` se adresy mapují pomocí znaku `#` (např. `/#/osi`), což předchází 404 chybám na statickém hostingu.

---
*Vytvořil Michal Bubna © 2026 pro potřeby výuky sítí.*
