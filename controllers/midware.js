const jwt = require('express-jwt')
exports.authenticated = jwt({secret:'axla'})

// exports.authenticated = (req, res,nex)=>{
//     if(isLoggedIn){
//         next()
//     }  
//     else{
//         res.send({
//             message:"You are not Unauthenticated!"
//         })
//     }
// }