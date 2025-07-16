import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import Connect from "../components/Connect/Connect";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    return (
        <div>
            {!isAdminRoute && <NavBar />}
            <main>
                <Outlet />
            </main>
            {!isAdminRoute && <Connect />}
            {!isAdminRoute && <Footer />}
        </div>
    )
}

export default Layout
