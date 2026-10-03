var GAME = loadGame()

function drawPage() {
    // Update the langauge toggle button
    updateLangaugeToggle()

    // Draw page text in selected language
    var copy = db.text[GAME.language]
    document.getElementById('hero_text').innerText = copy.login_hero_text
    document.getElementById('login_button').innerText = copy.login_button
    document.getElementById('login_description').innerHTML = copy.login_description
    document.getElementById('login_create_account').innerText = copy.login_create_account
    document.getElementById('footer_attribution_article').innerText = copy.footer_attribution_article
}

drawPage()
