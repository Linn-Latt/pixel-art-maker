export class AppState {
    constructor() {
        this.rows = 16;
        this.cols = 16;
        this.currentTool = 'pencil';
        this.currentColor = '#000000';
        this.isMouseDown = false;
        this.zoomLevel = 100;
        
        // History Management for Undo / Redo
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 30;
    }

    setDimensions(rows, cols) {
        this.rows = Math.min(Math.max(parseInt(rows) || 16, 1), 64);
        this.cols = Math.min(Math.max(parseInt(cols) || 16, 1), 64);
    }

    saveSnapshot(pixelColors) {
        // Truncate redo stack when a new operation occurs
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push([...pixelColors]);
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }

    canUndo() {
        return this.historyIndex > 0;
    }

    canRedo() {
        return this.historyIndex < this.history.length - 1;
    }

    undo() {
        if (this.canUndo()) {
            this.historyIndex--;
            return this.history[this.historyIndex];
        }
        return null;
    }

    redo() {
        if (this.canRedo()) {
            this.historyIndex++;
            return this.history[this.historyIndex];
        }
        return null;
    }
}