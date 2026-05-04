import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

console.log('Main.jsx is running');
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div style={{color: 'white', padding: '20px'}}>React is mounting...</div>
    <App />
  </BrowserRouter>
)