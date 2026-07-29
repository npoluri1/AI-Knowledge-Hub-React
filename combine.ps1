$base = "D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React"
$files = @(
    "edureka_supplementary.md",
    "edureka_generative_ai_masters_program.md",
    "edureka_enhance_c1.md",
    "edureka_enhance_c2.md",
    "edureka_enhance_c3.md",
    "edureka_enhance_c4.md",
    "edureka_enhance_c5.md",
    "edureka_global_projects.md"
)
$output = Join-Path $base "edureka_generative_ai_masters_program_final.md"
$sb = New-Object System.Text.StringBuilder
foreach ($f in $files) {
    $path = Join-Path $base $f
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        [void]$sb.AppendLine($content)
        [void]$sb.AppendLine()
        [void]$sb.AppendLine("---")
        [void]$sb.AppendLine()
        Write-Host "Added: $f"
    } else {
        Write-Host "MISSING: $f"
    }
}
[System.IO.File]::WriteAllText($output, $sb.ToString(), [System.Text.Encoding]::UTF8)
$size = (Get-Item $output).Length
$lines = (Get-Content $output | Measure-Object -Line).Lines
Write-Host "Done! Size: $size bytes, Lines: $lines"
