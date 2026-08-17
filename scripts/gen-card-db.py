# This script generates the card database
# The script requests cards from the alteredcore API. It pulls all RARE, EXALTED and HERO cards.
# Then the script reformats into the neccessary schema + removes OOF Rares, Alt Arts, Tokens, Reprints.
# 
# Card information is from: cards.alteredcore.org/api
# Card image urls are from: cdn.alteredcore.org
#
import requests
import json
import random
import time

# STEP 1 - Get card data from alteredcore API
cards_api_raw = []
current_page = 1
total_items = None
setlist = ['EOLE', 'DUSTER', 'CYCLONE', 'BISE', 'ALIZE', 'CORE'] # Only collect cards from these sets (not NEJ at time of writing)

# Get all Rare + Exalted Cards
while True:
    rsp = requests.get(
        url='https://cards.alteredcore.org/api/cards',
        params={
            'page': current_page,
            'itemsPerPage': 100,
            'order[set.date]': 'desc',
            'order[collectorNumberFormatedId]': 'asc',
            'rarity[]': ['RARE', 'EXALTED'],
            'set.reference[]': setlist,
            'variation[]': 'standard',
        }
    ).json()

    print(f'Recieved page {current_page}. {len(rsp["member"])} cards.')

    current_page += 1
    total_items = rsp['totalItems']
    cards_api_raw.extend(rsp['member'])

    if len(cards_api_raw) >= total_items:
        break

# Then get all hero cards
rsp = requests.get(
    url='https://cards.alteredcore.org/api/cards',
    params={
        'page': 1,
        'itemsPerPage': 500,
        'order[set.date]': 'asc',
        'order[collectorNumberFormatedId]': 'asc',
        'cardType[]': ['HERO'],
        'set.reference[]': setlist,
        'variation[]': 'standard',
    }
).json()
cards_api_raw.extend(rsp['member'])
print(f'Received {len(rsp["member"])} Hero cards.')

# STEP 2 - Format card data to neccessary schema
cards_formatted = []
card_collector_numbers = ["ROC-016-R-EN", "ROC-029-R-EN", "TBF-042-R-EN", "ROC-096-R-EN"]
card_names = []
img_url_template = 'https://cdn.alteredcore.org/cards/{lang}/{set}/{ref}.webp'      # Standard card images
# img_url_template = 'https://cdn.alteredcore.org/cards_hd/{lang}/{set}/{ref}.jpg'  # HD cards images
for card in cards_api_raw:

    # Track collector numbers we've see and skip duplicates
    # For example, Reka Hexarchs show up twice
    if not 'collectorNumberFormatedId' in card:
        continue

    cn = card['collectorNumberFormatedId']
    if cn in card_collector_numbers:
        continue
    card_collector_numbers.append(cn)

    # Skip out of faction cards
    if '-F-' in cn:
        continue
    # Skip Tokens
    if '-T-' in cn:
        continue
    # Skip alt art
    if '-A-' in cn:
        continue

    # Skip reprints. For example, heros printed in multiple sets.
    if card['name']['en'] in card_names:
        continue
    card_names.append(card['name']['en'])

    output = {
        "id": card['reference'],
        "collector_number": card['collectorNumberFormatedId'],
        "name_en": card['name']['en'],
        "name_fr": card['name']['fr'],
        "set": card['set']['code'],
        "faction": card['faction']['id'],
        "type_en": card['cardType']['name']['en'],
        "type_fr": card['cardType']['name']['fr'],
        "subtype_en": '',
        "subtype_fr": '', # Cards can have multiple subtypes
        "hand_cost": card['mainCost'],
        "reserve_cost": card['recallCost'],
        "img_en": img_url_template.format(lang='en', set=card['set']['reference'], ref=card['reference']),
        "img_fr": img_url_template.format(lang='fr', set=card['set']['reference'], ref=card['reference'])
    }
    for subtype in card['cardSubTypes']:
        output['subtype_en'] += subtype['name']['en']+' '
        output['subtype_fr'] += subtype['name']['fr']+' '

    output['subtype_en'].strip()
    output['subtype_fr'].strip()

    cards_formatted.append(output)

# STEP 3 - Save data to file
random.shuffle(cards_formatted) # Shuffle the "deck" of cards

# Save output as JSON
with open(f'scripts/card-db-{time.time()}.json', 'w', encoding="utf-8") as f:
    json.dump(cards_formatted, f)
