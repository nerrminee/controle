import React from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { students } from '../data/students';
import { trainers } from '../data/trainers';
import { companies } from '../data/companies';
import { BiGroup, BiAward, BiBuilding, BiTimeFive, BiLogInCircle } from 'react-icons/bi';

/**
 * Helper to parse time strings like "52h 15min" and sum them up
 * Returns formatted string like "347h 50min"
 */
const calculateTotalConnectionTime = (studentList) => {
  let totalMinutes = 0;
  
  studentList.forEach(student => {
    // Expected format "Xh Ymin" or "Xh"
    const match = student.totalTime.match(/(\d+)\s*h\s*(?:(\d+)\s*min)?/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      totalMinutes += (hours * 60) + minutes;
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}min`;
};

/**
 * Helper to get the latest 5 connections across all students
 */
const getLatestConnections = (studentList) => {
  const allConnections = [];
  
  studentList.forEach(student => {
    student.connections.forEach(conn => {
      allConnections.push({
        studentName: student.name,
        studentId: student.id,
        date: conn.date,
        login: conn.login,
        logout: conn.logout,
        duration: conn.duration,
        // Convert DD/MM/YYYY and HH:MM to a sortable timestamp
        timestamp: parseDateTime(conn.date, conn.login)
      });
    });
  });
  
  // Sort by timestamp desc, take top 5
  return allConnections.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
};

// Helper to convert DD/MM/YYYY and HH:MM to a Date timestamp
const parseDateTime = (dateStr, timeStr) => {
  const [day, month, year] = dateStr.split('/');
  const [hours, minutes] = timeStr.split(':');
  // Months are 0-indexed in JS Dates
  return new Date(year, month - 1, day, hours, minutes).getTime();
};

const Dashboard = () => {
  const totalStudentsCount = students.length;
  const totalTrainersCount = trainers.length;
  const totalCompaniesCount = companies.length;
  const totalConnectionTime = calculateTotalConnectionTime(students);
  const latestConnections = getLatestConnections(students);

  // Compute average presence and progress for summary widgets
  const avgPresence = Math.round(
    students.reduce((acc, curr) => acc + parseInt(curr.presence, 10), 0) / totalStudentsCount
  );
  
  const avgProgress = Math.round(
    students.reduce((acc, curr) => acc + parseInt(curr.progress, 10), 0) / totalStudentsCount
  );

  return (
    <div className="dashboard-page">
      {/* Statistics Cards Grid */}
      <div className="grid-stats">
        <Card 
          title="Apprenants" 
          value={totalStudentsCount} 
          icon={<BiGroup size={24} />} 
          description="Inscrits en formation" 
        />
        <Card 
          title="Formateurs" 
          value={totalTrainersCount} 
          icon={<BiAward size={24} />} 
          description="Enseignants actifs" 
        />
        <Card 
          title="Entreprises" 
          value={totalCompaniesCount} 
          icon={<BiBuilding size={24} />} 
          description="Partenaires d'accueil" 
        />
        <Card 
          title="Temps de Connexion" 
          value={totalConnectionTime} 
          icon={<BiTimeFive size={24} />} 
          description="Volume cumulé des apprenants" 
        />
      </div>

      <div className="grid-two-cols">
        {/* Left column: Latest connections */}
        <div className="dashboard-section custom-card">
          <div className="section-header flex-between mb-3">
            <h3 className="section-title flex-between">
              <BiLogInCircle size={20} className="mr-2 text-secondary" />
              Dernières connexions
            </h3>
            <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Activités récentes</span>
          </div>
          
          <DataTable headers={["Date", "Apprenant", "Connexion", "Déconnexion", "Durée"]}>
            {latestConnections.map((conn, idx) => (
              <tr key={idx}>
                <td>{conn.date}</td>
                <td><strong>{conn.studentName}</strong></td>
                <td><span className="badge badge-success">{conn.login}</span></td>
                <td><span className="badge badge-warning">{conn.logout}</span></td>
                <td>{conn.duration}</td>
              </tr>
            ))}
          </DataTable>
        </div>

        {/* Right column: Highlights and Averages */}
        <div className="dashboard-section custom-card">
          <h3 className="section-title mb-3">Statistiques Globales</h3>
          
          <div className="stat-widget mb-3">
            <div className="flex-between mb-3">
              <span className="text-secondary">Taux de présence moyen</span>
              <strong>{avgPresence}%</strong>
            </div>
            <div className="progress-container">
              <div className="progress-bar-outer">
                <div 
                  className="progress-bar-inner" 
                  style={{ width: `${avgPresence}%`, backgroundColor: 'var(--success)' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-widget mb-3">
            <div className="flex-between mb-3">
              <span className="text-secondary">Progression pédagogique moyenne</span>
              <strong>{avgProgress}%</strong>
            </div>
            <div className="progress-container">
              <div className="progress-bar-outer">
                <div 
                  className="progress-bar-inner" 
                  style={{ width: `${avgProgress}%`, backgroundColor: 'var(--primary-light)' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="school-status-card mt-3" style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Statut du Centre</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Toutes les sessions de formation se déroulent conformément au planning. Le taux d'engagement global est de <strong>très bon niveau</strong> ce mois-ci.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
