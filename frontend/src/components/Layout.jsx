import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="app-main">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
