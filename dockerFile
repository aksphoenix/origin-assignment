# Use a Node.js base image with Playwright
FROM mcr.microsoft.com/playwright:v1.37.0-focal
# Set working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./
# Install the project dependencies
RUN npm install
# Copy the entire project
COPY . .do
# Install Playwright browsers (chromium, firefox, webkit)
RUN npx playwright install
# Default command to run tests
CMD ["npx", "playwright", "test"]