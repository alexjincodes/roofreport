# EPS Roof Inspection Form — UI Context

This file describes the existing EPS form structure visible in screenshots, to be used as the reference format for building new roof type sections.

---

## General UI Pattern

All sections follow this layout:

- **Section header**: Blue bar (`#2196F3`) with white text, database icon, title e.g. "Data Section: Roof Details"
- **Section Description**: Small label + plain text description below
- **Section Inputs**: Small label, then a 2-column grid of labelled dropdowns/inputs
- **Save Section**: Blue button at the bottom of each section

---

## Section 1: Roof Details

**Description:** Complete the main details of the roof.

### Fields (2-column grid):

| Left Column | Right Column |
|---|---|
| Roof Type (dropdown) | Roof Geometry (text input — e.g. "Gable to Gable roof") |
| Levels (dropdown) | Overall Condition of Roof (dropdown) |
| Roof Pitch (dropdown) | Site Access (dropdown) |
| Tile Type (dropdown) | Ridge Type (dropdown) |
| Spouting Type (dropdown) | Nail Type (dropdown) |

**Additional Images**: Drag & Drop / Browse file upload (FilePond component)

---

## Section 2: 11 Point Check

**Description:** Ensure all 11 points are checked.

### Fields (2-column grid, numbered):

| Left Column | Right Column |
|---|---|
| 1) Tile condition (dropdown) | 2) Hips and ridging condition (dropdown) |
| 3) Flue and pipe flashings (dropdown) | 4) Valley conditions (dropdown) |
| 5) Gable ends / barge ends (dropdown) | 6) Guttering and downpipe condition (dropdown) |
| 7) Aerials & antennas (dropdown) | 8) Misc fittings to roofing incl solar panels, gutter mesh (dropdown) |
| 9) Water intrusion investigation (dropdown) | 10) Facia condition (dropdown) |
| 11) Flashings (dropdown) | — |

Dropdown options include: Checked, N/A (and presumably: Issue Found, Not Checked)

---

## Section 3: Issues

**Description:** Identify all issues with the roof and add comments with photos for office staff to build a correct quote/estimate.

### Structure:

- **Issue selector**: Full-width dropdown + "Add Issue" button
- If no roof type is selected: shows warning banner — "Roof type is required!"
- If no issues added: shows "There are no issues found. Add one 👍"

### Issue Card Format (once an issue is added):

Each issue renders as a card with:
- **Card header**: Issue name (bold) + trash/delete icon (top right)
- **Edit Issue button**: Full-width blue button inside the card
- **2-column grid inside card:**

| Left Column | Right Column |
|---|---|
| Site Comments (textarea) | Report Damage (pre-filled textarea — auto-populated description) |
| Report Comments (textarea) | Images (photo upload grid — shows thumbnails once uploaded) |

Example issue cards visible in screenshots:
- **Broken Tiles** — Report Damage pre-fill: "Broken tiles can let water into the building. We suggest changing any broken tiles or tiles with signs of fractures."
- **Concrete Mortar cracking/missing/loose** — Report Damage pre-fill: "The current repointing across the cap-line is extremely messy, It appears mortar has been used instead of flexipoint, caps are becoming dislodged and holes are showing throughout"

---

## Section 4: Overall Condition

**Description:** Assess the overall condition of the roof.

### Fields:
- Overall Recommendations (dropdown)

---

## Notes on Conventions

- All dropdowns are single-select unless otherwise noted
- "N/A" is a standard option in most dropdowns
- Images are uploaded via a photo grid component (shows thumbnails in a row)
- Issue cards are collapsible/expandable via the "Edit Issue" button
- The form is roof-type-aware — issue options change based on the Roof Type selected in Section 1
- Tile Type field: N/A should be default/first option (only applicable for Concrete & Decramastic roof types)

