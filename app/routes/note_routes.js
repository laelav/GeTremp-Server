module.exports = function (app, db) {
    var ObjectID = require('mongodb').ObjectID;
    var util = require('util');
    var iconv = require('iconv-lite');
    const utf8 = require('utf8');


    //CREATE
    //Postman: POST:localhost:8000/register
    //Insert data into the DB.
    app.post('/register', (req, res) => {
        const note = {
            id: req.body.id,
            phoneNumber: req.body.phoneNumber,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            image: req.body.image,
            groups: req.body.groups
        };
        console.log("Register in progress " + req.body.id);
        db.collection('Clients').insert(note, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred in Post /register.'});
            } else {
                //Send back to front.
                res.send(result.ops[0]);
            }
        });
    });

    app.post('/addgroup', (req, res) => {
        var groupname = req.body.name.toLowerCase();
        const note = {name: groupname, image: req.body.image};
        console.log("Register in progress " + groupname);
        db.createCollection(groupname + "-Routine");
        db.createCollection(groupname + "-Temp");
        db.collection('AppGroups').insert(note, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred in Post /addgroup.'});
            } else {
                //Send back to front.
                console.log(result.ops[0].id);
                res.send(result.ops[0]);
            }
        });
    });

    app.post('/addroutinedrive', (req, res) => {
        const note = {
            userid: req.body.userid,
            name: req.body.name,
            begincity: req.body.begincity,
            endcity: req.body.endcity,
            day: req.body.day,
            time: req.body.time,
            openslots: req.body.openslots,
            totalslots: req.body.totalslots
        };
        console.log("Add Routine Drive in progress " + req.body.group + ": " + req.body.name + ", " + req.body.begincity + " -> " + req.body.endcity + " by userid " + req.body.userid);


        const check = {'id': req.body.userid};
        db.collection('Clients').findOne(check, function (err, result) {
            if (err) throw err;
            let thegroups = result.groups;

            var hasGroupFlag = 0;
            var GroupExistFlag = 0;
            for (var i = 0; i < thegroups.length; i++) {
                if (thegroups[i] == req.body.group.toLowerCase())
                    hasGroupFlag = 1;
            }


            db.collection('AppGroups').find({}).toArray(function (err, result) {
                if (err) {
                    res.send({'error': 'An error has occurred in Get /getallgroups.'});
                } else {
                    //Send back to front.
                    for (var i = 0; i < result.length; i++) {
                        if (result[i] == req.body.group.toLowerCase())
                            GroupExistFlag = 1;
                    }

                    if (hasGroupFlag == 1 && GroupExistFlag == 1) {
                        db.collection(req.body.group.toLowerCase() + "-Routine").insert(note, (err, result) => {
                            if (err) {
                                res.send({'error': 'An error has occurred in Post /addroutinedrive.'});
                            } else {
                                //Send back to front.
                                console.log(result.ops[0]._id + " The drive has been added successfully!");
                                res.send(result.ops[0]._id + " The drive has been added successfully!");
                            }
                        });
                    } else {
                        console.log("The user id:" + req.body.userid + " name: " + req.body.name + " is not a part of the group '" + req.body.group + "'! or the group doesn't exists");
                        res.send("The user id:" + req.body.userid + " name: " + req.body.name + " is not a part of the group '" + req.body.group + "'! or the group doesn't exists");
                    }

                }
            });

        });
    });

    app.post('/addtempdrive', (req, res) => {
        const note = {
            userid: req.body.userid,
            name: req.body.name,
            begincity: req.body.begincity,
            endcity: req.body.endcity,
            day: req.body.day,
            time: req.body.time,
            openslots: req.body.openslots,
            totalslots: req.body.totalslots,
            drivemembers: []
        };
        console.log("Add Temp Drive in progress " + req.body.group + ": " + req.body.name + ", " + req.body.begincity + " -> " + req.body.endcity + " by userid " + req.body.userid);


        const check = {'id': req.body.userid};
        db.collection('Clients').findOne(check, function (err, result) {
            if (err) throw err;
            let thegroups = result.groups;

            var hasGroupFlag = 0;
            var GroupExistFlag = 0;
            for (var i = 0; i < thegroups.length; i++) {
                if (thegroups[i] == req.body.group.toLowerCase())
                    hasGroupFlag = 1;
            }
            db.collection('AppGroups').find({}).toArray(function (err, result) {
                if (err) {
                    res.send({'error': 'An error has occurred in Get /getallgroups.'});
                } else {
                    //Send back to front.
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name == req.body.group.toLowerCase()) {
                            console.log(result[i].name + " + " + req.body.group.toLowerCase())
                            GroupExistFlag = 1;
                        }

                    }
                    if (hasGroupFlag == 1 && GroupExistFlag == 1) {
                        db.collection(req.body.group.toLowerCase() + "-Temp").insert(note, (err, result) => {
                            if (err) {
                                res.send({'error': 'An error has occurred in Post /addtempdrive.'});
                            } else {
                                //Send back to front.
                                console.log(result.ops[0]._id + " The drive has been added successfully!");
                                res.send(result.ops[0]._id + " The drive has been added successfully!");
                            }
                        });
                    } else {
                        console.log("The user id:" + req.body.userid + " name: " + req.body.name + " is not a part of the group '" + req.body.group + "'! or the group doesn't exists");
                        res.send("The user id:" + req.body.userid + " name: " + req.body.name + " is not a part of the group '" + req.body.group + "'! or the group doesn't exists");
                    }

                }
            });

        });
    });


    app.get('/getallgroups', (req, res) => {
        console.log("Get All Groups in progress");

        db.collection('AppGroups').find({}).toArray(function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred in Get /getallgroups.'});
            } else {
                //Send back to front.
                console.log(result);
                res.send(result);
            }
        });
    });


    app.get('/getuserbyid/:id', (req, res) => {
        const id = req.params.id;
        console.log("Get User by ID in progress " + id);
        const check = {'id': id};

        db.collection('Clients').findOne(check, function (err, result) {
            if (err) throw err;
            else
                res.send(result);
        });
    });


    app.get('/getallroutinedrives/:id/:group', (req, res) => {
        const id = req.params.id;
        const group = req.params.group.toLowerCase();

        console.log("Get All Routine Drives in progress " + group + " by userid " + id);

        const check = {'id': id};
        db.collection('Clients').findOne(check, function (err, result) {
            if (err) throw err;
            let thegroups = result.groups;
            var flag = 0;

            for (var i = 0; i < thegroups.length; i++) {
                if (thegroups[i] == group)
                    flag = 1;
            }

            if (flag == 1) {
                db.collection(group + '-Routine').find({}).toArray(function (err, result) {
                    if (err) {
                        res.send({'error': 'An error has occurred in Get /getallroutinedrives.'});
                    } else {
                        //Send back to front.
                        console.log("All routine drives in group " + group + " requested by userid " + id + " sent successfully to front!");
                        res.send(result);
                    }
                });

            } else {
                console.log("The user id:" + id + " is not a part of the group '" + group + "'!");
                res.send("The user id:" + id + " is not a part of the group '" + group + "'!");
            }
        });


    });

    app.get('/getalltempdrives/:id/:group', (req, res) => {
        const id = req.params.id;
        const group = req.params.group.toLowerCase();

        console.log("Get All Temp Drives in progress " + group + " by userid " + id);

        const check = {'id': id};
        db.collection('Clients').findOne(check, function (err, result) {
            if (err) throw err;
            let thegroups = result.groups;
            var flag = 0;

            for (var i = 0; i < thegroups.length; i++) {
                if (thegroups[i] == group)
                    flag = 1;
            }

            if (flag == 1) {
                db.collection(group + '-Temp').find({}).toArray(function (err, result) {
                    if (err) {
                        res.send({'error': 'An error has occurred in Get /getalltempdrives.'});
                    } else {
                        //Send back to front.
                        console.log("All temp drives in group " + group + " requested by userid " + id + " sent successfully to front!");
                        res.send(result);
                    }
                });

            } else {
                console.log("The user id:" + id + " is not a part of the group '" + group + "'!");
                res.send("The user id:" + id + " is not a part of the group '" + group + "'!");
            }
        });
    });


    app.get('/getallroutinedrivesbyadmin/:group', (req, res) => {
        const group = req.params.group.toLowerCase();

        console.log("Get All Routine Drives By Admin in progress " + group);
        db.collection(group + '-Routine').find({}).toArray(function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred in Get /getallroutinedrivesbyadmin.'});
            } else {
                //Send back to front.
                console.log("All routine drives in group " + group + " requested by admin sent successfully to front!");
                res.send(result);
            }
        });
    });

    app.get('/getalltempdrivesbyadmin/:group', (req, res) => {
        const group = req.params.group.toLowerCase();

        console.log("Get All Temp Drives By Admin in progress " + group);
        db.collection(group + '-Temp').find({}).toArray(function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred in Get /getalltempdrivesbyadmin.'});
            } else {
                //Send back to front.
                console.log("All temp drives in group " + group + " requested by admin sent successfully to front!");
                res.send(result);
            }
        });
    });


    app.delete('/deleteroutinedrive/:group/:userid/:driveid', (req, res) => {
        //getting the id from the url.
        const group = req.params.group.toLowerCase();
        const userid = req.params.userid;
        const driveid = req.params.driveid;
        //making a Json with "ObjectID".
        const details = {'_id': new ObjectID(driveid)};


        db.collection(group + '-Routine').find({}).toArray(function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred in Get /getallroutinedrivesbyadmin in deleteroutinedrive.'});
            } else {
                //Send back to front.
                var ifDriveExistFlag = 0;
                for (var i = 0; i < result.length; i++) {
                    if (driveid == result[i]._id) {
                        ifDriveExistFlag = 1;
                        if (userid == result[i].userid) {
                            db.collection(group + '-Routine').remove(details, (err, item) => {
                                if (err) {
                                    res.send({'error': 'An error has occurred in deleteroutinedrive'});
                                } else {
                                    //Send back to front.
                                    console.log('Drive ' + driveid + ' deleted!');
                                    res.send('Drive ' + driveid + ' deleted!');
                                }
                            });
                        } else {
                            res.send("The drive " + driveid + " hasn't been opened by the user " + userid);
                        }
                    }
                }
            }
        });
    });

    app.delete('/deletetempdrive/:group/:userid/:driveid', (req, res) => {
        //getting the id from the url.
        const group = req.params.group.toLowerCase();
        const userid = req.params.userid;
        const driveid = req.params.driveid;
        //making a Json with "ObjectID".
        const details = {'_id': new ObjectID(driveid)};


        db.collection(group + '-Temp').find({}).toArray(function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred in Get /deletetempdrive in deletempdrive.'});
            } else {
                //Send back to front.
                var ifDriveExistFlag = 0;
                for (var i = 0; i < result.length; i++) {
                    if (driveid == result[i]._id) {
                        ifDriveExistFlag = 1;
                        if (userid == result[i].userid) {
                            db.collection(group + '-Temp').remove(details, (err, item) => {
                                if (err) {
                                    res.send({'error': 'An error has occurred in deletetempdrive'});
                                } else {
                                    //Send back to front.
                                    console.log('Drive ' + driveid + ' deleted!');
                                    res.send('Drive ' + driveid + ' deleted!');
                                }
                            });
                        } else {
                            res.send("The drive " + driveid + " hasn't been opened by the user " + userid);
                        }
                    }
                }
            }
        });
    });

    app.put('/joinroutinedrive/:group/:userid/:driveid', (req, res) => {
        const group = req.params.group.toLowerCase();
        const userid = req.params.userid;
        const driveid = req.params.driveid;
        const check = {'id': userid};

        db.collection('Clients').findOne(check, function (err, userresult) {
            if (err) throw err;
            var tempgroups = userresult.groups;
            if (tempgroups == "" || tempgroups === null || tempgroups === undefined)
                tempgroups = [];

            var output = tempgroups.filter(function (item) {
                return item == group;
            });
            if (output.includes(group)) {
                const driverdetails = {
                    'id': userid,
                    'firstname': userresult.firstName,
                    'lastname': userresult.lastName
                };


                const details = {'_id': new ObjectID(driveid)};

                db.collection(group + '-Routine').findOne(details, function (err, driveresult) {
                    if (err) throw err;

                    var tempdrivemembers = driveresult.drivemembers;


                    if (tempdrivemembers == "" || tempdrivemembers === null || tempdrivemembers === undefined)
                        tempdrivemembers = [];


                    var membersoutput = tempdrivemembers.filter(function (item) {
                        return item.id == userid;
                    });


                    if (!JSON.stringify(membersoutput).includes(userid)) {
                        if (driveresult.openslots < 1) {
                            res.send("There are no open slots in drive id: " + driveid);
                            console.log("The open slots is: " + driveresult.openslots);
                            console.log("There are no open slots in drive id: " + driveid);
                        } else {
                            var updateddrive = driveresult;
                            updateddrive.openslots = parseInt(updateddrive.openslots - 1).toString();
                            var updateddrivemembers = updateddrive.drivemembers;
                            if (updateddrivemembers === undefined)
                                updateddrivemembers = [];
                            updateddrivemembers.push(driverdetails);
                            updateddrive.drivemembers = updateddrivemembers;


                            db.collection(group + '-Routine').update(details, updateddrive, (err, result) => {
                                if (err) {
                                    res.send({'error': 'An error has occurred'});
                                } else {
                                    //Send back to front.
                                    res.send(updateddrive);
                                    console.log(updateddrive);
                                }
                            });

                        }
                    } else {
                        res.send("The user id " + userid + " is already in the drive " + driveid);
                        console.log("The user id " + userid + " is already in the drive " + driveid);
                    }


                });
            } else {
                res.send("The user id " + userid + " isn't part of the group " + group);
                console.log("The user id " + userid + " isn't part of the group " + group);
            }


        })


    });

    app.put('/jointempdrive/:group/:userid/:driveid', (req, res) => {
        const group = req.params.group.toLowerCase();
        const userid = req.params.userid;
        const driveid = req.params.driveid;
        const check = {'id': userid};

        db.collection('Clients').findOne(check, function (err, userresult) {
            if (err) throw err;

            var tempgroups = userresult.groups;
            if (tempgroups == "" || tempgroups === null || tempgroups === undefined)
                tempgroups = [];

            var output = tempgroups.filter(function (item) {
                return item == group;
            });
            if (output.includes(group)) {
                const driverdetails = {
                    'id': userid,
                    'firstname': userresult.firstName,
                    'lastname': userresult.lastName
                };


                const details = {'_id': new ObjectID(driveid)};

                db.collection(group + '-Temp').findOne(details, function (err, driveresult) {
                    if (err) throw err;
                    var tempdrivemembers = driveresult.drivemembers;


                    if (tempdrivemembers == "" || tempdrivemembers === null || tempdrivemembers === undefined)
                        tempdrivemembers = [];


                    var membersoutput = tempdrivemembers.filter(function (item) {
                        return item.id == userid;
                    });


                    if (!JSON.stringify(membersoutput).includes(userid)) {
                        if (driveresult.openslots < 1) {
                            res.send("There are no open slots in drive id: " + driveid);
                            console.log("The open slots is: " + driveresult.openslots);
                            console.log("There are no open slots in drive id: " + driveid);
                        } else {
                            var updateddrive = driveresult;
                            updateddrive.openslots = parseInt(updateddrive.openslots - 1).toString();
                            var updateddrivemembers = updateddrive.drivemembers;
                            if (updateddrivemembers === undefined)
                                updateddrivemembers = [];
                            updateddrivemembers.push(driverdetails);
                            updateddrive.drivemembers = updateddrivemembers;


                            db.collection(group + '-Temp').update(details, updateddrive, (err, result) => {
                                if (err) {
                                    res.send({'error': 'An error has occurred'});
                                } else {
                                    //Send back to front.
                                    res.send(updateddrive);
                                    console.log(updateddrive);
                                }
                            });

                        }
                    } else {
                        res.send("The user id " + userid + " is already in the drive " + driveid);
                        console.log("The user id " + userid + " is already in the drive " + driveid);
                    }


                });
            } else {
                res.send("The user id " + userid + " isn't part of the group " + group);
                console.log("The user id " + userid + " isn't part of the group " + group);
            }


        })


    });


    app.put('/leaveroutinedrive/:group/:userid/:driveid', (req, res) => {
        const group = req.params.group.toLowerCase();
        const userid = req.params.userid;
        const driveid = req.params.driveid;
        const check = {'id': userid};

        db.collection('Clients').findOne(check, function (err, userresult) {
            if (err) throw err;
            var tempgroups = userresult.groups;
            if (tempgroups == "" || tempgroups === null || tempgroups === undefined)
                tempgroups = [];

            var output = tempgroups.filter(function (item) {
                return item == group;
            });
            if (output.includes(group)) {
                const driverdetails = {
                    'id': userid,
                    'firstname': userresult.firstName,
                    'lastname': userresult.lastName
                };

                const details = {'_id': new ObjectID(driveid)};

                db.collection(group + '-Routine').findOne(details, function (err, driveresult) {
                    if (err) throw err;
                    var tempdrivemembers = driveresult.drivemembers;


                    if (tempdrivemembers == "" || tempdrivemembers === null || tempdrivemembers === undefined)
                        tempdrivemembers = [];


                    var membersoutput = tempdrivemembers.filter(function (item) {
                        return item.id == userid;
                    });

                    if (!JSON.stringify(membersoutput).includes(userid)) {
                        res.send("The user " + userid + " is not in drive id: " + driveid);
                        console.log("The user " + userid + " is not in drive id: " + driveid);
                    } else {
                        var updateddrive = driveresult;
                        updateddrive.openslots = (parseInt(updateddrive.openslots) + 1).toString();
                        var updateddrivemembers = updateddrive.drivemembers;
                        if (updateddrivemembers === undefined)
                            updateddrivemembers = [];

                        updateddrivemembers = updateddrivemembers.filter(function (obj) {
                            return obj.id !== userid;
                        });

                        updateddrive.drivemembers = updateddrivemembers;


                        db.collection(group + '-Routine').update(details, updateddrive, (err, result) => {
                            if (err) {
                                res.send({'error': 'An error has occurred'});
                            } else {
                                //Send back to front.
                                res.send(updateddrive);
                                console.log(updateddrive);
                            }
                        });

                    }


                });
            } else {
                res.send("The user id " + userid + " isn't part of the group " + group);
                console.log("The user id " + userid + " isn't part of the group " + group);
            }


        })


    });

    app.put('/leavetempdrive/:group/:userid/:driveid', (req, res) => {
        const group = req.params.group.toLowerCase();
        const userid = req.params.userid;
        const driveid = req.params.driveid;
        const check = {'id': userid};

        db.collection('Clients').findOne(check, function (err, userresult) {
            if (err) throw err;
            var tempgroups = userresult.groups;
            if (tempgroups == "" || tempgroups === null || tempgroups === undefined)
                tempgroups = [];

            var output = tempgroups.filter(function (item) {
                return item == group;
            });
            if (output.includes(group)) {
                const driverdetails = {
                    'id': userid,
                    'firstname': userresult.firstName,
                    'lastname': userresult.lastName
                };


                const details = {'_id': new ObjectID(driveid)};

                db.collection(group + '-Temp').findOne(details, function (err, driveresult) {
                    if (err) throw err;
                    var tempdrivemembers = driveresult.drivemembers;


                    if (tempdrivemembers == "" || tempdrivemembers === null || tempdrivemembers === undefined)
                        tempdrivemembers = [];


                    var membersoutput = tempdrivemembers.filter(function (item) {
                        return item.id == userid;
                    });


                    if (!JSON.stringify(membersoutput).includes(userid)) {
                        res.send("The user " + userid + " is not in drive id: " + driveid);
                        console.log("The user " + userid + " is not in drive id: " + driveid);
                    } else {
                        var updateddrive = driveresult;
                        updateddrive.openslots = (parseInt(updateddrive.openslots) + 1).toString();
                        var updateddrivemembers = updateddrive.drivemembers;
                        if (updateddrivemembers === undefined)
                            updateddrivemembers = [];

                        updateddrivemembers = updateddrivemembers.filter(function (obj) {
                            return obj.id !== userid;
                        });

                        updateddrive.drivemembers = updateddrivemembers;


                        db.collection(group + '-Temp').update(details, updateddrive, (err, result) => {
                            if (err) {
                                res.send({'error': 'An error has occurred'});
                            } else {
                                //Send back to front.
                                res.send(updateddrive);
                                console.log(updateddrive);
                            }
                        });

                    }


                });
            } else {
                res.send("The user id " + userid + " isn't part of the group " + group);
                console.log("The user id " + userid + " isn't part of the group " + group);
            }


        })


    });

    app.post('/searchroutinedrive/:group/:userid', (req, res) => {

        const group = req.params.group.toLowerCase();
        const userid = req.params.userid;
        const textforsearch = req.body.textforsearch;
        console.log(textforsearch);

        const check = {'id': userid};

        db.collection('Clients').findOne(check, function (err, userresult) {
            if (err) throw err;

            var tempgroups = userresult.groups;
            if (tempgroups == "" || tempgroups === null || tempgroups === undefined)
                tempgroups = [];

            var output = tempgroups.filter(function (item) {
                return item == group;
            });
            if (output.includes(group)) {
                const checkbeginciry = {'begincity': textforsearch};
                const checkendciry = {'endcity': textforsearch};
                db.collection(group + '-Routine').find(checkbeginciry).toArray(function (err, begincityresult) {
                    if (err) throw err;

                    db.collection(group + '-Routine').find(checkendciry).toArray(function (err, endcityresult) {
                        if (err) throw err;
                        var output = begincityresult.concat(endcityresult);
                        res.send(output);
                        console.log(output);
                    });
                });
            } else {
                res.send("The user id " + userid + " isn't part of the group " + group);
                console.log("The user id " + userid + " isn't part of the group " + group);
            }
        });

    });

    app.post('/searchtempdrive/:group/:userid', (req, res) => {

        const group = req.params.group.toLowerCase();
        const userid = req.params.userid;
        const textforsearch = req.body.textforsearch;
        console.log(textforsearch);

        const check = {'id': userid};

        db.collection('Clients').findOne(check, function (err, userresult) {
            if (err) throw err;

            var tempgroups = userresult.groups;
            if (tempgroups == "" || tempgroups === null || tempgroups === undefined)
                tempgroups = [];

            var output = tempgroups.filter(function (item) {
                return item == group;
            });
            if (output.includes(group)) {
                const checkbeginciry = {'begincity': textforsearch};
                const checkendciry = {'endcity': textforsearch};
                db.collection(group + '-Temp').find(checkbeginciry).toArray(function (err, begincityresult) {
                    if (err) throw err;

                    db.collection(group + '-Temp').find(checkendciry).toArray(function (err, endcityresult) {
                        if (err) throw err;
                        var output = begincityresult.concat(endcityresult);
                        res.send(output);
                        console.log(output);
                    });
                });
            } else {
                res.send("The user id " + userid + " isn't part of the group " + group);
                console.log("The user id " + userid + " isn't part of the group " + group);
            }
        });

    });


};
