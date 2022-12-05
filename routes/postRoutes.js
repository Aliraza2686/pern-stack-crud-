const express = require('express')
const pool = require('../db/connect')

const router = express.Router()

router.post('/add/post', async(req, res) => {
    const { title, body, completed } = req.body
    try{
      const newPost = await pool.query(`
            INSERT INTO posts (title, body, completed) 
            VALUES($1, $2, $3)
            RETURNING *
            `, [title, body, completed]);
       const post = newPost.rows
       res.status(201).send({msg : "success", post})

    }catch(error) {
      res.status(401).send({error : error.message})
    }
})

router.get('/posts', async (req, res) => {
    try {
        const {rows} = await pool.query("SELECT * FROM posts")
        res.status(201).send({msg : "success", rows})
    } catch (error) {
        res.status(401).send({error : error.message})
    }
})

router.get('/post/:id', async(req, res) => {
    const id = req.params.id

    try{
       const post = await pool.query(`
          SELECT * FROM posts WHERE id = $1
        `, [id])
       const rows = post.rows

       res.status(201).send({msg : "success", rows})
    }catch(error) {
      res.status(401).send({msg : error.message})
    }
})

router.put('/update/:id', async(req, res) => {
    const {id} = req.params
    const {
        title,
        completed,
        body
    } = req.body

    try{
        updatedPost = await pool.query(`
          UPDATE posts SET title = $1, body = $2, completed = $3 WHERE id = $4
          RETURNING *
          `, [title, body, completed, id])

          const rows = updatedPost.rows
          res.status(201).send({msg : "success", rows})
    }catch(error) {
        res.status(401).send({msg : error.message})
    }
})
module.exports = router