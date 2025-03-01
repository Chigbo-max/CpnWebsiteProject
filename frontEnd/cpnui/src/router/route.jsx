import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Community from "../pages/Community/Community";
import KnowledgeHub from "../pages/knowledgeHub/KnowledgeHub";
import Events from "../pages/Events/Events";
import Listen from "../pages/Listen/Listen";
import Read from "../pages/Read/Read";
import InsideCPN from "../pages/Insidecpn/InsideCPN";
import Culture from "../pages/Culture/Culture";
import NewsLetter from '../pages/NewsLetter/NewsLetter';
import Blog from "../pages/Blog/Blog"
import TheTeam from "../pages/Team/TheTeam";
import DoingWorkDifferently from "../pages/DoingWorkDifferently/DoingWorkDifferently"
import About from "../pages/About/About"
import ContactUs from "../pages/ContactUs/ContactUs"
import Layout from "../components/Layout";

const BrowserRouter = createBrowserRouter(
    [{
        path: "/",
        element: <Layout />,
        children: [
        { path: "/", element: <Home /> },
        { path: "/community", element: <Community /> },
        { path: "/community/doingWorkDifferently", element: <DoingWorkDifferently /> },
        { path: "/community/doingWorkDifferently", element: <DoingWorkDifferently /> },
        { path: "/knowledgeHub", element: <KnowledgeHub /> },
        { path: "/knowledgeHub/listen", element: <Listen /> },
        { path: "/knowledgeHub/read", element: <Read /> },
        { path: "/events", element: <Events /> },
        { path: "/insideCPN", element: <InsideCPN /> },
        { path: "/insideCPN/culture", element: <Culture /> },
        { path: "/insideCPN/newsLetter", element: <NewsLetter /> },
        { path: "/insideCPN/blog", element: <Blog /> },
        { path: "/insideCPN/theTeam", element: <TheTeam /> },
        { path: "/insideCPN/about", element: <About /> },
        { path: "/contactUs", element: <ContactUs /> }
        ]
    }]
)

export default BrowserRouter
