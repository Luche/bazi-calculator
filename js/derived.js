// Secondary calculations. Depends on tables.js and chart.js.

function stemTenGods(chart) {
  return chart.pillars.map(p => T.tenGodName(chart.dm, p.stem));
}

function hiddenStems(chart) {
  return chart.pillars.map(p => T.HIDDEN_STEMS[p.branch]);
}

function hiddenStemTenGods(chart) {
  return chart.pillars.map(p =>
    T.HIDDEN_STEMS[p.branch].map(hs => T.tenGodName(chart.dm, hs))
  );
}

function twelveStages(chart) {
  return chart.pillars.map(p => T.twelveStage(chart.dm, p.branch));
}

function naYin(chart) {
  return chart.pillars.map(p => T.nayin(p.stem, p.branch));
}

function voidsPerPillar(chart) {
  return chart.pillars.map(p => T.voidBranches(p.stem, p.branch));
}

function elementBalance(chart) {
  const counts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const p of chart.pillars) {
    counts[T.STEM_ELEMENT[p.stem]]++;
    counts[T.BRANCH_ELEMENT[p.branch]]++;
  }
  return counts;
}
