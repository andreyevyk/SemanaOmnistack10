const axios = require('axios');
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/ParseStringAsArray')
//index, show, store, update, destroy

module.exports = {
   async index(request,response){
      const devs = await Dev.find();

      return response.json(devs);
   },

   async store(request,response) {
      const { github_username, techs, latitude, longitude } = request.body;

      let dev = await Dev.findOne({github_username});
      if(!dev){

         const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
         
         const {name = login , avatar_url , bio } =  apiResponse.data;
      
         const techsArray = parseStringAsArray(techs);
      
         const location = {
            type: 'Point',
            coordinates:[longitude, latitude]
         };
      
         dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
         });
      }
      return response.json(dev);
   },
   async update(request,response){
      const { github_username } = request.query;
      const { name, bio } = request.body;

      const dev = await Dev.findOneAndUpdate({github_username},{ $set: {name,bio} }, {new: true});

      return response.json(dev);

   },
   async destroy(request,response){
      const { github_username } = request.query;
      
      const dev = await Dev.findOne({github_username});

      if(!dev)
         response.json('Não encontrado');
      
      await dev.deleteOne();           
      response.json('Removido com sucesso')   
   }
};