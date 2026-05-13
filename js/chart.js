// Core four-pillar computation. Depends on tables.js and data.js.

const REF_DATE = new Date(1900, 0, 1);   // 1900-01-01 local
const REF_SECONDS = REF_DATE.getTime() / 1000;

// Binary search: last JIE_TABLE entry whose seconds <= targetSec. Returns index.
function _jieFloor(targetSec) {
  let lo = 0, hi = window.JIE_TABLE.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (window.JIE_TABLE[mid][0] <= targetSec) lo = mid; else hi = mid - 1;
  }
  return lo;
}

function _dateSec(d) {
  return d.getTime() / 1000 - REF_SECONDS;
}

function _hourBranch(h) {
  if (h >= 23 || h < 1) return "子";
  for (const [br, lo, hi] of T.HOUR_BRANCHES) {
    if (br !== "子" && h >= lo && h < hi) return br;
  }
  return "子";
}

function _yearPillar(dobSec, year) {
  // Find Li Chun (寅 branch entry in February of target year) to determine BaZi year.
  const febStart = new Date(year, 1, 1).getTime() / 1000 - REF_SECONDS;
  const febEnd   = new Date(year, 2, 1).getTime() / 1000 - REF_SECONDS;
  let liChunSec = null;
  for (const [sec, bi] of window.JIE_TABLE) {
    if (sec >= febStart && sec < febEnd && bi === 2) { liChunSec = sec; break; }
  }
  const baziYear = (liChunSec !== null && dobSec < liChunSec) ? year - 1 : year;
  const idx = ((baziYear - 1924) % 60 + 60) % 60;
  return T.jiazi(idx);
}

function _monthPillar(dobSec, yearStem) {
  const ji = _jieFloor(dobSec);
  const branchIdx = window.JIE_TABLE[ji][1];
  const branch = T.BRANCHES[branchIdx];
  const stem = T.monthStem(yearStem, branch);
  return { stem, branch };
}

function _dayPillar(year, month, day, hour) {
  // Day rolls at 23:00 — BaZi day starts at zi hour (23:00).
  let civilDate = new Date(year, month - 1, day);
  if (hour >= 23) civilDate = new Date(year, month - 1, day + 1);
  const deltaDays = Math.round((civilDate - REF_DATE) / 86400000);
  const idx = ((10 + deltaDays) % 60 + 60) % 60;
  return T.jiazi(idx);
}

function _checkJieBoundary(dobSec) {
  const oneHour = 3600;
  const ji = _jieFloor(dobSec);
  const candidates = [window.JIE_TABLE[ji][0]];
  if (ji + 1 < window.JIE_TABLE.length) candidates.push(window.JIE_TABLE[ji + 1][0]);
  return candidates.some(s => Math.abs(dobSec - s) <= oneHour);
}

function computeChart(year, month, day, hour, minute, sex) {
  // hour === null means unknown birth time — omit the hour pillar
  const h = hour !== null ? hour : 12;
  const m = hour !== null ? minute : 0;
  const dob = new Date(year, month - 1, day, h, m);
  const dobSec = _dateSec(dob);

  const yearP  = _yearPillar(dobSec, year);
  const monthP = _monthPillar(dobSec, yearP.stem);
  const dayP   = _dayPillar(year, month, day, h);

  let hourP = null;
  if (hour !== null) {
    const hBranch = _hourBranch(hour);
    const hStem   = T.hourStem(dayP.stem, hBranch);
    hourP = { stem: hStem, branch: hBranch };
  }

  return {
    year: yearP, month: monthP, day: dayP, hour: hourP,
    dob, dobSec, sex,
    nearJieBoundary: _checkJieBoundary(dobSec),
    pillars: [yearP, monthP, dayP, hourP],
    dm: dayP.stem,
  };
}
