const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Company = require('./models/Company')

var app = express();

app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// var jsonParser = bodyParser.json();

mongoose.connect('mongodb+srv://shashi174:enriquekant@cluster0-6iqud.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, () => {

    console.log('DB Connected')
});

app.set('view engine', 'hbs');
app.use(express.static('views'));

app.get('/', (req, res) => { // Renders Home Page
    res.render('index');
})

app.get('/addcompany', (req, res) => { // Company Form Page    
    res.render('addcompany');
})

app.post('/addcompany', (req, res) => { // POST Request to save data of Company
    var newComp = new Company(req.body);
    console.log(req.body, newComp)
    newComp.save().then(comp => {
        console.log("helllllo");
        console.log(comp);
        res.redirect('/')
    }).catch(e => res.send(e));
    // Todo: Send notification to all students
})

app.get('/placements', (req, res) => { // Renders Placements Page
    let companyData = [];
    Company.find({}, (err, doc) => {
        if (!err) {
            companyData = [...doc];
            cosnsole.log(companyData);

        } else {
            res.render('placements');

        }

    });
})

app.get('/internships', (req, res) => { // Renders Internships Page
    res.render('internships');
})

app.listen(3000, () => {
    console.log('Port Up');
})