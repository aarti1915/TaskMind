import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";



import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import Subjects from "./pages/Subjects";

import StudySessions from "./pages/StudySessions";

import Profile from "./pages/Profile";



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

                path="/"

                element={


                    <ProtectedRoute>


                        <Layout/>

                    </ProtectedRoute>


                }

                >




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





                </Route>






            </Routes>



        </BrowserRouter>


    );


}



export default App;