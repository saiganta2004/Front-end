# 🎯 Smart Attendance System

A comprehensive AI-powered face recognition attendance system built with modern technologies.

## 🏗️ Architecture

\`\`\`
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Spring Boot    │    │   Python Face   │
│   Frontend      │◄──►│   Backend        │◄──►│   Recognition   │
│   (Port 3000)   │    │   (Port 8080)    │    │   (Port 5000)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     MySQL       │
                       │   (Port 3306)   │
                       └─────────────────┘
\`\`\`

## 🚀 Features

### ✅ Single-User Flow
- **Registration**: Name, Email, Password, User Type (Student/Employee), Unique ID, Face Capture
- **Login**: JWT-based authentication with BCrypt password encryption
- **Dashboard**: 4 tabs - Welcome, Register Attendance, Periods, Your Data

### 🎯 Attendance System
- **7 Periods**: Each 50 minutes
- **Face Recognition**: Enhanced accuracy with FaceNet/OpenCV
- **Real-time Verification**: Live camera feed with confidence scoring
- **Status Tracking**: Present/Absent with automatic window closure

### 🔐 Security Features
- **BCrypt Password Encryption**: Secure password hashing
- **JWT Authentication**: Token-based session management
- **Face Data Encryption**: Secure biometric data storage
- **Enhanced Face Recognition**: Multiple similarity metrics for accuracy

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Spring Boot 3, Java 17, JPA/Hibernate |
| **Database** | MySQL 8.0 |
| **Face Recognition** | Python, Flask, OpenCV, face_recognition, scikit-learn |
| **Authentication** | JWT, BCrypt |
| **Deployment** | Docker, Docker Compose |

## 📊 Database Schema

### Users Table
\`\`\`sql
- id (Primary Key)
- name, email, password (BCrypt encrypted)
- user_type (STUDENT/EMPLOYEE)
- unique_id (Roll number/Employee ID)
- face_encoding (Base64 face data)
- face_registered (Boolean)
\`\`\`

### Attendance Table
\`\`\`sql
- user_id, period_number, date (Composite unique key)
- status (PRESENT/ABSENT)
- timestamp, confidence_score
\`\`\`

### Periods Table
\`\`\`sql
- period_number (1-7)
- start_time, end_time
- active (Boolean)
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd smart-attendance-system
\`\`\`

### 2. Environment Setup
Create `.env` file:
\`\`\`env
# Database
DATABASE_URL=jdbc:mysql://localhost:3306/smart_attendance
DATABASE_USERNAME=attendance_user
DATABASE_PASSWORD=attendance_pass

# JWT
JWT_SECRET=mySecretKey123456789012345678901234567890

# Services
FACE_RECOGNITION_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

### 3. Start All Services
\`\`\`bash
docker-compose up -d
\`\`\`

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Face Recognition**: http://localhost:5000/health
- **MySQL**: localhost:3306

## 📱 User Interface

### 🌟 Welcome Tab
- User info display (name, type, ID)
- Current period status
- Today's attendance summary
- Real-time period availability

### 📸 Register Attendance Tab
- Live camera feed
- Face recognition scanner
- Success/failure feedback
- Confidence scoring display

### 🕒 Periods Tab
- 7 color-coded periods
- Green ✅ = Present
- Red ❌ = Absent
- Real-time status updates

### 📅 Your Data Tab
- Calendar view of attendance
- Monthly/weekly reports
- Attendance statistics
- Export functionality

## 🔧 Development Setup

### Backend (Spring Boot)
\`\`\`bash
cd backend
./mvnw spring-boot:run
\`\`\`

### Frontend (Next.js)
\`\`\`bash
npm install
npm run dev
\`\`\`

### Face Recognition (Python)
\`\`\`bash
cd scripts
pip install -r requirements.txt
python face_recognition_service_enhanced.py
\`\`\`

### Database (MySQL)
\`\`\`bash
mysql -u root -p
source database/schema.sql
\`\`\`

## 🎯 Period Schedule

| Period | Start | End |
|--------|-------|-----|
| 1 | 09:30 AM | 10:20 AM |
| 2 | 10:20 AM | 11:10 AM |
| 3 | 11:10 AM | 12:00 PM |
| 4 | 12:00 PM | 12:50 PM |
| **Lunch** | 12:50 PM | 01:40 PM | ❌ No attendance |
| 5 | 01:40 PM | 02:30 PM |
| 6 | 02:30 PM | 03:20 PM |
| 7 | 03:20 PM | 04:10 PM |

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/today` - Today's attendance
- `GET /api/attendance/calendar` - Attendance history
- `GET /api/attendance/stats` - Attendance statistics
- `GET /api/attendance/periods` - Period information

### Face Recognition (Python)
- `POST /verify_face` - Verify face identity
- `POST /register_face` - Register new face
- `GET /health` - Service health check

## 🚀 Deployment

### Production Environment
\`\`\`bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale backend=3
\`\`\`

### Cloud Deployment
- **Frontend**: Vercel
- **Backend**: Railway/Render
- **Database**: PlanetScale/AWS RDS
- **Face Recognition**: Railway/Render

## 📈 Performance Optimizations

### Face Recognition Accuracy
- **FaceNet embeddings** with 128-dimensional vectors
- **Multiple similarity metrics**: Euclidean distance, cosine similarity, dot product
- **Enhanced confidence scoring** with combined metrics
- **Jitter augmentation** for better encoding quality

### Database Optimizations
- **Composite indexes** on frequently queried columns
- **Foreign key constraints** for data integrity
- **Connection pooling** for better performance
- **Query optimization** with JPA specifications

## 🔒 Security Measures

### Authentication & Authorization
- **BCrypt password hashing** (cost factor 12)
- **JWT tokens** with expiration
- **CORS protection** for API endpoints
- **Input validation** on all endpoints

### Face Data Security
- **Encrypted face encodings** (not raw images)
- **Secure transmission** over HTTPS
- **Data anonymization** for privacy
- **GDPR compliance** ready

## 🐛 Troubleshooting

### Common Issues

1. **Face Recognition Service Offline**
   \`\`\`bash
   docker-compose restart face-recognition
   \`\`\`

2. **Database Connection Failed**
   \`\`\`bash
   docker-compose restart mysql backend
   \`\`\`

3. **Camera Access Denied**
   - Enable camera permissions in browser
   - Use HTTPS for production deployment

4. **Low Face Recognition Accuracy**
   - Ensure good lighting conditions
   - Register face in similar conditions to usage
   - Adjust confidence thresholds in Python service

## 📊 Monitoring & Analytics

### Health Checks
- Service availability monitoring
- Database connection status
- Face recognition accuracy metrics
- API response time tracking

### Attendance Analytics
- Daily/weekly/monthly reports
- Attendance percentage calculations
- Period-wise analysis
- User behavior insights

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenCV community for computer vision tools
- Spring Boot team for the excellent framework
- Next.js team for the React framework
- face_recognition library contributors

---

**Built with ❤️ for modern attendance management**
