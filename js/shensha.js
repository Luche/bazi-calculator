// Spirit stars (神煞). Depends on tables.js and chart.js.

const _TRIO = {
  "寅":["寅","午","戌"],"午":["寅","午","戌"],"戌":["寅","午","戌"],
  "申":["申","子","辰"],"子":["申","子","辰"],"辰":["申","子","辰"],
  "巳":["巳","酉","丑"],"酉":["巳","酉","丑"],"丑":["巳","酉","丑"],
  "亥":["亥","卯","未"],"卯":["亥","卯","未"],"未":["亥","卯","未"],
};
const _HARM = {
  "子":"未","未":"子","丑":"午","午":"丑","寅":"巳","巳":"寅",
  "卯":"辰","辰":"卯","申":"亥","亥":"申","酉":"戌","戌":"酉",
};

function _byBranch(chart, ...branches) {
  return chart.pillars.reduce((a, p, i) => { if (branches.includes(p.branch)) a.push(i); return a; }, []);
}
function _byStem(chart, ...stems) {
  return chart.pillars.reduce((a, p, i) => { if (stems.includes(p.stem)) a.push(i); return a; }, []);
}

function taijiNoble(chart) {
  const table = [
    [["甲","乙"],["子","午"]],
    [["丙","丁"],["卯","酉"]],
    [["戊","己"],["辰","戌","丑","未"]],
    [["庚","辛"],["寅","亥"]],
    [["壬","癸"],["巳","申"]],
  ];
  for (const [stems, branches] of table) {
    if (stems.includes(chart.dm)) return _byBranch(chart, ...branches);
  }
  return [];
}
function tianYiNoble(chart) {
  const t = {"甲":["丑","未"],"戊":["丑","未"],"庚":["丑","未"],"乙":["子","申"],"己":["子","申"],
             "丙":["亥","酉"],"丁":["亥","酉"],"壬":["卯","巳"],"癸":["卯","巳"],"辛":["寅","午"]};
  return _byBranch(chart, ...t[chart.dm]);
}
function yueDeNoble(chart) {
  const trio = _TRIO[chart.month.branch];
  const key = trio.join('');
  const stem = {"寅午戌":"丙","申子辰":"壬","巳酉丑":"庚","亥卯未":"甲"}[key];
  return _byStem(chart, stem);
}
function tianDeNoble(chart) {
  const t = {"寅":"丁","卯":"申","辰":"壬","巳":"辛","午":"亥","未":"甲",
             "申":"癸","酉":"寅","戌":"丙","亥":"乙","子":"巳","丑":"庚"};
  const token = t[chart.month.branch];
  if (T.STEMS.includes(token)) return _byStem(chart, token);
  return _byBranch(chart, token);
}
function fuXingNoble(chart) {
  const t = {"甲":["寅","子"],"丙":["寅","子"],"乙":["卯","丑"],"癸":["卯","丑"],
             "戊":["申"],"丁":["酉","亥"],"己":["酉","亥"],"庚":["午"],"辛":["巳"],"壬":["戌"]};
  return _byBranch(chart, ...t[chart.dm]);
}
function yangBlade(chart) {
  const t = {"甲":"卯","乙":"辰","丙":"午","丁":"未","戊":"午","己":"未",
             "庚":"酉","辛":"戌","壬":"子","癸":"丑"};
  return _byBranch(chart, t[chart.dm]);
}
function generalStar(chart) {
  return _byBranch(chart, _TRIO[chart.day.branch][1]);
}
function huaGai(chart) {
  return _byBranch(chart, _TRIO[chart.day.branch][2]);
}
function taoHua(chart) {
  const trio = _TRIO[chart.day.branch];
  const key = trio.join('');
  const br = {"寅午戌":"卯","申子辰":"酉","巳酉丑":"午","亥卯未":"子"}[key];
  return _byBranch(chart, br);
}
function lostSpirit(chart) {
  const trio = _TRIO[chart.day.branch];
  const key = trio.join('');
  const br = {"寅午戌":"巳","申子辰":"亥","巳酉丑":"申","亥卯未":"寅"}[key];
  return _byBranch(chart, br);
}
function jieSha(chart) {
  const trio = _TRIO[chart.day.branch];
  const key = trio.join('');
  const br = {"寅午戌":"亥","申子辰":"巳","巳酉丑":"寅","亥卯未":"申"}[key];
  return _byBranch(chart, br);
}
function lonesomeStar(chart) {
  const yb = chart.year.branch;
  let t;
  if (["亥","子","丑"].includes(yb)) t = "寅";
  else if (["寅","卯","辰"].includes(yb)) t = "巳";
  else if (["巳","午","未"].includes(yb)) t = "申";
  else t = "亥";
  return _byBranch(chart, t);
}
function widowStar(chart) {
  const yb = chart.year.branch;
  let t;
  if (["亥","子","丑"].includes(yb)) t = "戌";
  else if (["寅","卯","辰"].includes(yb)) t = "丑";
  else if (["巳","午","未"].includes(yb)) t = "辰";
  else t = "未";
  return _byBranch(chart, t);
}
function sixHarm(chart) {
  const target = _HARM[chart.day.branch];
  return target ? _byBranch(chart, target) : [];
}
function voidStar(chart) {
  const [a, b] = T.voidBranches(chart.day.stem, chart.day.branch);
  return _byBranch(chart, a, b);
}
function hookEntangle(chart) {
  const yi = T.BRANCHES.indexOf(chart.year.branch);
  const gou = T.BRANCHES[(yi + 3) % 12];
  const jiao = T.BRANCHES[(yi - 3 + 12) % 12];
  return _byBranch(chart, gou, jiao);
}
function yiMa(chart) {
  const trio = _TRIO[chart.day.branch];
  const key = trio.join('');
  const br = {"寅午戌":"申","申子辰":"寅","巳酉丑":"亥","亥卯未":"巳"}[key];
  return _byBranch(chart, br);
}

const SHENSHA_RULES = [
  ["Taiji Noble", taijiNoble],
  ["Heavenly Noble", tianYiNoble],
  ["Monthly-Virtue Noble", yueDeNoble],
  ["Heavenly-Virtue Noble", tianDeNoble],
  ["Fortune Star", fuXingNoble],
  ["Yang Blade", yangBlade],
  ["General Star", generalStar],
  ["Canopy Star", huaGai],
  ["Peach Blossom", taoHua],
  ["Lost Spirit", lostSpirit],
  ["Robbery Sha", jieSha],
  ["Lonesome Star", lonesomeStar],
  ["Widow Star", widowStar],
  ["Six Harms", sixHarm],
  ["Void", voidStar],
  ["Hook-Entangle Sha", hookEntangle],
  ["Travelling Horse", yiMa],
];

function shenshaPerPillar(chart) {
  const out = [[], [], [], []];
  for (const [name, fn] of SHENSHA_RULES) {
    for (const pi of fn(chart)) out[pi].push(name);
  }
  return out;
}
