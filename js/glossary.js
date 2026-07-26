// Glossary data + aggregation for the "Chart Glossary" help panel.
// Depends on tables.js, luck.js, stars.js, interactions.js.

(function() {
  const TENGOD_ORDER = ['PW','AW','PO','AO','PS','AS','HO','EG','PR','RW'];

  // Names match T.EXCEL_CODE_TO_NAME in tables.js exactly (the labels already shown
  // on the pillar/hidden-stem chips), so the glossary term matches what's on screen.
  const TENGOD_INFO = {
    PW: { name: 'Proper Wealth', pinyin: '正财 · Zheng Cai', aspect: 'Money, Wealth',
      relation: { M: 'Wife, Father', F: 'Father' },
      meaning: 'Steady, earned income and tangible assets — money that comes from consistent effort, a stable job, or prudent management; often tied to a disciplined relationship with money.' },
    AW: { name: 'Indirect Wealth', pinyin: '偏财 · Pian Cai', aspect: 'Money, Wealth',
      relation: { M: 'Wife, Father', F: 'Father' },
      meaning: 'Windfalls, side income, business deals, and opportunistic wealth — money that flows in bursts rather than a steady paycheck; favors entrepreneurship and risk-taking.' },
    PO: { name: 'Proper Officer', pinyin: '正官 · Zheng Guan', aspect: 'Power, Status, Fame',
      relation: { M: 'Children', F: 'Husband' },
      meaning: 'Authority earned through rules, discipline, and duty — career structure, reputation, and self-restraint; favors working within a system (management, law, institutions).' },
    AO: { name: 'Qi Sha', pinyin: '七杀 · Qi Sha (Seven Killings)', aspect: 'Power, Status, Fame',
      relation: { M: 'Children', F: 'Husband' },
      meaning: "Raw ambition, competitive drive, and pressure — power gained through struggle and bold action rather than institutional approval; a fighter's edge, but can be a source of stress." },
    PS: { name: 'Proper Resource', pinyin: '正印 · Zheng Yin', aspect: 'Resource, Support',
      relation: { M: 'Mother', F: 'Mother' },
      meaning: 'Support, protection, and knowledge freely given — nurturing, education, credentials, and being taken care of; favors academic and spiritual growth.' },
    AS: { name: 'Indirect Resource', pinyin: '偏印 · Pian Yin', aspect: 'Resource, Support',
      relation: { M: 'Mother', F: 'Mother' },
      meaning: 'Unconventional learning and self-reliant insight — knowledge gained through unusual paths (self-study, niche skills, spirituality); wisdom, but can tip into overthinking or isolation.' },
    HO: { name: 'Hurting Officer', pinyin: '伤官 · Shang Guan', aspect: 'Expressive Ability, Intelligence',
      relation: { M: null, F: 'Children' },
      meaning: 'Sharp self-expression and creative rebellion — talent for performance, criticism, and challenging convention; brilliant, but can clash with authority or overstep boundaries.' },
    EG: { name: 'Eating God', pinyin: '食神 · Shi Shen', aspect: 'Expressive Ability, Intelligence',
      relation: { M: null, F: 'Children' },
      meaning: 'Warm, easygoing self-expression — talent for enjoyment, art, and generosity; a gentler, more contented creative outlet than Hurting Officer.' },
    PR: { name: 'Companion', pinyin: '比肩 · Bi Jian', aspect: 'Colleagues, Friends, Competitors',
      relation: { M: 'Sibling', F: 'Sibling' },
      meaning: 'Peers and allies of similar standing — cooperation, camaraderie, and mutual support; too much can mean competition for the same resources.' },
    RW: { name: 'Competing Wealth', pinyin: '劫财 · Jie Cai', aspect: 'Colleagues, Friends, Competitors',
      relation: { M: 'Sibling', F: 'Sibling' },
      meaning: 'Competitive peers — drive, assertiveness, and willingness to take what you want; supportive in a crisis, but can mean rivalry or being taken from.' },
  };

  const STAR_ORDER = [
    'Nobleman Star','Academic Star','Sword Star','Prosperity Star','Peach Blossom Star',
    'General Star','Star of Arts','Travelling Horse','Robbing Star','Death Star','Flower of Romance',
    'Heavenly Virtue Star','Monthly Virtue Star','Solitary Star','Lonesome Star',
    'Heaven Void (YP)','Heaven Void (DP)',
    'Tai Ji Noble','National Seal','Hall of Learning','Kui Gang',
    'Heavenly Extraordinary Nobleman','Earthly Extraordinary Nobleman','Human Extraordinary Nobleman',
  ];

  const STAR_INFO = {
    'Nobleman Star': { meaning: 'Tian Yi Gui Ren (天乙贵人) — "The Noble Helper". One of the most auspicious stars: brings unexpected help, mentors, and protection during difficulty.' },
    'Academic Star': { meaning: 'Wen Chang (文昌). Favors studies, exams, and writing — boosts learning ability and literary or intellectual talent.' },
    'Sword Star': { meaning: 'Yang Ren (羊刃) — "Blade". Intense energy from the Day Master at its peak strength; brings courage and drive, but also a risk of conflict, injury, or rash decisions.' },
    'Prosperity Star': { meaning: 'Lu Shen (禄神) — the Day Master\'s own position of abundance. Represents stable income, self-sufficiency, and good health.' },
    'Peach Blossom Star': { meaning: 'Tao Hua (桃花). Romantic charisma, attraction, and social popularity; can bring romantic opportunity, but also overindulgence or relationship complications.' },
    'General Star': { meaning: 'Jiang Xing (将星). Leadership authority and command presence; favors positions of power and being in charge.' },
    'Star of Arts': { meaning: 'Hua Gai (华盖) — "Canopy Star". Artistic, spiritual, and philosophical depth; talent for solitary pursuits, but a tendency toward isolation.' },
    'Travelling Horse': { meaning: 'Yi Ma (驿马) — "Post Horse". Mobility, travel, and change; favors relocation, business trips, and career movement, but can also bring restlessness.' },
    'Robbing Star': { meaning: 'Jie Sha (劫煞) — "Robbery Star". Risk of loss, theft, or being taken advantage of; calls for caution around finances and possessions.' },
    'Death Star': { meaning: 'Wang Shen (亡神). Hidden scheming and secrecy; can bring strategic advantage in disguise, but also hidden pitfalls for health or reputation.' },
    'Flower of Romance': { meaning: 'Xian Chi (咸池), a Peach-Blossom variant. Sensual charm and social magnetism; strong attraction, with a risk of indulgence.' },
    'Heavenly Virtue Star': { meaning: 'Tian De (天德). Protection and goodwill from powerful, benevolent forces; softens harsh interactions and reduces misfortune elsewhere in the chart.' },
    'Monthly Virtue Star': { meaning: 'Yue De (月德). A protective, benevolent influence tied to the birth month; brings support from others and mitigates misfortune.' },
    'Solitary Star': { meaning: 'Gu Chen (孤辰). Tendency toward emotional distance or loneliness, especially in relationships with male relatives; independence, but a risk of isolation.' },
    'Lonesome Star': { meaning: 'Gua Su (寡宿). Similar isolation tendency, particularly linked to spousal or emotional relationships; independence, but a risk of loneliness later in life.' },
    'Heaven Void (YP)': { meaning: 'Kong Wang (空亡), from the Year Pillar. The Year Pillar\'s "empty" branches — matters ruled by that palace can feel unfulfilled or delayed, though this can also mean freedom from its constraints.' },
    'Heaven Void (DP)': { meaning: 'Kong Wang (空亡), from the Day Pillar. The Day Pillar\'s "empty" branches — self/spouse-palace matters can feel unfulfilled or delayed, though this can also mean freedom from its constraints.' },
    'Tai Ji Noble': { meaning: 'Tai Ji Gui Ren (太极贵人). A noble star tied to spiritual insight and philosophy; favors those drawn to religion, divination, or deep study.' },
    'National Seal': { meaning: 'Guo Yin Gui Ren (国印贵人) — "State Seal Noble". Authority and honor recognized by institutions; favorable for official or government-related status and trusted responsibility.' },
    'Hall of Learning': { meaning: 'Xue Tang (学堂) — the Day Master\'s own "Birth" (长生) stage branch. Strong innate intelligence and aptitude for learning or scholarship.' },
    'Kui Gang': { meaning: 'Kui Gang (魁罡) — one of four powerful, decisive Day Pillar combinations. Grants exceptional willpower and leadership, but tends toward extremes: brilliant when supported, harsh or domineering when clashed.' },
    'Heavenly Extraordinary Nobleman': { meaning: 'San Qi (三奇贵人), Heavenly variant (甲戊庚 across Day/Month/Year). A rare, prestigious pattern linked to exceptional talent and destiny; strongest (marked *) when the stems read in exact Day→Month→Year order.' },
    'Earthly Extraordinary Nobleman': { meaning: 'San Qi (三奇贵人), Earthly variant (乙丙丁 across Day/Month/Year). A rare, prestigious pattern linked to exceptional talent and destiny; strongest (marked *) when the stems read in exact Day→Month→Year order.' },
    'Human Extraordinary Nobleman': { meaning: 'San Qi (三奇贵人), Human variant (壬癸辛 across Day/Month/Year). A rare, prestigious pattern linked to exceptional talent and destiny; strongest (marked *) when the stems read in exact Day→Month→Year order.' },
  };

  const INTERACTION_INFO = {
    'stem combination': { meaning: 'Two Heavenly Stems bond into a shared element — softens conflict between the pillars involved and can shift the chart\'s usable element.' },
    'stem conflict': { meaning: 'Two opposing Heavenly Stems clash — friction, competing agendas, or instability between whatever those pillars represent.' },
    'seasonal combination': { meaning: 'San Hui (三会) — all three branches of a season present together, uniting into one strong element; a powerful reinforcement of that element in the chart.' },
    'triangular combination': { meaning: 'San He (三合) — three branches spaced across the chart forming a full trine into one element; a strong, stable combination that boosts that element.' },
    'ungrateful penalty': { meaning: 'Wu En Zhi Xing (无恩之刑) — the full Yin-Si-Shen (寅巳申) penalty trio; associated with betrayal, ingratitude, or being let down by people you helped.' },
    'arrogant penalty': { meaning: 'Shi Shi Zhi Xing (恃势之刑) — the full Chou-Xu-Wei (丑戌未) penalty trio; associated with arrogance, abuse of power, or conflict from overconfidence.' },
    'branch conflict': { meaning: 'Liu Chong (六冲) — two branches in direct opposition; disrupts the palaces involved, often showing as upheaval or conflict in that life area.' },
    'half seasonal': { meaning: 'A weaker, partial version of the seasonal combination — only two of the three seasonal branches are present, so the element\'s influence is present but not fully realized.' },
    'partial persecuting clash': { meaning: 'Only two of a penalty trio\'s three branches are present — a weaker, partial version of the ungrateful/arrogant penalty.' },
    'half combination': { meaning: 'Ban He (半合) — two of the three trine branches present; a partial version of the triangular combination. A trailing * means it\'s "activated" by a matching stem elsewhere in the chart, making the effect much stronger.' },
    'impolite penalty': { meaning: 'Wu Li Zhi Xing (无礼之刑) — the Zi-Mao (子卯) penalty; linked to disrespect, boundary violations, or awkward/inappropriate conduct between the parties represented.' },
    'self clash': { meaning: 'Zi Xing (自刑) — a branch clashing with an identical copy of itself; internal conflict, self-sabotage, or overdoing something to the point of harm.' },
    'six combination': { meaning: 'Liu He (六合) — two adjacent branches pair up harmoniously into a shared element; smooths relations between the pillars involved and can bring cooperation or attachment.' },
    'destruction': { meaning: 'Po (破) — branches that undermine each other\'s stability; associated with breakage, disrupted plans, or things not lasting.' },
    'harm': { meaning: 'Hai (害) — a milder branch clash bringing hidden friction, misunderstanding, or "backstabbing" energy between the two areas involved.' },
    'HS+HHS combination': { meaning: 'A pillar\'s exposed Heavenly Stem combines with a hidden stem tucked inside another branch — a quieter, "under the surface" combination that still colors the relationship between those pillars.' },
  };

  function _typeKey(s) {
    const noStar = s.endsWith('*') ? s.slice(0, -1) : s;
    const idx = noStar.indexOf('(');
    return (idx === -1 ? noStar : noStar.slice(0, idx)).trim();
  }

  // Natal-chart terms and luck-pillar-triggered terms are tracked in separate sets so
  // the panel can show "only appears once a luck/annual pillar is factored in" distinctly
  // from what's inherent to the birth chart itself.
  window.collectChartGlossary = function(chart, luckArr, selectedYear) {
    const tgSet = new Set();
    const natalStarSet = new Set();
    const luckStarSet = new Set();
    const natalIntSet = new Set();
    const luckIntSet = new Set();

    function addPillarTenGods(stem, branch, isDayPillar) {
      if (!isDayPillar) tgSet.add(T.tenGod(chart.dm, stem));
      (T.HIDDEN_STEMS[branch] || []).forEach(hs => tgSet.add(T.tenGod(chart.dm, hs)));
    }

    chart.pillars.forEach((p, i) => {
      if (!p) return;
      addPillarTenGods(p.stem, p.branch, i === 2);
      starsForPillar(i, chart).forEach(s => natalStarSet.add(s.replace(/\*$/, '')));
    });
    pillarsInteractionList(chart).forEach(arr => arr.forEach(s => natalIntSet.add(_typeKey(s))));

    luckArr.forEach(lp => {
      addPillarTenGods(lp.stem, lp.branch, false);
      starsForLuckPillar(lp, chart).forEach(s => luckStarSet.add(s.replace(/\*$/, '')));
      luckInteractionList(lp, chart).forEach(s => luckIntSet.add(_typeKey(s)));
    });

    if (selectedYear) {
      addPillarTenGods(selectedYear.stem, selectedYear.branch, false);
      starsForLuckPillar(selectedYear, chart).forEach(s => luckStarSet.add(s.replace(/\*$/, '')));
      luckInteractionList(selectedYear, chart).forEach(s => luckIntSet.add(_typeKey(s)));
    }

    const starLuckOnly = [...luckStarSet].filter(s => !natalStarSet.has(s));
    const intLuckOnly = [...luckIntSet].filter(s => !natalIntSet.has(s));
    const interactionOrder = window.INTERACTION_TYPE_ORDER || [];

    return {
      tenGods: TENGOD_ORDER.filter(c => tgSet.has(c)),
      starsNatal: STAR_ORDER.filter(s => natalStarSet.has(s)),
      starsLuckOnly: STAR_ORDER.filter(s => starLuckOnly.includes(s)),
      interactionsNatal: interactionOrder.filter(t => natalIntSet.has(t)),
      interactionsLuckOnly: interactionOrder.filter(t => intLuckOnly.includes(t)),
    };
  };

  window.TENGOD_INFO = TENGOD_INFO;
  window.STAR_INFO = STAR_INFO;
  window.INTERACTION_INFO = INTERACTION_INFO;
})();
