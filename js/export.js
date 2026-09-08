function exportToPNG(gridContainer, rows, cols) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Higher scale factor for crisp pixel rendering
    const scale = 32; 
    canvas.width = cols * scale;
    canvas.height = rows * scale;

    // Turn off anti-aliasing to preserve clean pixel edges
    ctx.imageSmoothingEnabled = false;

    const pixels = Array.from(gridContainer.children);
    pixels.forEach((pixel, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const color = pixel.style.backgroundColor;

        if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
            ctx.fillStyle = color;
            ctx.fillRect(c * scale, r * scale, scale, scale);
        } else {
            // Default background fill for transparent tiles
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(c * scale, r * scale, scale, scale);
        }
    });

    // Trigger browser PNG download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pixel-art-${cols}x${rows}.png`;
    link.href = dataUrl;
    link.click();
}