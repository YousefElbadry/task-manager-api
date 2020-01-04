require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndRemove('5dd02603524574f535d952a4').then((task) => {
//     console.log("removed Task: ",task);
//     return Task.countDocuments({completed: false});
// }).then( (count) => {
//     console.log(count);
// }).catch( (e) => {
//     console.log("Error:"+ e);
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});
    return count
}

deleteTaskAndCount('5dd02603524574f535d952a4').then( (count) => {
    console.log('count', count);
}).catch( (e) => {
    console.log(e);
})