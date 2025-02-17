import './App.css'
import NavBar from "./components/NavBar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Business from "./pages/Business";
import StartUp from "./pages/StartUp";
import ExistingBusiness from "./pages/ExistingBusiness";
import Investors from "./pages/Investors";
import SteerifyLens from "./pages/SteerifyLens";
import Culture from "./pages/Culture";
import NewsLetter from './pages/NewsLetter';
import Blog from "./pages/Blog"
import TheTeam from "./pages/TheTeam";
import AboutUs from "./pages/AboutUs"
import ContactUs from "./pages/ContactUs"
import Footer from "./components/Footer";


function App() {

  return (
    
    <div className="App">
    <Router>
      <NavBar/>
      <Routes>
      <Route path ="/" element={<Home/>}/>
      <Route path ="/Business"  exact element={<Business/>}/>
      <Route path ="/Business/start-up" exact element={<StartUp/>}/>
      <Route path ="/Business/existing-business" exact element={<ExistingBusiness/>}/>
      <Route path ="/Business/investors" exact element={<Investors/>}/>
      <Route path ="/SteerifyLens" exact element={<SteerifyLens/>}/>
      <Route path ="/SteerifyLens/Culture" exact element={<Culture/>}/>
      <Route path ="/SteerifyLens/NewsLetter" exact element = {<NewsLetter/>}/>
      <Route path ="/SteerifyLens/Blog" exact element = {<Blog/>}/>
      <Route path ="/SteerifyLens/TheTeam" exact element = {<TheTeam/>}/>
      <Route path ="/SteerifyLens/AboutUs" exact element = {<AboutUs/>}/>
      <Route path ="/ContactUs" exact element = {<ContactUs/>}/>

      </Routes>
      <Footer/>
    </Router>
    </div>
    
  )
}

export default App
