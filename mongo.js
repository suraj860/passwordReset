
const{MongoClient} = require ("mongodb")

const client = new MongoClient(process.env.MONGODB_URL)

module.exports={
    db : null,
    data : null,
    async connect (){
        await client.connect()
        console.log("connected to -", process.env.MONGODB_URL)

        this.db = client.db(process.env.MONGODB_NAME);
        console.log("connected to database-" , process.env.MONGODB_NAME)

        this.data = this.db.collection("data")
    }

}