import { AppState } from './state.js';
import { floodFill } from './tools.js';
import { exportToPNG } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
    const state = new AppState();

    // DOM Elements
    const pixelGrid = document.getElementById('pixel_grid');
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('columns');
    const createGridBtn = document.getElementById('create_grid');
    const toolBtns = document.querySelectorAll('.tool_btn');
    const clearBtn = document.getElementById('clear_btn');
    const colorPicker = document.getElementById('color');
    const colorPaletteBtns = document.querySelectorAll('.color_item');
    const zoomBtns = document.querySelectorAll('.zoom_btn');
    const undoBtn = document.getElementById('undo_btn');
    const redoBtn = document.getElementById('redo_btn');
    const saveBtn = document.getElementById('save_btn');
    const downloadBtn = document.getElementById('download_btn');

    // Initialize Grid Creation
    function initGrid(isInitialLoad = false) {
        state.setDimensions(rowsInput.value, colsInput.value);
        rowsInput.value = state.rows;
        colsInput.value = state.cols;

        pixelGrid.innerHTML = '';
        pixelGrid.style.gridTemplateRows = `repeat(${state.rows}, 1fr)`;
        pixelGrid.style.gridTemplateColumns = `repeat(${state.cols}, 1fr)`;

        // Compute crisp sizing based on canvas area
        const cellSize = Math.max(8, Math.min(32, Math.floor(480 / Math.max(state.rows, state.cols))));
        
        pixelGrid.style.width = `${state.cols * cellSize}px`;
        pixelGrid.style.height = `${state.rows * cellSize}px`;

        for (let i = 0; i < state.rows * state.cols; i++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.dataset.index = i;
            pixelGrid.appendChild(pixel);
        }

        if (!isInitialLoad) {
            recordSnapshot();
        }
    }

    function recordSnapshot() {
        const colors = Array.from(pixelGrid.children).map(p => p.style.backgroundColor || 'rgb(255, 255, 255)');
        state.saveSnapshot(colors);
        updateHistoryUI();
    }

    function applySnapshot(colors) {
        if (!colors) return;
        const pixels = pixelGrid.children;
        colors.forEach((color, i) => {
            if (pixels[i]) pixels[i].style.backgroundColor = color;
        });
        updateHistoryUI();
    }

    function updateHistoryUI() {
        undoBtn.style.opacity = state.canUndo() ? '1' : '0.5';
        redoBtn.style.opacity = state.canRedo() ? '1' : '0.5';
    }

    function paintPixel(pixel) {
        if (!pixel || !pixel.classList.contains('pixel')) return;

        const idx = parseInt(pixel.dataset.index);

        if (state.currentTool === 'pencil') {
            pixel.style.backgroundColor = state.currentColor;
        } else if (state.currentTool === 'eraser') {
            pixel.style.backgroundColor = 'rgb(255, 255, 255)';
        } else if (state.currentTool === 'fill') {
            const startColor = pixel.style.backgroundColor || 'rgb(255, 255, 255)';
            floodFill(pixelGrid, idx, startColor, state.currentColor, state.cols, state.rows);
        }
    }

    // Mouse Painting Events
    window.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('pixel')) {
            state.isMouseDown = true;
            paintPixel(e.target);
        }
    });

    pixelGrid.addEventListener('mouseover', (e) => {
        if (state.isMouseDown && state.currentTool !== 'fill') {
            paintPixel(e.target);
        }
    });

    window.addEventListener('mouseup', () => {
        if (state.isMouseDown) {
            state.isMouseDown = false;
            recordSnapshot();
        }
    });

    // Grid Control Buttons
    createGridBtn.addEventListener('click', () => initGrid());

    clearBtn.addEventListener('click', () => {
        Array.from(pixelGrid.children).forEach(p => p.style.backgroundColor = 'rgb(255, 255, 255)');
        recordSnapshot();
    });

    // Tool Switcher
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toolBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentTool = btn.dataset.tool;
        });
    });

    // Color Selection
    colorPicker.addEventListener('input', (e) => {
        state.currentColor = e.target.value;
        colorPaletteBtns.forEach(b => b.classList.remove('active'));
    });

    colorPaletteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorPaletteBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentColor = btn.dataset.color;
            colorPicker.value = state.currentColor;
        });
    });

    // Zoom Controls
    zoomBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            zoomBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const scale = parseInt(btn.dataset.zoom) / 100;
            pixelGrid.style.transform = `scale(${scale})`;
        });
    });

    // History Actions
    undoBtn.addEventListener('click', () => {
        const prev = state.undo();
        if (prev) applySnapshot(prev);
    });

    redoBtn.addEventListener('click', () => {
        const next = state.redo();
        if (next) applySnapshot(next);
    });

    // Storage & Export
    saveBtn.addEventListener('click', () => {
        const saveData = {
            rows: state.rows,
            cols: state.cols,
            pixels: Array.from(pixelGrid.children).map(p => p.style.backgroundColor || 'rgb(255, 255, 255)')
        };
        localStorage.setItem('pixelArtMaker_save', JSON.stringify(saveData));
        
        // Temporary user feedback
        const origText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fa-solid fa-check icon"></i>Saved!';
        setTimeout(() => saveBtn.innerHTML = origText, 1500);
    });

    downloadBtn.addEventListener('click', () => {
        exportToPNG(pixelGrid, state.rows, state.cols);
    });

    // Load Saved Art or Init Grid on Start
    const savedDataRaw = localStorage.getItem('pixelArtMaker_save');
    if (savedDataRaw) {
        try {
            const savedData = JSON.parse(savedDataRaw);
            rowsInput.value = savedData.rows;
            colsInput.value = savedData.cols;
            initGrid(true);
            applySnapshot(savedData.pixels);
            recordSnapshot();
        } catch(e) {
            initGrid(true);
            recordSnapshot();
        }
    } else {
        initGrid(true);
        recordSnapshot();
    }
});