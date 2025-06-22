# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a static personal portfolio website for Dharam Dhurandhar, hosted on GitHub Pages. The site showcases professional work, includes an about page, blog section, portfolio gallery, and contact functionality.

## Architecture
- **Static HTML Site**: Multi-page website with shared components and styling
- **SCSS Compilation**: Modular SCSS files compile to main CSS
- **Bootstrap Framework**: Uses Bootstrap 4 for responsive grid and components
- **jQuery-based Interactions**: Custom JavaScript and jQuery plugins for UI features
- **PHP Contact Form**: Server-side contact form processing via `contact_process.php`

## Key Files
- `index.html` - Homepage with hero section, about preview, and portfolio highlights
- `about.html`, `portfolio.html`, `blog.html`, `contact.html` - Main content pages
- `scss/style.scss` - Main SCSS entry point importing all partial files
- `scss/_*.scss` - Modular SCSS partials for different components
- `css/style.css` - Compiled CSS output from SCSS
- `contact_process.php` - Contact form handler (sends emails to ddh4r4m@gmail.com)

## Development Commands
Since this is a static site, there are no build commands defined. For SCSS compilation, you would typically use:
```bash
sass scss/style.scss css/style.css --watch
```

## File Structure
- `/scss/` - SCSS source files organized by component (_header, _footer, _portfolio, etc.)
- `/css/` - Compiled CSS and third-party stylesheets
- `/js/` - Custom JavaScript and jQuery plugins
- `/img/` - Images organized by section (about, portfolio, blog, etc.)
- `/fonts/` - Web fonts (FontAwesome, custom icons)
- `218 portfolio doc/` - Separate portfolio documentation/demo

## Contact Form
The PHP contact form (`contact_process.php`) processes form submissions and sends emails. When modifying contact functionality, ensure the form fields match the PHP processing variables.