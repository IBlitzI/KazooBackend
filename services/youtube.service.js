const {youtube} = require('@googleapis/youtube');
require("dotenv").config();
const youtubes = youtube({
  version: 'v3',
  auth: '',
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
      videoUrl : `https://www.youtube.com/watch?v=${item.id.videoId};`
    }));
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
      videoUrl : `https://www.youtube.com/watch?v=${item.id.videoId};`
    }));
  };

  
  async function getMusicResults(id) {
    const results = await searchMusicById(id);
    console.log(results[0].title); // API'den dönen sonuçları burada kullanabilirsiniz
  }
//   async function getMusicResultsName(id) {
//     const results = await searchMusicByName(id);
//     console.log(results); // API'den dönen sonuçları burada kullanabilirsiniz
//   }
//  getMusicResults('MRkra0nVkYk');
//   getMusicResultsName('masal gibi')
  


  module.exports = {
    searchMusicByName,
    searchMusicById
  };