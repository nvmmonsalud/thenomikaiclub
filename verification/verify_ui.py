from playwright.sync_api import sync_playwright, expect
import os
import re

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Load the local HTML file
        file_path = os.path.abspath("index.html")
        page.goto(f"file://{file_path}")

        # Wait for the hero section to be visible
        # Since it has reveal-on-scroll, it should be visible initially if it's in viewport
        # But we added logic to add 'in-view' class via IntersectionObserver.
        # So we wait for the class 'in-view' on the hero section.

        # Give some time for JS to run and observer to trigger
        page.wait_for_timeout(1000)

        # Verify hero has 'in-view' class
        hero = page.locator(".hero")
        # to_have_class can take a regex
        expect(hero).to_have_class(re.compile(r"in-view"))

        # Scroll down to reveal more sections
        page.mouse.wheel(0, 800)
        page.wait_for_timeout(1000) # Wait for animation

        # Verify spotlight grid has 'in-view' class
        spotlight = page.locator(".spotlight-grid")
        expect(spotlight).to_have_class(re.compile(r"in-view"))

        # Take a screenshot of the scrolled state
        page.screenshot(path="verification/ui_fluidity.png")

        browser.close()

if __name__ == "__main__":
    run()
