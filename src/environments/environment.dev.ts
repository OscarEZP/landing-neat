export const environment = {
    production: false,
    apiUrl: 'http://localhost',
    paths: {
        confirmForgotPassword: ':9001/api/security/users/_confirmforgotpassword',
        contingencyList: ':9002/api/v1/contingencies',
        dateTime: ':9001/api/security/currentdatetime',
        forgotPassword: ':9001/api/security/users/_forgotpassword',
        login: ':9001/api/security/users/_login',
        safetyEvent: ':9002/api/v1/contingencies/configurations/safetyEvents',
        aircrafts: ':9002/api/v1/contingencies/configurations/aircrafts',
        flights: ':9002/api/v1/contingencies/configurations/flights',
        locations: ':9002/api/v1/contingencies/configurations/locations',
        types: ':9002/api/v1/contingencies/configurations/types',
        close: ':9002/api/v1/contingencies/_close',
        followUp: ':9002/api/v1/contingencies/status/_followUp',
    }
};
