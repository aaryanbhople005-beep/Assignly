import React from 'react';
import './HeroCard.css';

interface HeroCardProps {
  user: any;
}

const HeroCard: React.FC<HeroCardProps> = ({ user }) => {
  return (
    <div className="id-card-container">
      <div className="student-id-card glass-card">
        {/* Card Header - University Name */}
        <div className="id-card-header">
          <div className="id-logo">A</div>
          <div className="university-info">
            <h3>{user.universityName}</h3>
            <span>Student Identification Card</span>
          </div>
        </div>

        <div className="id-card-body">
          {/* Left Side - Photo */}
          <div className="id-photo-section">
            <div className="photo-frame">
              <img 
                src={user.googlePictureUrl} 
                alt={user.fullName} 
                className="id-photo"
              />
            </div>
            <div className="id-status-badge">ACTIVE</div>
          </div>

          {/* Right Side - Details */}
          <div className="id-details-section">
            <div className="detail-group">
              <label>NAME</label>
              <p className="detail-value">{user.fullName || user.googleName}</p>
            </div>
            <div className="detail-row">
              <div className="detail-group">
                <label>COURSE</label>
                <p className="detail-value">{user.courseBranch}</p>
              </div>
              <div className="detail-group">
                <label>YEAR</label>
                <p className="detail-value">{user.graduationYear}</p>
              </div>
            </div>
            <div className="detail-group">
              <label>STUDENT EMAIL</label>
              <p className="detail-value">{user.studentEmail}</p>
            </div>
          </div>
        </div>

        {/* Card Footer - Barcode / Decorative */}
        <div className="id-card-footer">
          <div className="barcode-placeholder">
            <span></span><span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
          <p className="id-number">ID NO: {user._id?.substring(18).toUpperCase() || 'STU-2026'}</p>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="bg-decor-blob blob-1"></div>
      <div className="bg-decor-blob blob-2"></div>
    </div>
  );
};

export default HeroCard;
