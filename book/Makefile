FNAME = engineer
TARGETS = $(FNAME).pdf

all: $(TARGETS)

$(FNAME).pdf: $(FNAME).tex
	latexmk $^


clean:
	rm -f $(FNAME).bcf $(FNAME).xml $(FNAME).run.xml $(FNAME).aux $(FNAME)-blx.bib $(FNAME).blg  $(FNAME).nav  $(FNAME).pdf $(FNAME).bbl  $(FNAME).log  $(FNAME).out  $(FNAME).snm	$(FNAME).toc $(FNAME).fdb_latexmk  $(FNAME).fls