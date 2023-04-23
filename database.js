const mongoose = require('mongoose')
require('dotenv').config()

// const mongoURI = "mongodb+srv://gofood:mygofood@cluster0.bklfcks.mongodb.net/goFood?retryWrites=true&w=majority";
const mongoURI = process.env.DATABASE
// const mongoURI = "mongodb://gofood:mygofood@ac-co59rgk-shard-00-00.bklfcks.mongodb.net:27017,ac-co59rgk-shard-00-01.bklfcks.mongodb.net:27017,ac-co59rgk-shard-00-02.bklfcks.mongodb.net:27017/goFood?ssl=true&replicaSet=atlas-hq1m9l-shard-0&authSource=admin&retryWrites=true&w=majority"


const connectToMongo = () => {
    mongoose.connect(mongoURI)
        .then(async() => {
            console.log("connected to mongo successfully")
            const fetch_data = mongoose.connection.db.collection("food_item");
            const data = await fetch_data.find({}).toArray();
            // console.log(data)
            global.food_items = data ;
            // console.log(global.food_items)

            const food_category =  mongoose.connection.db.collection("food_category")
            const catData = await food_category.find({}).toArray();
            global.food_category = catData;

            // console.log(catData)

        })
        .catch(() => { console.log("Error") });
}


module.exports = connectToMongo;