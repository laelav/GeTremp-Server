module.exports = function (app, db) {
    var ObjectID = require('mongodb').ObjectID;

    /*
        const insertDocuments = (note, callback) => {
            const collection = db.collection('MyCollection');
            collection.insert(
              [note],
              (error, result) => {
                  if (error) return process.exit(1);
                  callback(result);
              }
            );
        };
        */

    //CREATE
    //Postman: POST:localhost:8000/register
    //Insert data into the DB.
    app.post('/register', (req, res) => {
        const note = { id: req.body.id, phoneNumber: req.body.phoneNumber,firstName: req.body.firstName,lastName: req.body.lastName,email: req.body.email,address: req.body.address,image: req.body.image};
        //const note = { text: req.body.body, title: req.body.title };
        console.log(req.body.id);
        console.log("Register in bound " + req.toString());
        db.collection('Clients').insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred in Post.' });
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




};