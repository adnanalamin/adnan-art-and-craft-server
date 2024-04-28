const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.giatfyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const craftItems = client.db("artAndCraft").collection("Craft");
    const subcategoryItems = client.db("artAndCraft").collection("subcategory");

    app.get("/artandcraft", async (req, res) => {
      const cursor = craftItems.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/subcategoryProduct", async (req, res) => {
      const cursor = subcategoryItems.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/artandcraft/:email", async (req, res) => {
      const newemail = req.params.email;
      const query = { userEmail: newemail };
      const cursor = craftItems.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/subcategoryProduct/:subcategory", async (req, res) => {
      const newcategory = req.params.subcategory;
      console.log(newcategory);
      const query = { subcategory_Name: newcategory };
      const cursor = craftItems.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/allartandcraft/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await craftItems.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/artandcraft", async (req, res) => {
      const newCraft = req.body;
      const result = await craftItems.insertOne(newCraft);
      res.send(result);
    });

    app.put("/updateartandcraft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedData = req.body;
      const craftitems = {
        $set: {
          productName: updatedData.productName,
          subcategory_Name: updatedData.subcategory_Name,
          rating: updatedData.rating,
          price: updatedData.price,
          customaization: updatedData.customaization,
          stock: updatedData.stock,
          descriptions: updatedData.descriptions,
          photo: updatedData.photo,
          processingTime: updatedData.processingTime,
        },
      };
      const result = await craftItems.updateOne(filter, craftitems, options);
      res.send(result);
    });

    app.delete("/allartandcraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftItems.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.listen(port, () => {
  console.log("Server Site is Running");
});
