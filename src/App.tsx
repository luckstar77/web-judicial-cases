import React, { useEffect, useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux';
import AllLayout from './layout/AllLayout';

function App() {
    return (
        <Provider store={store}>
            <AllLayout />
        </Provider>
    );
}

export default App;
