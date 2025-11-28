import express from 'express'
import metadataRoutes from './routes/route'

const app = express()
const PORT = 5000

app.use(express.json())

app.use(metadataRoutes)

app.listen(PORT, () => console.log(`Server is listenning on PORT: ${PORT}`))