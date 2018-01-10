export const environment = {
    production: true,
    envName: 'prod',
    apiUrl: 'https://mcp.maintenix.ifs.cloud',
    hotjarConfig: {
        id: '000000',
        enabled: false
    },
    paths: {
        aircrafts: '/api/v1/contingencies/configurations/aircrafts',
        aircraftsSearch: '/api/v1/contingencies/configurations/aircrafts/_search',
        close: '/api/v1/contingencies/_close',
        configMaxStatus: '/api/v1/contingencies/configurations/status/max',
        configStatus: '/api/v1/contingencies/configurations/status/_search',
        confirmForgotPassword: '/api/security/users/_confirmforgotpassword',
        contingencyList: '/api/v1/contingencies',
        contingencySearch: '/api/v1/contingencies/_search',
        dateTime: '/api/security/currentdatetime',
        flights: '/api/v1/contingencies/configurations/flights/_search',
        followUp: '/api/v1/contingencies/status/_followUp',
        forgotPassword: '/api/security/users/_forgotpassword',
        locations: '/api/v1/contingencies/configurations/locations',
        login: '/api/security/users/_login',
        operator: '/api/v1/contingencies/configurations/operators/',
        safetyEvent: '/api/v1/contingencies/configurations/safetyEvents',
        types: '/api/v1/contingencies/configurations/types',
        closeType: '/api/v1/contingencies/configurations/types/groupNames'
    }
};
