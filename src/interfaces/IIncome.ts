export interface IIncome {
    userId: string;
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
}

export interface IIncomeInputDTO {
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
}

export interface IIncomeUpdateInputDTO {
    title: string;
    description: string;
    value: number;
    type: string;
    fixed: boolean;
}

