const models = require('../models')
//const Sequelize = require('../database/connection')

const Categories = models.tbl_categories
const Articles = models.tbl_articles
const Follows = models.tbl_follows
const Comments = models.tbl_comments 

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

exports.follow = (req,res)=>{
    Follows.findAll().then(follow =>res.send(follow))
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
        let k = []
        
        for(let i=0;i<10;i++){
            max = article.length -1
            k.push(article[max-i])
        }
       
        res.send(k);
    })
}

//task 3 number 1
//http://localhost:5000/api/v1/category/{{id category}}/articles
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