# Job Management System

## Project Summary

### Overview

This project implements a job management system with a backend built on **Node.js (Express with TypeScript)** and a frontend using **Next.js**. The system fetches random Unsplash food images with job execution times ranging from 5 seconds to 5 minutes.

### Key Features

1. **Asynchronous Job Processing**:
   Jobs are processed on the backend using **Worker Threads**, which allow concurrent processing without overloading the event loop. This ensures the backend remains responsive, even under heavy job loads.

2. **Real-Time Updates with SSE**:
   The server uses **Server-Sent Events (SSE)** to notify the client in real-time when a job is resolved. This eliminates the need for polling and enhances user experience by providing immediate updates.

3. **Efficient Concurrency**:
   Worker Threads enable the server to handle multiple jobs concurrently. Each job fetches a random Unsplash image and saves the result, ensuring scalability and smooth performance.

4. **Client-Side Functionality**:

   - Users can view the status of jobs or their results if resolved.
   - New jobs can be created directly through the UI.
   - Results are displayed automatically upon job completion via SSE.
     The client interface is built with **Next.js**, styled using **Tailwind CSS**, and features components from **shadcn** for a modern, responsive design.

5. **Data Persistence**:
   Job results are stored in a file-based system, ensuring that data remains available for retrieval even after server restarts.

---

## Installation Guide

### Setting Up the Project

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   Navigate to the respective directories and install dependencies.

   **For the Client**:

   ```bash
   cd client
   npm install
   ```

   > **Note**: If this doesn’t work or you face dependency issues, use the following command:

   ```bash
   npm install --legacy-peer-deps
   ```

   **For the Server**:

   ```bash
   cd server
   npm install
   ```

3. **Start the Client**:
   Navigate to the `client` folder and start the development server.

   ```bash
   npm run dev
   ```

4. **Start the Server**:
   Navigate to the `server` folder and start the server.

   ```bash
   npm run dev
   ```

5. **Environment Configuration**:
   The `.env` file is already included in the project for both client and server; no additional setup is required.

---

## Time Report

### 1. Backend Development (7 hours):

- **Project Setup** (1 hour):

  - Configured Express with TypeScript.
  - Added necessary tools like ts-node for development and TypeScript configuration.

- **Job Management APIs** (3 hours):

  - Implemented APIs for creating a job, fetching all jobs, and retrieving specific job details.
  - Handled file-based persistence for job storage.

- **Worker Threads and SSE** (3 hours):
  - Set up **Worker Threads** for concurrent job processing to avoid blocking the event loop.
  - Implemented **SSE** to send real-time updates to the client when jobs are resolved.

### 2. Frontend Development (5 hours):

- **Project Setup** (0.5 hour):

  - Configured Next.js with TypeScript and Tailwind CSS.

- **UI Design** (1.5 hours):

  - Created a responsive design using **shadcn components** and Tailwind CSS.
  - Built a layout to display job statuses and results.

- **API Integration** (2.5 hours):

  - Integrated job-related APIs to fetch, display, and create jobs.
  - Implemented real-time updates using SSE.

- **Testing and Finalization** (0.5 hour):
  - Tested the UI for responsiveness and functionality.
  - Debugged minor issues with real-time updates and API integration.
