// DOM builder. Depends on all other modules.

let _lastChart = null;

function applyElementColor(el, element) {
  el.style.backgroundColor = T.ELEMENT_COLORS[element] || '#e8e8e8';
}

function _colorStem(el, stem)   { applyElementColor(el, T.STEM_ELEMENT[stem]); }
function _colorBranch(el, br)   { applyElementColor(el, T.BRANCH_ELEMENT[br]); }

function _renderStarsRow(names, title) {
  if (!names.length) return null;
  const wrap = document.createElement('div');
  wrap.className = 'stars-block';
  const hdr = document.createElement('div');
  hdr.className = 'int-title';
  hdr.textContent = title || 'Symbolic Stars';
  wrap.appendChild(hdr);
  const row = document.createElement('div');
  row.className = 'stars-row';
  names.forEach(name => {
    const s = document.createElement('span');
    s.className = 'star-name';
    s.textContent = name;
    row.appendChild(s);
  });
  wrap.appendChild(row);
  return wrap;
}

function _renderInteractionsRow(items, title) {
  if (!items.length) return null;
  const div = document.createElement('div');
  div.className = 'interactions-row';
  const hdr = document.createElement('div');
  hdr.className = 'int-title';
  hdr.textContent = title || 'Interactions';
  div.appendChild(hdr);
  items.forEach(s => {
    const d = document.createElement('div');
    d.className = 'int-item';
    if (s.endsWith('*')) {
      d.appendChild(document.createTextNode(s.slice(0, -1)));
      const star = document.createElement('span');
      star.className = 'int-activated-star';
      star.textContent = '*';
      d.appendChild(star);
    } else {
      d.textContent = s;
    }
    div.appendChild(d);
  });
  return div;
}

function _buildNavRow(navInfo) {
  const navRow = document.createElement('div');
  navRow.className = 'pillar-nav-row';
  const btnMinus = document.createElement('button');
  btnMinus.className = 'nav-btn';
  btnMinus.textContent = '−';
  const valSpan = document.createElement('span');
  valSpan.className = 'nav-val';
  const btnPlus = document.createElement('button');
  btnPlus.className = 'nav-btn';
  btnPlus.textContent = '+';
  if (navInfo.disabled) {
    valSpan.textContent = '?';
    btnMinus.disabled = true;
    btnPlus.disabled = true;
  } else {
    valSpan.textContent = navInfo.displayValue;
    btnMinus.onclick = e => { e.stopPropagation(); navInfo.onNav(navInfo.component, -1); };
    btnPlus.onclick = e => { e.stopPropagation(); navInfo.onNav(navInfo.component, +1); };
  }
  navRow.append(btnMinus, valSpan, btnPlus);
  return navRow;
}

// The five stacked cells shared by main pillars and luck pillars:
// HS box, EB box, hidden-stems row, nayin cell, qi-phase line.
// tenGodLabel overrides the HS ten-god text (used for the Day Master).
function _buildPillarCells(stem, branch, dm, tenGodLabel) {
  const tg = tenGodLabel || T.tenGodName(dm, stem);
  const stage = T.twelveStage(dm, branch);
  const ny = T.nayin(stem, branch);
  const hhs = T.HIDDEN_STEMS[branch];

  // HS box
  const hsBox = document.createElement('div');
  hsBox.className = 'gz-box';
  _colorStem(hsBox, stem);
  hsBox.innerHTML = `<div class="zh">${stem}</div>
    <div class="en">${T.STEM_PY[stem]}</div>
    <div class="ten-god">${tg}</div>`;

  // EB box
  const ebBox = document.createElement('div');
  ebBox.className = 'gz-box';
  _colorBranch(ebBox, branch);
  ebBox.innerHTML = `<div class="zh">${branch}</div>
    <div class="py">${T.BRANCH_PY[branch]}</div>
    <div class="en">${T.BRANCH_ANIMAL[branch]}</div>`;

  // Hidden stems
  const hhsRow = document.createElement('div');
  hhsRow.className = 'hhs-row';
  hhs.forEach(hs => {
    const chip = document.createElement('div');
    chip.className = 'hhs-chip';
    _colorStem(chip, hs);
    chip.innerHTML = `<div class="zh">${hs}</div><div class="ten-god">${T.tenGodAbbr(dm, hs)}</div>`;
    hhsRow.appendChild(chip);
  });

  // Nayin
  const nayinCell = document.createElement('div');
  nayinCell.className = 'nayin-cell';
  applyElementColor(nayinCell, T.nayinElement(stem, branch));
  nayinCell.textContent = ny;

  // Qi phase (DM's twelve stages)
  const qiEl = document.createElement('div');
  qiEl.className = 'qi-phase';
  qiEl.textContent = `${T.stageNumber(stage)}. ${stage}`;

  return [hsBox, ebBox, hhsRow, nayinCell, qiEl];
}

function _buildUnknownPillarCells() {
  // Unknown hour: keep every row so the column stays the same shape/height
  // as the other three, just filled with dashed placeholders.
  const hsBox = document.createElement('div');
  hsBox.className = 'gz-box unknown-cell';
  hsBox.textContent = '?';

  const ebBox = document.createElement('div');
  ebBox.className = 'gz-box unknown-cell';
  ebBox.textContent = '?';

  const hhsRow = document.createElement('div');
  hhsRow.className = 'hhs-row';
  const chip = document.createElement('div');
  chip.className = 'hhs-chip unknown-cell';
  hhsRow.appendChild(chip);

  const nayinCell = document.createElement('div');
  nayinCell.className = 'nayin-cell unknown-cell';

  const qiEl = document.createElement('div');
  qiEl.className = 'qi-phase';

  return [hsBox, ebBox, hhsRow, nayinCell, qiEl];
}

function buildPillarCol(pillarIdx, chart, stars, interactions, labelText, navInfo) {
  const p = chart.pillars[pillarIdx];

  const col = document.createElement('div');
  col.className = 'pillar-col';

  // Label
  const lbl = document.createElement('div');
  lbl.className = 'pillar-label';
  lbl.textContent = labelText;
  col.appendChild(lbl);

  // Nav controls
  if (navInfo) col.appendChild(_buildNavRow(navInfo));

  if (!p) {
    _buildUnknownPillarCells().forEach(c => col.appendChild(c));
    return col;
  }

  const tenGodLabel = pillarIdx === 2 ? 'Day Master' : undefined;
  _buildPillarCells(p.stem, p.branch, chart.dm, tenGodLabel).forEach(c => col.appendChild(c));

  // Stars
  const starsEl = _renderStarsRow(stars);
  if (starsEl) col.appendChild(starsEl);

  // Interactions
  const intEl = _renderInteractionsRow(interactions, 'Interactions');
  if (intEl) col.appendChild(intEl);

  return col;
}

function buildElementBar(balance) {
  const bar = document.createElement('div');
  bar.className = 'element-bar';
  for (const [el, count] of Object.entries(balance)) {
    const chip = document.createElement('div');
    chip.className = 'element-chip';
    applyElementColor(chip, el);
    chip.innerHTML = `${el} <span class="count">${count}</span>`;
    bar.appendChild(chip);
  }
  return bar;
}

function showAnnualSelection(year, stem, branch, chart) {
  const activeWrap = document.querySelector('.annual-wrap.open');
  if (!activeWrap) return;

  const stars = starsForLuckPillar({stem, branch}, chart);
  const ints  = luckInteractionList({stem, branch}, chart);

  let intWrap = activeWrap.querySelector('.annual-year-ints');
  if (!intWrap) {
    intWrap = document.createElement('div');
    intWrap.className = 'annual-year-ints luck-interactions';
    activeWrap.appendChild(intWrap);
  }
  intWrap.innerHTML = `<div class="int-title">Selected Year ${year}: ${stem}${branch}</div>`;
  const starsEl = _renderStarsRow(stars);
  if (starsEl) intWrap.appendChild(starsEl);
  const intsEl = _renderInteractionsRow(ints, 'Interactions');
  if (intsEl) intWrap.appendChild(intsEl);
}

function buildAnnualTable(rows, dm, chart) {
  const wrap = document.createElement('div');
  wrap.className = 'annual-wrap';
  const tbl = document.createElement('table');
  tbl.className = 'annual-table';
  tbl.innerHTML = `<thead><tr>
    <th>Year</th><th>Age</th><th>Pillar</th><th>HS</th><th>EB</th><th>Ten God</th>
  </tr></thead>`;
  const tbody = document.createElement('tbody');
  for (const r of rows) {
    const tg = T.tenGodName(dm, r.stem);
    const tr = document.createElement('tr');
    tr.dataset.stem = r.stem;
    tr.dataset.branch = r.branch;
    const hsColor = T.ELEMENT_COLORS[T.STEM_ELEMENT[r.stem]];
    const ebColor = T.ELEMENT_COLORS[T.BRANCH_ELEMENT[r.branch]];
    tr.innerHTML = `<td>${r.year}</td>
      <td>${r.age}</td>
      <td class="gz-cell" style="font-size:1.1rem">${r.stem}${r.branch}</td>
      <td><span style="background:${hsColor};padding:2px 6px;border-radius:3px">${r.stem}</span></td>
      <td><span style="background:${ebColor};padding:2px 6px;border-radius:3px">${r.branch}</span></td>
      <td>${tg}</td>`;
    tr.addEventListener('click', () => {
      tbody.querySelectorAll('tr.selected').forEach(el => el.classList.remove('selected'));
      tr.classList.add('selected');
      showAnnualSelection(r.year, r.stem, r.branch, chart);
    });
    tbody.appendChild(tr);
  }
  tbl.appendChild(tbody);
  wrap.appendChild(tbl);
  return wrap;
}

function _buildLuckCard(lp, chart) {
  const card = document.createElement('div');
  card.className = 'luck-card';

  const hdr = document.createElement('div');
  hdr.className = 'lc-header';
  hdr.innerHTML = `<div class="lc-age">Age ${lp.ageStart}–${lp.ageEnd}</div>
    <div class="lc-year">${lp.yearStart}–${lp.yearEnd}</div>`;
  card.appendChild(hdr);

  _buildPillarCells(lp.stem, lp.branch, chart.dm).forEach(c => card.appendChild(c));

  const starsEl = _renderStarsRow(starsForLuckPillar(lp, chart));
  if (starsEl) card.appendChild(starsEl);

  const intEl = _renderInteractionsRow(luckInteractionList(lp, chart), 'Interactions');
  if (intEl) card.appendChild(intEl);

  return card;
}

function buildLuckRow(luckArr, chart) {
  const container = document.createElement('div');
  const row = document.createElement('div');
  row.className = 'luck-row';

  luckArr.forEach((lp) => {
    const card = _buildLuckCard(lp, chart);
    row.appendChild(card);

    // Annual table (year-by-year), revealed on click
    const annualRows = annualForLuck(lp, chart.dob.getFullYear());
    const annWrap = buildAnnualTable(annualRows, chart.dm, chart);
    container.appendChild(annWrap);

    card.addEventListener('click', () => {
      const wasOpen = annWrap.classList.contains('open');
      container.querySelectorAll('.annual-wrap').forEach(w => w.classList.remove('open'));
      container.querySelectorAll('.luck-card').forEach(c => c.classList.remove('active'));
      if (!wasOpen) {
        annWrap.classList.add('open');
        card.classList.add('active');
      }
    });
  });

  container.insertBefore(row, container.firstChild);
  return container;
}

function renderChart(containerEl, chart, onDateNav) {
  _lastChart = chart;
  containerEl.innerHTML = '';

  // Jie boundary warning
  const warn = document.getElementById('jie-warning');
  if (warn) warn.style.display = chart.nearJieBoundary ? 'block' : 'none';

  // Compute derived data
  const balance = elementBalance(chart);
  const starsList   = chart.pillars.map((_, i) => starsForPillar(i, chart));
  const intsList    = pillarsInteractionList(chart);
  const luckArr     = luckPillars(chart, 10);

  // ── Four pillars section ──
  const pillarsSection = document.createElement('section');
  pillarsSection.innerHTML = '<h2>Four Pillars (四柱)</h2>';
  const grid = document.createElement('div');
  grid.className = 'pillar-grid';
  // Display order: Hour | Day | Month | Year (Chinese convention)
  const order = [3, 2, 1, 0];
  const LABELS = ['Year', 'Month', 'Day', 'Hour'];
  const _MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const _dob = chart.dob;
  const _navInfos = onDateNav ? {
    0: { component: 'year',  displayValue: String(_dob.getFullYear()) },
    1: { component: 'month', displayValue: _MONTH_ABBR[_dob.getMonth()] },
    2: { component: 'day',   displayValue: String(_dob.getDate()) },
    3: chart.hour
      ? { component: 'hour', displayValue: String(_dob.getHours()).padStart(2,'0') + ':00' }
      : { component: 'hour', displayValue: '?', disabled: true },
  } : { 0: null, 1: null, 2: null, 3: null };
  order.forEach(idx => grid.appendChild(
    buildPillarCol(idx, chart, starsList[idx], intsList[idx], LABELS[idx],
      _navInfos[idx] ? { ..._navInfos[idx], onNav: onDateNav } : null)
  ));
  pillarsSection.appendChild(grid);
  containerEl.appendChild(pillarsSection);

  // ── Element balance ──
  const balSection = document.createElement('section');
  balSection.innerHTML = '<h2>Element Balance</h2>';
  balSection.appendChild(buildElementBar(balance));
  containerEl.appendChild(balSection);

  // ── Luck pillars ──
  const luckSection = document.createElement('section');
  luckSection.innerHTML = '<h2>Luck Pillars (大运) — click to expand</h2>';
  luckSection.appendChild(buildLuckRow(luckArr, chart));
  containerEl.appendChild(luckSection);
}

// ── Chart Glossary help panel ──────────────────────────────────────────────

function _glossaryItem(term, bodyHtml) {
  const item = document.createElement('div');
  item.className = 'glossary-item';
  const t = document.createElement('div');
  t.className = 'glossary-term';
  t.textContent = term;
  item.appendChild(t);
  const b = document.createElement('div');
  b.className = 'glossary-desc';
  b.innerHTML = bodyHtml;
  item.appendChild(b);
  return item;
}

function _simpleItemBuilder(key, infoMap) {
  const info = infoMap[key];
  return _glossaryItem(key, info ? info.meaning : '');
}

// Builds each Ten God item with the actual stem/element that fills that role for
// THIS chart's Day Master (e.g. Proper Wealth for a Yang Metal DM is Yin Wood).
function _tenGodItemBuilder(chart) {
  return function(code, infoMap) {
    const info = infoMap[code];
    if (!info) return _glossaryItem(code, '');
    const targetStem = T.STEMS.find(s => T.tenGod(chart.dm, s) === code);
    const yinYang = T.STEM_YANG[targetStem] ? 'Yang' : 'Yin';
    const elementLabel = `${yinYang} ${T.STEM_ELEMENT[targetStem]} (${targetStem} ${T.STEM_PY[targetStem]})`;
    const parts = [
      `<em>${info.pinyin}</em> — ${info.aspect}`,
      `Element in this chart: ${elementLabel}`,
    ];
    if (info.relation[chart.sex]) parts.push(`Relation: ${info.relation[chart.sex]}`);
    parts.push(info.meaning);
    return _glossaryItem(info.name, parts.join('<br>'));
  };
}

function _dmSummaryHtml(chart) {
  const yinYang = T.STEM_YANG[chart.dm] ? 'Yang' : 'Yin';
  const genderLabel = chart.sex === 'M' ? 'Male chart' : 'Female chart';
  return `Day Master: ${chart.dm} ${T.STEM_PY[chart.dm]} — ${yinYang} ${T.STEM_ELEMENT[chart.dm]} · ${genderLabel}`;
}

function _buildGlossarySection(title, keys, infoMap, itemBuilder, introHtml) {
  if (!keys.length) return null;
  const sec = document.createElement('div');
  sec.className = 'glossary-section';
  const h = document.createElement('h3');
  h.textContent = title;
  sec.appendChild(h);
  if (introHtml) {
    const intro = document.createElement('div');
    intro.className = 'glossary-intro';
    intro.innerHTML = introHtml;
    sec.appendChild(intro);
  }
  keys.forEach(k => sec.appendChild(itemBuilder(k, infoMap)));
  return sec;
}

function buildHelpPanelContent() {
  const wrap = document.createElement('div');
  if (!_lastChart) {
    wrap.textContent = 'Calculate a chart first.';
    return wrap;
  }
  const selRow = document.querySelector('#result .annual-table tr.selected');
  const selectedYear = selRow ? { stem: selRow.dataset.stem, branch: selRow.dataset.branch } : null;
  const luckArr = luckPillars(_lastChart, 10);
  const data = collectChartGlossary(_lastChart, luckArr, selectedYear);

  const sections = [
    _buildGlossarySection('Aspects of Life', data.tenGods, TENGOD_INFO,
      _tenGodItemBuilder(_lastChart), _dmSummaryHtml(_lastChart)),
    _buildGlossarySection('Symbolic Stars — Natal Chart', data.starsNatal, STAR_INFO, _simpleItemBuilder),
    _buildGlossarySection('Symbolic Stars — Luck Pillars Only', data.starsLuckOnly, STAR_INFO, _simpleItemBuilder),
    _buildGlossarySection('Interactions — Natal Chart', data.interactionsNatal, INTERACTION_INFO, _simpleItemBuilder),
    _buildGlossarySection('Interactions — Luck Pillars Only', data.interactionsLuckOnly, INTERACTION_INFO, _simpleItemBuilder),
  ];
  sections.forEach(s => { if (s) wrap.appendChild(s); });

  const isEmpty = !data.tenGods.length && !data.starsNatal.length && !data.starsLuckOnly.length
    && !data.interactionsNatal.length && !data.interactionsLuckOnly.length;
  if (isEmpty) wrap.textContent = 'No symbolic stars or interactions in this chart.';
  return wrap;
}
