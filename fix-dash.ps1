$dashPath = "C:\Users\Dell_PC\serviko\app\admin\page.tsx"
$content = Get-Content $dashPath -Raw

# Replace the tabs array with simple text labels (no icons)
$newTabs = @"
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "finance", label: "Finance" },
    { id: "tax", label: "Taxes (BIR)" },
    { id: "users", label: "Users" },
    { id: "bookings", label: "Bookings" },
    { id: "vouchers", label: "Vouchers" },
    { id: "expenses", label: "Expenses" },
    { id: "analytics", label: "Analytics" }
  ];
"@

$content = $content -replace 'const tabs: \{ id: Tab; label: string; icon: string \}\[\] = \[[^\]]+\];', $newTabs

# Update the button mapping to not use icon
$content = $content -replace '\{tabs\.map\(t => \([^)]+\)[^{]+\{[^}]+<span>\{t\.icon\}</span>\{t\.label\}[^}]+\}\)\)\}', '{tabs.map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", padding: "10px 12px", border: "none", background: tab === t.id ? "#F3F4F6" : "transparent", color: tab === t.id ? "#111827" : "#6B7280", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: tab === t.id ? 700 : 500, textAlign: "left", marginBottom: "2px" }}>{t.label}</button>))}'

[System.IO.File]::WriteAllText($dashPath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Admin dashboard fixed!"