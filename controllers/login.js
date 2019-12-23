const jwt = require('jsonwebtoken')
const models = require('../models')
const key = require('../config/secret_key')


const User = models.tbl_users

exports.login = (req,res)=>{

    const errors = [];
    
    if (!req.body.email) errors.push("`email` is required");
    if (!req.body.password) errors.push("`password` is required");
    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        return res.status(422).json({
            errors: errors
        });
    }

    const email = req.body.email
    const password = req.body.password

    User.findOne({
        where: {email,password}
        }).then(user => {
        if(user){
            const token = jwt.sign({id:user.id},key.secret)
            user = user.email
            res.send({
                user,
                token
            })
        }else{
            res.send({
                message:"Wrong Email or Password"
            })
        }
    })
}