import React, { useEffect, useState } from 'react';
import './App.css';
import ButtonAppBar from './layout/ButtonAppBar';
import Banner from './layout/Banner';
import ContentList from './layout/ContentList';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
    return (
        <Provider store={store}>
            <div>
                <ButtonAppBar />
                <Banner />
                <ContentList />
            </div>
        </Provider>
    );
}

export default App;
