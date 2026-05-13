const T = (() => {
  const STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  const BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

  const STEM_PY = {
    "甲":"Jia","乙":"Yi","丙":"Bing","丁":"Ding","戊":"Wu",
    "己":"Ji","庚":"Geng","辛":"Xin","壬":"Ren","癸":"Gui",
  };
  const BRANCH_PY = {
    "子":"Zi","丑":"Chou","寅":"Yin","卯":"Mao","辰":"Chen","巳":"Si",
    "午":"Wu","未":"Wei","申":"Shen","酉":"You","戌":"Xu","亥":"Hai",
  };
  const BRANCH_ANIMAL = {
    "子":"Rat","丑":"Ox","寅":"Tiger","卯":"Rabbit","辰":"Dragon","巳":"Snake",
    "午":"Horse","未":"Goat","申":"Monkey","酉":"Rooster","戌":"Dog","亥":"Pig",
  };
  const STEM_ELEMENT = {
    "甲":"Wood","乙":"Wood","丙":"Fire","丁":"Fire","戊":"Earth",
    "己":"Earth","庚":"Metal","辛":"Metal","壬":"Water","癸":"Water",
  };
  const BRANCH_ELEMENT = {
    "子":"Water","丑":"Earth","寅":"Wood","卯":"Wood","辰":"Earth","巳":"Fire",
    "午":"Fire","未":"Earth","申":"Metal","酉":"Metal","戌":"Earth","亥":"Water",
  };
  const STEM_YANG = {};
  STEMS.forEach((s, i) => { STEM_YANG[s] = (i % 2 === 0); });
  const BRANCH_YANG = {};
  BRANCHES.forEach((b, i) => { BRANCH_YANG[b] = (i % 2 === 0); });

  const HOUR_BRANCHES = [
    ["子", 23, 1], ["丑", 1, 3], ["寅", 3, 5], ["卯", 5, 7],
    ["辰", 7, 9], ["巳", 9, 11], ["午", 11, 13], ["未", 13, 15],
    ["申", 15, 17], ["酉", 17, 19], ["戌", 19, 21], ["亥", 21, 23],
  ];

  const HIDDEN_STEMS = {
    "子":["癸"], "丑":["己","癸","辛"], "寅":["甲","丙","戊"], "卯":["乙"],
    "辰":["戊","乙","癸"], "巳":["丙","庚","戊"], "午":["丁","己"],
    "未":["己","丁","乙"], "申":["庚","壬","戊"], "酉":["辛"],
    "戌":["戊","辛","丁"], "亥":["壬","甲"],
  };

  const _TENGOD_MATRIX = [
    ["PR","RW","EG","HO","AW","PW","AO","PO","AS","PS"],
    ["RW","PR","HO","EG","PW","AW","PO","AO","PS","AS"],
    ["AS","PS","PR","RW","EG","HO","AW","PW","AO","PO"],
    ["PS","AS","RW","PR","HO","EG","PW","AW","PO","AO"],
    ["AO","PO","AS","PS","PR","RW","EG","HO","AW","PW"],
    ["PO","AO","PS","AS","RW","PR","HO","EG","PW","AW"],
    ["AW","PW","AO","PO","AS","PS","PR","RW","EG","HO"],
    ["PW","AW","PO","AO","PS","AS","RW","PR","HO","EG"],
    ["EG","HO","AW","PW","AO","PO","AS","PS","PR","RW"],
    ["HO","EG","PW","AW","PO","AO","PS","AS","RW","PR"],
  ];

  const EXCEL_CODE_TO_NAME = {
    "PR":"Companion","RW":"Competing Wealth","EG":"Eating God","HO":"Hurting Officer",
    "PW":"Proper Wealth","AW":"Indirect Wealth","PO":"Proper Officer","AO":"Seven Killings",
    "PS":"Proper Resource","AS":"Indirect Resource",
  };

  const _STAGES_MATRIX = {
    "甲":["Bath","Attire","Official","Peak","Weak","Sick","Death","Tomb","Extinction","Womb","Nourish","Birth"],
    "乙":["Sick","Weak","Peak","Official","Attire","Bath","Birth","Nourish","Womb","Extinction","Tomb","Death"],
    "丙":["Womb","Nourish","Birth","Bath","Attire","Official","Peak","Weak","Sick","Death","Tomb","Extinction"],
    "丁":["Extinction","Tomb","Death","Sick","Weak","Peak","Official","Attire","Bath","Birth","Nourish","Womb"],
    "戊":["Womb","Nourish","Birth","Bath","Attire","Official","Peak","Weak","Sick","Death","Tomb","Extinction"],
    "己":["Extinction","Tomb","Death","Sick","Weak","Peak","Official","Attire","Bath","Birth","Nourish","Womb"],
    "庚":["Death","Tomb","Extinction","Womb","Nourish","Birth","Bath","Attire","Official","Peak","Weak","Sick"],
    "辛":["Birth","Nourish","Womb","Extinction","Tomb","Death","Sick","Weak","Peak","Official","Attire","Bath"],
    "壬":["Peak","Weak","Sick","Death","Tomb","Extinction","Womb","Nourish","Birth","Bath","Attire","Official"],
    "癸":["Official","Attire","Bath","Birth","Nourish","Womb","Extinction","Tomb","Death","Sick","Weak","Peak"],
  };

  const NAYIN = {
    "甲子":"Sea Gold","乙丑":"Sea Gold",
    "丙寅":"Furnace Fire","丁卯":"Furnace Fire",
    "戊辰":"Great Forest Wood","己巳":"Great Forest Wood",
    "庚午":"Road Soil","辛未":"Road Soil",
    "壬申":"Sword Metal","癸酉":"Sword Metal",
    "甲戌":"Mountain Fire","乙亥":"Mountain Fire",
    "丙子":"Stream Water","丁丑":"Stream Water",
    "戊寅":"Wall Soil","己卯":"Wall Soil",
    "庚辰":"Wax Gold","辛巳":"Wax Gold",
    "壬午":"Willow Wood","癸未":"Willow Wood",
    "甲申":"Spring Water","乙酉":"Spring Water",
    "丙戌":"Roof Tile Soil","丁亥":"Roof Tile Soil",
    "戊子":"Thunderbolt Fire","己丑":"Thunderbolt Fire",
    "庚寅":"Pine Wood","辛卯":"Pine Wood",
    "壬辰":"Long-Flow Water","癸巳":"Long-Flow Water",
    "甲午":"Sand Gold","乙未":"Sand Gold",
    "丙申":"Mountain Foot Fire","丁酉":"Mountain Foot Fire",
    "戊戌":"Plain Wood","己亥":"Plain Wood",
    "庚子":"Wall Top Soil","辛丑":"Wall Top Soil",
    "壬寅":"Metal Foil","癸卯":"Metal Foil",
    "甲辰":"Lamp Fire","乙巳":"Lamp Fire",
    "丙午":"Sky River Water","丁未":"Sky River Water",
    "戊申":"Great Post Soil","己酉":"Great Post Soil",
    "庚戌":"Hairpin Gold","辛亥":"Hairpin Gold",
    "壬子":"Mulberry Wood","癸丑":"Mulberry Wood",
    "甲寅":"Great Stream Water","乙卯":"Great Stream Water",
    "丙辰":"Sand Soil","丁巳":"Sand Soil",
    "戊午":"Sky Fire","己未":"Sky Fire",
    "庚申":"Pomegranate Wood","辛酉":"Pomegranate Wood",
    "壬戌":"Great Sea Water","癸亥":"Great Sea Water",
  };

  const MONTH_STEM_FIRST = {
    "甲":"丙","己":"丙","乙":"戊","庚":"戊","丙":"庚","辛":"庚",
    "丁":"壬","壬":"壬","戊":"甲","癸":"甲",
  };
  const HOUR_STEM_FIRST = {
    "甲":"甲","己":"甲","乙":"丙","庚":"丙","丙":"戊","辛":"戊",
    "丁":"庚","壬":"庚","戊":"壬","癸":"壬",
  };

  const ELEMENT_COLORS = {
    Wood: '#7FC96A', Fire: '#FF6D6F', Earth: '#FFD187',
    Metal: '#C9C3CD', Water: '#9CA2FF',
  };

  // 60-jiazi cycle
  function jiazi(idx) {
    return { stem: STEMS[idx % 10], branch: BRANCHES[idx % 12] };
  }
  const JIAZI_LIST = [];
  const JIAZI_INDEX = {};
  const JIAZI_PY = {};
  for (let i = 0; i < 60; i++) {
    const {stem, branch} = jiazi(i);
    const gz = stem + branch;
    JIAZI_LIST.push(gz);
    JIAZI_INDEX[gz] = i;
    JIAZI_PY[gz] = STEM_PY[stem] + BRANCH_PY[branch];
  }

  function tenGod(dm, stem) {
    return _TENGOD_MATRIX[STEMS.indexOf(dm)][STEMS.indexOf(stem)];
  }
  function tenGodName(dm, stem) {
    return EXCEL_CODE_TO_NAME[tenGod(dm, stem)];
  }
  function twelveStage(dm, branch) {
    return _STAGES_MATRIX[dm][BRANCHES.indexOf(branch)];
  }
  function nayin(stem, branch) {
    return NAYIN[stem + branch];
  }
  function hourStem(dayStem, hourBranch) {
    const first = HOUR_STEM_FIRST[dayStem];
    const offset = BRANCHES.indexOf(hourBranch);
    return STEMS[(STEMS.indexOf(first) + offset) % 10];
  }
  function monthStem(yearStem, monthBranch) {
    const first = MONTH_STEM_FIRST[yearStem];
    const offset = ((BRANCHES.indexOf(monthBranch) - BRANCHES.indexOf("寅")) % 12 + 12) % 12;
    return STEMS[(STEMS.indexOf(first) + offset) % 10];
  }
  function voidBranches(stem, branch) {
    const idx = JIAZI_INDEX[stem + branch];
    const xun = Math.floor(idx / 10);
    return [["戌","亥"],["申","酉"],["午","未"],["辰","巳"],["寅","卯"],["子","丑"]][xun];
  }

  return {
    STEMS, BRANCHES, STEM_PY, BRANCH_PY, BRANCH_ANIMAL,
    STEM_ELEMENT, BRANCH_ELEMENT, STEM_YANG, BRANCH_YANG,
    HOUR_BRANCHES, HIDDEN_STEMS, NAYIN, MONTH_STEM_FIRST, HOUR_STEM_FIRST,
    ELEMENT_COLORS, JIAZI_LIST, JIAZI_INDEX, JIAZI_PY,
    jiazi, tenGod, tenGodName, twelveStage, nayin, hourStem, monthStem, voidBranches,
  };
})();
