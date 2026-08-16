// ----------------------------------------------------------------------------
// GAME ELEMENT SELECTORS
// ----------------------------------------------------------------------------
// Game elements
const game_search_autocomplete = document.getElementById('game_search_autocomplete')
const game_result              = document.getElementById('game_result')
const game_result_img          = document.getElementById('game_result_img')
const countdown                = document.getElementById('countdown')
const gameBoard               = document.getElementById('gameBoard')

// ----------------------------------------------------------------------------
// GAME LOGIC FUNCTIONS
// ----------------------------------------------------------------------------

// Function updates all page text to the selected language
function setLanguage() {
    // Re-draw gameboard in new language
    drawGameBoard()

    // Update game text
    var copy = db.text[GAME.language]
    document.getElementById('hero_text') .innerText = copy.hero_text
    document.getElementById('game_search_input').placeholder = copy.input_hint
    document.getElementById('game_board_header_set').innerText = copy.game_board_header_set
    document.getElementById('game_board_header_faction').innerText = copy.game_board_header_faction
    document.getElementById('game_board_header_type').innerText = copy.game_board_header_type
    document.getElementById('game_board_header_subtype').innerText = copy.game_board_header_subtype
    document.getElementById('countdown_title').innerText = copy.countdown_title
    document.getElementById('result_title_success').innerText = copy.result_title_success
    document.getElementById('result_subtitle_success').innerHTML = copy.result_subtitle_success.replace('CARD_NAME', TARGET_CARD.name_en).replace('ATTEMPTS', GAME.guesses.length)
    document.getElementById('result_title_failure').innerText = copy.result_title_failure
    document.getElementById('result_subtitle_failure').innerHTML = copy.result_subtitle_failure.replace('CARD_NAME', TARGET_CARD.name_en)
    document.getElementById('footer_attribution_article').innerText = copy.footer_attribution_article
    document.getElementById('player_hint').innerText = copy.player_hint

    // Update language toggle icon
    const language_toggle_fr = document.getElementById('language_toggle_fr')
    const language_toggle_en = document.getElementById('language_toggle_en')
    if (GAME.language=='fr') {
        language_toggle_en.classList.add('translucent')
        language_toggle_fr.classList.remove('translucent')
    } else {
        language_toggle_en.classList.remove('translucent')
        language_toggle_fr.classList.add('translucent')
    }
    // Update result result image
    const game_result_img_success = document.getElementById('game_result_img_success')
    const game_result_img_failure = document.getElementById('game_result_img_failure')
    if (GAME.language == 'fr') {
        game_result_img_success.src = TARGET_CARD.img_fr
        game_result_img_failure.src = TARGET_CARD.img_fr
    } else {
        game_result_img_success.src = TARGET_CARD.img_en
        game_result_img_failure.src = TARGET_CARD.img_en
    }
}
// Function toggles language between english and french
function toggleLanguage() {
    if (GAME.language == 'fr') {
        GAME.language = 'en'
    } else {
        GAME.language = 'fr'
    }
    saveGame(GAME)
    setLanguage()
}
// Function handles player search + input autocomplete
function player_search(self) {
    // Get player search query string
    var player_input = game_search_input.value
    // If player hasn't searched anything, hide menu
    if (player_input.length == 0) {
        game_search_autocomplete.classList.add('hidden')
        return
    }
    // Search cardlist
    if (GAME.language=='fr'){
        var search_results = fuse_fr.search(player_input)
    } else {
        var search_results = fuse_en.search(player_input)
    }
    // Build menu with search results
    // First empty the previous list
    game_search_autocomplete.innerHTML = ""

    if (search_results.length <= 0) {
        // If no search results match the query
        // append an item saying nothing was found
        var li = document.createElement("li")
        li.textContent = "No results found."
        game_search_autocomplete.appendChild(li)
    } else {
        // If the query does return search results
        // add result items to the autocomplete menu
        for (let i = 0; i < search_results.length; i++) {

            // Build the list item
            var card = search_results[i].item
            var li = document.createElement("li")
            var text = document.createElement("span")
            var img = document.createElement("img")

            // Make first li "selected"
            if (i==0) {
                li.classList.add('selected')
            }

            // Set list itme properties
            if (GAME.language == 'fr'){
                text.textContent = card.name_fr
                img.src = card.img_fr
            } else {
                text.textContent = card.name_en
                img.src = card.img_en
            }
            li.card = card
            text.card = card
            img.card = card

            // Write list item to 
            li.appendChild(img)
            li.appendChild(text)
            game_search_autocomplete.appendChild(li)

            // Show the the top 10 results, at most
            if (i>3) {
                break
            }
        }
    }
    // Reveal autocomplete menu showing results
    game_search_autocomplete.classList.remove('hidden')
}
// Function handles when player submits a guess
function player_guess(card) {

    // Clear inbox + hide autocomplete menu
    game_search_input.value = ""
    game_search_autocomplete.classList.add('hidden')

    // Add game to save
    GAME.guesses.push(card.id)
    saveGame(GAME)
    var curretGuessCount = GAME.guesses.length

    // Select the game board elements that need to update
    var tile_set        = document.getElementById('game_tile_set_'+curretGuessCount)
    var tile_faction    = document.getElementById('game_tile_faction_'+curretGuessCount)
    var tile_type       = document.getElementById('game_tile_type_'+curretGuessCount)
    var tile_subtype    = document.getElementById('game_tile_subtype_'+curretGuessCount)
    var guess_card      = document.getElementById('game_guess_card_'+curretGuessCount)
    var guess_card_icon = document.getElementById('game_guess_card_icon_'+curretGuessCount)
    var guess_set       = document.getElementById('game_guess_set_'+curretGuessCount)
    var guess_faction   = document.getElementById('game_guess_faction_'+curretGuessCount)
    var guess_type      = document.getElementById('game_guess_type_'+curretGuessCount)
    var guess_subtype   = document.getElementById('game_guess_subtype_'+curretGuessCount)

    // Write guess card attributes to gameboard
    if (GAME.language=='fr') {
       setTimeout(() => {
            guess_card.src = card.img_fr
            guess_card_icon.classList.add('icon')
            if (card == TARGET_CARD) {
                guess_card_icon.src = db.icons.true
                guess_card_icon.classList.add('true')
            } else {
                guess_card_icon.src = db.icons.false
                guess_card_icon.classList.add('false')
            }
        }, 500); 
        setTimeout(() => {
            guess_set.src = db.set['fr'][card.set]
            if (card.set == TARGET_CARD.set) {
                tile_set.classList.add('true')
            } else {
                tile_set.classList.add('false')
            }
        }, 1000); 
        setTimeout(() => {
            guess_faction.src = db.faction[card.faction-1]
            if (card.faction == TARGET_CARD.faction) {
                tile_faction.classList.add('true')
            } else {
                tile_faction.classList.add('false')
            }
        }, 1500); 
        setTimeout(() => {
            guess_type.innerText = card.type_fr
            if (card.type_en == TARGET_CARD.type_en) {
                tile_type.classList.add('true')
            } else {
                tile_type.classList.add('false')
            }
        }, 2000); 
        setTimeout(() => {
            guess_subtype.innerText = card.subtype_fr
            tile_subtype.classList.add(checkSubtypes(card))
        }, 2500); 
    } else {
        setTimeout(() => {
            guess_card.src = card.img_en
            guess_card_icon.classList.add('icon')
            if (card == TARGET_CARD) {
                guess_card_icon.src = db.icons.true
                guess_card_icon.classList.add('true')
            } else {
                guess_card_icon.src = db.icons.false
                guess_card_icon.classList.add('false')
            }
        }, 500); 
        setTimeout(() => {
            guess_set.src = db.set['en'][card.set]
            if (card.set == TARGET_CARD.set) {
                tile_set.classList.add('true')
            } else {
                tile_set.classList.add('false')
            }
        }, 1000); 
        setTimeout(() => {
            guess_faction.src = db.faction[card.faction-1]
            if (card.faction == TARGET_CARD.faction) {
                tile_faction.classList.add('true')
            } else {
                tile_faction.classList.add('false')
            }
        }, 1500); 
        setTimeout(() => {
            guess_type.innerText = card.type_en
            if (card.type_en == TARGET_CARD.type_en) {
                tile_type.classList.add('true')
            } else {
                tile_type.classList.add('false')
            }
        }, 2000); 
        setTimeout(() => {
            guess_subtype.innerText = card.subtype_en
            tile_subtype.classList.add(checkSubtypes(card))
        }, 2500); 
    }

    // Check if player has won/lost the game
    setTimeout(() => {
        var isGameOver = checkGameEndState()
        if (isGameOver) {
            window.scrollTo({top: document.body.scrollHeight, left: 0,behavior: 'smooth'})    
        }
    }, 3500);
}

// Function checks if the game is done. Either win or loss.
function checkGameEndState() {

    // If player guessed the correct card, the game is over. Win.
    if (GAME.guesses.includes(TARGET_CARD.id)) {
        // Redraw text
        setLanguage()
        // Show result and scoll to bottom
        setGameEndWin()

        return true
    }
    // If player ran out of guess attempts, the game is over. Lose.
    if (GAME.guesses.length >= GAME.guessTotal) {
        // Redraw text
        setLanguage()
        // Show result and scoll to bottom
        setGameEndLose()

        return true
    }
}

// Function updates game when player has WON the game
function setGameEndWin() {
    // Reveal result success
    game_result_success.classList.remove('hidden')
    // Hide search input
    game_search_input.classList.add('hidden')
    // Hide hint
    player_hint.classList.add('hidden')
    // Show countdown timer
    countdown.classList.remove('hidden')
}

// Function updates game when player has LOST the game
function setGameEndLose() {
    // Reveal result success
    game_result_failure.classList.remove('hidden')
    // Hide search input
    game_search_input.classList.add('hidden')
    // Hide hint
    player_hint.classList.add('hidden')
    // Show countdown timer
    countdown.classList.remove('hidden')
}

// Function handles when player click share button
function shareScore() {
    if (navigator.share) {
        navigator.share({
            title: 'Alteredlt',
            text: "\
            🟩 🟥 🟩 🟩 🟥\
            🟩 🟥 🟩 🟩 🟩\
            🟩 🟩 🟩 🟩 🟩\
            ⬜ ⬜ ⬜ ⬜ ⬜\
            ⬜ ⬜ ⬜ ⬜ ⬜\
            ⬜ ⬜ ⬜ ⬜ ⬜",
            url: 'https://fragileclick.github.io/alteredle',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
}

// Function draws gameboard
function drawGameBoard() {
    
    // Write header
    var gameBoardHeader = `
      <div><p class="game-col-header"></p></div>
      <div><p class="game-col-header" id="game_board_header_set"></p></div>
      <div><p class="game-col-header" id="game_board_header_faction"></p></div>
      <div><p class="game-col-header" id="game_board_header_type"></p></div>
      <div><p class="game-col-header" id="game_board_header_subtype"></p></div>
    `
    // Empty gameboard
    gameBoard.innerHTML = gameBoardHeader

    // Add rows to gameboard
    for (let row=1; row <= 6; row++) {

        // If the player has a guess in their save file draw the row with 
        // the guessed card attributes. Otherwise, just draw an empty row.
        if (row <= GAME.guesses.length) {
            var card = getCardById(GAME.guesses[row-1])
            if (GAME.language == 'fr') {
                var gameBoardRow = `
                    <div id="game_guess_${row}" class="game-board-cell guess"><img id="game_guess_card_icon_${row}" class="icon ${card==TARGET_CARD}" src="assets/${card==TARGET_CARD}.svg"><img id="game_guess_card_${row}" src=${card.img_fr}></div>
                    <div id="game_tile_set_${row}" class="game-board-cell set ${card.set==TARGET_CARD.set}"><img id="game_guess_set_${row}" src="${db.set['fr'][card.set]}"></div>
                    <div id="game_tile_faction_${row}" class="game-board-cell faction ${card.faction==TARGET_CARD.faction}"><img id="game_guess_faction_${row}" src="${db.faction[card.faction-1]}"></div>
                    <div id="game_tile_type_${row}" class="game-board-cell type ${card.type_fr==TARGET_CARD.type_fr}"><p id="game_guess_type_${row}">${card.type_fr}</p></div>
                    <div id="game_tile_subtype_${row}" class="game-board-cell subtype ${checkSubtypes(card)}"><p id="game_guess_subtype_${row}">${card.subtype_fr}</p></div>
                `
            } else {
                var gameBoardRow = `
                    <div id="game_guess_${row}" class="game-board-cell guess"><img id="game_guess_card_icon_${row}" class="icon ${card==TARGET_CARD}" src="assets/${card==TARGET_CARD}.svg"><img id="game_guess_card_${row}" src=${card.img_en}></div>
                    <div id="game_tile_set_${row}" class="game-board-cell set ${card.set==TARGET_CARD.set}"><img id="game_guess_set_${row}" src="${db.set['en'][card.set]}"></div>
                    <div id="game_tile_faction_${row}" class="game-board-cell faction ${card.faction==TARGET_CARD.faction}"><img id="game_guess_faction_${row}" src="${db.faction[card.faction-1]}"></div>
                    <div id="game_tile_type_${row}" class="game-board-cell type ${card.type_en==TARGET_CARD.type_en}"><p id="game_guess_type_${row}">${card.type_en}</p></div>
                    <div id="game_tile_subtype_${row}" class="game-board-cell subtype ${checkSubtypes(card)}"><p id="game_guess_subtype_${row}">${card.subtype_en}</p></div>
                `
            }
        } else {
            var gameBoardRow = `
                <div class="game-board-cell guess"><img id="game_guess_card_icon_${row}"><img id="game_guess_card_${row}" src=${db.cardBack}></div>
                <div id="game_tile_set_${row}" class="game-board-cell set"><img id="game_guess_set_${row}"></div>
                <div id="game_tile_faction_${row}" class="game-board-cell faction"><img id="game_guess_faction_${row}"></div>
                <div id="game_tile_type_${row}" class="game-board-cell type"><p id="game_guess_type_${row}"></p></div>
                <div id="game_tile_subtype_${row}" class="game-board-cell subtype"><p id="game_guess_subtype_${row}"></p></div>
            `
        }
        gameBoard.innerHTML += gameBoardRow
    }
}

// Function that checks if guessed card subtypes match the target card
function checkSubtypes(card) {
    // Some cards have multiple subtypes. Here are the possible results:
    //   "true"     Guessed card has the same subtype(s) as target card
    //   "partial"  Guessed card has SOME of the subtypes as target card
    //   "false"    Guessed card has NONE of the subtypes as target card
    var card_subtypes = card.subtype_en.trim().split(' ')
    var target_card_subtypes = TARGET_CARD.subtype_en.trim().split(' ')

    if (card.subtype_en==TARGET_CARD.subtype_en) {
        return 'true'
    }
    else if ( card_subtypes.some(element => target_card_subtypes.includes(element)) ) {
        return 'partial'
    }
    else {
        return 'false'
    }
}

// ----------------------------------------------------------------------------
// SAVE FUNCTIONS
// ----------------------------------------------------------------------------
// CREATE a new cookies with the following name,value,expiration
function createCookie(name,value) {
	document.cookie = name+"="+value+"; path=/";
}
// READ values of an existing cookie by name
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
// DELETE an existing cookie by name
function eraseCookie(name) {
	createCookie(name,"",-1);
}
// SAVE Game
function saveGame(game) {
    createCookie('ALTEREDLE_LANGAUGE', game.language),
    createCookie('ALTEREDLE_GUESSES', String(game.guesses)),
    createCookie('ALTEREDLE_LAST_UPDATE', new Date().toISOString())
}
// LOAD Game
function loadGame() {
    // If browser doesn't already have a cookie save, create a new one
    if (!readCookie('ALTEREDLE_LAST_UPDATE')) {

        // Detect default browser language. Default is english, unless french
        var browserLang = 'en'
        if (navigator.language.includes('fr')) {
            var browserLang = 'fr'
        }

        createCookie('ALTEREDLE_LANGAUGE', browserLang),
        createCookie('ALTEREDLE_GUESSES', ''),
        createCookie('ALTEREDLE_LAST_UPDATE', new Date().toISOString())
    }
    // Load game state from browser cookie save
    var state = {
        'language': readCookie('ALTEREDLE_LANGAUGE'),
        'guesses': readCookie('ALTEREDLE_GUESSES') ? readCookie('ALTEREDLE_GUESSES').split(',') : [],
        'lastUpdate': new Date(readCookie('ALTEREDLE_LAST_UPDATE')),
        'guessTotal': 6
    }

    // If it's a new day, reset puzzle
    var todayDate = new Date().toLocaleDateString('en-CA')
    var lastUpdateDate = state.lastUpdate.toLocaleDateString('en-CA')

    if (lastUpdateDate != todayDate) {
        state.guesses = []
        saveGame(state)
    }
    return state

}
