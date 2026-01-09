import { Page, TestInfo, expect } from "@playwright/test";
import fs from 'fs';

export class PageHelper {

  async captureScreenClip(page: any, description: string, testInfo: any) {
    try {
      // Wait for page to be in a stable state before capturing screenshot
      await page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
      const screen = await page.screenshot({ path: `${description}.png` });
      testInfo.attach(description, { contentType: 'image/png', body: screen });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`Screenshot capture failed for "${description}": ${errorMessage}`);
    }
  }

  async downloadPDFFromPage(page: any) {
    const pdfUrl = page.url();
    console.log('PDF URL:', pdfUrl);
    // Download via API
    const response = await page.context().request.get(pdfUrl);
    console.log('Response status:', response.status());
    if (!response.ok()) {
      throw new Error(`Failed to download PDF: ${response.status()} ${response.statusText()}`);
    }
    const pdf = await response.body();
    const filePath = './downloads/plan.pdf';
    // Create downloads directory if it doesn't exist
    await fs.promises.writeFile(filePath, pdf);
    console.log('PDF saved to:', filePath);
    await page.close();
    return filePath;
  }

  async verifyPDFContent(filePath: string, searchText: string) {
    const pdfParsey = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParsey(dataBuffer);
    console.log(data.numpages);
    expect(data.text).toContain(searchText);
    expect(data.numpages).toEqual(1);
  }
}