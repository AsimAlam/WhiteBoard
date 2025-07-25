# Collaborative Whiteboard

Collaborative Whiteboard is a full-stack, real-time drawing canvas that empowers distributed teams to brainstorm, sketch, and annotate together. Built with a React frontend and Node.js/Socket.io backend, it supports freehand drawing, text labels, geometric shapes, and image uploads everything updates instantly across all connected clients.

- **Persistent Canvas State:** Every stroke and object is saved in a database so boards can be revisited or resumed at any time.
- **Role-Based Access & Permissions:** Board owners can invite collaborators, then selectively grant or revoke drawing, commenting, or viewing rights.
- **Secure Authentication:** Users sign in seamlessly with Google OAuth, ensuring a trusted and familiar login flow.
- **Downloadable Exports:** Anyone with access can export the current board view as a high-resolution PNG or a paginated PDF.
- **Owner Notes & Annotations:** Board owners get a dedicated sidebar for jotting meeting minutes, action items, or reminders tied to each board.

Whether you’re running a remote design sprint, teaching online classes, or simply whiteboarding ideas with friends, this app makes collaboration fluid, secure, and endlessly flexible.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://whiteboard-frontend-zb1b.onrender.com)

![whiteboard-s3](https://github.com/user-attachments/assets/8faf5373-3248-43f1-98c1-b8382133f36b)

![whiteboard-s2](https://github.com/user-attachments/assets/ad916848-b8ef-4953-9dce-b77211de02b2)

## If You Like This Project...

If you find this project useful, please give it a star on GitHub! Your support helps improve the project and encourages further development.

## Features

- **Real-Time Collaboration:**  
  Live canvas updates using Socket.io ensure that all connected users see the latest changes in real time.

- **Persistent Canvas State:**  
  The Fabric.js canvas state is serialized to JSON and stored in MongoDB, enabling users to resume sessions from where they left off.

- **Role-Based Access Control:**  
  Users are assigned read or write permissions, ensuring controlled collaboration.

- **Google OAuth Authentication:**  
  Secure login with Google ensures that only authorized users can access and modify whiteboards.

- **Undo/Redo & Save:**  
  Custom undo/redo functionality and manual saving allow users to manage and persist changes.

- **Responsive & Intuitive UI:**  
  Built with React and styled-components, the user interface features dynamic theme updates and an easy-to-use design.

## Tech Stack

- **Frontend:**  
  React, Fabric.js, Socket.io-client, styled-components, React Router

- **Backend:**  
  Node.js, Express, Passport (Google OAuth), Socket.io, MongoDB (Mongoose)

## Setup Instructions

### Prerequisites

- Node.js (v12+)
- MongoDB (local or cloud-based)
- Yarn or npm

### Backend Setup

1. **Clone the Repository & Install Dependencies:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>/backend
   npm install

   ```
2. **Configure Environment Variables:**
   
     Create a ```.env ``` file in your backend directory with:
      
   ```bash
   MONGO_URI=your_mongo_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   PORT=5000

   ```
2. **Run the Server:**
   
   ```bash
   npm run dev
   
   ```
   
### Frontend Setup

1. **Install Dependencies:**

   ```bash
   cd ../frontend
   npm install
   
   ```
2. **Configure API Endpoints:**
   
     Ensure your API calls in the frontend point to your backend (e.g.,``` http://localhost:5000```).
      
2. **Run the Application:**
   
   ```bash
   npm start
   
   ```
## Usage

1. **Creating a New Whiteboard:**
    -  On your dashboard, click on the "Create new board" card.
    -  A new whiteboard is created with a unique session link.
    -  hare this link with collaborators.
  
2. **Accessing a Shared Whiteboard:**
    -  When a user clicks a shared link, they are redirected to login if not authenticated.
    -  After login, they are redirected back to the whiteboard, where the saved state is loaded from the database.
  
3. **Collaborative Drawing:**
    -  Use tools like Pen, Text, and Shape to draw and annotate.
    -  Live updates are broadcast via Socket.io so that all collaborators see the latest changes.
  
3. **Undo/Redo & Save:**
    -  Use the Undo/Redo buttons to revert or reapply changes.
    -  Click Save to persist the current canvas state to the database.

## API Endpoints

### Authentication
- GET ```/auth/google``` – Initiate Google OAuth (supports a ```redirect``` query parameter).
- GET ```/auth/google/callback``` – Handle OAuth callback and redirect to the original page or dashboard.
- GET ```/auth/dashboard``` – Protected route returning the authenticated user's data.
- GET ```/auth/login``` – Login page.
- GET ```/auth/logout``` – Logout route.

### Whiteboard
- GET ```/api/whiteboard/:id?token=<sessionToken>``` – Fetch whiteboard details and canvas state (protected).
- PUT ```/api/whiteboard/:id``` – Update whiteboard state.
- PUT ```/api/whiteboard/:id/add-collaborator?token=<sessionToken>``` – Add a collaborator to a whiteboard.

### Drawing
- POST ```/api/drawings/save-or-update``` – Upsert drawing data for a whiteboard.

## Folder Structure

``` hash
├── backend
│   ├── models
│   │   ├── User.js
│   │   ├── Whiteboard.js
│   │   └── NoteSchema.js
│   ├── controllers
│   │   ├── auth.js
│   │   └── whiteboardRoutes.js
│   ├── middlewares
│   │   └── authMiddleware.js
|   ├── routes
|   |   └── routes.js
│   └── server.js
└── frontend
    ├── src
    │   ├── api
    |   |   ├── config.js
    │   │   └── api.js
    |   ├── assets
    │   ├── components
    │   │   ├── Boards
    |   |   |   ├── NewBoard.js
    │   │   │   └── RecentBoard.jsx
    │   │   ├── Buttons
    │   │   │   └── ExportButton.jsx
    │   │   ├── Canvas
    |   |   |   ├── Canvas.jsx
    |   |   |   ├── CanvasContainer.jsx
    |   |   |   ├── CollabProfile.jsx
    │   │   │   └── Whiteboard.jsx
    │   │   ├── Dashboard
    │   │   │   └── Dashboard.jsx
    │   │   ├── Login
    │   │   │   └── Login.jsx
    │   │   ├── Navbar
    │   │   │   └── Navbar.jsx
    │   │   └── ViewBoard
    |   |   |   ├── BoardDetails.jsx
    |   |   |   ├── BoardOperation.jsx
    |   |   |   ├── Thumbnail.jsx
    │   │   |   └── ViewBoard.jsx
    │   ├── ContextProvider
    |   |   ├── ThemeProvider.jsx
    │   │   └── UserProvider.jsx
    │   ├── Layout
    │   │   └── Layout.jsx
    │   ├── theme
    │   │   └── theme.js
    │   └── App.jsx
    └── package.json
```
## Future Improvements

| Area                     | Future Improvements                                                                                          |
|--------------------------|--------------------------------------------------------------------------------------------------------------|
| Real-Time Collaboration  | Implement delta updates (sending only changes instead of full canvas JSON) to optimize performance.          |
| Object Manipulation      | Add features like object locking, grouping, and granular version history for undo/redo.                      |
| Mobile & Touch Support   | Enhance responsiveness and touch support for a better mobile experience.                                     |
| Additional Drawing Tools | Integrate more tools such as color pickers, custom fonts, and advanced shape editing.                        |
| Security & Scalability   | Improve access control and scale the Socket.io infrastructure using clustering or cloud services.            |

