$ErrorActionPreference = "Stop"

# 1. Signup as Admin/Creator
$username = "creator_$(Get-Random)"
$signupBody = @{
    username = $username
    email = "$username@example.com"
    password = "password123"
    role = @("admin") # Admin needed to create template directly via API based on controller security or use creator role if allowed
} | ConvertTo-Json

Write-Host "Signing up $username..."
try {
    $r = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
} catch {
    Write-Host "Signup failed: $_"
    exit
}

# 2. Login
$signinBody = @{
    username = $username
    password = "password123"
} | ConvertTo-Json

Write-Host "Logging in..."
try {
    $authResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signin" -Method Post -Body $signinBody -ContentType "application/json"
    $token = $authResponse.token
    Write-Host "Logged in."
} catch {
    Write-Host "Login failed: $_"
    exit
}

# 3. Create Template with Files
$filesJson = '[{"originalName":"test.pdf","fileName":"123-test.pdf","size":1024}]'
$templateBody = @{
    title = "File Test Template $(Get-Random)"
    description = "Testing file persistence"
    formSchema = "[]"
    files = $filesJson
    reviewerGroup = @{id=1}
    approverGroup = @{id=2}
} | ConvertTo-Json

Write-Host "Creating Template with files..."
$headers = @{ Authorization = "Bearer $token" }

try {
    $template = Invoke-RestMethod -Uri "http://localhost:8080/api/templates" -Method Post -Body $templateBody -ContentType "application/json" -Headers $headers
    Write-Host "Template Created. ID: $($template.id)"
} catch {
    Write-Host "Create Template failed: $_"
    Write-Host "Response: $($_.Exception.Response)"
    # Continue if possible, or exit
    exit
}

# 4. Fetch Template and Verify Files
Write-Host "Fetching Template..."
try {
    $fetchedTemplate = Invoke-RestMethod -Uri "http://localhost:8080/api/templates/$($template.id)" -Method Get -Headers $headers
    
    Write-Host "Fetched Template Files (Raw):"
    Write-Host $fetchedTemplate.files
    
    if ($fetchedTemplate.files -eq $filesJson) {
        Write-Host "SUCCESS: Files persisted correctly."
    } else {
        Write-Host "FAILURE: Files mismatch."
        Write-Host "Expected: $filesJson"
        Write-Host "Actual:   $($fetchedTemplate.files)"
    }

} catch {
    Write-Host "Fetch Template failed: $_"
}
