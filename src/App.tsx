import './App.css'
import Home from './pages/home/Home'
import { BrowserRouter, Route, Routes } from 'react-router'
import Remapper from './pages/remapper/Remapper'
import { ThemeProvider } from '@mui/material'
import { theme } from './styles/theme'
import Loading from './components/Loading/Loading'
import { LoadingProvider } from './utils/LoadingContext'
import { PopUpProvider } from './utils/PopUpContext'
import PopUp from './components/PopUp/PopUp'

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LoadingProvider>
          <PopUpProvider>
            <Loading/>
            <PopUp/>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/remapper/:file_id' element={<Remapper/>}/>
            </Routes>
          </PopUpProvider>
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
