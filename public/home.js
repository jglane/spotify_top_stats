var CLIENT_ID;
var CLIENT_SECRET;

document.addEventListener("readystatechange", async (event) => {
    await fetch(`${window.location.origin}/env`)
    .then(response => response.json())
    .then(env_vars => {
        CLIENT_ID = env_vars.CLIENT_ID;
        CLIENT_SECRET = env_vars.CLIENT_SECRET;
    });
    
    if (sessionStorage.getItem("ACCESS_TOKEN") == null || sessionStorage.getItem("ACCESS_TOKEN") == 'undefined') {
        code = document.URL.match(/code=([^&]+)/)[1];
        if (code) {
            await fetch(`https://accounts.spotify.com/api/token?code=${code}&grant_type=authorization_code&redirect_uri=${window.location.origin}/artists?time_range=long_term&client_secret=${CLIENT_SECRET}`, {
                method: "POST",
                headers: {
                    Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => response.json())
            .then(data => {
                sessionStorage.setItem("ACCESS_TOKEN", data.access_token);
                sessionStorage.setItem("REFRESH_TOKEN", data.refresh_token);
                sessionStorage.setItem('expires_at', data.expires_in * 1000 + Date.now());
            });
        } else {
            console.error('Authorization code needed');
        }
    } else if (sessionStorage.getItem('expires_at') < Date.now()) {
        await fetch(`https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${sessionStorage.getItem('REFRESH_TOKEN')}`, {
            method: "POST",
            headers: {
                Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => response.json())
        .then(data => {
            sessionStorage.setItem("ACCESS_TOKEN", data.access_token);
            sessionStorage.setItem('expires_at', data.expires_in * 1000 + Date.now());
        });
    }

    const list = document.querySelector('ol');
    if (list.classList.contains('artists')) {
        await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${list.id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('ACCESS_TOKEN')
            }
        }).then(response => response.json())
        .then(data => {
            const top_artists = data.items;
            for (let i = 0; i < top_artists.length; i++) {
                const li_artist = document.createElement('li');
                
                const img_artist = document.createElement('img');
                img_artist.src = top_artists[i].images[2].url;
                li_artist.appendChild(img_artist);

                const p_artist_name = document.createElement('p');
                p_artist_name.appendChild(document.createTextNode(top_artists[i].name));
                li_artist.appendChild(p_artist_name);

                list.appendChild(li_artist);
            }
            console.log(data)
        });
    } else if (list.classList.contains('tracks')) {
        await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${list.id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('ACCESS_TOKEN')
            }
        }).then(response => response.json()).then(data => {
            const top_tracks = data.items;
            for (let i = 0; i < top_tracks.length; i++) {
                const li_track = document.createElement('li');
                
                const img_track = document.createElement('img');
                img_track.src = top_tracks[i].album.images[0].url;
                li_track.appendChild(img_track);

                const p_track_name = document.createElement('p');
                p_track_name.appendChild(document.createTextNode(top_tracks[i].name));
                li_track.appendChild(p_track_name);

                const p_track_artist = document.createElement('p');
                p_track_artist.appendChild(document.createTextNode(top_tracks[i].artists[0].name));
                p_track_artist.style.marginLeft = 'auto';
                p_track_artist.style.marginRight = '1em';
                li_track.appendChild(p_track_artist);

                list.appendChild(li_track);
            }
            console.log(data)
        });
    }

    selectArtists = document.querySelector('select.artists');
    selectArtists.onchange = () => {
        if (selectArtists.value == 'long_term') {
            window.location.href = '/artists?time_range=long_term';
        } else if (selectArtists.value == 'medium_term') {
            window.location.href = '/artists?time_range=medium_term';
        } else if (selectArtists.value == 'short_term') {
            window.location.href = '/artists?time_range=short_term';
        }
    }

    selectTracks = document.querySelector('select.tracks');
    selectTracks.onchange = () => {
        if (selectTracks.value == 'long_term') {
            window.location.href = '/tracks?time_range=long_term';
        } else if (selectTracks.value == 'medium_term') {
            window.location.href = '/tracks?time_range=medium_term';
        } else if (selectTracks.value == 'short_term') {
            window.location.href = '/tracks?time_range=short_term';
        }
    }
});