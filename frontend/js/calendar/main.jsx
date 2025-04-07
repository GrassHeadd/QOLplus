import React from "react";
import ReactDOM from "react-dom/client";

import InspectorPanel from "./inspectorPanel.jsx";

export default function Main() {
  return (
    <section id="main">
      <InspectorPanel />
    </section>
  );
}

ReactDOM.createRoot(document.querySelector("body")).render(<Main />);