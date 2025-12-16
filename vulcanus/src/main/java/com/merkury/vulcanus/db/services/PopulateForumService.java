package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import com.merkury.vulcanus.model.entities.forum.Tag;
import com.merkury.vulcanus.model.interfaces.Votable;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.model.repositories.forum.PostCategoryRepository;
import com.merkury.vulcanus.model.repositories.forum.PostCommentRepository;
import com.merkury.vulcanus.model.repositories.forum.PostRepository;
import com.merkury.vulcanus.model.repositories.forum.PostTagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PopulateForumService {

    private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final PostCategoryRepository postCategoryRepository;
    private final PostTagRepository postTagRepository;
    private final UserEntityRepository userRepository;

    private final Random random = new Random(20251216);

    private enum Topic {
        SPOTS, MEDIA, BEGINNER, BUILD, FPV, VIDEO, BATTERIES, EVENTS, TROUBLESHOOT, EDITING
    }

    private record PostTemplate(
            Topic topic,
            String categoryName,
            List<String> titleSubjects,
            List<String> titleAngles,
            String contentTplHtml,
            int minComments,
            int maxComments,
            List<String> commentPool,
            List<String> replyPool
    ) {}

    @Transactional
    public void initForumData() {

        var users = new ArrayList<>(userRepository.findAll());
        if (users.size() < 5) return;

        var rnd = new Random(20251216);

        PostCategory postCategory1 = PostCategory.builder()
                .name("Drone for beginners")
                .description("Getting started with drones.")
                .colour("#eab308")
                .build();

        PostCategory postCategory2 = PostCategory.builder()
                .name("Spots")
                .description("Best places to fly.")
                .colour("#3b82f6")
                .build();

        PostCategory postCategory3 = PostCategory.builder()
                .name("Event")
                .description("Meetups and drone events.")
                .colour("#4f46e5")
                .build();

        PostCategory postCategory4 = PostCategory.builder()
                .name("Best place for media")
                .description("Top photo-worthy locations.")
                .colour("#ef4444")
                .build();

        PostCategory postCategory5 = PostCategory.builder()
                .name("Build first drone")
                .description("DIY drone building tips.")
                .colour("#22c55e")
                .build();

        PostCategory postCategory6 = PostCategory.builder()
                .name("FPV")
                .description("All about FPV flying.")
                .colour("#ec4899")
                .build();

        postCategoryRepository.saveAll(List.of(
                postCategory1, postCategory2, postCategory3,
                postCategory4, postCategory5, postCategory6
        ));

        List<String> cityTagNames = List.of(
                "Gdańsk",
                "Kraków",
                "Warszawa",
                "Poznań",
                "Wrocław",
                "Szczecin",
                "Łódź",
                "Rzeszów",
                "Toruń",
                "Bydgoszcz",
                "Białystok",
                "Chorzów",
                "Zakopane",
                "Wieliczka",
                "Dębki",
                "Jantar",
                "Hel",
                "Żarnowiec",
                "Tarnobrzeg",
                "Klucze"
        );

        Map<String, Tag> tagByCity = upsertForumTags(cityTagNames);

        java.util.function.Supplier<UserEntity> pickUser = () -> users.get(rnd.nextInt(users.size()));

        var posts = new ArrayList<Post>();
        var allComments = new ArrayList<PostComment>();

        // 1) Gdańsk
        Post p1 = Post.builder()
                .title("Plaża Stogi: jak nagrać filmowy „reveal” nad wydmami bez szarpania?")
                .content("""
                    <p>Chcę nagrać krótki cinematic na Plaży Stogi: start nisko za wydmą i powolne wynurzenie na szeroki plan morza.</p>
                    <p>Macie tipy jak ustawić ruch (yaw/tilt), żeby wyszło płynnie i „premium”? Interesuje mnie też kolejność ujęć (reveal → orbit → odjazd).</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Gdańsk")))
                .views(742)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(12))
                .comments(new ArrayList<>())
                .build();
        addComments(p1, users, rnd, allComments,
                "<p>U mnie najlepiej działa bardzo wolny yaw + minimalny tilt w trakcie wynurzania. Jak tilt jest stały, obraz wygląda spokojniej.</p>",
                "<p>Zrób dwa podejścia: jedno dłuższe i wolniejsze, drugie krótsze i bardziej dynamiczne. W montażu łatwiej zbudować rytm.</p>",
                "<p>Spróbuj też wersji: reveal → krótki top-down na fale → odjazd wzdłuż linii brzegu. Fajnie się „zamyka” historię.</p>",
                "<p>Jeśli masz możliwość, nagraj ten sam ruch 2–3 razy identycznie. Potem wybierasz najczystsze ujęcie bez mikrodrgań.</p>"
        );
        posts.add(p1);

        // 2) Kraków
        Post p2 = Post.builder()
                .title("Wawel i okolice: jak ułożyć 30-sekundową sekwencję ujęć bez nudy?")
                .content("""
                    <p>Składam krótką rolkę z Krakowa i chcę, żeby Wawel był „bohaterem” materiału.</p>
                    <p>Macie sprawdzony układ ujęć: szeroki plan → detal → ruch? Chodzi mi o montaż, żeby nie wyglądało jak losowe klipy.</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Kraków")))
                .views(615)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(18))
                .comments(new ArrayList<>())
                .build();
        addComments(p2, users, rnd, allComments,
                "<p>Ja robię zawsze: 1) establishing wide, 2) półzbliżenie na obiekt, 3) detal (np. wieża), 4) ruch odjazdowy na koniec.</p>",
                "<p>Dobry trik: trzymaj jedną dominantę (np. ciepłe kolory) i dopasuj wszystkie klipy pod ten sam kontrast. Wtedy całość się „klei”.</p>",
                "<p>Dodaj jeden „oddech”: statyczny kadr 2–3 sekundy między ruchami. Montaż od razu wygląda bardziej świadomie.</p>"
        );
        posts.add(p2);

        // 3) Warszawa
        Post p3 = Post.builder()
                .title("Pole Mokotowskie: jak uzyskać płynny „tracking” bez efektu mydła?")
                .content("""
                    <p>Chcę nagrać dłuższy, spokojny tracking wzdłuż alejek (bardziej cinematic niż dynamicznie).</p>
                    <p>Macie wskazówki co do prędkości, wysokości i prowadzenia kadru, żeby obraz wyglądał stabilnie i naturalnie?</p>
                    """)
                .postCategory(postCategory6)
                .tags(Set.of(tagByCity.get("Warszawa")))
                .views(890)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(9))
                .comments(new ArrayList<>())
                .build();
        addComments(p3, users, rnd, allComments,
                "<p>Największa różnica robi stała prędkość. Lepiej wolniej i równo niż szybciej z korektami co sekundę.</p>",
                "<p>Ustaw kadr tak, żeby linie alejek „prowadziły” w głąb. Jak obiekt jest centralnie, tracking wygląda dużo spokojniej.</p>",
                "<p>Spróbuj lekkiego tilt down (minimalnie). Wtedy tło mniej „ucieka” i jest bardziej filmowo.</p>",
                "<p>Jak montujesz, utnij pierwszą i ostatnią sekundę ruchu — tam najczęściej widać mikroszarpnięcia.</p>"
        );
        posts.add(p3);

        // 4) Poznań
        Post p4 = Post.builder()
                .title("Park Cytadela: kadry z „symetrią” — jak nie przestrzelić kompozycji?")
                .content("""
                    <p>Chcę zrobić serię ujęć, gdzie główną rolę gra symetria alejek i geometria parku.</p>
                    <p>Jak ustawiasz linię horyzontu i punkt centralny, żeby nie wyszło „prawie równo”, tylko naprawdę równo?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Poznań")))
                .views(477)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(22))
                .comments(new ArrayList<>())
                .build();
        addComments(p4, users, rnd, allComments,
                "<p>Najprościej: wybierz jeden stały punkt odniesienia (np. przecięcie ścieżek) i ustaw go idealnie w centrum kadru.</p>",
                "<p>Jak robisz top-down, pilnuj żeby kamera była naprawdę pionowo. Minimalny skos psuje cały efekt symetrii.</p>",
                "<p>W montażu możesz też delikatnie przyciąć i wypoziomować — ale lepiej złapać to dobrze już na nagraniu.</p>"
        );
        posts.add(p4);

        // 5) Wrocław
        Post p5 = Post.builder()
                .title("Park Grabiszyński jesienią: jak wydobyć kolory bez przesady?")
                .content("""
                    <p>Jesienne ujęcia potrafią wyjść mega, ale łatwo przesadzić z nasyceniem i robi się „cukierkowo”.</p>
                    <p>Jak obrabiacie takie materiały: bardziej kontrast, dehaze, czy selektywna korekta zieleni/pomarańczy?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Wrocław")))
                .views(533)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(30))
                .comments(new ArrayList<>())
                .build();
        addComments(p5, users, rnd, allComments,
                "<p>Ja zaczynam od balansu bieli i ekspozycji, a dopiero potem dotykam nasycenia. Często wystarczy +kontrast lokalny.</p>",
                "<p>Selektywna korekta działa najlepiej: pomarańcze lekko w górę, zieleń delikatnie w dół, wtedy wygląda naturalnie.</p>",
                "<p>Uważaj z dehaze — łatwo robi ciemne krawędzie drzew. Lepiej minimalnie i dołożyć clarity na środek.</p>"
        );
        posts.add(p5);

        // 6) Szczecin
        Post p6 = Post.builder()
                .title("Jasne Błonia: pomysł na hyperlapse z góry — jak zaplanować ruch?")
                .content("""
                    <p>Chcę zrobić hyperlapse: powolny lot do przodu + montaż przyspieszony, żeby alejki „płynęły”.</p>
                    <p>Jak planujecie takie ujęcia, żeby potem w montażu nie było chaosu?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Szczecin")))
                .views(402)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(14))
                .comments(new ArrayList<>())
                .build();
        addComments(p6, users, rnd, allComments,
                "<p>Najważniejsze: stały kierunek i stała wysokość. Jak wysokość „pływa”, hyperlapse wygląda nerwowo.</p>",
                "<p>Zostaw sobie zapas materiału na początku i końcu. W montażu łatwiej wtedy ustabilizować i przyciąć.</p>",
                "<p>Fajny trik: wybierz jeden punkt w oddali jako „cel” i trzymaj go cały czas w tym samym miejscu kadru.</p>"
        );
        posts.add(p6);

        // 7) Łódź
        Post p7 = Post.builder()
                .title("Park na Zdrowiu: orbit wokół jeziora — jak utrzymać równe tempo obrotu?")
                .content("""
                    <p>Orbit wygląda super, dopóki tempo obrotu jest równe. U mnie często przyspiesza w połowie i psuje efekt.</p>
                    <p>Macie metodę, jak „trzymać” orbit, żeby wyglądał jak z reklamy?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Łódź")))
                .views(518)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(26))
                .comments(new ArrayList<>())
                .build();
        addComments(p7, users, rnd, allComments,
                "<p>Mi pomaga myślenie „po łuku”: nie kręcę samym yaw, tylko łączę lekki skręt + delikatny ruch bokiem.</p>",
                "<p>Najczęściej tempo psuje się przy korekcie odległości. Ustaw sobie stały promień i trzymaj go konsekwentnie.</p>",
                "<p>Warto nagrać orbit dłużej niż potrzeba i wyciąć najlepsze 5–8 sekund.</p>"
        );
        posts.add(p7);

        // 8) Rzeszów
        Post p8 = Post.builder()
                .title("Bulwary nad Wisłokiem: jak zrobić spokojny „push forward” bez efektu pływania?")
                .content("""
                    <p>Marzy mi się prosty cinematic: powolny lot do przodu nad rzeką, bez nerwowego „pływania” kadru.</p>
                    <p>Co u was działa najlepiej: wolniej i dłużej, czy krócej, ale bardziej konsekwentnie?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Rzeszów")))
                .views(366)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(33))
                .comments(new ArrayList<>())
                .build();
        addComments(p8, users, rnd, allComments,
                "<p>Zdecydowanie wolniej i dłużej. Jak jest czas na „wejście” w ujęcie, to wygląda dużo bardziej filmowo.</p>",
                "<p>Trzymaj horyzont idealnie prosto — nad wodą każde 0,5 stopnia jest widoczne.</p>",
                "<p>Dobrze działa jeden stały punkt odniesienia (most/drzewo) na osi lotu, wtedy nie „ucieka” kadr.</p>"
        );
        posts.add(p8);

        // 9) Toruń
        Post p9 = Post.builder()
                .title("Bulwar Filadelfijski: jak ogarnąć nocne światła, żeby nie było przepaleń?")
                .content("""
                    <p>Chcę nagrać wieczorny klimat nad Wisłą: lampy, odbicia, spokojne ujęcia.</p>
                    <p>Jak ustawiacie ekspozycję, żeby lampy nie wybijały na biało, a jednocześnie nie zabić cieni?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Toruń")))
                .views(590)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(16))
                .comments(new ArrayList<>())
                .build();
        addComments(p9, users, rnd, allComments,
                "<p>Ja wolę lekko niedoświetlić i potem podnieść cienie w postprodukcji. Przepaleń nie odzyskasz.</p>",
                "<p>Pomaga też trzymać stały balans bieli — jak automatyka skacze, światła wyglądają raz żółto, raz zielono.</p>",
                "<p>Dodaj jedno ujęcie statyczne 6–8 sekund. Nocny klimat lepiej „oddycha”, jak nie wszystko jest w ruchu.</p>"
        );
        posts.add(p9);

        // 10) Bydgoszcz
        Post p10 = Post.builder()
                .title("Myślęcinek: jak nagrać las i polany tak, żeby było widać głębię?")
                .content("""
                    <p>W lesie wszystko często wygląda płasko: drzewa jako jedna ściana.</p>
                    <p>Jakie ujęcia robić, żeby było czuć głębię i warstwy (pierwszy plan / drugi plan / tło)?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Bydgoszcz")))
                .views(431)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(28))
                .comments(new ArrayList<>())
                .build();
        addComments(p10, users, rnd, allComments,
                "<p>Parallax robi cuda: leć bokiem, a drzewa w różnych odległościach zaczną „pracować” względem siebie.</p>",
                "<p>Dodaj jakiś mocny pierwszy plan (korona drzewa / fragment polany), wtedy tło nie jest tylko tapetą.</p>",
                "<p>Unikaj lotu idealnie na wprost w gęsty las — lepszy jest diagonalny kierunek, bo daje wrażenie przestrzeni.</p>"
        );
        posts.add(p10);

        // 11) Białystok
        Post p11 = Post.builder()
                .title("Park Konstytucji 3 Maja: top-down, ale bez „pustego” kadru — macie patenty?")
                .content("""
                    <p>Uwielbiam ujęcia prosto w dół, ale często wychodzą nudno: trawa i ścieżka.</p>
                    <p>Co dodajecie do kompozycji, żeby top-down miał „to coś”?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Białystok")))
                .views(355)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(41))
                .comments(new ArrayList<>())
                .build();
        addComments(p11, users, rnd, allComments,
                "<p>Szukaj wzoru: alejki, zakręty, symetria. Top-down działa, jak jest geometria.</p>",
                "<p>Fajnie wygląda kontrast materiałów: jasna ścieżka + ciemna zieleń. Nawet mały fragment robi kadr.</p>",
                "<p>Jeśli możesz, zrób serię 3 wysokości: nisko / średnio / wysoko. Wtedy top-down jest „częścią historii”, a nie jedynym ujęciem.</p>"
        );
        posts.add(p11);

        // 12) Chorzów
        Post p12 = Post.builder()
                .title("Park Śląski: jak nagrać „spokojną dynamikę” — bez sportowego klimatu?")
                .content("""
                    <p>Chcę, żeby materiał był dynamiczny, ale nadal spokojny i estetyczny (nie jak klip z wyścigów).</p>
                    <p>Jakie ruchy kamery dają „flow”, ale nie są agresywne?</p>
                    """)
                .postCategory(postCategory6)
                .tags(Set.of(tagByCity.get("Chorzów")))
                .views(612)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(20))
                .comments(new ArrayList<>())
                .build();
        addComments(p12, users, rnd, allComments,
                "<p>Łagodne łuki zamiast ostrych skrętów. Jak tor lotu jest „okrągły”, od razu jest spokojniej.</p>",
                "<p>Delikatny tilt gimbala w trakcie lotu wygląda bardzo filmowo, ale musi być minimalny.</p>",
                "<p>Unikaj gwałtownego yaw. Lepiej przesuwać się bokiem i utrzymywać stały kadr.</p>"
        );
        posts.add(p12);

        // 13) Zakopane
        Post p13 = Post.builder()
                .title("Morskie Oko: jak wyciągnąć detale w niebie i w cieniu bez „HDR-owego” efektu?")
                .content("""
                    <p>W górach kontrast jest ogromny: jasne niebo i ciemne zbocza.</p>
                    <p>Jak obrabiacie takie ujęcia, żeby zachować naturalność i detale, ale bez przesady?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Zakopane")))
                .views(980)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(50))
                .comments(new ArrayList<>())
                .build();
        addComments(p13, users, rnd, allComments,
                "<p>Najpierw kontrola świateł (highlights w dół), potem cienie delikatnie w górę. Jak cienie przesadzisz, robi się „plastik”.</p>",
                "<p>Ja lubię zostawić trochę kontrastu — góry tak wyglądają. Naturalność często wygrywa z „idealną” ekspozycją.</p>",
                "<p>Pomaga selektywnie: niebo osobno, teren osobno. Jedna krzywa na wszystko zwykle nie działa.</p>"
        );
        posts.add(p13);

        // 14) Wieliczka
        Post p14 = Post.builder()
                .title("Park św. Kingi: pomysł na krótką rolkę „spacerową” — jak budować tempo?")
                .content("""
                    <p>Chcę zrobić materiał w stylu „spokojny spacer”: alejki, zieleń, detale.</p>
                    <p>Jak układacie takie rolki, żeby nie wyszło monotonne?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Wieliczka")))
                .views(284)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(27))
                .comments(new ArrayList<>())
                .build();
        addComments(p14, users, rnd, allComments,
                "<p>Rób przeplatanie: szeroko → detal → szeroko. Detal może być np. fragment ścieżki, liście, ławka.</p>",
                "<p>Pomaga muzyka i cięcie do rytmu: co 1–2 sekundy zmiana kadru, a raz na jakiś czas dłuższy „oddech”.</p>",
                "<p>Ujęcie „pull-away” na koniec działa świetnie — wygląda jak domknięcie spaceru.</p>"
        );
        posts.add(p14);

        // 15) Dębki
        Post p15 = Post.builder()
                .title("Plaża Dębki: jak uchwycić wzory na piasku, żeby wyglądały „mapowo”, a nie płasko?")
                .content("""
                    <p>Chcę złapać z góry wzory na piasku i fale przy brzegu, ale często wychodzi to jak jednolita plama.</p>
                    <p>Jakie kąty/kadry sprawiają, że tekstura piasku naprawdę „żyje”?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Dębki")))
                .views(701)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(45))
                .comments(new ArrayList<>())
                .build();
        addComments(p15, users, rnd, allComments,
                "<p>Nie tylko top-down — spróbuj pod kątem 30–45°. Tekstura piasku i cienie robią wtedy robotę.</p>",
                "<p>Złota godzina daje mikrocienie na piasku. W południe wszystko się spłaszcza.</p>",
                "<p>Fajnie działa też ruch boczny (parallax). Wzory zaczynają „pracować” i widać głębię.</p>"
        );
        posts.add(p15);

        // 16) Jantar
        Post p16 = Post.builder()
                .title("Plaża Jantar: jak zrobić czyste ujęcie odbić w wodzie przy zachodzie?")
                .content("""
                    <p>Chcę złapać odbicia nieba w mokrym piasku i przy brzegu, ale często wychodzi chaos i brak czytelnego planu.</p>
                    <p>Jak budujecie kompozycję takich ujęć?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Jantar")))
                .views(540)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(38))
                .comments(new ArrayList<>())
                .build();
        addComments(p16, users, rnd, allComments,
                "<p>Wybierz jeden mocny kierunek: albo linia brzegu jako prowadząca, albo odbicie jako główny temat. Nie wszystko naraz.</p>",
                "<p>U mnie najlepiej działa kadr z horyzontem na 1/3 i odbiciem na 2/3. Wtedy jest czytelnie.</p>",
                "<p>Zrób też wersję pionową — odbicia i linia brzegu często lepiej wyglądają w 9:16.</p>"
        );
        posts.add(p16);

        // 17) Hel
        Post p17 = Post.builder()
                .title("Półwysep Helski: jak pokazać kształt linii brzegowej w jednym ujęciu?")
                .content("""
                    <p>Chcę ująć charakterystyczną linię półwyspu tak, żeby była czytelna i robiła efekt „wow”.</p>
                    <p>Lepiej działa szeroka panorama czy spokojny odjazd do tyłu?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Hel")))
                .views(1102)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(60))
                .comments(new ArrayList<>())
                .build();
        addComments(p17, users, rnd, allComments,
                "<p>Odjazd do tyłu jest super, jeśli zaczynasz od detalu (np. fragment plaży), a potem odkrywasz skalę.</p>",
                "<p>Panorama działa, ale musi mieć wyraźny „anchor” — punkt, od którego oko startuje (np. koniec mola, fragment wydm).</p>",
                "<p>Ja bym zrobił dwa klipy: jeden reveal/odjazd, drugi szeroki establishing. W montażu masz komplet.</p>"
        );
        posts.add(p17);

        // 18) Żarnowiec
        Post p18 = Post.builder()
                .title("Jezioro Żarnowieckie: jak podkreślić różnice koloru wody bez sztuczności?")
                .content("""
                    <p>Na jeziorach czasem widać piękne przejścia koloru (płycizny, roślinność, refleksy).</p>
                    <p>Jak to obrabiacie, żeby było czytelne, ale nie wyglądało jak filtr z Instagrama?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Żarnowiec")))
                .views(489)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(35))
                .comments(new ArrayList<>())
                .build();
        addComments(p18, users, rnd, allComments,
                "<p>Selektywnie: podbij tylko te odcienie, które odpowiadają za przejście. Globalne nasycenie zwykle psuje naturalność.</p>",
                "<p>Delikatny kontrast lokalny + minimalny dehaze pomaga wyciągnąć strukturę bez „przekolorowania”.</p>",
                "<p>Warto zostawić trochę refleksów. Jak wszystko „wygładzisz”, woda wygląda sztucznie.</p>"
        );
        posts.add(p18);

        // 19) Tarnobrzeg
        Post p19 = Post.builder()
                .title("Jezioro Tarnobrzeskie: pomysł na ujęcie „pocztówkowe” — co gra najlepiej w kadrze?")
                .content("""
                    <p>Chcę zrobić jedno mocne ujęcie typu „okładka” + kilka ujęć wspierających.</p>
                    <p>Co u was robi klimat nad dużym akwenem: szeroki plan, orbit, a może powolny „crane up”?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Tarnobrzeg")))
                .views(520)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(44))
                .comments(new ArrayList<>())
                .build();
        addComments(p19, users, rnd, allComments,
                "<p>Na „okładkę” najlepszy jest szeroki establishing z czytelnym horyzontem i jedną prowadzącą linią (brzeg/pomost).</p>",
                "<p>Crane up działa świetnie jako intro: start nisko → powoli w górę → panorama. Proste i efektowne.</p>",
                "<p>Orbit zostawiłbym jako ujęcie wspierające. Jak nie ma mocnego obiektu, orbit potrafi być „o niczym”.</p>"
        );
        posts.add(p19);

        // 20) Klucze
        Post p20 = Post.builder()
                .title("Pustynia Błędowska: jak zrobić kolor grading „pustynny”, ale bez żółtej przesady?")
                .content("""
                    <p>Chcę uzyskać klimat „piasku i przestrzeni”: ciepło, ale nadal naturalnie.</p>
                    <p>Macie sprawdzony sposób na grading takich ujęć, żeby nie wyszło wszystko żółte?</p>
                    """)
                .postCategory(postCategory4)
                .tags(Set.of(tagByCity.get("Klucze")))
                .views(933)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(70))
                .comments(new ArrayList<>())
                .build();
        addComments(p20, users, rnd, allComments,
                "<p>Najpierw neutralna baza (WB i ekspozycja), potem ciepło dodawaj w światłach, a nie globalnie na cały obraz.</p>",
                "<p>Świetnie działa lekkie przesunięcie żółci w stronę pomarańczu, ale minimalnie — wtedy piasek wygląda „miękko”.</p>",
                "<p>Jak wszystko robi się żółte, to zwykle winna jest zieleń. Zbij nasycenie zieleni, a piasek automatycznie wygląda lepiej.</p>"
        );
        posts.add(p20);

        // --- Drone for beginners (min. 3) ---

        Post p21 = Post.builder()
                .title("Pierwszy dron na start: mini (≤250g) czy od razu coś większego?")
                .content("""
                    <p>Chcę zacząć przygodę z dronami, ale nie wiem czy brać małego „na spokojnie”, czy od razu większego, bardziej odpornego na wiatr.</p>
                    <p>Co waszym zdaniem daje szybszy progres i mniej frustracji? Jakie błędy robią początkujący najczęściej?</p>
                    """)
                .postCategory(postCategory1)
                .tags(Set.of(tagByCity.get("Warszawa")))
                .views(650)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(8))
                .comments(new ArrayList<>())
                .build();
        addComments(p21, users, rnd, allComments,
                "<p>Na start lepiej mniejszy — mniej kosztują błędy i łatwiej ćwiczyć podstawy bez stresu.</p>",
                "<p>Największa pułapka to latanie „na granicy baterii”. Lepiej kończyć lot wcześniej i mieć zapas na bezpieczny powrót.</p>",
                "<p>Pro tip: ćwicz stałą wysokość + stałą prędkość. Jak to opanujesz, wszystko inne wchodzi dużo łatwiej.</p>"
        );
        posts.add(p21);

        Post p22 = Post.builder()
                .title("Checklista przed pierwszym lotem: RTH, GPS, kompas, kalibracje — co ustawić i sprawdzić?")
                .content("""
                    <p>Wiem, że najwięcej „głupich” wpadek jest na początku. Chcę mieć prostą checklistę, żeby nie zapomnieć o kluczowych rzeczach.</p>
                    <p>Co sprawdzacie zawsze: RTH (wysokość), satelity, home point, ostrzeżenia w apce, pogoda?</p>
                    """)
                .postCategory(postCategory1)
                .tags(Set.of(tagByCity.get("Kraków")))
                .views(720)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(15))
                .comments(new ArrayList<>())
                .build();
        addComments(p22, users, rnd, allComments,
                "<p>U mnie top3: home point złapany, RTH height ustawione z zapasem na drzewa/budynki, i brak ostrzeżeń kompasu.</p>",
                "<p>Jak coś wygląda dziwnie (GPS skacze, kompas się burzy) — lepiej nie startować. Przenieś się 50–100 m dalej.</p>",
                "<p>Przed lotem robię też szybki przegląd śmigieł. Mikropęknięcie potrafi zepsuć cały lot.</p>"
        );
        posts.add(p22);

        Post p23 = Post.builder()
                .title("Jak ćwiczyć płynne ujęcia (cinematic) jako początkujący? Prosty plan treningu na 7 dni")
                .content("""
                    <p>Chcę robić spokojne, płynne ujęcia bez szarpania: proste najazdy, łuki, lekkie orbity.</p>
                    <p>Macie plan ćwiczeń dzień po dniu (15–20 minut), żeby wejść w to szybko i bez chaosu?</p>
                    """)
                .postCategory(postCategory1)
                .tags(Set.of(tagByCity.get("Wrocław")))
                .views(540)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(21))
                .comments(new ArrayList<>())
                .build();
        addComments(p23, users, rnd, allComments,
                "<p>Dzień 1–2: stała wysokość + stała prędkość. Dzień 3–4: łuki. Dzień 5: orbit. Dzień 6–7: łączenie ruchów.</p>",
                "<p>Najbardziej pomaga „mniej ruchów drążkiem”. Jeden delikatny ruch > 10 mikro-korekt.</p>",
                "<p>W montażu ucinaj pierwszą i ostatnią sekundę ujęcia — tam najczęściej widać start/stop i szarpnięcia.</p>"
        );
        posts.add(p23);

        // --- Spots (min. 3) ---

        Post p24 = Post.builder()
                .title("Jak wybieracie spot do latania? Checklista bezpieczeństwa i „plan awaryjny”")
                .content("""
                    <p>Zbieram spoty i chcę podejść do tego sensownie: bez stresu, bez konfliktów z ludźmi, z miejscem na awaryjne lądowanie.</p>
                    <p>Jak wygląda wasza checklista: linie energetyczne, drzewa, kierunek wiatru, strefa startu, obserwator?</p>
                    """)
                .postCategory(postCategory2)
                .tags(Set.of(tagByCity.get("Poznań")))
                .views(480)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(10))
                .comments(new ArrayList<>())
                .build();
        addComments(p24, users, rnd, allComments,
                "<p>Najpierw patrzę na ludzi i linie. Jak są linie lub tłum — odpuszczam, szkoda nerwów.</p>",
                "<p>Zawsze wybieram „korytarz ucieczki” — kierunek, w który mogę polecieć gdy coś pójdzie nie tak.</p>",
                "<p>Dobrze mieć jedno miejsce startu/lądowania i nie mieszać tego z trasą lotu.</p>"
        );
        posts.add(p24);

        Post p25 = Post.builder()
                .title("Plaża i wydmy (Dębki): jak latać, żeby piasek i wiatr nie zepsuły sprzętu i ujęć?")
                .content("""
                    <p>Latanie nad plażą wygląda super, ale piasek i porywy potrafią zrobić kłopot (i w materiale, i w serwisie).</p>
                    <p>Macie praktyczne tipy: gdzie startować, jak chronić gimbala/silniki, jak planować lot przy bryzie?</p>
                    """)
                .postCategory(postCategory2)
                .tags(Set.of(tagByCity.get("Dębki")))
                .views(610)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(29))
                .comments(new ArrayList<>())
                .build();
        addComments(p25, users, rnd, allComments,
                "<p>Nie startuj z sypkiego piasku. Najlepiej z twardego podłoża albo z maty/plecaka (byle stabilnie).</p>",
                "<p>Wiatr nad wodą potrafi się zmieniać co chwilę. Lepiej trzymać większy zapas baterii i nie lecieć „na styk”.</p>",
                "<p>Po locie warto obejrzeć śmigła i okolice silników — piasek lubi wejść tam, gdzie nie trzeba.</p>"
        );
        posts.add(p25);

        Post p26 = Post.builder()
                .title("Spot nad wodą (Hel): jak planować trasę i wrócić bez stresu? (zapas baterii, RTH, wiatr)")
                .content("""
                    <p>Nad wodą ujęcia są piękne, ale ryzyko większe: wiatr, brak miejsca na awaryjne lądowanie, daleki powrót.</p>
                    <p>Jakie zasady przyjmujecie, żeby minimalizować ryzyko? Jak planujecie trasę lotu?</p>
                    """)
                .postCategory(postCategory2)
                .tags(Set.of(tagByCity.get("Hel")))
                .views(830)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(40))
                .comments(new ArrayList<>())
                .build();
        addComments(p26, users, rnd, allComments,
                "<p>Najważniejsze: większy zapas baterii niż zwykle i żadnych „ostatnich ujęć” na końcówce.</p>",
                "<p>Jak wieje w twarz na powrocie, potrafi zjeść baterię dużo szybciej. Lecąc „tam”, miej to w głowie.</p>",
                "<p>Warto robić krótsze odcinki i wracać bliżej co jakiś czas, zamiast od razu lecieć daleko jednym ciągiem.</p>"
        );
        posts.add(p26);

        // --- Event (min. 3) ---

        Post p27 = Post.builder()
                .title("Propozycja meetupu dronowego w Gdańsku: spokojne latanie + wymiana tipów (bez spiny)")
                .content("""
                    <p>Myślę o małym meetupie: kilka osób, spokojne loty, wymiana ustawień, tipy do ujęć i bezpieczeństwa.</p>
                    <p>Jakie zasady powinny być „must-have”, żeby było bezpiecznie i komfortowo dla wszystkich?</p>
                    """)
                .postCategory(postCategory3)
                .tags(Set.of(tagByCity.get("Gdańsk")))
                .views(390)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(16))
                .comments(new ArrayList<>())
                .build();
        addComments(p27, users, rnd, allComments,
                "<p>Ustalcie strefę startu/lądowania i prostą komunikację: kto startuje, kto ląduje, kto ma problem.</p>",
                "<p>Warto ograniczyć liczbę dronów w powietrzu naraz. Lepiej kolejka lotów niż chaos.</p>",
                "<p>Jak robi się tłoczno od postronnych ludzi — przerwa i koniec tematu. Bezpieczeństwo wygrywa.</p>"
        );
        posts.add(p27);

        Post p28 = Post.builder()
                .title("Mini-event w Krakowie: warsztat „cinematic” — plan ujęć + feedback do materiału")
                .content("""
                    <p>Pomysł: spotkanie, gdzie każdy nagrywa 2–3 krótkie ujęcia według prostych zadań (reveal, orbit, push-forward), a potem dajemy sobie feedback.</p>
                    <p>Jak to ugryźć, żeby było fajnie i bezpiecznie? Jakie zadania byłyby najlepsze?</p>
                    """)
                .postCategory(postCategory3)
                .tags(Set.of(tagByCity.get("Kraków")))
                .views(420)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(34))
                .comments(new ArrayList<>())
                .build();
        addComments(p28, users, rnd, allComments,
                "<p>Super pomysł. Zadania niech będą krótkie i powtarzalne — wtedy łatwo porównać „co zadziałało”.</p>",
                "<p>Fajnie dodać jedno zadanie „statyczne” (bez ruchu), bo to uczy kompozycji i cierpliwości.</p>",
                "<p>Ustalcie limit czasu lotu na osobę, żeby każdy miał równe szanse i nie było zatorów.</p>"
        );
        posts.add(p28);

        Post p29 = Post.builder()
                .title("Event/spotkanie w Warszawie: naprawy po kraksach + szybki serwis w terenie (toolkit)")
                .content("""
                    <p>Chciałbym zrobić spotkanie bardziej praktyczne: co mieć w torbie, jak zrobić szybką diagnozę i wrócić do latania.</p>
                    <p>Co jest w waszym „minimum serwisowym” na wyjazd? (śmigła, taśmy, zipy, śrubki, lutownica?)</p>
                    """)
                .postCategory(postCategory3)
                .tags(Set.of(tagByCity.get("Warszawa")))
                .views(510)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(52))
                .comments(new ArrayList<>())
                .build();
        addComments(p29, users, rnd, allComments,
                "<p>Minimum: zapas śmigieł, zipy, taśma, mały zestaw imbusów/bitów i coś do czyszczenia.</p>",
                "<p>Ja dorzucam koszulki termokurczliwe i kawałek przewodu — czasem to ratuje dzień.</p>",
                "<p>Najważniejsze i tak są śmigła. 80% „problemów po kraksie” rozwiązuje ich wymiana.</p>"
        );
        posts.add(p29);

        // --- Build first drone (min. 3) ---

        Post p30 = Post.builder()
                .title("Buduję pierwszego 5\": jak dobrać ramę, silniki i ESC/FC, żeby nie przepalić budżetu?")
                .content("""
                    <p>Składam pierwszego quada i boję się złych zakupów: niekompatybilnych części albo „przerostu” na start.</p>
                    <p>Jakie są najczęstsze pułapki przy doborze ramy, silników i ESC/FC? Co byście zrobili inaczej po czasie?</p>
                    """)
                .postCategory(postCategory5)
                .tags(Set.of(tagByCity.get("Łódź")))
                .views(910)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(18))
                .comments(new ArrayList<>())
                .build();
        addComments(p30, users, rnd, allComments,
                "<p>Pułapka #1: śruby silników za długie — potrafią uszkodzić uzwojenie. Sprawdzaj długość!</p>",
                "<p>Na start lepiej popularna rama — części są dostępne i łatwiej coś dorwać po kraksie.</p>",
                "<p>Nie oszczędzaj na zasilaniu (kable/XT60). Złe luty i cienkie przewody to proszenie się o kłopoty.</p>"
        );
        posts.add(p30);

        Post p31 = Post.builder()
                .title("Lutowanie w dronach: jak robić mocne luty na ESC i nie odrywać padów?")
                .content("""
                    <p>Najbardziej stresuje mnie lutowanie dużych przewodów (XT60/ESC) i kondensatora.</p>
                    <p>Macie proste zasady: temperatura, topnik, pocynowanie, kolejność działań?</p>
                    """)
                .postCategory(postCategory5)
                .tags(Set.of(tagByCity.get("Szczecin")))
                .views(690)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(27))
                .comments(new ArrayList<>())
                .build();
        addComments(p31, users, rnd, allComments,
                "<p>Topnik + szybkie lutowanie. Jak grzejesz długo, to pad ma większą szansę się odkleić.</p>",
                "<p>Pocynuj pad i przewód osobno, dopiero potem łącz. To skraca czas do 1–2 sekund.</p>",
                "<p>Unieruchom przewody (imadło/trzecia ręka). Jak coś drgnie przy stygnięciu, lut robi się słaby.</p>"
        );
        posts.add(p31);

        Post p32 = Post.builder()
                .title("Analog vs digital (HD) do pierwszego buildu: co ma więcej sensu przy kraksach?")
                .content("""
                    <p>Wahają mnie koszty i serwis po kraksach. Analog jest tańszy, digital daje świetny obraz.</p>
                    <p>Co polecacie do pierwszego buildu, jeśli celem jest szybkie latanie i nauka, a nie walka ze sprzętem?</p>
                    """)
                .postCategory(postCategory5)
                .tags(Set.of(tagByCity.get("Toruń")))
                .views(840)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(43))
                .comments(new ArrayList<>())
                .build();
        addComments(p32, users, rnd, allComments,
                "<p>Jeśli liczysz się z kraksami, analog mniej boli finansowo i szybciej wracasz w powietrze.</p>",
                "<p>Digital jest mega, ale potrafi dołożyć stresu na starcie (waga, koszt, naprawy po dzwonie).</p>",
                "<p>Dobry kompromis: zacząć analog, nauczyć się serwisu, a potem przejść na HD w kolejnym buildzie.</p>"
        );
        posts.add(p32);

        // --- FPV (brakował 1 do „min. 3”) ---

        Post p33 = Post.builder()
                .title("FPV: jello/wibracje w nagraniach — jak diagnozować (mechanika → filtry → PID) bez zgadywania?")
                .content("""
                    <p>Mam w FPV delikatne wibracje/jello i nie wiem, czy winna jest mechanika, czy ustawienia.</p>
                    <p>Jaką macie kolejność: śmigła/silniki/luzy → softmount → filtry → PID? Co najczęściej okazuje się problemem?</p>
                    """)
                .postCategory(postCategory6)
                .tags(Set.of(tagByCity.get("Bydgoszcz")))
                .views(760)
                .author(pickUser.get())
                .publishDate(LocalDateTime.now().minusDays(12))
                .comments(new ArrayList<>())
                .build();
        addComments(p33, users, rnd, allComments,
                "<p>Zawsze zaczynam od mechaniki: nowe śmigła, luzy ramy, śruby, stan silników. Soft jest na końcu.</p>",
                "<p>PID-ami da się czasem „przykryć” problem, ale najlepiej usunąć przyczynę wibracji u źródła.</p>",
                "<p>Rób zmiany po jednej rzeczy i testuj. Jak zmienisz 5 parametrów naraz, nie wiesz co zadziałało.</p>"
        );
        posts.add(p33);


        for (Post post : posts) {
            assignRandomVotes(post, users);
            assignRandomFollowers(post, users, post.getAuthor(), rnd);
            post.setCommentsCount(post.getComments() != null ? post.getComments().size() : 0);
            post.setTrendingScore(calculateTrendingScore(post));
        }

        for (PostComment c : allComments) {
            assignRandomVotes(c, users);
        }

        postTagRepository.saveAll(tagByCity.values());
        postRepository.saveAll(posts);
        commentRepository.saveAll(allComments);
    }

// ======================= HELPERY =======================

    private Map<String, Tag> upsertForumTags(List<String> names) {
        Map<String, Tag> existing = postTagRepository.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(Tag::getName, t -> t, (a, b) -> a));

        Map<String, Tag> finalExisting = existing;
        List<Tag> missing = names.stream()
                .filter(n -> !finalExisting.containsKey(n))
                .map(n -> Tag.builder().name(n).build())
                .toList();

        if (!missing.isEmpty()) {
            postTagRepository.saveAll(missing);
            existing = postTagRepository.findAll().stream()
                    .collect(java.util.stream.Collectors.toMap(Tag::getName, t -> t, (a, b) -> a));
        }

        Map<String, Tag> result = new HashMap<>();
        for (String n : names) result.put(n, existing.get(n));
        return result;
    }

    private void addComments(
            Post post,
            List<UserEntity> users,
            Random rnd,
            List<PostComment> sink,
            String... commentHtml
    ) {
        for (int i = 0; i < commentHtml.length; i++) {
            UserEntity author = users.get(rnd.nextInt(users.size()));
            if (post.getAuthor() != null && author.equals(post.getAuthor()) && users.size() > 1) {
                author = users.get((rnd.nextInt(users.size() - 1) + 1) % users.size());
            }

            PostComment c = PostComment.builder()
                    .content(commentHtml[i])
                    .author(author)
                    .post(post)
                    .publishDate(post.getPublishDate().plusHours(i + 1))
                    .build();

            post.getComments().add(c);
            sink.add(c);
        }
    }

 void assignRandomFollowers(
            Post post,
            List<UserEntity> allUsers,
            UserEntity postAuthor,
            Random rnd
    ) {
        if (allUsers == null || allUsers.size() <= 1) return;

        List<UserEntity> pool = new ArrayList<>(allUsers);
        if (postAuthor != null) pool.removeIf(u -> Objects.equals(u.getId(), postAuthor.getId()));
        if (pool.isEmpty()) return;

        Collections.shuffle(pool, rnd);

        int maxFollowers = Math.min(35, pool.size());
        int followerCount = rnd.nextInt(maxFollowers + 1);

        Set<UserEntity> followers = new HashSet<>(pool.subList(0, followerCount));

        post.getFollowers().clear();
        post.getFollowers().addAll(followers);
    }

    // ===================== VOTES + FOLLOWED =====================

    private void assignRandomVotes(Votable entity, List<UserEntity> users) {
        List<UserEntity> pool = new ArrayList<>(users);
        Collections.shuffle(pool, random);

        int totalVotes = random.nextInt(pool.size() + 1);
        int upVoteCount = totalVotes == 0 ? 0 : random.nextInt(totalVotes + 1);

        Set<UserEntity> upVoters = new HashSet<>(pool.subList(0, upVoteCount));
        Set<UserEntity> downVoters = new HashSet<>(pool.subList(upVoteCount, totalVotes));

        entity.setUpVotedBy(upVoters);
        entity.setDownVotedBy(downVoters);
        entity.setUpVotes(upVoters.size());
        entity.setDownVotes(downVoters.size());
    }

    private int calculateTrendingScore(Post post) {
        return post.getViews() + post.getUpVotes() * 2 - post.getDownVotes();
    }
}
