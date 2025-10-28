from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    time.sleep(15)
    try:
        page.goto("http://localhost:5173")
    except Exception as e:
        print(f"Error connecting to server: {e}")
        print("Retrying in 5 seconds...")
        time.sleep(5)
        page.goto("http://localhost:5173")
    page.screenshot(path="jules-scratch/verification/screenshot.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
