import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './styles.css';

// Note: not wrapping in <React.StrictMode> on purpose — the original site mounted
// without it, and StrictMode double-fires effects in dev which would re-post the
// tweaks-panel host-protocol announcement and could confuse a host listening for
// it. Keeping mount semantics identical to the Babel-standalone version.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
