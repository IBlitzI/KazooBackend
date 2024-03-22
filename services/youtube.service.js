const {youtube} = require('@googleapis/youtube');
require("dotenv").config();
const youtubes = youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const searchMusicByName = async (query) => {
    const res = await youtubes.search.list({
      part: 'snippet',
      type: 'video',
      q: query,
      maxResults :1
    });
  
    return res.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      videoUrl : `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  };
  
  const searchMusicByName5 = async (query) => {
    try {
      const res = await youtubes.search.list({
        part: 'snippet',
        type: 'video',
        q: query,
        maxResults: 5
      });
      
      if (
        res &&
        res.data &&
        res.data.items &&
        res.data.items.length > 0
      ) {
        // Yalnızca video türünde olan sonuçları işle
        const videoResults = res.data.items.filter(item => item.id.kind === 'youtube#video');
        console.log(videoResults)
        return videoResults.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.default.url,
          videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));
      } else {
        throw new Error('Şarkı bulunamadı');
      }
    } catch (error) {
      console.error('Hata:', error);
      throw error;
    }
  };
  

  const searchMusicById = async (id) => {
    const res = await youtubes.videos.list({
      part: 'id,snippet',
      maxResults :1,
      id : id
    });
  
    return res.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      videoUrl : `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  };

  
  async function getPlaylistItems(playlistId) {
    const res = await youtubes.playlistItems.list({
      part: 'snippet',
      playlistId: playlistId,
      maxResults: 50
    });
  
    const songTitles = res.data.items.map(item => {
    const { title, thumbnails, resourceId } = item.snippet;
    const videoId =resourceId.videoId
    return {
      title: title,
      thumbnailUrl: thumbnails.default.url,
      videoId: videoId,
      videoUrl : `https://www.youtube.com/watch?v=${videoId}`
    }
  });
    return songTitles;
  }
  


  module.exports = {
    searchMusicByName,
    searchMusicByName5,
    searchMusicById,
    getPlaylistItems
  };