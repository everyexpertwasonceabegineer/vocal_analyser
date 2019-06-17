import React from 'react';
import './App.css';
import RecordInterface from './RecordInterface';


// Main idea from
// https://medium.com/@mattywilliams/recording-audio-with-react-for-amazon-lex-646bdc1b9f75


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <p className = "title">V O C A L    A N A L Y S E R</p>
            </header>
            <RecordInterface/>
        </div>
    );
}


export default App;
