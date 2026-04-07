
import openpyxl

# Load the workbook
workbook = openpyxl.load_workbook("C:/Users/Harsh/Downloads/new-course/bnrc-tests/Verhoeff Algorithm.xlsx")

# Select the first sheet
sheet = workbook.active

# Read the value from cell A1
aadhar_number = sheet['A1'].value

# Print the aadhar number
print(aadhar_number)
