import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './containers/Home/Home';
import SignUp from './containers/SignUp/SignUp';
import Login from './containers/Login/Login';
import CreateProjectForm from './components/CreateProjectForm/CreateProjectForm';
import { useAuthContext } from './hooks/useAuthContext';
import { useEffect, useState } from 'react';
import WithNav from './components/WithNav/WithNav';
import WithoutNav from './components/WithoutNav/WithoutNav';
import EditProfile from './containers/EditProfile/EditProfile';
import ChooseUsername from './containers/ChooseUsername/ChooseUsername';
import UserProfilePublic from './containers/UserProfilePublic/UserProfilePublic';
import UserProfileProjects from './components/UserProfile/UserProfileProjects/UserProfileProjects';

function App() {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);
  }, [user]);

  return (
    <div className="App">
      <BrowserRouter>
        {!isLoading ? (
          <>
            <Routes>
              <Route element={<WithoutNav />}>
                <Route
                  path="/signup"
                  element={!user ? <SignUp /> : <Navigate to="/" />}
                />
                <Route
                  path="/login"
                  element={!user ? <Login /> : <Navigate to="/" />}
                />
                <Route
                  path="/signup/username"
                  element={!user ? <ChooseUsername /> : <Navigate to="/" />}
                />
              </Route>
              <Route element={<WithNav />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route
                  path="/create"
                  element={
                    user ? <CreateProjectForm /> : <Navigate to="/login" />
                  }
                />
                <Route path="/user/:username" element={<UserProfilePublic />}>
                  <Route
                    path="/user/:username/projects"
                    element={<UserProfileProjects />}
                  />
                  <Route
                    path="/user/:username/case-studies"
                    element={<UserProfileProjects />}
                  />
                  <Route
                    path="/user/:username/tutorials"
                    element={<UserProfileProjects />}
                  />
                  <Route
                    path="/user/:username/collections"
                    element={<UserProfileProjects />}
                  />
                </Route>
              </Route>
            </Routes>
          </>
        ) : (
          <div>Loading....</div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
