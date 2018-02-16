export const environment = {
    production: true,
    envName: 'prod',
    apiUrl: 'https://mcp.maintenix.ifs.cloud',
    hotjarConfig: {
        id: '750858',
        enabled: true
    },
    paths: {
        aircrafts: ':9002/api/v1/contingencies/configurations/aircrafts',
        aircraftsSearch: ':9005/api/v1/configurations/aircrafts/_search',
        areas: ':9002/api/v1/contingencies/pendings/areas',
        close: ':9002/api/v1/contingencies/_close',
        configMaxStatus: ':9005/api/v1/configurations/status/max',
        configStatus: ':9005/api/v1/configurations/status/_search',
        configTypes: ':9005/api/v1/configurations/types/groupNames',
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
        mails : ':9005/api/v1/configurations/mails',
        meetings: ':9002/api/v1/contingencies/meetings',
        operator: ':9005/api/v1/configurations/operators/',
        safetyEvent: ':9005/api/v1/configurations/safetyEvents',
        types: ':9005/api/v1/configurations/types'
    }
};
