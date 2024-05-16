import  express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
//import OpenAI from "openai";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello World"
    })
})

app.post('/', async (req, res) => {
    try{
        
        const prompt = req.body.prompt;

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `${prompt}`,
                }
            ],
            model: "llama3-8b-8192"
        });

        res.status(200).send({
            bot: response.choices[0].message.content
        })
    }
    catch (error){
        console.log(error);
        res.status(500).send({error});
    }
})

app.listen(3000, () => {console.log('Server is listening on port http://localhost:3000 ')}) 