// GAME SELECTORS
const game_search_input        = document.getElementById('game_search_input')
const game_search_autocomplete = document.getElementById('game_search_autocomplete')
const game_result              = document.getElementById('game_result')
const game_result_img          = document.getElementById('game_result_img')
const countdown                = document.getElementById('countdown')
// TEXT SELECTOR
const hero_text = document.getElementById('hero_text') 
const input_hint = document.getElementById('input_hint') 
const game_board_header_set = document.getElementById('game_board_header_set') 
const game_board_header_faction = document.getElementById('game_board_header_faction') 
const game_board_header_type = document.getElementById('game_board_header_type') 
const game_board_header_subtype = document.getElementById('game_board_header_subtype') 
const countdown_title = document.getElementById('countdown_title') 
const result_title_success = document.getElementById('result_title_success') 
const result_subtitle_success = document.getElementById('result_subtitle_success') 
const result_title_failure = document.getElementById('result_title_failure') 
const result_subtitle_failure = document.getElementById('result_subtitle_failure')
const footer_attribution_article = document.getElementById('footer_attribution_article')
const language_toggle_fr = document.getElementById('language_toggle_fr')
const language_toggle_en = document.getElementById('language_toggle_en')
// GAME VARIABLES
var TARGET_CARD          = cards[0]
var PLAYER_GUESS_CURRENT = 0
var PLAYER_GUESS_TOTAL   = 6
var LANGUAGE             = 'en'
// DATABASE SEARCH INDEX
const fuse_en = new Fuse(cards, {keys: ['name_en']})
const fuse_fr = new Fuse(cards, {keys: ['name_fr']})

function setLanguage() {
    // Update game text
    var copy = text[LANGUAGE]
    hero_text.innerText = copy.hero_text
    game_search_input.placeholder = copy.input_hint
    game_board_header_set.innerText = copy.game_board_header_set
    game_board_header_faction.innerText = copy.game_board_header_faction
    game_board_header_type.innerText = copy.game_board_header_type
    game_board_header_subtype.innerText = copy.game_board_header_subtype
    countdown_title.innerText = copy.countdown_title
    result_title_success.innerText = copy.result_title_success
    result_subtitle_success.innerHTML = copy.result_subtitle_success.replace('CARD_NAME', TARGET_CARD.name_en).replace('ATTEMPTS', PLAYER_GUESS_CURRENT)
    result_title_failure.innerText = copy.result_title_failure
    result_subtitle_failure.innerHTML = copy.result_subtitle_failure.replace('CARD_NAME', TARGET_CARD.name_en)
    footer_attribution_article.innerText = copy.footer_attribution_article

    // Update language toggle icon
    if (LANGUAGE=='fr') {
        language_toggle_en.classList.add('translucent')
        language_toggle_fr.classList.remove('translucent')
    } else {
        language_toggle_en.classList.remove('translucent')
        language_toggle_fr.classList.add('translucent')
    }
}

function toggleLanguage() {
    if (LANGUAGE == 'fr') {
        LANGUAGE = 'en'
    } else {
        LANGUAGE = 'fr'
    }
    setLanguage()
}

function player_search(self) {

    // Get player search query string
    var player_input = game_search_input.value

    // If player hasn't searched anything, hide menu
    if (player_input.length == 0) {
        game_search_autocomplete.classList.add('hidden')
        return
    }

    // Search cardlist
    if (LANGUAGE=='fr'){
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
            if (LANGUAGE == 'fr'){
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
            if (i>10) {
                break
            }
        }
    }
    // Reveal autocomplete menu showing results
    game_search_autocomplete.classList.remove('hidden')
}

// Handle callback when player clicks card to submit guess
game_search_autocomplete.addEventListener('click', function(e) {
    player_guess(e.target.card)
});

// This function handles when a player submits a guess
// It accepts the selected card and writes the values
// to the gameboard.
function player_guess(card) {

    // Clear inbox + hide autocomplete menu
    game_search_input.value = ""
    game_search_autocomplete.classList.add('hidden')

    PLAYER_GUESS_CURRENT += 1

    // Select the game board elements that need to update
    var tile_set     = document.getElementById('game_tile_set_'+PLAYER_GUESS_CURRENT)
    var tile_faction = document.getElementById('game_tile_faction_'+PLAYER_GUESS_CURRENT)
    var tile_type    = document.getElementById('game_tile_type_'+PLAYER_GUESS_CURRENT)
    var tile_subtype = document.getElementById('game_tile_subtype_'+PLAYER_GUESS_CURRENT)

    var guess_card    = document.getElementById('game_guess_card_'+PLAYER_GUESS_CURRENT)
    var guess_set     = document.getElementById('game_guess_set_'+PLAYER_GUESS_CURRENT)
    var guess_faction = document.getElementById('game_guess_faction_'+PLAYER_GUESS_CURRENT)
    var guess_type    = document.getElementById('game_guess_type_'+PLAYER_GUESS_CURRENT)
    var guess_subtype = document.getElementById('game_guess_subtype_'+PLAYER_GUESS_CURRENT)

    // Write guess card attributes to gameboard
    if (LANGUAGE=='fr') {
        guess_card.src = card.img_fr
        guess_set.src = set_img[card.set-1]
        guess_faction.src = faction_img[card.faction-1]
        guess_type.innerText = card.type_fr
        guess_subtype.innerText = card.subtype_fr
    } else {
        guess_card.src = card.img_en
        guess_set.src = set_img[card.set-1]
        guess_faction.src = faction_img[card.faction-1]
        guess_type.innerText = card.type_en
        guess_subtype.innerText = card.subtype_en
    }

    // Color tiles true or false
    if (card.set == TARGET_CARD.set) {
        tile_set.classList.add('true')
    } else {
        tile_set.classList.add('false')
    }
    if (card.faction == TARGET_CARD.faction) {
        tile_faction.classList.add('true')
    } else {
        tile_faction.classList.add('false')
    }
    if (card.type_en == TARGET_CARD.type_en) {
        tile_type.classList.add('true')
    } else {
        tile_type.classList.add('false')
    }
    if (card.subtype_en == TARGET_CARD.subtype_en) {
        tile_subtype.classList.add('true')
    } else {
        tile_subtype.classList.add('false')
    }

    // If player guessed the correct card
    // the game is over
    if (card == TARGET_CARD) {
        // Hide input and show result
        game_search_input.classList.add('hidden')
        countdown.classList.remove('hidden')
        game_result_success.classList.remove('hidden')

        // Add image
        if (LANGUAGE == 'fr') {
            game_result_img_success.src = TARGET_CARD.img_fr
        } else {
            game_result_img_success.src = TARGET_CARD.img_en
        }

        // Redraw text
        setLanguage()

        // Scroll to bottom
        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    // If player ran out of guess attempts
    // the game is over
    if (PLAYER_GUESS_CURRENT >= PLAYER_GUESS_TOTAL) {
        // Hide input and show result
        game_search_input.classList.add('hidden')
        countdown.classList.remove('hidden')
        game_result_failure.classList.remove('hidden')
        
        // Add image
        if (LANGUAGE == 'fr') {
            game_result_img_failure.src = TARGET_CARD.img_fr
        } else {
            game_result_img_failure.src = TARGET_CARD.img_en
        }

        // Redraw text
        setLanguage()

        // Scroll to bottom
        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }
}

setLanguage()
