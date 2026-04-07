export function generateTestData() {
    // Test data generation logic will go here
}
// utils/dataGenerator.ts
export class Verhoeff {
  static d = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0]
  ];
  static p = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8]
  ];
  static inv = [0,4,3,2,1,5,6,7,8,9];

  static generate(num: string): number {
    let c = 0;
    for (let i = num.length - 1; i >= 0; i--) {
      c = Verhoeff.d[c][Verhoeff.p[(num.length - i) % 8][parseInt(num[i], 10)]];
    }
    return Verhoeff.inv[c];
  }

  static makeAadhaarSeed(): string {
    return String(Math.floor(10000000000 + Math.random() * 90000000000));
  }

  static createAadhaar(): string {
    const seed = Verhoeff.makeAadhaarSeed();
    const checksum = Verhoeff.generate(seed);
    return seed + checksum;
  }
}

export class DataGenerator {
  static randomName(prefix = "User"): string {
    return `${prefix}${Math.floor(Math.random() * 10000)}`;
  }

  static randomEmail(): string {
    return `user${Math.floor(1000 + Math.random() * 9000)}@test.com`;
  }

  static randomMobile(): string {
    // 10 digit starting with 9 (India-like)
    return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
  }

  static randomDOB(minYear = 1985, maxYear = 2002) {
    const year = Math.floor(minYear + Math.random() * (maxYear - minYear + 1));
    const month = Math.floor(Math.random() * 12); // 0-11
    const day = Math.floor(1 + Math.random() * 28); // keep safe for month days
    return { year, month, day };
  }
}
