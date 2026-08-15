# Alteredle

<img src="assets/icon.png" width="100px">

Alteredle is a card guessing game for [Altered TCG](https://www.altered.gg/en-us). The game is inspired by the popular word-guessing game [Wordle](https://www.nytimes.com/games/wordle) and the many variations like [Pokedle](https://www.pokedle.net/), [Runedle](https://runedle.com/#/runes), and more.

### [Click to play Alteredle](https://fragileclick.github.io/Alteredle/)

![](docs/banner.jpg)

## Card List

The card list contains cards from set 1-6. The card list only includes the standard printings; not Alt-Art, Promo, Serialized, Stamped, etc. For cards that were re-printed in multiple sets (ie. Hero) the list only include the earliest printing of each card.

| Set                          | Included |
|------------------------------|----------|
| Beyond The Gates (BTG)       | 🟢 Yes   |
| Trial By Frost (TBF)         | 🟢 Yes   |
| Whispers From The Maze (WFM) | 🟢 Yes   |
| Skybound Odyssey (SKY)       | 🟢 Yes   |
| Seeds Of Unity (SDU)         | 🟢 Yes   |
| Roots Of Corruption (ROC)    | 🟢 Yes   |
| Neverending Journey (NEJ)    | 🔴 No    |

The card list contains one *version* of every card. The game uses the in-faction Rare version because they look cool. The card list does not include any out-of-faction rares, commons, uniques or tokens.

| Rarity           | Included |
|------------------|----------|
| Common (C)       | 🔴 No    |
| Rare (R)         | 🟢 Yes   |
| Faction Rare (F) | 🔴 No    |
| Hero (H)         | 🟢 Yes   |
| Token (T)        | 🔴 No    |
| Unique (U)       | 🔴 No    |
| Exalted (E)      | 🟢 Yes   |

The card data and images come from the [AlteredCore](https://alteredcore.org) API and CDN. The script [`gen-card-db.py`](scripts/gen-card-db.py) requests card data from the API and formats it into [`db.js`](js/db.js)

| Data        | Source                                                 |
|-------------|--------------------------------------------------------|
| Card Data   | [cards.alteredcore.org](https://cards.alteredcore.org) |
| Card Images | [cdn.alteredcore.org](https://cdn.alteredcore.org/)    |

## Language

Alteredle supports English and French.

<img src="docs/language.png" width="120px">

## Screenshots

![](docs/screenshots.jpg)

## Disclaimer

Alteredle is an unofficial fan game and is not affiliated with Equinox.

<img src="https://cdn.alteredcore.org/marketing/fan_content/LOGO_ALTERED_BLACK_WATERMARK.png" width=200px style="background-color: white; padding: 8px;">
