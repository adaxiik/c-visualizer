# VisualizerBP
## Aktivní úkoly:
- vytvořit repozitář na Githubu (privátní) + pozvat mě
### VSCode
1) Vyzkoušet si udělat jednoduchý VSCode extension + zkusit, jak se v tom "kreslí"
2) Nastudovat, jak funguje hediet.debug-visualizer + zjistit, jestli by šel využít
3) Podívat se, jak funguje debugger-extension ve VSCode
- zkusit udělat extension, vytvořit v něm okýnko, vykreslit něco s fabric.js
- rozjet debugger API, vyčíst lokální proměnné ve funkci při debugu

### Vizualizace
1) Vymyslet datový model, který popisuje paměť Céčkových programů (zásobníkové rámce, halda, globální paměť, proměnné [názvy, typ, hodnota], pole, struktury, ukazatele)

___

## Moje poznámky:
### 1. hovor
- [ ] zamyslet se, jak vykrestlit tu tunu dat (co tam je) tak, aby to k něčemu bylo
- [ ] prozkoumat zasobnikove ramce
- [x] typescript - checknout tam nástroj, který by to byl schopen vykresit (diagramy, šipky, atd.) - např. Fabric.js
- [x] prvni checknout, jestli nebude lepsi kutit rovnou extension ve VSCode - jestli tam jde vykreslovat a tak
- [x] algebraické datové typy (checknout)
- [x] udelat si git repo, kde budu hazet veskere veci, ktere budu mit rozmakane (at uz text bakalarky, nebo ruzne casti projektu - vykreslovani / vscode) a tak.

- obrázky generovat vektorově (např. SVG)

### 2. hovor

- [x] [Zasobnikove ramce](https://dspace.vsb.cz/bitstream/handle/10084/116048/BER0134_FEI_B2647_2612R025_2016.pdf?sequence=1&isAllowed=y) - sekce 2.5 (pročíst - idealne cele)
- [x] dodělat extension, aby šel spustit a vytvořil okno
- [x] zkusit přes debug API vytáhnout nějaké data (třeba zjistit jaké jsou lokální proměnné ve funkci) -> lze zjistit z implementace toho debug-visualizeru (GitHub)
- [x] udělat GitHub repo, kam to všechno hodit (a poslat invite)

### 3. hovor

- [x] dostat extension do stavu, kdy je schopen reagovat na jiné věci - např. schopen volat funkci skriptu (JS) v HTML stránce (toho WebView) pro vykreslení nějakého objektu do Canvasu

- vyhnout se generování (a opětovnému načtení) HTML stránky, která se znovuzobrazí ve WebView
- do začátku listopadu by se mělo přejít z testování možností na implementaci (kdyby to furt bylo v nejistém stavu, tak na práci na datový model, atd.)

### 4. hovor

- dodělání věcí z dřívějška

### 5. hovor

- [ ] udělat nový projekt, který se bude soustředit na vykreslování datového modelu (třeba zase přes ten Fabric.js)
- tahání dat z debugerru alespoň z počátku asi bude řešené přes parsování stringu vraceného VS Codem (ale časem je možno prozkoumat jiné řešení - struktury od [GDB](https://github.com/Kobzol/debug-visualizer/blob/master/debugger/gdbc/type.py) / [DWARF](https://dwarfstd.org/) - debugging data v binárce)

- v budoucnu je možno předělat tvorbu zobrazovaného HTML přes nějaký templatovací designer - např. [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/)
- celkově se tím pádem teď zase více zaměřit na tu vykreslovací část a datový model
- v budoucnu (až v závěrečných fázích, kdy to bude mít smysl) bude možno při přidání nějakých větších featur to dělat tak, že si založím novou větev (s novou featurou), která se potom přes pull reguest / merge spojí s tou hlavní - protože v ten moment přichází upozornění na mail, generuje se diff mezi verzemi (s možností psaní komentářů), atd.

