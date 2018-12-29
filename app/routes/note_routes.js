module.exports = function (app, db) {
    var ObjectID = require('mongodb').ObjectID;

    //CREATE
    //Postman: POST:localhost:8000/register
    //Insert data into the DB.
    app.post('/register', (req, res) => {
        const note = { id: req.body.id, phoneNumber: req.body.phoneNumber,firstName: req.body.firstName,lastName: req.body.lastName,email: req.body.email,address: req.body.address,image: req.body.image};
        //const note = { text: req.body.body, title: req.body.title };
        //console.log(req.body.id);
        console.log("Register in progress " +req.body.id);
        db.collection('Clients').insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred in Post /register.' });
            } else {
                //Send back to front.
                res.send(result.ops[0]);
            }
        });
    });

    app.post('/addgroup', (req, res) => {
        const note = { name: req.body.name, image: req.body.image};
        console.log("Register in progress " + req.body.name);
        db.createCollection(req.body.name + "-Routine");
        db.createCollection(req.body.name + "-Temp");
        db.collection('AppGroups').insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred in Post /addgroup.' });
            } else {
                //Send back to front.
                console.log(result.ops[0]._id);
                res.send(result.ops[0]);
            }
        });
    });

    app.post('/addroutinedrive', (req, res) => {
        const note = {userid: req.body.userid, name: req.body.name, begincity: req.body.begincity, endcity: req.body.endcity, day: req.body.day, time: req.body.time, openslots: req.body.openslots, totalslots: req.body.totalslots};
        console.log("Add Routine Drive in progress " + req.body.group + ": " +req.body.name + ", " +  req.body.begincity + " -> " + req.body.endcity);

        db.collection(req.body.group + "-Routine").insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred in Post /addroutinedrive.' });
            } else {
                //Send back to front.
                console.log(result.ops[0]._id);
                res.send(result.ops[0]);
            }
        });
    });



    app.get('/getallgroups', (req, res) => {
        console.log("Get All Groups in progress");

        db.collection('AppGroups').find({}).toArray(function(err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred in Get /getallgroups.' });
            } else {
                //Send back to front.
                console.log(result);
                res.send(result);
            }
        });
    });


    app.get('/getallroutinedrives/:group', (req, res) => {
        const group = req.params.group;

        console.log("Get All Routine Drives in progress " + group);

        db.collection(group + '-Routine').find({}).toArray(function(err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred in Get /getallroutinedrives.' });
            } else {
                //Send back to front.
                console.log(result);
                res.send(result);
            }
        });
    });

    //-----------------------------------------------------------------------------------------------------------------------------------------------------
/* HTTP Methods examples:


    //CREATE
    //Postman: POST:localhost:8000/register
    //Insert data into the DB.
    app.post('/register', (req, res) => {
        const note = { text: req.body.body, title: req.body.title };
        //console.log(req.body.id);
        console.log("Register in progress " +req.body.id);
        db.collection('Clients').insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred in Post /register.' });
            } else {
                //Send back to front.
                res.send(result.ops[0]);
            }
        });
    });


    //READ
    //Postman: GET:localhost:8000/notes/5c0a57c4ceb48c3f804d58f9
    //Search for item's id in DB and sending back to front.
    app.get('/notes/:id', (req, res) => {
        //getting the id from the url.
        const id = req.params.id;

        //making a Json with "ObjectID".
        const details = { '_id': new ObjectID(id) };

        //search the collection "MyCollection" for var details and put result in item.
        db.collection('MyCollection').findOne(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred in Get-id' });
            } else {
                //Send back to front.
                res.send(item);
            }
        });
    });

    //DELETE
    //Postman: DELETE:localhost:8000/notes/5c0a57c4ceb48c3f804d58f9
    //Search for item's id in DB and deleting it.
    app.delete('/notes/:id', (req, res) => {
        //getting the id from the url.
        const id = req.params.id;
        //making a Json with "ObjectID".
        const details = { '_id': new ObjectID(id) };
        //search the collection "MyCollection" for var details and delete the item.
        db.collection('MyCollection').remove(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred in delete-id' });
            } else {
                //Send back to front.
                res.send('Note ' + id + ' deleted!');
            }
        });
    });


    //UPDADTE
    //Postman: PUT:localhost:8000/notes/5c0a57c4ceb48c3f804d58f9
    //Search for item's id in DB and updating it.
    app.put('/notes/:id', (req, res) => {
        //getting the id from the url.
        const id = req.params.id;
        //making a Json with "ObjectID".
        const details = { '_id': new ObjectID(id) };
        //the note with the changes from the front.
        const note = { text: req.body.body, title: req.body.title };
        //search the collection "MyCollection" for var details and update it.
        db.collection('MyCollection').update(details, note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                //Send back to front.
                res.send(note);
            }
        });
    });


*/

};