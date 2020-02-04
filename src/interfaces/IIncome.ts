export interface IIncome {
    userId: string;
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
    deleted: boolean;
}

export interface IIncomeInputDTO {
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
}

export interface IIncomeUpdateInputDTO {
    incomeId: string;
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
    deleted: boolean;
}
export interface IIncomeIdInputDTO {
    incomeId: string;
}

