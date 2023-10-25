# ParshvaHoldingsAssessment

This is a repository for the Parshva Holdings Assessment Round one Task. It is a Flask and React application with MySQL as the backend database.

#For your kind refernce Screen recording of the project added to the repository
-----

## Installation

### Backend Installation

1. Open up Terminal 1.
2. Navigate to the `back-end` directory:
```
cd back-end
```
4. Create a Python virtual environment:
```
python -m venv venv
```
6. Activate the virtual environment:
- Windows:
  ```
  venv\Scripts\activate
  ```
- macOS/Linux:
  ```
  source venv/bin/activate
  ```
5. Install the required Python packages:
```
pip install -r requirements.txt
```
### Frontend Installation
1. Open up Terminal 2.
2. Navigate to the `front-end` directory:
```
cd front-end
```
3. Create a new React app:
```
npx create-react-app front-end
```
### MySQL Setup
1. Install MySQL and MySQL Workbench.
2. Create a schema in MySQL Workbench.
3. Create a table named `docket` with the following columns: `id`, `name`, `starttime`, `endtime`, `hoursworked`, `rate`, `supplier`, `purchaseorder`, and `description`.
## Usage
To run the application, follow these steps:
1. Open up Terminal 1.
2. Activate the Python virtual environment (if not activated already).
3. Start the Flask server:
```
python server.py
```
4. Open up Terminal 2.
5. Navigate to the `front-end` directory.
6. Start the React development server:
```
npm start
```

## Completed Tasks
- Form creation
- Filtering supplier name and purchase order based on selected supplier name
- Description based on selected purchase order
- Submitting form values to the database
- Viewing all dockets in a table
- Popup docket onclick button
