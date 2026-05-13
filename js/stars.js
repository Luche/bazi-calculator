// Symbolic Stars per pillar. Depends on tables.js and chart.js.
// Based on BaZi Book Wiki: Symbolic Stars, General Stars, Heavenly/Monthly Virtue,
// Solitary/Lonesome Stars, and Heaven Void.

(function() {
  // wiki 1-based E-notation → T.BRANCHES index (0-based)
  function _e(n) { return T.BRANCHES[(n - 1) % 12]; }

  // Symbolic Stars [dm, [nobleman], academic, [sword], prosperity, peach]
  const _SYMBOLIC = [
    ['甲', [_e(2),_e(8)],  _e(6),  [_e(4)],        _e(3),  _e(7)],
    ['乙', [_e(1),_e(9)],  _e(7),  [_e(3),_e(5)],  _e(4),  _e(7)],
    ['丙', [_e(12),_e(10)],_e(9),  [_e(7)],         _e(6),  _e(3)],
    ['丁', [_e(12),_e(10)],_e(10), [_e(6),_e(8)],  _e(7),  _e(8)],
    ['戊', [_e(2),_e(8)],  _e(9),  [_e(7)],         _e(6),  _e(5)],
    ['己', [_e(1),_e(9)],  _e(10), [_e(6),_e(8)],  _e(7),  _e(5)],
    ['庚', [_e(2),_e(8)],  _e(12), [_e(10)],        _e(9),  _e(11)],
    ['辛', [_e(7),_e(3)],  _e(1),  [_e(9),_e(11)], _e(10), _e(10)],
    ['壬', [_e(6),_e(4)],  _e(3),  [_e(10)],        _e(12), _e(1)],
    ['癸', [_e(6),_e(4)],  _e(4),  [_e(12),_e(2)], _e(1),  _e(9)],
  ];

  // General Stars: row = branchIdx % 4
  // Columns: [General, Arts, Travelling Horse, Robbing, Death, Flower of Romance]
  const _GENERAL = [
    [_e(1), _e(5),  _e(3),  _e(6),  _e(12), _e(10)],  // E1/E5/E9  (子/辰/申)
    [_e(10),_e(2),  _e(12), _e(3),  _e(9),  _e(7)],   // E2/E6/E10 (丑/巳/酉)
    [_e(7), _e(11), _e(9),  _e(12), _e(6),  _e(4)],   // E3/E7/E11 (寅/午/戌)
    [_e(4), _e(8),  _e(6),  _e(9),  _e(3),  _e(1)],   // E4/E8/E12 (卯/未/亥)
  ];
  const _GENERAL_NAMES = [
    'General Star','Star of Arts','Travelling Horse',
    'Robbing Star','Death Star','Flower of Romance',
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

  function _isBranch(ch) { return T.BRANCHES.includes(ch); }
  function _isStem(ch)   { return T.STEMS.includes(ch); }

  // Returns array of star-name strings for a given branch + HS pair (can be a birth chart pillar or a luck pillar)
  function _starsForBranchAndStem(branch, hs, chart) {
    const result = [];
    const dm = chart.dm;

    // 1. Symbolic Stars (by Day Stem)
    const symRow = _SYMBOLIC.find(r => r[0] === dm);
    if (symRow) {
      const [, nobleman, academic, sword, prosperity, peach] = symRow;
      if (nobleman.includes(branch))  result.push('Nobleman Star');
      if (branch === academic)         result.push('Academic Star');
      if (sword.includes(branch))      result.push('Sword Star');
      if (branch === prosperity)       result.push('Prosperity Star');
      if (branch === peach)            result.push('Peach Blossom Star');
    }

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

    // Deduplicate while preserving order
    return [...new Set(result)];
  }

  // Public: stars for a birth chart pillar (index 0=year…3=hour)
  window.starsForPillar = function(pillarIdx, chart) {
    const p = chart.pillars[pillarIdx];
    return _starsForBranchAndStem(p.branch, p.stem, chart);
  };

  // Public: stars for a luck pillar (only Symbolic Stars checked — others need birth chart context)
  window.starsForLuckPillar = function(luckPillar, chart) {
    return _starsForBranchAndStem(luckPillar.branch, luckPillar.stem, chart);
  };
})();
