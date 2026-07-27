// Luck pillars and annual cycle. Depends on tables.js, data.js, chart.js.

function annualPillar(year) {
  const idx = ((year - 1924) % 60 + 60) % 60;
  return T.jiazi(idx);
}

function _directionForward(yearStem, sex) {
  const yang = T.STEM_YANG[yearStem];
  return (yang && sex === 'M') || (!yang && sex === 'F');
}

function luckPillars(chart, count = 10) {
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
  const remainderMonths = Math.floor((days - gregStart * 3) * 4);
  if (gregStart === 0) gregStart = 1;

  // The remainder (days -> months) can push the first pillar's actual start
  // date past year-end, so derive the calendar year from real date math
  // rather than just adding whole years to the birth year.
  const startDate = new Date(chart.dob.getFullYear() + gregStart, chart.dob.getMonth() + remainderMonths, chart.dob.getDate());
  const yearBase = startDate.getFullYear();
  const monthBase = startDate.getMonth() + 1;

  const monthIdx = T.JIAZI_INDEX[chart.month.stem + chart.month.branch];
  const step = fwd ? 1 : -1;
  const pillars = [];

  for (let k = 0; k < count; k++) {
    const idx = ((monthIdx + step * (k + 1)) % 60 + 60) % 60;
    const { stem, branch } = T.jiazi(idx);
    const y0 = yearBase + 10 * k;
    const y1 = y0 + 9;
    const a0 = gregStart + 10 * k;
    const a1 = a0 + 9;
    pillars.push({ ageStart: a0, ageEnd: a1, yearStart: y0, yearEnd: y1, monthStart: monthBase, stem, branch });
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
