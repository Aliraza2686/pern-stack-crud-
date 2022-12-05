const express = require('express')
const pool = require('../db/connect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

const genToken = (id) => {
   const token = jwt.sign(id, 'gentoken')
   return token
}

router.post('/register', async(req, res) => {
    const {
        name,
        email,
        password
    } = req.body

    if(!email || !name || !password) {
        return res.send({msg : "please fill in credentials"})
    }
    if(password.length < 6) {
        return res.send({msg : "Password must be greater than 6 digits"})
    }
    if(!email.includes('@gmail.com')){
       return res.send({msg : "please insert a valid email"})
    }
    try{

        const alreadyexist = await pool.query(`
           SELECT * FROM users WHERE email = $1
        `, [email])

      if(alreadyexist.rows[0]) {
        return res.send({msg : `${alreadyexist.rows[0].email} already exist please try another email`})
      }
    
      const hashedPassword = await bcrypt.hash(password, 8)
      const newUser = await pool.query(`
        INSERT INTO users (name, email, password) VALUES($1, $2, $3)
        RETURNING *
      `, [name, email, hashedPassword])

      const token = genToken(newUser.rows[0].id)
      res.status(201).send({msg : "success", user : newUser.rows, token})
    console.log(hashedPassword)
    }catch(error) {
      res.status(401).send({msg : error.message})
    }
})

router.post('/login', async(req, res) => {
  const {
    email,
    password
  } = req.body

  if(!email || !password) {
    return res.send({msg : "please enter credentials"})
  }

  try{
   const findByEmail = await pool.query(`
      SELECT * FROM users WHERE email = $1 
   `, [email])
   if(!findByEmail.rows[0]){
      return res.send({msg : 'invalid email'})
   }
   const isMatch = await bcrypt.compare(password, findByEmail.rows[0].password)
   if(!isMatch) {
     return res.send({msg : "invalid password"})
   }
   if(!findByEmail.rows[0] && !isMatch) {
    return res.send({msg : "invalid credentials"})
   }

   if(findByEmail && isMatch) {
       const token = genToken(findByEmail.rows[0].password)
       res.status(201).send({msg : "success", token})
   }
  }catch(error) {
      res.status(401).send({msg : error.message})
  }
})

module.exports = router