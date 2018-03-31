const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongo_client = require('mongodb').MongoClient;
const mongo_url = "mongodb://localhost:27017/appointmets";
const collection = "appointments";
const endpoint = "/appointments";

// for parsing application/json
app.use(bodyParser.json());


app.get(endpoint, function (req, res) {
    try {
        mongo_client.connect(mongo_url, function (err, db) {
            if (err) throw err;
            db.db(collection).collection(collection).find({ "username": req.headers['x-consumer-username'] }).toArray(function (err, result) {
                if (err) throw err;

                db.close();
                if (result.length != 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ "result": "empty list" });
                }
            });
        });
    } catch (err) {
        res.status(500).json({ "error": "failed to get result" });
    }
});


app.post(endpoint, function (req, res) {
    var myobj = req.body;
    console.log(myobj)
    var status = true;
    try {
        mongo_client.connect(mongo_url, function (err, db) {
            if (err) throw err;
            db.db(collection).collection(collection).insertOne(myobj, function (err, res) {
                if (err) throw err;
                db.close();
            });
        });
    } catch (err) {
        console.log(err);
        status = false;
    }

    if (status) {
        res.status(200).send({ status: "true" });
    } else {
        res.status(500).send({ status: "false", error: "request failed!" });
    }
});


app.get('/', function (req, res) {
    return res.status(200).send({
        "service_name":"appointments",
        "version": "1.0"
    })
});


app.listen(3000, () => console.log('Service Appointments listening on port 3000!'))