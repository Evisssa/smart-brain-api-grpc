const express = require('express');
const bcrypt =require('bcrypt-nodejs')

const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')


const db =knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'postgres',
      database : 'smart-brain-db'
    }
  });

db.select('*').from('users').then(data=>{
    console.log("Data from the users table", data);
});

  const app = express(); //running express

app.use(express.urlencoded({extended: false}));


/*const database ={
    users : [
        { 
          id : '123',  
          name : 'ben',
          email : 'ben@gmail.com',
          password: 'ben10',
          entries :0,
          joined :new Date()

        },
        {
          id : '124',
          name : 'ann',
          email : 'ann@gmail.com',
          password: 'ana123',
          entries :0,
          joined :new Date()
      }
    ]
}*/

app.use(express.json());
app.use(cors());


///app.get('/',(req,res)=>{
    //a basic route to check that the app is tunning smoothly
   // res.send('this is working')
   // res.json(database.users);
  /// res.json(db.select('*').from('users'));
///})


app.post('/signin',signin.handleSignIn(db,bcrypt))

app.post('/register', register.handleRegister(db,bcrypt))

app.get('/profile/:id',profile.handleProfile(db))

app.put('/image', image.handleImage(db))

app.post('/imageurl', (req,res)=>{image.handleApiCall(req,res)})

app.listen(3000,()=>{
    console.log('App is running on port 3000')
    
})

/* res
/ --> res = this is working
/signin --> POST = succes/fail
/register --> POST = user
/profile/userId --> GET= user
/image  --->PUT --> user

netstat -ano | findStr "3000"
taskkill /F /PID 26632
*/