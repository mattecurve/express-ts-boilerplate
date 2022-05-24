import { AmountType, IAmount } from '../db';

/**
 * Standard class for money
 */
export class Money {
    private m: IAmount;

    constructor(m: IAmount) {
        this.m = m;
    }

    static createCurrency(value: number, currency: string | undefined, isSmallestForm: boolean) {
        // by default we are considering the currency as INR
        // and we store smallest value of the currency in the system
        return new Money({
            value: isSmallestForm ? value : value * Money.getCurrencyMultiplier(null),
            type: AmountType.Currency,
            currency,
        });
    }

    static createBonus(value: number) {
        return new Money({
            value,
            type: AmountType.Bonus,
            currency: undefined,
        });
    }

    static createCoin(value: number) {
        return new Money({
            value,
            type: AmountType.Coin,
            currency: undefined,
        });
    }

    getMoney(): IAmount {
        return this.m;
    }

    getValue(presentation: boolean = false): number {
        if (presentation && this.m.type === AmountType.Currency) {
            // by default we are considering the currency as INR
            // and we store smallest value of the currency in the system
            return this.m.value / Money.getCurrencyMultiplier(null);
        }

        return this.m.value;
    }

    add(money: Money) {
        this.m.value += money.getValue();
    }

    subtract(money: Money) {
        this.m.value -= money.getValue();
    }

    multiply(money: Money) {
        this.m.value *= money.getValue();
    }

    divide(money: Money) {
        this.m.value /= money.getValue();
    }

    convertToCurrency(): Money {
        if (this.m.type !== AmountType.Bonus) {
            throw new Error(`Conversion to currency not supported for - ${this.m.type}`);
        }

        // 1 bonus = 1 INR = 100 paisa
        const val = this.m.value * 1;
        return Money.createCurrency(val, undefined, false);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getCurrencyMultiplier(currency: string | null): number {
        // by default we are considering the currency as INR
        // this is the multiplier that is used to convert a value to it's lowest form
        return 100;
    }
}
