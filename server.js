const express = require("express")
const cors = require("cors")
const {Pool} = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const pool = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized:false
  }  
})

app.get("/tasks",async(req,res)=>{
    try{
        const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC")
        res.json(result.rows)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

app.post("/tasks",async(req,res)=>{
    try{
        const {date,area} = req.body
        const result = await pool.query("INSERT INTO tasks(date,area) VALUES($1,$2) RETURNING *",[date,area])
        res.json(result.rows[0])
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

app.delete("/tasks/:id",async(req,res)=>{
    try{
        await pool.query("DELETE FROM tasks WHERE id=$1",[req.params.id])
        res.json({
            message:"deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server running on PORT ${PORT}`)
})
    
