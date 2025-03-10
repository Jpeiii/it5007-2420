import { Ollama } from 'ollama'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch';

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })

const app = express()


const port = 8000

app.use(cors());
app.use(express.json());

app.post('/chatbot', async (req, res) => {
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

app.post('/visonparser', async (req, res) => {
  try {
    const { images } = req.body;
    const base64Images = images.map(image => image.base64.replace(/^data:image\/\w+;base64,/, ''));

    const response = await ollama.chat({
      model: 'moondream',
      messages: [{
        role: 'user',
        content: 'Describe this image',
        images: base64Images
      }]
    })
    res.status(200).json({ response: response.message.content })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error occurred while fetching response')
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})