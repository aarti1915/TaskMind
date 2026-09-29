import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3500,
                        style: {
                            background: "var(--surface)",
                            color: "var(--text)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontFamily: "var(--font-sans)",
                            boxShadow: "var(--shadow-md)"
                        },
                        success: {
                            iconTheme: {
                                primary: "#16a34a",
                                secondary: "#ffffff"
                            }
                        },
                        error: {
                            iconTheme: {
                                primary: "#dc2626",
                                secondary: "#ffffff"
                            }
                        }
                    }}
                />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);
