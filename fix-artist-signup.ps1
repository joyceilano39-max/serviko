$path = "C:\Users\Dell_PC\serviko\app\register\artist\page.tsx"
$content = Get-Content $path -Raw

# Add Clerk import
$content = $content -replace '"use client";', '"use client";'
$content = $content -replace 'import { useState, useRef } from "react";', 'import { useState, useRef } from "react";`nimport { useSignUp } from "@clerk/nextjs";'

# Add useSignUp hook after component declaration
$content = $content -replace 'export default function ArtistRegisterPage\(\) \{', 'export default function ArtistRegisterPage() {`n  const { signUp, setActive } = useSignUp();'

# Fix handleSubmit to create Clerk account
$oldSubmit = 'const handleSubmit = async \(\) \{[^}]+if \(!agreed\)[^}]+setLoading\(true\);[^}]+setError\(""\);[^}]+try \{'
$newSubmit = @"
const handleSubmit = async () => {
    if (!agreed) { setError("Please agree to the terms."); return; }
    if (!form.password || form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    try {
      // Step 1: Create Clerk account
      const clerkResult = await signUp?.create({
        emailAddress: form.email,
        password: form.password,
      });
      if (!clerkResult?.createdUserId) { setError("Account creation failed."); setLoading(false); return; }
      const clerkId = clerkResult.createdUserId;

      // Step 2: Set session active
      await setActive?.({ session: clerkResult.createdSessionId });
"@
$content = $content -replace $oldSubmit, $newSubmit

# Update the API call to use real clerkId
$content = $content -replace 'clerkId: null,', 'clerkId: clerkId,'

[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Fixed artist registration to use Clerk signup!"