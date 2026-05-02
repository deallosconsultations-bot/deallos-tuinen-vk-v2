/* ============ Garden Quiz — Alpine component ============ */
function quiz() {
  return {
    step: 0,
    done: false,
    answers: [],
    questions: [
      { q: 'Welke sfeer past het best bij u?',
        opts: ['Strak en modern — hardscape, vorm, rust', 'Romantisch — borders, bloei, geur', 'Mediterraan — terras, gravel, olijf', 'Wild & natuurlijk — inheems, vlinders, weinig gazon'] },
      { q: 'Hoeveel tijd wilt u jaarlijks aan onderhoud besteden?',
        opts: ['Zo weinig mogelijk (laat ons komen)', 'Een uurtje per week', 'Het is mijn hobby — laat de planten maar komen'] },
      { q: 'Wat is uw indicatieve budget?',
        opts: ['€ 8 000 – 15 000 (heraanleg deel van de tuin)', '€ 15 000 – 35 000 (volledige tuin, basis terras)', '€ 35 000 – 75 000 (alles, inclusief hardscape & verlichting)', '€ 75 000+ (premium, op maat, geen compromis)'] },
      { q: 'Wanneer wilt u dat de tuin klaar is?',
        opts: ['Komend voorjaar', 'Komende zomer', 'Najaar — geen haast', 'Nog flexibel'] }
    ],
    answer(opt) {
      this.answers.push(opt);
      if (this.step < this.questions.length - 1) this.step++;
      else this.compute();
    },
    compute() {
      const styleIdx = this.questions[0].opts.indexOf(this.answers[0]);
      const profiles = [
        { title: 'De architectonische tuin', desc: 'Strakke lijnen, hardscape, structuurplanten en avondverlichting. Onderhoudsarm, hoog rendement op jaren.', budget: '€ 25 – 65 k', time: '6–10 weken' },
        { title: 'De romantische landschapstuin', desc: 'Diepe borders, geurplanten, vrijstaande bomen en een natuurlijk meanderpad. Bloei van maart tot oktober.', budget: '€ 18 – 48 k', time: '4–8 weken' },
        { title: 'De mediterrane terrastuin', desc: 'Bluesteen of kassei, olijf, lavendel, gravel — geluiden van een Provençaalse dorpsplein in Brugge.', budget: '€ 22 – 55 k', time: '5–8 weken' },
        { title: 'De biodiverse natuurtuin', desc: 'Inheemse planten, klein gazon, vlinder- en bijenmix, waterelement. Laag onderhoud, hoog leven.', budget: '€ 15 – 38 k', time: '4–7 weken' }
      ];
      this.result = profiles[styleIdx] || profiles[0];
      this.done = true;
    }
  };
}
