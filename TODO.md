# VisualizerBP
___
## Moje poznámky:
### 1. hovor
- [x] zamyslet se, jak vykrestlit tu tunu dat (co tam je) tak, aby to k něčemu bylo
- [x] prozkoumat zasobnikove ramce
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

- [x] udělat nový projekt, který se bude soustředit na vykreslování datového modelu (třeba zase přes ten Fabric.js)

- tahání dat z debugerru alespoň z počátku asi bude řešené přes parsování stringu vraceného VS Codem (ale časem je možno prozkoumat jiné řešení - struktury od [GDB](https://github.com/Kobzol/debug-visualizer/blob/master/debugger/gdbc/type.py) / [DWARF](https://dwarfstd.org/) - debugging data v binárce)
- v budoucnu je možno předělat tvorbu zobrazovaného HTML přes nějaký templatovací designer - např. [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/)
- celkově se tím pádem teď zase více zaměřit na tu vykreslovací část a datový model
- v budoucnu (až v závěrečných fázích, kdy to bude mít smysl) bude možno při přidání nějakých větších featur to dělat tak, že si založím novou větev (s novou featurou), která se potom přes pull reguest / merge spojí s tou hlavní - protože v ten moment přichází upozornění na mail, generuje se diff mezi verzemi (s možností psaní komentářů), atd.

### 6. hovor

- [x] Zvážit, jakou buildovací technologii zvolit (např. [ParcelJS](https://parceljs.org/))
- [x] Vytvořit nějaký projekt, který se bude buildovat do výsledného souboru (nejspíše do jednoho, který se bude inkludovat v HTML)
- Během toho oddělovat jednotlivé komponenty tak, aby nespoléhaly na mojí implementaci (mít to abstraktnější tak, aby nějaká moje metoda třeba nespoléhala na to, že v HTML souboru existuje canvas s nějakým jménem, atd.) 
- Ty komponenty by měly být rozdělené třeba jako jedna, která bude jen datový model (vesměs TS soubor, který bude obsahovat jen samé interfacy), druhá která bude includovat Fabric a řešit vykreslování a pak až nějakou finální, co to bude předávat do HTML (nebo tak nějak to prostě rozdělit)
- [x] Prozkoumat, co dělá Node.js (a jakou hraje roli u buildování)
- [x] Prozkoumat, co dělá TSC (a jakou hraje roli u překladu TS do JS)

Odkazy s materiály:
- [založení Node.js projektu přes NPM](https://docs.npmjs.com/creating-node-js-modules)
- [Návod k Webpacku](https://blog.sessionstack.com/how-javascript-works-a-guide-to-build-tools-exploring-webpack-parcel-rollup-es-build-and-2089bcf0ddb4)
- [seznam technologií a témat k prozkoumání při vývoji webu](
https://github.com/bmorelli25/Become-A-Full-Stack-Web-Developer)

### 7. hovor

- [x] Zpracovat datový model do formy, kdy bude schopen popsat stav momentálně zastaveného programu (stav, zásobníkové rámce, proměnné, atd.). Což znamená - předělat ten můj kreslený datový model do kódu + něco navíc

- Poznámky k datovému modelu: 
  - Nejspíše to zatím dělat pres třídy (to se pak případně časem může změnit na interfacy)
  - Třídy podobné něčemu jako třeba *Int* by neměly vůbec nic vědět o vykreslování


- Poznámky k vykreslování: 
  - Bude se řešit až časem (prvotní je předělat datový model, na kterém se to vykreslování pak bude stavět)
  - Vykreslování se bude řešit tak, ze něco přebere objekt nějakého konkrétního typu (nebo obecný objekt obsahující string s jeho typem) a podle toho ho adekvátně vykreslí
  - Ve vykreslování budu mít nějaké *widgety*, které budou představovat nějakou vykreslovanou část / nějaký vykreslovaný objekt (ty budou dal rekurzivně obsahovat jiné *podwidgety*) 

**Bonus** - Další nápad na featuru do budoucna: [vizualizace paddingu/alignmentu u struktur](https://mrlvsb.github.io/upr-skripta/c/struktury/pametova_reprezentace.html)

### 8. hovor

- [x] Dostat to do stavu, kdy budu moct vykreslit nějaký základní zásobníkový rámec (třeba ve kterém budou dvě hodnoty s *Inty* + třeba *Bool*)
- [x] Dostat repo do stavu, kdy jej bude možno stáhnout a spustit (včetně doinstalování všech potřebných závislostí) na jakémkoliv jiném kompu

Poznámky do budoucna: 
- U datového modelu se nejspíše proměnné budou řešit tak, že jejich samotná hodnota (ne ve formě stringu) bude uložena tím, že se daná třída rozšíří (např. tvorbou nové třídy *myInt*, která bude obsahovat i proměnnou *value* - ta bude rozšiřovat rodičovskou, spíše virtuální třídu *myVariable*)
- Nebylo by na škodu kouknout, jak některé debuggery reprezentují datové typy a hodnoty objektů (/proměnných)
- Zamknout možnost přesouvání jednotlivých objektů (ve Fabricu) - objekty budou vykreslovány fixně a pohybovat se po Canvasu bude pomocí zoomování a panningu (ty už by i měly být součástí Fabricu)
- Objekty by se ve Fabricu měly nejspíše vykreslovat podle jejich adresy v paměti (tím, že časem asi bude i alternativní pohled na paměť) = neměly by se vykreslovat abecedně (nebo nějak podobně)
- Možná by bylo možno udělat vlastní testy pro aplikaci přes něco jako [Cypress](https://www.cypress.io/), pokud by se to řešilo end to end testy (případně by bylo možno to řešit i přes snapshot testy, které kontrolují přímo vzhled výstupu - třeba při vykreslení přímo do PNG / SVG)

### 9. hovor

- [x] Udělat Dockerfile, který dostane alespoň vykreslovací část s ParcelJS do spustitelného stavu
- [x] Přidat zoom a panning (ve Fabricu)
- [x] Odstranit návratovou adresu (ze sledovaných dat u zásobníkových rámců)

- Vykreslování velkých dat
  - [ ] Vypracovat vykreslování stringů (zkoušet si i nějaké edge cases - např. string o 1000 znacích)
  - [x] Hierarchické/rozklikávací zobrazení s odsazením (jako je např. u tříd ve Visual Studiu) 
  - [ ] "Portál" - pohled na nějakou jinou část skrze nějaké speciální okno (třeba které bude zvýrazňovat nějaké prvky, atd. - obdoba toho, co např. vzniká u automatické tvorby funkcí ve Visual Studiu)
  - [ ] Vykreslování v nové stránce (+ tlačítko na vracení zpět, + breadcrumbs - cesta popisující to, "v čem je člověk zanořený a jak")

- Poznámky do budoucna: 
  - Kouknout se na to, co vrací debugger VS Code, když se jedná o string (jestli celý string / první písmeno / ...)
  - Je možno si vytvořit nějaké pipeliny / runnery na zkoušení Dockeru na GitHubu (možná by tam měly být i větší kvóty, kdybych si aktivoval studentský účet)

### 10. hovor

- [x] Udělat nějaké základní vykreslování pro *Int*, *Bool*, *Float*, *String*,... 
  - Po tomhle už zase pomalu řešit napojení na VS Code
- [x] Časem přidat *pointery* a *pole*
- [x] Založit časem novou větev na gitu, kde bych stáhl [šablonu na BP](https://www.cs.vsb.cz/dvorsky/Download/LaTeX/Diploma.zip) (v LateXu), vyplnil jméno, atd.
  - Nejdříve si ale udělat projekt v Overleafu (dokud bude hodně změn) a časem až přejít lokálně na git (až v době, kdy těch změn bude méně)

- Poznámky do budoucna:
  - Teďka spíše řešit nějakou základnější implementaci vykreslování (MVP - minimal viable product) 
  - U názvu proměnných maximálně přidat tři tečky a třeba jako tooltip ukázat celou délku (ty tři tečky spíše házet na konec)
  - Zvážit vykreslení stringu jen jako text (třeba s tlačítkem a třema tečkama, po kterém by se otevřelo pop-up okno, kde by byl scrollbar, atd.)
    - Ten string spíše otevírat v separátním okně (které bude sloužit jako textový editor)
    - Ten edge case (s třemi tečkami) si spíše udělat jako TODO (časem)

### 11. hovor

- [x] Napojit moji vykreslovací část na tu extensionovou
  - [x] Přebírání nějákých základních dat o proměnných (alespoň třeba datové typy - u hodnot by mohl být problém)
  - [x] Přebírání dat o zásobníkových rámcích - více prozkoumat, co lze z VS Code dostat (snad do stavu tak, že by se už vykreslil momentální stav nějákého programu)

- Poznámky do budoucna:
  - Zásobníkové rámce je možno vykreslovat postupně pod sebe (do jednoho velkého sloupce), kde pohyb mezi nimi by bylo možno řešit překlikáváním (část, kde by se už vykreslovaly jednotlivé proměnné, atd.)
