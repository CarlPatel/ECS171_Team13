<!-- Backend README.md -->

# Backend

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ecs171_backend
   ```

2.	Create and activate a virtual environment:
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    # On Windows use: .venv\Scripts\activate
    ```

3.	Install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

## Running the Application

### Start the Backend Server
1.	Ensure you’re in the `ecs171_backend` directory and the virtual environment is activated.

2.	Run the FastAPI server using Uvicorn:

    ```bash
    uvicorn main:app --reload
    ```

The backend server will start on http://localhost:8000.

## Notes
The backend server must be running for the frontend to work properly.


