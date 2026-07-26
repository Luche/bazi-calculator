// Symbolic Stars per pillar. Depends on tables.js and chart.js.
// Based on BaZi Book Wiki: Symbolic Stars, General Stars, Heavenly/Monthly Virtue,
// Solitary/Lonesome Stars, and Heaven Void.

(function() {
  // wiki 1-based E-notation → T.BRANCHES index (0-based)
  function _e(n) { return T.BRANCHES[(n - 1) % 12]; }

  // Symbolic Stars [dm, [nobleman], academic, [sword], prosperity, hongYan]
  // The last column is keyed by Day Master stem (甲->午, 丙->寅, 丁->未, 戊/己->辰,
  // 庚->戌, 辛->酉, 壬->子, 癸->申) — this is Hong Yan Sha (红艳煞, "Red Charm"),
  // not the branch-trine Peach Blossom (that's _GENERAL's last column below).
  const _SYMBOLIC = [
    ['甲', [_e(2),_e(8)],  _e(6),  [_e(4)],        _e(3),  _e(7)],
    ['乙', [_e(1),_e(9)],  _e(7),  [_e(3),_e(5)],  _e(4),  _e(7)],
    ['丙', [_e(12),_e(10)],_e(9),  [_e(7)],         _e(6),  _e(3)],
    ['丁', [_e(12),_e(10)],_e(10), [_e(6),_e(8)],  _e(7),  _e(8)],
    ['戊', [_e(2),_e(8)],  _e(9),  [_e(7)],         _e(6),  _e(5)],
    ['己', [_e(1),_e(9)],  _e(10), [_e(6),_e(8)],  _e(7),  _e(5)],
    ['庚', [_e(2),_e(8)],  _e(12), [_e(10)],        _e(9),  _e(11)],
    ['辛', [_e(7),_e(3)],  _e(1),  [_e(9),_e(11)], _e(10), _e(10)],
    ['壬', [_e(6),_e(4)],  _e(3),  [_e(1)],         _e(12), _e(1)],
    ['癸', [_e(6),_e(4)],  _e(4),  [_e(12),_e(2)], _e(1),  _e(9)],
  ];

  // General Stars: row = branchIdx % 4
  // Columns: [General, Arts, Travelling Horse, Robbing, Death, Peach Blossom]
  // The last column (keyed by Day/Year branch trine: 申子辰->酉, 巳酉丑->午,
  // 寅午戌->卯, 亥卯未->子) is the real Tao Hua (桃花) / Peach Blossom Star.
  const _GENERAL = [
    [_e(1), _e(5),  _e(3),  _e(6),  _e(12), _e(10)],  // E1/E5/E9  (子/辰/申)
    [_e(10),_e(2),  _e(12), _e(3),  _e(9),  _e(7)],   // E2/E6/E10 (丑/巳/酉)
    [_e(7), _e(11), _e(9),  _e(12), _e(6),  _e(4)],   // E3/E7/E11 (寅/午/戌)
    [_e(4), _e(8),  _e(6),  _e(9),  _e(3),  _e(1)],   // E4/E8/E12 (卯/未/亥)
  ];
  const _GENERAL_NAMES = [
    'General Star','Star of Arts','Travelling Horse',
    'Robbing Star','Death Star','Peach Blossom Star',
  ];

  // Heavenly Virtue Star (keyed by Month Branch)
  // Values: branch char → check pillar EB; stem char → check pillar HS
  const _HV = {
    '子':_e(6), '丑':'庚', '寅':'丁', '卯':_e(9), '辰':'壬', '巳':'辛',
    '午':_e(12),'未':'甲', '申':'癸', '酉':_e(3),  '戌':'丙', '亥':'乙',
  };
  // Monthly Virtue Star
  const _MV = {
    '子':'壬','丑':'庚','寅':'丙','卯':'甲','辰':'壬','巳':'庚',
    '午':'丙','未':'甲','申':'壬','酉':'庚','戌':'丙','亥':'甲',
  };

  // Solitary / Lonesome keyed by Day or Year branch
  const _SOLITARY = {
    '亥':'寅','子':'寅','丑':'寅','寅':'巳','卯':'巳','辰':'巳',
    '巳':'申','午':'申','未':'申','申':'亥','酉':'亥','戌':'亥',
  };
  const _LONESOME = {
    '亥':'戌','子':'戌','丑':'戌','寅':'丑','卯':'丑','辰':'丑',
    '巳':'辰','午':'辰','未':'辰','申':'未','酉':'未','戌':'未',
  };

  // Tai Ji Noble (太极贵人) — by Day Master
  const _TAIJI = {
    '甲':['子','午'], '乙':['子','午'],
    '丙':['卯','酉'], '丁':['卯','酉'],
    '戊':['辰','戌','丑','未'], '己':['辰','戌','丑','未'],
    '庚':['寅','亥'], '辛':['寅','亥'],
    '壬':['巳','申'], '癸':['巳','申'],
  };
  // National Seal (国印贵人) — by Day Master
  const _NATIONAL_SEAL = {
    '甲':'戌','乙':'亥','丙':'丑','丁':'寅','戊':'丑',
    '己':'寅','庚':'辰','辛':'巳','壬':'未','癸':'申',
  };
  // Kui Gang (魁罡) — exact Day Pillar stem+branch
  const _KUI_GANG = ['庚辰','庚戌','壬辰','戊戌'];

  // Tian Gan Peach Blossom (天干桃花) — keyed by Day Stem, distinct from both
  // Xianchi (_GENERAL's branch-trine Peach Blossom) and Hong Yan Sha (_SYMBOLIC's last column).
  const _TIANGAN_PEACH = {
    '甲':'子', '乙':'巳', '丙':'卯', '丁':'申', '戊':'卯',
    '己':'申', '庚':'午', '辛':'亥', '壬':'酉', '癸':'寅',
  };

  // Three Extraordinary Nobleman (三奇貴人) — Year/Month/Day stems only.
  // Source: en.wikibooks.org/wiki/Ba_Zi/Symbolic_Stars (the "BaZi Book Wiki" cited above).
  // Full strength requires exactly Day→Month→Year reading in this order; any other
  // arrangement of the same three stems still lights the star, without the '*'.
  const _THREE_EXTRAORDINARY = [
    { name: 'Heavenly Extraordinary Nobleman', day: '甲', month: '戊', year: '庚' },
    { name: 'Earthly Extraordinary Nobleman',  day: '乙', month: '丙', year: '丁' },
    { name: 'Human Extraordinary Nobleman',    day: '壬', month: '癸', year: '辛' },
  ];

  function _threeExtraordinaryTag(chart) {
    const y = chart.year.stem, m = chart.month.stem, d = chart.day.stem;
    const cell = [y, m, d];
    for (const def of _THREE_EXTRAORDINARY) {
      const required = [def.year, def.month, def.day];
      if (new Set(cell).size === 3 && required.every(s => cell.includes(s))) {
        const inOrder = d === def.day && m === def.month && y === def.year;
        return def.name + (inOrder ? '*' : '');
      }
    }
    return null;
  }

  function _isBranch(ch) { return T.BRANCHES.includes(ch); }
  function _isStem(ch)   { return T.STEMS.includes(ch); }

  // Returns array of star-name strings for a given branch + HS pair (can be a birth chart pillar or a luck pillar)
  // pillarIdx (0=year,1=month,2=day,3=hour) is only known for birth-chart pillars; luck/annual
  // pillars pass undefined, which skips pillar-position-dependent stars (Kui Gang, Three Extraordinary Nobleman).
  function _starsForBranchAndStem(branch, hs, chart, pillarIdx) {
    const result = [];
    const dm = chart.dm;
    const isDayPillar = pillarIdx === 2;

    // 1. Symbolic Stars (by Day Stem)
    const symRow = _SYMBOLIC.find(r => r[0] === dm);
    if (symRow) {
      const [, nobleman, academic, sword, prosperity, hongYan] = symRow;
      if (nobleman.includes(branch))  result.push('Nobleman Star');
      if (branch === academic)         result.push('Academic Star');
      if (sword.includes(branch))      result.push('Sword Star');
      if (branch === prosperity)       result.push('Prosperity Star');
      if (branch === hongYan)          result.push('Red Charm');
    }
    if (_TIANGAN_PEACH[dm] === branch) result.push('Flower of Romance');

    // 2. General Stars (by Day Branch AND Year Branch — each can trigger stars)
    const seen = new Set();
    for (const triggerBranch of [chart.day.branch, chart.year.branch]) {
      const row = T.BRANCHES.indexOf(triggerBranch) % 4;
      _GENERAL[row].forEach((targetBranch, col) => {
        if (branch === targetBranch && !seen.has(_GENERAL_NAMES[col])) {
          seen.add(_GENERAL_NAMES[col]);
          result.push(_GENERAL_NAMES[col]);
        }
      });
    }

    // 3. Heavenly Virtue Star (by Month Branch)
    const hv = _HV[chart.month.branch];
    if (hv !== undefined) {
      if (_isBranch(hv) && branch === hv) result.push('Heavenly Virtue Star');
      if (_isStem(hv)   && hs === hv)     result.push('Heavenly Virtue Star');
    }

    // 4. Monthly Virtue Star (by Month Branch)
    const mv = _MV[chart.month.branch];
    if (mv !== undefined) {
      if (_isBranch(mv) && branch === mv) result.push('Monthly Virtue Star');
      if (_isStem(mv)   && hs === mv)     result.push('Monthly Virtue Star');
    }

    // 5. Solitary Star (by Day Branch and Year Branch)
    for (const triggerBranch of [chart.day.branch, chart.year.branch]) {
      if (_SOLITARY[triggerBranch] === branch) { result.push('Solitary Star'); break; }
    }

    // 6. Lonesome Star (by Day Branch and Year Branch)
    for (const triggerBranch of [chart.day.branch, chart.year.branch]) {
      if (_LONESOME[triggerBranch] === branch) { result.push('Lonesome Star'); break; }
    }

    // 7. Heaven Void (from Year Pillar and Day Pillar GZ)
    const voidY = T.voidBranches(chart.year.stem, chart.year.branch);
    const voidD = T.voidBranches(chart.day.stem,  chart.day.branch);
    if (voidY.includes(branch)) result.push('Heaven Void (YP)');
    if (voidD.includes(branch)) result.push('Heaven Void (DP)');

    // 8. Tai Ji Noble (by Day Master)
    if ((_TAIJI[dm] || []).includes(branch)) result.push('Tai Ji Noble');

    // 9. National Seal (by Day Master)
    if (_NATIONAL_SEAL[dm] === branch) result.push('National Seal');

    // 10. Hall of Learning (by Day Master) — the DM's 长生 branch
    if (T.twelveStage(dm, branch) === 'Birth') result.push('Hall of Learning');

    // 11. Kui Gang (魁罡) — Day Pillar only, matches the whole GZ
    if (isDayPillar && _KUI_GANG.includes(hs + branch)) result.push('Kui Gang');

    // 12. Three Extraordinary Nobleman — Year/Month/Day stems only, whole-chart pattern
    if (pillarIdx === 0 || pillarIdx === 1 || pillarIdx === 2) {
      const tag = _threeExtraordinaryTag(chart);
      if (tag) result.push(tag);
    }

    // Deduplicate while preserving order
    return [...new Set(result)];
  }

  // Public: stars for a birth chart pillar (index 0=year…3=hour)
  window.starsForPillar = function(pillarIdx, chart) {
    const p = chart.pillars[pillarIdx];
    if (!p) return [];
    return _starsForBranchAndStem(p.branch, p.stem, chart, pillarIdx);
  };

  // Public: stars for a luck pillar (pillarIdx omitted — Kui Gang and Three Extraordinary
  // Nobleman are natal-chart-only patterns and never fire here)
  window.starsForLuckPillar = function(luckPillar, chart) {
    return _starsForBranchAndStem(luckPillar.branch, luckPillar.stem, chart);
  };
})();
