export const environment = {
    production: false,
    envName: 'local',
    apiUrl: 'http://localhost',
    hotjarConfig: {
        id: '000000',
        enabled: false
    },
    paths: {
        aircrafts: ':9002/api/v1/contingencies/configurations/aircrafts',
        aircraftsSearch: ':9005/api/v1/configurations/aircrafts/_search',
        close: ':9002/api/v1/contingencies/_close',
        configMaxStatus: ':9005/api/v1/configurations/status/max',
        configStatus: ':9005/api/v1/configurations/status/_search',
        confirmForgotPassword: ':9001/api/security/users/_confirmforgotpassword',
        contingencyList: ':9002/api/v1/contingencies',
        contingencySearch: ':9002/api/v1/contingencies/_search',
        contingencySearchCount: ':9002/api/v1/contingencies/_search/count',
        dateTime: ':9001/api/security/currentdatetime',
        flights: ':9005/api/v1/configurations/flights/_search',
        followUp: ':9002/api/v1/contingencies/status/_followUp',
        forgotPassword: ':9001/api/security/users/_forgotpassword',
        locations: ':9005/api/v1/configurations/locations',
        login: ':9001/api/security/users/_login',
        meetings: ':9002/api/v1/contingencies/meetings',
        operator: ':9005/api/v1/configurations/operators/',
        safetyEvent: ':9005/api/v1/configurations/safetyEvents',
        types: ':9005/api/v1/configurations/types',
        configTypes: ':9005/api/v1/configurations/types/groupNames',
        mails : ':9005/api/v1/configurations/mails'
    }
};
