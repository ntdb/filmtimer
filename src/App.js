import React, { Component } from 'react';
import './App.css';

const RECIPE = [{
  duration: 60,
  name: 'Prewash',
  note: '102° // No agitation',
}, {
  duration: 210,
  name: 'Developer',
  note: '102° // Continuous agitation for first 10 seconds then 4 lifts every 30 seconds',
}, {
  duration: 390,
  name: 'Blix',
  note: '95° - 105° // Continuous agitation for first 10 seconds then 4 lifts every 30 seconds',
}, {
  duration: 180,
  name: 'Wash',
  note: '95° - 105° // Running water',
}, {
  duration: 60,
  name: 'Stabilizer',
  note: 'Agitage for first 15 seconds',
}];

class App extends Component {
  constructor(props) {
    super(props);

    this.tick = this.tick.bind(this);

    this.state = {
      active: false,
      step: 0,
      timer: null,
    };
  }

  componentWillMount() {
    this.interval = setInterval(this.tick, 1000);
    document.addEventListener("keydown", this.handleKeyDown.bind(this))
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener("keydown", this._handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (e.keyCode !== 32) { return; }
    e.stopPropagation();
    e.preventDefault();
    this.setState({ active: !this.state.active });
  }

  tick() {
    if (!this.state.active) { return; }

    const stepDuration = RECIPE[this.state.step].duration * 1000;
    const timer = (this.state.timer || stepDuration) - 1000;
    const active = timer > 0;
    const nextStep = RECIPE[this.state.step + 1] ? this.state.step + 1 : 0;
    const step = timer <= 0 ? nextStep : this.state.step;

    this.setState({
      active,
      step,
      timer,
    });
  }

  formatTime(nanoSeconds) {
    const rawSeconds = nanoSeconds / 1000;
    let hours   = Math.floor(rawSeconds / 3600);
    let minutes = Math.floor((rawSeconds - (hours * 3600)) / 60);
    let seconds = rawSeconds - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
  }

  render() {
    const step = RECIPE[this.state.step];

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{step.name}</h1>
          <h1 className="App-title App-timer">{this.formatTime(this.state.timer || step.duration * 1000)}</h1>
          <h1 className="App-title">{step.note}</h1>
        </header>
        <button
          className="App-button App-start"
          onClick={() => this.setState({ active: !this.state.active })}
        >{this.state.active ? 'Pause' : 'Start'}</button>
      </div>
    );
  }
}

export default App;

/*
  <button
    className="App-button"
    onClick={() => this.setState({ timer: this.state.timer + 10000 })}
  >Add 10 seconds</button>
  <button
    className="App-button"
    disabled={this.state.timer <= 10000}
    onClick={() => this.setState({ timer: this.state.timer - 10000 })}
  >Subtract 10 seconds</button>
  <button
    className="App-button"
    onClick={() => this.setState({ timer: step.duration * 1000 })}
  >Restart this step</button>
  <button
    className="App-button"
    disabled={this.state.step === 0}
    onClick={() => this.setState({
      active: false,
      step: this.state.step - 1,
    })}
  >Previous Step</button>
*/
