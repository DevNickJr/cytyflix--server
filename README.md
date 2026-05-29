
## CytyFlix
A modern housing discovery platform designed to simplify and personalize the property rental experience, starting with Lagos and expanding globally.

---

# Overview

CytyFlix helps users discover rental properties more efficiently through:

- centralized property listings
- intelligent search and filtering
- media-rich property experiences
- saved listings
- personalized recommendations
- streamlined communication with property owners and agents

The platform aims to reduce the stress, inefficiency, and lack of transparency commonly associated with traditional housing discovery processes.

---

# Core Features

- User authentication & profile management
- Property listing management
- Advanced property search & filtering
- Media uploads for listings
- Saved/bookmarked listings
- Inquiry/contact system
- Notification system
- Recommendation infrastructure (future)
- Geospatial & map-based discovery (future)

---

# Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js |
| Backend | Express.js |
| Database | PostgreSQL |
| Authentication | JWT |
| Media Storage | Cloud Object Storage |
| Queue System | Redis/BullMQ |
| Deployment | Docker |
| Hosting | Vercel + Cloud Infrastructure |

---

# Architecture

CytyFlix follows:

- Client-server architecture
- Modular monolithic backend architecture
- Layered internal module structure
- RESTful API communication

The system is designed for:

- maintainability
- scalability
- modular growth
- future distributed system evolution

---

# Project Structure

```
cytyflix/
│
├── client/
├── server/
│   ├── modules/
        ├── models/
        ├── controllers/
        ├── services/
        ├── repositories/
│   ├── middleware/
│   ├── routes/
│   └── utils/
│
├── docs/
├── docker/
└── scripts/
```

---

# Backend Module Overview

## Core Modules

- Authentication
- Users & Profiles
- Property Listings
- Search & Discovery
- Saved Listings
- Inquiries
- Notifications
- Analytics
- Recommendations (future)

---

# Getting Started

## Prerequisites

- Node.js
- PostgreSQL
- Redis (optional for async tasks)
- Docker (optional)

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd cytyflix
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```
PORT=
DATABASE_URL=
JWT_SECRET=
REDIS_URL=
CLOUD_STORAGE_KEYS=
```

---

## Run Database Migrations

```bash
npm run migrate
```

---

## Start Development Server

```bash
npm run dev
```

---

# API Overview

Base API path:

```
/api/v1
```

Core API domains:

- `/auth`
- `/profiles`
- `/properties`
- `/saved-listings`
- `/inquiries`
- `/notifications`

---

# Database

CytyFlix uses PostgreSQL due to the relational nature of:

- users
- property listings
- saved listings
- inquiries
- analytics

The schema is designed for:

- structured search
- filtering
- future geospatial querying
- recommendation systems

---

# Search & Discovery

The platform supports:

- location-based filtering
- price filtering
- amenities filtering
- property-type filtering
- pagination and sorting

Future improvements may include:

- geospatial search
- personalized ranking
- AI-assisted recommendations

---

# Media Management

Property media assets are stored separately using cloud object storage.

Planned optimizations include:

- CDN integration
- image compression
- adaptive delivery
- future video walkthrough support

---

# Scalability Strategy

The platform initially uses a modular monolith architecture for operational simplicity and rapid development.

Future scalability strategies may include:

- Redis caching
- asynchronous job queues
- distributed search infrastructure
- event-driven analytics pipelines
- selective microservice extraction

---

# Security

Security measures include:

- JWT authentication
- password hashing
- role-based authorization
- input validation
- HTTPS communication
- secure media handling

---

# Engineering Documentation

Additional documentation:

- PRD
- Software Architecture Document
- Database Design
- API Design Overview
- System Design Document
- ADRs
- Engineering Roadmap

---

# Future Roadmap

Planned future capabilities:

- AI-powered recommendations
- map-based discovery
- virtual tours
- listing verification workflows
- real-time chat
- fraud detection systems
- tenant reviews & ratings

---

# Contribution Guidelines

Engineering principles:

- maintain modular architecture
- write clear documentation
- prioritize maintainability
- avoid premature complexity
- document major architectural decisions through ADRs

---

# License

Internal/Private Project