import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { OkTooltip, tooltip } from '../src';
import './index.css';

const App = () => {
  return (
    <main className="main">
      <OkTooltip />
      <span className="label" ref={tooltip('I am a tooltip!')}>
        Hover over me!
      </span>

      <div
        className="overflow-tooltip"
        ref={tooltip('I am a tooltip!', { whenOverflow: true })}
      >
        Since I overflow, a tooltip will appear below me!
      </div>

      <div
        className="overflow-tooltip"
        ref={tooltip('I am a tooltip!', { whenOverflow: true })}
      >
        No tooltip will appear below me :(
      </div>
    </main>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
