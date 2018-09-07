import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Aog} from '../../../../shared/_models/aog/aog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RecoveryPlanInterface, RecoveryPlanService} from './_services/recovery-plan.service';
import {Subscription} from 'rxjs/Subscription';
import {StageConfiguration} from '../../../../shared/_models/recoveryplan/stageConfiguration';
import {RecoveryPlan} from '../../../../shared/_models/recoveryplan/recoveryPlan';
import {Stage} from '../../../../shared/_models/recoveryplan/stage';
import {Audit} from '../../../../shared/_models/common/audit';
import {StorageService} from '../../../../shared/_services/storage.service';
import {TranslationService} from '../../../../shared/_services/translation.service';
import {ScrollbarComponent} from 'ngx-scrollbar';
import {TimeConverter} from './util/timeConverter';
import moment = require('moment');
import {FollowUpAogModalComponent} from './follow-up-aog-modal/follow-up-aog-modal.component';
import {DialogService} from '../../../_services/dialog.service';

@Component({
  selector: 'lsl-recovery-plan',
  templateUrl: './recovery-plan.component.html',
  styleUrls: ['./recovery-plan.component.scss', '../aog-list.component.scss']
})
export class RecoveryPlanComponent implements OnInit, OnDestroy, AfterViewInit {

    private static RECOVERY_PLAN_VERSION = 'AOG.LIST.RECOVERY_PLAN.VERSION';
    private static MESSAGE_ADDED_SUCCESS = 'FORM.MESSAGES.ADDED_SUCCESS';

    @ViewChild(ScrollbarComponent) scrollRef: ScrollbarComponent;
    @ViewChild('recoveryStageContainer') private _recoveryStageContainer: ElementRef;
    private _aogData: Aog;
    private _recoveryStagesConfigSub: Subscription;
    private _recoveryPlanInterfaceSub: Subscription;
    private _recoveryPlanInterface: RecoveryPlanInterface;
    private _groupLabel: string;
    private _scrollInterface: ScrollBarProperties;
    private _nowPosition: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private matDialogData: Aog,
        private _dialogRef: MatDialogRef<RecoveryPlanComponent>,
        private _recoveryPlanService: RecoveryPlanService,
        private _storageService: StorageService,
        private _translationService: TranslationService,
        private _dialogService: DialogService
    ) {
        this._aogData = matDialogData;
        this._groupLabel = '';
        this._recoveryStagesConfigSub = new Subscription();
        this._recoveryPlanInterfaceSub = new Subscription();
        this._nowPosition = '0px';
    }

    ngOnInit() {
        this.scrollInterface = this.getScrollInterface();
        this.activeViewInPixels = this._recoveryStageContainer.nativeElement.parentNode.offsetWidth;
        this.recoveryStagesConfigSub = this.getRecoveryStagesConfSubscription();
        this.recoveryPlanInterfaceSub = this.getRecoveryPlanInterfaceSubscription();
        this.slotSizeInPixels = this._recoveryStageContainer.nativeElement.parentNode.offsetWidth / 24;
        this._translationService.translate(RecoveryPlanComponent.RECOVERY_PLAN_VERSION)
            .then(v => this.groupLabel = v);
        this.utcNow = moment.utc().valueOf();
    }

    ngOnDestroy() {
        this.recoveryStagesConfigSub.unsubscribe();
        this.recoveryPlanInterfaceSub.unsubscribe();
    }

    ngAfterViewInit() {

    }

    private getScrollInterface(): ScrollBarProperties {
        return {
            isVisible: true,
            verticalScrollEnabled: false,
            horizontalScrollEnabled: true,
            autoHide: true
        };
    }

    /**
     * Subscription for get recovery plan service interface
     * @return {Subscription}
     */
    private getRecoveryPlanInterfaceSubscription(): Subscription {
        return this._recoveryPlanService.recoveryPlanBehavior$
            .subscribe(v => {
                this.recoveryPlanInterface = v;

                const nowPosition = this.getNowPosition(v.relativeEndTime, v.absoluteStartTime, v.activeViewInHours, v.activeViewInPixels);

                if (nowPosition > v.activeViewInHours / 2) {
                    // console.log('this.scrollRef: ', this.scrollRef);
                    // this.scrollRef.scrollXTo(nowPosition - (v.activeViewInHours / 2) + 100, 600);
                }

                this.nowPosition = (nowPosition - 22) + 'px';
            });
    }

    private scrollToPosition(position: number, speed: number): void {
        this.scrollRef.scrollXTo(position, speed);
    }

    private getNowPosition(relativeEndTime: number, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): number {
        return TimeConverter.epochTimeToPixelPosition(relativeEndTime, absoluteStartTime, activeViewInHours, activeViewInPixels);
    }

    /**
     * Subscription for get the data list with recovery stage configuration
     * @return {Subscription}
     */
    private getRecoveryStagesConfSubscription(): Subscription {
        return this._recoveryPlanService.getRecoveryStageConfig().subscribe(
            response => this.recoveryStagesConfig = response,
            err => console.error('Error loading recovery stage configuration', err)
        );
    }

    public saveRecovery() {
        return this._recoveryPlanService.saveRecovery(this.recoveryPlan)
            .then(() => this._translationService.translateAndShow(RecoveryPlanComponent.MESSAGE_ADDED_SUCCESS, 2500, {value: this.groupLabel}))
            .catch(err => console.error('Error submitting recovery stages', err));
    }

    get recoveryPlan(): RecoveryPlan {
        const recoveryPlan = RecoveryPlan.getInstance();
        recoveryPlan.enable = true;
        recoveryPlan.stages = this.planStages;
        recoveryPlan.audit = Audit.getInstance();
        recoveryPlan.audit.username = this.username;
        recoveryPlan.aogSeq = this.aogData.id;
        return recoveryPlan;
    }

    public getUtcNowFormatted() {
        return moment.utc(this.recoveryPlanInterface.utcNow).format('HH:mm');
    }

    /**
     * Open a modal for close AOG
     * @param {Aog} aog
     */
    public openFollowUpModal(aog: Aog) {
        console.log('aog', aog);
        this._dialogService.openDialog(FollowUpAogModalComponent, {
            data: aog,
            hasBackdrop: true,
            disableClose: true,
            height: '400px',
            width: '500px'
        });
    }
    /**
     * Closes modal when the user clicks on the "X" in the view
     */
    public closeModal(): void {
        this._dialogRef.close();
    }

    get aogData(): Aog {
        return this._aogData;
    }

    set aogData(value: Aog) {
        this._aogData = value;
    }

    get recoveryStagesConfigSub(): Subscription {
        return this._recoveryStagesConfigSub;
    }

    set recoveryStagesConfigSub(value: Subscription) {
        this._recoveryStagesConfigSub = value;
    }

    set activeViewInPixels(value: number) {
        this._recoveryPlanService.activeViewInPixels = value;
    }

    set relativeStartTime(value: number) {
        this._recoveryPlanService.relativeStartTime = value;
    }

    set recoveryStagesConfig(value: StageConfiguration[]) {
        this._recoveryPlanService.recoveryStagesConfig = value;
    }

    set slotSizeInPixels(value: number) {
        this._recoveryPlanService.slotSizeInPixels = value;
    }

    set utcNow(value: number) {
        this._recoveryPlanService.utcNow = value;
    }

    get recoveryPlanInterfaceSub(): Subscription {
        return this._recoveryPlanInterfaceSub;
    }

    set recoveryPlanInterfaceSub(value: Subscription) {
        this._recoveryPlanInterfaceSub = value;
    }

    get recoveryPlanInterface(): RecoveryPlanInterface {
        return this._recoveryPlanInterface;
    }

    set recoveryPlanInterface(value: RecoveryPlanInterface) {
        this._recoveryPlanInterface = value;
    }

    get planStages(): Stage[] {
        return this.recoveryPlanInterface.planStagesInterfaces
            .filter(v => v.stage.code !== RecoveryPlanService.DEFAULT_GROUP)
            .map(v => v.stage);
    }

    get username(): string {
        return this._storageService.getCurrentUser().username;
    }

    get groupLabel(): string {
        return this._groupLabel;
    }

    set groupLabel(value: string) {
        this._groupLabel = value;
    }

    get scrollInterface(): ScrollBarProperties {
        return this._scrollInterface;
    }

    set scrollInterface(value: ScrollBarProperties) {
        this._scrollInterface = value;
    }

    get nowPosition(): string {
        return this._nowPosition;
    }

    set nowPosition(value: string) {
        this._nowPosition = value;
    }
}

export interface ScrollBarProperties {
    isVisible: boolean;
    verticalScrollEnabled: boolean;
    horizontalScrollEnabled: boolean;
    autoHide: boolean;
}
