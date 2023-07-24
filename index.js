const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;



//middleware

app.use(cors())
app.use(express.json())



// mongo db codes 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v73g3gy.mongodb.net/?retryWrites=true&w=majority`;

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
        const myCollegeCollection = client.db("admissionCamp").collection("mycollege");
        const collegeDataCollection = client.db('admissionCamp').collection('collegeData')



        app.get('/collegeData', async (req, res) => {
            const cursor = collegeDataCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/collegeData/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await collegeDataCollection.findOne(query)
            res.send(result)
        })
        app.get('/collegeData/:email', async (req, res) => {
            const email = req.params.email
            const query = { Email: email }
            const result = await myCollegeCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/mycollege', async (req, res) => {
            const myClg = req.body;
            const result = await myCollegeCollection.insertOne(myClg);
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





























app.get('/', (req, res) => {
    res.send('admission is running ')
})

app.listen(port, () => {
    console.log(`admission server is running on the port ${port}`)
})