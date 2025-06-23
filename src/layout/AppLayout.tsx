import React from 'react';
import { Outlet } from 'react-router-dom';
import ButtonAppBar from './ButtonAppBar';       // ← 既有的 AppBar

export default function AppLayout() {
    return (
        <>
            {/* 頂端固定 AppBar */}
            <ButtonAppBar />

            {/* 用 Outlet 渲染子路由，所有子頁面自動帶有 AppBar */}
            <Outlet />
        </>
    );
}
