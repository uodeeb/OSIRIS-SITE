$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = 'e:\Books-library2025\mofsedon-novel\skills\kateb-ai.skill'
$outFile = 'e:\Books-library2025\mofsedon-novel\skill_content.txt'
$z = [System.IO.Compression.ZipFile]::OpenRead($zip)
$e = $z.Entries | Where-Object { $_.FullName -eq 'SKILL.md' }
$sr = New-Object System.IO.StreamReader($e.Open())
$txt = $sr.ReadToEnd()
$sr.Close()
$z.Dispose()
[System.IO.File]::WriteAllText($outFile, $txt)
Write-Output "Written $($txt.Length) chars to $outFile"
