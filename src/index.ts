import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import { AppError } from './utils/errorUtils';
import { addSchool, listSchools } from './controllers/schoolController';

dotenv.config();

const app = express();

app.use(express.json());

// ensuring the DB connection pool is created
connectDB();

// Routes
app.post('/api/schools/addSchool', addSchool);
app.get('/api/schools/listSchools', listSchools);

// Error handling middleware
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error: ${err.message}`); // log only the error message
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message,
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
