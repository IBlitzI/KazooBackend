const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '8922c56d569e4f4092dc72fd39f06c9f';
const clientSecret = '04be1af763754b989a3632ba4b28de84';

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('Access token alındı.');
    spotifyApi.setAccessToken(data.body.access_token);
  }, function(err) {
    console.log('Access token alınamadı!', err);
  });


  const searchMusicByNameSpotify = async (query) => {
  spotifyApi.searchTracks(query)
    .then(function(data) {
      const tracks = data.body.tracks.items.slice(0, 5); 
      const result = tracks.map(track => {
        return {
          name: track.name, 
          artist: track.artists[0].name,
          genre: track.album.genres,
          id : track.id ,
          image : track.album.images[1].url
        };
      });
      return result
    }, function(err) {
      console.log('Müzik araması yapılamadı!', err);
    });
};

const searchMusicByNameSpotify5 = async (query) => {
    const  q  = query;
    if (!q) {
      return res.status(400).send('Missing query parameter');
    }
  
    try {
      const response = await spotifyApi.searchTracks(q, { limit: 5 });
      const tracks = response.body.tracks.items;
      const result = tracks.map(track => {
        return {
          name: track.name, 
          artist: track.artists[0].name,
          genre: track.album.genres,
          id : track.id ,
          image : track.album.images[1].url
        };
      });
      return result
    } catch (error) {
      console.error(error);
    }
  };

app.get('/artist-top-tracks', (req, res) => {
    const query = 'ibrahim tatlıses';
    spotifyApi.searchArtists(query)
      .then(function(data) {
        const artist = data.body.artists.items[0]; 
        const artistId = artist.id; 
        spotifyApi.getArtistTopTracks(artistId, 'TR')
          .then(function(data) {
            const tracks = data.body.tracks.slice(0, 5); 
            const result = tracks.map(track => {
              return {
                name: track.name,
                album: track.album.name,
                id : track.id 
              };
            });
            res.json(result);
          }, function(err) {
            console.log('Sanatçının şarkıları getirilemedi!', err);
            res.status(500).send('Sanatçının şarkıları getirilemedi!');
          });
      }, function(err) {
        console.log('Sanatçı bulunamadı!', err);
        res.status(404).send('Sanatçı bulunamadı!');
      });
  });


  app.get('/playlist-tracks', (req, res) => {
    const playlistId = '5bryiVKcKSLGMWuEqy5zS7'; 
    spotifyApi.getPlaylistTracks(playlistId)
      .then(function(data) {
        const tracks = data.body.items; 
        const result = tracks.map(track => {
          return {
            name: track.track.name, 
            artist: track.track.artists[0].name, 
            album: track.track.album.name, 
            id : track.id 

          };
        });
        res.json(result); 
      }, function(err) {
        console.log('Playlist şarkıları getirilemedi!', err);
        res.status(500).send('Playlist şarkıları getirilemedi!');
      });
  });
  


  module.exports = {
    searchMusicByNameSpotify,
    searchMusicByNameSpotify5
  };