const clientId = "d2650ce81f54479ba3422d7448032088";
const redirectURI = "nh_first_react_app.surge.sh";
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = "", expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
    }
  },

  search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artist,
            album: track.album.name,
            uri: track.uri
        }));
    });
    
  },

  savePlayList(name, trackURIs) {
      if (!name || !trackURIs.length) {
          return;
      }

      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}`};
      let userId;

      return fetch('https://api.spotify.com/v1/me', {
        headers: headers}
        ).then(response => response.json() 
      ).then(jsonResponse => {
          userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers, 
            method: 'POST', 
            body: JSON.stringify({ name: name})
          })
        .then(response => response.json()
      ).then(jsonResponse => {
          const playListId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`, {
            headers: headers, 
            method: 'POST', 
            body: JSON.stringify({uris: trackURIs})
          });
      });
    });
  }
};

export default Spotify;
