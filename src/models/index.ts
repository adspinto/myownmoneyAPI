
const userModel = {
    name: 'userModel',
    // Notice the require syntax and the '.default'
    model: require('./user').default,
}
const incomeModel = {
    name: 'incomeModel',
    // Notice the require syntax and the '.default'
    model: require('./income').default,
}
const expenseModel = {
    name: 'expenseModel',
    model: require('./expense').default,
}





export { userModel, incomeModel, expenseModel }