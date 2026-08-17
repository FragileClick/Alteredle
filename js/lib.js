// ----------------------------------------------------------------------------
// GAME ELEMENT SELECTORS
// ----------------------------------------------------------------------------
// Game elements
const game_search_autocomplete = document.getElementById('game_search_autocomplete')
const game_result              = document.getElementById('game_result')
const game_result_img          = document.getElementById('game_result_img')
const countdown                = document.getElementById('countdown')

// ----------------------------------------------------------------------------
// GAME LOGIC FUNCTIONS
// ----------------------------------------------------------------------------

// Function updates all page text to the selected language
function setLanguage() {
    // Update game text
    var copy = db.text[GAME.language]
    document.getElementById('hero_text') .innerText = copy.hero_text
    document.getElementById('game_search_input').placeholder = copy.input_hint
    document.getElementById('game_board_header_set').innerText = copy.game_board_header_set
    document.getElementById('game_board_header_faction').innerText = copy.game_board_header_faction
    document.getElementById('game_board_header_type').innerText = copy.game_board_header_type
    document.getElementById('game_board_header_cost').innerText = copy.game_board_header_cost
    document.getElementById('countdown_title').innerText = copy.countdown_title
    document.getElementById('result_title_success').innerText = copy.result_title_success
    document.getElementById('result_subtitle_success').innerHTML = copy.result_subtitle_success.replace('CARD_NAME', TARGET_CARD.name_en).replace('ATTEMPTS', GAME.guesses.length)
    document.getElementById('result_title_failure').innerText = copy.result_title_failure
    document.getElementById('result_subtitle_failure').innerHTML = copy.result_subtitle_failure.replace('CARD_NAME', TARGET_CARD.name_en)
    document.getElementById('footer_attribution_article').innerText = copy.footer_attribution_article
    document.getElementById('player_hint').innerText = copy.player_hint
    document.getElementById('share_button_text').innerText = copy.share_button

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
    // Save new language
    saveGame(GAME)
    // Redraw game in new langauge
    drawGameBoard()
    // Clear search and close autocomplete
    game_search_input.value = ""
    game_search_autocomplete.classList.add('hidden')
}
// Function handles player search + input autocomplete
function player_search() {
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

    // Draw change to gameboard
    drawGameBoard(animation=true)

    // Check if player has won/lost the game
    setTimeout(() => {
        var isGameOver = checkGameEndState()
        if (isGameOver) {
            window.scrollTo({top: document.body.scrollHeight, left: 0,behavior: 'smooth'}) 
        }
    }, 4500);
}

// Function checks if the game is done. Either win or loss.
function checkGameEndState() {
    // If player guessed the correct card, the game is over. Win.
    if (GAME.guesses.includes(TARGET_CARD.id)) {
        // Redraw text
        setLanguage()
        // Show result
        setGameEndWin()

        return true
    }
    // If player ran out of guess attempts, the game is over. Lose.
    if (GAME.guesses.length >= GAME.guessTotal) {
        // Redraw text
        setLanguage()
        // Show result
        setGameEndLose()

        return true
    }
}

// Function updates game when player has WON the game
function setGameEndWin() {
    // Reveal result success
    game_result_success.classList.remove('hidden')
    // Reveal share button
    share_button.classList.remove('hidden')
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

// Function draws gameboard
async function drawGameBoard(animation=false) {
    
    var game_board = document.getElementById('game_board')

    // Empty gameboard & Write header
    game_board.innerHTML = `
      <div><p class="game-col-header"></p></div>
      <div><p class="game-col-header" id="game_board_header_set"></p></div>
      <div><p class="game-col-header" id="game_board_header_faction"></p></div>
      <div><p class="game-col-header" id="game_board_header_type"></p></div>
      <div><p class="game-col-header" id="game_board_header_cost"></p></div>
    `
    setLanguage()

    // Repopulate game board with empty rows
    for (let row=1; row <= 6; row++) {
        game_board.innerHTML += `
            <div id="game_tile_guess_${row}" class="game-board-cell guess">
                <img id="game_guess_card_icon_${row}">
                <img id="game_guess_card_${row}" src=${db.cardBack}>
            </div>
            <div id="game_tile_set_${row}" class="game-board-cell set">
                <img id="game_guess_set_${row}">
            </div>
            <div id="game_tile_faction_${row}" class="game-board-cell faction">
                <img id="game_guess_faction_${row}">
            </div>
            <div id="game_tile_type_${row}" class="game-board-cell type">
                <div class="container">
                    <p id="game_guess_type_${row}"></p>
                    <p id="game_guess_subtype_${row}"></p>
                </div>
            </div>
            <div id="game_tile_cost_${row}" class="game-board-cell cost">
                <div class="container">                        
                    <p id="game_guess_cost_hand_${row}" class="cost_value"></p>
                    <p id="game_guess_cost_reserve_${row}" class="cost_value"></p>
                    </div>
                </div>
            </div>
        `
    }

    // Update game board with guess data
    for (let row=1; row <= GAME.guesses.length; row++) {

        // Select the game board elements that need to update
        var tile_guess         = document.getElementById('game_tile_guess_'+row)
        var tile_set           = document.getElementById('game_tile_set_'+row)
        var tile_faction       = document.getElementById('game_tile_faction_'+row)
        var tile_type          = document.getElementById('game_tile_type_'+row)
        var tile_cost          = document.getElementById('game_tile_cost_'+row)
        var guess_card         = document.getElementById('game_guess_card_'+row)
        var guess_card_icon    = document.getElementById('game_guess_card_icon_'+row)
        var guess_set          = document.getElementById('game_guess_set_'+row)
        var guess_faction      = document.getElementById('game_guess_faction_'+row)
        var guess_type         = document.getElementById('game_guess_type_'+row)
        var guess_subtype      = document.getElementById('game_guess_subtype_'+row)
        var guess_cost_hand    = document.getElementById('game_guess_cost_hand_'+row)
        var guess_cost_reserve = document.getElementById('game_guess_cost_reserve_'+row)

        // Pull card information
        var card = getCardById(GAME.guesses[row-1])

        // Ditermine animation time
        if (row == GAME.guesses.length && animation) {
            var speed = 250
        } else {
            var speed = 0
        }

        // Add attribute for share text string
        tile_guess.share_emoji_string = ''

        // CARD -------------------------------------------------------------------
        await sleep(speed*1)
        if (GAME.language == 'fr') {
            guess_card.src = card.img_fr
        } else {
            guess_card.src = card.img_en
        }
        // if (card == TARGET_CARD) {
        //     tile_guess.classList.add('true')
        // } else {
        //     tile_guess.classList.add('false')
        // }
        // CARD ICON
        guess_card_icon.classList.add('icon')
        if (card == TARGET_CARD) {
            guess_card_icon.src = db.icons.true
            guess_card_icon.classList.add('true')
            tile_guess.share_emoji_string+="🟩"
        } else {
            guess_card_icon.src = db.icons.false
            guess_card_icon.classList.add('false')
            tile_guess.share_emoji_string+="🟥"
        }
        // SET --------------------------------------------------------------------
        await sleep(speed*2)
        if (GAME.language == 'fr') {
            guess_set.src = db.set['fr'][card.set]
        } else {
            guess_set.src = db.set['en'][card.set]
        }
        if (card.set == TARGET_CARD.set) {
            tile_set.classList.add('true')
            tile_guess.share_emoji_string+="🟩"
        } else {
            tile_set.classList.add('false')
            tile_guess.share_emoji_string+="🟥"
        }
        // FACTION ---------------------------------------------------------------
        await sleep(speed*3)
        guess_faction.src = db.faction[card.faction-1]
        if (card.faction == TARGET_CARD.faction) {
            tile_faction.classList.add('true')
            tile_guess.share_emoji_string+="🟩"
        } else {
            tile_faction.classList.add('false')
            tile_guess.share_emoji_string+="🟥"
        }
        // TYPE ------------------------------------------------------------------
        await sleep(speed*4)
        // TYPE
        if (GAME.language == 'fr') {
            guess_type.innerText = card.type_fr
        } else {
            guess_type.innerText = card.type_en
        }
        if (card.type_en == TARGET_CARD.type_en) {
            guess_type.classList.add('true')
        } else {
            guess_type.classList.add('false')
        }
        // SUBTYPE
        if (GAME.language == 'fr') {
            guess_subtype.innerText = card.subtype_fr
        } else {
            guess_subtype.innerText = card.subtype_en
        }
        guess_subtype.classList.add(checkSubtypes(card))
        // TYPE CONTAINER
        if (card.type_en == TARGET_CARD.type_en && card.subtype_en == TARGET_CARD.subtype_en) {
            tile_type.classList.add('true')
            tile_guess.share_emoji_string+="🟩"
        }
        else if (card.type_en != TARGET_CARD.type_en && card.subtype_en != TARGET_CARD.subtype_en) {
            tile_type.classList.add('false')
            tile_guess.share_emoji_string+="🟥"
        } 
        else {
            tile_type.classList.add('neither')
            tile_guess.share_emoji_string+="🟨"
        }
        // COST --------------------------------------------------------------
        await sleep(speed*5)
        // HAND COST
        var text = evalCardCost(card, 'hand')
        guess_cost_hand.innerHTML = text
        if (card.hand_cost == TARGET_CARD.hand_cost) {
            guess_cost_hand.classList.add('true')
        } else {
            guess_cost_hand.classList.add('false')
        }
        // RESERVE COST
        var text = evalCardCost(card, 'reserve')
        guess_cost_reserve.innerHTML = text
        if (card.reserve_cost == TARGET_CARD.reserve_cost) {
            guess_cost_reserve.classList.add('true')
        } else {
            guess_cost_reserve.classList.add('false')
        }
        // COST CONTAINER
        if (card.hand_cost == TARGET_CARD.hand_cost && card.reserve_cost == TARGET_CARD.reserve_cost) {
            tile_cost.classList.add('true')
            tile_guess.share_emoji_string+="🟩"
        }
        else if (card.hand_cost != TARGET_CARD.hand_cost && card.reserve_cost != TARGET_CARD.reserve_cost) {
            tile_cost.classList.add('false')
            tile_guess.share_emoji_string+="🟥"
        } 
        else {
            tile_cost.classList.add('neither')
            tile_guess.share_emoji_string+="🟨"
        }
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

// Function that builds card cost strings
function evalCardCost(card, cost) {
    const icon_hand = '<i class="fak fa-altered-h"></i>'
    const icon_reserve = '<i class="fak fa-altered-r"></i>'

    // Evaluate HAND cost
    if (cost == 'hand') {
        if (TARGET_CARD.hand_cost > card.hand_cost) {
            return `${icon_hand} ${card.hand_cost} ↑`
        }
        else if (TARGET_CARD.hand_cost < card.hand_cost) {
            return `${icon_hand} ${card.hand_cost} ↓`
        }
        else {
            return `${icon_hand} ${card.hand_cost}`
        }
    } 
    // Evaluate RESERVE cost
    else if (cost == 'reserve') {
        if (TARGET_CARD.reserve_cost > card.reserve_cost) {
            return `${icon_reserve} ${card.reserve_cost} ↑`
        }
        else if (TARGET_CARD.reserve_cost < card.reserve_cost) {
            return `${icon_reserve} ${card.reserve_cost} ↓`
        }
        else {
            return `${icon_reserve} ${card.reserve_cost}`
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
