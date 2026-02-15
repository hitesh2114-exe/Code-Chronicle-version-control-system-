import React, { useEffect } from "react";
import { useNavigate, useLocation, useRoutes } from "react-router-dom";

import DashBoard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PageNotFound from "./components/PageNotFound";
import Repository from "./components/repo/Repository";
import RepoOwner from "./components/user/RepoOwner";
import SearchProfile from "./components/user/SearchProfile";
import Issues from "./components/issue/Issues";

import { useAuth } from "./authContext";
import CreateRepo from "./components/repo/CreateRepo";
import DisplayIssue from "./components/issue/DisplayIssue";
import SearchRepository from "./components/repo/SearchRepository";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protect routes
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Login />;
};

const ProjectsRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && userIdFromStorage !== "undefined" && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !["/login", "/signup"].includes(window.location.pathname)) {
      navigate("/login");
    }

    if (userIdFromStorage && window.location.pathname === "/login") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  const element = useRoutes([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <DashBoard />
        </PrivateRoute>
      ),
    },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    {
      path: "/profile",
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
    {
      path: "/repo/:id",
      element: (
        <PrivateRoute>
          <Repository />
        </PrivateRoute>
      ),
    },
    {
      path: "/userProfile/:id",
      element: (
        <PrivateRoute>
          <RepoOwner />
        </PrivateRoute>
      ),
    },
    {
      path : "/createrepo",
      element : (
        <PrivateRoute>
          <CreateRepo/>
        </PrivateRoute>
      )
    },
    {
      path : "/search",
      element: (
        <PrivateRoute>
          <SearchProfile/>
        </PrivateRoute>
      )

    },
    {
      path : "/searchrepo",
      element: (
        <PrivateRoute>
          <SearchRepository/>
        </PrivateRoute>
      )

    },
    {
      path: "/issues/:id",
      element: (
        <PrivateRoute>
          <Issues />
        </PrivateRoute>
      ),
    },
    {
      path: "/displayissues/:id",
      element: (
        <PrivateRoute>
          <DisplayIssue />
        </PrivateRoute>
      ),
    },
    {
      path: "/*",
      element: (
        <PrivateRoute>
          <PageNotFound />
        </PrivateRoute>
      ),
    },
  ]);

  return (
    <>
      <ScrollToTop />
      {element}
    </>
  );
};

export default ProjectsRoutes;