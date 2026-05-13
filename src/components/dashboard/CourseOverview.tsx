import React from 'react';
import { BookOpen } from 'lucide-react';
import './CourseOverview.css';

const courses = [
  { name: 'Artificial Intelligence', progress: 75, code: 'CS402', color: '#00f2fe' },
  { name: 'UX Design Systems', progress: 90, code: 'DES201', color: '#9d50bb' },
  { name: 'Database Architecture', progress: 45, code: 'CS305', color: '#ffc107' },
];

const CourseOverview: React.FC = () => {
  return (
    <div className="course-overview">
      <div className="section-header">
        <h3>Course Progress</h3>
        <button className="view-all">All Courses</button>
      </div>

      <div className="course-list">
        {courses.map((course, index) => (
          <div key={index} className="course-card glass-card">
            <div className="course-icon-box" style={{ background: `${course.color}15`, color: course.color }}>
              <BookOpen size={18} />
            </div>
            
            <div className="course-details">
              <div className="course-info-top">
                <span className="course-name">{course.name}</span>
                <span className="course-code">{course.code}</span>
              </div>
              
              <div className="progress-container">
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${course.progress}%`, background: course.color }}
                  ></div>
                </div>
                <span className="progress-text">{course.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOverview;
