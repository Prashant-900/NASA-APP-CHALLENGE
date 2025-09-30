# Exoplanet Detection Model Dashboard

A web application to showcase your exoplanet detection model with interactive data exploration tools.

## Setup Instructions

### Backend Setup
1. Navigate to backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Install additional dependencies:
   ```
   pip install openpyxl
   ```

4. Start the Flask server:
   ```
   python app.py
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

## Features

### Data Explorer
- **Table Navigation**: Switch between K2, TOI, and CUM datasets using tabs
- **Lazy Loading**: Data loads efficiently with pagination (50 rows per page)
- **Search Functionality**: Search within specific columns using dropdown selection
- **Responsive Design**: Clean Material-UI interface
- **Real-time Updates**: Search results update as you type

### Exoplanet Prediction
- **File Upload**: Upload CSV or Excel files for prediction
- **Multi-Model Support**: Choose between K2, TOI, and CUM prediction models
- **Real-time Processing**: Get instant predictions on uploaded data
- **CSV Export**: Download results with original data plus prediction column
- **Visual Results**: View prediction summary and detailed results table

## Database Tables
- `k2`: Kepler K2 mission data
- `toi`: TESS Objects of Interest
- `cum`: Cumulative exoplanet data

## Prediction Models
- **K2 Model**: Trained on Kepler K2 mission data
- **TOI Model**: Placeholder model for TESS Objects of Interest
- **CUM Model**: Placeholder model for cumulative exoplanet data

## Usage

### Data Explorer
1. Navigate to the "Data Explorer" tab
2. Select a dataset (K2, TOI, or CUM)
3. Use search functionality to filter data
4. Browse through paginated results

### Making Predictions
1. Navigate to the "Predict" tab
2. Choose your model type (K2, TOI, or CUM)
3. Upload a CSV or Excel file with your data
4. Click "Predict" to process the file
5. View results and download CSV with predictions

The application connects to your PostgreSQL database and displays the data in an interactive table format with search and pagination capabilities.