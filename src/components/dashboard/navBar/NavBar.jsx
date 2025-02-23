import React from "react";

const NavBar = () => {
    return (
        <nav className="dashboard-nav">
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li><a href="#reports">Reports</a></li>
                <li><a href="#analytics">Analytics</a></li>
                <li><a href="#settings">Settings</a></li>
            </ul>
        </nav>
    );
};

export default NavBar;