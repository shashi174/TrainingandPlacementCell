const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const session = require('express-session');

const passport = require('passport');
const Company = require('./models/Company')
const Student = require('./models/Student')

const {sendEmail} = require('./middlewares/emailService')

var app = express();

require('./config/passport')(passport);

app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true}));

// var jsonParser = bodyParser.json();


mongoose.connect('mongodb://localhost:27017/priyam-gupta', {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true} ,() => {
    console.log('DB Connected')
});

app.set('view engine', 'ejs');
app.use(express.static('views'));

app.use(session({
    name: "session",
    secret: "rsty",
    key: "key",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',require('./routes/auth'));

app.get('/', (req, res) => {                       // Renders Home Page
    res.render('index', {req});
})

app.get('/addcompany', (req, res) => {              // Company Form Page    
    res.render('addcompany', {req});
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
    res.render('placements',{req});
});

app.get('/internships', (req, res) => {              // Renders Internships Page
    res.render('internships', {req});
});

app.get('/presentRecruiters', (req, res) => {              
    Company.find({verified: true}).then((companies) => {
        console.log(companies)
        res.render('presentRecruiters' ,{req, companies});
    }).catch(err => console.log(err));
})

app.post('/addstudents', (req, res) => {
    var all = req.body.students
    all.forEach(student => {
        var newStud = new Student(student);
        newStud.save().then(st => {
            console.log('Saved', st.name);
        })
    })
    res.send('OK')
})

app.get('/company_admin', (req, res) => {              
    Company.find().then((companies) => {
        res.render('company_admin' ,{companies, req});
    }).catch(err => console.log(err));
})

app.get('/student_admin', (req, res) => {              
    Student.find().then((students) => {
        res.render('student_admin' ,{students, req});
    }).catch(err => console.log(err));
})

app.get('/updatestudent', (req, res) => {           
    res.render('updatestudent');
});


var port = 4300;

app.listen(port, () => {
    console.log('Port Up' + port);
})