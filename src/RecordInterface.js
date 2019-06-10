import React from 'react';
import {getAudioStream, exportBuffer} from './utilities/audio.js';
import Recorder from 'recorder-js';
import ResultsContainer from './ResultsContainer';
import './ResultsContainer.css';
import Waveform from './Waveform'

const axios = require('axios');



class RecordInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stream: null,
            recording: false,
            recorder: null,
            emotions: null,
        };
    }
    async componentDidMount() {
        let stream;
        try {
            // We will implement this later.
            stream = await getAudioStream();
        } catch (error) {
            // Users browser doesn't support audio.
            // Add your handler here.
            console.log(error);
        }
        this.setState({ stream });
    }

    startRecord() {
        const { stream } = this.state;
        const audioContext = new (window.AudioContext ||window.webkitAudioContext)();
        const recorder = new Recorder(audioContext);
        recorder.init(stream);
        this.setState(
            {
                recorder,
                recording: true
            },
            () => {
                recorder.start();
            }
        );
    }

    async stopRecord() {
        const { recorder } = this.state;
        const { buffer } = await recorder.stop();
        const audio = exportBuffer(buffer[0]);

        //Do your audio processing here.
        const formData = new FormData();
        formData.append("wave", audio)
        axios({
            url: 'http://127.0.0.1:5000/vocal_analyser/api/analyse',
            method: 'POST',
            data: formData,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            console.log(res)
            this.setState({emotions: res["data"]})
            console.log(this.state.emotions)
        })

        this.setState({
            recording: false,
        });
    }

    render() {
        const { recording, stream } = this.state;
        // Don't show interface if their browser doesn't support it.
        if (!stream) {
            return null;
        }
        return (
            <div>
                <Waveform/>
                {this.state.emotions == null? <div className = "ResultsContainer">No audio uploaded</div> : <ResultsContainer data= {this.state.emotions}/>}
                <button
                    onClick={() => {
                        recording ? this.stopRecord() : this.startRecord();
                    }}
                >
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </button>

            </div>
        );
    }
}

export default RecordInterface;
