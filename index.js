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
        // await client.connect();
        const collegeReview = client.db("admissionCamp").collection("reviews");
        const collegeResearchPaper = client.db("admissionCamp").collection("researchPaper");
        const myCollegeCollection = client.db("admissionCamp").collection("mycollege");
        const collegeDataCollection = client.db('admissionCamp').collection('collegeData')


        app.post('/reviews', async (req, res) => {
            const myReview = req.body;
            const result = await collegeReview.insertOne(myReview);

            // Get all reviews after insertion
            const reviews = await collegeReview.find().toArray();
            res.send(reviews);
        });

        // College Review
        app.get('/reviews', async (req, res) => {
            const cursor = collegeReview.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // Research paper
        app.get('/research_paper', async (req, res) => {
            const cursor = collegeResearchPaper.find()
            const result = await cursor.toArray()
            res.send(result)
        })



        // College data for show all
        app.get('/collegeData', async (req, res) => {
            const cursor = collegeDataCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // college data show id based detailed 

        app.get('/collegeData/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await collegeDataCollection.findOne(query)
            res.send(result)
        })


        app.get('/mycollege/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
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