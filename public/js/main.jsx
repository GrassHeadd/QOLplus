// import ReactDOM from 'react-dom/client';

// // Clear the existing HTML content
// document.body.innerHTML = "";
// document.body.insertAdjacentHTML("beforeend", `<div id="app"></div>`);

// console.log("test");

// // Render your React component instead
// const root = ReactDOM.createRoot(document.getElementById("app"));
// root.render(<h1>Hello, world</h1>);

import React from 'react';
import ReactDOM from 'react-dom/client';

console.log("test");

const App = () => {
    console.log("test");
  return <h1>Hello, world from Vite!</h1>;
};

ReactDOM.createRoot(document.getElementById('app')).render(<App />);