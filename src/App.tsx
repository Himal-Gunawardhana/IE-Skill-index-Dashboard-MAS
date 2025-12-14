import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assessments from "./pages/Assessments";
import Workers from "./pages/Workers";
import Operations from "./pages/Operations";
import Styles from "./pages/Styles";
import MachineTypes from "./pages/MachineTypes";
import Reports from "./pages/Reports";
import SkillsMatrix from "./pages/SkillsMatrix";
import AttachmentStore from "./pages/AttachmentStore";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3",
    },
    secondary: {
      main: "#FF9800",
    },
    success: {
      main: "#4CAF50",
    },
    error: {
      main: "#F44336",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/assessments" element={<Assessments />} />
                      <Route path="/workers" element={<Workers />} />
                      <Route path="/operations" element={<Operations />} />
                      <Route path="/styles" element={<Styles />} />
                      <Route path="/machine-types" element={<MachineTypes />} />
                      <Route path="/skills-matrix" element={<SkillsMatrix />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/attachment-store" element={<AttachmentStore />} />
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
