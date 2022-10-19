import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth";
import Base from "./pages/Base";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Base />}>
                    <Route index element={<AuthPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
