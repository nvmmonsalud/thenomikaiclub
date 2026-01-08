import os
from playwright.sync_api import sync_playwright

def verify_signin():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the signin page
        # Note: We are using file:// protocol. We need absolute path.
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/pages/signin.html")

        # Wait for content to load
        page.wait_for_selector(".auth-card")

        # Fill in the form
        page.fill("#email", "test@example.com")
        page.fill("#password", "password123")

        # Take a screenshot of the filled form
        page.screenshot(path="verification/signin_form.png")
        print("Screenshot of signin form taken: verification/signin_form.png")

        # Click Sign In button
        page.click("button[type='submit']")

        # Since our mock redirects to ../index.html, we should wait for navigation or check URL
        # But file:// navigation might be tricky with relative paths if not served via http.
        # Let's see if it redirects or if we stay on page (mock might fail on file protocol if relative paths are wrong)
        # Actually, in auth.js: window.location.href = '../index.html';

        page.wait_for_timeout(2000) # Wait for redirect/animation

        # Take another screenshot
        page.screenshot(path="verification/after_signin.png")
        print("Screenshot after signin taken: verification/after_signin.png")

        browser.close()

if __name__ == "__main__":
    verify_signin()
