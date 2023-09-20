import { Client } from 'pg';


const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'Users',
    password: 'root',
    port: 5432,
}

export const client = new Client(config)


// Connect DB.
export const connectDb = async () => {
    try {
        await client.connect()
        console.log("Connected created ssuccefuly!!!")
        return;
    } catch (error) {
        throw { message: error, status: 500 };
    }
}