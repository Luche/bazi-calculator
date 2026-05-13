// DOM builder. Depends on all other modules.

function applyElementColor(el, element) {
  el.style.backgroundColor = T.ELEMENT_COLORS[element] || '#e8e8e8';
}

function _colorStem(el, stem)   { applyElementColor(el, T.STEM_ELEMENT[stem]); }
function _colorBranch(el, br)   { applyElementColor(el, T.BRANCH_ELEMENT[br]); }

function _renderStarsRow(names) {
  if (!names.length) return null;
  const div = document.createElement('div');
  div.className = 'stars-row';
  names.forEach(name => {
    const s = document.createElement('span');
    s.className = 'star-name';
    s.textContent = name;
    div.appendChild(s);
  });
  return div;
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
    d.textContent = s;
    div.appendChild(d);
  });
  return div;
}

function buildPillarCol(pillarIdx, chart, derivedData, stars, interactions, labelText) {
  const p = chart.pillars[pillarIdx];

  if (!p) {
    const col = document.createElement('div');
    col.className = 'pillar-col';
    const lbl = document.createElement('div');
    lbl.className = 'pillar-label';
    lbl.textContent = labelText;
    col.appendChild(lbl);
    const box = document.createElement('div');
    box.className = 'gz-box unknown-pillar';
    box.innerHTML = '<div class="zh" style="color:#bbb;font-size:1.2rem">?</div><div class="en" style="color:#bbb">Unknown</div>';
    col.appendChild(box);
    return col;
  }

  const tg = derivedData.stemTenGods[pillarIdx];
  const stage = derivedData.twelveStages[pillarIdx];
  const ny = derivedData.naYin[pillarIdx];
  const [vA, vB] = derivedData.voidsPerPillar[pillarIdx];
  const hhs = derivedData.hiddenStems[pillarIdx];
  const hhsTg = derivedData.hiddenStemTenGods[pillarIdx];

  const col = document.createElement('div');
  col.className = 'pillar-col';

  // Label
  const lbl = document.createElement('div');
  lbl.className = 'pillar-label';
  lbl.textContent = labelText;
  col.appendChild(lbl);

  // HS box
  const hsBox = document.createElement('div');
  hsBox.className = 'gz-box';
  _colorStem(hsBox, p.stem);
  hsBox.innerHTML = `<div class="zh">${p.stem}</div>
    <div class="en">${T.STEM_PY[p.stem]}</div>
    <div class="ten-god">${tg}</div>`;
  col.appendChild(hsBox);

  // EB box
  const ebBox = document.createElement('div');
  ebBox.className = 'gz-box';
  _colorBranch(ebBox, p.branch);
  ebBox.innerHTML = `<div class="zh">${p.branch}</div>
    <div class="en">${T.BRANCH_ANIMAL[p.branch]}</div>
    <div class="stage">${stage}</div>
    <div class="nayin">${ny}</div>`;
  col.appendChild(ebBox);

  // Hidden stems
  const hhsRow = document.createElement('div');
  hhsRow.className = 'hhs-row';
  hhs.forEach((hs, i) => {
    const chip = document.createElement('div');
    chip.className = 'hhs-chip';
    _colorStem(chip, hs);
    chip.innerHTML = `<div class="zh">${hs}</div><div class="ten-god">${hhsTg[i]}</div>`;
    hhsRow.appendChild(chip);
  });
  col.appendChild(hhsRow);

  // Void
  const voidEl = document.createElement('div');
  voidEl.className = 'void-label';
  voidEl.textContent = `Void: ${T.BRANCH_PY[vA]}, ${T.BRANCH_PY[vB]}`;
  col.appendChild(voidEl);

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
  const panel = document.getElementById('annual-panel');
  if (!panel) return;
  const stars = starsForLuckPillar({stem, branch}, chart);
  const ints  = luckInteractionList({stem, branch}, chart);

  panel.innerHTML = '';
  const h3 = document.createElement('h3');
  h3.textContent = `Annual Year ${year} — ${stem}${branch} (${T.STEM_PY[stem]}${T.BRANCH_PY[branch]})`;
  panel.appendChild(h3);

  const box = document.createElement('div');
  box.className = 'annual-pillar-box';
  applyElementColor(box, T.STEM_ELEMENT[stem]);
  box.innerHTML = `<div class="zh">${stem}${branch}</div><div class="en">${T.JIAZI_PY[stem + branch]}</div>`;
  panel.appendChild(box);

  const starsEl = _renderStarsRow(stars);
  if (starsEl) panel.appendChild(starsEl);
  const intsEl = _renderInteractionsRow(ints, 'Interactions with birth chart');
  if (intsEl) panel.appendChild(intsEl);
  panel.classList.add('visible');

  const activeWrap = document.querySelector('.annual-wrap.open');
  if (activeWrap) {
    let intWrap = activeWrap.querySelector('.annual-year-ints');
    if (!intWrap) {
      intWrap = document.createElement('div');
      intWrap.className = 'annual-year-ints luck-interactions';
      activeWrap.appendChild(intWrap);
    }
    intWrap.innerHTML = `<div class="int-title">Selected Year ${year}: ${stem}${branch}</div>`;
    const starsEl2 = _renderStarsRow(stars);
    if (starsEl2) intWrap.appendChild(starsEl2);
    const intsEl2 = _renderInteractionsRow(ints, 'Interactions');
    if (intsEl2) intWrap.appendChild(intsEl2);
  }
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

function buildLuckRow(luckArr, chart) {
  const container = document.createElement('div');
  const row = document.createElement('div');
  row.className = 'luck-row';

  luckArr.forEach((lp) => {
    const card = document.createElement('div');
    card.className = 'luck-card';

    const hsDiv = document.createElement('div');
    hsDiv.className = 'lc-hs';
    hsDiv.textContent = lp.stem;
    _colorStem(hsDiv, lp.stem);

    const ebDiv = document.createElement('div');
    ebDiv.className = 'lc-eb';
    ebDiv.textContent = lp.branch;
    _colorBranch(ebDiv, lp.branch);

    const ageDiv = document.createElement('div');
    ageDiv.className = 'lc-age';
    ageDiv.textContent = `Age ${lp.ageStart}–${lp.ageEnd}`;

    const yrDiv = document.createElement('div');
    yrDiv.className = 'lc-year';
    yrDiv.textContent = `${lp.yearStart}–${lp.yearEnd}`;

    card.appendChild(hsDiv);
    card.appendChild(ebDiv);
    card.appendChild(ageDiv);
    card.appendChild(yrDiv);
    row.appendChild(card);

    // Annual table + luck interactions
    const annualRows = annualForLuck(lp, chart.dob.getFullYear());
    const annWrap = buildAnnualTable(annualRows, chart.dm, chart);

    // Luck stars + interactions (prepended inside the expandable area)
    const lpStars = starsForLuckPillar(lp, chart);
    const lpInts  = luckInteractionList(lp, chart);
    if (lpStars.length || lpInts.length) {
      const intWrap = document.createElement('div');
      intWrap.className = 'luck-interactions';
      const starsEl = _renderStarsRow(lpStars);
      if (starsEl) {
        const starsHdr = document.createElement('div');
        starsHdr.className = 'int-title';
        starsHdr.textContent = 'Symbolic stars';
        intWrap.appendChild(starsHdr);
        intWrap.appendChild(starsEl);
      }
      const intEl = _renderInteractionsRow(lpInts, 'Interactions');
      if (intEl) intWrap.appendChild(intEl);
      annWrap.insertBefore(intWrap, annWrap.firstChild);
    }

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

function renderChart(containerEl, chart) {
  containerEl.innerHTML = '';

  // Jie boundary warning
  const warn = document.getElementById('jie-warning');
  if (warn) warn.style.display = chart.nearJieBoundary ? 'block' : 'none';

  // Compute derived data
  const derivedData = {
    stemTenGods: stemTenGods(chart),
    hiddenStems: hiddenStems(chart),
    hiddenStemTenGods: hiddenStemTenGods(chart),
    twelveStages: twelveStages(chart),
    naYin: naYin(chart),
    voidsPerPillar: voidsPerPillar(chart),
    balance: elementBalance(chart),
  };
  const starsList   = chart.pillars.map((_, i) => starsForPillar(i, chart));
  const intsList    = pillarsInteractionList(chart);
  const luckArr     = luckPillars(chart, 8);

  // ── Four pillars section ──
  const pillarsSection = document.createElement('section');
  pillarsSection.innerHTML = '<h2>Four Pillars (四柱)</h2>';
  const grid = document.createElement('div');
  grid.className = 'pillar-grid';
  // Display order: Hour | Day | Month | Year (Chinese convention)
  const order = [3, 2, 1, 0];
  const LABELS = ['Year', 'Month', 'Day', 'Hour'];
  order.forEach(idx => grid.appendChild(
    buildPillarCol(idx, chart, derivedData, starsList[idx], intsList[idx], LABELS[idx])
  ));
  pillarsSection.appendChild(grid);
  containerEl.appendChild(pillarsSection);

  // ── Annual year panel (populated on row click) ──
  const annualPanel = document.createElement('div');
  annualPanel.id = 'annual-panel';
  containerEl.appendChild(annualPanel);

  // ── Element balance ──
  const balSection = document.createElement('section');
  balSection.innerHTML = '<h2>Element Balance</h2>';
  balSection.appendChild(buildElementBar(derivedData.balance));
  containerEl.appendChild(balSection);

  // ── Luck pillars ──
  const luckSection = document.createElement('section');
  luckSection.innerHTML = '<h2>Luck Pillars (大运) — click to expand</h2>';
  luckSection.appendChild(buildLuckRow(luckArr, chart));
  containerEl.appendChild(luckSection);
}
