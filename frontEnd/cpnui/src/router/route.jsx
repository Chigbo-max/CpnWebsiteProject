import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Courses from "../pages/Courses/Courses";
import Resources from "../pages/Resources/Resources";
import Events from "../pages/Events/Events";
import Listen from "../pages/Listen/Listen";
import Blog from "../pages/Blog/Blog"
import BlogPost from "../pages/Blog/BlogPost"
import AdminDashboard from "../pages/Admin/AdminDashboard"
import TheTeam from "../pages/Team/TheTeam";
import About from "../pages/About/About"
import ContactUs from "../pages/ContactUs/ContactUs"
import Layout from "../components/Layout";
import NotFound from "../pages/Error/NotFound";
import EventCreate from "../pages/Admin/EventCreate";
import EventDetail from "../pages/Events/EventDetail";
import EventRegistrations from "../pages/Admin/EventRegistrations";
import AdminEvents from '../pages/Admin/Events';
import EventEdit from '../pages/Admin/EventEdit';
import AdminLogin from '../pages/Admin/AdminLogin';
import RequireAdminAuth from '../pages/Admin/RequireAdminAuth';
import AdminProfile from '../pages/Admin/AdminProfile';
import AdminForgotPassword from '../pages/Admin/AdminForgotPassword';
import AdminResetPassword from '../pages/Admin/AdminResetPassword';
import AdminSecuritySettings from '../pages/Admin/AdminSecuritySettings';
import Terms from '../pages/Legal/Terms';
import Privacy from '../pages/Legal/Privacy';
import DoingLeadershipDifferently from '../pages/Courses/DoingLeadershipDifferently.jsx';
import DoingWorkDifferently from '../pages/Courses/DoingWorkDifferently.jsx';

const BrowserRouter = createBrowserRouter(
    [{
        path: "/",
        element: <Layout />,
        children: [
        { path: "/", element: <Home /> },
        { path: "/courses", element: <Courses /> },
        { path: "/courses/doingWorkDifferently", element: <DoingWorkDifferently /> },
        { path: "/courses/doingLeadershipDifferently", element: <DoingLeadershipDifferently /> },
        { path: "InsideCPN/blog", element: <Blog /> },
        { path: "/blog/:slug", element: <BlogPost /> },
        { path: "/read", element: <Blog /> },
        { path: "/Resources", element: <Resources /> },
        { path: "/Resources/listen", element: <Listen /> },
        { path: "/Resources/read", element: <Blog /> },
        { path: "/events", element: <Events /> },
        { path: "/events/:eventId", element: <EventDetail /> },
        { path: "/InsideCPN/about", element: <About /> },
        { path: "/InsideCPN/team", element: <TheTeam /> },
        { path: "/contactUs", element: <ContactUs /> },
        { path: "/terms", element: <Terms /> },
        { path: "/privacy", element: <Privacy /> },
        { path: "/admin/login", element: <AdminLogin /> },
        { path: "/admin/forgot-password", element: <AdminForgotPassword /> },
        { path: "/admin/reset-password", element: <AdminResetPassword /> },
        { path: "/admin/profile", element: <RequireAdminAuth><AdminProfile /></RequireAdminAuth> },
        { path: "/admin", element: <RequireAdminAuth><AdminDashboard /></RequireAdminAuth> },
        { path: "/admin/events/create", element: <RequireAdminAuth><EventCreate /></RequireAdminAuth> },
        { path: "/admin/events/registrations", element: <RequireAdminAuth><EventRegistrations /></RequireAdminAuth> },
        { path: "/admin/events", element: <RequireAdminAuth><AdminEvents /></RequireAdminAuth> },
        { path: "/admin/events/edit/:event_id", element: <RequireAdminAuth><EventEdit /></RequireAdminAuth> },
        { path: "/admin/security", element: <RequireAdminAuth><AdminSecuritySettings /></RequireAdminAuth> },
        { path: "*", element: <NotFound /> }
        ]
    }]
)

export default BrowserRouter
