import axios from "axios";

const DB_URL = "https://jsonplaceholder.typicode.com";

type DataType = Record<string, unknown>;

export const addDataToJsonPlaceHolder = async (
  dataFromClient: DataType,
  collection: string
): Promise<DataType> => {
  try {
    const { data } = await axios.post(
      `${DB_URL}/${collection}`,
      dataFromClient
    );
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject(error);
  }
};
