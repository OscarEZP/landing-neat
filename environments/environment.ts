export const environment = {
    production: false,
    envName: 'staging',
    apiUrl: 'https://staging.moc.maintenix.aero',
    paths: {
        confirmForgotPassword: '/api/security/users/_confirmforgotpassword',
        contingencyList: '/api/contingencies',
        dateTime: '/api/security/currentdatetime',
        forgotPassword: '/api/security/users/_forgotpassword',
        login: '/api/security/users/_login',
        safetyEvent: '/api/contingencies/configurations/safetyEvents',
        aircrafts: '/api/contingencies/configurations/aircrafts',
        flights: '/api/contingencies/configurations/flights',
        locations: '/api/contingencies/configurations/locations',
        types: '/api/contingencies/configurations/types',
        close: '/api/contingencies/_close'
    }
};
