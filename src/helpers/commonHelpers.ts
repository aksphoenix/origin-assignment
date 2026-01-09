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

  async downloadPDFFromPage(result: any) {
    const filePath = './downloads/plan.pdf';
    
    // Handle download object (headless mode)
    if (result.type === 'download') {
      console.log('Processing download object (headless mode)');
      await result.data.saveAs(filePath);
      console.log('PDF saved to:', filePath);
      return filePath;
    }
    
    // Handle page object (headed mode)
    if (result.type === 'page') {
      const page = result.data;
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      
      const pdfUrl = page.url();
      console.log('PDF URL:', pdfUrl);
      
      // Validate URL before making request
      if (!pdfUrl || pdfUrl === 'about:blank' || pdfUrl.startsWith('blob:') || pdfUrl.startsWith('data:')) {
        throw new Error(`Invalid or unsupported URL for API request: ${pdfUrl}`);
      }
      
      // Download via API
      const response = await page.context().request.get(pdfUrl);
      console.log('Response status:', response.status());
      if (!response.ok()) {
        throw new Error(`Failed to download PDF: ${response.status()} ${response.statusText()}`);
      }
      const pdf = await response.body();
      // Create downloads directory if it doesn't exist
      await fs.promises.writeFile(filePath, pdf);
      console.log('PDF saved to:', filePath);
      await page.close();
      return filePath;
    }
    
    throw new Error('Invalid result type');
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