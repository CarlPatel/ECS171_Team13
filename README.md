## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ecs171_backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ecs171_frontend
   ```

2. Install the required Node.js packages:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

1. Make sure you're in the backend directory and the virtual environment is activated
2. Run the FastAPI server using Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
   The backend server will start on `http://localhost:8000`

### Start the Frontend Development Server

1. Open a new terminal window
2. Navigate to the frontend directory
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Using the Application

1. Open your web browser and navigate to `http://localhost:5173`
2. Fill in the form with:
   - Your age
   - Your occupation
3. Click the "Submit" button
4. The application will display your predicted chance of having an income over $50,000

## Notes

- The backend server must be running for the frontend to work properly
- For best results, enter a valid age (numeric) and either "Engineer, "Teacher" or "Student" (Currently Hardcoded)
