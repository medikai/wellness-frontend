/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#4CAF9D"/>
  
  <!-- Heart Icon -->
  <path d="M${size*0.5} ${size*0.875}C${size*0.5} ${size*0.875} ${size*0.25} ${size*0.625} ${size*0.25} ${size*0.4375}C${size*0.25} ${size*0.375} ${size*0.34375} ${size*0.34375} ${size*0.4375} ${size*0.34375}C${size*0.5625} ${size*0.34375} ${size*0.625} ${size*0.375} ${size*0.625} ${size*0.4375}C${size*0.625} ${size*0.625} ${size*0.5} ${size*0.875} ${size*0.5} ${size*0.875}Z" fill="white" stroke="white" stroke-width="${size*0.02}" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Plus Sign -->
  <circle cx="${size*0.5}" cy="${size*0.5}" r="${size*0.15}" fill="#F58220"/>
  <path d="M${size*0.425} ${size*0.5}H${size*0.575}M${size*0.5} ${size*0.425}V${size*0.575}" stroke="white" stroke-width="${size*0.03}" stroke-linecap="round"/>
</svg>`;
};

// Icon sizes needed
const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate all icon sizes
sizes.forEach(size => {
  const svgContent = createIcon(size);
  const filename = `icon-${size}x${size}.png`;
  
  // For now, save as SVG and we'll convert later
  const svgFilename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, svgFilename), svgContent);
  
  console.log(`Created ${svgFilename}`);
});

console.log('All icons created successfully!');