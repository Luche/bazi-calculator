# BaZi Calculator 八字命盘

A browser-based BaZi (Four Pillars of Destiny) calculator. No installation required.

**Live site:** https://luche.github.io/bazi-calculator/

---

## How to Use

### 1. Enter birth details

Fill in the form at the top:

- **Date of Birth** — Gregorian calendar date
- **Time of Birth** — 24-hour local civil time (as accurate as possible)
- **Name** — optional, used in the copied prompt
- **Sex** — Male or Female (affects Luck Pillar direction)
- **Focus / Question** — optional question to include when copying the AI prompt

Click **Calculate 排命盘**.

---

### 2. Read the Four Pillars chart

The chart shows four columns — **Hour | Day | Month | Year** — each containing:

| Row | What it shows |
|-----|--------------|
| Heavenly Stem (天干) | Colored by element; Ten God below |
| Earthly Branch (地支) | Colored by element; Twelve Stage and Na Yin below |
| Hidden Stems (藏干) | Up to 3 chips, each with its Ten God |
| Void (空亡) | The two branches voided by this pillar's GZ pair |
| Symbolic Stars | Yellow tags — Nobleman, Academic, Travelling Horse, etc. |
| Interactions | Stem combos/clashes and branch interactions with other pillars |

> ⚠️ If birth time is close to a Solar Term boundary, a warning banner appears. Double-check the exact time.

---

### 3. Element Balance

A color-coded bar showing how many of the eight characters belong to each of the five elements (Wood, Fire, Earth, Metal, Water).

---

### 4. Luck Pillars (大运)

Eight ten-year luck cycles are shown as cards. Click a card to expand it and see:

- Stars and interactions of that luck pillar with the birth chart
- A year-by-year annual table for the 10-year period

---

### 5. Select an Annual Year

Click any row in the annual table to select that year. The page will show:

- An **Annual Year panel** (below the Four Pillars) with that year's pillar, its symbolic stars, and its interactions with the birth chart
- A **Selected Year block** at the bottom of the expanded luck card

Click a different row to switch years. Click the same card again to collapse it.

---

### 6. Copy AI Prompt

After calculating, a **📋 Copy Prompt** button appears above the chart. Clicking it copies a structured BaZi reading prompt to your clipboard — ready to paste into ChatGPT, Claude, or any AI.

The prompt includes the full chart, current and next luck cycles, monthly luck for the current year, and your focus question if provided.

---

## Deployment

The site is hosted on **GitHub Pages** and serves directly from the root folder. No build step or server is needed — all computation runs in the browser.
