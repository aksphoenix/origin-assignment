# Quickstart

Clone the repository
   ```bash
   git clone 
   cd origin
   ```

Install dependencies:
   ```bash
    npm install
   ```

Configure Playwright:
   ```bash
   npx playwright install --with-deps
   ```

Configure Environment Variables
 - See below

# Running Tests

Tests are written using the Playwright Test framework. By default, test files are located in the `tests` directory and use the `.spec.ts` or `.test.ts` naming convention.

To run all tests:
```bash
npx playwright test
```

To run a specific test file and use chromium engine:
```bash
npx playwright test pricing.spec.ts --project=chromium 
```

To run tests in debug mode:
```bash
npx playwright test --headed --project=chromium --debug
```