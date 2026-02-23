# GD

Tournament management platform focused on organizing and operating billiards competitions.

GD is designed to handle real-world tournament workflows — from player registration to final match results — with a clear, contract-driven architecture.

---

## Overview

GD helps manage:

- Player registration and profiles
- Tournament creation and configuration
- Bracket generation and match progression
- Match result tracking
- Structured communication between client and server

The system is built to ensure predictable data flow and strong separation of concerns.

---

## Architecture

```
.
├── backend/     # Service layer and business logic
├── frontend/    # Client applications
├── proto/       # Shared service contracts
```

- Service contracts are defined once and shared across the system.
- The backend exposes typed RPC services.
- The frontend consumes generated types to avoid duplication.
- Transport, business logic, and data access are clearly separated.

The project favors clarity over complexity and explicit structure over hidden magic.

---

## Development

### Run backend

```bash
cd backend
go run main.go
```

### Run frontend

```bash
cd frontend
npm install
npm run dev
```

### Run with Docker

```bash
docker-compose up --build
```

---

## Design Principles

- Contract-first development  
- No duplicated request/response models  
- Clear separation between transport and business logic  
- Predictable state and data flow  
- Production-oriented structure  

---

## Purpose

GD is built for competitive environments where:

- Match integrity matters  
- Bracket progression must be accurate  
- Tournament state must be reliable  
- Operational workflow needs to remain simple  

---

Private project.
