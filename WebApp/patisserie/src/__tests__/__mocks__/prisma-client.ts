export const Prisma = {
  JsonNull: "JsonNull",
  Decimal: class Decimal {
    constructor(value: number) {
      return value;
    }
    toNumber() {
      return 0;
    }
  },
};
