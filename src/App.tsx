import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";

export default function App() {
  return (
    // ex: <QueryClientProvider client={client}> … </QueryClientProvider>
    <RouterProvider router={router} />
  );
}
