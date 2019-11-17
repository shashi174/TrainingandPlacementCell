const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const passport = require('passport');
const Company = require('./models/Company')

const {sendEmail} = require('./middlewares/emailService')

var app = express();

app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true}));

// var jsonParser = bodyParser.json();

require('./config/passport')(passport);

mongoose.connect('mongodb://localhost:27017/priyam-gupta', {useNewUrlParser: true, useUnifiedTopology: true} ,() => {
    console.log('DB Connected')
});

app.set('view engine', 'ejs');
app.use(express.static('views'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',require('./routes/auth'));

app.get('/', (req, res) => {                       // Renders Home Page
    res.render('index');
})

app.get('/addcompany', (req, res) => {              // Company Form Page    
    res.render('addcompany');
})

app.post('/addcompany', (req, res) => {             // POST Request to save data of Company
    var newComp = new Company(req.body);
    console.log(req.body, newComp)
    newComp.save().then(comp => {
        console.log(comp);
        res.redirect('/')
    }).catch(e => res.send(e));    
})

app.get('/placements', (req, res) => {              // Renders Placements Page
    res.render('placements');
});

app.get('/internships', (req, res) => {              // Renders Internships Page
    res.render('internships');
});

app.get('/presentRecruiters', (req, res) => {              // Renders Internships Page
    Company.find().then((companies) => {
        console.log(companies)
        res.render('presentRecruiters' ,{companies});
    }).catch(err => console.log(err));
})

var port = 4300;

app.listen(port, () => {
    console.log('Port Up' + port);
})