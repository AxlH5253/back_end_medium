const models = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

Articles = models.tbl_articles
Categories = models.tbl_categories
Users = models.tbl_users
Comments = models.tbl_comments

exports.showArticles = (req, res) => {
    if(req.query.orderBy!= 'latest'){
        Articles.findAll({
            attributes: ['id', 'title','content','image','createdAt','updatedAt'],
            include: [{
                model: Categories,
                as: "category",
                attributes: ['id', 'name']
            },
                {model:Users,
                attributes:['id','fullname'],
                as:'createdBy'}
            ]
        }).then(response=>res.send(response))
    }else{
        Articles.findAll({
            include: [{
                model: Categories,
                as: "category",
                attributes: ['id', 'name']
            }],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 10
        }).then(response=>{
            res.send(response);
        })
    }
}

exports.addArticle = (req, res) => {
   
    let userId = req.userId
    let result = [];
    const errors = [];
    
    if (!req.body.title) errors.push("`title` is required");
    if (!req.body.image) errors.push("`image` is required");
    if (!req.body.content) errors.push("`content` is required");
    if (!req.body.categoryId) errors.push("`categoryId` is required");
    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        let objError = Object.assign({}, errors)
        result.push(objError)
        return res.send(result)
    }

    Categories.findAll({
        where:{id:req.body.categoryId}
    }).then(response=>{
        if(response.length<=0){
           result.push({message:"Category id not found"})
           return res.send(result)
        }
    })

    request = {'title':req.body.title,'image':req.body.image,'content' : req.body.content,
                'categoryId':req.body.categoryId,'authorId':userId}
            
    Articles.create(request).then(response =>{
    idArticle = response.id
        
    Articles.findOne({
    where:{id:idArticle},
    attributes: ['id', 'title','content','image','createdAt','updatedAt'],
                include: [{
                    model: Categories,
                    as: "category",
                    attributes: ['id', 'name']
                },{
                    model: Users,
                    as:"createdBy",
                    attributes: ['id', 'fullname']
                 }]
         }).then(response =>{
              result.push(response)
              res.send(result)
          })
      })
}

exports.updateArticle = (req, res) => {
    let result = [];
    
    Articles.findAll({
        where:{id:req.params.id}
    }).then(response=>{
        if(response.length<=0){
            result.push({message:'Article id not found'})
           return res.send(result)
        }
    })

    const errors = [];
    
    if ((!req.body.title)&&
       (!req.body.image) &&
       (!req.body.content))
       {
         errors.push('Require title or image or content')
       } 

    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        let objError = Object.assign({}, errors)
        result.push(objError)
        return res.send(result)
    }

    let userId = req.userId
    let articleId = req.params.id
    Articles.findOne({
        where:{id:articleId,authorId:userId}
    }).then(response=>{
        if(response){
            let request = {'title':req.body.title,'image':req.body.image,'content' : req.body.content,
                'categoryId':req.body.categoryId,'authorId':userId}
                    
            Articles.update(request,{
                where:{id:articleId}
            }).then(()=>{
                Articles.findOne({
                attributes: ['id', 'title','content','image','createdAt','updatedAt'],
                    include: [{
                    model: Categories,
                    as: "category",
                    attributes: ['id', 'name']
                },{
                    model: Users,
                    as:"createdBy",
                    attributes: ['id', 'fullname']
                }],
                    where:{id:req.params.id}
                }).then(response =>{
                    result.push(response)
                    res.send(result)
                })
            }
        )
    }else{
        res.send({message:"You don't have permission to update this article"})
    }
                
    })

}

exports.deleteArticle = (req, res) => {
    let result = [];

    Articles.findAll({
        where:{id:req.params.id}
    }).then(response=>{
        if(response.length<=0){
           result.push({message:'Article id not found'})
           return res.send(result)
        }
    })

    let userId = req.userId
        let articleId = req.params.id
        Articles.findOne({
            where:{id:articleId,authorId:userId}
        }).then(response => {
        if(response){
            Articles.destroy({where:{id:articleId}})
            .then(() =>{
                res.send({
                    id:req.params.id
                })
                
            })
        }else{
            res.send({message:"You don't have permission to delete this article"})
        }
    })
}

exports.detailArticle = (req, res) => {
    let result = []
    Articles.findAll({
        where:{id:req.params.id}
    }).then(response=>{
        if(response.length<=0){
           result.push({message:'Article id not found'})
           return res.send(result)
        }

    Articles.findOne({
        attributes: ['id', 'title','content','image','createdAt','updatedAt'],
        include: [
            {
                model: Categories,
                as: "category",
                attributes: ['id', 'name']
            },
            {
                model:Users,
                attributes:['id','fullname'],
                as:'createdBy'},
            {
                model: Comments,
                attributes: ['id', 'comment','createdAt','updatedAt'],
                as:'comments',
                include:[
                    {
                        model:Users,
                        attributes:['id','fullname'],
                        as:'commentBy'
                    }
                ]
            }
        ],
        where:{id:req.params.id}
    }).then(response=>{
        let result =[]
        let categoryId = response.category.id
        result.push(response)
        
        Articles.findAll({
            where:{categoryId:categoryId,id :{[Op.not]:[req.params.id]}},
            attributes:['id', 'title','content','image','categoryId','createdAt','updatedAt'],
            include:[
                {
                    model:Users,
                    attributes:['id','fullname'],
                    as:'createdBy'
                }
            ],
            limit: 5
        }).then(response =>{
            result.push(response)
            res.send({article:result[0],relatedArticles:result[1]})
        })
    })

    })
}

exports.articleByPerson =(req,res)=>{
    Articles.findAll({
        where:{authorId:req.params.id},
        attributes:['id','title','content','image','createdAt','updatedAt'],
        include:[
            {
                model:Categories,
                attributes:['id','name'],
                as:'category'
            },
            {
                model: Users,
                attributes:['id','fullname'],
                as:'createdBy'
            }
        ]
    }).then(response=>{
        res.send(response)
    })
}