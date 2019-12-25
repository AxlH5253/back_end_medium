const jwt = require('jsonwebtoken')
const models = require('../models')
const User = models.tbl_users
const key = require('../config/secret_key')

exports.register = (req,res)=>{
    const result = [];
    const errors = [];
    
    if (!req.body.username) errors.push("`username` is required");
    if (!req.body.fullname) errors.push("`fullname` is required");
    if (!req.body.email) errors.push("`email` is required");
    if (!req.body.password) errors.push("`password` is required");
    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        let objError = Object.assign({}, errors)
        result.push(objError)
        return res.send(result)
    }

    const username = req.body.username
    const fullname = req.body.fullname
    const email = req.body.email
    const password = req.body.password

    let request = {'fullname':fullname,'username':username,'email':email,'password':password}
    User.create(request).then(response=>{
        let id = response.id
        const token = jwt.sign({id:id},key.secret)
        User.findOne({
            where:{id:id},
            attributes: ['email']}
        ).then(user=>{
            const email = user.email
            result.push({email,token})
            res.send(result)
        })
    })
}