import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux';
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route,
    type FutureConfig,
} from 'react-router-dom';

import AppLayout from './layout/AppLayout';
import AllLayout from './pages/HomePage'; // 原本首頁
import FAQPage from './pages/FAQPage';
import AboutPage from './pages/AboutPage';
import UploadCasePage from './pages/UploadCasePage';
import DiscussionPage from './pages/DiscussionPage';

export default function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<AppLayout />}>
                <Route index element={<AllLayout />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="cases" element={<DiscussionPage />} />
                <Route path="upload" element={<UploadCasePage />} />
            </Route>,
        ),
        {
            future: {
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            } as Partial<FutureConfig>,
        },
    );

    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}
