class HighlightManager {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    init() {
        document.addEventListener('mouseup', (event) => {
            const selectedText = this.getSelectedText();
            if (event.shiftKey && selectedText) {
                this.displaySaveTooltip(selectedText, event);
            }
        });
    }

    getSelectedText() {
        let selectedText = '';
        if (window.getSelection) {
            selectedText = window.getSelection().toString();
        } else if (document.selection && document.selection.type != 'Control') {
            selectedText = document.selection.createRange().text;
        }
        return selectedText.trim();
    }

    saveContent(url, highlight, note) {
        const ms = Date.now();
        chrome.storage.local.get({ highlightdata: {} }, (result) => {
            const storage = result.highlightdata;

            if (storage[url]) {
                storage[url].push({ note, highlight, time: ms });
            } else {
                storage[url] = [{ note, highlight, time: ms }];
            }

            chrome.storage.local.set({ highlightdata: storage }, () => {
                this.removeTooltip();
            });
        });
    }

    displaySaveTooltip(selectedText, event) {
        this.removeTooltip(); // Ensure there's only one tooltip at a time

        this.tooltip = document.createElement('div');
        this.tooltip.id = 'tooltip-iroh-wiki-ext';
        this.tooltip.className = 'tooltip-iroh-wiki-ext-class';
        this.tooltip.style.position = 'absolute';
        this.tooltip.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        this.tooltip.style.padding = '5px';
        this.tooltip.style.border = '1px solid #ccc';
        this.tooltip.style.borderRadius = '5px';
        this.tooltip.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
        this.tooltip.style.top = `${event.pageY}px`;
        this.tooltip.style.left = `${event.pageX}px`;

        const textarea = document.createElement('textarea');
        textarea.textContent = 'Enter to save, Esc to close tooltip';
        textarea.className = 'tooltip-iroh-wiki-ext-textarea';
        this.tooltip.appendChild(textarea);

        document.body.appendChild(this.tooltip);

        const keydownHandler = (e) => {
            if (e.code === 'Enter') {
                const url = window.location.href;
                const highlight = selectedText;
                const note = textarea.value;
                this.saveContent(url, highlight, note);
                document.removeEventListener('keydown', keydownHandler);
            } else if (e.code === 'Escape') {
                this.removeTooltip();
                document.removeEventListener('keydown', keydownHandler);
            }
        };

        document.addEventListener('keydown', keydownHandler);
    }

    removeTooltip() {
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
            this.tooltip = null;
        }
    }
}

new HighlightManager();
