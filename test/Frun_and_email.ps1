chcp 65001 > $null

$File = "C:\Users\Harsh\Downloads\new-course\bnrc-tests\test\prod\foreign.js"

# Run your Mocha test with npx
$Output = & "npx" mocha $File 2>&1
$ExitCode = $LASTEXITCODE
# Replace tick and cross symbols with plain text
$AnsiStripped = $Output -replace '\x1B\[[0-9;]*[A-Za-z]', ''
$CleanOutput = $AnsiStripped `
    -replace '✓', '[PASS]' `
    -replace '✔', '[PASS]' `
    -replace '✖', '[FAIL]' `
    -replace '✗', '[FAIL]' `
    -replace '[^\x00-\x7F]', ''  # Email details
$To = "archita.verma@piramalswasthya.org", "tripti.bhattar@piramalswasthya.org"
$From = "architav217@gmail.com"
$SmtpServer = "smtp.gmail.com"

# Screenshot path (from your test)
$Screenshot = "C:\Users\Harsh\Downloads\new-course\bnrc-tests\BNRCscreenshots\foreign_registration_success.png"

$CleanFile = $File -replace '[^\x00-\x7F]', ''
# Determine status
if ($ExitCode -eq 0) {
    $Subject = "PASS Mocha Test Success: Foreign Certification"
    $Body = "Script executed successfully.`n`nLogs:`n$CleanOutput"
} else {
    $Subject = "FAIL Mocha Test Failed: Foreign Certification"
    $Body = "Script failed with exit code $ExitCode.`n`nLogs:`n$CleanOutput"
}

# Use your App Password for automatic login
$User = "architav217@gmail.com"
$AppPassword = "bzqh buff bxou unpr"   # Your Gmail App Password
$SecurePassword = ConvertTo-SecureString $AppPassword -AsPlainText -Force
$Credential = New-Object System.Management.Automation.PSCredential ($User, $SecurePassword)

# Send email with screenshot if exists
if (Test-Path $Screenshot) {
    Send-MailMessage -To $To -From $From -Subject $Subject -Body $Body `
        -SmtpServer $SmtpServer -Port 587 -UseSsl -Credential $Credential `
        -Attachments $Screenshot
} else {
    Send-MailMessage -To $To -From $From -Subject $Subject -Body $Body `
        -SmtpServer $SmtpServer -Port 587 -UseSsl -Credential $Credential
}
