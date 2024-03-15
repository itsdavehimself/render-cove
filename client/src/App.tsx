import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './containers/Home/Home';
import SignUp from './containers/SignUp/SignUp';
import Login from './containers/Login/Login';
import CreateProjectForm from './containers/CreateProjectForm/CreateProjectForm';
import { useAuthContext } from './hooks/useAuthContext';
import { useEffect, useState } from 'react';
import WithNav from './components/WithNav/WithNav';
import WithoutNav from './components/WithoutNav/WithoutNav';
import EditProfile from './containers/EditProfile/EditProfile';
import ChooseUsername from './containers/ChooseUsername/ChooseUsername';
import UserProfilePublic from './containers/UserProfilePublic/UserProfilePublic';
import UserProfileProjects from './components/UserProfile/UserProfileProjects/UserProfileProjects';
import ProjectPage from './containers/ProjectPage/ProjectPage';
import EditProjectForm from './containers/EditProjectForm/EditProjectForm';
import { ProjectContextProvider } from './context/ProjectContext';
import UserLikes from './containers/UserLikes/UserLikes';
import UserCollections from './containers/UserCollections/UserCollections';
import { CollectionsContextProvider } from './context/CollectionsContext';
import UserProfileCollections from './components/UserProfile/UserProfileCollections/UserProfileCollections';
import ViewCollection from './components/ViewCollection/ViewCollection';
import UserProfileLatest from './components/UserProfile/UserProfileLatest/UserProfileLatest';

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
                  path="/create/project"
                  element={
                    user ? <CreateProjectForm /> : <Navigate to="/login" />
                  }
                />
                <Route path="/user/:username" element={<UserProfilePublic />}>
                  <Route
                    path="/user/:username"
                    element={<UserProfileLatest />}
                  />
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
                    element={<UserProfileCollections />}
                  />
                </Route>
                <Route
                  path="/project/:projectId"
                  element={
                    <>
                      <ProjectContextProvider>
                        <ProjectPage />
                      </ProjectContextProvider>
                    </>
                  }
                ></Route>
                <Route
                  path="/project/edit/:projectId"
                  element={
                    user ? <EditProjectForm /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/:username/likes"
                  element={user ? <UserLikes /> : <Navigate to="/login" />}
                />
                <Route
                  path="/:username/collections"
                  element={
                    user ? (
                      <>
                        <CollectionsContextProvider>
                          <UserCollections />
                        </CollectionsContextProvider>
                      </>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="/collections/:collectionId"
                  element={<ViewCollection />}
                />
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
