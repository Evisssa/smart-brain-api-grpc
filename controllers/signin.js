const handleSignIn = (db,bcrypt)=>(req,res)=>{

    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json('incorrect form submission')
    }

    
    db.select('email','hash').from('login')
    .where('email','=' ,req.body.email)
    .then((data) => {
        const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
        console.log(bcrypt.hashSync(req.body.password))
        console.log(data[0].hash)

        if(isValid){
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then ((user)=> {
                res.json(user[0])
            })
            .catch(err=> res.status(400).json('unable to get user'))
        } else{
            res.status(400).json('wrong credentials111')
        }
    }).catch(err=> res.status(400).json('wrong credentials11'))
  
}

module.exports= {
    handleSignIn :handleSignIn
}