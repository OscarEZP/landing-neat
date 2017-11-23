export const environment = {
    production: false,
    apiUrl: 'http://localhost',
    paths: {
        contingencyList: ':9002/api/contingencies/contingency',
        forgotPassword: ':9001/api/security/users/_forgotpassword',
        confirmForgotPassword: ':9001/api/security/users/_confirmforgotpassword',
        dateTime: ':9001/api/security/currentdatetime'
    }
};