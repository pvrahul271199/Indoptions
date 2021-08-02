const express = require('express');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/user')
const Key = require('./models/key')
const method = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const app = express();
const dotenv = require('dotenv').config();
require('./auth');

const port = 80;

mongoose.connect(process.env.mongodb_url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then((res) => {
         console.log("Database Connection Established")
    })
    .catch((e) => {
         console.log("Error Obtained")
})


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static('./public/'));
app.use(express.urlencoded({
    extended: true
}));
app.use(method('_method'))
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: false}));
app.use(session({
    secret: 'options1',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});


function isLogged(req, res, next) {
    req.user ? next() : res.redirect('/auth/google');
}

async function keyAvailable(req,res,next){
    const id = req.user.id;
    const userKey = await Key.find({id});
    console.log(userKey)
    if(userKey.length<1){
        res.redirect('/details')
    }else{
        next();
    }
    
}


app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
)

app.get('/google/callback', //protected

    passport.authenticate('google', {
        successRedirect: '/analyze',
        failureRedirect: '/auth/failed'
    })
)

app.get('/auth/failed', (req, res) => { //protected
    res.send('Auth Failed')
})

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/")
})

app.get('/', (req, res) => {
    if(req.user){
        const data = req.user;
        res.render('home',{data})
    } else {
        const data = {};
        res.render('home', {data})
    }

})

app.get('/details', isLogged, async (req, res) => {
    const id = req.user.id;
    const data = await Key.find({
        id
    });
    if(data.length>0){
    console.log("Inside credentials")
       res.render('credentials',{ 
        data
    })
    } else{
  console.log("Inside credentials")
    res.render('credentialsnew')
}    
})

app.post('/details', isLogged,  async (req, res) => {
     const {
         apikey,
        broker,
         secretkey
     } = req.body;
    const user = req.user;
    const id = req.user.id;
    const data = new Key({
        id,
        broker,
        name: user.displayName,
        email: user.email,
        apikey,
        secretkey
    })
    console.log(data)
    await data.save();
    
    res.redirect('/analyze');
});
    
app.delete('/key/delete/:id', async (req, res) => {
    const {
        id
    } = req.params;
     const data = await Key.findByIdAndDelete(id);
    res.redirect("/details")
})

app.get('/analyze', isLogged, keyAvailable, async (req, res) => { //protected
    const user = req.user;
    const id = user.id;


    res.render('analyze', {
        user
    });
})

app.post('/analyze', isLogged, keyAvailable,async (req, res) => {
        
const {
        script,
        strikeprice,
        option,
        expiry,
        order,
        ordertype,
        lotsize,
        stoploss,
        sltype,
        entrytime,
        exittime,
        sltocost
    } = req.body;

    const user = req.user;
    const id = user.id;
    const person = new User({
        id,
        name: user.displayName,
        email: user.email,
        script,
        strikeprice,
        option,
        expiry,
        order,
        ordertype,
        lotsize,
        stoploss,
        sltype,
        entrytime,
        exittime,
        sltocost
    })
    await person.save();
    res.redirect('/basket')
})

app.get('/basket', isLogged, keyAvailable, async (req, res) => {
    const id = req.user.id;
    const person = await User.find({
        id
    })
    res.render('basket', {
        person
    })
})

app.delete('/delete/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const person = await User.findByIdAndDelete(id);
    res.redirect('/basket')
})

app.get('/edit/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const person = await User.findById(id);
    res.render('edit', {
        person
    })
})

app.put('/edit/:id', async (req, res) => {
    const {
        id
    } = req.params;
    
    const person = await User.findByIdAndUpdate(id, {
        ...req.body
    })
    res.redirect('/basket')
})

app.get('/schedule',isLogged, async(req,res) => {
    const id = req.user.id;
    const user = await Key.find({id})
    const {broker, apikey, secretkey} = user[0];
    console.log(broker)
    if(broker=='Zerodha'){
        const url = `https://kite.trade/connect/login?api_key=${apikey}&v=3`
        res.redirect(url);
    }else if(broker=='Angel'){
        const url = `https://smartapi.angelbroking.com/publisher-login?api_key=${apikey}`
        res.redirect(url);
    }else if(broker=='AliceBlue'){
        const url = `https://ant.aliceblueonline.com/oauth2/auth?response_type=code&state=test_state&client_id=${apikey}`
        res.redirect(url);
    }
})

app.get('/request', isLogged, async (req,res) => {
    const id = req.user.id;
    const user = await Key.find({id})
    const {broker} = user[0];
    if(broker=='Zerodha'){
        const {request_token, action,status} = req.query; 
        const url_token = `https://www.algoindex.tech/request?request_token=${request_token}&action=${action}&status=${status}`;
        const user = await Key.findOneAndUpdate(id, {
            $set: {
                url: url_token
            }}
        )           
        res.render('order')

    }else if(broker=='Angel'){
        const {auth_token,feed_token,refresh_token} = req.query; 
        const url_token = `https://www.algoindex.tech/request?auth_token=${auth_token}&feed_token=${feed_token}&refresh_token=${refresh_token}`;
        const user = await Key.findOneAndUpdate(id, {
            $set: {
                url: url_token
            }}
        )     
        res.render('order')

    }else if(broker=='AliceBlue'){
        const {code,scope,} = req.query; 
        const url_token = `https://www.algoindex.tech/request?code=${code}`;
        const user = await Key.findOneAndUpdate(id, {
            $set: {
                url: url_token
            }}
        )  
        res.render('order')
    }
})


app.listen(port, () => {
 console.log(`Server listening at ${port}`)
})


