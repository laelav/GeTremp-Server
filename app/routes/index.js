const noteRoutes = require('./note_routes');
var assert = require('assert');
var crypto = require('crypto');
var algorithm = 'aes-256-cbc';
var inputEncoding = 'utf8';
var outputEncoding = 'hex';
var key = 'GeTrempApplicationAfeka123456789';
var vector = 'myVector12345678'
var mypassword = 'ThisIsTheOnlyGeTrempApplicationPassword';


function encrypt(text){
    var cipher = crypto.createCipheriv(algorithm,
        new Buffer(key), new Buffer(vector));
    var crypted = cipher.update(text, inputEncoding, outputEncoding);
    crypted += cipher.final(outputEncoding);
    return crypted;
}
function decrypt(text){
    var decipher = crypto.createDecipheriv(algorithm,
        new Buffer(key), new Buffer(vector));
    try {
        var dec = decipher.update(text, outputEncoding, inputEncoding);
        dec += decipher.final(inputEncoding)
        return dec
    }catch (e) {
        console.log("bad string for crypto");
        return "";
    }
}

module.exports = function (app, db) {
    app.use(function(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(403).json({ error: 'No credentials sent!' });
        }
        else{
            var encryptedoutput = encrypt(mypassword);
           // console.log(encryptedoutput);

           // console.log(req.headers.authorization);
            var decryptedoutput = decrypt(req.headers.authorization);
            //console.log(decryptedoutput);
            if (decryptedoutput === mypassword)
                next();
            else{
                console.log("wrong authorization key!")
                return res.status(403).json({ error: 'wrong authorization key!' });
            }



        //    next();
        }





    });
    noteRoutes(app, db);
    // Other route groups could go here, in the future
};