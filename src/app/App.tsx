import React from "react";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "../core/auth/AuthProvider";
import AppRouter from "./router";
import { RouterProvider } from "react-router-dom";

const App: React.FC = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={AppRouter} />
      </AuthProvider>
    </QueryProvider>
  );
};

export default App;
