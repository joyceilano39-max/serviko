$filePath = "C:\Users\Dell_PC\serviko\app\booking\page.tsx"
$content = [System.IO.File]::ReadAllText($filePath)
$peso = [char]0x20B1
$bullet = [char]0x2022
$arrow = [char]0x2192
$check = [char]0x2713

# Use artist's real services instead of default categories
$content = $content.Replace('{(selectedArtist.services || []).map(serviceName => {', '{(artistServices.length > 0 ? artistServices.map(s => s.name) : (selectedArtist.services || [])).map(serviceName => {')

# Fix all encoding issues
$content = $content.Replace([char]0xC3 + [char]0xA2 + [char]0xE2 + [char]0x80 + [char]0xA2, $bullet.ToString())
$content = $content.Replace([char]0xC3 + [char]0xA2 + [char]0x9C + [char]0x93, $check.ToString())
$content = $content.Replace('â€¢', $bullet.ToString())
$content = $content.Replace('âœ"', $check.ToString())
$content = $content.Replace('â†', $arrow.ToString())

# Fix remaining P to peso in Summary section
$content = $content.Replace('SubtotalP', 'Subtotal' + $peso)
$content = $content.Replace('TransportP', 'Transport' + $peso)
$content = $content.Replace('TotalP', 'Total' + $peso)
$content = $content.Replace('DiscountP', 'Discount' + $peso)

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done!"