import React from 'react';
import {getAudioStream, exportBuffer} from './utilities/audio.js'
import Recorder from 'recorder-js';

class RecordInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stream: null,
            recording: false,
            recorder: null
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
        // Do your audio processing here.
        console.log(audio);
        this.setState({
            recording: false
        });
    }

    render() {
        const { recording, stream } = this.state;
        // Don't show record button if their browser doesn't support it.
        if (!stream) {
            return null;
        }
        return (
            <button
                onClick={() => {
                    recording ? this.stopRecord() : this.startRecord();
                }}
            >
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
        );
    }
}

export default RecordInterface;

