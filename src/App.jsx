import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./theme.css";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Countries
import CountriesList from "./pages/countries/CountriesList";
import AddCountry from "./pages/countries/AddCountry";
import EditCountry from "./pages/countries/EditCountry";
import ViewCountry from "./pages/countries/ViewCountry";

// Applicants
import ApplicantsList from "./pages/applicants/ApplicantsList";
import CreateApplicant from "./pages/applicants/CreateApplicant";
import EditApplicant from "./pages/applicants/EditApplicant";
import ViewApplicant from "./pages/applicants/ViewApplicant";

// Agents
import AgentsList from "./pages/agents/AgentsList";
import CreateAgent from "./pages/agents/CreateAgent";
import EditAgent from "./pages/agents/EditAgent";
import ViewAgent from "./pages/agents/ViewAgent";

// Records
import RecordsList from "./pages/records/RecordsList";
import AddRecord from "./pages/records/AddRecord";
import EditRecord from "./pages/records/EditRecord";
import Ready from "./pages/records/Ready";
// PCC Records
import PCCRecords from "./pages/pcc/PCCRecords";
import AddPCCRecord from "./pages/pcc/AddPCCRecord";
import EditPCCRecord from "./pages/pcc/EditPCCRecord";
import PassportValidityCheck from "./pages/records/PassportValidityCheck";
// Admin Tools
import AdminTools from "./pages/admin/AdminTools";
import PaymentManagement from "./pages/admin/PaymentManagement";
import UserManagement from "./pages/admin/UserManagement";
import Payment from "./pages/admin/Payment";
import Status from "./pages/records/Status";
import Depth from "./pages/records/Depth";
//appointments
import Appointments from "./pages/records/Appointments";
import PublicAgent from "./pages/agents/PublicAgent";
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/publicagent" element={<PublicAgent />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />

      {/* Countries */}
      <Route
        path="/countries"
        element={
          <ProtectedRoute>
            <CountriesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/countries/add"
        element={
          <ProtectedRoute>
            <AddCountry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/countries/edit/:id"
        element={
          <ProtectedRoute>
            <EditCountry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/countries/view/:id"
        element={
          <ProtectedRoute>
            <ViewCountry />
          </ProtectedRoute>
        }
      />

      {/* Applicants */}
      <Route
        path="/applicants"
        element={
          <ProtectedRoute>
            <ApplicantsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicants/create"
        element={
          <ProtectedRoute>
            <CreateApplicant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicants/edit/:id"
        element={
          <ProtectedRoute>
            <EditApplicant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicants/view/:id"
        element={
          <ProtectedRoute>
            <ViewApplicant />
          </ProtectedRoute>
        }
      />

      {/* Agents */}
      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <AgentsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agents/create"
        element={
          <ProtectedRoute>
            <CreateAgent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agents/edit/:id"
        element={
          <ProtectedRoute>
            <EditAgent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agents/view/:id"
        element={
          <ProtectedRoute>
            <ViewAgent />
          </ProtectedRoute>
        }
      />

      {/* Records */}
      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <RecordsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records/add"
        element={
          <ProtectedRoute>
            <AddRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records/edit/:id"
        element={
          <ProtectedRoute>
            <EditRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/printanalysis"
        element={
          <ProtectedRoute>
            <Depth />
          </ProtectedRoute>
        }
      />
      {/* PCC Records */}
      <Route
        path="/pcc"
        element={
          <ProtectedRoute>
            <PCCRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pcc/add"
        element={
          <ProtectedRoute>
            <AddPCCRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pcc/edit/:id"
        element={
          <ProtectedRoute>
            <EditPCCRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/passport"
        element={
          <ProtectedRoute>
            <PassportValidityCheck />
          </ProtectedRoute>
        }
      />
      <Route
        path="/statussearch"
        element={
          <ProtectedRoute>
            <Status />
          </ProtectedRoute>
        }
      />
      {/* Admin Tools */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminTools />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute roles={["admin"]}>
            <PaymentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments-view"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Payment />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
      <Route
        path="/readycandidates"
        element={
          <ProtectedRoute>
            <Ready />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Navbar />
        <main style={{ padding: "1rem" }}>
          <AppRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
}
