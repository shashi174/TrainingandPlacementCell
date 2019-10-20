const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Company = require('./models/Company')

var app = express();

app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true}));

// var jsonParser = bodyParser.json();

mongoose.connect('mongodb://priyam:priyam123@ds046667.mlab.com:46667/priyam-gupta', {useNewUrlParser: true, useUnifiedTopology: true} ,() => {
    console.log('DB Connected')
});

app.set('view engine', 'hbs');
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/addcompany', (req, res) => {
    res.render('addcompany');
})

app.post('/addcompany', (req, res) => {
    var newComp = new Company(req.body);
    console.log(req.body, newComp)
    newComp.save().then(comp => {
        console.log(comp);
        res.send('Ok')
    }).catch(e => res.send(e));    
})

app.listen(3000, () => {
    console.log('Port Up');
})