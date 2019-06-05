import React from 'react';
import './App.css';
import RecordInterface from './RecordInterface';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <RecordInterface/>
                <p>
                    Press the <code>button</code> above to start recording
                </p>
            </header>
        </div>
    );
}


export default App;
