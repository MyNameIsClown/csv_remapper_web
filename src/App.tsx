import './App.css'
import Home from './pages/home/Home'
import { BrowserRouter, Route, Routes } from 'react-router'
import Remapper from './pages/remapper/Remapper'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/remapper/:file_id' element={<Remapper/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
