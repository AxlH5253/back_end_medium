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
const EditComment = require('./controllers/main').editComment
const DeleteComment = require('./controllers/main').deleteComment
const GetAllComment = require('./controllers/main').getAllComment
const FollowPerson = require('./controllers/main').followPerson
const ArticleByPerson = require('./controllers/main').articleByPerson
const Registere = require('./controllers/auth').register

app.group('/api/v1', (router) => {
    router.post('/login',Auth.login)
    router.post('/register',Registere)

    router.post('/article',authenticated,CreateArtkl)
    router.post('/category',authenticated,Category)
    router.post('/article/:id/comment',authenticated,CreateComment)
    router.post('/follow',authenticated,FollowPerson)

    router.put('/article/:id/comment',authenticated,EditComment)
    router.put('/article/:id',authenticated,UpdateArtkl)

    router.delete('/article/:id',authenticated,DeleteArtkl)
    router.delete('/article/:id/comment',authenticated,DeleteComment)
    
    router.get('/user/:id/articles',ArticleByPerson)
    router.get('/article/:id',DetailArtkl) 
    router.get('/categories',Categories) 
    router.get('/articles',Article)
    router.get('/articlespopuler',ArtPop)
    router.get('/category/:id/articles',ArtByCat)
    router.get('/article/:id/comment',GetAllComment)
})

app.listen(port, () => console.log(`Listening on port ${port}!`))