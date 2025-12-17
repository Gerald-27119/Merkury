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
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PopulateForumService {

    private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final PostCategoryRepository postCategoryRepository;
    private final PostTagRepository postTagRepository;
    private final UserEntityRepository userRepository;

    private static final long SEED = 20251216L;
    private static final LocalDateTime SEED_TIME = LocalDateTime.of(2025, 12, 1, 12, 0);

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
            "pawelKrawczyk",
            "agataDabrowska",
            "kamilKaczmarek",
            "weronikaWrobel",
            "mateuszPawlak",
            "zuzannaNowicka",
            "lukaszMichalski",
            "karolinaSikora",
            "konradBorkowski",
            "magdaCzarnecka",
            "patrykRutkowski"
    );

    private record CategorySeed(String name, String description, String colour) {
    }

    private record PostSeed(
            String title,
            String content,
            String categoryName,
            String tagCity,
            int views,
            int daysAgo,
            List<String> comments
    ) {
    }

    @Transactional
    public void initForumData() {
        List<UserEntity> users = USERNAMES.stream()
                .map(u -> userRepository.findByUsername(u)
                        .orElseThrow(() -> new IllegalStateException("Brak użytkownika w DB: " + u)))
                .toList();

        if (users.size() < 5) return;

        Map<String, PostCategory> categoryByName = upsertForumCategories(List.of(
                new CategorySeed("Drone for beginners", "Getting started with drones.", "#eab308"),
                new CategorySeed("Spots", "Best places to fly.", "#3b82f6"),
                new CategorySeed("Event", "Meetups and drone events.", "#4f46e5"),
                new CategorySeed("Best place for media", "Top photo-worthy locations.", "#ef4444"),
                new CategorySeed("Build first drone", "DIY drone building tips.", "#22c55e"),
                new CategorySeed("FPV", "All about FPV flying.", "#ec4899")
        ));

        List<String> cityTagNames = List.of(
                "Gdańsk", "Kraków", "Warszawa", "Poznań", "Wrocław", "Szczecin", "Łódź", "Rzeszów",
                "Toruń", "Bydgoszcz", "Białystok", "Chorzów", "Zakopane", "Wieliczka", "Dębki",
                "Jantar", "Hel", "Żarnowiec", "Tarnobrzeg", "Klucze"
        );
        Map<String, Tag> tagByCity = upsertForumTags(cityTagNames);

        List<Post> posts = new ArrayList<>();
        List<PostComment> allComments = new ArrayList<>();

        for (PostSeed s : buildPostSeeds()) {
            PostCategory category = categoryByName.get(s.categoryName());
            if (category == null) throw new IllegalStateException("Brak kategorii: " + s.categoryName());

            Tag tag = tagByCity.get(s.tagCity());
            if (tag == null) throw new IllegalStateException("Brak tagu miasta: " + s.tagCity());

            Post p = Post.builder()
                    .title(s.title)
                    .content(s.content)
                    .postCategory(category)
                    .tags(Set.of(tag))
                    .views(s.views)
                    .author(authorForPost(users, s.title))
                    .publishDate(SEED_TIME.minusDays(s.daysAgo))
                    .comments(new ArrayList<>())
                    .build();

            addCommentsDeterministic(p, users, allComments, s.comments);

            posts.add(p);
        }

        for (Post post : posts) {
            assignDeterministicVotes(post, users, "post:" + post.getTitle());
            assignDeterministicFollowers(post, users, "post:" + post.getTitle());
            post.setCommentsCount(post.getComments() != null ? post.getComments().size() : 0);
            post.setTrendingScore(calculateTrendingScore(post));
        }

        ensureFollowedPostsPerUser(users, posts, 4);

        for (Post post : posts) {
            post.setTrendingScore(calculateTrendingScore(post));
        }


        for (int i = 0; i < allComments.size(); i++) {
            PostComment c = allComments.get(i);
            assignDeterministicVotes(c, users, "comment:" + c.getPost().getTitle() + ":" + i);
        }

        postTagRepository.saveAll(tagByCity.values());
        postRepository.saveAll(posts);
        commentRepository.saveAll(allComments);
    }

    // ======================= SEEDS =======================

    private List<PostSeed> buildPostSeeds() {
        return List.of(
                new PostSeed(
                        "Plaża Stogi: jak nagrać filmowy „reveal” nad wydmami bez szarpania?",
                        """
                                <p>Chcę nagrać krótki cinematic na Plaży Stogi: start nisko za wydmą i powolne wynurzenie na szeroki plan morza.</p>
                                <p>Macie tipy jak ustawić ruch (yaw/tilt), żeby wyszło płynnie i „premium”? Interesuje mnie też kolejność ujęć (reveal → orbit → odjazd).</p>
                                """,
                        "Best place for media",
                        "Gdańsk",
                        742,
                        12,
                        List.of(
                                "<p>U mnie najlepiej działa bardzo wolny yaw + minimalny tilt w trakcie wynurzania. Jak tilt jest stały, obraz wygląda spokojniej.</p>",
                                "<p>Zrób dwa podejścia: jedno dłuższe i wolniejsze, drugie krótsze i bardziej dynamiczne. W montażu łatwiej zbudować rytm.</p>",
                                "<p>Spróbuj też wersji: reveal → krótki top-down na fale → odjazd wzdłuż linii brzegu. Fajnie się „zamyka” historię.</p>",
                                "<p>Jeśli masz możliwość, nagraj ten sam ruch 2–3 razy identycznie. Potem wybierasz najczystsze ujęcie bez mikrodrgań.</p>"
                        )
                ),
                new PostSeed(
                        "Wawel i okolice: jak ułożyć 30-sekundową sekwencję ujęć bez nudy?",
                        """
                                <p>Składam krótką rolkę z Krakowa i chcę, żeby Wawel był „bohaterem” materiału.</p>
                                <p>Macie sprawdzony układ ujęć: szeroki plan → detal → ruch? Chodzi mi o montaż, żeby nie wyglądało jak losowe klipy.</p>
                                """,
                        "Best place for media",
                        "Kraków",
                        615,
                        18,
                        List.of(
                                "<p>Ja robię zawsze: 1) establishing wide, 2) półzbliżenie na obiekt, 3) detal (np. wieża), 4) ruch odjazdowy na koniec.</p>",
                                "<p>Dobry trik: trzymaj jedną dominantę (np. ciepłe kolory) i dopasuj wszystkie klipy pod ten sam kontrast. Wtedy całość się „klei”.</p>",
                                "<p>Dodaj jeden „oddech”: statyczny kadr 2–3 sekundy między ruchami. Montaż od razu wygląda bardziej świadomie.</p>"
                        )
                ),
                new PostSeed(
                        "Pole Mokotowskie: jak uzyskać płynny „tracking” bez efektu mydła?",
                        """
                                <p>Chcę nagrać dłuższy, spokojny tracking wzdłuż alejek (bardziej cinematic niż dynamicznie).</p>
                                <p>Macie wskazówki co do prędkości, wysokości i prowadzenia kadru, żeby obraz wyglądał stabilnie i naturalnie?</p>
                                """,
                        "FPV",
                        "Warszawa",
                        890,
                        9,
                        List.of(
                                "<p>Największa różnica robi stała prędkość. Lepiej wolniej i równo niż szybciej z korektami co sekundę.</p>",
                                "<p>Ustaw kadr tak, żeby linie alejek „prowadziły” w głąb. Jak obiekt jest centralnie, tracking wygląda dużo spokojniej.</p>",
                                "<p>Spróbuj lekkiego tilt down (minimalnie). Wtedy tło mniej „ucieka” i jest bardziej filmowo.</p>",
                                "<p>Jak montujesz, utnij pierwszą i ostatnią sekundę ruchu — tam najczęściej widać mikroszarpnięcia.</p>"
                        )
                ),
                new PostSeed(
                        "Park Cytadela: kadry z „symetrią” — jak nie przestrzelić kompozycji?",
                        """
                                <p>Chcę zrobić serię ujęć, gdzie główną rolę gra symetria alejek i geometria parku.</p>
                                <p>Jak ustawiasz linię horyzontu i punkt centralny, żeby nie wyszło „prawie równo”, tylko naprawdę równo?</p>
                                """,
                        "Best place for media",
                        "Poznań",
                        477,
                        22,
                        List.of(
                                "<p>Najprościej: wybierz jeden stały punkt odniesienia (np. przecięcie ścieżek) i ustaw go idealnie w centrum kadru.</p>",
                                "<p>Jak robisz top-down, pilnuj żeby kamera była naprawdę pionowo. Minimalny skos psuje cały efekt symetrii.</p>",
                                "<p>W montażu możesz też delikatnie przyciąć i wypoziomować — ale lepiej złapać to dobrze już na nagraniu.</p>"
                        )
                ),
                new PostSeed(
                        "Park Grabiszyński jesienią: jak wydobyć kolory bez przesady?",
                        """
                                <p>Jesienne ujęcia potrafią wyjść mega, ale łatwo przesadzić z nasyceniem i robi się „cukierkowo”.</p>
                                <p>Jak obrabiacie takie materiały: bardziej kontrast, dehaze, czy selektywna korekta zieleni/pomarańczy?</p>
                                """,
                        "Best place for media",
                        "Wrocław",
                        533,
                        30,
                        List.of(
                                "<p>Ja zaczynam od balansu bieli i ekspozycji, a dopiero potem dotykam nasycenia. Często wystarczy +kontrast lokalny.</p>",
                                "<p>Selektywna korekta działa najlepiej: pomarańcze lekko w górę, zieleń delikatnie w dół, wtedy wygląda naturalnie.</p>",
                                "<p>Uważaj z dehaze — łatwo robi ciemne krawędzie drzew. Lepiej minimalnie i dołożyć clarity na środek.</p>"
                        )
                ),

                new PostSeed(
                        "Jasne Błonia: pomysł na hyperlapse z góry — jak zaplanować ruch?",
                        """
                                <p>Chcę zrobić hyperlapse: powolny lot do przodu + montaż przyspieszony, żeby alejki „płynęły”.</p>
                                <p>Jak planujecie takie ujęcia, żeby potem w montażu nie było chaosu?</p>
                                """,
                        "Best place for media",
                        "Szczecin",
                        402,
                        14,
                        List.of(
                                "<p>Najważniejsze: stały kierunek i stała wysokość. Jak wysokość „pływa”, hyperlapse wygląda nerwowo.</p>",
                                "<p>Zostaw sobie zapas materiału na początku i końcu. W montażu łatwiej wtedy ustabilizować i przyciąć.</p>",
                                "<p>Fajny trik: wybierz jeden punkt w oddali jako „cel” i trzymaj go cały czas w tym samym miejscu kadru.</p>"
                        )
                ),
                new PostSeed(
                        "Park na Zdrowiu: orbit wokół jeziora — jak utrzymać równe tempo obrotu?",
                        """
                                <p>Orbit wygląda super, dopóki tempo obrotu jest równe. U mnie często przyspiesza w połowie i psuje efekt.</p>
                                <p>Macie metodę, jak „trzymać” orbit, żeby wyglądał jak z reklamy?</p>
                                """,
                        "Best place for media",
                        "Łódź",
                        518,
                        26,
                        List.of(
                                "<p>Mi pomaga myślenie „po łuku”: nie kręcę samym yaw, tylko łączę lekki skręt + delikatny ruch bokiem.</p>",
                                "<p>Najczęściej tempo psuje się przy korekcie odległości. Ustaw sobie stały promień i trzymaj go konsekwentnie.</p>",
                                "<p>Warto nagrać orbit dłużej niż potrzeba i wyciąć najlepsze 5–8 sekund.</p>"
                        )
                ),
                new PostSeed(
                        "Bulwary nad Wisłokiem: jak zrobić spokojny „push forward” bez efektu pływania?",
                        """
                                <p>Marzy mi się prosty cinematic: powolny lot do przodu nad rzeką, bez nerwowego „pływania” kadru.</p>
                                <p>Co u was działa najlepiej: wolniej i dłużej, czy krócej, ale bardziej konsekwentnie?</p>
                                """,
                        "Best place for media",
                        "Rzeszów",
                        366,
                        33,
                        List.of(
                                "<p>Zdecydowanie wolniej i dłużej. Jak jest czas na „wejście” w ujęcie, to wygląda dużo bardziej filmowo.</p>",
                                "<p>Trzymaj horyzont idealnie prosto — nad wodą każde 0,5 stopnia jest widoczne.</p>",
                                "<p>Dobrze działa jeden stały punkt odniesienia (most/drzewo) na osi lotu, wtedy nie „ucieka” kadr.</p>"
                        )
                ),
                new PostSeed(
                        "Bulwar Filadelfijski: jak ogarnąć nocne światła, żeby nie było przepaleń?",
                        """
                                <p>Chcę nagrać wieczorny klimat nad Wisłą: lampy, odbicia, spokojne ujęcia.</p>
                                <p>Jak ustawiacie ekspozycję, żeby lampy nie wybijały na biało, a jednocześnie nie zabić cieni?</p>
                                """,
                        "Best place for media",
                        "Toruń",
                        590,
                        16,
                        List.of(
                                "<p>Ja wolę lekko niedoświetlić i potem podnieść cienie w postprodukcji. Przepaleń nie odzyskasz.</p>",
                                "<p>Pomaga też trzymać stały balans bieli — jak automatyka skacze, światła wyglądają raz żółto, raz zielono.</p>",
                                "<p>Dodaj jedno ujęcie statyczne 6–8 sekund. Nocny klimat lepiej „oddycha”, jak nie wszystko jest w ruchu.</p>"
                        )
                ),
                new PostSeed(
                        "Myślęcinek: jak nagrać las i polany tak, żeby było widać głębię?",
                        """
                                <p>W lesie wszystko często wygląda płasko: drzewa jako jedna ściana.</p>
                                <p>Jakie ujęcia robić, żeby było czuć głębię i warstwy (pierwszy plan / drugi plan / tło)?</p>
                                """,
                        "Best place for media",
                        "Bydgoszcz",
                        431,
                        28,
                        List.of(
                                "<p>Parallax robi cuda: leć bokiem, a drzewa w różnych odległościach zaczną „pracować” względem siebie.</p>",
                                "<p>Dodaj jakiś mocny pierwszy plan (korona drzewa / fragment polany), wtedy tło nie jest tylko tapetą.</p>",
                                "<p>Unikaj lotu idealnie na wprost w gęsty las — lepszy jest diagonalny kierunek, bo daje wrażenie przestrzeni.</p>"
                        )
                ),
                new PostSeed(
                        "Park Konstytucji 3 Maja: top-down, ale bez „pustego” kadru — macie patenty?",
                        """
                                <p>Uwielbiam ujęcia prosto w dół, ale często wychodzą nudno: trawa i ścieżka.</p>
                                <p>Co dodajecie do kompozycji, żeby top-down miał „to coś”?</p>
                                """,
                        "Best place for media",
                        "Białystok",
                        355,
                        41,
                        List.of(
                                "<p>Szukaj wzoru: alejki, zakręty, symetria. Top-down działa, jak jest geometria.</p>",
                                "<p>Fajnie wygląda kontrast materiałów: jasna ścieżka + ciemna zieleń. Nawet mały fragment robi kadr.</p>",
                                "<p>Jeśli możesz, zrób serię 3 wysokości: nisko / średnio / wysoko. Wtedy top-down jest „częścią historii”, a nie jedynym ujęciem.</p>"
                        )
                ),
                new PostSeed(
                        "Park Śląski: jak nagrać „spokojną dynamikę” — bez sportowego klimatu?",
                        """
                                <p>Chcę, żeby materiał był dynamiczny, ale nadal spokojny i estetyczny (nie jak klip z wyścigów).</p>
                                <p>Jakie ruchy kamery dają „flow”, ale nie są agresywne?</p>
                                """,
                        "FPV",
                        "Chorzów",
                        612,
                        20,
                        List.of(
                                "<p>Łagodne łuki zamiast ostrych skrętów. Jak tor lotu jest „okrągły”, od razu jest spokojniej.</p>",
                                "<p>Delikatny tilt gimbala w trakcie lotu wygląda bardzo filmowo, ale musi być minimalny.</p>",
                                "<p>Unikaj gwałtownego yaw. Lepiej przesuwać się bokiem i utrzymywać stały kadr.</p>"
                        )
                ),
                new PostSeed(
                        "Morskie Oko: jak wyciągnąć detale w niebie i w cieniu bez „HDR-owego” efektu?",
                        """
                                <p>W górach kontrast jest ogromny: jasne niebo i ciemne zbocza.</p>
                                <p>Jak obrabiacie takie ujęcia, żeby zachować naturalność i detale, ale bez przesady?</p>
                                """,
                        "Best place for media",
                        "Zakopane",
                        980,
                        50,
                        List.of(
                                "<p>Najpierw kontrola świateł (highlights w dół), potem cienie delikatnie w górę. Jak cienie przesadzisz, robi się „plastik”.</p>",
                                "<p>Ja lubię zostawić trochę kontrastu — góry tak wyglądają. Naturalność często wygrywa z „idealną” ekspozycją.</p>",
                                "<p>Pomaga selektywnie: niebo osobno, teren osobno. Jedna krzywa na wszystko zwykle nie działa.</p>"
                        )
                ),
                new PostSeed(
                        "Park św. Kingi: pomysł na krótką rolkę „spacerową” — jak budować tempo?",
                        """
                                <p>Chcę zrobić materiał w stylu „spokojny spacer”: alejki, zieleń, detale.</p>
                                <p>Jak układacie takie rolki, żeby nie wyszło monotonne?</p>
                                """,
                        "Best place for media",
                        "Wieliczka",
                        284,
                        27,
                        List.of(
                                "<p>Rób przeplatanie: szeroko → detal → szeroko. Detal może być np. fragment ścieżki, liście, ławka.</p>",
                                "<p>Pomaga muzyka i cięcie do rytmu: co 1–2 sekundy zmiana kadru, a raz na jakiś czas dłuższy „oddech”.</p>",
                                "<p>Ujęcie „pull-away” na koniec działa świetnie — wygląda jak domknięcie spaceru.</p>"
                        )
                ),
                new PostSeed(
                        "Plaża Dębki: jak uchwycić wzory na piasku, żeby wyglądały „mapowo”, a nie płasko?",
                        """
                                <p>Chcę złapać z góry wzory na piasku i fale przy brzegu, ale często wychodzi to jak jednolita plama.</p>
                                <p>Jakie kąty/kadry sprawiają, że tekstura piasku naprawdę „żyje”?</p>
                                """,
                        "Best place for media",
                        "Dębki",
                        701,
                        45,
                        List.of(
                                "<p>Nie tylko top-down — spróbuj pod kątem 30–45°. Tekstura piasku i cienie robią wtedy robotę.</p>",
                                "<p>Złota godzina daje mikrocienie na piasku. W południe wszystko się spłaszcza.</p>",
                                "<p>Fajnie działa też ruch boczny (parallax). Wzory zaczynają „pracować” i widać głębię.</p>"
                        )
                ),
                new PostSeed(
                        "Plaża Jantar: jak zrobić czyste ujęcie odbić w wodzie przy zachodzie?",
                        """
                                <p>Chcę złapać odbicia nieba w mokrym piasku i przy brzegu, ale często wychodzi chaos i brak czytelnego planu.</p>
                                <p>Jak budujecie kompozycję takich ujęć?</p>
                                """,
                        "Best place for media",
                        "Jantar",
                        540,
                        38,
                        List.of(
                                "<p>Wybierz jeden mocny kierunek: albo linia brzegu jako prowadząca, albo odbicie jako główny temat. Nie wszystko naraz.</p>",
                                "<p>U mnie najlepiej działa kadr z horyzontem na 1/3 i odbiciem na 2/3. Wtedy jest czytelnie.</p>",
                                "<p>Zrób też wersję pionową — odbicia i linia brzegu często lepiej wyglądają w 9:16.</p>"
                        )
                ),
                new PostSeed(
                        "Półwysep Helski: jak pokazać kształt linii brzegowej w jednym ujęciu?",
                        """
                                <p>Chcę ująć charakterystyczną linię półwyspu tak, żeby była czytelna i robiła efekt „wow”.</p>
                                <p>Lepiej działa szeroka panorama czy spokojny odjazd do tyłu?</p>
                                """,
                        "Best place for media",
                        "Hel",
                        1102,
                        60,
                        List.of(
                                "<p>Odjazd do tyłu jest super, jeśli zaczynasz od detalu (np. fragment plaży), a potem odkrywasz skalę.</p>",
                                "<p>Panorama działa, ale musi mieć wyraźny „anchor” — punkt, od którego oko startuje (np. koniec mola, fragment wydm).</p>",
                                "<p>Ja bym zrobił dwa klipy: jeden reveal/odjazd, drugi szeroki establishing. W montażu masz komplet.</p>"
                        )
                ),
                new PostSeed(
                        "Jezioro Żarnowieckie: jak podkreślić różnice koloru wody bez sztuczności?",
                        """
                                <p>Na jeziorach czasem widać piękne przejścia koloru (płycizny, roślinność, refleksy).</p>
                                <p>Jak to obrabiacie, żeby było czytelne, ale nie wyglądało jak filtr z Instagrama?</p>
                                """,
                        "Best place for media",
                        "Żarnowiec",
                        489,
                        35,
                        List.of(
                                "<p>Selektywnie: podbij tylko te odcienie, które odpowiadają za przejście. Globalne nasycenie zwykle psuje naturalność.</p>",
                                "<p>Delikatny kontrast lokalny + minimalny dehaze pomaga wyciągnąć strukturę bez „przekolorowania”.</p>",
                                "<p>Warto zostawić trochę refleksów. Jak wszystko „wygładzisz”, woda wygląda sztucznie.</p>"
                        )
                ),
                new PostSeed(
                        "Jezioro Tarnobrzeskie: pomysł na ujęcie „pocztówkowe” — co gra najlepiej w kadrze?",
                        """
                                <p>Chcę zrobić jedno mocne ujęcie typu „okładka” + kilka ujęć wspierających.</p>
                                <p>Co u was robi klimat nad dużym akwenem: szeroki plan, orbit, a może powolny „crane up”?</p>
                                """,
                        "Best place for media",
                        "Tarnobrzeg",
                        520,
                        44,
                        List.of(
                                "<p>Na „okładkę” najlepszy jest szeroki establishing z czytelnym horyzontem i jedną prowadzącą linią (brzeg/pomost).</p>",
                                "<p>Crane up działa świetnie jako intro: start nisko → powoli w górę → panorama. Proste i efektowne.</p>",
                                "<p>Orbit zostawiłbym jako ujęcie wspierające. Jak nie ma mocnego obiektu, orbit potrafi być „o niczym”.</p>"
                        )
                ),
                new PostSeed(
                        "Pustynia Błędowska: jak zrobić kolor grading „pustynny”, ale bez żółtej przesady?",
                        """
                                <p>Chcę uzyskać klimat „piasku i przestrzeni”: ciepło, ale nadal naturalnie.</p>
                                <p>Macie sprawdzony sposób na grading takich ujęć, żeby nie wyszło wszystko żółte?</p>
                                """,
                        "Best place for media",
                        "Klucze",
                        933,
                        70,
                        List.of(
                                "<p>Najpierw neutralna baza (WB i ekspozycja), potem ciepło dodawaj w światłach, a nie globalnie na cały obraz.</p>",
                                "<p>Świetnie działa lekkie przesunięcie żółci w stronę pomarańczu, ale minimalnie — wtedy piasek wygląda „miękko”.</p>",
                                "<p>Jak wszystko robi się żółte, to zwykle winna jest zieleń. Zbij nasycenie zieleni, a piasek automatycznie wygląda lepiej.</p>"
                        )
                ),

// --- Drone for beginners (min. 3) ---

                new PostSeed(
                        "Pierwszy dron na start: mini (≤250g) czy od razu coś większego?",
                        """
                                <p>Chcę zacząć przygodę z dronami, ale nie wiem czy brać małego „na spokojnie”, czy od razu większego, bardziej odpornego na wiatr.</p>
                                <p>Co waszym zdaniem daje szybszy progres i mniej frustracji? Jakie błędy robią początkujący najczęściej?</p>
                                """,
                        "Drone for beginners",
                        "Warszawa",
                        650,
                        8,
                        List.of(
                                "<p>Na start lepiej mniejszy — mniej kosztują błędy i łatwiej ćwiczyć podstawy bez stresu.</p>",
                                "<p>Największa pułapka to latanie „na granicy baterii”. Lepiej kończyć lot wcześniej i mieć zapas na bezpieczny powrót.</p>",
                                "<p>Pro tip: ćwicz stałą wysokość + stałą prędkość. Jak to opanujesz, wszystko inne wchodzi dużo łatwiej.</p>"
                        )
                ),
                new PostSeed(
                        "Checklista przed pierwszym lotem: RTH, GPS, kompas, kalibracje — co ustawić i sprawdzić?",
                        """
                                <p>Wiem, że najwięcej „głupich” wpadek jest na początku. Chcę mieć prostą checklistę, żeby nie zapomnieć o kluczowych rzeczach.</p>
                                <p>Co sprawdzacie zawsze: RTH (wysokość), satelity, home point, ostrzeżenia w apce, pogoda?</p>
                                """,
                        "Drone for beginners",
                        "Kraków",
                        720,
                        15,
                        List.of(
                                "<p>U mnie top3: home point złapany, RTH height ustawione z zapasem na drzewa/budynki, i brak ostrzeżeń kompasu.</p>",
                                "<p>Jak coś wygląda dziwnie (GPS skacze, kompas się burzy) — lepiej nie startować. Przenieś się 50–100 m dalej.</p>",
                                "<p>Przed lotem robię też szybki przegląd śmigieł. Mikropęknięcie potrafi zepsuć cały lot.</p>"
                        )
                ),
                new PostSeed(
                        "Jak ćwiczyć płynne ujęcia (cinematic) jako początkujący? Prosty plan treningu na 7 dni",
                        """
                                <p>Chcę robić spokojne, płynne ujęcia bez szarpania: proste najazdy, łuki, lekkie orbity.</p>
                                <p>Macie plan ćwiczeń dzień po dniu (15–20 minut), żeby wejść w to szybko i bez chaosu?</p>
                                """,
                        "Drone for beginners",
                        "Wrocław",
                        540,
                        21,
                        List.of(
                                "<p>Dzień 1–2: stała wysokość + stała prędkość. Dzień 3–4: łuki. Dzień 5: orbit. Dzień 6–7: łączenie ruchów.</p>",
                                "<p>Najbardziej pomaga „mniej ruchów drążkiem”. Jeden delikatny ruch > 10 mikro-korekt.</p>",
                                "<p>W montażu ucinaj pierwszą i ostatnią sekundę ujęcia — tam najczęściej widać start/stop i szarpnięcia.</p>"
                        )
                ),

// --- Spots (min. 3) ---

                new PostSeed(
                        "Jak wybieracie spot do latania? Checklista bezpieczeństwa i „plan awaryjny”",
                        """
                                <p>Zbieram spoty i chcę podejść do tego sensownie: bez stresu, bez konfliktów z ludźmi, z miejscem na awaryjne lądowanie.</p>
                                <p>Jak wygląda wasza checklista: linie energetyczne, drzewa, kierunek wiatru, strefa startu, obserwator?</p>
                                """,
                        "Spots",
                        "Poznań",
                        480,
                        10,
                        List.of(
                                "<p>Najpierw patrzę na ludzi i linie. Jak są linie lub tłum — odpuszczam, szkoda nerwów.</p>",
                                "<p>Zawsze wybieram „korytarz ucieczki” — kierunek, w który mogę polecieć gdy coś pójdzie nie tak.</p>",
                                "<p>Dobrze mieć jedno miejsce startu/lądowania i nie mieszać tego z trasą lotu.</p>"
                        )
                ),
                new PostSeed(
                        "Plaża i wydmy (Dębki): jak latać, żeby piasek i wiatr nie zepsuły sprzętu i ujęć?",
                        """
                                <p>Latanie nad plażą wygląda super, ale piasek i porywy potrafią zrobić kłopot (i w materiale, i w serwisie).</p>
                                <p>Macie praktyczne tipy: gdzie startować, jak chronić gimbala/silniki, jak planować lot przy bryzie?</p>
                                """,
                        "Spots",
                        "Dębki",
                        610,
                        29,
                        List.of(
                                "<p>Nie startuj z sypkiego piasku. Najlepiej z twardego podłoża albo z maty/plecaka (byle stabilnie).</p>",
                                "<p>Wiatr nad wodą potrafi się zmieniać co chwilę. Lepiej trzymać większy zapas baterii i nie lecieć „na styk”.</p>",
                                "<p>Po locie warto obejrzeć śmigła i okolice silników — piasek lubi wejść tam, gdzie nie trzeba.</p>"
                        )
                ),
                new PostSeed(
                        "Spot nad wodą (Hel): jak planować trasę i wrócić bez stresu? (zapas baterii, RTH, wiatr)",
                        """
                                <p>Nad wodą ujęcia są piękne, ale ryzyko większe: wiatr, brak miejsca na awaryjne lądowanie, daleki powrót.</p>
                                <p>Jakie zasady przyjmujecie, żeby minimalizować ryzyko? Jak planujecie trasę lotu?</p>
                                """,
                        "Spots",
                        "Hel",
                        830,
                        40,
                        List.of(
                                "<p>Najważniejsze: większy zapas baterii niż zwykle i żadnych „ostatnich ujęć” na końcówce.</p>",
                                "<p>Jak wieje w twarz na powrocie, potrafi zjeść baterię dużo szybciej. Lecąc „tam”, miej to w głowie.</p>",
                                "<p>Warto robić krótsze odcinki i wracać bliżej co jakiś czas, zamiast od razu lecieć daleko jednym ciągiem.</p>"
                        )
                ),

// --- Event (min. 3) ---

                new PostSeed(
                        "Propozycja meetupu dronowego w Gdańsku: spokojne latanie + wymiana tipów (bez spiny)",
                        """
                                <p>Myślę o małym meetupie: kilka osób, spokojne loty, wymiana ustawień, tipy do ujęć i bezpieczeństwa.</p>
                                <p>Jakie zasady powinny być „must-have”, żeby było bezpiecznie i komfortowo dla wszystkich?</p>
                                """,
                        "Event",
                        "Gdańsk",
                        390,
                        16,
                        List.of(
                                "<p>Ustalcie strefę startu/lądowania i prostą komunikację: kto startuje, kto ląduje, kto ma problem.</p>",
                                "<p>Warto ograniczyć liczbę dronów w powietrzu naraz. Lepiej kolejka lotów niż chaos.</p>",
                                "<p>Jak robi się tłoczno od postronnych ludzi — przerwa i koniec tematu. Bezpieczeństwo wygrywa.</p>"
                        )
                ),
                new PostSeed(
                        "Mini-event w Krakowie: warsztat „cinematic” — plan ujęć + feedback do materiału",
                        """
                                <p>Pomysł: spotkanie, gdzie każdy nagrywa 2–3 krótkie ujęcia według prostych zadań (reveal, orbit, push-forward), a potem dajemy sobie feedback.</p>
                                <p>Jak to ugryźć, żeby było fajnie i bezpiecznie? Jakie zadania byłyby najlepsze?</p>
                                """,
                        "Event",
                        "Kraków",
                        420,
                        34,
                        List.of(
                                "<p>Super pomysł. Zadania niech będą krótkie i powtarzalne — wtedy łatwo porównać „co zadziałało”.</p>",
                                "<p>Fajnie dodać jedno zadanie „statyczne” (bez ruchu), bo to uczy kompozycji i cierpliwości.</p>",
                                "<p>Ustalcie limit czasu lotu na osobę, żeby każdy miał równe szanse i nie było zatorów.</p>"
                        )
                ),
                new PostSeed(
                        "Event/spotkanie w Warszawie: naprawy po kraksach + szybki serwis w terenie (toolkit)",
                        """
                                <p>Chciałbym zrobić spotkanie bardziej praktyczne: co mieć w torbie, jak zrobić szybką diagnozę i wrócić do latania.</p>
                                <p>Co jest w waszym „minimum serwisowym” na wyjazd? (śmigła, taśmy, zipy, śrubki, lutownica?)</p>
                                """,
                        "Event",
                        "Warszawa",
                        510,
                        52,
                        List.of(
                                "<p>Minimum: zapas śmigieł, zipy, taśma, mały zestaw imbusów/bitów i coś do czyszczenia.</p>",
                                "<p>Ja dorzucam koszulki termokurczliwe i kawałek przewodu — czasem to ratuje dzień.</p>",
                                "<p>Najważniejsze i tak są śmigła. 80% „problemów po kraksie” rozwiązuje ich wymiana.</p>"
                        )
                ),

// --- Build first drone (min. 3) ---

                new PostSeed(
                        "Buduję pierwszego 5\": jak dobrać ramę, silniki i ESC/FC, żeby nie przepalić budżetu?",
                        """
                                <p>Składam pierwszego quada i boję się złych zakupów: niekompatybilnych części albo „przerostu” na start.</p>
                                <p>Jakie są najczęstsze pułapki przy doborze ramy, silników i ESC/FC? Co byście zrobili inaczej po czasie?</p>
                                """,
                        "Build first drone",
                        "Łódź",
                        910,
                        18,
                        List.of(
                                "<p>Pułapka #1: śruby silników za długie — potrafią uszkodzić uzwojenie. Sprawdzaj długość!</p>",
                                "<p>Na start lepiej popularna rama — części są dostępne i łatwiej coś dorwać po kraksie.</p>",
                                "<p>Nie oszczędzaj na zasilaniu (kable/XT60). Złe luty i cienkie przewody to proszenie się o kłopoty.</p>"
                        )
                ),
                new PostSeed(
                        "Lutowanie w dronach: jak robić mocne luty na ESC i nie odrywać padów?",
                        """
                                <p>Najbardziej stresuje mnie lutowanie dużych przewodów (XT60/ESC) i kondensatora.</p>
                                <p>Macie proste zasady: temperatura, topnik, pocynowanie, kolejność działań?</p>
                                """,
                        "Build first drone",
                        "Szczecin",
                        690,
                        27,
                        List.of(
                                "<p>Topnik + szybkie lutowanie. Jak grzejesz długo, to pad ma większą szansę się odkleić.</p>",
                                "<p>Pocynuj pad i przewód osobno, dopiero potem łącz. To skraca czas do 1–2 sekund.</p>",
                                "<p>Unieruchom przewody (imadło/trzecia ręka). Jak coś drgnie przy stygnięciu, lut robi się słaby.</p>"
                        )
                ),
                new PostSeed(
                        "Analog vs digital (HD) do pierwszego buildu: co ma więcej sensu przy kraksach?",
                        """
                                <p>Wahają mnie koszty i serwis po kraksach. Analog jest tańszy, digital daje świetny obraz.</p>
                                <p>Co polecacie do pierwszego buildu, jeśli celem jest szybkie latanie i nauka, a nie walka ze sprzętem?</p>
                                """,
                        "Build first drone",
                        "Toruń",
                        840,
                        43,
                        List.of(
                                "<p>Jeśli liczysz się z kraksami, analog mniej boli finansowo i szybciej wracasz w powietrze.</p>",
                                "<p>Digital jest mega, ale potrafi dołożyć stresu na starcie (waga, koszt, naprawy po dzwonie).</p>",
                                "<p>Dobry kompromis: zacząć analog, nauczyć się serwisu, a potem przejść na HD w kolejnym buildzie.</p>"
                        )
                ),

                new PostSeed(
                        "FPV: jello/wibracje w nagraniach — jak diagnozować (mechanika → filtry → PID) bez zgadywania?",
                        """
                                <p>Mam w FPV delikatne wibracje/jello i nie wiem, czy winna jest mechanika, czy ustawienia.</p>
                                <p>Jaką macie kolejność: śmigła/silniki/luzy → softmount → filtry → PID? Co najczęściej okazuje się problemem?</p>
                                """,
                        "FPV",
                        "Bydgoszcz",
                        760,
                        12,
                        List.of(
                                "<p>Zawsze zaczynam od mechaniki: nowe śmigła, luzy ramy, śruby, stan silników. Soft jest na końcu.</p>",
                                "<p>PID-ami da się czasem „przykryć” problem, ale najlepiej usunąć przyczynę wibracji u źródła.</p>",
                                "<p>Rób zmiany po jednej rzeczy i testuj. Jak zmienisz 5 parametrów naraz, nie wiesz co zadziałało.</p>"
                        )
                )
        );
    }


    private void ensureFollowedPostsPerUser(List<UserEntity> users, List<Post> posts, int perUser) {
        if (users == null || users.isEmpty() || posts == null || posts.isEmpty()) return;

        List<Post> orderedPosts = posts.stream()
                .sorted(Comparator.comparing(Post::getTitle))
                .toList();

        List<UserEntity> orderedUsers = new ArrayList<>(users);
        orderedUsers.sort(Comparator.comparing(UserEntity::getUsername));

        for (UserEntity u : orderedUsers) {
            List<Post> pool = new ArrayList<>(orderedPosts);

            pool.removeIf(p -> p.getAuthor() != null && Objects.equals(p.getAuthor().getId(), u.getId()));
            if (pool.isEmpty()) continue;

            Random r = detRandom("userFollowedPosts", u.getUsername());
            Collections.shuffle(pool, r);

            int n = Math.min(perUser, pool.size());
            for (int i = 0; i < n; i++) {
                Post p = pool.get(i);

                u.getFollowedPosts().add(p);

                p.getFollowers().add(u);
            }
        }
    }



    private Map<String, PostCategory> upsertForumCategories(List<CategorySeed> seeds) {
        Map<String, PostCategory> existing = postCategoryRepository.findAll().stream()
                .collect(Collectors.toMap(PostCategory::getName, Function.identity(), (a, b) -> a));

        List<PostCategory> toSave = new ArrayList<>();
        for (CategorySeed s : seeds) {
            PostCategory cat = existing.get(s.name());
            if (cat == null) {
                cat = PostCategory.builder()
                        .name(s.name())
                        .description(s.description())
                        .colour(s.colour())
                        .build();
            } else {
                cat.setDescription(s.description());
                cat.setColour(s.colour());
            }
            toSave.add(cat);
        }
        postCategoryRepository.saveAll(toSave);

        Set<String> names = seeds.stream().map(CategorySeed::name).collect(Collectors.toSet());
        return postCategoryRepository.findAll().stream()
                .filter(c -> names.contains(c.getName()))
                .collect(Collectors.toMap(PostCategory::getName, Function.identity(), (a, b) -> a));
    }


    private Map<String, Tag> upsertForumTags(List<String> names) {
        Map<String, Tag> existing = postTagRepository.findAll().stream()
                .collect(Collectors.toMap(Tag::getName, t -> t, (a, b) -> a));

        Map<String, Tag> finalExisting = existing;
        List<Tag> missing = names.stream()
                .filter(n -> !finalExisting.containsKey(n))
                .map(n -> Tag.builder().name(n).build())
                .toList();

        if (!missing.isEmpty()) {
            postTagRepository.saveAll(missing);
            existing = postTagRepository.findAll().stream()
                    .collect(Collectors.toMap(Tag::getName, t -> t, (a, b) -> a));
        }

        Map<String, Tag> result = new HashMap<>();
        for (String n : names) result.put(n, existing.get(n));
        return result;
    }

    // ======================= DETERMINISTIC HELPERS =======================

    private Random detRandom(String salt, String key) {
        long s = SEED;
        s = 31 * s + salt.hashCode();
        s = 31 * s + key.hashCode();
        return new Random(s);
    }

    private UserEntity authorForPost(List<UserEntity> users, String postTitle) {
        Random r = detRandom("postAuthor", postTitle);
        return users.get(r.nextInt(users.size()));
    }

    private void addCommentsDeterministic(
            Post post,
            List<UserEntity> users,
            List<PostComment> sink,
            List<String> commentHtml
    ) {
        Random r = detRandom("commentAuthors", post.getTitle());

        for (int i = 0; i < commentHtml.size(); i++) {
            UserEntity author = users.get(r.nextInt(users.size()));
            if (post.getAuthor() != null && author.equals(post.getAuthor()) && users.size() > 1) {
                author = users.get((r.nextInt(users.size() - 1) + 1) % users.size());
            }

            PostComment c = PostComment.builder()
                    .content(commentHtml.get(i))
                    .author(author)
                    .post(post)
                    .publishDate(post.getPublishDate().plusHours(i + 1)) // deterministyczne
                    .build();

            post.getComments().add(c);
            sink.add(c);
        }
    }

    private void assignDeterministicFollowers(Post post, List<UserEntity> allUsers, String key) {
        if (allUsers == null || allUsers.size() <= 1) return;

        List<UserEntity> pool = new ArrayList<>(allUsers);
        if (post.getAuthor() != null) {
            pool.removeIf(u -> Objects.equals(u.getId(), post.getAuthor().getId()));
        }
        pool.sort(Comparator.comparing(UserEntity::getUsername));

        Random r = detRandom("followers", key);
        Collections.shuffle(pool, r);

        int maxFollowers = Math.min(35, pool.size());
        int followerCount = r.nextInt(maxFollowers + 1);

        post.getFollowers().clear();
        post.getFollowers().addAll(new HashSet<>(pool.subList(0, followerCount)));
    }

    private void assignDeterministicVotes(Votable entity, List<UserEntity> users, String key) {
        List<UserEntity> pool = new ArrayList<>(users);
        pool.sort(Comparator.comparing(UserEntity::getUsername));

        Random r = detRandom("votes", key);
        Collections.shuffle(pool, r);

        int totalVotes = r.nextInt(pool.size() + 1);
        int upVoteCount = totalVotes == 0 ? 0 : r.nextInt(totalVotes + 1);

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
