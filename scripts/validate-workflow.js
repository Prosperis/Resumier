#!/usr/bin/env node

/**
 * CI/CD Workflow Validator
 * Validates the GitHub Actions workflow file for common issues
 */

import { readFileSync, existsSync } from "fs"
import { join } from "path"

const workflowPath = join(process.cwd(), ".github", "workflows", "ci-cd.yml")

console.log("🔍 Validating CI/CD Workflow...\n")

// Check if file exists
if (!existsSync(workflowPath)) {
  console.error("❌ Workflow file not found:", workflowPath)
  process.exit(1)
}

const content = readFileSync(workflowPath, "utf8")

// Validation checks
const checks = [
  {
    name: "Has workflow name",
    test: () => content.includes("name: CI/CD Pipeline"),
    fix: "Add 'name: CI/CD Pipeline' at the top of the file",
  },
  {
    name: "Has on triggers",
    test: () => content.includes("on:"),
    fix: "Add 'on:' section with push/pull_request triggers",
  },
  {
    name: "Has main branch trigger",
    test: () => content.includes("- main"),
    fix: "Add 'main' branch to push/pull_request triggers",
  },
  {
    name: "Has jobs section",
    test: () => content.includes("jobs:"),
    fix: "Add 'jobs:' section with at least one job",
  },
  {
    name: "Has lint job",
    test: () => content.includes("lint:"),
    fix: "Add 'lint:' job for code quality checks",
  },
  {
    name: "Has test job",
    test: () => content.includes("test:"),
    fix: "Add 'test:' job for running tests",
  },
  {
    name: "Has build job",
    test: () => content.includes("build:"),
    fix: "Add 'build:' job for production builds",
  },
  {
    name: "Has deploy job",
    test: () => content.includes("deploy:"),
    fix: "Add 'deploy:' job for GitHub Pages deployment",
  },
  {
    name: "Uses Bun setup action",
    test: () => content.includes("oven-sh/setup-bun"),
    fix: "Add 'uses: oven-sh/setup-bun@v2' to relevant jobs",
  },
  {
    name: "Uses checkout action",
    test: () => content.includes("actions/checkout@v4"),
    fix: "Add 'uses: actions/checkout@v4' to all jobs",
  },
  {
    name: "Has frozen lockfile",
    test: () => content.includes("--frozen-lockfile"),
    fix: "Use 'bun install --frozen-lockfile' for faster installs",
  },
  {
    name: "Has artifact upload",
    test: () => content.includes("actions/upload-artifact"),
    fix: "Add 'uses: actions/upload-artifact@v4' to upload artifacts",
  },
  {
    name: "Has Pages deployment",
    test: () => content.includes("actions/deploy-pages"),
    fix: "Add 'uses: actions/deploy-pages@v4' to deploy job",
  },
  {
    name: "Has proper permissions",
    test: () => content.includes("permissions:"),
    fix: "Add 'permissions:' section with required permissions",
  },
  {
    name: "Has concurrency control",
    test: () => content.includes("concurrency:"),
    fix: "Add 'concurrency:' to prevent concurrent deployments",
  },
]

let passed = 0
let failed = 0

console.log("Running validation checks:\n")

for (const check of checks) {
  const result = check.test()
  if (result) {
    console.log(`✅ ${check.name}`)
    passed++
  } else {
    console.log(`❌ ${check.name}`)
    console.log(`   Fix: ${check.fix}\n`)
    failed++
  }
}

console.log("\n" + "=".repeat(60))
console.log(`Results: ${passed} passed, ${failed} failed`)
console.log("=".repeat(60) + "\n")

if (failed === 0) {
  console.log("🎉 Workflow validation passed!")
  console.log("\n✅ Ready to commit and push to GitHub")
  console.log("✅ Pipeline will run automatically on push")
  process.exit(0)
} else {
  console.log("⚠️  Workflow has issues that need fixing")
  console.log("\n📝 Fix the issues above and run this script again")
  process.exit(1)
}
