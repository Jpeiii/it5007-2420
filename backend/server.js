import { Ollama } from 'ollama'
import express from 'express'
import cors from 'cors'

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })

const app = express()


const port = 8000

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  try {
   
   
    const { message } = req.body
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: message }],
    })
    res.status(200).json({ response: response.message.content })
  } catch (error) {
    res.status(500).send('Error occurred while fetching response')
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})