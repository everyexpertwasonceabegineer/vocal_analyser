import React from 'react';
import './App.css';
import RecordInterface from './RecordInterface';

// Main idea from
// https://medium.com/@mattywilliams/recording-audio-with-react-for-amazon-lex-646bdc1b9f75


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
