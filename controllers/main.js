const models = require('../models')
const Categories = models.tbl_categories
const Articles = models.tbl_articles
const Follows = models.tbl_follows
const Users = models.tbl_users
const Comments = models.tbl_comments 
const jwt = require('jsonwebtoken')

//get id from object function
function getIdFromObject(data){
    let id = JSON.stringify(data)
    id = id.split(",")
    id = id[0].substring(6,data.length)
    return id
}

//get token from header function
function getTokenFromHeader(requestHeader){
    let token = requestHeader
    token = token.split(' ')
    token = token[1]
    return token
}

//task 1 number 1
//url http://localhost:5000/api/v1/category
//method post
exports.category = (req, res) => {
    Categories.create(req.body).then(category =>{
        res.send(category)
    })
}

//task 1 number 2
//url http://localhost:5000/api/v1/categories
//method get
exports.categories = (req, res) => {
    Categories.findAll({
        attributes: ['id', 'name'],
    }).then(categories =>res.send(categories))
}


//task 2 number 1
//url http://localhost:5000/api/v1/articles
//method get
exports.article = (req, res) => {
    Articles.findAll({
        attributes: ['id', 'title','content','image','createdAt','updatedAt'],
        include: [{
            model: Categories,
            as: "category",
            attributes: ['id', 'name']
        }]
    }).then(article=>res.send(article))
}

//task 2 number 2
//url http://localhost:5000/api/v1/articlespopuler
//method get
exports.artpopuler = (req, res) => {
    Articles.findAll({
        include: [{
            model: Categories,
            as: "category",
            attributes: ['id', 'name']
        }]
    }).then(article=>{
        let data = []
        
        for(let i=0;i<10;i++){
            max = article.length -1
            k.push(article[max-i])
        }
       
        res.send(data);
    })
}

//task 3 number 1
//url:http://localhost:5000/api/v1/category/{{id category}}/articles
//method : get
exports.articlebycategory = (req, res) => {
    Articles.findAll({
        attributes: ['id', 'title','content','image','createdAt','updatedAt'],
        include: [{
            model: Categories,
            as: "category",
            attributes: ['id', 'name']
        }],
        where:{categoryId:req.params.id}
    }).then(article=>res.send(article))
}

//task 4 number 1
//url:http://localhost:5000/api/v1/article
//method post
exports.createArticle = (req, res) => {
    let token = getTokenFromHeader(req.headers['authorization'])

    jwt.verify(token, 'axla', (err, authorizedData) => {
        if(err){
            return res.sendStatus(403);
        } else {
            let userId = getIdFromObject(authorizedData)

            request = {'title':req.body.title,'image':req.body.image,'contetnt' : req.body.contetnt,
                        'categoryId':req.body.categoryId,'authorId':userId}
            
            Articles.create(request).then(response =>{
                let idArticle = getIdFromObject(response)
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
                    where:{id:idArticle}
                }).then(response =>{
                    res.send(response)
                })
            })
        }
    })
}

//task 4 number 2
//url:http://localhost:5000/api/v1/article/{{id_article}}
//method: put
exports.updateArticle = (req, res) => {
    let token = getTokenFromHeader(req.headers['authorization'])
    jwt.verify(token, 'axla', (err, authorizedData) => {
        if(err){
            return res.sendStatus(403);
        } else {
            let userId = getIdFromObject(authorizedData)
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
                            res.send(response)
                        })
                    }
                    )
                }else{
                    res.send({message:"You don't have permission to update this article"})
                }
                
            })
            
        }
    })
}

//task 4 number 3
//url:http://localhost:5000/api/v1/article/{{id_article}}
//method: delete
exports.deleteArticle = (req, res) => {
    let token = getTokenFromHeader(req.headers['authorization'])

    jwt.verify(token, 'axla', (err, authorizedData) => {
        if(err){
            return res.sendStatus(403);
        } else {
            let userId = getIdFromObject(authorizedData)
            let articleId = req.params.id
            Articles.findOne({
                where:{id:articleId,authorId:userId}
            }).then(response => {
               if(response){
                    Articles.destroy({where:{id:articleId}})
                    .then(() =>{
                        res.send({
                            response
                        })
                
                    })
               }else{
                   res.send({message:"You don't have permission to delete this article"})
               }
            })
            
        }
    })
}

//task 5 number 1,2
//url:http://localhost:5000/api/v1/article/{{id_article}}
//method: get
exports.detailArticle = (req, res) => {
    Articles.findOne({
        attributes: ['id', 'title','content','image','createdAt','updatedAt'],
        include: [
            {
                model: Categories,
                as: "category",
                attributes: ['id', 'name']
            },
            {
                model: Comments,
                as: "comments",
                attributes: ['id', 'comment','createdAt','updatedAt']
            }
        ],
        where:{id:req.params.id}
    }).then(response=>{
        let result =[]
        let idCategory = getIdFromObject(response.category)
        result.push(response)
        
        Articles.findAll({
            where:{categoryId:idCategory},
            attributes:['id', 'title','content','image','createdAt','updatedAt']
        }).then(response =>{
            result.push(response)
            res.send({article:result[0],relatedArticles:result[1]})
        })
    })
}

//task 6 number 1
//url:http://localhost:5000/api/v1/article/{{id_article}}/comment
//method: post
exports.createComment = (req, res) => {
    let token = getTokenFromHeader(req.headers['authorization'])
    jwt.verify(token, 'axla', (err, authorizedData) => {
        if(err){
            return res.sendStatus(403);
        } else {
            jwt.verify(token, 'axla', (err, authorizedData) => {
                if(err){
                    return res.sendStatus(403);
                } else {
                    let userId = getIdFromObject(authorizedData)
                    Articles.findOne({
                        where:{id:req.params.id},
                        attributes:['id']
                    }).then(response => {
                        if(response){
                            request ={articleId:req.params.id,comment:req.body.comment,userId:userId}
                            Comments.create(request).then((response)=>{
                                let commentId = getIdFromObject(response)
                                Comments.findOne({
                                    attributes:['id','comment'],
                                    include:[
                                        {model:Articles,
                                         attributes:['id','title'],
                                         as:'article'
                                        }
                                    ],
                                    where:{id:commentId}
                                }).then(response=>{
                                    res.send(response)
                                })
                            })
                        }else{
                            res.send({
                                message:"Article not found!"
                            })
                        }
                    })              
                }
            })
        }
    })
}

// exports.deleteComment =(req,res)=>{

// }