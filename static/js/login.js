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

function connectReunion() {
    var redirect_uri = window.location.origin+'/auth'
    window.location.href = 'https://auth.altered.re/realms/players/protocol/openid-connect/auth?client_id=Alteredle&response_type=code&scope=openid+profile&redirect_uri='+redirect_uri
}

drawPage()
