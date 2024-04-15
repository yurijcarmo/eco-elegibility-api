import { IneligibilityReasonEnum } from '../enums';

export class IneligibleResponseModel {
    eligible: boolean;
    reasons: IneligibilityReasonEnum[];

    constructor(reasons: IneligibilityReasonEnum[]) {
        this.reasons = reasons;
        this.eligible = false;
    }

    static create(reasons: IneligibilityReasonEnum[]): IneligibleResponseModel {
        return new IneligibleResponseModel(reasons);
    }
}