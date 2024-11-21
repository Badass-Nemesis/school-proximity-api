import mysql from 'mysql2/promise';

let pool: mysql.Pool | undefined;

export const connectDB = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306, // no need for this port
            connectionLimit: 10, // we can adjust the limit based on our application's needs
        });
        console.log('MySQL connection pool created');
    }
    return pool;
};

export const executeQuery = async (query: string, values: any[] = []) => {
    const pool = connectDB();
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(query, values);
        return results;
    } finally {
        connection.release();
    }
};
