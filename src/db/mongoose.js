const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// const me = new User({
//     name: '    password validation name test data     ',
//     email: 'valid@email.com    ',
//     password: ' thisIsPassworddddddd  '
// });

// me.save().then( (result) => {
//     console.log(me);
//     // console.log('----------------------------------');
//     // console.log(result);
// }).catch( (error) => {
//     console.log('Error!',error);
// });


// const taskOfToday = new Task({
//     description: '    finish this Section tomorrow :v '
    
// });

// taskOfToday.save().then( () => {
//     console.log(taskOfToday);
// }
// ).catch( (error) => {
//     console.log(error)
// })