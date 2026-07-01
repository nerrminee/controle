import React from 'react';

/**
 * Reusable Card component for displaying metrics and stats
 * @param {Object} props
 * @param {string} props.title - Title of the card
 * @param {string|number} props.value - Main value/metric to display
 * @param {React.ReactNode} [props.icon] - Icon component
 * @param {string} [props.description] - Sub-caption or description
 */
const Card = ({ title, value, icon, description }) => {
  return (
    <div className="custom-card">
      <div className="custom-card-body">
        <div className="custom-card-content">
          <span className="custom-card-title">{title}</span>
          <h2 className="custom-card-value">{value}</h2>
          {description && <span className="custom-card-desc">{description}</span>}
        </div>
        {icon && <div className="custom-card-icon-container">{icon}</div>}
      </div>
    </div>
  );
};

export default Card;
