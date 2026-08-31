# Theme color audit (pre-grey-ramp swap)

Snapshot of every color our `HpoTheme` preset overrode in `src/main.ts`, with the value
each token *resolved to*, taken before repointing light `surface.*` from teal to grey.
Kept so we can restore any hue that turns out to have been load-bearing.

## Ramps

`primary.50-900` -> `{cyan.*}` (unchanged by the swap)

| step | cyan |
|---|---|
| 50 | `#f0faff` |
| 100 | `#cde7f4` |
| 200 | `#abd4e9` |
| 300 | `#89c1de` |
| 400 | (cyan.400) |
| 700 | `#0177b2`-ish (the blue used for links/active tab) |

`colorScheme.light.surface.50-900` -> `{teal.*}` **(this is what we are replacing)**

| step | teal | notable consumer |
|---|---|---|
| 50 | `#effbfa` | Lara `tabs.tab.background`; search hero band (hardcoded in HTML) |
| 100 | `#dbf5f3` | `list.option.focusBackground` -> select hover |
| 200 | `#b7ebe7` | `content.borderColor` |
| 300 | `#94e1dc` | `formField.borderColor` |
| 400 | `#70d7d0` | **Echo `menubar.root.background` -> the header** |
| 500 | `#50c3bb` | `text.mutedColor`, `formField.placeholderColor` |
| 600 | `#379891` | |
| 700 | `#1f6d68` | `text.color` -> `list.option.color`, `formField.color` |
| 800 | `#195753` | `text.hoverColor` -> `list.option.focusColor` |
| 900 | `#0c2c2a` | |

`colorScheme.dark.surface.*` -> `{slate.*}` (unchanged; dark mode is not in use)

## Component overrides and their resolved colors

| Token | Value | Resolved | Still needed after swap? |
|---|---|---|---|
| `formField.placeholderColor` (light) | `{gray.600}` | `#4b5563` | No - patched teal placeholder; note it used PrimeUIX `gray`, not Echo `grey` |
| `menubar.light.root.color` | `#000000` | | Yes - header stays teal.400, needs dark text |
| `menubar.light.item.color` | `#000000` | | Yes - same |
| `message.light.info.background` | `{teal.50}` | `#effbfa` | Yes - explicit teal, unaffected by ramp |
| `message.light.info.borderColor` | `{teal.300}` | `#94e1dc` | Yes |
| `message.light.info.color` | `{teal.700}` | `#1f6d68` | Yes |
| `button.light.link.color` | `{primary.700}` | cyan.700 | Yes |
| `tabs.tablist.background` | `white` | | Yes |
| `tabs.tab.color` | `#636363` | = grey.700 | Could become `{surface.500}` after swap |
| `tabs.tab.activeColor` | `{primary.700}` | cyan.700 | Yes |
| `tabs.tab.borderColor` | `#D9D9D9` | = grey.300 | Could become `{surface.200}` after swap |
| `tabs.tab.hoverBorderColor` | `#D9D9D9` | | Yes - Lara's is `transparent` |
| `tabs.tab.activeBorderColor` | `{primary.700}` | cyan.700 | Yes |
| `tabs.light.tab.background` | `rgba(0,0,0,0)` | | Yes - Lara light sets `{surface.50}` |
| `tabs.light.tab.hoverBackground` | `{primary.50}` | `#f0faff` | Yes - must beat Lara's light `{surface.100}` |
| `select.option.color` | `{grey.900}` | `#222222` | No - `text.color` becomes this after swap |
| `select.option.focusColor` | `{grey.900}` | `#222222` | No - same |
| `select.option.focusBackground` | `{primary.50}` | `#f0faff` | Yes - design wants cyan hover, not grey |

## Hardcoded colors in the search redesign (for reference / future tokenizing)

`#222` body text (grey.900), `#454545` subtitle (grey.800), `#636363` muted (grey.700),
`#D9D9D9` borders (grey.300), `#0177b2` link blue, `#effbfa` hero band (teal.50).

## Echo `grey` ramp (the redesign's real neutrals)

`0 #ffffff` / `100 #f7f7f7` / `200 #e8e8e8` / `300 #d9d9d9` / `400 #bcbcbc` /
`500 #9e9e9e` / `600 #808080` / `700 #636363` / `800 #454545` / `900 #222222` / `1000 #000000`
