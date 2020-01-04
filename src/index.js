const express = require('express');
require('./db/mongoose');
// const User = require('./models/user');
// const Task = require('./models/task');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task');
const app = express();

const port = process.env.PORT;

// app.use( (req, res, next) => {
//     res.status(503).send('Serve is Currently under maintenance till 31/12/2019')
// })

// app.use( (req, res, next) => {
//     if(req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next();
//     }
// })

// Adding File Upload to Express
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             cb(new Error('Please Upload a Word Document'));
//         } else {
//             cb(undefined, true);
//         }
//         // cb(new Error('file must be a PDF'));
//         // cb(undefined, true);
//         // cb(undefined, false);
//     }
// });


// const erroMiddleware = (req, res, nex) => {
//     throw new Error('From my middleware')
// }
 // upload.single('upload')
// app.post('/upload', erroMiddleware, (req, res) => {
//     res.send();
// }, (error, req, res, next) => {
//     // this function is designed to handle errors
//     res.status(400).send({error: error.message});
// });

 
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// }, (error, req, res, next) => {
//     // this function is designed to handle errors & it has to have the above call signature ie: error first then the 3 other
//     res.status(400).send({error: error.message});
// });


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});

// const bycrpt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//     const password = 'Red12345!';
//     const hasedPassword = await bycrpt.hash(password, 8)

//     console.log(password);
//     console.log(hasedPassword);

//     const isMatch = await bycrpt.compare('Red12345!', hasedPassword);
//     console.log(isMatch);
// }

// myFunction()

// const myFunction2 = async () => {
//     const token = jwt.sign({ _id: 'abc123'}, process.env.JWT_SECRET, { expiresIn: '7 days'});
//     console.log(token);

//     const data = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(data);
// }

// myFunction2();

// const pet = {
//     name : 'Hal'
// }
// pet.toJSON = function () {
//     // console.log(this);
//     return {}
// }
// console.log(JSON.stringify(pet));

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//     // const task = await Task.findById('5dd947e15ceb7f013a0aa384');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner);

//     const user = await User.findById('5dd94185861752b3b10c565a');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }

// main();