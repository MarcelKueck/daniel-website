# Baumfällung Partsch Junior Website

A modern, responsive website for Baumfällung Partsch Junior, a premier tree specialist company in Bavaria. This website features dynamic animations, interactive elements, and a professional design that highlights the company's expertise in tree services.

## Project Structure

```
baumfallung-partsch/
├── index.html              # Main HTML file
├── before-after-demo.html  # Demo page for before/after sliders
├── README.md               # This file
├── styles/
│   ├── main.css            # Main styling
│   └── animations.css      # Animation-specific styling
├── scripts/
│   ├── main.js             # Core functionality
│   ├── animations.js       # GSAP animations and effects
│   └── image-downloader.js # Utility to download images from Unsplash
└── assets/
    └── images/             # Project images (downloaded by the script)
```

## Features

- Responsive design that works on all devices
- Dynamic Apple-style scroll animations
- Interactive before/after image comparison sliders
- Animated service cards with 3D rotation effect
- Parallax scrolling effects
- Animated process timeline
- Interactive equipment showcase
- Dynamic statistics counter
- Portfolio categorization with tabs
- Contact form with validation
- Mobile-friendly navigation

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/baumfallung-partsch.git
cd baumfallung-partsch
```

### 2. Download Required Images

The project uses a Node.js script to download relevant images from Unsplash:

```bash
# Make sure Node.js is installed
node scripts/image-downloader.js
```

This will download all required images and place them in the `assets/images` directory.

### 3. View the Website

Simply open `index.html` in your web browser:

```bash
# If you have Python installed, you can start a local server
python -m http.server

# Or use any local development server like Live Server in VS Code
```

## Technology Stack

- HTML5
- CSS3 (with advanced animations)
- JavaScript (ES6+)
- GSAP (GreenSock Animation Platform)
- ScrollTrigger for scroll-based animations
- Font Awesome for icons

## Animation Features

The website includes several Apple-inspired animation techniques:

1. **Parallax Scrolling**: Background elements move at different speeds while scrolling
2. **Scroll-triggered Animations**: Elements animate in as they enter the viewport
3. **3D Transformations**: Service cards rotate on hover with 3D perspective
4. **Staggered Reveals**: Sequential animation of related elements
5. **Progress-based Animations**: Timeline that draws as you scroll
6. **Animated Statistics**: Numbers that count up when in view
7. **Smooth Transitions**: Elements that fade, slide, and scale with smooth easing

## Customization

### Changing Colors

The color scheme is defined in CSS variables in `styles/main.css`. Modify these variables to change the entire color scheme:

```css
:root {
    --primary-dark-green: #184A2C;
    --primary-medium-green: #3A6A51;
    --primary-light-green: #8BAF9C;
    --accent-wood: #CD9C7B;
    --accent-bark: #6B4D41;
    --bavarian-blue: #0080C7;
    /* Additional variables */
}
```

### Adding Content

To add new portfolio items, services, or testimonials:

1. Update the corresponding sections in `index.html`
2. For portfolio items, add new entries to the `portfolioData` object in `scripts/main.js`
3. Download additional images as needed using the image downloader script

## Before/After Slider Demo

A separate demo page, `before-after-demo.html`, showcases the before/after slider functionality in isolation. This can be useful for testing or demonstrating this specific feature.

## Credits

- All images are sourced from [Unsplash](https://unsplash.com/)
- Animation libraries: [GSAP](https://greensock.com/gsap/) and [ScrollTrigger](https://greensock.com/scrolltrigger/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created for Baumfällung Partsch Junior © 2025