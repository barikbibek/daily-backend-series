import { create } from "zustand";

interface CountState {
    data: number | null,
    loading: boolean,
    error: string | null,
    connect: () => void,
    increment: () => void,
    decrement: () => void
}

const useCounter = create<CountState>((set) => {
    let ws: WebSocket | null = null

    return {
        data: null,
        loading: false,
        error: null,

        connect: () => {
            set({ loading: true, error: null })
            ws = new WebSocket('ws://localhost:8080')

            ws.onopen = () => {
                set({ loading: false })
            }

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data)
                    if(msg.type === "update"){
                        set({ data: msg.value})
                    }
                } catch (error) {
                    set({ error: 'Invalid message format' })
                }
            }

            ws.onerror = () => {
                set({ error: "WebSocket error", loading: false })
            }
            
            ws.onclose = () => {
                set({ error: "Connection closed", loading: false })
            }
        },

        increment: () => {
            ws?.send(JSON.stringify({ action: "increment" }))
        },

        decrement: () => {
            ws?.send(JSON.stringify({ action: "decrement" }))
        }
    }
})

export default useCounter;