import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, ExternalLink, User, AlertCircle, BookOpen, 
  CheckCircle2, RotateCcw, FileUp, Calendar, Filter, 
  MessageSquare, ListTodo, Users, ArrowLeft, FileText,
  Play, Globe, GraduationCap, ChevronDown, ChevronRight, Folder, RefreshCw
} from 'lucide-react';
import './Classroom.css';

interface ClassroomProps {
  accessToken: string | null;
}

interface Teacher {
  id: string;
  name: string;
  photoUrl?: string;
}

interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  alternateLink: string;
  color: string;
}

interface StudentSubmission {
  id: string;
  state: 'NEW' | 'CREATED' | 'TURNED_IN' | 'RETURNED' | 'RECLAIMED_BY_STUDENT';
  alternateLink?: string;
  late?: boolean;
  assignedGrade?: number;
  maxPoints?: number;
  submissionTime?: string;
}

interface CourseMaterial {
  type: 'material';
  id: string;
  title: string;
  description?: string;
  creationTime: string;
  alternateLink: string;
  materials?: any[];
  topicId?: string;
}

interface CourseAssignment {
  type: 'assignment';
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  creationTime: string;
  alternateLink: string;
  submission?: StudentSubmission;
  materials?: any[];
  topicId?: string;
}

interface Announcement {
  type: 'announcement';
  id: string;
  courseId: string;
  text: string;
  creationTime: string;
  alternateLink: string;
  teacher?: Teacher;
}

interface Topic {
  id: string;
  name: string;
}

interface Person {
  id: string;
  name: string;
  photoUrl?: string;
}

type TabType = 'stream' | 'classwork' | 'people';
type TimeFilter = 'day' | 'week' | 'month' | 'year';

const COURSE_COLORS = [
  '#4285f4', '#34a853', '#fbbc05', '#ea4335', '#a142f4', '#24c1e0', '#ff6d00', '#e91e63'
];

const Classroom: React.FC<ClassroomProps> = ({ accessToken }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('stream');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({ 'no-topic': true });
  
  // State for current course
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [students, setStudents] = useState<Person[]>([]);
  const [teachers, setTeachers] = useState<Person[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  // State for all assignments across courses (for Global Deadlines)
  const [allAssignments, setAllAssignments] = useState<CourseAssignment[]>([]);
  const [isFetchingGlobal, setIsFetchingGlobal] = useState(false);

  const fetchCourses = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || 'Failed to load courses.');
      }

      const data = await res.json();
      const coursesWithColors = (data.courses || []).map((c: any, index: number) => ({
        ...c,
        color: COURSE_COLORS[index % COURSE_COLORS.length]
      }));
      setCourses(coursesWithColors);
      
      if (coursesWithColors.length === 0) {
        console.warn("No active courses found for this user.");
      }
    } catch (err: any) {
      console.error("Course fetch error:", err);
      setError(err.message || 'Failed to load courses. Please ensure you have active Google Classrooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [accessToken]);

  // Global fetch for all assignments
  useEffect(() => {
    const fetchAllCoursework = async () => {
      if (!accessToken || courses.length === 0) return;
      
      try {
        setIsFetchingGlobal(true);
        const headers = { Authorization: `Bearer ${accessToken}` };
        const fetchedTasks: CourseAssignment[] = [];

        await Promise.all(courses.map(async (course) => {
          try {
            const res = await fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, { headers });
            if (!res.ok) return;
            const data = await res.json();
            
            if (data.courseWork) {
              const courseTasks = data.courseWork.map((work: any) => ({
                type: 'assignment',
                id: work.id,
                courseId: work.courseId,
                title: work.title,
                dueDate: work.dueDate ? `${work.dueDate.day}/${work.dueDate.month}/${work.dueDate.year}` : undefined,
                creationTime: work.creationTime,
                alternateLink: work.alternateLink
              } as CourseAssignment));
              fetchedTasks.push(...courseTasks);
            }
          } catch (e) {
            console.error(`Error fetching tasks for ${course.name}:`, e);
          }
        }));

        setAllAssignments(fetchedTasks);
      } finally {
        setIsFetchingGlobal(false);
      }
    };

    if (courses.length > 0) {
      fetchAllCoursework();
    }
  }, [accessToken, courses]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!accessToken || !selectedCourse) return;
      
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${accessToken}` };
        
        const [annRes, classRes, teachRes, studRes, topicRes, matRes] = await Promise.all([
          fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/announcements`, { headers }),
          fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/courseWork`, { headers }),
          fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/teachers`, { headers }),
          fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/students`, { headers }),
          fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/topics`, { headers }),
          fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/courseWorkMaterials`, { headers })
        ]);

        // Process data even if some requests fail (some courses might not have topics, etc.)
        const annData = annRes.ok ? await annRes.json() : {};
        const classData = classRes.ok ? await classRes.json() : {};
        const teachData = teachRes.ok ? await teachRes.json() : {};
        const studData = studRes.ok ? await studRes.json() : {};
        const topicData = topicRes.ok ? await topicRes.json() : {};
        const matData = matRes.ok ? await matRes.json() : {};

        const primaryTeacher = teachData.teachers?.[0]?.profile;
        const teacherInfo = primaryTeacher ? {
          id: primaryTeacher.id,
          name: primaryTeacher.name?.fullName || 'Teacher',
          photoUrl: primaryTeacher.photoUrl?.startsWith('//') ? `https:${primaryTeacher.photoUrl}` : primaryTeacher.photoUrl
        } : undefined;

        setTopics(topicData.topic || []);
        setAnnouncements((annData.announcements || []).map((ann: any) => ({
          type: 'announcement', id: ann.id, courseId: ann.courseId, text: ann.text,
          creationTime: ann.creationTime, alternateLink: ann.alternateLink, teacher: teacherInfo
        })));

        if (classData.courseWork) {
          const assignmentsWithSub = await Promise.all(classData.courseWork.map(async (work: any) => {
            let sub: any = undefined;
            try {
              const subRes = await fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/courseWork/${work.id}/studentSubmissions`, { headers });
              if (subRes.ok) {
                const subData = await subRes.json();
                sub = subData.studentSubmissions?.[0];
              }
            } catch (e) {}
            
            return {
              type: 'assignment', id: work.id, courseId: work.courseId, title: work.title,
              description: work.description, topicId: work.topicId, materials: work.materials,
              dueDate: work.dueDate ? `${work.dueDate.day}/${work.dueDate.month}/${work.dueDate.year}` : undefined,
              creationTime: work.creationTime, alternateLink: work.alternateLink,
              submission: sub ? {
                id: sub.id, state: sub.state, alternateLink: sub.alternateLink,
                late: sub.late, assignedGrade: sub.assignedGrade, maxPoints: work.maxPoints,
                submissionTime: sub.updateTime
              } : undefined
            } as CourseAssignment;
          }));
          setAssignments(assignmentsWithSub);
        } else {
          setAssignments([]);
        }

        setMaterials((matData.courseWorkMaterial || []).map((m: any) => ({
          type: 'material', id: m.id, title: m.title, description: m.description,
          creationTime: m.creationTime, alternateLink: m.alternateLink, materials: m.materials, topicId: m.topicId
        })));

        setTeachers((teachData.teachers || []).map((t: any) => ({
          id: t.userId, name: t.profile.name?.fullName,
          photoUrl: t.profile.photoUrl?.startsWith('//') ? `https:${t.profile.photoUrl}` : t.profile.photoUrl
        })));
        setStudents((studData.students || []).map((s: any) => ({
          id: s.userId, name: s.profile.name?.fullName,
          photoUrl: s.profile.photoUrl?.startsWith('//') ? `https:${s.profile.photoUrl}` : s.profile.photoUrl
        })));

      } catch (err) {
        console.error("Course details fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCourse) fetchCourseDetails();
  }, [accessToken, selectedCourse]);

  const getStatusLabel = (state: string, late?: boolean) => {
    switch (state) {
      case 'TURNED_IN': return late ? 'Done Late' : 'Turned In';
      case 'RETURNED': return 'Graded';
      case 'RECLAIMED_BY_STUDENT': return 'Unsubmitted';
      case 'CREATED': return 'Draft';
      default: return late ? 'Missing' : 'Assigned';
    }
  };

  const renderAttachment = (mat: any, idx: number) => {
    if (mat.driveFile) {
      const file = mat.driveFile.driveFile;
      const isPdf = file.title?.toLowerCase().endsWith('.pdf');
      return (
        <div key={idx} className="attachment-item glass-card" onClick={() => window.open(file.alternateLink, '_blank')}>
          {isPdf ? <FileText size={18} color="#ea4335" /> : <Folder size={18} color="var(--accent-cyan)" />}
          <span className="attachment-title">{file.title}</span>
          <ExternalLink size={14} className="attachment-hover-icon" />
        </div>
      );
    }
    if (mat.youtubeVideo) {
      return (
        <div key={idx} className="attachment-item glass-card" onClick={() => window.open(mat.youtubeVideo.alternateLink, '_blank')}>
          <Play size={18} color="#ff0000" />
          <span className="attachment-title">{mat.youtubeVideo.title}</span>
          <ExternalLink size={14} className="attachment-hover-icon" />
        </div>
      );
    }
    if (mat.link) {
      return (
        <div key={idx} className="attachment-item glass-card" onClick={() => window.open(mat.link.url, '_blank')}>
          <Globe size={18} color="#4285f4" />
          <span className="attachment-title">{mat.link.title || mat.link.url}</span>
          <ExternalLink size={14} className="attachment-hover-icon" />
        </div>
      );
    }
    return null;
  };

  const groupedClasswork = useMemo(() => {
    const groups: Record<string, (CourseAssignment | CourseMaterial)[]> = { 'no-topic': [] };
    topics.forEach(t => groups[t.id] = []);
    
    assignments.forEach(a => {
      const tid = a.topicId || 'no-topic';
      if (groups[tid]) groups[tid].push(a);
      else groups['no-topic'].push(a);
    });
    
    materials.forEach(m => {
      const tid = m.topicId || 'no-topic';
      if (groups[tid]) groups[tid].push(m);
      else groups['no-topic'].push(m);
    });

    return groups;
  }, [assignments, materials, topics]);

  const toggleTopic = (tid: string) => {
    setExpandedTopics(prev => ({ ...prev, [tid]: !prev[tid] }));
  };

  const renderHome = () => {
    const isWithinFilter = (dateStr: string) => {
      const parts = dateStr.split('/');
      if (parts.length !== 3) return true;
      const [day, month, year] = parts.map(Number);
      const dueDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeFilter === 'day') return diffDays === 0;
      if (timeFilter === 'week') return diffDays >= 0 && diffDays <= 7;
      if (timeFilter === 'month') return diffDays >= 0 && diffDays <= 30;
      if (timeFilter === 'year') return diffDays >= 0 && diffDays <= 365;
      return true;
    };

    const upcomingDeadlines = allAssignments
      .filter(a => a.dueDate && isWithinFilter(a.dueDate))
      .sort((a, b) => {
        const [d1, m1, y1] = a.dueDate!.split('/').map(Number);
        const [d2, m2, y2] = b.dueDate!.split('/').map(Number);
        return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
      })
      .slice(0, 5);

    return (
      <div className="classroom-home-layout">
        <div className="home-main-col">
          {courses.length > 0 ? (
            <div className="courses-home-grid">
              {courses.map((course, index) => (
                <motion.div key={course.id} className="course-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedCourse(course)}>
                  <div className="course-card-header" style={{ background: course.color }}>
                    <h2>{course.name}</h2>
                    <p>{course.section || 'General'}</p>
                    <div className="course-card-avatar"><User size={24} style={{ margin: '10px', color: 'white' }} /></div>
                  </div>
                  <div className="course-card-content"><div className="card-task-preview"><ListTodo size={14} /><span>Open to see classwork</span></div></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-courses-state glass-card">
              <BookOpen size={48} color="var(--text-secondary)" />
              <h3>No classes found</h3>
              <p>We couldn't find any active courses in your Google Classroom account.</p>
              <button className="refresh-btn" onClick={fetchCourses}>
                <RefreshCw size={16} /> Refresh List
              </button>
            </div>
          )}
        </div>

        <aside className="home-sidebar">
          <div className="global-upcoming glass-card">
            <div className="sidebar-header">
              <div className="header-top">
                <Clock size={18} color="var(--accent-cyan)" />
                <h4>Global Deadlines</h4>
              </div>
              <div className="filter-group">
                {(['day', 'week', 'month'] as const).map((f) => (
                  <button 
                    key={f}
                    className={`filter-btn ${timeFilter === f ? 'active' : ''}`}
                    onClick={() => setTimeFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {isFetchingGlobal && allAssignments.length === 0 ? (
              <div className="mini-loader"></div>
            ) : upcomingDeadlines.length > 0 ? (
              <div className="upcoming-list">
                {upcomingDeadlines.map(task => (
                  <div key={task.id} className="sidebar-task-item" onClick={() => {
                    const course = courses.find(c => c.id === task.courseId);
                    if (course) {
                      setSelectedCourse(course);
                      setActiveTab('classwork');
                    }
                  }}>
                    <span className="task-name">{task.title}</span>
                    <span className="task-due">Due {task.dueDate}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-tasks">No upcoming deadlines for this period! 🎉</p>
            )}
            <button className="view-calendar-btn">
              <Calendar size={14} /> Full Schedule
            </button>
          </div>
        </aside>
      </div>
    );
  };

  const renderCourseDetails = () => (
    <div className="course-view-container">
      <button className="back-btn" onClick={() => setSelectedCourse(null)}><ArrowLeft size={18} /> Classes</button>
      <div className="course-banner" style={{ background: selectedCourse?.color }}>
        <div className="banner-content"><h1>{selectedCourse?.name}</h1><p>{selectedCourse?.section}</p></div>
      </div>
      <div className="course-nav-tabs">
        <button className={`nav-tab ${activeTab === 'stream' ? 'active' : ''}`} onClick={() => setActiveTab('stream')} style={activeTab === 'stream' ? { color: selectedCourse?.color } : {}}>Stream</button>
        <button className={`nav-tab ${activeTab === 'classwork' ? 'active' : ''}`} onClick={() => setActiveTab('classwork')} style={activeTab === 'classwork' ? { color: selectedCourse?.color } : {}}>Classwork</button>
        <button className={`nav-tab ${activeTab === 'people' ? 'active' : ''}`} onClick={() => setActiveTab('people')} style={activeTab === 'people' ? { color: selectedCourse?.color } : {}}>People</button>
      </div>

      <div className="tab-content">
        {activeTab === 'stream' && (
          <div className="stream-layout">
            <div className="upcoming-widget glass-card">
              <h4>Upcoming</h4>
              {assignments.filter(a => a.dueDate && !a.submission?.state).slice(0, 3).map(a => (
                <div key={a.id} className="upcoming-item">
                   <span className="upcoming-title">{a.title}</span>
                   <span className="upcoming-date">{a.dueDate}</span>
                </div>
              ))}
              <button className="view-btn" style={{ marginTop: '1rem', border: `1px solid ${selectedCourse?.color}`, color: selectedCourse?.color }} onClick={() => setActiveTab('classwork')}>View all</button>
            </div>
            <div className="stream-timeline">
              {announcements.length > 0 ? announcements.map((ann, index) => (
                <motion.div key={ann.id} className="announcement-card glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
                  <div className="teacher-avatar-container">
                    {ann.teacher?.photoUrl ? <img src={ann.teacher.photoUrl} className="teacher-img" alt="" style={{ borderColor: selectedCourse?.color }} /> : <div className="teacher-img empty"><User size={24} /></div>}
                  </div>
                  <div className="announcement-content">
                    <div className="post-header">
                      <span className="teacher-name" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{ann.teacher?.name}</span>
                      <div className="post-meta">{new Date(ann.creationTime).toLocaleDateString()}</div>
                    </div>
                    <div className="announcement-text">{ann.text}</div>
                  </div>
                </motion.div>
              )) : (
                <div className="empty-tab-state">
                  <MessageSquare size={40} opacity={0.3} />
                  <p>No announcements yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'classwork' && (
          <div className="classwork-topics-list">
            {Object.keys(groupedClasswork).length > 0 ? Object.keys(groupedClasswork).map(tid => {
              const topic = topics.find(t => t.id === tid);
              const items = groupedClasswork[tid];
              if (items.length === 0 && tid !== 'no-topic') return null;
              
              return (
                <div key={tid} className="topic-section">
                  <div className="topic-header" onClick={() => toggleTopic(tid)}>
                    {expandedTopics[tid] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <h3 style={{ color: selectedCourse?.color }}>{topic?.name || 'General Resources'}</h3>
                  </div>
                  
                  <AnimatePresence>
                    {expandedTopics[tid] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="topic-items">
                        {items.map((item, index) => (
                          <div key={item.id} className="classwork-item glass-card">
                            <div className="item-icon-circle" style={{ background: item.type === 'assignment' && selectedCourse?.color ? `rgba(${parseInt(selectedCourse.color.slice(1,3), 16)}, ${parseInt(selectedCourse.color.slice(3,5), 16)}, ${parseInt(selectedCourse.color.slice(5,7), 16)}, 0.1)` : 'rgba(255,255,255,0.05)' }}>
                               {item.type === 'assignment' ? <ListTodo size={20} style={{ color: selectedCourse?.color }} /> : <BookOpen size={20} />}
                            </div>
                            <div className="item-main">
                               <div className="item-top">
                                  <h4>{item.title}</h4>
                                  {item.type === 'assignment' && item.submission?.assignedGrade !== undefined && (
                                    <div className="grade-badge" style={{ background: selectedCourse?.color }}>
                                      <GraduationCap size={14} /> {item.submission.assignedGrade}/{item.submission.maxPoints}
                                    </div>
                                  )}
                               </div>
                               <div className="item-meta">
                                  {item.type === 'assignment' && item.dueDate && <span className="due-info">Due {item.dueDate}</span>}
                                  {item.type === 'assignment' && item.submission && (
                                    <span className={`status-text ${item.submission.state.toLowerCase()}`}>
                                      {getStatusLabel(item.submission.state, item.submission.late)}
                                    </span>
                                  )}
                               </div>
                               {item.description && <p className="item-desc">{item.description}</p>}
                               {item.materials && item.materials.length > 0 && (
                                 <div className="item-attachments">
                                   {item.materials.map((m, i) => renderAttachment(m, i))}
                                 </div>
                               )}
                               <div className="item-actions">
                                  <button className="open-btn" style={{ borderColor: selectedCourse?.color, color: selectedCourse?.color }} onClick={() => window.open(item.alternateLink, '_blank')}>
                                    Open in Classroom <ExternalLink size={14} />
                                  </button>
                               </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }) : (
              <div className="empty-tab-state">
                <ListTodo size={40} opacity={0.3} />
                <p>No classwork found.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'people' && (
          <div className="people-section">
            <div className="people-group">
              <div className="group-header" style={{ color: selectedCourse?.color, borderColor: selectedCourse?.color }}><h3>Teachers</h3> <Users size={20} /></div>
              {teachers.map(p => (
                <div key={p.id} className="person-row">
                  {p.photoUrl ? <img src={p.photoUrl} className="person-avatar" alt="" /> : <div className="person-avatar empty"><User size={20} /></div>}
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
            <div className="people-group">
              <div className="group-header" style={{ color: selectedCourse?.color, borderColor: selectedCourse?.color }}><h3>Classmates</h3> <span className="student-count">{students.length} students</span></div>
              {students.map(p => (
                <div key={p.id} className="person-row">
                  {p.photoUrl ? <img src={p.photoUrl} className="person-avatar" alt="" /> : <div className="person-avatar empty"><User size={20} /></div>}
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading && !selectedCourse && courses.length === 0) return <div className="classroom-loading"><div className="loader"></div><p>Launching Classroom Suite...</p></div>;

  if (error && courses.length === 0) {
    return (
      <div className="classroom-page">
        <div className="classroom-error glass-card">
          <AlertCircle size={48} color="#ea4335" />
          <h2>Connection Issue</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchCourses}>Retry Sync</button>
        </div>
      </div>
    );
  }

  return (
    <div className="classroom-page">
      <AnimatePresence mode="wait">
        {!selectedCourse ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="classroom-header"><div className="header-content"><h1>My Classes</h1><p>Your complete academic command center</p></div></header>
            {renderHome()}
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderCourseDetails()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Classroom;
