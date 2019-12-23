const models = require('../models')
const Categories = models.tbl_categories

exports.addCategory = (req, res) => {

    const errors = [];
  
    if (!req.body.name) errors.push("`name` is required");
    const hasErrors = Boolean(errors.length);

    if (hasErrors) {
        return res.status(422).json({
            errors: errors
        });
    }

    Categories.create(req.body).then(response =>{
        res.send(response)
    })
}

exports.showCategories = (req, res) => {
    Categories.findAll({
        attributes: ['id', 'name'],
    }).then(response =>res.send(response))
}

exports.showArticlesByCategory = (req, res) => {

    Articles.findAll({
        attributes: ['id', 'title','content','image','createdAt','updatedAt'],
        include: [{
            model: Categories,
            as: "category",
            attributes: ['id', 'name']
        }],
        where:{categoryId:req.params.id}
    }).then(response=>{
        if(response.length<=0){
            res.send({message:'result not found'})
        }else{
            res.send(response)
        }
    })
}