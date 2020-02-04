import { IExpense } from '../interfaces/IExpense';
import mongoose from 'mongoose';

const Expense = new mongoose.Schema(
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

export default mongoose.model<IExpense & mongoose.Document>('Expense', Expense);
