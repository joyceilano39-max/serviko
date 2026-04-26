$path = "C:\Users\Dell_PC\serviko\app\register\artist\page.tsx"
(Get-Content $path -Raw) -replace '\[clerkResult\.id\].*?\)', 'clerkResult.id' -replace '\[form\.(email|name|phone|city|bio)\].*?\)', 'form.$1' | Set-Content $path -NoNewline
npm run build
