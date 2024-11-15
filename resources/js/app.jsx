import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import 'react-image-crop/dist/ReactCrop.css';
import "../css/app.css";
import './bootstrap';
import Layout from './Layouts/Layout';


createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true }); // Import all pages eagerly
        let page = pages[`./Pages/${name}.jsx`]; // Find the requested page component by name

        // Set a default layout for pages that don't specify a custom layout
        page.default.layout = page.default.layout || ((page) => <Layout children={page} />);
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})
