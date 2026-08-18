import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LANDING */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;