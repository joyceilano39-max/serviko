$filePath = "C:\Users\Dell_PC\serviko\app\booking\page.tsx"
$content = [System.IO.File]::ReadAllText($filePath)
$peso = [char]0x20B1

$content = $content.Replace('const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);', 'const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);' + [Environment]::NewLine + '  const [artistServices, setArtistServices] = useState<Array<{ name: string; price: number }>>([]);')

$fetchFn = 'const fetchArtistServices = async (artistId: number) => {' + [Environment]::NewLine + '    try {' + [Environment]::NewLine + '      const res = await fetch("/api/artist-services?artistId=" + artistId);' + [Environment]::NewLine + '      const data = await res.json();' + [Environment]::NewLine + '      if (data.services) {' + [Environment]::NewLine + '        setArtistServices(data.services.map((s: any) => ({ name: s.service_name, price: parseFloat(s.price) })));' + [Environment]::NewLine + '      }' + [Environment]::NewLine + '    } catch {}' + [Environment]::NewLine + '  };' + [Environment]::NewLine + [Environment]::NewLine + '  const getRealPrice = (serviceName: string): number => {' + [Environment]::NewLine + '    const match = artistServices.find(s => s.name === serviceName);' + [Environment]::NewLine + '    return match ? match.price : 300;' + [Environment]::NewLine + '  };' + [Environment]::NewLine + [Environment]::NewLine + '  const toggleService = (mIdx: number, serviceName: string) => {'

$content = $content.Replace('const toggleService = (mIdx: number, serviceName: string) => {', $fetchFn)
$content = $content.Replace('if (found) setSelectedArtist(found);', 'if (found) { setSelectedArtist(found); fetchArtistServices(found.id); }')
$content = $content.Replace('const price = getServicePrice(serviceName);', 'const price = getRealPrice(serviceName);')
$content = $content.Replace('>P{price}</span>', '>' + $peso + '{price}</span>')
$content = $content.Replace('>P{s.price}</span>', '>' + $peso + '{s.price}</span>')

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done!"