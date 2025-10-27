/**
 * Security Headers Test Script
 * Tests that all required security headers are present
 */

const testUrl = "http://localhost:4174/Resumier/"

async function testSecurityHeaders() {
  console.log("🔒 Testing Security Headers...\n")
  
  try {
    const response = await fetch(testUrl)
    const headers = response.headers

    // Required headers
    const requiredHeaders = [
      { name: "Content-Security-Policy", key: "content-security-policy" },
      { name: "X-Frame-Options", key: "x-frame-options" },
      { name: "X-Content-Type-Options", key: "x-content-type-options" },
      { name: "Referrer-Policy", key: "referrer-policy" },
      { name: "Permissions-Policy", key: "permissions-policy" },
      { name: "X-XSS-Protection", key: "x-xss-protection" },
    ]

    let passed = 0
    let failed = 0

    console.log("Required Security Headers:")
    console.log("=".repeat(80))

    for (const header of requiredHeaders) {
      const value = headers.get(header.key)
      if (value) {
        console.log(`✅ ${header.name}`)
        console.log(`   ${value}\n`)
        passed++
      } else {
        console.log(`❌ ${header.name} - MISSING\n`)
        failed++
      }
    }

    console.log("=".repeat(80))
    console.log(`\nResults: ${passed} passed, ${failed} failed\n`)

    if (failed === 0) {
      console.log("🎉 All required security headers are present!")
      console.log("\n📊 Next steps:")
      console.log("   1. Deploy to production")
      console.log("   2. Test at https://securityheaders.com")
      console.log("   3. Target: A+ rating")
    } else {
      console.log("⚠️  Some security headers are missing!")
      console.log("   Check vite.config.ts preview.headers configuration")
    }

    process.exit(failed === 0 ? 0 : 1)
  } catch (error) {
    console.error("❌ Error testing headers:", error.message)
    console.log("\n⚠️  Make sure the preview server is running:")
    console.log("   bunx vite preview")
    process.exit(1)
  }
}

testSecurityHeaders()
