export const environment = {
    production: false,
    envName: 'local',
    apiUrl: 'http://localhost',
    paths: {
        aircrafts: ':9002/api/v1/contingencies/configurations/aircrafts',
        aircraftsSearch: ':9002/api/v1/contingencies/configurations/aircrafts/_search',
        close: ':9002/api/v1/contingencies/_close',
        configMaxStatus: ':9002/api/v1/contingencies/configurations/status/max',
        configStatus: ':9002/api/v1/contingencies/configurations/status/_search',
        confirmForgotPassword: ':9001/api/security/users/_confirmforgotpassword',
        contingencyList: ':9002/api/v1/contingencies',
        contingencySearch: ':9002/api/v1/contingencies/_search',
        dateTime: ':9001/api/security/currentdatetime',
        flights: ':9002/api/v1/contingencies/configurations/flights/_search',
        followUp: ':9002/api/v1/contingencies/status/_followUp',
        forgotPassword: ':9001/api/security/users/_forgotpassword',
        locations: ':9002/api/v1/contingencies/configurations/locations',
        login: ':9001/api/security/users/_login',
        refreshToken: ':9001/api/v1/security/users/_refresh',
        safetyEvent: ':9002/api/v1/contingencies/configurations/safetyEvents',
        types: ':9002/api/v1/contingencies/configurations/types'
    }
};
