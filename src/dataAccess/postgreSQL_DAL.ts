import UserInterface from '../users/interfaces/UserInterface';
import { client } from '../DB/pgAdmin_SQL';
import { getDate } from "../date/new-date";

// Check connected.
export const runQuery = async () => {
    try {
        const queryString = "SELECT * FROM schemaUsers.users NATURAL JOIN schemaUsers.usersProducts NATURAL JOIN schemaUsers.products";
        const res = await client.query(queryString);
        console.log(res.rows);
    } catch (error) {
        throw error;
    }
}



// Users.
export class UserDAL {
    static async getAllUsers(): Promise<UserInterface[]> {
        try {
            const queryString = 'SELECT * FROM schemaUsers.users';
            const res = await client.query(queryString);
            return res.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(userId: string): Promise<UserInterface[] | null> {
        try {
            const queryString = 'SELECT * FROM schemaUsers.users WHERE user_id = $1';
            const res = await client.query(queryString, [userId]);
            return res.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getUserByEmail(email: string): Promise<UserInterface[] | null> {
        try {
            const queryString = 'SELECT * FROM schemaUsers.users WHERE email = $1';
            const res = await client.query(queryString, [email]);
            return res.rows;
        } catch (error) {
            throw error;
        }
    }

    static async createUser(user: UserInterface) {
        try {
            const queryString = 'INSERT INTO schemaUsers.users(email, password, date_create) VALUES($1, $2, $3)';
            const values = [user.email, user.password, getDate()];
            await client.query(queryString, values);
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(userId: string, user: UserInterface): Promise<UserInterface[] | null> {
        try {
            const queryString = `UPDATE schemaUsers.users SET email = $1, password = $2, date_update = $3 WHERE user_id = $4`;
            const values = [user.email, user.password, getDate(), userId];
            await client.query(queryString, values);

            const updatedUser = await UserDAL.getUserById(userId);
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(userId: string): Promise<UserInterface[] | null> {
        try {
            const user = await UserDAL.getUserById(userId);
            await ProductDAL.deleteAllProductsFromUser(userId);
            console.log("deleted all products from user!")
            const queryString = 'DELETE FROM schemaUsers.users WHERE user_id = $1';
            const res = await client.query(queryString, [userId]);
            if (res.rowCount === 1) {
                return user;
            } else {
                throw new Error("User not deleted!!!");
            }
        } catch (error) {
            throw error;
        }
    }
}

// Products.
export class ProductDAL {
    static async getProductByName(nameProd: string): Promise<any[] | null> {
        try {
            const queryString = 'SELECT * FROM schemaUsers.products WHERE product_name = $1';
            const res = await client.query(queryString, [nameProd]);
            return res.rows;
        } catch (error) {
            throw error;
        }
    }

    static async createProduct(product: string): Promise<string | null> {
        try {
            const existingProduct = await ProductDAL.getProductByName(product);
    
            if (existingProduct && existingProduct.length > 0) {
                return existingProduct[0].product_id; // המוצר כבר קיים, החזר את ה-id שלו
            }
    
            const queryString = 'INSERT INTO schemaUsers.products(product_name, date_create_prod) VALUES($1, $2) RETURNING product_id'; // השימוש ב-RETURNING מאפשר לשואל ל־PostgreSQL להחזיר את ה-ID שנוצר
            const values = [product, getDate()];
            const result = await client.query(queryString, values);
    
            if (result.rows && result.rows.length > 0) {
                return result.rows[0].product_id; // המוצר נוצר בהצלחה, החזר את ה-id שנוצר
            } else {
                return null; // במקרה שהשאילתה לא החזירה ID, החזר null
            }
        } catch (error) {
            throw error;
        }
    }
    
    // Add product to user.
    static async addProductToUser(userId: string, productId: string) {
        try {
            const queryString = 'INSERT INTO schemaUsers.usersproducts(user_id, product_id) VALUES($1, $2) RETURNING usersproducts_id';
            const values = [userId, productId];
            const result = await client.query(queryString, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async removeProductFromUser(userId: string, productId: string) {
        try {
            const queryString = 'DELETE FROM schemaUsers.usersproducts WHERE user_id = $1 AND product_id = $2';
            const values = [userId, productId];
            await client.query(queryString, values);
        } catch (error) {
            throw error;
        }
    }

    static async deleteAllProductsFromUser(userId: string): Promise<number> {
        try {
            const querydeleteUsPro = 'DELETE FROM schemaUsers.usersproducts WHERE user_id = $1';
            const res = await client.query(querydeleteUsPro, [userId]);
            console.log(res.rowCount)
            return res.rowCount
        } catch (error) {
            throw error;
        }
    }

    static async deleteUsersFromProduct(product_id: string): Promise<UserInterface[] | null> {
        try {
            const prod = await ProductDAL.getProductByName(product_id);
            const querydeleteUsPro = 'DELETE FROM schemaUsers.usersproducts WHERE product_id = $1';
            const res = await client.query(querydeleteUsPro, [product_id]);
            if (res.rowCount === 1) {
                return prod;
            } else {
                throw new Error("User from Product not deleted!!!");
            }
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(prodName: string): Promise<any[] | null> {
        try {
            const prod = await ProductDAL.getProductByName(prodName);
            await ProductDAL.deleteUsersFromProduct(prodName);

            const queryString = 'DELETE FROM schemaUsers.products WHERE product_name = $1';
            const res = await client.query(queryString, [prodName]);
            if (res.rowCount === 1) {
                return prod;
            } else {
                throw new Error("Product not deleted!!!");
            }
        } catch (error) {
            throw error;
        }
    }
}
