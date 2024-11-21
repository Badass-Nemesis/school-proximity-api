import { executeQuery } from '../utils/db';

// defining the School interface to represent the structure of a school object
export interface School {
    id?: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

// add a new school to the database
export const addSchoolToDB = async (school: School): Promise<string | void> => {
    const { name, address, latitude, longitude } = school;

    // validating that all fields are provided
    if (!name || !address || latitude == null || longitude == null) {
        return 'All fields are required';
    }

    // SQL query to check if a school with the same name and address already exists (case-insensitive)
    const checkQuery = 'SELECT COUNT(*) as count FROM schools WHERE LOWER(name) = LOWER(?) AND LOWER(address) = LOWER(?)';
    const countResult = await executeQuery(checkQuery, [name, address]);
    const count = (countResult as any)[0].count;

    // if a duplicate school is found, return an error message
    if (count > 0) {
        return 'A school with this name and address already exists';
    }

    // SQL query to insert the new school into the database
    const insertQuery = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    await executeQuery(insertQuery, [name, address, latitude, longitude]);
};

// get all schools from the database
export const getAllSchoolsFromDB = async (): Promise<School[]> => {
    // SQL query to select all schools
    const query = 'SELECT * FROM schools';
    const rows = await executeQuery(query);

    return rows as School[];
};
