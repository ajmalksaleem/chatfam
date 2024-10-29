import { Route, Routes } from "react-router-dom"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Chat from "./pages/Chat"
import PrivateRoutes from "./components/PrivateRoutes"

function App() {

  return (
   <Routes>
      
    <Route path="/sign-in" element={<SignIn/>}/>
    <Route path="/sign-up" element={<SignUp/>}/>
    <Route element={<PrivateRoutes/>}>
    <Route path="/" element={<Chat/>}/>
    </Route>
   </Routes>
  )
}

export default App
