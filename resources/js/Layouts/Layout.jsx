import { Link } from '@inertiajs/react'
import React from 'react'

const Layout = ({ children }) => {
    return (
        <>
            <header>
                <nav>
                    <Link className="nav-link" href="/" style={{ color: "white" }}>Home</Link>
                    <Link href="CropImage" style={{ color: "white" }}>Crop Image</Link>
                </nav>
            </header>

            <main>{children}</main>
        </>
    )
}

export default Layout
