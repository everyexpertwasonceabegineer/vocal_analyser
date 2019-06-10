import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import Regions from 'wavesurfer.js/src/plugin/regions.js';
//import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline.js';
//import Cursor from 'wavesurfer.js/src/plugin/cursor.js'


export default class Waveform extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
          wavesurfer: null,
      };
  }

  async componentDidMount(){
    var wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      scrollParent: true,
      plugins: [
        Regions.create(
          {
              regions: [
                  {
                      start: 1,
                      end: 3,
                      color: 'hsla(400, 100%, 30%, 0.5)'
                  }, {
                      start: 5,
                      end: 7,
                      color: 'hsla(200, 50%, 70%, 0.4)'
                  }
              ],
              dragSelection: {
                  slop: 5
              }
            }
        )
      ]
    });
    wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');
    this.setState({wavesurfer})
  }

  render(){
    return(
      <div>
        <button
          onClick={() => {
              this.state.wavesurfer.playPause()
          }}
        />
        <div id="waveform"></div>
        <div id="wave-timeline"></div>
      </div>
    )
  }
}
