chcp 65001 > $null  # Ensure UTF-8 encoding

# --- CONFIGURATION ---
$File = "C:\Users\Harsh\Downloads\new-course\bnrc-tests\test\prod\certificate.js"

$To = "archita.verma@piramalswasthya.org"
$From = "architav217@gmail.com"
$SmtpServer = "smtp.gmail.com"

$User = "architav217@gmail.com"
$AppPassword = "bzqh buff bxou unpr"   # Your Gmail App Password
$SecurePassword = ConvertTo-SecureString $AppPassword -AsPlainText -Force
$Credential = New-Object System.Management.Automation.PSCredential ($User, $SecurePassword)

# Folder where screenshots are saved
$ScreenshotDir = "C:\Users\Harsh\Downloads\new-course\bnrc-tests\BNRCscreenshots"

# --- RUN MOCHA TEST ---
$Output = & "npx" mocha $File 2>&1
$ExitCode = $LASTEXITCODE

# --- CLEAN OUTPUT FOR EMAIL ---
$AnsiStripped = $Output -replace '\x1B\[[0-9;]*[A-Za-z]', ''
$CleanOutput = $AnsiStripped `
    -replace '✓', '[PASS]' `
    -replace '✔', '[PASS]' `
    -replace '✖', '[FAIL]' `
    -replace '✗', '[FAIL]' `
    -replace '[^\x00-\x7F]', ''  # Remove non-ASCII characters

# --- PICK LATEST SCREENSHOT ---
$SuccessFile = Get-ChildItem -Path $ScreenshotDir -Filter "certification_verification_success_*.png" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1

$FailFile = Get-ChildItem -Path $ScreenshotDir -Filter "certification_verification_failure_*.png" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1

# --- DETERMINE STATUS AND ATTACHMENT ---
if ($ExitCode -eq 0 -and $SuccessFile) {
    $Screenshot = $SuccessFile.FullName
    $Subject = "PASS Mocha Test Success: Certificate Verification"
    $Body = "Script executed successfully.`n`nLogs:`n$CleanOutput"
} elseif ($ExitCode -ne 0 -and $FailFile) {
    $Screenshot = $FailFile.FullName
    $Subject = "FAIL Mocha Test Failed: Certificate Verification"
    $Body = "Script failed with exit code $ExitCode.`n`nLogs:`n$CleanOutput"
} else {
    $Screenshot = $null
    $Subject = "Mocha Test Executed: Certificate Verification"
    $Body = "Logs:`n$CleanOutput"
}

# --- SEND EMAIL ---
if ($Screenshot -and (Test-Path $Screenshot)) {
    Write-Host "[DEBUG] Attaching screenshot: $Screenshot"
    Send-MailMessage -To $To -From $From -Subject $Subject -Body $Body `
        -SmtpServer $SmtpServer -Port 587 -UseSsl -Credential $Credential `
        -Attachments $Screenshot
} else {
    Write-Host "[DEBUG] No screenshot found, sending email without attachment"
    Send-MailMessage -To $To -From $From -Subject $Subject -Body $Body `
        -SmtpServer $SmtpServer -Port 587 -UseSsl -Credential $Credential
}
