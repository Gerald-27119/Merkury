package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.enums.chat.ChatParticipantRole;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatMessageRepository;
import com.merkury.vulcanus.model.repositories.chat.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.merkury.vulcanus.model.enums.chat.ChatType.GROUP;

@Service
@RequiredArgsConstructor
public class PopulateChatsService {

    private final UserEntityRepository userEntityRepository;
    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    private static final List<String> USERNAMES = List.of(
            "annaKowalska",
            "michalNowak",
            "kasiaWisniewska",
            "piotrZielinski",
            "olaLewandowska",
            "tomekWojcik",
            "nataliaKaminska",
            "bartekSzymanski",
            "magdaKozlowska",
            "krzysJankowski",
            "julkaMazur",
            "pawelKrawczyk"
    );

    private static final LocalDateTime SEED_TIME = LocalDateTime.of(2025, 1, 1, 10, 0);

    private record Seed(List<String> usernames, Script script) {}

    @Transactional
    public void initChatsData() {
        Map<String, UserEntity> users = USERNAMES.stream()
                .collect(Collectors.toMap(
                        u -> u,
                        u -> userEntityRepository.findByUsername(u)
                                .orElseThrow(() -> new IllegalStateException("Brak użytkownika w DB: " + u)),
                        (a, b) -> a,
                        LinkedHashMap::new
                ));

        List<Seed> seeds = List.of(
                new Seed(List.of("annaKowalska", "michalNowak"),          scriptMeetupFortBema()),
                new Seed(List.of("kasiaWisniewska", "piotrZielinski"),   scriptBuild5Inch()),
                new Seed(List.of("bartekSzymanski", "pawelKrawczyk"),    scriptLongRange7Inch()),
                new Seed(List.of("olaLewandowska", "tomekWojcik"),       scriptVideoNoiseFix()),
                new Seed(List.of("nataliaKaminska", "magdaKozlowska"),   scriptLipoCare()),
                new Seed(List.of("krzysJankowski", "julkaMazur"),     scriptCrashRepairAndTune()),

                new Seed(List.of("annaKowalska", "piotrZielinski", "olaLewandowska"), scriptWeekendSpotPlanning3()),
                new Seed(List.of("michalNowak", "kasiaWisniewska", "tomekWojcik"),    scriptCineWhoopIndoor3()),

                new Seed(List.of("annaKowalska", "michalNowak", "kasiaWisniewska", "piotrZielinski"), scriptFilmingBikeRide4()),
                new Seed(List.of("olaLewandowska", "tomekWojcik", "nataliaKaminska", "bartekSzymanski"), scriptRulesAndDroneRadar4())
        );

        for (int i = 0; i < seeds.size(); i++) {
            Seed seed = seeds.get(i);

            List<UserEntity> participants = seed.usernames().stream()
                    .map(users::get)
                    .toList();

            LocalDateTime start = SEED_TIME.plusHours(i * 6L);

            createChatFromScript(participants, seed.script(), start);
        }
    }

    private Chat createChatFromScript(List<UserEntity> participants, Script script, LocalDateTime start) {
        if (participants.size() != script.size) {
            throw new IllegalArgumentException("Skrypt ma rozmiar " + script.size + ", ale grupa ma " + participants.size());
        }

        Chat chat = Chat.builder().build();
        participants.forEach(chat::addParticipant);

        chat.setName(participants.stream().map(UserEntity::getUsername).collect(Collectors.joining(", ")));

        if (participants.size() > 2) {
            chat.setChatType(GROUP);
            setGroupOwner(chat, participants.getFirst());
        }

        chat = chatRepository.save(chat);

        Map<String, String> vars = new HashMap<>();
        for (int i = 0; i < participants.size(); i++) {
            vars.put("{u" + i + "}", participants.get(i).getUsername());
        }

        List<ChatMessage> messages = new ArrayList<>(script.lines.size());
        for (int i = 0; i < script.lines.size(); i++) {
            Line line = script.lines.get(i);
            messages.add(ChatMessage.builder()
                    .chat(chat)
                    .sender(participants.get(line.speaker))
                    .content(fill(line.text, vars))
                    .sentAt(start.plusMinutes(i))
                    .build());
        }

        chatMessageRepository.saveAll(messages);
        chat.getChatMessages().addAll(messages);
        chat.setLastMessageAt(messages.get(messages.size() - 1).getSentAt());

        return chatRepository.save(chat);
    }

    private String fill(String template, Map<String, String> vars) {
        String out = template;
        for (Map.Entry<String, String> e : vars.entrySet()) {
            out = out.replace(e.getKey(), e.getValue());
        }
        return out;
    }

    private void setGroupOwner(Chat chat, UserEntity owner) {
        chat.getParticipants().forEach(cp -> cp.setRole(ChatParticipantRole.MEMBER));
        chat.getParticipants().stream()
                .filter(cp -> cp.getUser().equals(owner))
                .findFirst()
                .ifPresent(cp -> cp.setRole(ChatParticipantRole.OWNER));
    }

    private record Line(int speaker, String text) {
    }

    private record Script(int size, List<Line> lines) {
    }

    private static Line l(int speaker, String text) {
        return new Line(speaker, text);
    }

    private Script scriptMeetupFortBema() {
        return new Script(2, List.of(
                l(0, "Hej {u1}, jutro masz chwilę na mały lot testowy?"),
                l(1, "Siema {u0}, jasne — gdzie chcesz latać?"),
                l(0, "Myślałem o Parku Cytadella, jest sporo miejsca i mało ludzi rano."),
                l(1, "Dobry wybór, tylko sprawdźmy wiatr, bo tam czasem zawiewa od strony kanału."),
                l(0, "W informacjach pogodowych wygląda dobrze, ale podeślę info jak dojadę."),
                l(1, "O której celujesz? Ja mogę od 10:30."),
                l(0, "10:30 pasuje, spotkajmy się przy wejściu od ul. Za Cytadelą."),
                l(1, "Wezmę dodatkowe śmigła 5x4.3, ostatnio połamałem dwa komplety."),
                l(0, "Ja dorzucę taśmę izolacyjną i trytytki, klasyk na awarie w terenie."),
                l(1, "Masz już ustawiony buzzer? Wysoka trawa potrafi wciągnąć quada bez śladu."),
                l(0, "Tak, buzzer z własną baterią — uratował mi model tydzień temu."),
                l(1, "Super. Ja przyniosę też małą matę do lądowania, żeby nie sypać piaskiem w silniki."),
                l(0, "A gogle bierzesz swoje czy latasz z monitora?"),
                l(1, "Gogle, i jeszcze powerbank do ładowarki USB-C."),
                l(0, "Chcesz polatać bardziej freestyle czy spokojne przeloty pod kamerę?"),
                l(1, "Najpierw parę spokojnych kółek, potem mogę spróbować split-S nad wałem."),
                l(0, "To ja wezmę filtr ND do GoPro, bo w południe będzie ostre słońce."),
                l(1, "Dobra myśl. A jak z zasadami — trzymamy się z dala od dróg i ludzi."),
                l(0, "Jasne, lecimy tylko nad trawą i zachowujemy dystans, zero przelotów nad ścieżkami."),
                l(1, "Weźmy też rolę spottera: ja patrzę, gdy Ty latasz, potem zamiana."),
                l(0, "Spoko, robimy na zmianę. W razie czego mam też gwizdek, żeby ostrzec spacerowiczów."),
                l(1, "Haha, profesjonalnie. A baterie ile bierzesz?"),
                l(0, "Sześć sztuk 6S 1300mAh, każda na 3–4 minuty freestyle."),
                l(1, "Ja mam cztery 4S 1500mAh do mojego setupu, będę latał spokojniej."),
                l(0, "Po locie możemy zahaczyć o kawę, bo zapowiada się chłodno."),
                l(1, "Jestem za. Weź tylko rękawiczki, w grudniu palce odpadają od aparatury."),
                l(0, "Btw, zaktualizowałeś firmware w ELRS? Ostatnio poprawili failsafe."),
                l(1, "Jeszcze nie, ogarnę dziś wieczorem, dzięki za przypomnienie."),
                l(0, "To ustalone: sobota 10:30, Fort Bema, wejście od Za Cytadelą."),
                l(1, "Zapisane. Napiszę jak będę 5 minut od miejsca — do jutra!")
        ));
    }

    private Script scriptBuild5Inch() {
        return new Script(2, List.of(
                l(0, "Hej {u1}, składam nowego 5-calowca i utknąłem na doborze ESC."),
                l(1, "{u0} dawaj, co masz na liście?"),
                l(0, "Silniki 2207 1960KV na 6S, a ESC waham się między 45A a 55A."),
                l(1, "Bierz 55A, zapas się przyda przy agresywnych punch-outach."),
                l(0, "Okej, a kondensator na wejściu — 1000µF 35V wystarczy?"),
                l(1, "Tak, 1000µF jest spoko, tylko zamontuj go jak najbliżej padów zasilania."),
                l(0, "Mam też FC F7, ale nie wiem czy lepiej soft-mount czy sztywno."),
                l(1, "Soft-mount. Mniej wibracji i łatwiej potem ogarnąć filtrację."),
                l(0, "Receiver będzie ELRS 2.4, antenę planuję puścić w rurce termokurczliwej."),
                l(1, "Tylko nie przy samych śmigłach, bo przyciśnie i zasięg spadnie."),
                l(0, "Ramę biorę Apex 5, bo podobno łatwo się serwisuje."),
                l(1, "Apex jest fajny, ale sprawdź dystanse na stack, czasem trzeba podkładki."),
                l(0, "Przewody do silników: dawać 18AWG czy 20AWG?"),
                l(1, "Na 6S i 2207 daj 18AWG, mniej grzeje i mniejsze spadki napięcia."),
                l(0, "Do lutowania mam cynę 63/37, topnik w paście i grot BC2."),
                l(1, "Brzmi idealnie. Rozgrzej do ~380°C i nie trzymaj grota długo na padzie."),
                l(0, "Chcę odpalić pierwszy raz przez smoke stopper, żeby nie ubić stacka."),
                l(1, "Obowiązkowo. I zmierz zwarcie między + i − zanim podepniesz baterię."),
                l(0, "VTX planuję 800mW, ale boję się temperatury w upały."),
                l(1, "Na stole dawaj 25mW albo pit mode, dopiero w locie podbijaj moc."),
                l(0, "Kamera będzie 4:3, bo wolę więcej pionu w goglach."),
                l(1, "To w konfiguracji ustaw poprawny aspect, inaczej OSD będzie uciekać."),
                l(0, "Śmigła na start: 5.1x3.6, bo nie chcę od razu zbyt agresywnych."),
                l(1, "Dobry wybór. Jak będziesz chciał więcej gripu, weź 5x4.3."),
                l(0, "Mocowanie GoPro drukuję z TPU, ale drukarka robi nitki jak pajęczyna."),
                l(1, "Przesusz filament i podbij retrakcję. Nitki potrafią potem wpadać w śmigła."),
                l(0, "Po złożeniu zrobię blackbox i podkręcę PIDs, lubię twardszy feeling."),
                l(1, "Na start leć na presety, a tuning rób po jednym parametrze, inaczej chaos."),
                l(0, "Dzięki, jutro wieczorem składam — jak coś się spali, będę pamiętać kto doradzał 😅"),
                l(1, "Nie spali się, jeśli smoke stopper będzie pierwszy. Daj znać po pierwszym hoverze!")
        ));
    }

    private Script scriptLongRange7Inch() {
        return new Script(2, List.of(
                l(0, "Cześć {u1}, składam 7-calowego long-range i potrzebuję opinii o GPS rescue."),
                l(1, "Siema {u0}, jasne. Jaki GPS masz — M10 czy coś starszego?"),
                l(0, "M10, montuję go na masztcie TPU, z dala od anteny VTX."),
                l(1, "Super. Jeśli ma kompas, ustaw orientację, bo inaczej rescue będzie tańczył."),
                l(0, "Lecę na ELRS, ale kusi mnie Crossfire dla świętego spokoju."),
                l(1, "ELRS da radę. Zrób range test i włącz dynamiczną moc, będzie stabilnie."),
                l(0, "Video zostawiam analog, bo na LR wolę przewidywalny obraz niż cyfrowe dropy."),
                l(1, "Analog + dobra antena patch to klasyka; najważniejsze i tak jest RC link i failsafe."),
                l(0, "Baterie planuję 6S 3000mAh, celuję w 15–18 minut spokojnego przelotu."),
                l(1, "Brzmi realnie. Sprawdź tylko prąd na cruise, bo 7 cali potrafi zaskoczyć apetyt."),
                l(0, "Jaką wysokość na failsafe ustawić? Nie chcę, żeby wracał nad ludzi."),
                l(1, "Minimalna wysokość tylko na drzewa, a RTH ustaw tak, żeby wracał nad pustym terenem."),
                l(0, "Miejsce do testu: okolice Zalewu Zegrzyńskiego, brzegi są fotogeniczne i otwarte."),
                l(1, "W weekend bywa tłum, więc celuj wcześnie rano i trzymaj dystans od plaż."),
                l(0, "Dodałem beeper z własnym zasilaniem, bo LR + trawa = zguba bez dźwięku."),
                l(1, "Najlepszy upgrade. Włącz też 'beeper on crash flip', łatwiej znaleźć po krecie."),
                l(0, "Antenę VTX mam pagodę, ale mam też TrueRC singuł do testów."),
                l(1, "Singuł da lepszy sygnał. Zabezpiecz go tylko, bo przy upadku lubi się wyrwać."),
                l(0, "W Betaflight mam dynamic notch, zastanawiam się nad RPM filter na 7 calach."),
                l(1, "Jeśli ESC wspiera bi-directional DShot, RPM filter zrobi różnicę w smoothness."),
                l(0, "Na stole GPS łapie 18 satelitów po minucie. To dobry znak?"),
                l(1, "Tak. Poczekaj jeszcze na 'home point set' zanim wystartujesz, to kluczowe."),
                l(0, "OSD ustawię na odległość, napięcie i mAh zużyte, żebym nie wracał na oparach."),
                l(1, "Dobra praktyka. mAh consumed daje dużo pewniejszy obraz niż samo napięcie."),
                l(0, "Plan: najpierw 300m wzdłuż brzegu, potem test GPS rescue na 150m od startu."),
                l(1, "Świetnie, testuj rescue blisko. Pierwszy raz na 2km to proszenie się o stratę."),
                l(0, "Dodałem też awaryjny angle pod przełącznikiem, na LR to mi ratuje orientację."),
                l(1, "Must-have, szczególnie przy niskim słońcu i odbiciach od wody."),
                l(0, "Jak się uda, nagram przelot i wrzucę do naszej grupy, żebyście ocenili ujęcia."),
                l(1, "Dawaj. I przed startem sprawdź strefy w DroneRadarze, żeby nie wpaść w żółtą niespodziankę.")
        ));
    }

    private Script scriptVideoNoiseFix() {
        return new Script(2, List.of(
                l(0, "Hej {u1}, mam problem: obraz w goglach ma poziome paski, gdy dodaję gazu."),
                l(1, "Brzmi jak zakłócenia z zasilania. Masz kondensator przy ESC?"),
                l(0, "Mam tylko 470µF, bo większego nie miałem akurat w szufladzie."),
                l(1, "Przy 6S to mało. Dołóż 1000µF 35V i sprawdź, czy paski znikną."),
                l(0, "Masę VTX mam podpiętą do FC, nie bezpośrednio do baterii."),
                l(1, "To akurat sensowne. Sprawdź tylko, czy nie masz zimnego lutu na GND."),
                l(0, "Jak poruszę wtyczką kamery w FC, obraz czasem mruga jak stroboskop."),
                l(1, "To wygląda na cofający się pin w złączu. Wypnij i dociśnij pinsetą piny."),
                l(0, "VTX ustawiłem na 800mW, bo latałem w lesie i bałem się dropów."),
                l(1, "Na ziemi 800mW bez airflow potrafi ugotować VTX w minutę."),
                l(0, "Był gorący jak patelnia. Myślisz, że to mogło go nadwyrężyć?"),
                l(1, "Możliwe. Ustaw pit mode na ziemi i zwiększ moc dopiero po starcie."),
                l(0, "Kamera w cieniu robi ziarnisty obraz, jakby ISO skakało co sekundę."),
                l(1, "To auto-exposure. Jak możesz, ustaw ręczny shutter albo ogranicz maksymalne ISO."),
                l(0, "Wczoraj miałem też krótkiego brownouta FC przy punch-oucie."),
                l(1, "To może być przeciążony BEC albo coś na 5V bierze za dużo prądu."),
                l(0, "Na 5V mam receiver, kamerę i LEDy. LEDy mogą dobijać?"),
                l(1, "Odłącz LEDy na test. To najszybszy sposób, żeby wykluczyć zbyt duży pobór."),
                l(0, "Dorzuciłem 470µF na 5V, ale nie wiem czy to nie placebo."),
                l(1, "Może pomóc, ale priorytetem jest duży kondensator na wejściu zasilania."),
                l(0, "Kable do VTX są długie, bo schowałem go w ogonie i chciałem czysty build."),
                l(1, "Długie kable łapią syf. Skróć je i skręć w parę, zmniejszysz indukcję."),
                l(0, "Jaki pasmo ustawić, żeby mniej łapać Wi-Fi z bloków obok?"),
                l(1, "Często Raceband ma mniej śmieci. Przetestuj kilka kanałów w miejscu lotu."),
                l(0, "Dziś wieczorem przelutuję zasilanie i wstawię 1000µF 35V, zobaczymy różnicę."),
                l(1, "I sprawdź temperaturę VTX po minucie na 25mW, zanim wyjdziesz w teren."),
                l(0, "Jeśli dalej będą paski, co następne — kamera czy VTX do podmiany?"),
                l(1, "Tak. Podmień po kolei jeden element, żeby nie zgadywać."),
                l(0, "Wczoraj grzebałem na raz w trzech rzeczach i potem nie wiedziałem co pomogło."),
                l(1, "Klasyka. Jedna zmiana naraz i notatki — daj znać po testach, jestem ciekaw wyniku.")
        ));
    }

    private Script scriptLipoCare() {
        return new Script(2, List.of(
                l(0, "Cześć {u1}, moje LiPo zaczęły puchnąć i mam wrażenie, że je zajechałem."),
                l(1, "Okej, a jak je trzymasz między lotami?"),
                l(0, "Zostawiałem na 4.2V po lataniu, czasem na kilka dni, bo zapominałem o storage."),
                l(1, "To szybka droga do puchnięcia. Storage 3.8V na celę robi ogromną różnicę."),
                l(0, "Ładuję zwykle 2A, bo mam 1300mAh i chcę szybciej wracać w powietrze."),
                l(1, "2A to jeszcze do przeżycia, ale jeśli Ci nie zależy na czasie, 1C jest łagodniejsze."),
                l(0, "Jedna bateria ma po locie różnicę 0.06V między celami, balansuje się długo."),
                l(1, "Zmierz IR każdej celi. Jak jedna odjechała, to bateria będzie już słabsza."),
                l(0, "Nie ogarniam, jakie IR jest już 'złe' dla małych pakietów."),
                l(1, "Jak widzisz okolice 20–25 mΩ na celę, zaczyna być czuć spadek mocy i sag."),
                l(0, "Na freestyle schodzę do 3.5V pod obciążeniem, bo lubię dociągać lot do końca."),
                l(1, "Lepiej lądować przy 3.6–3.7V pod obciążeniem, bateria dłużej pożyje."),
                l(0, "Kupiłem torbę ognioodporną, ale trzymam ją na półce w pokoju."),
                l(1, "Bezpieczniej na kafelkach albo w metalowym pudełku, z dala od papierów."),
                l(0, "Myślę o ładowaniu równoległym, bo mam kilka pakietów i szkoda czasu."),
                l(1, "Równoległe jest super, ale tylko gdy pakiety mają podobne napięcie przed połączeniem."),
                l(0, "Czy storage mogę robić od razu po locie, gdy pakiet jest jeszcze ciepły?"),
                l(1, "Daj mu chwilę ostygnąć. Ładowanie na gorąco skraca żywotność."),
                l(0, "Jedna bateria ma wgniecenie po upadku. Niby działa, ale mam stres."),
                l(1, "Obserwuj. Jeśli puchnie lub śmierdzi, utylizuj bez dyskusji."),
                l(0, "Gdzie najlepiej oddać zużyte LiPo?"),
                l(1, "PSZOK, czasem sklepy modelarskie też zbierają. Najpierw rozładuj do zera."),
                l(0, "Rozładowanie żarówką samochodową jest ok, czy lepiej ładowarką w discharge?"),
                l(1, "Ładowarka w discharge jest najczytelniejsza, ale i żarówka działa — byle pod nadzorem."),
                l(0, "XT60 mi się grzeje po kilku pakietach. To normalne?"),
                l(1, "Nie. To oznaka słabego lutu albo zużytego wtyku, wymień zanim stopi koszulkę."),
                l(0, "Ustawię alarm w OSD na 3.65V i będę kończyć lot wcześniej, choć to boli."),
                l(1, "Boli krócej niż wymiana pakietów co miesiąc."),
                l(0, "Dzięki za wykład — czuję się jak po szkoleniu BHP od mini-granatów 😅"),
                l(1, "I bardzo dobrze. LiPo są fajne, dopóki traktujesz je z respektem.")
        ));
    }

    private Script scriptCrashRepairAndTune() {
        return new Script(2, List.of(
                l(0, "Hej {u1}, przywaliłem w beton i quad trzęsie się teraz jak pralka na wirowaniu."),
                l(1, "Auć. Wymieniłeś śmigła czy dalej lecisz na tych po krecie?"),
                l(0, "Śmigła już nowe, a wibracje dalej, najbardziej przy 30–40% gazu."),
                l(1, "To sprawdź bicia na bellu silnika. Czasem po uderzeniu robi się minimalna krzywizna."),
                l(0, "Jeden motor ma luz na łożysku i słychać delikatny zgrzyt przy kręceniu palcem."),
                l(1, "To łożysko do wymiany albo cały motor, zależy czy opłaca się rozbierać."),
                l(0, "Rama ma pęknięty arm, trzyma się jeszcze na dwóch śrubach, ale wygląda słabo."),
                l(1, "Nie ryzykuj. Arm potrafi puścić w locie i wtedy szkody są dużo większe."),
                l(0, "Mam zapasowy arm, tylko boję się rozkręcania całego stacka i kabli."),
                l(1, "Zrób zdjęcia kabla po kablu. Potem składasz bez zgadywania i bez pomyłek."),
                l(0, "Po krecie OSD pokazało 'RX LOSS' na sekundę. To mnie niepokoi."),
                l(1, "Sprawdź antenę ELRS. Jak pękła żyła, zasięg potrafi dramatycznie spaść."),
                l(0, "Widzę przetarcie na końcówce anteny, chyba zahaczyła o gałąź."),
                l(1, "Wymień ją. To tani element, a potrafi uratować model i nerwy."),
                l(0, "Po naprawie chcę zrobić re-tune, bo filtry mam ustawione pod stare wibracje."),
                l(1, "Zrób blackbox: hover + średni gaz, potem zobaczymy szczyty w logach."),
                l(0, "Możemy się spotkać i ogarnąć to razem? Ja się gubię w wykresach."),
                l(1, "Pewnie. Weź laptop i kabel USB-C. Kiedy Ci pasuje?"),
                l(0, "W czwartek po pracy, około 18:00, mogę podjechać z całym gratem."),
                l(1, "Pasuje. Mam też zapasowe śruby M3 i gumki do stacka, przydadzą się."),
                l(0, "Obraz z kamery jest lekko rozmyty. Może soczewka się przekręciła od uderzenia?"),
                l(1, "Może. Ustaw ostrość na kartce z tekstem i zaznacz pozycję markerem."),
                l(0, "VTX też zmienił kanał po krecie, chyba przypadkiem kliknąłem przycisk."),
                l(1, "Ustaw go przez UART w konfiguratorze, wtedy guzikiem go nie przestawisz."),
                l(0, "Do czwartku wymienię arm i antenę, resztę dopracujemy na miejscu."),
                l(1, "I sprawdź śruby w silnikach — po uderzeniu często się luzują."),
                l(0, "Zrobię też test silników w konfiguratorze, żeby zobaczyć czy któryś nie brzmi inaczej."),
                l(1, "Jeśli któryś piszczy inaczej, może mieć krzywą oś albo przesunięty magnes."),
                l(0, "Brzmi jak lista napraw na pół nocy, ale przynajmniej nauczę się więcej niż w locie."),
                l(1, "FPV to trochę loty, a trochę serwis. W czwartek ogarniemy i w weekend polatamy spokojniej.")
        ));
    }

    // ====== 2x chat 3-osobowy (2 * 30 = 60) ======

    private List<Script> buildTripleScripts() {
        return List.of(
                scriptWeekendSpotPlanning3(),
                scriptCineWhoopIndoor3()
        );
    }

    private Script scriptWeekendSpotPlanning3() {
        return new Script(3, List.of(
                l(0, "Hej ekipa, w sobotę chcecie wyskoczyć na latanie? Mam wolne przed południem."),
                l(1, "Ja mogę, tylko muszę wiedzieć gdzie, bo nie chcę jechać przez pół miasta."),
                l(2, "Proponuję żwirownię pod Konstancinem — dużo przestrzeni i mało ludzi o 9:00."),
                l(0, "Brzmi dobrze."),
                l(2, "Trzeba uważać na linię wysokiego napięcia z boku."),
                l(1, "To ja wezmę pachołki i taśmę, żeby zrobić strefę startu z dala od spacerowiczów."),
                l(0, "Super, ja ogarnę mały anemometr, bo ostatnio wiatr zdmuchnął mi quada przy lądowaniu."),
                l(2, "A ja biorę narzędzia: klucze 1.5/2.0, cynę i zapasowe XT60."),
                l(1, "Chcecie bardziej freestyle czy raczej cinematic nad wodą?"),
                l(0, "Ja chcę potrenować smooth orbit i low pass nad brzegiem, bez akrobacji."),
                l(2, "Ja postawię 7 cali na przelot wzdłuż wyrobiska, ale będę trzymać wysokość."),
                l(1, "Pamiętajcie, że w weekend potrafią tam siedzieć wędkarze."),
                l(0, "Umawiamy zasadę: jak ktoś widzi ludzi blisko, krzyczy 'przerwa' i wszyscy lądują."),
                l(2, "Dobra. I latamy na zmianę, żeby nie mieszać się na częstotliwościach."),
                l(1, "Kto ma jakie kanały? Ja lecę na R8."),
                l(0, "Ja jestem na R1. A Ty, {u2}?"),
                l(2, "R6, więc nie będziemy się gryźć. Wezmę kartkę z kanałami, żeby nie pomylić."),
                l(1, "Godzina zbiórki: 8:45 na parkingu przy wjeździe?"),
                l(0, "Pasuje. Dajcie tylko znać jak z dojazdem, bo podobno jest tam odcinek z dziurami."),
                l(2, "Ja jadę autem, mogę zabrać jedną osobę, jeśli ktoś chce się podpiąć."),
                l(1, "Dzięki, dojadę sam. Wezmę termos z herbatą, bo rano bywa zimno."),
                l(0, "Ja wezmę worek na śmieci na stare śmigła i ścinki trytytek — zostawmy miejsce czyste."),
                l(2, "Szacun. A ktoś testuje nowe Betaflight? Jestem ciekaw presetów pod 7 cali."),
                l(1, "Ja jeszcze nie, wolę stabilność niż debugowanie w polu."),
                l(0, "Ja zrobiłem update i mam lepszy yaw, ale musiałem przestawić rates."),
                l(2, "To w sobotę mi pokażesz swoje ustawienia, może skopiuję jako bazę."),
                l(1, "Po lataniu możemy zahaczyć o jedzenie w Konstancinie, znam fajne miejsce."),
                l(0, "Deal, ale najpierw loty — nie chcę tłustych palców na goglach 😄"),
                l(2, "Ustalone: sobota 8:45 parking, żwirownia pod Konstancinem, kanały R1/R6/R8."),
                l(1, "Zapisane. Jak pogoda siądzie, rano wrzucę update i ewentualnie zmienimy lokalizację.")
        ));
    }

    private Script scriptCineWhoopIndoor3() {
        return new Script(3, List.of(
                l(0, "Hej, mam cinewhoopa 3.5\" i chcę potrenować indoor bez rozwalania ścian — macie pomysł gdzie?"),
                l(1, "Jest parking podziemny przy centrum, w niedzielę rano bywa prawie pusty."),
                l(2, "Tylko sprawdźmy, czy ochrona nie wygania. Alternatywa to hala u znajomego."),
                l(0, "Parking na start brzmi ok, bo są szerokie zakręty i stabilne światło."),
                l(1, "Jakie masz śmigła? Na cine lubię 3.5x2.5, mniej hałasu i lepsza kontrola."),
                l(0, "Mam 3.5x3.0 i czuję, że w zakrętach robi się nerwowy."),
                l(2, "Zmień expo na roll/pitch i obniż throttle mid, będzie bardziej płynnie."),
                l(0, "GoPro mam z ND16, ale w garażu będzie ciemno jak w jaskini."),
                l(1, "W garażu ND zdejmij, inaczej obraz będzie za ciemny i ISO poleci w kosmos."),
                l(2, "I VTX ustaw na 25mW, bo na bliskim dystansie nie ma sensu grzać nadajnika."),
                l(0, "Mój VTX grzeje się nawet na 200mW, więc wolę nie ryzykować."),
                l(1, "Zrób przerwy co kilka minut i nie trzymaj go na ziemi długo bez airflow."),
                l(2, "Cine potrafi też brzęczeć przez rezonans osłon. Słyszysz jakieś wycie na konkretnych obrotach?"),
                l(0, "Tak, jest taki 'gwizd' przy pół gazu. Myślałem, że to łożysko."),
                l(1, "To często ducts. Podklej cienką piankę w punktach styku, czasem znika rezonans."),
                l(2, "Mogę wziąć mikrofon i zrobić test nagrania, zobaczymy czy to wibracje od kamery."),
                l(0, "Chcę też wrzucić preset 'Cinewhoop Smooth' w Betaflight, ale nie wiem czy nie przesadzi z filtrami."),
                l(1, "Na start jest świetny. Potem dopasujesz pod masę i śmigła."),
                l(2, "I ogranicz max angle. Indoor nie potrzebujesz 70°, bo tylko prosisz się o sufit."),
                l(0, "Ustawię max angle na 35°, żeby nie wlecieć w lampy."),
                l(1, "Masz turtle mode? W garażu łatwo wylądować na plecach między słupkami."),
                l(0, "Mam, ale boję się spalić silniki jak coś się zaklinuje."),
                l(2, "W turtle dawaj krótkie pyknięcia, nie trzymaj gazu ciągle."),
                l(1, "Kiedy testy? Niedziela 7:30 jest okej?"),
                l(0, "7:30 pasuje. Przywiozę baterie na storage i doładuję na miejscu."),
                l(2, "Wezmę ładowarkę i przedłużacz, czasem przy windzie są gniazdka."),
                l(1, "Jeśli nas przegonią, plan B: park i loty nisko nad alejkami, ale z dala od ludzi."),
                l(0, "Wolę parking, bo wiatr na zewnątrz psuje płynność ujęć."),
                l(2, "Ustalone: niedziela 7:30, cine indoor, bez ND, VTX 25mW, max angle 35°."),
                l(1, "Brzmi jak plan. Jak wyjdą fajne ujęcia, składamy krótką rolkę do wrzucenia.")
        ));
    }

    // ====== 2x chat 4-osobowy (2 * 30 = 60) ======

    private List<Script> buildQuadScripts() {
        return List.of(
                scriptFilmingBikeRide4(),
                scriptRulesAndDroneRadar4()
        );
    }

    private Script scriptFilmingBikeRide4() {
        return new Script(4, List.of(
                l(0, "Hej wszystkim, kumpel prosi o ujęcia z drona z niedzielnego przejazdu rowerowego — pomożecie ogarnąć plan?"),
                l(1, "Jasne, tylko musimy ustalić trasę i gdzie możemy legalnie latać."),
                l(2, "Podeślij mapkę przejazdu, sprawdzę strefy w DroneRadarze i czy nie zahacza o CTR."),
                l(3, "Ja zrobię checklistę sprzętu: zapasowe śmigła, filtry ND, karty SD, baterie."),
                l(0, "Trasa idzie wzdłuż Wału Miedzeszyńskiego, start jest przy parkingu nad Wisłą."),
                l(1, "Nad Wisłą bywa sporo spacerowiczów, musimy wybrać spokojniejszy odcinek."),
                l(2, "Jest tam też fragment przy rezerwacie, lepiej go ominąć, żeby nie drażnić ptaków."),
                l(3, "Podzielmy role: jedna osoba lata, druga jest spotterem, trzecia ogarnia kontakt z grupą rowerową."),
                l(0, "Ja mogę latać cinewhoopem do bliskich ujęć, bo ma osłony i jest bezpieczniejszy."),
                l(1, "A ja wezmę 5\" do dynamicznych przelotów równolegle do peletonu, ale tylko nad pustą ścieżką."),
                l(2, "Ja mogę polecieć 7\" z góry na szerokie kadry, trzymając wysokość i dystans."),
                l(3, "Ustalmy częstotliwości: ja jestem na R2. Kto jakie ma?"),
                l(0, "Ja na R5."),
                l(1, "Ja na R8, więc nie powinno się gryźć."),
                l(2, "Ja na R1 — kanałowo wygląda czysto."),
                l(3, "Godzina: przejazd startuje o 11:00, więc my powinniśmy być 10:00 na rekonesans."),
                l(0, "10:00 okej. Zrobimy próbny lot bez rowerów, żeby sprawdzić przeszkody i zakłócenia."),
                l(1, "Plan ujęć: start z boku, potem przelot z przodu i jeden top-down na prostym odcinku."),
                l(2, "Na zakrętach jest ryzyko drzew i gałęzi. Top-down zrobimy nad prostą i szeroką ścieżką."),
                l(3, "Wezmę krótkofalówki, żebyśmy nie krzyczeli przez pół wału."),
                l(0, "Ustalmy hasło awaryjne: 'STOP LOT' jeśli ktoś widzi ludzi w kadrze albo obok toru lotu."),
                l(1, "I zasada absolutna: nie latamy nad głowami, nawet jeśli wygląda efektownie."),
                l(2, "Plus: żadnych przelotów nad drogą i trzymamy VLOS."),
                l(3, "Po ujęciach zrzucę materiał na laptop i zrobię backup na dysk, żeby nic nie zginęło."),
                l(0, "Wezmę ND8 i ND16, bo w południe światło będzie ostre i bez filtra wszystko się pali."),
                l(1, "Ja ustawię GoPro na 4K/60 i ograniczę ISO, żeby nie pompowało w cieniu."),
                l(2, "W 7\" polecę wolniej i szerzej, stabilizację zrobię w postprodukcji."),
                l(3, "Ktoś niech skontaktuje organizatora, żebyśmy mieli jego zielone światło i miejsce na setup."),
                l(0, "Ja napiszę dziś i ustalę gdzie możemy stanąć, żeby nie przeszkadzać rowerzystom."),
                l(1, "Super, mamy plan: niedziela 10:00, rekonesans, podział ról i bezpieczeństwo ponad ujęcia.")
        ));
    }

    private Script scriptRulesAndDroneRadar4() {
        return new Script(4, List.of(
                l(0, "Hej, wczoraj ktoś mnie zaczepił przy lataniu i pytał o uprawnienia — jak to teraz ogarnąć bez stresu?"),
                l(1, "Minimum to rejestracja operatora i szkolenie A1/A3, a reszta zależy od ryzyka i miejsca."),
                l(2, "Ja zawsze sprawdzam DroneRadar przed startem, bo strefy potrafią się zmieniać i nie chcę niespodzianek."),
                l(3, "Dodatkowo mam w kieszeni potwierdzenie OC i numer operatora, bo ludzie lubią widzieć papier."),
                l(0, "Latam 5\" FPV, czyli masa ponad 250g, plus gogle — wiem, że wchodzi temat obserwatora."),
                l(1, "Tak. FPV bez obserwatora to proszenie się o kłopoty, nawet jeśli miejsce wygląda pusto."),
                l(2, "I absolutnie unikaj lotów nad zgromadzeniami. W praktyce: jak pojawiają się ludzie, kończysz."),
                l(3, "W parku miejskim niby bywa 'zielono', ale ludzie są wszędzie, więc to średni pomysł."),
                l(0, "No właśnie, zielone w aplikacji nie znaczy, że teren jest bezpieczny w realu."),
                l(1, "Najbezpieczniej wybierać łąki, żwirownie i nieużytki — najlepiej rano, zanim przyjdą spacerowicze."),
                l(2, "Uważaj też na okolice lotnisk. Nawet daleko od pasa możesz trafić na CTR/TSA."),
                l(3, "Miałem sytuację, że strefa była żółta i trzeba było kliknąć zgodę w aplikacji przed startem."),
                l(0, "Czy taka zgoda w aplikacji wystarczy, czy czasem trzeba dzwonić?"),
                l(2, "Zależy od strefy. Czasem jest zgoda automatyczna, czasem kontakt z zarządzającym strefą."),
                l(1, "I pamiętaj: 'komercyjnie' czy 'dla funu' ma mniejsze znaczenie niż ryzyko i bezpieczeństwo w locie."),
                l(3, "Ja mam zasadę: jak ktoś podchodzi i dyskutuje, najpierw ląduję, dopiero potem rozmawiam."),
                l(0, "A co z lataniem nad wodą, np. jezioro? Teoretycznie mniej ludzi, ale ptaki i wędkarze."),
                l(2, "Rezerwaty i ostoję ptaków omijaj. Nad wodą też trzymaj dystans od brzegu i łodzi."),
                l(1, "Hałas też robi swoje. 5\" potrafi irytować, cinewhoop jest zwykle lepiej tolerowany."),
                l(3, "Mnie raz poprosiła straż miejska o wylądowanie, bo ktoś zadzwonił, że 'dron szpieguje'."),
                l(0, "I co, skończyło się mandatem czy rozmową?"),
                l(3, "Rozmową. Pokazałem rejestrację operatora, powiedziałem, że kończę i było spokojnie."),
                l(1, "Dlatego warto mieć obserwatora — ktoś patrzy na otoczenie, gdy Ty jesteś w goglach."),
                l(2, "I ustaw w OSD numer telefonu, bo po krecie ktoś może znaleźć quada i oddać."),
                l(0, "Dobra myśl. U mnie po krecie beeper uratował sytuację, bo w trawie bez niego byłbym zgubiony."),
                l(3, "Beeper z własnym zasilaniem to top. Przy crashu z odcięciem prądu nadal działa."),
                l(1, "Możemy zrobić krótką checklistę dla naszej ekipy: strefa, ludzie, wiatr, spotter, failsafe."),
                l(2, "Zróbmy ją i przypnijmy w grupie. Wtedy każdy przed lotem odhaczy podstawy."),
                l(0, "Jestem za, bo wolę latać spokojnie niż stresować się, że ktoś wezwie służby."),
                l(1, "To ustalone: spisujemy zasady i wybieramy miejsca do latania z dala od ludzi, nawet jeśli ujęcia kuszą.")
        ));
    }
}
