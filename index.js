
const express = require('express')
const app = express()

const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5080



require("dotenv").config();

app.use(cors());
app.use(express.json());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywwhy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db('service-provider').collection("service-collection");
  const reviewCollection = client.db('service-provider').collection("review-collection");
  // console.log('working')




  app.get("/addReview", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addReview", (req, res) => {
    const newReview = req.body;

    reviewCollection.insertOne(newReview).then((result) => {
      console.log('inserted one review',result.insertedCount)
      res.send(result.insertedCount > 0);
    });
  });




  app.get("/addService", (req, res) => {
    serviceCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addService", (req, res) => {
    const newService = req.body;

    serviceCollection.insertOne(newService).then((result) => {
      console.log('inserted one service',result.insertedCount)
      res.send(result.insertedCount > 0);
    });
  });

  // perform actions on the collection object
  // client.close();
});





app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
