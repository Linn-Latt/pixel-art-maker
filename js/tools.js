export function floodFill(gridContainer, startIdx, targetColor, replacementColor, cols, rows) {
    if (targetColor === replacementColor) return;

    const pixels = Array.from(gridContainer.children);
    const queue = [startIdx];
    const visited = new Set();
    visited.add(startIdx);

    while (queue.length > 0) {
        const currIdx = queue.shift();
        const currPixel = pixels[currIdx];
        
        if (!currPixel) continue;

        // Color pixel
        currPixel.style.backgroundColor = replacementColor;

        const r = Math.floor(currIdx / cols);
        const c = currIdx % cols;

        // Check 4 adjacent orthogonal directions (Up, Down, Left, Right)
        const neighbors = [
            { r: r - 1, c: c }, // Up
            { r: r + 1, c: c }, // Down
            { r: r, c: c - 1 }, // Left
            { r: r, c: c + 1 }  // Right
        ];

        for (const n of neighbors) {
            if (n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols) {
                const nIdx = n.r * cols + n.c;
                if (!visited.has(nIdx)) {
                    visited.add(nIdx);
                    const neighborColor = pixels[nIdx].style.backgroundColor || 'rgb(255, 255, 255)';
                    
                    if (colorsMatch(neighborColor, targetColor)) {
                        queue.push(nIdx);
                    }
                }
            }
        }
    }
}

function colorsMatch(c1, c2) {
    // Helper to normalize hex and rgb format comparisons
    const temp1 = document.createElement('div');
    temp1.style.color = c1;
    const temp2 = document.createElement('div');
    temp2.style.color = c2;
    return temp1.style.color === temp2.style.color;
}