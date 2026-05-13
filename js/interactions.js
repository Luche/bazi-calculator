// Interaction detection for HS and EB pairs. Depends on tables.js.

(function() {
  // ── HS tables ──────────────────────────────────────────────────────────────
  const _HS_COMBOS = [
    {a:'甲',b:'己',el:'Earth'},{a:'乙',b:'庚',el:'Metal'},
    {a:'丙',b:'辛',el:'Water'},{a:'丁',b:'壬',el:'Wood'},{a:'戊',b:'癸',el:'Fire'},
  ];
  const _HS_CLASHES = [['甲','庚'],['乙','辛'],['丙','壬'],['丁','癸']];

  // ── EB tables ──────────────────────────────────────────────────────────────
  const _SIX_CLASH = [
    ['子','午'],['丑','未'],['寅','申'],['卯','酉'],['辰','戌'],['巳','亥'],
  ];
  const _SIX_COMBO = [
    {a:'子',b:'丑',el:'Earth'},{a:'寅',b:'亥',el:'Wood'},{a:'卯',b:'戌',el:'Fire'},
    {a:'辰',b:'酉',el:'Metal'},{a:'巳',b:'申',el:'Water'},{a:'午',b:'未',el:'Fire'},
  ];
  const _THREE_COMBO = [
    {trio:['亥','卯','未'],el:'Wood'},{trio:['寅','午','戌'],el:'Fire'},
    {trio:['巳','酉','丑'],el:'Metal'},{trio:['申','子','辰'],el:'Water'},
  ];
  const _HALF_PAIRS = [
    {a:'亥',b:'卯',el:'Wood'}, {a:'卯',b:'未',el:'Wood'},
    {a:'寅',b:'午',el:'Fire'}, {a:'午',b:'戌',el:'Fire'},
    {a:'巳',b:'酉',el:'Metal'},{a:'酉',b:'丑',el:'Metal'},
    {a:'申',b:'子',el:'Water'},{a:'子',b:'辰',el:'Water'},
  ];
  const _SEASONAL = [
    {trio:['寅','卯','辰'],el:'Wood', s:'Spring'},
    {trio:['巳','午','未'],el:'Fire', s:'Summer'},
    {trio:['申','酉','戌'],el:'Metal',s:'Autumn'},
    {trio:['亥','子','丑'],el:'Water',s:'Winter'},
  ];
  const _HARM = [
    ['子','未'],['丑','午'],['寅','巳'],['卯','辰'],['申','亥'],['酉','戌'],
  ];
  const _DESTROY = [
    ['子','酉'],['丑','辰'],['寅','亥'],['卯','午'],['申','巳'],['未','戌'],
  ];
  // Three Persecuting Clash — partial pairs (each pair can appear independently)
  const _PERSIST_PAIRS = [
    ['寅','巳'],['巳','申'],['申','寅'],
    ['丑','戌'],['戌','未'],['未','丑'],
  ];
  const _SELF_CLASH = ['辰','午','酉','亥'];

  // ── Pinyin helpers ──────────────────────────────────────────────────────────
  function _bPY(b) { return T.BRANCH_PY[b]; }
  function _sPY(s) { return T.STEM_PY[s]; }

  // ── HS interaction between two stems ───────────────────────────────────────
  function _hsInteraction(s1, s2) {
    for (const {a, b, el} of _HS_COMBOS) {
      if ((s1===a&&s2===b)||(s1===b&&s2===a))
        return `stem combination (${_sPY(s1)}-${_sPY(s2)} [${el}])`;
    }
    for (const [a, b] of _HS_CLASHES) {
      if ((s1===a&&s2===b)||(s1===b&&s2===a))
        return `stem conflict (${_sPY(s1)}-${_sPY(s2)})`;
    }
    return null;
  }

  // ── HS + HHS combination ───────────────────────────────────────────────────
  // Check if stem `hs` combines (via 5 combos) with any hidden stem in `hiddenArr`
  function _hsHhsCombo(hs, hiddenArr) {
    const results = [];
    for (const hh of hiddenArr) {
      for (const {a, b, el} of _HS_COMBOS) {
        if ((hs===a&&hh===b)||(hs===b&&hh===a)) {
          results.push(`HS+HHS combination (${_sPY(hs)}-${_sPY(hh)} [${el}])`);
        }
      }
    }
    return results;
  }

  // ── EB pair interactions ───────────────────────────────────────────────────
  function _ebPairInteractions(b1, b2, adjacent) {
    const res = [];
    if (b1 === b2) {
      if (_SELF_CLASH.includes(b1)) res.push(`self clash (${_bPY(b1)})`);
      return res;
    }
    // Six Clash (adjacency required)
    if (adjacent) {
      for (const [a, b] of _SIX_CLASH) {
        if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
          res.push(`branch conflict (${_bPY(b1)}-${_bPY(b2)})`);
        }
      }
      // Six Combination (adjacency required)
      for (const {a, b, el} of _SIX_COMBO) {
        if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
          res.push(`six combination (${_bPY(b1)}-${_bPY(b2)} [${el}])`);
        }
      }
    }
    // Harm
    for (const [a, b] of _HARM) {
      if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
        res.push(`harm (${_bPY(b1)}-${_bPY(b2)})`);
      }
    }
    // Destruction
    for (const [a, b] of _DESTROY) {
      if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
        res.push(`destruction (${_bPY(b1)}-${_bPY(b2)})`);
      }
    }
    // Three Persecuting Clash (partial pairs)
    for (const [a, b] of _PERSIST_PAIRS) {
      if ((b1===a&&b2===b)||(b1===b&&b2===a)) {
        res.push(`three persecuting clash (${_bPY(b1)}-${_bPY(b2)})`);
      }
    }
    return res;
  }

  // ── Three-combo and seasonal-combo multi-pillar detection ──────────────────
  // `branches` = array of branch chars (4 birth chart branches, or 5 for luck+chart)
  // `ownerIdx` = index in `branches` we care about (to label which combos appear "in" this pillar)
  // Returns {threeCombos, seasonal} as string arrays attributed to ownerIdx
  function _multiComboStrings(branches, ownerIdx) {
    const res = [];
    const ob = branches[ownerIdx];

    // Seasonal combinations (三会)
    for (const {trio, el, s} of _SEASONAL) {
      if (!trio.includes(ob)) continue;
      const count = trio.filter(b => branches.includes(b)).length;
      if (count === 3) {
        res.push(`seasonal combination (${trio.map(_bPY).join('-')} [${el}/${s}])`);
      } else if (count === 2) {
        // only show half-seasonal if the other present branch is also in our list
        const present = trio.filter(b => branches.includes(b));
        if (present.length === 2 && present.includes(ob)) {
          const missing = trio.find(b => !branches.includes(b));
          const ordered = trio.filter(b => b !== missing).map(_bPY);
          res.push(`half seasonal (${ordered[0]}-(${_bPY(missing)})-${ordered[1]} [${el}/${s}])`);
        }
      }
    }

    // Three combinations (三合)
    for (const {trio, el} of _THREE_COMBO) {
      if (!trio.includes(ob)) continue;
      const presentInChart = trio.filter(b => branches.includes(b));
      if (presentInChart.length === 3) {
        res.push(`triangular combination (${trio.map(_bPY).join('-')} [${el}])`);
      } else if (presentInChart.length === 2 && presentInChart.includes(ob)) {
        const missing = trio.find(b => !branches.includes(b));
        // Show as hidden triangular — arrange so missing is in middle if it's the "anchor"
        const [first, last] = presentInChart;
        const orderedStr = `${_bPY(first)}-(${_bPY(missing)})-${_bPY(last)}`;
        res.push(`hidden triangular combination (${orderedStr} [${el}])`);
        // Check also if this pair qualifies as a half-combination (when NO third is in chart)
        // (already handled — hidden triangular takes precedence over half)
      } else if (presentInChart.length === 1 && presentInChart[0] === ob) {
        // Only this pillar has one branch of a three-combo
        // Check if it forms a half combination with any other branch
        for (const {a, b, el: hel} of _HALF_PAIRS) {
          if ((ob===a && branches.includes(b)) || (ob===b && branches.includes(a))) {
            const partner = ob===a ? b : a;
            // Confirm the third branch is NOT in branches (otherwise it's hidden triangular, handled above)
            const thirdBranch = trio.find(br => br !== ob && br !== partner);
            if (!branches.includes(thirdBranch)) {
              res.push(`half combination (${_bPY(ob)}-${_bPY(partner)} [${hel}])`);
            }
          }
        }
      }
    }

    return res;
  }

  // ── Main public functions ──────────────────────────────────────────────────

  // Returns string[][] — one string[] per birth chart pillar (order: year=0…hour=3)
  window.pillarsInteractionList = function(chart) {
    const ps = chart.pillars; // [year, month, day, hour]
    const n = ps.length;      // 4
    const allBranches = ps.filter(p => p).map(p => p.branch);
    const result = ps.map(() => []);

    for (let i = 0; i < n; i++) {
      const pi = ps[i];
      const seen = new Set();
      const push = (i, s) => { if (s && !seen.has(s)) { seen.add(s); result[i].push(s); } };

      if (!pi) continue;

      // HS+HHS with own branch hidden stems (self-pillar combo)
      for (const s of _hsHhsCombo(pi.stem, T.HIDDEN_STEMS[pi.branch])) push(i, s);

      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const pj = ps[j];
        if (!pj) continue;
        const adjacent = Math.abs(i - j) === 1;

        // HS interaction
        const hsi = _hsInteraction(pi.stem, pj.stem);
        if (hsi) push(i, hsi);

        // EB pair interactions
        for (const s of _ebPairInteractions(pi.branch, pj.branch, adjacent)) push(i, s);

        // HS+HHS: this pillar's HS vs other pillar's hidden stems
        for (const s of _hsHhsCombo(pi.stem, T.HIDDEN_STEMS[pj.branch])) push(i, s);
      }

      // Multi-pillar combos (three-combo / seasonal)
      for (const s of _multiComboStrings(allBranches, i)) push(i, s);
    }

    return result;
  };

  // Returns string[] — all interactions of a luck pillar with the 4 birth chart pillars
  window.luckInteractionList = function(luckPillar, chart) {
    const ps = chart.pillars.filter(p => p);
    const lhs = luckPillar.stem;
    const leb = luckPillar.branch;
    const seen = new Set();
    const result = [];
    const push = s => { if (s && !seen.has(s)) { seen.add(s); result.push(s); } };

    // HS+HHS: luck HS vs luck EB's hidden stems (own pillar combo)
    for (const s of _hsHhsCombo(lhs, T.HIDDEN_STEMS[leb])) push(s);

    for (const p of ps) {
      // HS interactions
      const hsi = _hsInteraction(lhs, p.stem);
      if (hsi) push(hsi);

      // EB pair (no adjacency restriction for luck vs birth chart)
      for (const s of _ebPairInteractions(leb, p.branch, true)) push(s);

      // HS+HHS: luck HS vs birth chart pillar's hidden stems
      for (const s of _hsHhsCombo(lhs, T.HIDDEN_STEMS[p.branch])) push(s);
    }

    // Also check Six Clash separately without adjacency (luck vs any birth chart branch)
    for (const p of ps) {
      for (const [a, b] of _SIX_CLASH) {
        if ((leb===a&&p.branch===b)||(leb===b&&p.branch===a)) {
          push(`branch conflict (${_bPY(leb)}-${_bPY(p.branch)})`);
        }
      }
      for (const {a, b, el} of _SIX_COMBO) {
        if ((leb===a&&p.branch===b)||(leb===b&&p.branch===a)) {
          push(`six combination (${_bPY(leb)}-${_bPY(p.branch)} [${el}])`);
        }
      }
    }

    // Multi-pillar combos: luck EB + all 4 birth chart EBs
    const allBranches = [leb, ...ps.map(p => p.branch)];
    for (const s of _multiComboStrings(allBranches, 0)) push(s);

    return result;
  };
})();
