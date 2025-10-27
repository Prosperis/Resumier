# Fix vitest imports - remove globals but keep vi
$testFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.test.ts*"

foreach ($file in $testFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Pattern 1: import { ... } from "vitest" with multiple items including vi
    # Keep only vi
    $content = $content -replace 'import\s*\{\s*([^}]*?)\}\s*from\s*["\']vitest["\']', {
        param($match)
        $imports = $match.Groups[1].Value
        # Extract vi if present
        if ($imports -match '\bvi\b') {
            'import { vi } from "vitest"'
        } else {
            # No vi, remove the entire import
            ''
        }
    }
    
    # Remove empty lines that might be left
    $content = $content -replace '(?m)^\s*$\n', ''
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Fixed: $($file.FullName)"
}

Write-Host "Done! Fixed $($testFiles.Count) test files."
