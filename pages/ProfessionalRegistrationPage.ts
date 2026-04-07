import { Page, Locator } from '@playwright/test';

export class ProfessionalRegistrationPage {
  readonly page: Page;
  readonly bnrcLogo: Locator;
  readonly profRegistrationLink: Locator;
  readonly breadcrumb: Locator;
  readonly registrationNumberInput: Locator;
  readonly applicantNameInput: Locator;
  readonly dobInput: Locator;
  readonly calendarDialog: Locator;
  readonly yearButton2010: Locator;
  readonly yearRow2004_2006: Locator;
  readonly year2003: Locator;
  readonly monthsRow: Locator;
  readonly monthFebruary: Locator;
  readonly daysRow: Locator;
  readonly day1: Locator;
  readonly genderSelect: Locator;
  readonly emailInput: Locator;
  readonly mobileInput: Locator;
  readonly fatherNameInput: Locator;
  readonly nameAsPerAadhaarInput: Locator;
  readonly yearYYYYInput: Locator;
  readonly aadhaarInput: Locator;
  readonly stateSelect: Locator;
  readonly districtSelect: Locator;
  readonly qualificationSelect: Locator;
  readonly institutionNameInput: Locator;
  readonly locationInput: Locator;
  readonly startDateInput: Locator;
  readonly yearButton2026: Locator;
  readonly yearRow2020_2022: Locator;
  readonly year2021: Locator;
  readonly monthJanuary: Locator;
  readonly day3: Locator;
  readonly endDateInput: Locator;
  readonly year2022: Locator;
  readonly addMoreButton: Locator;
  readonly qualificationSelect2: Locator;
  readonly institutionNameInput2: Locator;
  readonly locationInput2: Locator;
  readonly startDateInput2: Locator;
  readonly year2023: Locator;
  readonly monthApril: Locator;
  readonly day4: Locator;
  readonly endDateInput2: Locator;
  readonly year2024: Locator;
  // readonly monthMay: Locator;
  readonly addMoreButton2: Locator;
  readonly qualificationSelect3: Locator;
  readonly institutionNameInput3: Locator;
  readonly locationInput3: Locator;
  readonly startDateInput3: Locator;
  readonly monthJune: Locator;
  readonly endDateInput3: Locator;
  readonly year2026: Locator;
  readonly day2: Locator;
  readonly workingStatusSelect: Locator;
  readonly companyNameInput: Locator;
  readonly locationInput4: Locator;
  readonly workingCheckbox: Locator;
  readonly wrkStartDateInput: Locator;
  readonly answerInput: Locator;
  readonly aadhaarConsentCheckbox: Locator;
  readonly submitButton: Locator;
  readonly invalidDialog: Locator;
  readonly okButton: Locator;
  readonly genericInvalidDialog: Locator;
  readonly areYouSureDialog: Locator;
  readonly yesSaveItButton: Locator;
  readonly successDialog: Locator;
  readonly professionalRegisteredText: Locator;
  readonly year2025: Locator;
  readonly day31: Locator;
  



  constructor(page: Page) {
    this.page = page;
    this.bnrcLogo = page.getByRole('link', { name: 'Bihar Nurses Registration' });
    this.profRegistrationLink = page.getByRole('link', { name: ' Professional Registration' });
    this.breadcrumb = page.getByRole('navigation', { name: 'breadcrumb' });
    this.registrationNumberInput = page.getByRole('textbox', { name: 'Enter Registration Number' });
    this.applicantNameInput = page.getByRole('textbox', { name: 'Enter Applicant Name' });
    this.dobInput = page.locator('input[name="dob"]');
    this.calendarDialog = page.getByRole('dialog', { name: 'calendar' });
    this.yearButton2010 = page.getByRole('button', { name: '2010' });
    this.yearRow2004_2006 = page.getByRole('row', { name: '2004 2005 2006' });
    // this.year2003 = page.getByText('2003', { exact: true });
    this.year2003 = page.getByText('2003', { exact: true }).filter({ has: this.calendarDialog });
    this.monthsRow = page.getByRole('row', { name: 'January February March' });
    this.monthFebruary = page.getByText('February');
    this.daysRow = page.getByRole('row', { name: 'weekday weekday weekday' });
    this.day1 = page.getByText('1', { exact: true }).first();
    this.genderSelect = page.locator('form div').filter({ hasText: 'Applicant Name *Date of Birth' }).getByRole('combobox');
    this.emailInput = page.getByRole('textbox', { name: 'example@gmail.com' });
    this.mobileInput = page.getByRole('textbox', { name: 'Enter Mobile Number' });
    this.fatherNameInput = page.getByRole('textbox', { name: 'Enter Father\'s Name' });
    this.nameAsPerAadhaarInput = page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' });
    this.yearYYYYInput = page.getByRole('textbox', { name: 'YYYY', exact: true });
    this.aadhaarInput = page.getByRole('textbox', { name: '0000 0000' });
    this.stateSelect = page.locator('select[name="stateId"]');
    this.districtSelect = page.locator('select[name="districtId"]');
    this.qualificationSelect = page.locator('.form-select.ng-untouched.ng-pristine').first();
    this.institutionNameInput = page.getByRole('textbox', { name: 'Enter Name of the Institution' }).first();
    this.locationInput = page.getByRole('textbox', { name: 'Enter Location' }).first();
    this.startDateInput = page.locator('input[name="startDate"]').first();
    this.yearButton2026 = page.getByRole('button', { name: '2026' });
    this.yearRow2020_2022 = page.getByRole('row', { name: '2020 2021 2022' });
    // this.year2021 = page.getByText('2021');
    this.year2021 = page.getByText('2021', { exact: true }).filter({ has: this.calendarDialog });
    this.monthJanuary = page.getByText('January');
    this.day3 = page.getByText('3', { exact: true }).first();
    this.endDateInput = page.locator('input[name="endDate"]').first();
    // this.year2022 = page.getByText('2022');
    this.year2022 = page.getByText('2022', { exact: true }).filter({ has: this.calendarDialog });
    this.addMoreButton = page.getByRole('button', { name: '' }).first();
    this.qualificationSelect2 = page.locator('.form-select.ng-untouched').first();
    this.institutionNameInput2 = page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(1);
    this.locationInput2 = page.getByRole('textbox', { name: 'Enter Location' }).nth(1);
    this.startDateInput2 = page.locator('input[name="startDate"]').nth(1);
    this.year2023 = page.getByText('2023');
    this.monthApril = page.getByText('April');
    this.day4 = page.getByText('4', { exact: true }).first();
    this.endDateInput2 = page.locator('input[name="endDate"]').nth(1);
    // this.year2025 = page.getByText('2025');
    this.year2025 = page.getByText('2025', { exact: true }).filter({ has: this.calendarDialog });
    this.monthJanuary = page.getByText('January');
    this.addMoreButton2 = page.getByRole('button', { name: '' }).nth(1);
    this.qualificationSelect3 = page.locator('.form-select.ng-untouched').first();
    this.institutionNameInput3 = page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(2);
    this.locationInput3 = page.getByRole('textbox', { name: 'Enter Location' }).nth(2);
    this.startDateInput3 = page.locator('input[name="startDate"]').nth(2);
    this.monthJune = page.getByText('June');
    this.endDateInput3 = page.locator('input[name="endDate"]').nth(2);
    this.year2026 = page.getByText('2026');
    this.day2 = page.getByText('2', { exact: true }).first();
    // this.workingStatusSelect = page.locator('.form-select.ng-untouched');
    this.workingStatusSelect = page.locator('select[formcontrolname="jobTitle"]');
    this.companyNameInput = page.getByRole('textbox', { name: 'Enter Company Name' });
    this.locationInput4 = page.getByRole('textbox', { name: 'Enter Location' }).nth(3);
    this.workingCheckbox = page.getByRole('checkbox').first();
    this.wrkStartDateInput = page.locator('input[name="wrkStartDate"]');
    this.answerInput = page.getByRole('textbox', { name: 'Enter Answer' });
    this.aadhaarConsentCheckbox = page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.invalidDialog = page.getByRole('dialog', { name: 'INVALID' });
    this.okButton = page.getByRole('button', { name: 'OK' });
    this.genericInvalidDialog = page.getByRole('dialog', { name: 'Invalid' });
    this.areYouSureDialog = page.getByRole('dialog', { name: 'Are you sure?' });
    this.yesSaveItButton = page.getByRole('button', { name: 'Yes, save it!' });
    this.successDialog = page.getByRole('dialog', { name: 'Success' });
    this.professionalRegisteredText = page.getByText('Professional Registered');
    this.year2025 = page.getByText('2025');
    this.day31 = page.getByText('31', { exact: true }).first();
    this.year2024 = page.getByText('2024');
    this.day1 = page.getByText('1', { exact: true }).first();



  }

  async navigate() {
    await this.page.goto('https://bnrc2.bihar.gov.in/home');
  }

  async clickProfessionalRegistration() {
    await this.profRegistrationLink.click();
  }

  async fillPersonalDetails(regNo: string, name: string) {
    await this.registrationNumberInput.click();
    await this.registrationNumberInput.fill(regNo);
    await this.applicantNameInput.click();
    await this.applicantNameInput.fill(name);
  }

  async selectDateOfBirth() {
    await this.dobInput.click();
    await this.yearButton2010.click();
    await this.year2003.click();
    await this.monthFebruary.click();
    await this.day1.click();
  }

  async fillContactDetails(email: string, mobile: string, fatherName: string) {
    await this.genderSelect.selectOption('2');
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.emailInput.press('Tab');
    await this.mobileInput.fill(mobile);
    await this.mobileInput.press('Tab');
    await this.fatherNameInput.fill(fatherName);
    await this.fatherNameInput.press('CapsLock');
    await this.fatherNameInput.press('CapsLock');
  }

  async fillAadhaarDetails(name: string, aadhaar: string) {
    await this.nameAsPerAadhaarInput.click();
    await this.nameAsPerAadhaarInput.fill(name);
    await this.nameAsPerAadhaarInput.press('Tab');
    await this.yearYYYYInput.click();
    await this.year2003.click();
    await this.aadhaarInput.click();
    await this.aadhaarInput.fill(aadhaar);
  }

  async selectAddress() {
    await this.stateSelect.selectOption('7');
    await this.stateSelect.selectOption('4');
    await this.districtSelect.selectOption('10');
  }

  async fillFirstQualification(instName: string, location: string) {
    await this.qualificationSelect.selectOption('1');
    await this.institutionNameInput.click();
    await this.institutionNameInput.fill(instName);
    await this.locationInput.click();
    await this.locationInput.fill(location);
    await this.startDateInput.click();
    await this.yearButton2026.click();
    await this.year2021.click();
    await this.monthJanuary.click();
    await this.day3.click();
    await this.endDateInput.click();
    await this.yearButton2026.click();
    await this.year2022.click();
    await this.monthFebruary.click();
    await this.day1.click();
  }

  async fillSecondQualification(instName: string, location: string) {
    await this.addMoreButton.click();
    await this.qualificationSelect2.selectOption('2');
    await this.institutionNameInput2.click();
    await this.institutionNameInput2.fill(instName);
    await this.locationInput2.click();
    await this.locationInput2.fill(location);
    await this.startDateInput2.click();
    await this.yearButton2026.click();
    await this.year2024.click();
    await this.monthFebruary.click();
    await this.day1.click();
    await this.endDateInput2.click();
    await this.yearButton2026.click();
    await this.year2025.click();
    await this.monthJanuary.click();
    await this.day31.click();
  }

  async fillThirdQualification(instName: string, location: string) {
    await this.addMoreButton2.click();
    await this.qualificationSelect3.selectOption('3');
    await this.institutionNameInput3.click();
    await this.institutionNameInput3.fill(instName);
    await this.locationInput3.click();
    await this.locationInput3.fill(location);
    await this.startDateInput3.click();
    await this.yearButton2026.click();
    await this.year2025.click();
    await this.monthFebruary.click();
    await this.day1.click();
    await this.endDateInput3.click();
    await this.yearButton2026.click();
    await this.year2026.click();
    await this.monthFebruary.click();
    await this.day3.click();
  }

  async fillWorkExperience(companyName: string, location: string) {
    // await this.workingStatusSelect.selectOption('2');
    await this.workingStatusSelect.selectOption({ label: 'Nurse Practitioner' });
    await this.companyNameInput.click();
    await this.companyNameInput.fill(companyName);
    await this.locationInput4.click();
    await this.locationInput4.fill(location);
    await this.workingCheckbox.check();
    await this.wrkStartDateInput.click();
    await this.day2.click();
  }

  async submitForm(answer: string) {
    await this.answerInput.click();
    await this.answerInput.fill(answer);
    await this.aadhaarConsentCheckbox.check();
    await this.submitButton.click();
  }

  async confirmSubmission() {
    await this.yesSaveItButton.click();
  }

  async clickOk() {
    await this.okButton.click();
  }
}
