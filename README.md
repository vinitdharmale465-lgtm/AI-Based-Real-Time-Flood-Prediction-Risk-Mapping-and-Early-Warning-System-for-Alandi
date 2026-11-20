# AI-Based Real-Time Flood Prediction, Risk Mapping and Early Warning System for Alandi

## About the Project
This project aims to develop an AI-based flood prediction and early warning system for Alandi, Pune. It combines weather forecasting, community reports, flood risk mapping and predictive analytics to help identify potential flood risks.

## Features
- Real-time weather information
- Rainfall forecasting
- AI/ML-based flood prediction (model integration in progress)
- Flood risk mapping
- Community-based flood reporting
- Early warning and alert system
- Analytics dashboard
- Emergency information

## Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML
- CSS
- Recharts

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas

**Weather API**
- OpenWeather API

**Machine Learning**
- Python
- Machine Learning

## Project Structure
```text
alandi-flood-dashboard/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
├── backend/
│   ├── models/
│   ├── routes/
│   └── server.js
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone Repository
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd alandi-flood-dashboard
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
```

Never upload your actual `.env` file or API keys to GitHub.

### 5. Run Backend
```bash
cd backend
npm run dev
```

### 6. Run Frontend

Open another terminal:

```bash
npm run dev
```

## Project Objective
To support flood preparedness in Alandi through weather monitoring, predictive analysis, community reporting and early warning capabilities.

## Author
Vinit Dharmale

## Project Status
Under Development
