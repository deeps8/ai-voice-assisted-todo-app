//here will the code of todo app server.
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

//routes
const userRoute = require('./api/routes/userRoute');
const taskRoute = require('./api/routes/todoRoute');


//1. initializing the port 
const port = process.env.PORT || 3000;

//2. connect to database using mongoose
mongoose.connect('mongodb+srv://deepak:sydniv@123@kriateve-hafwc.mongodb.net/todoapp?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

//3. check for connection made or not
mongoose.connection.on('connected',()=>{
    console.log("MongoDb is connected.");
});

mongoose.connection.off('error',(error)=>{
    console.log("MongoDb not connected.",error);
});


//4. use bodyparser, cors in app
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

//5. set all the access settings
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-headers","Origin, X-Requested-Width, Content-type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods","PUT, PATCH, GET, DELETE, POST");
        return res.status(200).json({});
    }
    next();
});

//use all the routes
app.use('/alan-user',userRoute);
app.use('/alan-todo',taskRoute);


app.use(express.static(path.join(__dirname,'public')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
});

// app.use((req,res,next)=>{
//     return res.json({
//         message:"Not found in routes"
//     })
// });

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error:{
            message: err.message
        }
    });
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

module.exports = app;

