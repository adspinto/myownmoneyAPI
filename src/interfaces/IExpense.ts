export interface IExpense {
    userId: string;
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
    deleted: boolean;
}

export interface IExpenseInputDTO {
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
}

export interface IExpenseUpdateInputDTO {
    expenseId: string;
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
    deleted: boolean;
}
export interface IExpenseIdInputDTO {
    expenseId: string;
}

