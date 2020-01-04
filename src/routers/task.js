const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task( {
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send('Error in creating task: ' + e);
    }
   
    // task.save().then( () => {
    //     res.status(201).send(task);
    // }).catch( (e) => {
    //     res.status(400).send('Error in creating task: '+e)
    // });
})

// GET /tasks/completed=false
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.sortBy) {
        const parts =req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    try {
        // const tasks = await Task.find({owner: req.user._id}); 
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
    // Task.find({}).then( (data) => {
    //     res.send(data);
    // }).catch((e) => {
    //     res.status(500).send();
    // })
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            res.status(404).send();
        } else {
            res.send(task);
        }
    } catch (e) {
        res.status(500).send();
    }
    // Task.findById(req.params.id).then( (task) => {
        
    //     if(task) {
    //     res.send(task);
    //     } else {
    //         res.status(404).send()
    //     }
    // }).catch((e) => {
    //     res.status(500).send();
    // })
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every( (update) => {
        return allowedUpdates.includes(update);
    })
    if(!isValidOperation) {
        res.status(400).send({'error': 'Invalid Updates'})
    } else {
        try {
            // const task = await Task.findById(req.params.id);
            const task = await Task.findOne({ _id:req.params.id, owner: req.user._id})
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
        if(!task) {
            res.status(404).send();
        } else {
            updates.forEach( (update) => task[update] = req.body[update])
            await task.save();
            res.send(task);
        }
        } catch (e) {
            res.status(400).send(e);
        }
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
        if (!task) {
            res.status(404).send();
        } else {
            res.send(task);
        }
    } catch (e) {
        res.status(500).send();
    }
})


module.exports = router;