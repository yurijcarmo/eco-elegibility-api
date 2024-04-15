const CO2_EMISSIONS_PER_1000_KWH = 84;
const MONTHS_PER_YEAR = 12;
const EMISSION_CALCULATION_FACTOR = 1000;

export const calculateAnnualCo2Emissions = (
    averageMonthlyConsumption: number
): number => {
    const annualConsumption = averageMonthlyConsumption * MONTHS_PER_YEAR;
    return (
        annualConsumption * CO2_EMISSIONS_PER_1000_KWH
    ) / EMISSION_CALCULATION_FACTOR;
};

export const calculateAverageConsumption = (
    consumptionHistory: number[]
): number => {
    const totalConsumption = consumptionHistory.reduce(
        (acc, cur) => acc + cur, 0);
    return totalConsumption / consumptionHistory.length;
};