import React from 'react';
import {getAudioStream, exportBuffer, mergeBuffers} from './utilities/audio.js';
import Recorder from 'recorder-js';
import ResultsContainer from './ResultsContainer';
import './ResultsContainer.css';
import Waveform from './Waveform';
import IBMSpeechToTextContainer from './IBMSpeechToTextContainer';

const axios = require('axios');


class RecordInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stream: null,
            recording: false,
            recorder: null,
            emotions: null,
            audio: null,
            bufferstack: [],
            page: 1
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
                recording: true,
                audio: null
            },
            () => {
                recorder.start();
            }
        );

        // testing out multiple calls to API
        setTimeout(
            () => this.intermediateStop(),
            1000
        );
        setTimeout(
            () => this.stopRecord(),
            2000
        );
    }

    async stopRecord() {
        const { recorder } = this.state;
        const { buffer } = await recorder.stop();
        const audio = exportBuffer(buffer[0]);

        //Do your audio processing here.
        this.calltoAPI(audio);

        // add last part of audio
        this.state.bufferstack.push(buffer[0])

        this.setState({
            recording: false,
            audio: exportBuffer(mergeBuffers(this.state.bufferstack, this.state.bufferstack.length * this.state.bufferstack[0].length))
        });
    }

    async intermediateStop() {
        const { recorder } = this.state;
        const { buffer } = await recorder.stop();
        const audio = exportBuffer(buffer[0]);
        this.state.bufferstack.push(buffer[0])

        //Do your audio processing here.
        this.calltoAPI(audio);
        this.state.recorder.start();
    }

    async calltoAPI(audio){
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
          this.setState({emotions: res["data"]})
          console.log(this.state.emotions)
      })
    }


    render() {
        const { recording, stream } = this.state;
        // Don't show interface if their browser doesn't support it.
        if (!stream) {
            return null;
        }

        let pageToShow;
        if (this.state.page === 1 && this.state.emotions === null) {
            pageToShow = <div className = "ResultsContainer">No audio uploaded</div>;
        } else if(this.state.page ===1 && this.state.emotions!==null){
            pageToShow = <ResultsContainer data= {this.state.emotions}/>
        } else {
            pageToShow = <IBMSpeechToTextContainer/>;
        }
        return (
            <div>
                <Waveform audio = {this.state.audio} />
                <button
                    onClick={() => {
                        this.setState({page : 1});
                    }}
                > 1 </button>
                <button
                    onClick={() => {
                        this.setState({page : 2});
                    }}
                > 2 </button>

                {pageToShow}
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
