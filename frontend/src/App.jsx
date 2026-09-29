import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import StudySessions from "./pages/StudySessions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Planner from "./pages/Planner";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){

    return (

        <BrowserRouter>
            <Routes>
                <Route
                path="/login"
                element={<Login/>}
                />

                <Route
                path="/register"
                element={<Register/>}
                />

                <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout/>
                    </ProtectedRoute>
                }
                >

                <Route
                    index
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="dashboard"
                    element={<Dashboard/>}
                />

                <Route
                    path="subjects"
                    element={<Subjects/>}
                />

                <Route
                    path="study-sessions"
                    element={<StudySessions/>}
                />

                <Route
                    path="profile"
                    element={<Profile/>}
                />

                <Route
                    path="settings"
                    element={<Settings/>}
                />

                <Route
                    path="planner"
                    element={<Planner />}
                />



                </Route>

                <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
                />



            </Routes>



        </BrowserRouter>


    );


}



export default App;