import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const aircrafts = [
            { tail: 'CC-BAA', fleet: 'A320', operator: 'CL' },
            { tail: 'AA-CBB', fleet: 'B320', operator: 'PE' },
            { tail: 'AA-CCB', fleet: 'C320', operator: 'BR' }
        ];

        const flights = [
            { flight: 'LA238', departure: 'ZCO', arrival: 'SCL', time: '22:59:59', date: '2017-10-25' },
            { flight: 'AL238', departure: 'SCL', arrival: 'LIM', time: '18:59:45', date: '2017-09-15' },
            { flight: 'LA538', departure: 'LIM', arrival: 'ZCO', time: '14:25:45', date: '2017-08-30' }
        ];
        return { aircrafts, flights };
    }
}