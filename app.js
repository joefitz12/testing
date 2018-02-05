var followArray = [];
var artistArr = [];
var tokenURL = "";

$("#login").on("click", function(){
    window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&scope=user-follow-read&redirect_uri=https://codisteinborn.github.io/ConcertApp/");
});
    
tokenURL = window.location.href;

var URLArray = tokenURL.split("");
var first = URLArray.indexOf("=") + 1;
var last = URLArray.indexOf("&");
var token = tokenURL.substring(first, last);

var artistRender = function(){
    $("#artistList").empty();
    for (i = 0; i < followArray.length; i++){
        var newDiv = $("<p>");
        newDiv.addClass("artistDiv");
        newDiv.attr("data-artist",followArray[i]);
        newDiv.text(followArray[i]);
        newDiv.on("click", function(){
            if (artistArr.indexOf($(this).attr("data-artist")) < 0){
                artistArr.push($(this).attr("data-artist"));
                if (localStorage.getItem("selectedArtistArray")){
                    var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
                    storedArtists.push($(this).attr("data-artist"));
                    localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
                }
                else {
                    var storedArtists = [];
                    storedArtists.push($(this).attr("data-artist"));
                    localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
                }
                $(this).addClass("selectedArtist");
            }
            else {
                var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
                storedArtists.splice(artistArr.indexOf($(this).attr("data-artist")), 1);
                localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
                artistArr.splice(artistArr.indexOf($(this).attr("data-artist")), 1);
                $(this).removeClass("selectedArtist");
            }
        });
        if (localStorage.getItem("selectedArtistArray")){
            var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
            for (j = 0; j < storedArtists.length; j++){
                if (newDiv.attr("data-artist") === storedArtists[j]){
                    artistArr.push(storedArtists[j]);
                    newDiv.addClass("selectedArtist");
                }
            }
            artistClick();
        }
        $("#artistList").append(newDiv);
    }
}

if (last > 0){
    $.ajax({
        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        headers: {
        'Authorization': 'Bearer ' + token
        },

        success: function(response) {

            console.log("response", response);

            var followList = function (){
                for (i = 0; i < response.artists.items.length; i++){
                followArray.push(response.artists.items[i].name);
                }
            }

            followList();
            artistRender();
        }
    });
    
    if (localStorage.getItem("follow")){

        tokenURL = window.location.href;

        var URLArray = tokenURL.split("");
        var first = URLArray.indexOf("=") + 1;
        var last = URLArray.indexOf("&");
        var token = tokenURL.substring(first, last);
        var spotifyID = "";
        var artist = localStorage.getItem("follow");

        followArray.push(artist);

        $.ajax({
            url: 'https://api.spotify.com/v1/search?q=' + artist + '&type=artist',
            headers: {
            'Authorization': 'Bearer ' + token
            },

            success: function(response) {
                spotifyID = response.artists.items[0].id;

                $.ajax({
                    method: "PUT",
                    url: 'https://api.spotify.com/v1/me/following?type=artist&ids=' + spotifyID,
                    headers: {
                    'Authorization': 'Bearer ' + token
                    },
            
                    success: function(response) {

                        localStorage.removeItem("follow");

                        artistRender();

                    }
                });
            }
        });

    };
    
};


$("#followButton").on("click", function(){
    var artist = String($("#followArtist").val());
    localStorage.setItem("follow", artist);
    if (localStorage.getItem("selectedArtistArray")){
        var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
        storedArtists.push(artist);
        localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
    }
    else {
        var storedArtists = [];
        storedArtists.push(artist);
        localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
    }
    window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&scope=user-follow-modify&redirect_uri=https://codisteinborn.github.io/ConcertApp/");
});

$("#clearButton").on("click",function(){
    artistArr = [];
    localStorage.removeItem("selectedArtistArray");
    $(".selectedArtist").removeClass("selectedArtist");
    $("#list").empty();
});