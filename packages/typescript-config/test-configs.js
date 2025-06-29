import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test function to validate JSON syntax and structure
function testConfig(configName) {
  try {
    const configPath = join(__dirname, `${configName}.json`);
    const configContent = readFileSync(configPath, "utf8");
    const config = JSON.parse(configContent);

    console.log(`✅ ${configName}.json - Valid JSON syntax`);

    // Check required fields
    if (!config.$schema) {
      console.log(`⚠️  ${configName}.json - Missing $schema field`);
    }

    if (!config.display) {
      console.log(`⚠️  ${configName}.json - Missing display field`);
    }

    if (configName !== "base" && !config.extends) {
      console.log(`❌ ${configName}.json - Missing extends field`);
      return false;
    }

    if (!config.compilerOptions) {
      console.log(`❌ ${configName}.json - Missing compilerOptions`);
      return false;
    }

    console.log(`✅ ${configName}.json - All required fields present`);

    // Check for redundant options (should not have these if extending base)
    if (configName !== "base" && config.extends) {
      const redundantOptions = [
        "allowJs",
        "allowSyntheticDefaultImports",
        "esModuleInterop",
        "forceConsistentCasingInFileNames",
        "isolatedModules",
        "noFallthroughCasesInSwitch",
        "resolveJsonModule",
        "skipLibCheck",
        "strict",
      ];

      const foundRedundant = redundantOptions.filter(opt => config.compilerOptions.hasOwnProperty(opt));

      if (foundRedundant.length > 0) {
        console.log(`⚠️  ${configName}.json - Found potentially redundant options: ${foundRedundant.join(", ")}`);
      } else {
        console.log(`✅ ${configName}.json - No redundant options found`);
      }
    }

    return true;
  } catch (error) {
    console.log(`❌ ${configName}.json - Error: ${error.message}`);
    return false;
  }
}

// Test all configurations
console.log("Testing TypeScript configurations...\n");

const configs = ["base", "library", "react", "next"];
let allPassed = true;

for (const config of configs) {
  console.log(`Testing ${config} configuration:`);
  const passed = testConfig(config);
  allPassed = allPassed && passed;
  console.log("");
}

if (allPassed) {
  console.log("🎉 All configurations passed validation!");
  process.exit(0);
} else {
  console.log("❌ Some configurations failed validation.");
  process.exit(1);
}
