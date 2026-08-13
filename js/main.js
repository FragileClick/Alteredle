// import Fuse from './fuse.js'


// SELECTORS
const game_search_input        = document.getElementById('game_search_input')
const game_search_autocomplete = document.getElementById('game_search_autocomplete')

var TARGET_CARD     = 'ALT_CORE_B_BR_04_R1'
var PLAYER_ATTEMPTS = 0
var TOTAL_ATTEMPTS  = 6
var LANGUAGE        = 'EN'

const fuse = new Fuse(cards, {keys: ['name_en']})

function player_search(self) {

    var player_input = game_search_input.value

    // Search for results based on player input
    var search_results = fuse.search(player_input)

    if (player_input.length == 0) {
        game_search_autocomplete.classList.add('hidden')
        return
    }

    // Empty autocomplete menu
    game_search_autocomplete.innerHTML = ""

    if (search_results.length > 0) {

        // If the query returns search results
        // add result items to the autocomplete menu
        for (let i = 0; i < search_results.length; i++) {

            const card = search_results[i].item
            const li = document.createElement("li")
            const text = document.createElement("span")
            const img = document.createElement("img")

            // Make first li "selected"
            if (i==0) {
                li.classList.add('selected')
            }

            li.id = card.id
            li.card = card
            text.textContent = card.name_en
            img.src = "https://cdn.alteredcore.org/cards/en/CORE/"+card.id+".webp"

            li.appendChild(img)
            li.appendChild(text)

            game_search_autocomplete.appendChild(li)

            if (i>10) {
                break
            }
            
        }

    } else {
        // If no search results match the query
        // append an item saying nothing was found
        const li = document.createElement("li")
        li.textContent = "No results found."
        game_search_autocomplete.appendChild(li)
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

    console.log(card)

}