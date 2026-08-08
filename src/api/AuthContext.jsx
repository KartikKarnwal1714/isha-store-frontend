import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "./client";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [customer, setCustomer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const restoreSession = async () => {
    const token =
      localStorage.getItem(
        "customerToken"
      );

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response =
        await api.get("/auth/me");

      if (
        response.data?.user?.role !==
        "customer"
      ) {
        throw new Error(
          "Invalid customer session"
        );
      }

      setCustomer(
        response.data.user
      );

      localStorage.setItem(
        "customer",
        JSON.stringify(
          response.data.user
        )
      );
    } catch {
      localStorage.removeItem(
        "customerToken"
      );

      localStorage.removeItem(
        "customer"
      );

      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async ({
    phone,
    name = "",
    email = "",
  }) => {
    const response =
      await api.post(
        "/auth/customer-login",
        {
          phone,
          name,
          email,
        }
      );

    localStorage.setItem(
      "customerToken",
      response.data.token
    );

    localStorage.setItem(
      "customer",
      JSON.stringify(
        response.data.customer
      )
    );

    setCustomer(
      response.data.customer
    );

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(
      "customerToken"
    );

    localStorage.removeItem(
      "customer"
    );

    setCustomer(null);

    window.location.href =
      "/login";
  };

  const updateCustomer =
    (updatedCustomer) => {
      setCustomer(updatedCustomer);

      localStorage.setItem(
        "customer",
        JSON.stringify(
          updatedCustomer
        )
      );
    };

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        login,
        logout,
        updateCustomer,
        isAuthenticated:
          Boolean(customer),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};