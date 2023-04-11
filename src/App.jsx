import React from 'react'
import './App.css'

// Once you have read the above messages, you can delete all comments. 
const keys =["Q","W","E","A","S","D","Z","X","C"];

const soundClips = [["Heater 1","https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"],["Heater 2","https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"],["Heater 3","https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"],["Heater 4","https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"],["Heater 6","https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"],["DSC","https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"],["KicknHat","https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"],["RP4 Kick","https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"],["CEV_H2","https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"]];

let clipsDict = {};
keys.forEach((key,i) => clipsDict[key]=soundClips[i]);

class Display extends React.Component {
    constructor(props){
      super(props);
    }

  render(){
return (<div class="d-flex flex-column align-items-center col-4"><h3>Last sound:</h3>
        <div id="display" class="d-flex justify-content-center">
          <strong>{this.props.text}</strong>
        </div>
    </div>);
};
}

class Pads extends React.Component {
  constructor(props){
    super(props);
    this.createPads = this.createPads.bind(this);
  }
  
  createPads(){
    let keysMapped = this.props.keys.map((input) => (<button class="col drum-pad" id={this.props.clips[input][0]} onClick={this.props.handleEvent} style={this.props.activePad==input?this.props.style:{border:"2px solid white"}}>{input}<audio src={this.props.clips[input][1]} id={input} class="clip"></audio></button>));
  
    const groupedKeys = (arr = []) => {
   let arAcc = [];
      const groups = arr.reduce((acc, value) => {
      if (arAcc.length<3) {
        arAcc.push(value);
      } else {
        acc.push(arAcc);
        arAcc = [value];
      }
      return acc;
   }, []);
      if (arAcc.length>0){
        groups.push(arAcc);
      }
   return groups;
  };
    return groupedKeys(keysMapped);
  };
  
  render() {
    return (<div id="pads" class="container-fluid col-8">
        {this.createPads(this.props.keys).map((input) => (<div class="row row-pads">{input}</div>))}
        </div>);
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: "", style: {}, activePad: ""};
    
    this.handlePadAction = this.handlePadAction.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    
    this.clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
});

  }
  
  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyPress);
    
  }
  
  componentWillUnmount() {
    document.removeEventListener("keydown",this.handleKeyPress);
  };
  
  handleKeyPress(event) {
    if([81,87,69,65,83,68,90,88,67].includes(event.keyCode)){
      const elem = document.getElementById(String.fromCharCode(event.keyCode)).parentElement;
      elem.dispatchEvent(this.clickEvent);
    }
  }
  
  handlePadAction(event) {
    const sound = document.getElementById(event.target.innerText);
    this.setState({ text: event.target.id, style: {backgroundColor:"#da1383", color:"white", border:"2px solid black"}, activePad:event.target.innerText});
    sound.currentTime = 0;
    sound.play();
    setTimeout(()=> {
      this.setState((state,props) =>({text: state.text, style:{border:"2px solid black"},activePad:"" }));
    }, 100);
    
    
  }
  
  render() {
    return (
       <div id="drum-machine" class="d-flex drum-machine flex-column align-items-center">
        <h1 class="title">Drum machine</h1>
        <div class="main-view d-flex flex-row justify-content-evenly">
            <Pads keys={this.props.keys} clips={this.props.soundClips} handleEvent={this.handlePadAction} style={this.state.style} activePad={this.state.activePad}/>
            <Display text={this.state.text}/>
        </div>
      </div>
    );
  }
};

App.defaultProps = {keys: keys, soundClips: clipsDict, style:{}};

export default App