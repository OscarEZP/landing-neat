export const environment = {
    production: false,
    envName: 'local',
    apiUrl: 'http://localhost',
    paths: {
        confirmForgotPassword: ':9001/api/security/users/_confirmforgotpassword',
        contingencyList: ':9002/api/v1/contingencies',
        dateTime: ':9001/api/security/currentdatetime',
        forgotPassword: ':9001/api/security/users/_forgotpassword',
        login: ':9001/api/security/users/_login',
        safetyEvent: ':9002/api/v1/contingencies/configurations/safetyEvents',
        aircrafts: ':9002/api/v1/contingencies/configurations/aircrafts',
        aircraftsSearch: ':9002/api/v1/contingencies/configurations/aircrafts/_search',
        flights: ':9002/api/v1/contingencies/configurations/flights',
        locations: ':9002/api/v1/contingencies/configurations/locations',
        types: ':9002/api/v1/contingencies/configurations/types',
        close: ':9002/api/v1/contingencies/_close',
        followUp: ':9002/api/v1/contingencies/status/_followUp',
        configStatus: ':9002/api/v1/contingencies/configurations/status',
        contingencySearch: ':9002/api/v1/contingencies/_search'
    }
};
