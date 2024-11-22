import { Request, Response, NextFunction } from 'express';
import { addSchoolToDB, getAllSchoolsFromDB, School } from '../models/schoolModel';
import { AppError } from '../utils/errorUtils';

// add a new school
export const addSchool = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const school: School = req.body;
        const error = await addSchoolToDB(school);
        if (error) {
            return next(new AppError(error, 400));
        }
        res.status(201).json({ message: 'School added successfully' });
    } catch (error) {
        next(new AppError((error as Error).message, 500));
    }
};

// list schools sorted by proximity to user's location
export const listSchools = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            throw new AppError('Latitude and Longitude are required', 400);
        }

        const userLat = parseFloat(latitude as string);
        const userLon = parseFloat(longitude as string);

        const schools = await getAllSchoolsFromDB();

        /**
         * YT link - https://youtu.be/t6NkBRQ2Fz0
         * calculate the distance between two geographical points using the Haversine formula.
         * @param {number} lat1 - Latitude of the first point.
         * @param {number} lon1 - Longitude of the first point.
         * @param {number} lat2 - Latitude of the second point.
         * @param {number} lon2 - Longitude of the second point.
         * @returns {number} - The distance between the two points in kilometers.
         */
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const toRad = (value: number) => (value * Math.PI) / 180; // converting degrees to radians

            const R = 6371; // radius of the rarth in km
            const dLat = toRad(lat2 - lat1); // dist. latitude
            const dLon = toRad(lon2 - lon1); // dist longitude
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // distance in km
        };

        // sorting schools by proximity to user's location
        schools.sort((a, b) => {
            const distanceA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
            const distanceB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
            return distanceA - distanceB;
        });

        res.status(200).json(schools);
    } catch (error) {
        next(new AppError((error as Error).message, 400));
    }
};
