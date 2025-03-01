import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import Connect from "../components/Connect/Connect";

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
