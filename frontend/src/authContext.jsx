import React from "react";
import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div>
      <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};
