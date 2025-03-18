# Collaborative Whiteboard

A full-stack real-time collaborative whiteboard application that enables multiple users to draw, add text, create shapes, and collaborate live. The application supports persistent canvas state storage, role-based access, and secure authentication via Google OAuth.

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

## Usage

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

