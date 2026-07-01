import React from 'react';

/**
 * Reusable DataTable component for displaying tabular data
 * @param {Object} props
 * @param {string[]} props.headers - Array of header names
 * @param {React.ReactNode} props.children - Table body rows (<tr> elements)
 */
const DataTable = ({ headers, children }) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
