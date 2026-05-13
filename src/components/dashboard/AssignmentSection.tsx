import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, ChevronRight } from 'lucide-react';
import './AssignmentSection.css';

const assignments = [
  {
    id: 1,
    title: 'Advanced Neural Networks Project',
    subject: 'Artificial Intelligence',
    due: 'Today, 11:59 PM',
    priority: 'Critical',
    color: '#ff4747'
  },
  {
    id: 2,
    title: 'Human-Computer Interaction Essay',
    subject: 'UX Design',
    due: 'Tomorrow',
    priority: 'Pending',
    color: '#ffc107'
  },
  {
    id: 3,
    title: 'Operating Systems Lab 4',
    subject: 'Computer Science',
    due: 'May 15, 2026',
    priority: 'Pending',
    color: '#ffc107'
  },
  {
    id: 4,
    title: 'Database Schema Design',
    subject: 'Database Systems',
    due: 'Completed',
    priority: 'Completed',
    color: '#4caf50'
  }
];

const AssignmentSection: React.FC = () => {
  return (
    <div className="assignment-section">
      <div className="section-header">
        <h3>Upcoming Assignments</h3>
        <button className="view-all">View All <ChevronRight size={16} /></button>
      </div>

      <div className="assignment-grid">
        {assignments.map((item, index) => (
          <motion.div 
            key={item.id}
            className="assignment-card glass-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, background: 'rgba(255, 255, 255, 0.05)' }}
          >
            <div className="card-top">
              <span className="subject-tag" style={{ borderLeft: `3px solid ${item.color}` }}>
                {item.subject}
              </span>
              <span className={`priority-badge ${item.priority.toLowerCase()}`}>
                {item.priority}
              </span>
            </div>
            
            <h4>{item.title}</h4>
            
            <div className="card-footer">
              <div className="due-info">
                <Clock size={14} />
                <span>{item.due}</span>
              </div>
              <div className="assignment-meta">
                <Tag size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentSection;
