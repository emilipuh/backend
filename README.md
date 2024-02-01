# ExpenseTrack

ExpenseTrack je web aplikacija koja je namijenjena korisnicima koji žele pratiti svoje troškove ili prihode, tj. financije. Ova aplikacija nudila bi mogućnost korisnicima da po određenim kategorijama prate svoje troškove i prihode i bilježe ih na svoj način. Sama implementacija aplikacije jest sljedeća:
*	Korisnik se preko login stranice prijavljuje u aplikaciju vlastitim  podacima koji se spremaju u bazu podataka kako bi se prilikom unošenja podataka, tj. troškova ti podaci „sačuvali“, tj. spremili u već spomenutu bazu podataka koja se odnosi samo na tog određenog korisnika aplikacije.
*	Nakon što korisnik ispuni traženu formu za prijavu u aplikaciju, od korisnika se traži da on upiše svoje trenutno stanje računa. Trenutno stanje računa prati se i mijenja ovisno o promijenama glede troškova i prihoda koje korisnik unosi.  
*	Unošenjem trenutnog stanja računa korisnika se odvodi u samu web aplikaciju. Korisnik se potom nalazi na početnoj stranici aplikacije gdje su mu ponuđene tri mogućnosti, koje su implementirane kao „kartice“ unutar aplikacije, a to su: **unošenje troška**, **unošenje prihoda** i **kartica za štednju**. Ovisno o željama korisnika, odnosno da li on želi unijeti trošak ili prihod, nude mu se nekoliko kategorija po kojima je moguće pratiti iste. Ponuđene kategorije su sljedeće:

    1. **Računi** (režije, računi za telefon, Internet, određene pretplate, rate kredita, stanarina itd.). 
    2. **Automobil** (troškovi tankanja, tj. punjenja rezervara, troškovi popravka, tehnički pregled i osiguranje…)
    3. **Zdravlje** (lijekovi, pregledi, članarine u teretani itd.)
    4. **Kupovina** (kupnja namirnica, odjeće, obuće, vlastitih potrepština i sl.)
    5. **Edukacija** (troškovi tečajeva, mjesečne pretplate, plaćanje školarine…)
    6. **Putovanja** (troškovi prijevoza, troškovi hotela, apartmana, kuće za odmor i sl.)
    7. **Kućni ljubimci** (hrana, veterinar…)
    8. Ostalo (korisnički zahtjevi i želje, posebne kategorije)

*	Kada korisnik želi unijeti trošak, to radi na način da klikne na karticu *Trošak*, gdje se otvara forma za ispunjavanje troška. Nakon što korisnik unese svotu troška, moguće je i bilježenje datuma kada je taj trošak učinjen, što dovodi do lakše i bolje organizacije, a i bolje preglednosti i uvida u troškove. Osim mogućnosti bilježenja datuma kada je trošak napravljen, korisniku se nudi mogućnost unošenja bilješki, u kojima se bilježe činjenice o trošku ili objašnjenje samog troška. 
* Nakon što korisnik unese određeni trošak, sa trenutnog stanja računa skida se određena svota novca koja znači taj trošak i trošak se sprema kao zapis koji korisnik kasnije vidi u zapisniku svih troškova. 
* Ako korisnik želi unijeti određeni prihod, npr. plaću, korisnik odlazi na karticu *Prihodi* i unosi količinu novca koja predstavlja prihod. Spremanjem zapisa o tom prihodu na stanje se automatski dodaje količina novca, tj. svota koju je korisnik unio kao prihod. Na kartici *Prihodi* također su ponuđene kategorije po kojima korisnik može spremiti svoje prihode, a to su:

    1.	**Plaća**
    2.	**Poklon**
    3. **Ostalo** (npr. ako korisnik posjeduje nekretninu koju iznajmljuje unosi prihod koji je dobio od stanarine)
    
*	Osim mogućnosti unošenja prihoda i troškova, implementirana je i „kartica“ za štednju. Kartica za štednju pruža korisniku mogućnost da unese određenu količinu novca koju želi štedjeti. Kada to korisnik napravi, sa trenutnog stanja računa skida se, kao i za troškove, ta određena svota, koja se kasnije zapisuje u karticu *Štednja*. 
------

Zaključak glasi da ExpenseTrack web aplikacija korisniku nudi jednostavnu mogućnost praćenja troškova i prihoda kroz određene bilješke i zapise koji su vidljivi u korisničkom sučelju web aplikacije. 