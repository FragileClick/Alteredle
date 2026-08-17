//-----------------------------------------------------------------------------
// MAIN FILE THAT RUNS THE GAME
//-----------------------------------------------------------------------------

// LOAD GAME SAVE
var GAME = loadGame()

// DITERMINE TARGET CARD FROM CURRENT DATE
const dt_origin = new Date('2026-08-14T00:00:00') // Game Launch Date
const dt_today  = new Date()
const dt_offset = Math.floor((dt_today - dt_origin) / (24 * 60 * 60 * 1000))

// If offset exceeds number of cards, reset count
while (dt_offset > db.cards.length) {
    dt_offset -= db.cards.length
}
TARGET_CARD = db.cards[dt_offset]

// INITIALIZE DATABASE SEARCH INDEX
const fuse_en = new Fuse(db.cards, {keys: ['name_en']})
const fuse_fr = new Fuse(db.cards, {keys: ['name_fr']})

// INITIALIZE CALLBACKS

// Callback when player clicks a card to submit a guess
game_search_autocomplete.addEventListener('click', function(e) {
    player_guess(e.target.card)
});
// Callback when player hits ENTER to submit a guess
document.onkeydown = function(e) {
    if(event.keyCode == '13') {
        var e = document.getElementsByClassName('selected')[0]
        player_guess(e.card)
    }
};
// Callback when player clicks share button
let shareButton = document.getElementById('share_button');
shareButton.addEventListener("click", async () => {

    var share_title = `Alteredle #${dt_offset+1}`
    var share_text = ""

    // Get text from rows
    for (let row=1; row <= 6; row++) {
        var tile_guess = document.getElementById('game_tile_guess_'+row)

        if (tile_guess.share_emoji_string) {
            share_text += '\n'+tile_guess.share_emoji_string
        }
        else {
            share_text += '\n⬜⬜⬜⬜⬜'
        }
    }
    console.log(share_title)
    console.log(share_text)

    // Send text to device share menu
    try {
        await navigator.share({ 
            title: share_title, 
            text: share_text
        });
    } catch (err) {
        console.error("Share failed:", err.message);
    }
});

// DRAW GAMEBOARD
drawGameBoard()
// CHECK IF GAME IS ALREADY WON
checkGameEndState()
