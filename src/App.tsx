import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import AllLayout from "./pages/HomePage"; // 原本首頁
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";
import UploadCasePage from "./pages/UploadCasePage";
import DiscussionPage from "./pages/DiscussionPage";

export default function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    {/* 外層共用版型，內含 ButtonAppBar + Drawer */}
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<AllLayout />} />
                        <Route path="faq" element={<FAQPage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="cases" element={<DiscussionPage />} />
                        <Route path="upload" element={<UploadCasePage />} />
                        {/* 其它既有子路由也搬進來即可 */}
                    </Route>
                </Routes>
            </Router>
        </Provider>
    );
}
