// ----------------------------------------------------------------------------
// CALLBACKS TO HANDLE CARD ANIMATION
// ----------------------------------------------------------------------------
var result_card_specular_overlay = document.getElementById('result_card_specular_overlay')
var result_card_container = document.getElementById('result_card_container')
var current_bounding_ref = null
var result_card_animation_skip = 0

// CALLBACK CARD ANIMATION START
function cardAnimationStart(ev) {
    current_bounding_ref = ev.currentTarget.getBoundingClientRect();
    ev.currentTarget.style.setProperty("touch-action", "none");
    ev.currentTarget.style.setProperty("scale", "101%");
    cardAnimationMove(ev)
}
// CALLBACK CARD ANIMATION STOP
function cardAnimationStop(ev) {
    ev.currentTarget.style.setProperty("touch-action", "auto");
    ev.currentTarget.style.setProperty("transform", "rotateX(0deg) rotateY(0deg)");
    ev.currentTarget.style.setProperty("scale", "100%");
    result_card_specular_overlay.style.setProperty('background-image', 'none')
    current_bounding_ref = null

}
// CALLBACK POINTER MOVE OVER CARD
function cardAnimationMove(ev) {
    // For performance, don't redraw on every event
    // Only draw every third event
    if (result_card_animation_skip < 2 ) {
        result_card_animation_skip += 1
        return
    }
    const x = ev.clientX - current_bounding_ref.left;
    const y = ev.clientY - current_bounding_ref.top;
    const xPercentage = x / current_bounding_ref.width;
    const yPercentage = y / current_bounding_ref.height;
    const xRotation = (xPercentage - 0.5) * 20;
    const yRotation = (0.5 - yPercentage) * 20;
    ev.currentTarget.style.setProperty("transform", `rotateX(${yRotation}deg) rotateY(${xRotation}deg)`);
    result_card_specular_overlay.style.setProperty('background-image', `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 10%, transparent 80%)`)
    result_card_animation_skip = 0
}
// Prevent page scroll while card is selected
const element = document.getElementById('game_result_img')
element.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
}, { passive: false });
