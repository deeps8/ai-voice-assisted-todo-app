//imports : express,router(),mongoose,bcrypt,jsonwebtoken
const express =  require('express');
const router = express.Router();
const mongoose = require('mongoose');
const  jwt = require('jsonwebtoken');

const User = require('../models/user');




//login route
/*
    body: 
        username
        password
    
    return a token that will be stored in localStorage

*/
router.post('/login',(req,res,next)=>{
    
    User.findOne({username:req.body.username})
        .exec()
        .then(user=>{
            if(user!=null){
                //comapring password
                    if(req.body.password === user.password){
                        const token = jwt.sign({
                            username: user.username,
                            uid: user.uid
                        },
                        'mysecretjwtstringfortodoapp',
                        {
                            expiresIn: '7d'
                        });

                        return res.json({
                            message: "Authentication Successful",
                            result: result,
                            token:token,
                            user:user
                        });
                    }else{
                        res.status(400);
                        return res.json({
                            message: 'Authentication Failed',
                            result: result
                        });
                    }
            }else{
                res.status(404);
                return res.json({
                    message: "No User found"
                });
            }
            
        })
        .catch(error=>{
            res.status(400);
            return res.json({
                message: "Something went wrong",
                error: error
            });
        });
});


//signup route
/*
    body:
        username
        password

    id,date will be generated on signup route
*/
router.post('/signup',(req,res,next)=>{
    console.log(req.body);
    User.find({username:req.body.username})
        .countDocuments()
        .exec()
        .then(userCount=>{
            
            //no user with same email then add the user in collection
            if(userCount==0){
                //now crypt the password from body
                        const user = new User({
                            uid: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password:req.body.password
                        }); 
                        
                        user.save()
                            .then(result=>{
                                return res.json({
                                    message: "Account Created",
                                    result: result
                                });
                            })
                            .catch(error=>{
                                res.status(400);
                                return res.json({
                                    message: "Account Not created",
                                    error: error
                                });
                            });
                
            }
            //if email already exists
            else{
                res.status(404);
                return res.json({
                    message: "Username already exists"
                });
            }
            
        })
        .catch(error=>{
            res.status(400);
            return res.json({
                message: "Something went wrong",
                error: error
            });
        });

});

router.get('/all',(req,res,next)=>{
    User.find()
        .sort()
        .then(users=>{
            return res.json({
                message: "All users",
                users:users
            });
        })
        .catch(error=>{
            res.status(400);
            return res.json({
                message:"Something went wrong",
                error:error
            });
        });
});


module.exports = router;
