const jwt = require('jsonwebtoken')
const models = require('../models')

function getIdFromObject(data){
    let id = JSON.stringify(data)
    id = id.split(",")
    id = id[0].substring(6,data.length)
    return id
}


const User = models.tbl_users

exports.login = (req,res)=>{
    const email = req.body.email
    const password = req.body.password

    User.findOne({
        where: {email,password}
        }).then(user => {
        if(user){
            const token = jwt.sign({id:user.id},'axla')
            user = user.email
            res.send({
                user,
                token
            })
        }else{
            res.send({
                error: true,
                message:"Wrong Email or Password"
            })
        }
    })
}

exports.register = (req,res)=>{
    const username = req.body.username
    const fullname = req.body.fullname
    const email = req.body.email
    const password = req.body.password

    let request = {'fullname':fullname,'username':username,'email':email,'password':password}
    User.create(request).then(response=>{
        let id = getIdFromObject(response)
        const token = jwt.sign({id:id},'axla')
        User.findOne({
            where:{id:id},
            attributes: ['email']}
        ).then(user=>{
            res.send({user,token})
        })
    })
}