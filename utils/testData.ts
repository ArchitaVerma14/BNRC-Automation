import { faker } from '@faker-js/faker';

export function getDynamicUser() {
  return {
    name: faker.person.fullName().replace(/[^A-Za-z ]/g, ''),
    phone: '9' + faker.number.int({ min: 100000000, max: 999999999 }),
    aadhaar: '4' + faker.number.int({ min: 100000000000, max: 999999999999 }).toString().slice(1),
    fatherName: faker.person.fullName().replace(/[^A-Za-z ]/g, ''),
    email: faker.internet.email(),
  };
}
