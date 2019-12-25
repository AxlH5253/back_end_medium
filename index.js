require('express-group-routes')
const { auth, authorized, authenticated } = require("./middleware");

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000

app = express()
app.use(bodyParser.json())
app.use(cors())

const Categories = require('./controllers/categories')
const Articles = require('./controllers/articles')
const Comments = require('./controllers/comments')
const Follows = require('./controllers/follows')
const Login = require('./controllers/login')
const Register = require('./controllers/register')
const User = require('./controllers/users')

app.group('/api/v1',(router)=>{
    //add new category
    router.post('/category',Categories.addCategory)

    //show all categories
    router.get('/categories',Categories.showCategories)

    //show all articles
    router.get('/articles',Articles.showArticles)

    //show 10 latest articles
    router.get('articles?orderBy=',Articles.showArticles)

    //show articles by category
    router.get('/category/:id/articles',Categories.showArticlesByCategory)

    //add new article
    router.post('/article',auth,Articles.addArticle)

    //update article
    router.put('/article/:id',auth,Articles.updateArticle)

    //delete article
    router.delete('/article/:id',auth,Articles.deleteArticle)

    //detail article
    router.get('/article/:id',Articles.detailArticle)

    //add comment
    router.post('/article/:id/comment',auth,Comments.addComment)

    //edit comment
    router.put('/article/:id/comment',auth,Comments.editComment)

    //delete comment
    router.delete('/article/:id/comment',auth,Comments.deleteComment)

    //show all comments
    router.get('/article/:id/comments',Comments.showAllComment)

    //follow person
    router.post('/follow',auth,Follows.followPerson)

    //article by person
    router.get('/user/:id/articles',Articles.articleByPerson)

    //show user profil
    router.post('/user',auth,User.showUser)

    //register new account
    router.post('/register',Register.register)
    
    //login to account
    router.post('/login',Login.login)
})

app.listen(port, () => console.log(`Listening on port ${port}!`))