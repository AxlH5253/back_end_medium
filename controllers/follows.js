const models = require('../models')
Users = models.tbl_users
Follows = models.tbl_follows

exports.followPerson =(req,res)=>{
    const errors = [];
    
    if (!req.body.id) errors.push("`id` is required");
    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        return res.status(422).json({
            errors: errors
        });
    }

    Users.findAll({
        where:{id:req.body.id}
    }).then(response=>{
        if(response.length<=0){
           return res.send({message:"User id to follow not found"})
        }
    })
    
    let userId = req.userId
    let followingUserId = req.body.id

    if (userId == followingUserId){
        return res.send({message:'Cannot follow'})
    }

    Follows.findAll({
        where:{userId:req.userId,followingUserId:req.body.id},
        attributes:['id']
    }).then(response=>{
        if(response.length>0){
            Follows.destroy({where:{userId:req.userId,followingUserId:req.body.id}})
           return res.send({message:`unfollow user with id = ${req.body.id}`})
        }{
        
        request ={"userId":userId,"followingUserId":req.body.id}
        Follows.create(request).then(response=>{
                lastId = response.id
                Follows.findOne({
                    attributes:['id','userId','followingUserId'],
                    include:[{model:Users,attributes:['id','email'],as:'user'}],
                    where:{id:lastId}
                }).then(response=>{
                    return res.send(response)
                })
            })

        }
    })
              
}