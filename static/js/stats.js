// ----------------------------------------------------------------------------
// FUNCTIONS TO HANDLE STATS API
// ----------------------------------------------------------------------------

function submit_player_result(){
    fetch("https://api.alteredle.com/submit/player_result", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
            'puzzle_id': random.randint(1,50),
            'timestamp': datetime.now().isoformat(),
            'result': result,
            'score': score,
            'guesses': guesses,
            'board': board
        })
    }).then(res => {
        console.log("Request complete! response:", res);
    });
}

function submit_player_share(){
    fetch("https://api.alteredle.com/submit/player_share", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
            'puzzle_id': random.randint(1,50),
            'timestamp': datetime.now().isoformat()
        })
    }).then(res => {
        console.log("Request complete! response:", res);
    });
}

function get_puzzle_stats(puzzle_id){
    fetch(`https://api.alteredle.com/stats/${puzzle_id}`)
    .then(response => response.json())
    .then(data => {
        data.forEach((data) => {
        renderNavBar(data)
        
        })
    })
}
