var GAME = loadGame()

function drawPage() {
    // Update the langauge toggle button
    updateLangaugeToggle()

    // Draw page text in selected language
    var copy = db.text[GAME.language]
    document.getElementById('hero_text').innerText = copy.collection_hero_text
    document.getElementById('collection_stat_puzzles_title').innerHTML = copy.collection_stat_puzzles_title
    document.getElementById('collection_stat_puzzles_subtitle').innerText = copy.collection_stat_puzzles_subtitle
    document.getElementById('collection_stat_solved_title').innerHTML = copy.collection_stat_solved_title
    document.getElementById('collection_stat_solved_subtitle').innerText = copy.collection_stat_solved_subtitle
    document.getElementById('collection_stat_score_title').innerHTML = copy.collection_stat_score_title
    document.getElementById('collection_stat_score_subtitle').innerText = copy.collection_stat_score_subtitle
    document.getElementById('collection_stat_foils_title').innerHTML = copy.collection_stat_foils_title
    document.getElementById('collection_stat_foils_subtitle').innerText = copy.collection_stat_foils_subtitle
    document.getElementById('collection_stat_shares_title').innerHTML = copy.collection_stat_shares_title
    document.getElementById('collection_stat_shares_subtitle').innerText = copy.collection_stat_shares_subtitle
    document.getElementById('footer_attribution_article').innerText = copy.footer_attribution_article

    // LOAD PUZZLE COLLECTION CARD FACES
    var puzzle_collection = document.getElementById('puzzle_collection')
    for (const card of puzzle_collection.children) {
        var c = card.children[0].children[1]

        if (GAME.language == 'fr') {
            c.src = getCardByCollectorNumber(c.dataset.collector_number).img_fr
        }
        else {
            c.src = getCardByCollectorNumber(c.dataset.collector_number).img_en
        }
    }
}
