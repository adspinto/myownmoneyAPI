import { IIncome } from '../interfaces/IIncome';
import mongoose from 'mongoose';

const Income = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, 'Please enter the userId'],
        },
        
        value: {
            type: Number,
            required: [true, 'Please enter a value'],
            index: true,
        },

        title: {
            type: String,
            required: [true, 'Please enter a title'],
            index: true,
        },
        description: String,
        type: String,
        fixed: Boolean,
        deleted: Boolean
    },
    { timestamps: true },
);

export default mongoose.model<IIncome & mongoose.Document>('Income', Income);
