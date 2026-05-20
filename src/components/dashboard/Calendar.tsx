import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Video
} from 'lucide-react';
import './Calendar.css';

interface CalendarProps {
  accessToken: string | null;
  onReauthenticate?: () => void;
}

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink: string;
  hangoutLink?: string;
  colorId?: string;
}

const CalendarView: React.FC<CalendarProps> = ({ accessToken, onReauthenticate }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAuthError, setIsAuthError] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!accessToken) return;
    
    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);

      // Fetch from the primary calendar
      // Get events from the start of the current month to the end of the next month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const endOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).toISOString();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfMonth}&timeMax=${endOfNextMonth}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401 || (data.error?.status === 'PERMISSION_DENIED' && data.error?.message?.includes('scopes'))) {
          setIsAuthError(true);
          throw new Error('Assignly needs additional permissions to show your calendar. Please log in again.');
        }
        throw new Error(data.error?.message || 'Failed to fetch calendar events');
      }

      const data = await response.json();
      setEvents(data.items || []);
    } catch (err: any) {
      console.error('Calendar fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const renderHeader = () => {
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
      <div className="calendar-header-section">
        <div className="header-info">
          <h1>Calendar</h1>
          <p>Manage your schedule and meetings</p>
        </div>
        <div className="calendar-controls">
          <button className="control-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
          <h2 className="current-month">{monthName} {year}</h2>
          <button className="control-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
          <button className="refresh-btn-icon" onClick={fetchEvents} title="Refresh Sync">
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="calendar-days-grid">
        {days.map(day => <div key={day} className="day-name">{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(monthStart.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

    const rows = [];
    let days = [];
    let day = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = day.getDate();
        const isCurrentMonth = day.getMonth() === monthStart.getMonth();
        const isToday = day.getTime() === today.getTime();
        const dayEvents = events.filter(event => {
          const eventDate = new Date(event.start.dateTime || event.start.date || '');
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === day.getTime();
        });

        days.push(
          <div 
            key={day.toString()} 
            className={`calendar-cell ${!isCurrentMonth ? 'disabled' : ''} ${isToday ? 'today' : ''}`}
          >
            <span className="cell-number">{formattedDate}</span>
            <div className="cell-events">
              {dayEvents.slice(0, 3).map(event => (
                <div key={event.id} className="mini-event" title={event.summary}>
                  {event.summary}
                </div>
              ))}
              {dayEvents.length > 3 && <div className="more-events">+{dayEvents.length - 3} more</div>}
            </div>
          </div>
        );
        day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
      }
      rows.push(<div className="calendar-row" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  const renderUpcomingEvents = () => {
    const today = new Date();
    const upcoming = events
      .filter(event => new Date(event.start.dateTime || event.start.date || '') >= today)
      .slice(0, 5);

    return (
      <div className="upcoming-events-panel glass-card">
        <h3>Upcoming Events</h3>
        {upcoming.length > 0 ? (
          <div className="events-list">
            {upcoming.map(event => {
              const startDate = new Date(event.start.dateTime || event.start.date || '');
              const timeStr = event.start.dateTime 
                ? startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'All Day';
              
              return (
                <div key={event.id} className="event-item">
                  <div className="event-date-badge">
                    <span className="day">{startDate.getDate()}</span>
                    <span className="month">{startDate.toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">{event.summary}</h4>
                    <div className="event-meta">
                      <span className="meta-item"><Clock size={12} /> {timeStr}</span>
                      {event.location && <span className="meta-item"><MapPin size={12} /> {event.location}</span>}
                    </div>
                    <div className="event-actions">
                      <a href={event.htmlLink} target="_blank" rel="noopener noreferrer" className="action-link">
                        <ExternalLink size={14} /> View
                      </a>
                      {event.hangoutLink && (
                        <a href={event.hangoutLink} target="_blank" rel="noopener noreferrer" className="action-link meet">
                          <Video size={14} /> Join Meet
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-events">No upcoming events scheduled.</p>
        )}
      </div>
    );
  };

  if (loading && events.length === 0) {
    return <div className="calendar-loading"><div className="loader"></div><p>Syncing your schedule...</p></div>;
  }

  if (error && events.length === 0) {
    return (
      <div className="calendar-page">
        <div className="calendar-error glass-card">
          <AlertCircle size={48} color="#ea4335" />
          <h2>Calendar Sync Issue</h2>
          <p>{error}</p>
          {isAuthError ? (
            <button className="retry-btn" onClick={onReauthenticate}>
              <RefreshCw size={16} /> Log in again
            </button>
          ) : (
            <button className="retry-btn" onClick={fetchEvents}>
              <RefreshCw size={16} /> Retry Sync
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="calendar-container"
      >
        {renderHeader()}
        <div className="calendar-main-layout">
          <div className="calendar-grid-wrapper glass-card">
            {renderDays()}
            {renderCells()}
          </div>
          <aside className="calendar-sidebar">
            {renderUpcomingEvents()}
          </aside>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarView;
