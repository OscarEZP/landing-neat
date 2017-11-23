export const environment = {
    production: false,
    apiUrl: 'https://staging.moc.maintenix.aero',
    paths: {
        contingencyList: '/api/contingencies',
        forgotPassword: '/api/security/users/_forgotpassword',
        confirmForgotPassword: '/api/security/users/_confirmforgotpassword',
        login: '/api/security/users/_login',
        dateTime: '/api/security/currentdatetime'
    }
};
