import React from "react";
import ReactDOM from "react-dom/client";

import InspectorPanel from "./inspector/inspectorPanel.jsx";
import MainArea from "./mainArea/mainArea.jsx";

export default function Main() {
  return (
    <section id="main">
      <InspectorPanel />
      <MainArea />
    </section>
  );
}

ReactDOM.createRoot(document.querySelector("body")).render(<Main />);