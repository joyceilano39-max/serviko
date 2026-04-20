$filePath = "C:\Users\Dell_PC\serviko\app\booking\page.tsx"
$content = [System.IO.File]::ReadAllText($filePath)
$peso = [char]0x20B1
$content = $content.Replace('{(selectedArtist.services || []).map(serviceName => {', '{(artistServices.length > 0 ? artistServices.map(s => s.name) : (selectedArtist.services || [])).map(serviceName => {')
$content = $content.Replace('SubtotalP', 'Subtotal' + $peso)
$content = $content.Replace('TransportP', 'Transport' + $peso)
$content = $content.Replace('TotalP', 'Total' + $peso)
$content = $content.Replace('DiscountP', 'Discount' + $peso)
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done!"