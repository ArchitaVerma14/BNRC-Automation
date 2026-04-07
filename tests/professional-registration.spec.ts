import { test, expect } from '@playwright/test';
import { ProfessionalRegistrationPage } from '../pages/ProfessionalRegistrationPage';

test('Professional Registration flow', async ({ page }) => {
  const registrationPage = new ProfessionalRegistrationPage(page);

  // 1. Navigate and verify homepage
  await registrationPage.navigate();
  await expect(registrationPage.bnrcLogo).toBeVisible();

  // 2. Click Professional Registration and verify navigation
  await registrationPage.clickProfessionalRegistration();
  await expect(registrationPage.breadcrumb).toBeVisible();

  // 3. Fill Personal Details and DOB
  await registrationPage.fillPersonalDetails('ddddddddd4', 'Niharika');
  
  await registrationPage.dobInput.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  
  await registrationPage.yearButton2010.click();
  await expect(registrationPage.yearRow2004_2006).toBeVisible();
  
  await registrationPage.year2003.click();
  await expect(registrationPage.monthsRow).toBeVisible();
  
  await registrationPage.monthFebruary.click();
  await expect(registrationPage.daysRow).toBeVisible();
  
  await registrationPage.day1.click();

  // 4. Fill Contact and Aadhaar Details
  await registrationPage.fillContactDetails('ssssss@gmail.com', '8888888888', 'ddddddd');
  
  await registrationPage.nameAsPerAadhaarInput.click();
  await registrationPage.nameAsPerAadhaarInput.fill('Niharika');
  await registrationPage.nameAsPerAadhaarInput.press('Tab');
  
  await registrationPage.yearYYYYInput.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  await registrationPage.year2003.click();
  
  await registrationPage.aadhaarInput.click();
  await registrationPage.aadhaarInput.fill('555689715387');

  // 5. Select Address
  await registrationPage.selectAddress();

  // 6. First Qualification
  await registrationPage.qualificationSelect.selectOption('1');
  await registrationPage.qualificationSelect.selectOption('1'); // As per original file
  await registrationPage.institutionNameInput.click();
  await registrationPage.institutionNameInput.fill('aaaaa');
  await registrationPage.locationInput.click();
  await registrationPage.locationInput.fill('aaaaaaaa');
  
  await registrationPage.startDateInput.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  await registrationPage.yearButton2026.click();
  await expect(registrationPage.yearRow2020_2022).toBeVisible();
  await registrationPage.year2021.click();
  await expect(registrationPage.monthsRow).toBeVisible();
  await registrationPage.monthJanuary.click();
  await expect(registrationPage.daysRow).toBeVisible();
  await registrationPage.day3.click();

  await registrationPage.endDateInput.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  await registrationPage.yearButton2026.click();
  await expect(registrationPage.yearRow2020_2022).toBeVisible();
  await registrationPage.year2022.click();
  await expect(registrationPage.monthsRow).toBeVisible();
  await registrationPage.monthFebruary.click();
  await expect(registrationPage.daysRow).toBeVisible();
  await registrationPage.day1.click();

  // 7. Second Qualification
  await registrationPage.addMoreButton.click();
  await registrationPage.qualificationSelect2.selectOption('2');
  await registrationPage.institutionNameInput2.click();
  await registrationPage.institutionNameInput2.fill('dddddddd');
  await registrationPage.locationInput2.click();
  await registrationPage.locationInput2.fill('ddddddddddddd');
  
  await registrationPage.startDateInput2.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  await registrationPage.yearButton2026.click();
  await expect(registrationPage.yearRow2020_2022).toBeVisible();
  await registrationPage.year2023.click();
  await expect(registrationPage.monthsRow).toBeVisible();
  await registrationPage.monthApril.click();
  await expect(registrationPage.daysRow).toBeVisible();
  await registrationPage.day4.click();

  await registrationPage.endDateInput2.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  await registrationPage.yearButton2026.click();
  await expect(registrationPage.yearRow2020_2022).toBeVisible();
  await registrationPage.year2024.click();
  await expect(registrationPage.monthsRow).toBeVisible();
  // await registrationPage.monthMay.click();
  await expect(registrationPage.daysRow).toBeVisible();
  await registrationPage.day1.click();

  // 8. Third Qualification
  await registrationPage.addMoreButton2.click();
  await registrationPage.qualificationSelect3.selectOption('3');
  await registrationPage.institutionNameInput3.click();
  await registrationPage.institutionNameInput3.fill('gggggggg');
  await registrationPage.locationInput3.click();
  await registrationPage.locationInput3.fill('ffffffffff');
  
  await registrationPage.startDateInput3.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  await registrationPage.yearButton2026.click();
  await expect(registrationPage.yearRow2020_2022).toBeVisible();
  await registrationPage.year2024.click();
  await expect(registrationPage.monthsRow).toBeVisible();
  await registrationPage.monthJune.click();
  await expect(registrationPage.daysRow).toBeVisible();
  await registrationPage.day4.click();

  await registrationPage.endDateInput3.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  await registrationPage.yearButton2026.click();
  await expect(registrationPage.yearRow2020_2022).toBeVisible();
  await registrationPage.year2026.click();
  await expect(registrationPage.monthsRow).toBeVisible();
  await registrationPage.monthFebruary.click();
  await expect(registrationPage.daysRow).toBeVisible();
  await registrationPage.day2.click();

  // 9. Work Experience
  await registrationPage.workingStatusSelect.selectOption('2');
  await registrationPage.companyNameInput.click();
  await registrationPage.companyNameInput.fill('vvvvvvv');
  await registrationPage.locationInput4.click();
  await registrationPage.locationInput4.fill('fffffff');
  await registrationPage.workingCheckbox.check();
  await registrationPage.wrkStartDateInput.click();
  await expect(registrationPage.calendarDialog).toBeVisible();
  await registrationPage.day2.click();

  // 10. Submission Sequence
  await registrationPage.submitForm('1');
  await expect(registrationPage.invalidDialog).toBeVisible();
  await registrationPage.clickOk();
  await expect(registrationPage.breadcrumb).toBeVisible();

  await registrationPage.submitButton.click();
  await expect(registrationPage.genericInvalidDialog).toBeVisible();
  await registrationPage.clickOk();
  await expect(registrationPage.breadcrumb).toBeVisible();

  await registrationPage.submitButton.click();
  await expect(registrationPage.genericInvalidDialog).toBeVisible();
  await registrationPage.clickOk();
  await expect(registrationPage.breadcrumb).toBeVisible();

  await registrationPage.submitButton.click();
  await expect(registrationPage.areYouSureDialog).toBeVisible();

  await registrationPage.confirmSubmission();
  await expect(registrationPage.successDialog).toBeVisible();

  await expect(registrationPage.professionalRegisteredText).toBeVisible();
  await registrationPage.clickOk();
});