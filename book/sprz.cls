%
% This is the class for PJATK thesis
%
% Tadeusz Puźniakowski 2023
% Ian Canals-Wąsik (title page draft)
%
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{sprz}[2023/10/27 SPRZ]
\LoadClass[12pt,a4paper]{report}

\def\@makechapterhead#1{
    \vspace*{1pt}
    {\parindent \z@ \raggedright \normalfont
        \ifnum \c@secnumdepth>\m@ne
        \huge\bfseries \@chapapp\space \thechapter\par\nobreak
        \vskip 10pt
        \fi
        \interlinepenalty\@M
        \Huge\bfseries #1\par\nobreak
        \vskip 26pt
    }
}

\def\@makeschapterhead#1{%
    \vspace*{1pt}
    {\parindent \z@ \raggedright \normalfont
    \interlinepenalty\@M
    \Huge\bfseries #1\par\nobreak
    \vskip 26pt
    }
}

\renewcommand{\baselinestretch}{1.0}
\RequirePackage[
    a4paper,
    top=2.5cm,
    bottom=2.5cm,
    inner=3.5cm,
    outer=2.5cm
]{geometry}

\RequirePackage{listings} %Aby dało się umieszczać kody źródłowe programów
\RequirePackage[table]{xcolor}
\RequirePackage{algorithmic} %Aby dało się umieszczać algorytmy
\RequirePackage[utf8]{inputenc}
\RequirePackage{polski} % Włączenie obsługi polskich liter
\RequirePackage{tabularx}
\RequirePackage{url}
\RequirePackage{graphicx}
\RequirePackage[pscoord]{eso-pic}% The zero point of the coordinate systemis the lower left corner of the page (the default).
\RequirePackage{multirow}
\RequirePackage{graphicx}
\RequirePackage{float}
\RequirePackage[backend=biber,style=numeric,sorting=none]{biblatex}

\DeclareFieldFormat[article,inbook,incollection,inproceedings,patent,thesis,
    unpublished,techreport,misc,book]{title}{,,#1''}
% {title}{\mkbibquote{#1}}

\newcommand{\@nabstract}{\@latex@error{No \noexpand\@nabstract given}\@ehc}
\newcommand{\nabstract}[1]{\renewcommand{\@nabstract}{#1}}

\newcommand{\@studfield}{\@latex@error{No \noexpand\@studfield given}\@ehc}
\newcommand{\studfield}[1]{\renewcommand{\@studfield}{#1}}

\newcommand{\@studtype}{\@latex@error{No \noexpand\@studtype given}\@ehc}
\newcommand{\studtype}[1]{\renewcommand{\@studtype}{#1}}

\newcommand{\@engtitle}{\@latex@error{No \noexpand\@engtitle given}\@ehc}
\newcommand{\engtitle}[1]{\renewcommand{\@engtitle}{#1}}

\newcommand{\@acronym}{\@latex@error{No \noexpand\@acronym given}\@ehc}
\newcommand{\acronym}[1]{\renewcommand{\@acronym}{#1}}

\newcommand{\@titledate}{\@latex@error{No \noexpand\@titledate given}\@ehc}
\newcommand{\titledate}[1]{\renewcommand{\@titledate}{#1}}

\newcommand{\@reviewer}{\@latex@error{No \noexpand\@reviewer given}\@ehc}
\newcommand{\reviewer}[1]{\renewcommand{\@reviewer}{#1}}

\newcommand{\@finishdate}{\@latex@error{No \noexpand\@finishdate given}\@ehc}
\newcommand{\finishdate}[1]{\renewcommand{\@finishdate}{#1}}

\newcommand{\@productsandservices}{\@latex@error{No \noexpand\@productsandservices given}\@ehc}
\newcommand{\productsandservices}[1]{\renewcommand{\@productsandservices}{#1}}

\newcommand{\@mainfunctionalities}{\@latex@error{No \noexpand\@mainfunctionalities given}\@ehc}
\newcommand{\mainfunctionalities}[1]{\renewcommand{\@mainfunctionalities}{#1}}

\newcommand{\@supervisor}{\@latex@error{No \noexpand\@supervisor given}\@ehc}
\newcommand{\supervisor}[1]{\renewcommand{\@supervisor}{#1}}

\newcommand{\@projectgoals}{\@latex@error{No \noexpand\@projectgoals given}\@ehc}
\newcommand{\projectgoals}[1]{\renewcommand{\@projectgoals}{#1}}

\newcommand{\@successmeasure}{\@latex@error{No \noexpand\@successmeasure given}\@ehc}
\newcommand{\successmeasure}[1]{\renewcommand{\@successmeasure}{#1}}

\newcommand{\@projlimitations}{\@latex@error{No \noexpand\@projlimitations given}\@ehc}
\newcommand{\projlimitations}[1]{\renewcommand{\@projlimitations}{#1}}

\newcommand{\@authors}{}
\newcommand{\@authorstp}{}
\newcommand{\@authorstablerows}{}
\newcommand{\@authorattachment}{}

\renewcommand{\author}[4]{%
    \expandafter\g@addto@macro\expandafter\@authors\expandafter{#1 & #2 \\ \hline}
    \expandafter\g@addto@macro\expandafter\@authorstp\expandafter{\textbf{#1} \\ Nr albumu #2 \\ Nazwa specjalizacji: #3 \\}
    \expandafter\g@addto@macro\expandafter\@authorstablerows\expandafter{#1 & #2 & #3 & #4 \\ \hline}
    \expandafter\g@addto@macro\expandafter\@authorattachment\expandafter{#1\_}
}

\newcommand{\@consultants}{}
\newcommand{\consultant}[1]{%
    \expandafter\g@addto@macro\expandafter\@consultants\expandafter{\item #1
    }
}

\newcommand{\@nkeywords}{}
\newcommand{\@nkeywordscoma}{}
\newcommand{\keyword}[1]{%
    \expandafter\g@addto@macro\expandafter\@nkeywords\expandafter{\@nkeywordscoma#1}
    \renewcommand{\@nkeywordscoma}{, }
}

\newcommand{\putimage}[4]{%
    \begin{figure}[h!]
    \label{#3}
    \centering
    \includegraphics[width={#4}]{#2}
    \caption{#1}
    \end{figure}
}

\define@key{pjatk}{label}{\def\tablabel{#1}}
\define@key{pjatk}{caption}{\def\tabcaption{#1}}

% Define the new environment 'stakeholder' and custom commands for stakeholders' information
\newenvironment{stakeholder}[1][]{%
    \setkeys{pjatk}{#1}% Setting default key values
    \newcommand{\id}[1]{Identyfikator: & ##1 \\ \hline}
    \newcommand{\name}[1]{Nazwa: & ##1 \\ \hline}
    \newcommand{\descr}[1]{Opis: & ##1 \\ \hline}
    \newcommand{\type}[1]{Typ udziałowca: & ##1 \\ \hline}
    \newcommand{\viewpoint}[1]{Punkt widzenia: & ##1 \\ \hline}
    \newcommand{\limitations}[1]{Ograniczenia: & ##1 \\ \hline}
    \newcommand{\requ}[1]{Wymagania: & ##1 \\ \hline}
    \table[h!]
    \centering
    \begin{tabular}{|>{\columncolor{lightgray}}c|p{0.6\linewidth}|}
    \hline
    \rowcolor{lightgray}\multicolumn{2}{|c|}{\textbf{KARTA UDZIAŁOWCA}} \\
    \hline
}{%
    \end{tabular}
    \caption{\tabcaption}
    \label{\tablabel}
    \endtable
}

% Define the new environment 'requirementstab' and custom commands for requirements information
\newenvironment{requirementstab}[1][]{%
    \setkeys{pjatk}{#1}% Setting default key values
    \newcommand{\id}[1]{Identyfikator: & ##1 & }
    \newcommand{\priority}[1]{Priorytet: & ##1 \\ \hline}
    \newcommand{\name}[1]{Nazwa: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \newcommand{\descr}[1]{Opis: & \multicolumn{3}{|p{0.6\linewidth}|}{\parbox{0.99\linewidth}{##1}}  \\ \hline}
    \newcommand{\acceptcrit}[1]{Kryteria akceptacji: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \newcommand{\inputdata}[1]{Dane wejściowe: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \newcommand{\preconditions}[1]{Warunki początkowe: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \newcommand{\postconditions}[1]{Warunki końcowe: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \newcommand{\exceptions}[1]{Sytuacje wyjątkowe: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \newcommand{\implementation}[1]{Szczegóły implementacji: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \newcommand{\sholder}[1]{Udziałowiec: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \newcommand{\reqrelated}[1]{Wymagania powiązane: & \multicolumn{3}{|p{0.6\linewidth}|}{##1}  \\ \hline}
    \table[H]
    \centering
    \begin{tabular}{|>{\columncolor{lightgray}}l|l|>{\columncolor{lightgray}}l|p{0.1\linewidth}|}
    \hline
    \rowcolor{lightgray}\multicolumn{4}{|c|}{\textbf{KARTA WYMAGANIA}} \\
    \hline
}{%
    \end{tabular}
    \caption{\tabcaption}
    \label{\tablabel}
    \endtable
}

\newcommand{\generalrequirement}[7]{
    \begin{table}[h!]
    \centering
    \begin{tabular}{|>{\columncolor{lightgray}}l|l|>{\columncolor{lightgray}}l|p{0.1\linewidth}|}
    \hline
    \rowcolor{lightgray}\multicolumn{4}{|c|}{\textbf{KARTA WYMAGANIA}}               \\
    \hline
    \hline
    Identyfikator:       & #1                                      & Priorytet: & #2 \\
    \hline
    Nazwa:               & \multicolumn{3}{|p{0.6\linewidth}|}{#3}                   \\
    \hline
    Opis:                & \multicolumn{3}{|p{0.6\linewidth}|}{#4}                   \\
    \hline
    Udziałowiec:         & \multicolumn{3}{|p{0.6\linewidth}|}{#5}                   \\
    \hline
    Wymagania powiązane: & \multicolumn{3}{|p{0.6\linewidth}|}{#6}                   \\
    \hline
    \end{tabular}
    \caption{#3}
    \label{#7}
    \end{table}
}

\newcommand{\placetextbox}[4]{% \placetextbox{<offset top>}{<offset left/right>}{<align>}{<stuff>}
    \setbox0=\hbox{#4}% Put <stuff> in a box
    \AddToShipoutPictureFG*{% Add <stuff> to current page foreground
        \if #3r
            \put(\LenToUnit{\paperwidth-#1},\LenToUnit{\paperheight-#2}){\vtop{{\null}\makebox[0pt][r]{\begin{tabular}{r}#4\end{tabular}}}}%
        \else
            \put(\LenToUnit{#1},\LenToUnit{\paperheight-#2}){\vtop{{\null}\makebox[0pt][l]{\begin{tabular}{l}#4\end{tabular}}}}%
        \fi
    }%
}%

\renewcommand{\maketitle}{%
    \renewcommand{\baselinestretch}{1.0}
    \begin{titlepage}
        \begin{center}
            \includegraphics[width=1.0\textwidth]{sprz/pjatk} \\
            ~ \\
            %\large
            \textbf{Wydział Informatyki} \\
            \textbf{Filia w Gdańsku} \\
            ~ \\
            \@authorstp
            %\large
            \huge
            \textbf{\@title}
            \\
            \normalsize
            ~ \\
            \begin{tabularx}{\textwidth}{X l}
                ~ & Rodzaj pracy \\
                ~ & ~~inżynierska \\
                ~ & Imię i nazwisko promotora \\
                ~ & ~~\@supervisor
            \end{tabularx}
            \vfill{\textbf{Gdańsk, \@date}}
        \end{center}
        \newpage
        \textbf{\\Streszczenie:}
        \@nabstract
        \textbf{\\Słowa kluczowe:}
        \@nkeywords
        \newpage
    \end{titlepage}
    \renewcommand{\baselinestretch}{1.0}
}

\newcommand{\@mysmartparbox}[2]{%
    \parbox{#1}{\vspace{0.1cm}#2\vspace{0.1cm}}%
}

% --- helper do bloków w "Rezultaty i zakres" (nagłówek + treść + linia) ---
\newcommand{\@pcblock}[2]{%
    \begin{tabular}[t]{@{}p{\linewidth}@{}}
    {\centering\textbf{\textit{#1}}\par}%
    \vspace{2pt}\hrule\vspace{6pt}%
    \raggedright #2
    \end{tabular}%
}

\newcommand{\makeprojectcard}{%
    \begin{center}
    \includegraphics[width=0.8\textwidth]{sprz/pjatk}\\[0.8ex]
    {\large\textbf{Karta projektu}}
    \end{center}

    \begingroup
    \renewcommand{\baselinestretch}{1.0}\selectfont
    \small
    \setlength{\tabcolsep}{6pt}
    \renewcommand{\arraystretch}{1.25}

    \begin{center}
    \begin{tabular}{|p{0.25\linewidth}|p{0.45\linewidth}|p{0.30\linewidth}|}
    \hline
    \multicolumn{2}{|p{0.70\linewidth}|}{%
        \textbf{Temat projektu:}\par
        \@title\par\medskip
        \textbf{Temat projektu po angielsku:}\par
        \@engtitle
    } &
    \parbox[t]{\linewidth}{%
        \textbf{Akronim:}\par
        \@acronym\par\medskip
        \textbf{Data ustalenia tematu:}\par
        \@titledate
    }\\
    \hline
    \multicolumn{2}{|p{0.70\linewidth}|}{%
        \textbf{Promotor:}\par
        \@supervisor
    } &
    \parbox[t]{\linewidth}{%
        \textbf{Konsultanci:}\par
        \vspace{-0.5\baselineskip}
        \begin{enumerate}\setlength{\itemsep}{0pt}
        \@consultants
        \end{enumerate}
    }\\
    \hline

    \multicolumn{3}{|p{\linewidth}|}{%
        \textbf{Cele projektu:}\par
        \@projectgoals
    }\\
    \hline

    \multicolumn{1}{|p{0.12\linewidth}|}{%
        \textbf{\textit{Rezultaty i zakres}}%
    } &
    \multicolumn{2}{p{0.88\linewidth}|}{%
        \begin{tabular}{p{0.22\linewidth}|p{0.73\linewidth}}
        \textit{\textbf{Oczekiwane} \newline \textbf{produkty/usługi}} &
        \@productsandservices \\ \hline
        \textit{\textbf{Główne} \newline \textbf{funkcjonalności} \newline \textbf{i/albo cechy}} &
        \@mainfunctionalities
        \end{tabular}
    }\\
    \hline

    \multicolumn{3}{|p{\linewidth}|}{%
        \textbf{Miary sukcesu:}\par
        \@successmeasure
    }\\
    \hline

    \multicolumn{3}{|p{\linewidth}|}{%
        \textbf{Ograniczenia:}\par
        \@projlimitations
    }\\
    \hline
    \end{tabular}
    \end{center}

    \begin{center}
    \begin{tabular}{|p{0.30\linewidth}|p{0.17\linewidth}|p{0.27\linewidth}|p{0.20\linewidth}|}
    \hline
    \textbf{Wykonawcy} & \textbf{Numer} \newline \textbf{albumu} & \textbf{Specjalizacja} & \textbf{Tryb studiów}\\
    \hline
    \@authorstablerows
    \end{tabular}
    \end{center}

    \begin{center}
    \begin{tabular}{|p{0.40\linewidth}|p{0.60\linewidth}|}
    \hline
    \textbf{Data ukończenia projektu:}\par \@finishdate &
    \textbf{Recenzent:}\par \@reviewer\\
    \hline
    \end{tabular}
    \end{center}

    \endgroup
    \newpage
}

\newcommand{\makedeclaration}{%
    \begin{center}
    \textbf{DEPRECATED}
    Według nowych wytycznych nie umieszczamy w pracy deklaracji. Proszę usunąć komendę \\makedeclaration
    \end{center}
    \newpage
}

\newcommand{\makethesisattachments}{%
    \chapter*{Załączniki}

    Płyta CD z następującą zawartością:
    \begin{itemize}
    \item {\em{pliki projektowe}} -- pliki składające się na całość projektu
    \begin{itemize}
    \item repozytorium kodu źródłowego wraz z instrukcją zbudowania i uruchomienia projektu
    \item źródło pracy inżynierskiej.
    \end{itemize}
    \item {\em{\@authorattachment%
    praca pisemna}} -- katalog zawierający plik PDF z pracą inżynierską.
    \end{itemize}

    \newpage
}

\lstset{
    belowcaptionskip=1\baselineskip,
    breaklines=true,
    xleftmargin=\parindent,
    showstringspaces=true,         % podkreślanie spacji wewnątrz łańcuchów
    numbers=left,                   % gdzie umieszczać numery linii
    numberstyle=\footnotesize,      % wielkość czcionki dla numerów linii
    captionpos=b,
    showstringspaces=false,
    basicstyle=\footnotesize\ttfamily,
    keywordstyle=\bfseries\color{green!40!black},
    commentstyle=\itshape\color{purple!40!black},
    identifierstyle=\color{blue},
    stringstyle=\color{orange},
    literate=
        {á}{{\'a}}1 {é}{{\'e}}1 {í}{{\'i}}1 {ó}{{\'o}}1 {ú}{{\'u}}1
        {Á}{{\'A}}1 {É}{{\'E}}1 {Í}{{\'I}}1 {Ó}{{\'O}}1 {Ú}{{\'U}}1
        {à}{{\`a}}1 {è}{{\`e}}1 {ì}{{\`i}}1 {ò}{{\`o}}1 {ù}{{\`u}}1
        {À}{{\`A}}1 {È}{{\`E}}1 {Ì}{{\`I}}1 {Ò}{{\`O}}1 {Ù}{{\`U}}1
        {ä}{{\"a}}1 {ë}{{\"e}}1 {ï}{{\"i}}1 {ö}{{\"o}}1 {ü}{{\"u}}1
        {Ä}{{\"A}}1 {Ë}{{\"E}}1 {Ï}{{\"I}}1 {Ö}{{\"O}}1 {Ü}{{\"U}}1
        {â}{{\^a}}1 {ê}{{\^e}}1 {î}{{\^i}}1 {ô}{{\^o}}1 {û}{{\^u}}1
        {Â}{{\^A}}1 {Ê}{{\^E}}1 {Î}{{\^I}}1 {Ô}{{\^O}}1 {Û}{{\^U}}1
        {ã}{{\~a}}1 {ẽ}{{\~e}}1 {ĩ}{{\~i}}1 {õ}{{\~o}}1 {ũ}{{\~u}}1
        {Ã}{{\~A}}1 {Ẽ}{{\~E}}1 {Ĩ}{{\~I}}1 {Õ}{{\~O}}1 {Ũ}{{\~U}}1
        {œ}{{\oe}}1 {Œ}{{\OE}}1 {æ}{{\ae}}1 {Æ}{{\AE}}1 {ß}{{\ss}}1
        {ű}{{\H{u}}}1 {Ű}{{\H{U}}}1 {ő}{{\H{o}}}1 {Ő}{{\H{O}}}1
        {ç}{{\c c}}1 {Ç}{{\c C}}1 {ø}{{\o}}1 {Ø}{{\O}}1 {å}{{\r a}}1 {Å}{{\r A}}1
        {€}{{\euro}}1 {£}{{\pounds}}1 {«}{{\guillemotleft}}1
        {»}{{\guillemotright}}1 {ñ}{{\~n}}1 {Ñ}{{\~N}}1 {¿}{{?`}}1 {¡}{{!`}}1
}
