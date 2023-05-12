const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

//WaWdiU4Yj3yZvWQC
//coffeeMaster



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8odccbh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coffeeCollection = client.db('coffeeDB').collection('coffee')

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);

        })
        app.get('/updatecoffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);

        })
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        });

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const updateCoffee = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const update = {
                $set: {
                    name: updateCoffee.name,
                    quantity: updateCoffee.quantity,
                    supplier: updateCoffee.supplier,
                    test: updateCoffee.test,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    imageUrl: updateCoffee.imageUrl
                }
            }

            const results = await coffeeCollection.updateOne(filter, update)
            res.send(results)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome');
})

app.listen(port, (req, res) => {
    console.log(`this port is listening in http://localhost:${port}`);
})
