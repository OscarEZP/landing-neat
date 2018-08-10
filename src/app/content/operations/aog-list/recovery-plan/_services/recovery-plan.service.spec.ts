import { TestBed, inject } from '@angular/core/testing';

import { RecoveryPlanService } from './recovery-plan.service';

describe('RecoveryPlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecoveryPlanService]
    });
  });

  it('should be created', inject([RecoveryPlanService], (service: RecoveryPlanService) => {
    expect(service).toBeTruthy();
  }));
});
