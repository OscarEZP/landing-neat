export const environment = {
    production: false,
    envName: 'staging',
    apiUrl: 'https://staging.moc.maintenix.aero',
    paths: {
        confirmForgotPassword: '/api/security/users/_confirmforgotpassword',
        contingencyList: '/api/contingencies',
        dateTime: '/api/security/currentdatetime',
        forgotPassword: '/api/security/users/_forgotpassword',
        login: '/api/security/users/_login'
    }
};
