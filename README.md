# FlexFit — Cloud-Native Gym Management Platform

> A full-stack, cloud-native gym management application deployed on AWS. Built with a React frontend, FastAPI backend, PostgreSQL database, and infrastructure-as-code powered by Terraform.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
  - [Quick Start with Docker Compose](#quick-start-with-docker-compose)
  - [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [AWS Deployment](#aws-deployment)
  - [Infrastructure Overview](#infrastructure-overview)
  - [Terraform Deployment](#terraform-deployment)
  - [Deploy Backend to EC2](#deploy-backend-to-ec2)
  - [Deploy Frontend to S3](#deploy-frontend-to-s3)
  - [One-Click Deployment Script](#one-click-deployment-script)
  - [Cleanup](#cleanup)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

FlexFit is a production-grade, cloud-native gym management platform designed to streamline membership management, class scheduling, and member engagement. The application follows a modern three-tier architecture: a React single-page application (SPA) served via Amazon S3, a FastAPI RESTful backend running on Amazon EC2, and a managed PostgreSQL database on Amazon RDS.

Infrastructure is fully defined as code using Terraform, enabling repeatable, version-controlled deployments to AWS.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS Cloud (us-east-1)                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     VPC (10.0.0.0/16)                    │   │
│  │                                                           │   │
│  │  ┌──────────────────┐      ┌─────────────────────────┐  │   │
│  │  │  Public Subnet   │      │   Private Subnets        │  │   │
│  │  │  (10.0.1.0/24)   │      │  AZ-a: 10.0.2.0/24      │  │   │
│  │  │                  │      │  AZ-b: 10.0.3.0/24      │  │   │
│  │  │  ┌────────────┐  │      │  ┌─────────────────┐    │  │   │
│  │  │  │ EC2 t2.micro│  │      │  │  RDS PostgreSQL  │    │  │   │
│  │  │  │ (Backend)  │◄─┼──────┼─►│  db.t3.micro     │    │  │   │
│  │  │  │            │  │      │  │  (Port 5432)     │    │  │   │
│  │  │  └────────────┘  │      │  └─────────────────┘    │  │   │
│  │  └──────────────────┘      └─────────────────────────┘  │   │
│  │           │                                               │   │
│  │  ┌────────▼───────┐                                      │   │
│  │  │ Internet GW    │                                      │   │
│  │  └────────────────┘                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  S3 Bucket (Static Website Hosting — React SPA)         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
         ▲                              ▲
         │ HTTPS (Port 80/443)          │ Static Assets
    ┌────┴────┐                    ┌────┴────┐
    │  Users  │                    │ Browser │
    └─────────┘                    └─────────┘
```

---

## Features

### Member-Facing
- **Dynamic Homepage** — Hero section with animated stats, membership plan showcase, trainer profiles, and member testimonials
- **Membership Plans** — Three-tier membership (Basic $29.99, Premium $49.99, Elite $79.99) with feature comparison
- **Join & Checkout Flow** — Guided member registration form with integrated Stripe payment processing
- **Class Schedule** — Browse and filter available fitness classes by type and time
- **Trainer Profiles** — View certified trainer bios and specialties
- **AI Chatbot** — Embedded conversational assistant for common member queries

### Management
- **Member Dashboard** — View and manage gym entry records with location, fitness metrics, and notes
- **Entry Tracking** — Log fitness entries with weather data (temperature, humidity, pressure) and workout descriptions
- **CRUD Operations** — Create, read, update, and delete member fitness entries via REST API

### Technical
- **Responsive Design** — Mobile-first layout that adapts to all screen sizes
- **Smooth Animations** — Scroll-triggered animations using the Intersection Observer API
- **Loading States** — Loading spinners and skeleton screens for improved UX
- **RESTful API** — FastAPI backend with auto-generated OpenAPI/Swagger documentation
- **Containerized** — Docker and Docker Compose support for consistent local development
- **Infrastructure as Code** — Full AWS infrastructure defined in Terraform

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI component framework |
| React Router v6 | Client-side routing and navigation |
| CSS3 / Tailwind CSS | Styling, animations, and responsive layouts |
| Font Awesome 6 | Icon library |
| Stripe.js | Payment processing integration |
| React Simple Chatbot | Embedded AI chatbot |
| React Toastify | Notification toasts |
| Nginx | Production static file server inside Docker |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.11 | Server-side language |
| FastAPI 0.103 | High-performance async REST API framework |
| SQLAlchemy 2.0 | ORM for database interactions |
| Pydantic v2 | Request/response data validation and serialization |
| Alembic | Database schema migrations |
| Uvicorn | ASGI server |
| psycopg2 | PostgreSQL database driver |

### Database
| Technology | Purpose |
|---|---|
| PostgreSQL 15 | Relational database (managed via AWS RDS) |
| AWS RDS | Managed database service with automated backups |

### Infrastructure & DevOps
| Technology | Purpose |
|---|---|
| Terraform >= 1.2 | Infrastructure as Code (IaC) |
| AWS EC2 (t2.micro) | Virtual machine hosting the backend |
| AWS RDS (db.t3.micro) | Managed PostgreSQL database |
| AWS S3 | Static website hosting for React SPA |
| AWS VPC | Isolated virtual network with public/private subnets |
| Docker | Application containerization |
| Docker Compose | Multi-container local development orchestration |

---

## Prerequisites

Ensure the following tools are installed before getting started:

| Tool | Version | Install |
|---|---|---|
| Node.js | >= 18.x | [nodejs.org](https://nodejs.org) |
| npm | >= 9.x | Bundled with Node.js |
| Python | >= 3.11 | [python.org](https://python.org) |
| Docker | >= 24.x | [docker.com](https://docker.com) |
| Docker Compose | >= 2.x | [docker.com](https://docs.docker.com/compose/install/) |
| Terraform | >= 1.2.0 | [terraform.io](https://developer.hashicorp.com/terraform/install) |
| AWS CLI | >= 2.x | [aws.amazon.com](https://aws.amazon.com/cli/) |

---

## Local Development Setup

### Quick Start with Docker Compose

This is the recommended way to run the full stack locally. Docker Compose spins up the frontend, backend, and a local PostgreSQL database in one command.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DeepuML/AWS-Project.git
   cd AWS-Project
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**

   | Service | URL |
   |---|---|
   | Frontend | http://localhost:80 |
   | Backend API | http://localhost:8000 |
   | Swagger UI (API Docs) | http://localhost:8000/docs |
   | ReDoc (API Docs) | http://localhost:8000/redoc |

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Stop all services:**
   ```bash
   docker-compose down
   ```

---

### Manual Setup

#### Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate        # macOS/Linux
   # venv\Scripts\activate         # Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flexfitdb
   ```

5. **Start the development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000` and the interactive docs at `http://localhost:8000/docs`.

#### Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The React development server will be available at `http://localhost:3000` with hot-reloading enabled.

---

## Environment Variables

### Backend

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/flexfitdb` |

### Frontend (Docker / Production Build)

The frontend communicates with the backend via the `REACT_APP_API_URL` environment variable. This can be set before building:

```bash
REACT_APP_API_URL=http://<EC2_PUBLIC_IP>:8000 npm run build
```

---

## API Reference

Base URL: `http://localhost:8000` (local) or `http://<EC2_PUBLIC_IP>:8000` (production)

Interactive API documentation is auto-generated by FastAPI and available at `/docs` (Swagger UI) and `/redoc` (ReDoc).

### Endpoints

#### Health Check

```
GET /
```

**Response:**
```json
{ "message": "Welcome to the Flex Fit API" }
```

---

#### Create a Fitness Entry

```
POST /flex-fit/
```

**Request Body:**
```json
{
  "location": "New York",
  "temperature": 22.5,
  "humidity": 65.0,
  "pressure": 1013.25,
  "fitness_description": "Morning run and strength training",
  "notes": "Felt great, hit a new personal record on bench press"
}
```

**Response:** `201 Created` — Returns the created entry with `id`, `created_at`, and `updated_at` fields.

---

#### List Fitness Entries

```
GET /flex-fit/?skip=0&limit=100&location=<optional>
```

| Query Parameter | Type | Description |
|---|---|---|
| `skip` | integer | Number of records to skip (pagination offset) |
| `limit` | integer | Maximum number of records to return (max: 100) |
| `location` | string | Filter entries by location name |

**Response:** `200 OK` — Returns an array of fitness entry objects.

---

#### Get a Single Fitness Entry

```
GET /flex-fit/{entry_id}
```

**Response:** `200 OK` — Returns the fitness entry object, or `404 Not Found` if it does not exist.

---

#### Update a Fitness Entry

```
PUT /flex-fit/{entry_id}
```

**Request Body:** Same schema as the Create endpoint.

**Response:** `200 OK` — Returns the updated entry, or `404 Not Found` if it does not exist.

---

#### Delete a Fitness Entry

```
DELETE /flex-fit/{entry_id}
```

**Response:** `200 OK` — Returns `true` on success, or `404 Not Found` if the entry does not exist.

---

### Data Model

```
FlexFitEntry
├── id                 integer      Primary key, auto-incremented
├── location           string       Gym or workout location name (indexed)
├── temperature        float        Ambient temperature at the time of the entry
├── humidity           float        Ambient humidity percentage
├── pressure           float        Atmospheric pressure (hPa)
├── fitness_description string      Description of the workout or activity performed
├── notes              string|null  Optional additional notes
├── created_at         datetime     Timestamp of entry creation (UTC, auto-set)
└── updated_at         datetime|null Timestamp of last update (UTC, auto-set)
```

---

## Project Structure

```
AWS-Project/
├── backend/                        # FastAPI Python backend
│   ├── app/
│   │   ├── __init__.py             # Package initializer
│   │   ├── crud.py                 # Database CRUD operations (Create, Read, Update, Delete)
│   │   ├── database.py             # SQLAlchemy engine, session factory, and base model
│   │   ├── main.py                 # FastAPI application entry point and route definitions
│   │   ├── models.py               # SQLAlchemy ORM table models
│   │   └── schemas.py              # Pydantic request/response validation schemas
│   ├── Dockerfile                  # Multi-stage Docker image for the backend service
│   └── requirements.txt            # Python package dependencies
│
├── frontend/                       # React SPA frontend
│   ├── public/
│   │   ├── images/                 # Static background and avatar images (SVG)
│   │   ├── videos/                 # Hero section workout animation (SVG)
│   │   └── index.html              # HTML entry point
│   ├── src/
│   │   ├── assets/images/          # Bundled images (membership tiers, trainers, facilities)
│   │   ├── components/             # Reusable UI components
│   │   │   ├── ChatBot.jsx         # AI-powered chatbot widget
│   │   │   ├── ChatBot.css
│   │   │   ├── EntryForm.jsx       # Fitness entry creation form component
│   │   │   ├── EntryList.jsx       # Fitness entry list display component
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── Navbar.css
│   │   │   ├── PaymentForm.jsx     # Stripe payment form component
│   │   │   └── PaymentForm.css
│   │   ├── pages/                  # Full-page route components
│   │   │   ├── Checkout.jsx        # Membership checkout page with Stripe integration
│   │   │   ├── Classes.jsx         # Fitness classes listing page
│   │   │   ├── Dashboard.jsx       # Member dashboard with entry management
│   │   │   ├── FlexFitEntryDetail.jsx  # Individual fitness entry detail view
│   │   │   ├── FlexFitEntryForm.jsx    # Page-level fitness entry form
│   │   │   ├── Home.jsx            # Landing page with hero, features, and membership sections
│   │   │   ├── JoinForm.jsx        # New member registration page
│   │   │   ├── MemberDetail.jsx    # Individual member profile page
│   │   │   ├── Membership.jsx      # Membership plan comparison page
│   │   │   └── Trainers.jsx        # Trainer roster and profiles page
│   │   ├── App.jsx                 # Root component with React Router configuration
│   │   ├── App.css                 # Global application styles and CSS variables
│   │   ├── index.js                # React DOM entry point
│   │   └── index.css               # Base HTML reset styles
│   ├── Dockerfile                  # Nginx-based Docker image for the frontend
│   ├── nginx.conf                  # Nginx configuration for SPA routing
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── package.json                # Node.js dependencies and npm scripts
│
├── infra/                          # Terraform AWS infrastructure definitions
│   ├── main.tf                     # Core resource definitions (VPC, EC2, RDS, S3, SGs)
│   ├── variables.tf                # Input variable declarations with defaults
│   ├── outputs.tf                  # Output values (IP addresses, endpoints, bucket names)
│   ├── providers.tf                # AWS provider and Terraform version constraints
│   ├── terraform.tfvars.example    # Example variable values for reference
│   └── README.md                   # Infrastructure-specific deployment notes
│
├── scripts/                        # Deployment and operations helper scripts
│   ├── deploy_backend.sh           # Deploy backend Docker container to EC2 (Linux/macOS)
│   ├── deploy_backend.ps1          # Deploy backend Docker container to EC2 (Windows)
│   ├── deploy_frontend.sh          # Build and upload React SPA to S3 (Linux/macOS)
│   ├── deploy_frontend.ps1         # Build and upload React SPA to S3 (Windows)
│   ├── cleanup.sh                  # Destroy all Terraform-managed AWS resources (Linux/macOS)
│   └── cleanup.ps1                 # Destroy all Terraform-managed AWS resources (Windows)
│
├── docker-compose.yml              # Local multi-service orchestration (frontend + backend + DB)
├── deploy.sh                       # End-to-end deployment script (Terraform + frontend upload)
├── deploy.ps1                      # End-to-end deployment script (Windows)
└── README.md                       # This file
```

---

## AWS Deployment

### Infrastructure Overview

The following AWS resources are provisioned by Terraform:

| Resource | Service | Purpose |
|---|---|---|
| VPC | Amazon VPC | Isolated network (`10.0.0.0/16`) |
| Public Subnet | Amazon VPC | Hosts EC2 instance (`10.0.1.0/24`) |
| Private Subnet 1 | Amazon VPC | RDS primary AZ (`10.0.2.0/24`, `us-east-1a`) |
| Private Subnet 2 | Amazon VPC | RDS secondary AZ (`10.0.3.0/24`, `us-east-1b`) |
| Internet Gateway | Amazon VPC | Public internet access |
| Route Table | Amazon VPC | Routes internet traffic through IGW |
| EC2 Instance | Amazon EC2 | Backend API server (`t2.micro`, Ubuntu 20.04) |
| Security Group (EC2) | Amazon EC2 | Allows inbound SSH (22), HTTP (80), HTTPS (443), API (8000) |
| RDS Instance | Amazon RDS | PostgreSQL 15 database (`db.t3.micro`, 20 GB gp2) |
| DB Subnet Group | Amazon RDS | Multi-AZ subnet placement for RDS |
| Security Group (RDS) | Amazon RDS | Allows inbound PostgreSQL (5432) from EC2 only |
| S3 Bucket | Amazon S3 | Static website hosting for React SPA |
| S3 Bucket Policy | Amazon S3 | Public read access for static assets |

---

### Terraform Deployment

1. **Configure AWS credentials:**
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, and region (us-east-1)
   ```

2. **Navigate to the infrastructure directory:**
   ```bash
   cd infra
   ```

3. **Create your Terraform variables file:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

   Edit `terraform.tfvars` with your values:
   ```hcl
   project_name = "flex-fit"
   db_username  = "your_db_username"
   db_password  = "your_strong_db_password"
   key_name     = "your_ec2_ssh_key_pair_name"
   ```

4. **Initialize Terraform:**
   ```bash
   terraform init
   ```

5. **Review the deployment plan:**
   ```bash
   terraform plan
   ```

6. **Apply the infrastructure:**
   ```bash
   terraform apply
   ```

   Type `yes` when prompted to confirm.

7. **Note the Terraform outputs** — after a successful apply, Terraform will print:
   ```
   ec2_public_ip       = "x.x.x.x"
   rds_endpoint        = "flex-fit-db.xxxxx.us-east-1.rds.amazonaws.com:5432"
   s3_bucket_name      = "flex-fit-frontend-xxxxxxxx"
   s3_website_endpoint = "flex-fit-frontend-xxxxxxxx.s3-website-us-east-1.amazonaws.com"
   ```

---

### Deploy Backend to EC2

After Terraform provisioning is complete, deploy the backend Docker container to EC2:

```bash
# Linux/macOS
bash scripts/deploy_backend.sh

# Windows PowerShell
.\scripts\deploy_backend.ps1
```

This script will:
1. Retrieve the EC2 public IP and RDS endpoint from Terraform outputs
2. Package the backend application
3. Copy the package to the EC2 instance via SCP
4. Build and start the Docker container on the EC2 instance

---

### Deploy Frontend to S3

Build the React application and upload it to the S3 static website bucket:

```bash
# Linux/macOS
bash scripts/deploy_frontend.sh

# Windows PowerShell
.\scripts\deploy_frontend.ps1
```

This script will:
1. Run `npm run build` to produce an optimized production build
2. Sync the `build/` directory to the S3 bucket using the AWS CLI
3. Print the S3 website URL

---

### One-Click Deployment Script

To run Terraform provisioning and frontend deployment in a single step:

```bash
# Linux/macOS
bash deploy.sh

# Windows PowerShell
.\deploy.ps1
```

---

### Cleanup

To destroy all AWS resources and avoid ongoing charges:

```bash
# Linux/macOS
bash scripts/cleanup.sh

# Windows PowerShell
.\scripts\cleanup.ps1
```

> **Warning:** This operation is irreversible. All data in RDS and all files in S3 will be permanently deleted.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with descriptive messages: `git commit -m "feat: add your feature description"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against the `main` branch

### Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|---|---|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation changes only |
| `style:` | Code style changes (formatting, missing semicolons, etc.) |
| `refactor:` | Code restructuring without feature changes |
| `infra:` | Infrastructure or deployment changes |
| `chore:` | Build process or auxiliary tool changes |

---

## License

MIT License — see the [LICENSE](LICENSE) file for details.
