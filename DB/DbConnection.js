const mongodb =require('mongoose');

const URI = 'mongodb+srv://ido:idoo1231@cluster0.t1zmv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

module.exports = async () =>{
    await mongodb.connect(URI ,{useNewUrlParser:true , useUnifiedTopology:true , useFindAndModify: false});
    return mongodb;
}
