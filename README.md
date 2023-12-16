# My Create React App Project

This project is a React-based web application with a backend service running at http://localhost:5000/api.

## Getting Started

To run this project, simply follow these steps:

1. Ensure that the backend service is up and running at http://localhost:5000/api.

2. Navigate to the root directory of the project via the command line.

3. Run the following command to install all dependencies: npm install.

4. Once the dependencies are installed, start the application by running: npm start

5. The application should now be running and accessible via http://localhost:3000.

## Further Work

- **Unit Tests**: Unit tests need to be written to ensure the reliability and maintainability of the code. This will help in identifying bugs early and ease future feature additions or refactoring.

- **Pagination in Activity Endpoint**: Currently, cursor-based or keyset-based pagination is implemented in the combined analytics endpoint. A similar approach needs to be adopted for the activity endpoint to handle large datasets efficiently and improve the overall performance of the application.

- **Project refactoring**: Remove unused files and folders; refactor individual dashboard components into their respective files and folders.