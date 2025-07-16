import React from 'react';
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import Connect from "../components/Connect/Connect";
import { Outlet, useNavigation, useLocation } from "react-router-dom";
import LoadingSpinner from './LoadingSpinner';

const Layout = () => {
    const navigation = useNavigation();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    return (
        <div>
            {!isAdminRoute && <NavBar />}
            {navigation.state === 'loading' && (
                <LoadingSpinner overlay message="Loading page..." />
            )}
            <main>
                <Outlet />
            </main>
            {!isAdminRoute && <Connect />}
            {!isAdminRoute && <Footer />}
        </div>
    )
}

export default Layout;
