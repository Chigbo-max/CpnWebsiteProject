import { createBrowserRouter, RouterProvider, useNavigation } from "react-router-dom";
import Home from "../pages/Home/Home";
import Community from "../pages/Community/Community";
import KnowledgeHub from "../pages/knowledgeHub/KnowledgeHub";
import Events from "../pages/Events/Events";
import Listen from "../pages/Listen/Listen";
import Culture from "../pages/Culture/Culture";
import NewsLetter from '../pages/NewsLetter/NewsLetter';
import Blog from "../pages/Blog/Blog"
import BlogPost from "../pages/Blog/BlogPost"
import AdminDashboard from "../pages/Admin/AdminDashboard"
import TheTeam from "../pages/Team/TheTeam";
import About from "../pages/About/About"
import ContactUs from "../pages/ContactUs/ContactUs"
import Layout from "../components/Layout";
import NotFound from "../pages/Error/NotFound";
import LoadingSpinner from '../components/LoadingSpinner';
import React from 'react';

const BrowserRouter = createBrowserRouter(
    [{
        path: "/",
        element: <Layout />,
        children: [
        { path: "/", element: <Home /> },
        { path: "/community", element: <Community /> },
        { path: "/blog", element: <Blog /> },
        { path: "/blog/:slug", element: <BlogPost /> },
        { path: "/read", element: <Blog /> },
        { path: "/knowledgeHub", element: <KnowledgeHub /> },
        { path: "/knowledgeHub/listen", element: <Listen /> },
        { path: "/knowledgeHub/read", element: <Blog /> },
        { path: "/knowledgeHub/blog", element: <Blog /> },
        { path: "/events", element: <Events /> },
        { path: "/insideCPN/culture", element: <Culture /> },
        { path: "/insideCPN/newsLetter", element: <NewsLetter /> },
        { path: "/insideCPN/theTeam", element: <TheTeam /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <ContactUs /> },
        { path: "/admin", element: <AdminDashboard /> },
        { path: "*", element: <NotFound /> },
        ]
    }]
);

// Global route transition spinner wrapper
export function RouterWithSpinner() {
  const navigation = useNavigation();
  return <>
    <RouterProvider router={BrowserRouter} />
    {navigation.state === 'loading' && <LoadingSpinner overlay message="Loading page..." />}
  </>;
}

export default BrowserRouter;
