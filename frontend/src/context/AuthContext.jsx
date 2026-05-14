// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [name, setName] = useState(localStorage.getItem("name") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (name) {
      localStorage.setItem("name", name);
    } else {
      localStorage.removeItem("name");
    }
  }, [token, name]);

  return (
    <AuthContext.Provider value={{ token, setToken, name, setName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
