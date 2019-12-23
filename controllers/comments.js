const models = require('../models')
Articles = models.tbl_articles
Categories = models.tbl_categories
Users = models.tbl_users
Comments = models.tbl_comments

exports.addComment = (req, res) => {
    let userId = req.userId

    const errors = [];
    
    if (!req.params.id) errors.push("`articleId` is required");
    if (!req.body.comment) errors.push("`comment` is required");

    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        return res.status(422).json({
            errors: errors
        });
    }

    Articles.findAll({
        where:{id:req.params.id}
    }).then(response=>{
        if(response.length<=0){
           return res.send({message:"Article id not found"})
        }
    })

    let articleId = req.params.id       
    request ={articleId:articleId,comment:req.body.comment,userId:userId}
    Comments.create(request).then((response)=>{
    let id = response.id
        Comments.findOne({
        attributes:['id','comment'],
        include:[
            {model:Articles,
            attributes:['id','title'],
            }
        ],
            where:{id:id}
        }).then(response=>{
            res.send(response)
        })
    })          
}

exports.editComment =(req,res)=>{

    const errors = [];
    
    if ((!req.body.id)||
       (!req.params.id) &&
       (!req.body.comment))
       {
         errors.push('Require id and article or comment')
       } 

    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        return res.status(422).json({
            errors: errors
        });
    }

    Articles.findAll({
        where:{id:req.params.id}
    }).then(response=>{
        if(response.length<=0){
           return res.send({message:'Article id not found'})
        }
    })

    Comments.findAll({
        where:{id:req.body.id}
    }).then(response=>{
        if(response.length<=0){
           return res.send({message:'Comment id not found'})
        }
    })

    let userId = req.userId
    let articleId = req.params.id
    
    Comments.findOne({
        where:{id:req.body.id,articleId:articleId,userId:userId},
        attributes:['id']
    }).then(response=>{
        if(response){
            request={comment:req.body.comment}
            Comments.update(request,{
            where:{articleId:articleId,userId:userId,id:req.body.id}
                }).then((response)=>{
                    Comments.findOne({
                    attributes:['id','comment'],
                    include:[{model:Articles,attributes:['id','title'],as:'article'}],
                    where:{id:req.body.id}
                }).then((response)=>{
                    res.send(response)
                })
            })
        }else{
            res.send({message:"You dont have permission to edit this comment"})
        }
    })

}

exports.deleteComment =(req,res)=>{
    const errors = [];
    
    if ((!req.body.id)||
       (!req.params.id)) 
       {
         errors.push('Require id and articleId')
       } 

    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        return res.status(422).json({
            errors: errors
        });
    }

    Comments.findAll({
        where:{id:req.body.id}
    }).then(response=>{
        if(response.length<=0){
           return res.send({message:'Comment id not found'})
        }
    })

    let userId = req.userId
    let articleId = req.params.id
            
    Comments.findOne({
        where:{id:req.body.id,articleId:articleId,userId:userId},
        attributes:['id']
    }).then(response=>{
        if(response){
        Comments.destroy({
            where:{articleId:articleId,userId:userId}
        })
            res.send({message:"delete success"})
        }else{
            res.send({message:"You cannot delete this comment"})
        }
    })
}

exports.showAllComment =(req,res)=>{
    articleId = req.params.id
    Comments.findAll({
        attributes:['id','comment','createdAt','updatedAt'],
        include:[{
            model:Articles,
            attributes:['id','title'],
            as:'article'
        }],
        where:{articleId:articleId}
    }).then(response=>{
        if(response.length>0){
            return res.send(response)
        }else{
            return res.send({message:'there is no comment'})
        }
    })
}