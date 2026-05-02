/* ============ FUNNEL.JS — postcode gate, multi-step form, sticky CTA ============ */
(function () {

  // ---- Sticky mobile CTA: show after 50% of viewport scrolled ----
  const sticky = document.getElementById('sticky-cta');
  if (sticky) {
    const onScroll = () => {
      sticky.classList.toggle('visible', window.scrollY > window.innerHeight * 0.4);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

})();

// ---- POSTCODE GATE — Alpine component ----
function postcodeGate() {
  // Brugse Ommeland (35km radius around Brugge) — postcodes 8000–8530 ish
  const inArea = [
    8000, 8200, 8300, 8301, 8310, 8340, 8370, 8380, 8400, 8420, 8430, 8450, 8460, 8480, 8490,
    8500, 8501, 8510, 8520, 8530, 8550, 8551, 8552, 8553, 8554, 8560, 8570, 8580,
    8600, 8610, 8620, 8630, 8640, 8647, 8650, 8660, 8670, 8680, 8690,
    8700, 8710, 8720, 8730, 8740, 8750, 8755, 8760, 8770, 8780, 8790,
    8800, 8810, 8820, 8830, 8840, 8850, 8860, 8870, 8880, 8890,
    8900, 8902, 8904, 8906, 8908, 8920, 8930, 8940, 8950, 8951, 8952, 8953, 8954,
    8956, 8957, 8958, 8970, 8972, 8978, 8980,
    9000, 9050, 9070, 9080, 9090
  ];
  return {
    postcode: '',
    result: null, // null | 'yes' | 'no' | 'invalid'
    place: '',
    check() {
      const pc = parseInt((this.postcode || '').trim(), 10);
      if (!pc || isNaN(pc) || pc < 1000 || pc > 9999) {
        this.result = 'invalid'; this.place = '';
        return;
      }
      this.result = inArea.includes(pc) ? 'yes' : 'no';
      const places = {
        8000:'Brugge centrum', 8200:'Sint-Andries / Sint-Michiels', 8310:'Assebroek / Sint-Kruis',
        8340:'Damme / Sijsele', 8370:'Blankenberge', 8380:'Lissewege / Zeebrugge',
        8400:'Oostende', 8420:'De Haan', 8430:'Middelkerke', 8450:'Bredene', 8460:'Oudenburg',
        8490:'Jabbeke / Stalhille', 8500:'Kortrijk', 8550:'Zwevegem', 8600:'Diksmuide',
        8610:'Kortemark', 8620:'Nieuwpoort', 8630:'Veurne', 8650:'Houthulst',
        8670:'Koksijde', 8680:'Koekelare', 8690:'Alveringem',
        8700:'Tielt', 8730:'Beernem / Oedelem', 8740:'Pittem', 8750:'Wingene',
        8770:'Ingelmunster', 8800:'Roeselare', 8820:'Torhout', 8830:'Hooglede',
        8840:'Staden', 8870:'Izegem', 8900:'Ieper', 8970:'Poperinge', 8980:'Zonnebeke',
        8300:'Knokke-Heist', 8301:'Heist-aan-Zee', 8400:'Oostende',
        9000:'Gent', 9050:'Gentbrugge / Ledeberg', 9080:'Lochristi'
      };
      this.place = places[pc] || '';
    },
    onEnter(e) { if (e.key === 'Enter') this.check(); }
  };
}

// ---- MULTI-STEP FORM — Alpine component ----
function multiStepForm() {
  return {
    step: 1,
    total: 5,
    sent: false,
    data: {
      postcode: '',
      project: '',
      budget: '',
      timing: '',
      naam: '',
      telefoon: '',
      email: '',
      bericht: '',
      consent: false
    },
    next() { if (this.step < this.total) this.step++; },
    back() { if (this.step > 1) this.step--; },
    pick(field, value) {
      this.data[field] = value;
      // auto-advance on tile click
      setTimeout(() => this.next(), 200);
    },
    canProceed() {
      if (this.step === 1) return /^\d{4}$/.test(this.data.postcode);
      if (this.step === 2) return !!this.data.project;
      if (this.step === 3) return !!this.data.budget;
      if (this.step === 4) return !!this.data.timing;
      return true;
    },
    async submit() {
      if (!this.data.naam || !this.data.telefoon || !this.data.consent) return;
      // Form would POST to Resend/Formspree in production. For demo: simulate.
      // window.fetch('https://formspree.io/f/xyz', {method:'POST', body: JSON.stringify(this.data), headers:{'Accept':'application/json'}});
      this.sent = true;
    },
    progressClass(i) {
      if (i < this.step) return 'done';
      if (i === this.step) return 'active';
      return '';
    }
  };
}
