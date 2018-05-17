import {Count} from '../../../configuration/count';
import {Task} from '../../task';

export class FleetHealthResponse {

    private _count: Count;
    private _fleetHealths: Task[];

   private constructor(count: Count, fleetHealths: Task[]) {
        this._count = count;
        this._fleetHealths = fleetHealths;
    }

    static getInstance(): FleetHealthResponse {
        return new FleetHealthResponse(Count.getInstance(), []);
    }
    get count(): Count {
        return this._count;
    }
    set count(value: Count) {
        this._count = value;
    }


    get fleetHealths(): Task[] {
        return this._fleetHealths;
    }

    set fleetHealths(value: Task[]) {
        this._fleetHealths = value;
    }
}
