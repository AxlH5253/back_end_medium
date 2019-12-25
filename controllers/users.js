const models = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

Users = models.tbl_users

exports.showUser = (req, res) => {
       let userId = req.userId
        Users.findAll({
            where:{id:userId}
        }).then(response=>{
            res.send(response);
        })
    }