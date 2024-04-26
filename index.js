const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const app = express()



const port = process.env.PORT || 5000



app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.giatfyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const craftItems = client.db("artAndCraft").collection("Craft");

    app.get("/artandcraft", async (req, res) => {
        const cursor = craftItems.find();
        const result = await cursor.toArray();
        res.send(result);
      });


    app.post("/artandcraft", async (req, res) => {
        const newCraft = req.body;
        const result = await craftItems.insertOne(newCraft);
        res.send(result);
      });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is Running')
})

app.listen(port, () => {
    console.log('Server Site is Running')
})
