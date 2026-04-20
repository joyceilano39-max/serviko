$filePath = "C:\Users\Dell_PC\serviko\app\page.tsx"
$content = [System.IO.File]::ReadAllText($filePath)
$peso = [char]0x20B1

# Use real starting_price from API instead of dummy function
$content = $content.Replace('}}>P{getStartingPrice(artist.services)}</p>', '}}>' + $peso + '{artist.starting_price || getStartingPrice(artist.services)}</p>')

# Replace P with peso for transport
$content = $content.Replace('+P{artist.transport_fee} transport', '+' + $peso + '{artist.transport_fee} transport')

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Homepage updated!"