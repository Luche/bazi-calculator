// BaZi prompt generator. Depends on tables.js, luck.js, derived.js, stars.js.

(function () {
  const _SYSTEM_TEXT = `You are a seasoned BaZi (Four-Pillars) master. Using classical Chinese astrology texts and a person's BaZi chart, you interpret the <User's BaZi Report>.

Rules

Accuracy

Be precise. Always answer with correct data; never fabricate a birthday or any other detail.

Keep in mind the Wu-Xing generating and overcoming cycles at all times:

Generate: Earth->Metal->Water->Wood->Fire->Earth

Overcome: Earth克Water, Water克Fire, Fire克Metal, Metal克Wood, Wood克Earth

⚠️ Discuss ONLY the current calendar year and the future. Do NOT analyse or summarise past years. Now is {now_year}.

Basic Theory

Wu-Xing generation & restraint (same as above).

Heavenly-Stem generation & restraint:

Generate: Jia/Yi(wood)->Bing/Ding(fire)->Wu/Ji(earth)->Geng/Xin(metal)->Ren/Gui(water)->(back to wood)

Overcome: Jia/Yi 克 Wu/Ji; Bing/Ding 克 Geng/Xin; Wu/Ji 克 Ren/Gui; Geng/Xin 克 Jia/Yi; Ren/Gui 克 Bing/Ding.

Ten-God aliases: Zheng-Guan=Officer, Qi-Sha=7-Killings, Zheng-Yin=Resource, Pian-Yin=Indirect-Resource(Devil), Bi-Jian=Peer, Jie-Cai=RobWealth, Shi-Shen=Eating-God, Shang-Guan=Hurting-Officer, Zheng-Cai=Direct-Wealth, Pian-Cai=Indirect-Wealth.

Ten-God interaction: Resource->Peer->Output->Wealth->Officer->Resource (generate). Restraint is the reverse chain.

"Exposed" = appears in Heavenly Stem; "Hidden" = only in Earthly Branch.

Useful God (Yong-Shen) = main Ten-God for structure; Assistant (Xiang-Shen) supports it; Favorable helps; Unfavorable harms.

Pillars & life-stage: Year(1-16), Month(17-32), Day(33-48), Hour(48+).

Clash/Combine/Penalty changes the balance.

Workflow

Read and analyse .

Receive user question.

Identify user goals.

Answer precisely using expertise and the report.

Initialization

Always reply in the user's language (default English). Follow the rules and workflow strictly.

Output Requirements

Your reply should be a fully written BaZi analysis report, with no fewer than 800 English words.

Ensure the structure is clear, content is detailed, and tone is formal (not conversational).

Output the entire report at once, without asking the user to continue.`;

  function _tgForStem(dm, stem)   { return T.tenGodName(dm, stem); }
  function _tgForBranch(dm, br)   { return T.tenGodName(dm, T.HIDDEN_STEMS[br][0]); }

  function _voidsPinyin(chart) {
    return voidsPerPillar(chart).map(([a, b]) => `${T.BRANCH_PY[a]}, ${T.BRANCH_PY[b]}`);
  }

  window.generatePromptText = function (chart, name, focus) {
    const now      = new Date();
    const nowY     = now.getFullYear();
    const todayStr = now.toISOString().slice(0, 10);
    const dm = chart.dm;

    const stemPy   = chart.pillars.map(p => T.STEM_PY[p.stem]);
    const branchPy = chart.pillars.map(p => T.BRANCH_PY[p.branch]);
    const hidChars = hiddenStems(chart).map(arr => arr.join(', ')).join('; ');
    const stemTg   = stemTenGods(chart);
    const hidTg    = hiddenStemTenGods(chart).flat();
    const nayin    = naYin(chart);
    const voids    = _voidsPinyin(chart);
    const stages   = twelveStages(chart);
    const ss       = chart.pillars.map((_, i) => starsForPillar(i, chart));
    const ssLines  = ['Year Pillar', 'Month Pillar', 'Day Pillar', 'Hour Pillar']
      .map((lbl, i) => `${lbl}: ${ss[i].length ? ss[i].join(', ') : '(none)'}`)
      .join('\n');

    const lps   = luckPillars(chart, 8);
    const curLP = lps.find(lp => lp.yearStart <= nowY && nowY <= lp.yearEnd)
               || (nowY < lps[0].yearStart ? lps[0] : lps[lps.length - 1]);
    const nextLP = lps.find(lp => lp.yearStart > curLP.yearEnd) || lps[lps.length - 1];

    function lpBlock(label, lp) {
      return `${label}: Years: ${lp.yearStart} - ${lp.yearEnd}; `
           + `Ages: ${lp.ageStart} - ${lp.ageEnd}; `
           + `Heavenly Stem: ${_tgForStem(dm, lp.stem)}; `
           + `Earthly Branch: ${_tgForBranch(dm, lp.branch)}; `
           + `Cycle: ${T.JIAZI_PY[lp.stem + lp.branch]}.`;
    }

    function annualBlock(lp) {
      return annualForLuck(lp, chart.dob.getFullYear()).map(r =>
        `Year: ${r.year} (Age ${r.age}); `
      + `Cycle: ${T.JIAZI_PY[r.stem + r.branch]}; `
      + `Heavenly Stem: ${_tgForStem(dm, r.stem)}; `
      + `Earthly Branch: ${_tgForBranch(dm, r.branch)}.`
      ).join('\n');
    }

    function monthlyBlock() {
      return monthlyForYear(nowY).map(m =>
        `Lunar Month: ${m.month}; `
      + `Cycle: ${T.JIAZI_PY[m.stem + m.branch]}; `
      + `Heavenly Stem: ${_tgForStem(dm, m.stem)}; `
      + `Earthly Branch: ${_tgForBranch(dm, m.branch)}.`
      ).join('\n');
    }

    const sysText    = _SYSTEM_TEXT.replace('{now_year}', nowY);
    const sexLabel   = chart.sex === 'M' ? '👨 Male' : '👩 Female';
    const boundaryWarn = chart.nearJieBoundary
      ? '\n\n⚠️ Birth time is within 1 hour of a Solar Term (Jie) boundary; verify against an almanac before relying on the Year/Month pillar above.'
      : '';

    const userBlock =
`BaZi chart for ${name} (Year -> Month -> Day -> Hour):
Gender: ${sexLabel} Heavenly Stems: ${stemPy.join(', ')} Earthly Branches: ${branchPy.join(', ')} Hidden Stems: ${hidChars} Ten Gods (Heavenly Stems): ${stemTg.join(', ')} Ten Gods (Earthly Branches): ${hidTg.join(', ')} Na Yin: ${nayin.join(', ')} Void (Kong Wang): ${voids.join(', ')} Stage (Di Shi): ${stages.join(', ')} Gods & Shensha:
${ssLines}

${lpBlock('Current 10-Year Luck Period', curLP)}

Annual Luck:
${annualBlock(curLP)}

Monthly Luck for Current Year:
${monthlyBlock()}

${lpBlock('Next 10-Year Luck Period', nextLP)}

Annual Luck:
${annualBlock(nextLP)}

💬 User's special focus: ${focus}

Current Time Info

Gregorian Today: ${todayStr}.${boundaryWarn}`;

    return `System\n\n${sysText}\n\nUser\n\n${userBlock}`;
  };
})();
