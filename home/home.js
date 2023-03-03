const CLIENT_ID = "0b3237ec461e491ba223031ab73c4d23";
const CLIENT_SECRET = "10c2186409784cd080e71e884b564fa5";

document.addEventListener("readystatechange", async (event) => {
    if (sessionStorage.getItem("ACCESS_TOKEN") == null || sessionStorage.getItem("ACCESS_TOKEN") == 'undefined') {
        code = document.URL.match(/code=([^&]+)/)[1];
        if (code) {
            await fetch(`https://accounts.spotify.com/api/token?code=${code}&grant_type=authorization_code&redirect_uri=${window.location.origin}/home&client_secret=${CLIENT_SECRET}`, {
                method: "POST",
                headers: {
                    Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => response.json())
            .then(data => {
                sessionStorage.setItem("ACCESS_TOKEN", data.access_token);
                sessionStorage.setItem("REFRESH_TOKEN", data.refresh_token);
            });
        } else {
            console.error('Authorization code needed')
        }
    }

    await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term`, {
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('ACCESS_TOKEN')
        }
    }).then(response => response.json()).then(data => {
        const top_artists = data.items;
        for (let i = 0; i < top_artists.length; i++) {
            const li_artist = document.createElement('li');
            
            const img_artist = document.createElement('img');
            img_artist.src = top_artists[i].images[2].url;
            li_artist.appendChild(img_artist);

            p_artist_name = document.createElement('p');
            p_artist_name.appendChild(document.createTextNode(top_artists[i].name));
            li_artist.appendChild(p_artist_name);

            document.querySelector('ol.artists').appendChild(li_artist);
        }
	    console.log(data)
    });

    await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term`, {
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('ACCESS_TOKEN')
        }
    }).then(response => response.json()).then(data => {
        const top_tracks = data.items.map(elem => [elem.name, elem.popularity])
        for (let i = 0; i < top_tracks.length; i++) {
            const li_track_name = document.createElement('li')
            li_track_name.appendChild(document.createTextNode(top_tracks[i][0]));
            document.querySelector('ol.tracks').appendChild(li_track_name);
        }
        console.log(data)
    });
});