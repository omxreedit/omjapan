# OMJAPAN theme tokens (single source of truth for CSS + native)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0A0C0A` | App background (green-tinted near-black) |
| `--surface` | `#121612` | Cards, sheets |
| `--surface-2` | `#191E19` | Inputs, chips |
| `--surface-3` | `#222822` | Hover/press, nested surfaces |
| `--border` | `#2B332B` | Input borders, dividers |
| `--text` | `#F2F6EE` | Primary text |
| `--muted` | `#9AA694` | Secondary text (≈7.5:1 on bg) |
| `--accent` | `#B6F13C` | Primary action, active state, key number |
| `--accent-soft` | `rgba(182,241,60,.12)` | Selected chip fill |
| `--success` | `#4ADE80` | Correct answer, OPEN status |
| `--warning` | `#FBBF24` | CLOSING SOON |
| `--danger` | `#F87171` | Wrong answer, CLOSED |
| `--info` | `#60A5FA` | VERIFIED / informational |

Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
Radius: 12 (chips/inputs), 20 (cards), 32 (hero/sheet), 999 (pills).
Type: display `Barlow Condensed` 600/700, body `system-ui` 400/500/600;
scale 40/28/22/18/15/12.5/11.
Motion: press 120ms, toggle 180ms, route 280ms, entrance 520ms;
`cubic-bezier(.22,1,.36,1)`. No blur. Accent only on one focal action per screen.
