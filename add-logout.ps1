# Fix Customer Dashboard - Add logout
$customerPath = "C:\Users\Dell_PC\serviko\app\dashboard\page.tsx"
$customerContent = Get-Content $customerPath -Raw

# Add UserButton import
$customerContent = $customerContent -replace 'import { useUser } from "@clerk/nextjs";', 'import { useUser, UserButton } from "@clerk/nextjs";'

# Add logout bar after the opening <div> in return statement
$customerContent = $customerContent -replace '(<div[^>]*style=\{\{[^}]*minHeight[^}]*\}\}[^>]*>)', '$1`n      {/* Logout Bar */}`n      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>`n        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>My Dashboard</h1>`n        <UserButton afterSignOutUrl="/login" />`n      </div>'

[System.IO.File]::WriteAllText($customerPath, $customerContent, [System.Text.UTF8Encoding]::new($false))

# Fix Artist Dashboard - Add logout
$artistPath = "C:\Users\Dell_PC\serviko\app\artist-dashboard\page.tsx"
$artistContent = Get-Content $artistPath -Raw

# Add UserButton import
$artistContent = $artistContent -replace 'import { useUser } from "@clerk/nextjs";', 'import { useUser, UserButton } from "@clerk/nextjs";'

# Add logout bar
$artistContent = $artistContent -replace '(<div[^>]*style=\{\{[^}]*minHeight[^}]*\}\}[^>]*>)', '$1`n      {/* Logout Bar */}`n      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>`n        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>Artist Dashboard</h1>`n        <UserButton afterSignOutUrl="/login" />`n      </div>'

[System.IO.File]::WriteAllText($artistPath, $artistContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "Logout buttons added!"