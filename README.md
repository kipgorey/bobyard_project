### Getting Started 🚀

This project consists of a frontend React application and a backend Django server. Follow these steps to get both up and running.

---

### Backend (Django)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    python manage.py runserver
    ```
The backend API will be running at `http://127.0.0.1:8000`.

---

### Frontend (React)

1.  Open a **new terminal tab** and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend application:
    ```bash
    npm start
    ```
The frontend will open automatically in your browser at `http://localhost:3000`.

---

### Additional Notes

For this exercise, the database credentials and API endpoints are configured for a simple local setup and are not included. In a production environment, I would have used environment variables for sensitive information to ensure security and maintainability.

If I had more time, I would have implemented the following key improvements:

* **Optimized API Calls**: The backend API currently sends all comments at once. I would have implemented a system to send comments in paginated "packets" to improve performance, especially with a large number of comments. The frontend would then load these new packets as the user scrolls further down the page, a common practice known as infinite scrolling.
* **Persistent Likes**: While the frontend already has the functionality to display likes, I would have fully implemented the backend logic to allow users to toggle likes and persist this data in the database.