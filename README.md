# Flex Fit Capstone Project

## Overview
A modern, responsive fitness website built with React, featuring smooth animations, interactive elements, and a clean design to showcase fitness services and membership options.

## Features

- Responsive design that works on all devices
- Modern UI with smooth animations and transitions
- Interactive elements with hover effects
- Loading animation for better user experience
- Scroll-to-top button for easy navigation
- Smooth scrolling for anchor links
- Animated sections for features, membership plans, and testimonials
- Gradient backgrounds and modern button styles
- Optimized for deployment

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- CSS3 with modern animations and transitions
- Font Awesome for icons
- Intersection Observer API for scroll animations
- SVG backgrounds for better performance

### Deployment
- GitHub Pages for hosting
- gh-pages package for deployment automation
- GitHub Pages for hosting
- gh-pages package for deployment automation

## Installation and Setup

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Deployment

This project is configured for deployment to GitHub Pages:

1. Update the `homepage` field in `package.json` with your GitHub username:
   ```json
   "homepage": "https://yourusername.github.io/flex-fit"
   ```

2. Deploy the application:
   ```
   npm run deploy
   ```

## Project Structure

```
frontend/
├── public/
│   ├── images/
│   │   ├── cta-bg.svg
│   │   └── gym-background.svg
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Home.css
│   └── App.jsx
└── package.json
```
- AWS services (EC2, RDS, S3) for production deployment

## Local Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for frontend development)
- Python 3.11+ (for backend development)

### Running with Docker Compose

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd flex-fit-capstone
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Development Setup

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flexfitdb
   # On Windows: set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flexfitdb
   ```

5. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the frontend at http://localhost:3000

## Deployment

### AWS Deployment with Terraform

1. Navigate to the infrastructure directory:
   ```bash
   cd infra
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Create a `terraform.tfvars` file with your configuration:
   ```hcl
   project_name = "flex-fit"
   db_username  = "your_db_username"
   db_password  = "your_db_password"
   key_name     = "your_ssh_key_name"
   ```

4. Plan the deployment:
   ```bash
   terraform plan
   ```

5. Apply the configuration:
   ```bash
   terraform apply
   ```

6. After deployment, Terraform will output important information such as the EC2 instance public IP, RDS endpoint, and S3 website URL.

## Project Structure

```
flex-fit-capstone/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── crud.py        # Database operations
│   │   ├── database.py    # Database connection
│   │   ├── main.py        # FastAPI application
│   │   ├── models.py      # SQLAlchemy models
│   │   └── schemas.py     # Pydantic schemas
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.css
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── FlexFitEntryDetail.jsx
│   │   │   ├── FlexFitEntryDetail.css
│   │   │   ├── FlexFitEntryForm.jsx
│   │   │   └── FlexFitEntryForm.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── infra/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── providers.tf
├── docker-compose.yml
└── README.md
```

## License

MIT
