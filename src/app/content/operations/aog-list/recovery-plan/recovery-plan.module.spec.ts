import { RecoveryPlanModule } from './recovery-plan.module';

describe('RecoveryPlanModule', () => {
  let recoveryPlanModule: RecoveryPlanModule;

  beforeEach(() => {
    recoveryPlanModule = new RecoveryPlanModule();
  });

  it('should create an instance', () => {
    expect(recoveryPlanModule).toBeTruthy();
  });
});
