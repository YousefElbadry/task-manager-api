require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('5dcd5d4f849e6fc3b1549f98', { age: 1}).then( (user) => {
//     console.log(user);
//     return User.countDocuments({age : 1});
// }).then( (result) => {
//     console.log(result);
// }).catch( (e) => {
//     console.log(e);
// })

const UpdateAgeAndCount = async (id, age) => {
    // const user = await User.findByIdAndUpdate(id, { age: age})
    const user = await User.findByIdAndUpdate(id, { age});
    const count = await User.countDocuments({age});
    return count;
}

UpdateAgeAndCount('5dcd5d4f849e6fc3b1549f98', 2).then( (count) => {
    console.log(count);
}).catch( (e) => {
    console.log(e);
})