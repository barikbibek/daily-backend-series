import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import cors from 'cors'

interface ActionMessage {
  action: "increment" | "decrement";
}

const app = express()
const PORT = 8080
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

let count = 0

app.use(cors())

wss.on('connection', ws => {
    console.log('Client connected')

    ws.on('message', (message: any) => {
        try {
            const data: ActionMessage = JSON.parse(message.toString())
            if(data.action === "increment"){
                count++
            }else if(data.action === "decrement"){
                count--
            }
        } catch (error) {
            console.error(`Error: ${(error as Error).message}`)
        }

        

        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify({ type: "update", value: count }))
            }
        })
    })

    ws.on('close', () => {
        console.log('client disconnected')
    })
})

server.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`))