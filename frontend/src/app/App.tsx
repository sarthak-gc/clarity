import React from "react";
import Routes from "./routes/routes";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <main className="grow">
        <Routes />
      </main>
    </div>
  );
};

export default App;
