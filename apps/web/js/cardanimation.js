// ----------------------------------------------------------------------------
// CALLBACKS TO HANDLE CARD ANIMATION
// ----------------------------------------------------------------------------
var result_card_specular_overlay = document.getElementById('result_card_specular_overlay')
var result_card_container = document.getElementById('result_card_container')
var result_card_foil_overlay = document.getElementById('result_card_foil_overlay')
var current_bounding_ref = null
var result_card_animation_skip = 0
var card_animation_type = 'none' // Values are 'none', 'normal' and 'foil'

// CALLBACK CARD ANIMATION START
function cardAnimationStart(ev) {
    if (card_animation_type == 'normal' || card_animation_type == 'foil') {
        current_bounding_ref = ev.currentTarget.getBoundingClientRect();
        ev.currentTarget.style.setProperty("touch-action", "none");
    }
    if (card_animation_type == 'foil') {
        ev.currentTarget.style.setProperty("scale", "102%");
        result_card_foil_overlay.classList.remove('hidden')
        result_card_foil_overlay.style.setProperty("filter", 'opacity(0.5)')
    }
    cardAnimationMove(ev)
}
// CALLBACK CARD ANIMATION STOP
function cardAnimationStop(ev) {
    if (card_animation_type == 'normal' || card_animation_type == 'foil') {
        ev.currentTarget.style.setProperty("touch-action", "auto");
        ev.currentTarget.style.setProperty("transform", "rotateX(0deg) rotateY(0deg)");
        ev.currentTarget.style.setProperty("scale", "100%");
        result_card_specular_overlay.style.setProperty('background-image', 'none')
    }
    if (card_animation_type == 'foil') {
        result_card_foil_overlay.style.setProperty("transform", 'none')
        result_card_foil_overlay.style.setProperty("filter", 'opacity(0.5)')
    }
    current_bounding_ref = null
}
// CALLBACK POINTER MOVE OVER CARD
function cardAnimationMove(ev) {
    const x = ev.clientX - current_bounding_ref.left;
    const y = ev.clientY - current_bounding_ref.top;
    const xPercentage = x / current_bounding_ref.width;
    const yPercentage = y / current_bounding_ref.height;
    const xRotation = (xPercentage - 0.5) * 20;
    const yRotation = (0.5 - yPercentage) * 20;

    if (card_animation_type == 'normal' || card_animation_type == 'foil') {
        ev.currentTarget.style.setProperty("transform", `rotateX(${yRotation}deg) rotateY(${xRotation}deg)`);    
        result_card_specular_overlay.style.setProperty('background-image', `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.6) 10%, transparent 80%)`)
    }
    if (card_animation_type == 'foil') {
        result_card_foil_overlay.style.setProperty("transform", `translate(${xPercentage*30}%, ${yPercentage*30}%) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`)
    }
}
// Prevent page scroll while card is selected
const element = document.getElementById('game_result_img')
element.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
}, { passive: false });
