const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/accounts');
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email,user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }


    // user.save().then( () => {
    //     res.status(201).send(user)
    // }).catch( (e) => {
    //     res.status(400).send(e);
    // });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);       
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).json(e.message);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter( (token) => {
            return token.token !== req.token
        });
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll',auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {
// try {
//     const users = await User.find({});
//     res.send(users)
// } catch (e) {
//     res.status(500).send();
// }

    // allows a user to get only their profile when they're authenticated 
    res.send(req.user);

    // User.find({}).then( (users) => {
    //     res.send(users);
    // }).catch( (e) => {
    //     res.status(500).send()
    // });
});

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user)
//         {
//             res.status(404).send();
//         } else {
//             res.send(user);
//         }
//     } catch (e) {
//         res.status(500).send();
//     }
//     // User.findById(_id).then( (user) => {
//     //     if(!user)
//     //     {
//     //         res.status(404).send();
//     //     } else {
//     //         res.send(user);
//     //     }

//     // }).catch( (e) => {
//     //     res.status(500).send();
//     // });
// });

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [ 'name', 'email', 'password', 'age'];
    const isValidOperation = updates.every( (update) =>  allowedUpdates.includes(update));

    if(!isValidOperation) {
        res.status(400).send({'error': 'Invalid Updates'});
    } else {
        try {
            // const user = await User.findById(req.user._id);
            
            updates.forEach( (update) => req.user[update] = req.body[update])
            await req.user.save();

            // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
            // if(!user) {
            //     res.status(404).send();
            // } else {
                console.log('inside updating user data')
                res.send(req.user);
            // }
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user) {
        //     res.status(404).send();
        // } else {
            // res.send(user);
        // }
        sendCancellationEmail(req.user.email, req.user.name);
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})

const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload an image with one of the following formats: jpg, jpeg, png'));
        } else {
            cb(undefined, true);
        }
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
});

router.delete('/users/me/avatar', auth, async (req, res, next) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send()
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error('unable to find user or user avatar')
        } else {
            res.set('Content-Type', 'image/png');
            res.send(user.avatar);
        }
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;