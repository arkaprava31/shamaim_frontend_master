import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import './index.css';

const firebaseConfig = {
  apiKey: "AIzaSyAEjSCWNzW3S-3LM9U2aMxoAWXf0ft1BIk",
  authDomain: "shamaim-lifestyle.firebaseapp.com",
  projectId: "shamaim-lifestyle",
  storageBucket: "shamaim-lifestyle.appspot.com",
  messagingSenderId: "253251908610",
  appId: "1:253251908610:web:86c78215bb5dd42c43e31b",
  measurementId: "G-VFR062HQ94"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();





