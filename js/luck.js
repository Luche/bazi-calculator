// Luck pillars and annual cycle. Depends on tables.js, data.js, chart.js.

function annualPillar(year) {
  const idx = ((year - 1924) % 60 + 60) % 60;
  return T.jiazi(idx);
}

function _directionForward(yearStem, sex) {
  const yang = T.STEM_YANG[yearStem];
  return (yang && sex === 'M') || (!yang && sex === 'F');
}

function luckPillars(chart, count = 8) {
  const fwd = _directionForward(chart.year.stem, chart.sex);
  const ji = _jieFloor(chart.dobSec);
  let boundarySec;
  if (fwd) {
    boundarySec = window.JIE_TABLE[ji + 1][0];
  } else {
    boundarySec = window.JIE_TABLE[ji][0];
  }
  const diffSec = Math.abs(chart.dobSec - boundarySec);
  const days = diffSec / 86400;
  let gregStart = Math.floor(days / 3);
  if (gregStart === 0) gregStart = 1;

  const monthIdx = T.JIAZI_INDEX[chart.month.stem + chart.month.branch];
  const step = fwd ? 1 : -1;
  const birthYear = chart.dob.getFullYear();
  const pillars = [];

  for (let k = 0; k < count; k++) {
    const idx = ((monthIdx + step * (k + 1)) % 60 + 60) % 60;
    const { stem, branch } = T.jiazi(idx);
    const y0 = birthYear + gregStart + 10 * k;
    const y1 = y0 + 9;
    const a0 = y0 - birthYear + 1;
    const a1 = y1 - birthYear + 1;
    pillars.push({ ageStart: a0, ageEnd: a1, yearStart: y0, yearEnd: y1, stem, branch });
  }
  return pillars;
}

function annualForLuck(luckPillar, birthYear) {
  const out = [];
  for (let y = luckPillar.yearStart; y <= luckPillar.yearEnd; y++) {
    const ap = annualPillar(y);
    out.push({ year: y, age: y - birthYear + 1, stem: ap.stem, branch: ap.branch });
  }
  return out;
}

function monthlyForYear(year) {
  const { stem: yearStem } = annualPillar(year);
  const out = [];
  const ordered = [...T.BRANCHES.slice(2), ...T.BRANCHES.slice(0, 2)]; // 寅…丑
  ordered.forEach((br, k) => {
    const st = T.monthStem(yearStem, br);
    out.push({ month: k + 1, stem: st, branch: br });
  });
  return out;
}
