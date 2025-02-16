import { createContext, useContext, useState, useEffect } from "react";
import keycloak from "./Keycloak";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      setIsAuthenticated(authenticated);
      setToken(keycloak.token);
      localStorage.setItem("access_token", keycloak.token);
    });

    // Auto-refresh token before expiry
    const refreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(60).then((refreshed) => {
          if (refreshed) {
            setToken(keycloak.token);
            localStorage.setItem("access_token", keycloak.token);
          }
        });
      }
    }, 60000); // Check every 1 min

    return () => clearInterval(refreshInterval);
  }, []);

  const logout = () => {
    keycloak.logout();
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
