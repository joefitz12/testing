var tokenURL = "";

console.log("working");
$(document).on("click", function() {
    window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&redirect_uri=https://joefitz12.github.io/testing/");
})

tokenURL = window.location.href;


var URLArray = tokenURL.split("");
var first = URLArray.indexOf("=") + 1;
var last = URLArray.indexOf("&");
var token = tokenURL.substring(first, last);

if (!first){
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
        'Authorization': 'Bearer ' + token
        },
        success: function(response) {
        console.log(response);
        }
    });
}


