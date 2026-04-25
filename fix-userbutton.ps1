# Fix both dashboards - remove invalid prop
$customerPath = "C:\Users\Dell_PC\serviko\app\dashboard\page.tsx"
$customerContent = Get-Content $customerPath -Raw
$customerContent = $customerContent -replace 'afterSignOutUrl="/login"', ''
[System.IO.File]::WriteAllText($customerPath, $customerContent, [System.Text.UTF8Encoding]::new($false))

$artistPath = "C:\Users\Dell_PC\serviko\app\artist-dashboard\page.tsx"
$artistContent = Get-Content $artistPath -Raw
$artistContent = $artistContent -replace 'afterSignOutUrl="/login"', ''
[System.IO.File]::WriteAllText($artistPath, $artistContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "Fixed UserButton props!"