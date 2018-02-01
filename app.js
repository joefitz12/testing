console.log("working");
$(document).on("click", function() {
    window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&redirect_uri=https://joefitz12.github.io/testing/");
})

console.log("Url is", window.location.href);
var token = "";
//pull off the token

if (token) {

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
