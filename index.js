const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 6060;
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vki6z.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('connection err', err);
    const bookCollection = client.db("webbook").collection("storebook");
    //   console.log('Database connected successfully');


    // app.get('/orders', (req, res) => {
    //     bookCollection.find()
    //         .toArray((err, items) => {
    //             // console.log('from database',items);
    //             res.send(items);
    //         })
    // })


    // app.post('/orderHistory', (req, res) => {
    //     const orderHistory = req.body;
    //     bookCollection.insertOne(orderHistory)
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })

    //     console.log(orderHistory);
    // })


    app.get('/books', (req, res) => {
        bookCollection.find()
            .toArray((err, items) => {
                // console.log('from database',items);
                res.send(items);
            })
    })



    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log('adding new book: ', newBook);
        bookCollection.insertOne(newBook)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.delete('deleteBook/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        bookCollection.findOneAndDelete({ _id: id })
            .then(document => res.send(!!document.value))
    })

    //   client.close();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


