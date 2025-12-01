import { useEffect } from 'react'
import './App.css'
import useCounter from './store/useCounter'

function App() {
  const { data, loading, error, connect, increment, decrement } = useCounter()

  useEffect(() => {
    connect()
  }, [connect])
  
  if(loading) return <h2>connecting...</h2>
  if(error) return <h5>Error: {error}</h5>

  return (
    <div className='container'>
      <h1>Real-Time Native Counter</h1>
      <div className='counter-value'>Count: {data ?? 0}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement   }>Decrement</button>
    </div>
  )
}

export default App
