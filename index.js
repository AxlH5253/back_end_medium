require('express-group-routes')
const { authenticated } = require('./middleware')

const express = require('express')
const bodyParser = require('body-parser')
const port = 5000

app = express()
app.use(bodyParser.json())

//Contrlollers
const Auth = require('./controllers/auth')
const Category = require('./controllers/main').category
const Categories = require('./controllers/main').categories
const Article = require('./controllers/main').article
const ArtPop = require('./controllers/main').artpopuler
const ArtByCat = require('./controllers/main').articlebycategory
const CreateArtkl = require('./controllers/main').createArticle
const UpdateArtkl = require('./controllers/main').updateArticle
const DeleteArtkl = require('./controllers/main').deleteArticle
const DetailArtkl = require('./controllers/main').detailArticle
const CreateComment = require('./controllers/main').createComment

app.group('/api/v1', (router) => {
    router.post('/login',Auth.login)
    router.post('/article',authenticated,CreateArtkl)
    router.post('/category',authenticated,Category)
    router.post('/article/:id/comment',authenticated,CreateComment)

    router.put('/article/:id',authenticated,UpdateArtkl)
    router.delete('/article/:id',authenticated,DeleteArtkl)
    
    router.get('/article/:id',DetailArtkl) 

    router.get('/categories',Categories) 
    router.get('/articles',Article)
    router.get('/articlespopuler',ArtPop)
    router.get('/category/:id/articles',ArtByCat)
})

app.listen(port, () => console.log(`Listening on port ${port}!`))