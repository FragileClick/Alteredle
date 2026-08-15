// https://www.w3schools.com/howto/howto_js_countdown.asp

// Set the date we're counting down to
const resetTimestamp = new Date();
resetTimestamp.setDate(resetTimestamp.getDate() + 1);
resetTimestamp.setHours(0, 0, 0, 0);

function updateCountdown() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = resetTimestamp - now;

  // Time calculations for days, hours, minutes and seconds
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("countdown_timer").innerText = hours+"h "+minutes+"m "+seconds+"s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "0h 0m 0s";
  }
}

// Update the count down every 1 second
var x = setInterval(updateCountdown, 1000);
