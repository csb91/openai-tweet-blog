import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`)



