import './App.css'
import Home from './pages/home/Home'
import { BrowserRouter, Route, Routes } from 'react-router'
import Remapper from './pages/remapper/Remapper'
import { ThemeProvider } from '@mui/material'
import { theme } from './styles/theme'

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/remapper/:file_id' element={<Remapper/>}/>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
