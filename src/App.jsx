import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import Trainers from './pages/Trainers';
import Companies from './pages/Companies';
import Documents from './pages/Documents';
import About from './pages/About';

/**
 * Root application component.
 * Handles sidebar open/close state and renders the main layout.
 */
function App() {
  // Controls sidebar visibility on mobile viewports
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">
      {/* Fixed left sidebar with navigation links */}
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Main scrollable area: Navbar + page content + Footer */}
      <div className="main-content">
        <Navbar onToggleSidebar={handleToggleSidebar} />

        <main className="page-container">
          <Routes>
            {/* Dashboard is the default/home route */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Students list and individual detail */}
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentDetails />} />

            {/* Other sections */}
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/about" element={<About />} />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={
              <div className="custom-card text-center" style={{ padding: '3rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Page introuvable</h2>
                <p className="text-secondary">La page que vous cherchez n'existe pas.</p>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
