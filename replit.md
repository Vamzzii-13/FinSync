# Overview

FinSync is a comprehensive GST (Goods and Services Tax) compliance and management platform designed to streamline tax filing processes for businesses. The application provides a complete solution for managing GST returns, processing invoices, tracking compliance metrics, and handling file uploads for tax documentation. Built as a full-stack web application, it combines modern frontend technologies with a robust backend to deliver an intuitive user experience for tax management workflows.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript, leveraging Vite as the build tool for fast development and optimized production builds. The application follows a component-based architecture with:

- **UI Framework**: Custom component library based on Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens and CSS variables
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and interactive animations
- **Charts**: Chart.js integration for data visualization and analytics dashboards

## Backend Architecture
The backend follows a RESTful API design using Express.js with TypeScript:

- **Framework**: Express.js with TypeScript for type-safe server development
- **Storage Layer**: Abstracted storage interface (IStorage) with in-memory implementation for development
- **File Handling**: Multer middleware for secure file uploads with type validation and size limits
- **Validation**: Zod schemas for runtime type checking and data validation
- **Session Management**: Express sessions with PostgreSQL store integration

## Data Storage Solutions
The application uses a hybrid approach for data persistence:

- **Database**: PostgreSQL as the primary database with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations for database schema versioning
- **Development Storage**: In-memory storage implementation for rapid development and testing
- **File Storage**: Server-side file handling with configurable storage backends

## Authentication and Authorization
Simple authentication system with:

- **Login/Registration**: Email and password-based authentication
- **Session Management**: Server-side session handling with secure cookie storage
- **Route Protection**: Client-side route guards based on authentication state
- **User Context**: React Context API for managing authentication state across components

## Data Models
The system manages several core entities:

- **Users**: Account management with company information and preferences
- **GST Returns**: Tax return filing with status tracking and period management
- **Invoices**: Invoice processing with GST validation and HSN code management
- **Uploaded Files**: File metadata tracking with processing status and type validation

# External Dependencies

## Core Libraries
- **@neondatabase/serverless**: Neon Database connection for PostgreSQL in serverless environments
- **drizzle-orm**: Type-safe ORM for database operations with automatic migration support
- **@radix-ui/***: Comprehensive set of accessible UI primitives for building the component library
- **@tanstack/react-query**: Powerful data synchronization library for server state management

## Development Tools
- **Vite**: Modern build tool with hot module replacement and optimized bundling
- **TypeScript**: Static type checking for both frontend and backend code
- **Tailwind CSS**: Utility-first CSS framework with custom design system integration

## File Processing
- **multer**: Middleware for handling multipart/form-data file uploads
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Validation and Security
- **zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle ORM and Zod for unified validation

The architecture prioritizes type safety, developer experience, and scalability while maintaining clean separation of concerns between data, business logic, and presentation layers.