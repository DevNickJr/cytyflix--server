import { AppDataSource } from "./app-data-source"

export const connectDB = async () => {
    try {
        await AppDataSource.initialize()
        console.log("Data Source has been initialized!")
    } catch (error) {
        console.error("Error during Data Source initialization:", error)
        throw error
    }
}