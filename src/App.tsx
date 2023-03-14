import React from 'react'

import './App.css'
import Metrics from './components/metrics'
import Time from './components/time'

function App() {
    return (
        <div className="App">
            <Time />
            <Metrics />
        </div>
    )
}

export default App
