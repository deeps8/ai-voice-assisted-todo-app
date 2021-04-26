const express = require('express');
const mongoose = require('mongoose');

const Tasks = require('../models/todo');
const checkAuth = require('../middleware/checkAuth');
const { aggregate } = require('../models/todo');

const router = express.Router();



//route to post the task
/**
 *  check for authentication of user and then save the task data
 */
router.post('/add',checkAuth,(req,res,next)=>{
    const task = new Tasks({
        tid: new mongoose.Types.ObjectId(),
        title: req.body.title,
        user: req.UserData,
        category: req.body.category
    });

    task.save().then(result=>{
        return res.json({
            message: "Task Added",
            task: result
        });
    })
    .catch(error=>{
        res.status(404);
        return res.json({
            message: "Task Not Added",
            error:  error
        });
    })
    
});

//route to get all the tasks in priority order
/**
 *  check for authentication of user and then get the task data
 */
router.get('/all',checkAuth,(req,res,next)=>{

    Tasks.aggregate([
        { $match : { "user.uid": req.UserData.uid } },
        {
            $project:{
                title:1,
                tid:1,
                _id:1,
                done:1,
                dateOfCreation:1,
                category:1
            }
        }
    ],(error,tasks)=>{
        if(error){
            res.status(400);
            return res.json({
                message: "Something went wrong",
                error:  error
            });
        }
        else{

            return res.json({
                message: "Tasks List",
                user: req.UserData,
                tasks: tasks
            });
        }
    });
    
});




/*
 * other categories will be handled on client side 
    - completed tasks
    - not completed tasks
    - shared tasks
 */



 // updating the whole tasks (API hit when you update the task by update-btn) 

router.post('/update',checkAuth,(req,res,next)=>{
    
    Tasks.updateOne({tid:req.body.tid},{
        $set:{

            title: req.body.title,
            category:req.body.category
        }
    })
    .exec()
    .then(result=>{
        return res.json({
            message: "Task Updated",
            result: result
        });
    })
    .catch(error=>{
        res.status(404);
        return res.json({
            message:"Task not updated",
            error: error
        });
    });
    
});


// updating the task done status to true or false 
router.post('/update/done',checkAuth,(req,res,next)=>{
    
    Tasks.updateOne(
        {
            tid:req.body.tid
        },
        {
            $set:{ done : req.body.done}
        }
    )
    .exec()
    .then(result=>{
        return res.json({
            message: "Task Updated the status",
            result: result
        });
    })
    .catch(error=>{
        res.status(400);
        return res.json({
            message:"Task not updated",
            error: error
        });
    });
    
});


//delete the task only by owner
router.post('/delete',checkAuth,(req,res,next)=>{
    
    Tasks.deleteOne(
        { tid: req.body.tid, "user.uid": req.UserData.uid }
    )
    .exec()
    .then(result=>{
        //check for deletedCount if 0 none deleted , if 1 then deleted
        if(result.deletedCount > 0){
            return res.json({
                message: "Task deleted ",
                result: result
            });
        }else{
            res.status(400);
            return res.json({
                message: "Task not deleted . Only its owner can delete it",
                result: result
            });
        }
        
    })
    .catch(error=>{
        res.status(400);
        return res.json({
            message:"Task not deleted something went wrong",
            error: error
        });
    });
    
});


module.exports = router;