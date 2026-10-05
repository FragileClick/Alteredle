//-----------------------------------------------------------------------------
// MAIN FILE THAT RUNS THE GAME
//-----------------------------------------------------------------------------

// DITERMINE TARGET CARD FROM CURRENT DATE
const dt_origin = new Date('2026-08-14T00:00:00') // Game Launch Date
const dt_today  = new Date()
const dt_offset = Math.floor((dt_today - dt_origin) / (24 * 60 * 60 * 1000))

// If offset exceeds number of cards, reset count
while (dt_offset > db.cards.length) {
    dt_offset -= db.cards.length
}
var TARGET_CARD = db.cards[dt_offset]

// IF ALTEREDLE_PUZZLE IS SET, USE THAT INSTEAD OF DAILY TARGET_CARD
if (readCookie('ALTEREDLE_PUZZLE')) {
    TARGET_CARD = getCardByCollectorNumber(readCookie('ALTEREDLE_PUZZLE'))
}

// LOAD GAME SAVE
var GAME = loadGame()
GAME.puzzle = TARGET_CARD.collector_number

// INITIALIZE DATABASE SEARCH INDEX
const fuse_en = new Fuse(db.cards, {keys: ['name_en']})
const fuse_fr = new Fuse(db.cards, {keys: ['name_fr']})

// INITIALIZE CALLBACKS

// Callback when player clicks a card to submit a guess
game_search_autocomplete.addEventListener('click', function(e) {
    player_guess(e.target.card)
});
// Callback when player hits ENTER to submit a guess
document.onkeydown = function(event) {
    if(event.keyCode == '13') {
        var e = document.getElementsByClassName('selected')[0]
        player_guess(e.card)
    }
};
// Callback when player clicks share button
let shareButton = document.getElementById('share_button');
shareButton.addEventListener("click", async () => {
    // Send text to device share menu
    if (navigator.share) {
        // If browser supports SHARE, open menu
        await navigator.share({
            text: getShareText()
        });
    }
    else {
        // If browser doesn't support (Firefox), copy to clipboard
        var copy = db.text[GAME.language]
        navigator.clipboard.writeText(getShareText())
        .then(() => alert(copy.share_failover_text))
    }

    // If player is logged in, record share
    if (readCookie('ALTEREDLE_PLAYER_SESSION')) {
        saveShareServer(TARGET_CARD.collector_number)
    }
});

function drawPage(){
    // Clear search and close autocomplete
    game_search_input.value = ""
    game_search_autocomplete.classList.add('hidden')

    // Update the langauge toggle button
    updateLangaugeToggle()
    // DRAW GAME BOARD
    drawGameBoard()
    // CHECK IF GAME IS ALREADY WON
    checkGameEndState()
}
drawPage()
