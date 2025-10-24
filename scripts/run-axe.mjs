#!/usr/bin/env node
import { argv, exit } from "node:process";
import { URL } from "node:url";
import { JSDOM } from "jsdom";
import axe from "axe-core";

const DEFAULT_ROUTES = ["/", "/sign-in", "/sign-up", "/overview"];

function parseArgs(rawArgs) {
  const options = {
    baseUrl: "http://localhost:3000",
    routes: DEFAULT_ROUTES,
    failOnViolation: false,
  };

  for (let i = 2; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
    if (arg === "--baseUrl" && rawArgs[i + 1]) {
      options.baseUrl = rawArgs[i + 1];
      i += 1;
    } else if (arg.startsWith("--routes")) {
      const [, value] = arg.split("=");
      if (value) {
        options.routes = value.split(",").map((route) => route.trim()).filter(Boolean);
      } else if (rawArgs[i + 1]) {
        options.routes = rawArgs[i + 1]
          .split(",")
          .map((route) => route.trim())
          .filter(Boolean);
        i += 1;
      }
    } else if (arg === "--fail-on-violation") {
      options.failOnViolation = true;
    }
  }

  return options;
}

async function waitForLoad(window) {
  if (window.document.readyState === "complete") {
    return;
  }

  await new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
    window.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
  });
}

async function auditRoute(baseUrl, route) {
  const target = new URL(route, baseUrl);
  const response = await fetch(target);

  if (!response.ok) {
    throw new Error(`Request failed for ${target.href} (status ${response.status})`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    url: target.href,
    runScripts: "outside-only",
    resources: "usable",
  });

  await waitForLoad(dom.window);

  const script = dom.window.document.createElement("script");
  script.textContent = axe.source;
  dom.window.document.head.appendChild(script);

  const results = await dom.window.axe.run(dom.window.document, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa"],
    },
  });

  return {
    route,
    violations: results.violations,
    passes: results.passes,
    incomplete: results.incomplete,
  };
}

function printSummary(reports) {
  const totalViolations = reports.reduce((sum, report) => sum + report.violations.length, 0);

  console.log("\nAccessibility audit summary\n============================");
  for (const report of reports) {
    console.log(`\nRoute: ${report.route}`);
    if (report.violations.length === 0) {
      console.log("  ✅ No violations found.");
      continue;
    }

    console.log(`  ❌ ${report.violations.length} violation(s):`);
    for (const violation of report.violations) {
      console.log(`    • [${violation.id}] ${violation.help} (${violation.impact ?? "no impact reported"})`);
      for (const node of violation.nodes) {
        const selector = node.target.join(" ");
        console.log(`        → ${selector}`);
      }
    }
  }

  console.log("\nAudit complete.");
  if (totalViolations === 0) {
    console.log("No accessibility violations detected across audited routes. 🎉");
  } else {
    console.log(`Found ${totalViolations} violation group(s) across ${reports.length} route(s).`);
  }

  return totalViolations;
}

async function main() {
  const options = parseArgs(argv);

  if (!options.routes.length) {
    console.error("No routes configured. Provide routes via --routes=/,/sign-in,...");
    exit(1);
  }

  const reports = [];
  for (const route of options.routes) {
    try {
      const report = await auditRoute(options.baseUrl, route);
      reports.push(report);
    } catch (error) {
      console.error(`Failed to audit ${route}:`, error instanceof Error ? error.message : error);
      if (options.failOnViolation) {
        exit(1);
      }
    }
  }

  const totalViolations = printSummary(reports);

  if (options.failOnViolation && totalViolations > 0) {
    exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error while running axe audits:", error);
  exit(1);
});
