# Personal PSX Portfolio Manager

A full-stack web application for managing and tracking personal stock portfolios on the Pakistan Stock Exchange (PSX). Built with FastAPI backend, React frontend, and SQLite database.

## Project Overview

This application allows users to:

- Create an account and securely log in
- Create and manage multiple investment portfolios
- Track individual stock holdings with purchase prices and quantities
- View portfolio compositions and analytics
- Organize holdings by category (e.g., Tech Stocks, Energy, etc.)

## Tech Stack

### Backend

- **FastAPI** - Modern Python web framework for building APIs
- **SQLAlchemy** - SQL toolkit and Object-Relational Mapping (ORM)
- **SQLite** - Lightweight file-based database
- **Passlib** - Password hashing library
- **PyJWT** - JSON Web Token authentication
- **Python-JOSE** - JWT implementation

### Frontend

- **React** 18.2 - UI library
- **Vite** - Fast frontend build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - Charts library for data visualization
- **Lucide React** - Icon library
- **React Toastify** - Toast notifications

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
test-app/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app and endpoints
│   │   ├── models.py         # SQLAlchemy models (User, Portfolio, Holding)
│   │   ├── schemas.py        # Pydantic schemas for request/response
│   │   ├── auth.py           # Authentication and JWT logic
│   │   └── database.py       # Database configuration
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile           # Backend container image
│   └── .dockerignore        # Files to exclude from Docker build
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── index.css        # Tailwind CSS imports
│   │   ├── main.jsx         # React entry point
│   │   ├── components/
│   │   │   ├── Dashboard.jsx        # Portfolio dashboard
│   │   │   ├── PortfolioDetail.jsx  # Portfolio detail view
│   │   │   ├── Login.jsx            # Login component
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   └── services/
│   │       └── api.js               # API client setup
│   ├── index.html           # HTML entry point
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   ├── postcss.config.js    # PostCSS configuration
│   ├── Dockerfile           # Frontend container image
│   └── .dockerignore        # Files to exclude from Docker build
│
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```

## Prerequisites

### Local Development

- **Python** 3.9+ (for backend)
- **Node.js** 18+ and npm/pnpm (for frontend)
- **Git** for version control

### Using Docker

- **Docker** 20.10+
- **Docker Compose** 2.0+

## Setup Instructions

### Option 1: Local Development Setup

#### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Create and activate virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The API will be available at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs` (Swagger UI)
   - Alternative Docs: `http://localhost:8000/redoc` (ReDoc)

#### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or with pnpm: pnpm install
   ```

3. Run the development server:

   ```bash
   npm run start
   ```

   The app will open at `http://localhost:5173`

### Option 2: Docker Setup (Recommended)

1. From the root directory, start all services:

   ```bash
   docker compose up -d --build
   ```

2. Services will be available at:
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8000`
   - **API Docs**: `http://localhost:8000/docs`

3. To view logs:

   ```bash
   docker compose logs -f
   ```

4. To stop services:
   ```bash
   docker compose down
   ```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Portfolios

- `GET /portfolios` - Get all user portfolios
- `POST /portfolios` - Create new portfolio
- `DELETE /portfolios/{id}` - Delete portfolio

### Holdings

- `POST /portfolios/{id}/holdings` - Add stock holding to portfolio
- `DELETE /holdings/{id}` - Remove stock holding

## Demo Credentials

A demo account is automatically created on first run:

- **Email**: demo@sabsoft.com
- **Password**: demo123

## Features

- ✅ User authentication with JWT tokens
- ✅ Portfolio management (CRUD operations)
- ✅ Stock holdings tracking
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support
- ✅ Real-time notifications
- ✅ Charts and analytics
- ✅ RESTful API
- ✅ CORS enabled for cross-origin requests

## Environment Variables

### Backend

- `DATABASE_URL` - SQLite database path (default: `sqlite:///./investify.db`)
- `SECRET_KEY` - JWT secret key (configured in `auth.py`)

### Frontend

- API base URL is configured in `src/services/api.js`

## Database Schema

### Users Table

- `id` - Primary key
- `email` - User email (unique)
- `hashed_password` - Bcrypt hashed password

### Portfolios Table

- `id` - Primary key
- `name` - Portfolio name
- `user_id` - Foreign key to Users

### Holdings Table

- `id` - Primary key
- `portfolio_id` - Foreign key to Portfolios
- `symbol` - Stock ticker symbol (e.g., SYS, NETSOL)
- `quantity` - Number of shares
- `avg_buy_price` - Average purchase price

## Troubleshooting

### Docker Issues

- If containers fail to build, run: `docker compose down -v` then `docker compose up -d --build`
- Check logs with: `docker compose logs <service>`

### Frontend Styling Not Working

- Ensure Tailwind CSS and PostCSS are properly installed
- Run: `npm install` to update dependencies
- Restart dev server: `npm run start`

### Backend Connection Issues

- Ensure backend is running and accessible at `http://localhost:8000`
- Check CORS is enabled in `app/main.py`
- Verify `.env` file variables if using environment configuration

### Database Issues

- To reset database, delete `backend/investify.db` file
- Demo data will be recreated on next startup

## Development

### Running Tests

Currently, no test suite is configured. Consider adding pytest for backend and Jest for frontend.

### Code Style

- Backend: Follow PEP 8 conventions
- Frontend: Use Prettier and ESLint (recommended)

## Deployment

For production deployment:

1. Build Docker images:

   ```bash
   docker compose build
   ```

2. Push to container registry and deploy to cloud services (AWS, Azure, GCP, etc.)

3. Set appropriate environment variables for production

4. Use a production database (PostgreSQL recommended instead of SQLite)

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:

- Check existing issues on GitHub
- Create a new issue with detailed description
- Include error logs and steps to reproduce

---

**Last Updated**: April 2026
