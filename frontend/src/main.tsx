import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import App from './App.tsx';
import './index.css';
import {PageTitleProvider} from "./contexts/pageTitleContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <PageTitleProvider>
                <App/>
            </PageTitleProvider>
        </BrowserRouter>
    </StrictMode>
);