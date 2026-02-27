$ErrorActionPreference = "Stop"

# 1. Signup
$signupBody = @{
    username = "testuser_$(Get-Random)"
    email = "testuser_$(Get-Random)@example.com"
    password = "password123"
    role = @("creator")
} | ConvertTo-Json

Write-Host "Signing up..."
try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host "Signup successful: $($signupResponse.message)"
} catch {
    Write-Host "Signup failed: $_"
    exit
}

# 2. Signin
$signinBody = @{
    username = $signupBody | ConvertFrom-Json | Select-Object -ExpandProperty username
    password = "password123"
} | ConvertTo-Json

Write-Host "Signing in..."
try {
    $signinResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signin" -Method Post -Body $signinBody -ContentType "application/json"
    $token = $signinResponse.token
    Write-Host "Signin successful. Token acquired."
} catch {
    Write-Host "Signin failed: $_"
    exit
}

# 3. Get Templates
Write-Host "Fetching templates..."
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $templates = Invoke-RestMethod -Uri "http://localhost:8080/api/templates" -Method Get -Headers $headers
    Write-Host "Templates fetched successfully. Count: $($templates.Count)"
} catch {
    Write-Host "Fetch Templates failed. Error Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Error Details: $($_.ErrorDetails.Message)"
}
