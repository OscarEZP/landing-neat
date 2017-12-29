export const environment = {
    production: false,
    envName: 'staging',
    apiUrl: 'https://staging.mcp.maintenix.ifs.cloud',
    hotjarConfig: {
        id: '728724',
        enabled: true
    },
    paths: {
        confirmForgotPassword: '/api/security/users/_confirmforgotpassword',
        contingencyList: '/api/v1/contingencies',
        dateTime: '/api/security/currentdatetime',
        forgotPassword: '/api/security/users/_forgotpassword',
        login: '/api/security/users/_login',
        safetyEvent: '/api/v1/contingencies/configurations/safetyEvents',
        aircrafts: '/api/v1/contingencies/configurations/aircrafts',
        aircraftsSearch: '/api/v1/contingencies/configurations/aircrafts/_search',
        flights: '/api/v1/contingencies/configurations/flights',
        locations: '/api/v1/contingencies/configurations/locations',
        types: '/api/v1/contingencies/configurations/types',
        close: '/api/v1/contingencies/_close',
        followUp: '/api/v1/contingencies/status/_followUp',
        configStatus: '/api/v1/contingencies/configurations/status',
        contingencySearch: '/api/v1/contingencies/_search'
    }
};
