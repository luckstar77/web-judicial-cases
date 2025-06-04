import React from 'react';
import { Outlet } from 'react-router-dom';
import ButtonAppBar from './ButtonAppBar';       // ← 既有的 AppBar
import TemporaryDrawer from '../component/TemporaryDrawer'; // ← 左側 Drawer

export default function AppLayout() {
    return (
        <>
            {/* 頂端固定 AppBar */}
            <ButtonAppBar />

            {/* 選單（依專案需要放 Fixed / Permanent / Temporary）*/}
            <TemporaryDrawer />

            {/* 用 Outlet 渲染子路由，所有子頁面自動帶有 AppBar */}
            <Outlet />
        </>
    );
}
