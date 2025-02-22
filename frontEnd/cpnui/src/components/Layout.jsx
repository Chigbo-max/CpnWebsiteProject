import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Connect from "../components/Connect";

import { Outlet } from "react-router-dom";



function Layout() {
    return (
        <div>
            <NavBar />
            <main >
                <Outlet />
            </main>
            <Connect/>
            <Footer />
        </div>
    )
}

export default Layout
