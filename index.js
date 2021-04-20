
const express = require('express')
const app = express()

const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
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
  const bookingCollection = client.db('service-provider').collection("booking-collection");
  const adminCollection = client.db('service-provider').collection("admin-collection");
  // console.log('working')


  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email} )
        .toArray((err, isAdmin) => {
          console.log(email)
            res.send(isAdmin.length > 0);
        })
})


app.delete('/delete/:id',(req ,res) =>{
  const id = ObjectID(req.params.id)
  serviceCollection.findOneAndDelete({_id:id})
  .then(result =>{
    console.log( result )
    res.send(result.value)
    
  })

})




// add data for admin collection
  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;

    adminCollection .insertOne(newAdmin).then((result) => {
      console.log('inserted one admin',result.insertedCount)
      res.send(result.insertedCount > 0);
    });
  });


  // Get Service from Database using id
  app.get("/addService/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    // console.log(id)
    serviceCollection .find({ _id: id }).toArray((err, service) => {
      res.send(service);
    });
  });



// get ui Data review collection
  app.get("/getReview", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  
// add Data review collection
  app.post("/addReview", (req, res) => {
    const newReview = req.body;

    reviewCollection.insertOne(newReview).then((result) => {
      console.log('inserted one review',result.insertedCount)
      res.send(result.insertedCount > 0);
    });
  });

      // get data for all booking
      app.get("/getBooking", (req, res) => {
        bookingCollection.find().toArray((err, document) => {
          res.send(document);
        });
      });


        // get data from booking collection
    app.get("/addBooking", (req, res) => {
      // console.log(req.query.email)
      bookingCollection.find({ email: req.query.email })
        .toArray((err, document) => {
          res.send(document);
        });
    });


 


  // booking collection
  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;

    bookingCollection.insertOne(newBooking).then((result) => {
      console.log('inserted one booking',result.insertedCount)
      res.send(result.insertedCount > 0);
    });
  });



// add Data Service collection
  app.get("/getService", (req, res) => {
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
