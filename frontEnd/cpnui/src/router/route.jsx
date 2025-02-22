import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Community from "../pages/Community";
import KnowledgeHub from "../pages/KnowledgeHub";
import Events from "../pages/Events";
import Listen from "../pages/Listen";
import Read from "../pages/Read";
import InsideCPN from "../pages/InsideCPN";
import Culture from "../pages/Culture";
import NewsLetter from '../pages/NewsLetter';
import Blog from "../pages/Blog"
import TheTeam from "../pages/TheTeam";
import DoingWorkDifferently from "../pages/DoingWorkDifferently"
import About from "../pages/About"
import ContactUs from "../pages/ContactUs"
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
