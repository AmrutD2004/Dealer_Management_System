
import {BrowserRouter ,  Routes , Route } from "react-router-dom"
import { LoginPage } from './Pages/LoginPage'
import { SignUpPage } from "./Pages/SignUpPage"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/signup' element={< SignUpPage/>}/>
      </Routes>
    
    </BrowserRouter>
  )
}

export default App