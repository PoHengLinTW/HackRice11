require('dotenv').config()
const mongoose = require('mongoose');
const express = require("express");
const cors = require('cors')
const app = express();
const PORT = process.env.PORT;

app.use(cors())

app.use(express.json()); 
const handleError = (err) => {
    console.error(err);
}
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var groupSchema = new Schema({
    groupId: {type: String, unique: true},
    name: String,
    members: [{ type: Schema.Types.ObjectId, ref: 'People' }]
})

var peopleSchema = new Schema({
  email: {type: String, unique: true},
  name: String,
  profile: {
      data: Buffer,
      contentType: String
  },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  favorite: [{ type: Schema.Types.ObjectId, ref: 'People'}]
});

var Group  = mongoose.model('Group', groupSchema);
var People = mongoose.model('People', peopleSchema);

let groupA = new Group({groupId: "djaopshwqioe", name: "COMP504"});
let henry = new People({email:"Po-Heng.Lin@rice.edu", name: "Henry Lin", groups: groupA._id});
let wudi = new People({email:"woodyenemy2@gmail.com", name: "Wu Di", groups: groupA._id});
let yunSun = new People({email:"ys97@rice.edu", name: "Yun Sun", groups: groupA._id});
let yuhanyang = new People({email:"miondeks@gmail.com", name: "Yuhan Yang", groups: groupA._id});

groupA.members.push(henry._id);
groupA.members.push(wudi._id);
groupA.members.push(yunSun._id);
groupA.members.push(yuhanyang._id);


groupA.save((err)=>{
    if (err) return handleError(err);
});
henry.save(err => {
    if (err) return handleError(err);
});
wudi.save(err => {
    if (err) return handleError(err);
});
yunSun.save(err => {
    if (err) return handleError(err);
});
yuhanyang.save(err => {
    if (err) return handleError(err);
});

app.get('/api', (req, res) => {
    res.send("hello world");
})

app.get('/getUser/email/:email', (req, res) => {
    const key = req.params['email'];
    People
    .findOne({"email": key}, (err, person) => {
        if (err) handleError(err);
        res.send(JSON.stringify(person));
    })
})

app.get('/getGroup/id/:groupId', (req, res) => {
    const key = req.params['groupId'];
    Group
    .findOne({"groupId": key}, (err, group) => {
        if (err) handleError(err);
        res.send(JSON.stringify(group));
    })
})

app.get('/findGroups/email/:email', (req, res) => {
    const key = req.params['email'];
    People
    .findOne({"email": key})
    .populate("groups")
    .exec((err, person) => {
        if (err) return handleError(err);
        const ret = [];
        if (person) {
            person.groups.forEach(group => {
                ret.push({
                    name: group.name,
                    id: group.groupId,
                })
            })
        }
        res.send(JSON.stringify(ret))
    })
})

app.get('/findFavorite/email/:email', (req, res) => {
    const key = req.params['email'];
    People
    .findOne({"email": key})
    .populate("favorite")
    .exec( (err, person) => {
        if (err) return handleError(err);
        const ret = [];
        if (person) {
            console.log(person)
            person.favorite.forEach(per => {
                console.log(per);
                ret.push({
                    name: per.name,
                    email: per.email,
                })
            })
        }
        res.send(JSON.stringify(ret))
    })
})

app.get('/findUserInGroup/id/:id', (req, res) => {
    const key = req.params['id'];
    Group
    .findOne({"groupId": key})
    .populate("members")
    .exec((err, group) => {
        if (err) return handleError(err);
        const ret = [];
        console.log(group)
        if (group) {
            group.members.forEach(member => {
                ret.push({
                    name: member.name,
                    email: member.email,
                })
            })
        }
        res.send(JSON.stringify(ret))
    })
})

app.post('/addUserToGroup', async (req, res) => {
    const key = req.body.email
    const groupId = req.body.groupId
    console.log(key, groupId);
    People.findOne({"email":key}, (err, person) => {
        if (err) {
            res.send("Fail");
            return handleError(err);
        }
        Group.findOne({"groupId":groupId}, (err, group) => {
            if (err) {
                res.send("Fail");
                return handleError(err);
            }
            if (person && group) {
                group.members.push(person._id);
                group.save(err => handleError(err));
                person.groups.push(group._id);
                person.save(err => handleError(err));
            }
            res.send("Success");
        })
    })
    return "Success";
})

app.post('/addUser', async (req, res) => {
    const key = req.body.email
    const name = req.body.name
    People.findOne({"email":key}, (err, person) => {
        if (err || person) {
            res.send("Fail");
            return handleError(err);
        }
        person = new People({"email": key, "name": name});
        person.save(err => handleError(err));
        res.send("Success");
    })
})

app.post('/addGroup', async (req, res) => {
    const name = req.body.name
    const groupId = req.body.groupId
    console.log(name, groupId);
    Group.findOne({"groupId":groupId}, (err, group) => {
        if (err || group || groupId === undefined || name === undefined) {
            res.send("Fail");
            return handleError(err);
        }
        group = new Group({"groupId": groupId, "name": name});
        group.save(err => handleError(err));
        res.send("Success");
    })
})

app.post('/addUserFavorite/', (req, res) => {
    const key = req.body.email
    const favorite = req.body.favorite
    console.log(req.body)
    People
    .findOne({'email':key})
    .exec((err, person) => {
        if (err) {
            res.send("Fail");
            return handleError(err);
        }
        if (person) {
            console.log(person);
            People
            .findOne({'email': favorite})
            .exec((err, person2) => {
                if (err) {
                    res.send("Fail");
                    return handleError(err);
                }
                if (person2) {
                    console.log(person2);
                    person.favorite.push(person2._id);
                    person.save(err => handleError(err));
                    person2.save(err => handleError(err));
                    res.send("Successful")
                }
                else res.send("Fail")
            })
        }
        else
            res.send("Fail");
    })
})

app.listen(PORT, (err)=>{
    if (err) return handleError(err);
    console.log("MongoDB end point server listens on " + PORT);
})