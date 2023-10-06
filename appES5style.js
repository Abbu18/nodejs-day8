const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const path = require('path');
const axios = require('axios');
const { error } = require('console');
const app = express();
const port = 6001;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send("Welcome to node js 8th day Training session")
});

//how to retrieve the data from json server based db.json
app.get('/getMovies', (req, res) => {
    const url = "http://localhost:3000/movies"
    axios.get(url).then((response) => {
        const result = response.data
        const finalResult = []
        for (let index = 0; index < result.length; index++) {
            const currentDate = new Date();
            const movieDate = new Date(result[index].date);
            //calculate time difference
            const timeDiff = currentDate.getTime() - movieDate.getTime();
            const dayDiff = timeDiff / (1000 * 60 * 60 * 24)
            if (dayDiff > 3) {
                result[index].status = 'expired'
            } else if (dayDiff >= 1) {
                result[index].status = 'running'
            } else {
                result[index].status = 'just released'
            }
            finalResult.push(result[index])
        }
        res.render('movie-homepage.ejs', { movies: finalResult })
    }).catch((err) => {
        console.log(err)
    })
});

//how to post the data to json server based db.json
app.post('/postMovies', (req, res) => {
    const date = new Date()
    const url = "http://localhost:3000/movies"
    req.body.date = date
    axios.post(url, req.body, {
        headers: {
            'content-type': "application/json"
        }
    }).then(() => {
        res.redirect('/getMovies')
    }).catch((error) => {
        console.log(error)
    })
});

app.post('/sendmail', (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'verna79@ethereal.email',
            pass: 'WWaUFB5hZrn6uBAQjM'
        }
    });

    const mailOptions = {
        from: 'admin@moviebuzz.com',
        to: 'zoie.barton@ethereal.email',
        subject: "movie details",
        text: `movie Name: ${req.body.name} language: ${req.body.language}`
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log("email sent successfully")
            res.send("email sent successfully")
        }
    })
})

app.get('/getMovies2', async (req, res) => {
    const url = 'http://localhost:3000/movies';
    // axios is returning us a promise
    const response = await axios.get(url)
    const result = response.data;
    const finalResult = []
    for (let index = 0; index < result.length; index++) {
        const currentDate = new Date();
        const movieDate = new Date(result[index].date);
        //calculate time difference  
        const timeDiff = currentDate.getTime() - movieDate.getTime();
        const dayDiff = timeDiff / (1000 * 60 * 60 * 24)
        if (dayDiff > 3) {
            result[index].status = 'expired'
        } else if (dayDiff >= 1) {
            result[index].status = 'running'
        } else {
            result[index].status = 'just released'
        }
        finalResult.push(result[index])
    }
    res.render('movie-homepage.ejs', { movies: finalResult });
})


app.listen(port, (req, res) => {
    console.log("server started at port:", port)
});
