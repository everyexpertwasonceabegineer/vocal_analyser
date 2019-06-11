import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions.js';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline.js';
import "./Waveform.css"


export default class Waveform extends React.Component{


  constructor(props) {
      super(props);
      this.state = {
          wavesurfer: null,
          playing: false,
          regionnote: "-"
      };
  }

  async componentDidMount(){
    // initialise wavesurfer instance
    var wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      scrollParent: true,
      minimap: true,
      plugins: [
        RegionsPlugin.create(
          {
              regions: [
                  {
                      start: 1,
                      end: 3,
                      color: 'hsla(400, 100%, 30%, 0.5)',
                      "data": { "note": "羅生門" }
                  }, {
                      start: 5,
                      end: 7,
                      color: 'hsla(200, 50%, 70%, 0.4)',
                      "data": { "note": "芥川龍之介" }
                  }
              ],
              dragSelection: {
                  slop: 5
              }
            }
        ),
        TimelinePlugin.create({
          container: "#wave-timeline",
          wavesurfer: this.wavesurfer
        })
      ]
    });

    // listeners
    wavesurfer.on('finish',  () => {
      this.setState({playing: false});
    });
    wavesurfer.on('region-in',(region) => {
      this.setState({regionnote: region.data.note});
    });
    wavesurfer.on('region-click',(region) => {
      this.setState({regionnote: region.data.note});
    });
    this.setState({wavesurfer});
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.audio !== prevProps.audio) {
      console.log("Wave Player Updated")
      if (this.props.audio === null){
        this.state.wavesurfer.empty()
      } else {
        this.state.wavesurfer.loadBlob(this.props.audio);
      }
      this.setState({
        playing: false
      })
    }
  }



  render(){
    return(
      <div className="WaveformContainer">
        {this.state.regionnote}
        <div id="waveform"></div>
        <div id="wave-timeline"></div>
        <div id ="waveform-button-container">
          <button
            onClick={() => {
                this.state.wavesurfer.playPause();
                this.setState({
                  playing: !this.state.playing
                });
            }}>
          {this.state.playing? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => {
                this.state.wavesurfer.stop();
                this.setState({
                  playing: false
                });
            }}>
          Stop
          </button>
        </div>
      </div>
    )
  }
}
