export class EligibleResponseModel {
    eligible: boolean;
    annualCo2Savings: number;

    constructor(annualCo2Savings: number) {
        this.annualCo2Savings = annualCo2Savings;
        this.eligible = true
    }

    static create(co2Savings: number): EligibleResponseModel {
        return new EligibleResponseModel(co2Savings);
    }
}