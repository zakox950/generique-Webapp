export const Prisma = {
  JsonNull: "JsonNull",
  Decimal: class Decimal {
    private value: number;
    constructor(value: number) {
      this.value = value;
    }
    toNumber() {
      return this.value;
    }
  },
};
