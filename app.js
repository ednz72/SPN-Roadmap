// SPN Roadmap Application - Public Read-Only Version
class RoadmapApp {
    constructor(data) {
        this.data = data;
        this.container = document.getElementById('roadmap-container');
        this.viewMode = localStorage.getItem('spnRoadmapViewMode') || 'theme'; // 'theme' or 'horizon'
        this.viewDensity = localStorage.getItem('spnRoadmapDensity') || 'expanded'; // 'compact' or 'expanded'
        this.init();
    }

    init() {
        this.render();
        this.updateLastModified();
        this.updateItemCounts();
        this.setupViewToggle();
        this.setupDensityToggle();
        this.setupThemeToggle();
        this.setupFrameworkInfo();
        this.setupExportButtons();
    }

    setupViewToggle() {
        const toggleBtn = document.getElementById('view-toggle-btn');
        const viewModeText = document.getElementById('view-mode-text');

        // Set initial button text
        viewModeText.textContent = this.viewMode === 'theme' ? 'By Theme' : 'By Horizon';

        toggleBtn.addEventListener('click', () => {
            this.viewMode = this.viewMode === 'theme' ? 'horizon' : 'theme';
            viewModeText.textContent = this.viewMode === 'theme' ? 'By Theme' : 'By Horizon';
            localStorage.setItem('spnRoadmapViewMode', this.viewMode);
            this.render();
        });
    }

    setupDensityToggle() {
        const toggleBtn = document.getElementById('density-toggle-btn');
        const densityIcon = document.getElementById('density-icon');

        // Set initial icon: ⊟ for expanded (can collapse), ⊞ for compact (can expand)
        densityIcon.textContent = this.viewDensity === 'expanded' ? '⊟' : '⊞';

        toggleBtn.addEventListener('click', () => {
            this.viewDensity = this.viewDensity === 'expanded' ? 'compact' : 'expanded';
            densityIcon.textContent = this.viewDensity === 'expanded' ? '⊟' : '⊞';
            localStorage.setItem('spnRoadmapDensity', this.viewDensity);
            this.applyDensityClass();
        });

        // Apply initial density class
        this.applyDensityClass();
    }

    setupThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        const savedTheme = localStorage.getItem('spnRoadmapTheme') || 'dark';

        // Apply saved theme
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const newTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('spnRoadmapTheme', newTheme);
        });
    }

    setupFrameworkInfo() {
        const infoBtn = document.getElementById('framework-info-btn');
        const modal = document.getElementById('framework-modal');
        const closeBtn = modal.querySelector('.close');

        infoBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    setupExportButtons() {
        // JSON Export
        const exportJsonBtn = document.getElementById('export-json-btn');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => {
                this.downloadJSON();
            });
        }

        // Markdown Export
        const exportMarkdownBtn = document.getElementById('export-markdown-btn');
        if (exportMarkdownBtn) {
            exportMarkdownBtn.addEventListener('click', () => {
                this.downloadMarkdown();
            });
        }

        // PDF Export
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => {
                this.exportToPDF();
            });
        }
    }

    applyDensityClass() {
        const allItems = document.querySelectorAll('.roadmap-item');
        allItems.forEach(item => {
            if (this.viewDensity === 'compact') {
                item.classList.add('compact');
            } else {
                item.classList.remove('compact');
            }
        });
    }

    render() {
        this.container.innerHTML = '';

        if (this.viewMode === 'theme') {
            this.renderByTheme();
        } else {
            this.renderByHorizon();
        }

        this.updateItemCounts();
        this.applyDensityClass();
    }

    renderByTheme() {
        this.data.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            this.container.appendChild(categoryElement);
        });
    }

    renderByHorizon() {
        // Create single timeline grid (no category sections)
        const grid = document.createElement('div');
        grid.className = 'timeline-grid horizon-view';

        const phases = ['now', 'next', 'later'];
        phases.forEach(phase => {
            const column = this.createHorizonColumn(phase);
            grid.appendChild(column);
        });

        this.container.appendChild(grid);
    }

    createHorizonColumn(phase) {
        const column = document.createElement('div');
        column.className = `timeline-column ${phase}`;

        // Collect all items from all categories for this phase, sorted by category
        const allItems = [];
        this.data.categories.forEach(category => {
            if (category.items[phase] && category.items[phase].length > 0) {
                category.items[phase].forEach(item => {
                    allItems.push({
                        ...item,
                        categoryName: category.name,
                        categoryId: category.id,
                        categoryColor: category.color
                    });
                });
            }
        });

        // Render items
        if (allItems.length > 0) {
            allItems.forEach(item => {
                const itemElement = this.createItemElementWithTag(item);
                column.appendChild(itemElement);
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No items yet';
            column.appendChild(emptyState);
        }

        return column;
    }

    createItemElementWithTag(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'roadmap-item';

        const title = document.createElement('div');
        title.className = 'item-title';
        title.textContent = item.title;

        const descriptionWrapper = document.createElement('div');
        descriptionWrapper.className = 'item-description';

        // Add description text
        const descriptionText = document.createTextNode(item.description + ' ');
        descriptionWrapper.appendChild(descriptionText);

        // Add inline category tag at the end
        const tag = document.createElement('span');
        tag.className = `category-tag ${item.categoryColor}-tag`;
        tag.textContent = item.categoryName;
        descriptionWrapper.appendChild(tag);

        itemDiv.appendChild(title);
        itemDiv.appendChild(descriptionWrapper);

        return itemDiv;
    }

    // Count items in each phase
    countItemsByPhase() {
        const counts = { now: 0, next: 0, later: 0 };

        this.data.categories.forEach(category => {
            counts.now += category.items.now ? category.items.now.length : 0;
            counts.next += category.items.next ? category.items.next.length : 0;
            counts.later += category.items.later ? category.items.later.length : 0;
        });

        return counts;
    }

    // Update item count display in sticky headers
    updateItemCounts() {
        const counts = this.countItemsByPhase();

        const nowHeader = document.getElementById('now-header');
        const nextHeader = document.getElementById('next-header');
        const laterHeader = document.getElementById('later-header');

        if (nowHeader) nowHeader.textContent = `NOW (${counts.now})`;
        if (nextHeader) nextHeader.textContent = `NEXT (${counts.next})`;
        if (laterHeader) laterHeader.textContent = `LATER (${counts.later})`;
    }

    createCategoryElement(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.id = category.id;

        // Category Header
        const header = document.createElement('div');
        header.className = `category-header ${category.color}-header`;
        header.textContent = category.name;
        categoryDiv.appendChild(header);

        // Timeline Grid
        const grid = document.createElement('div');
        grid.className = 'timeline-grid';

        // Create NOW, NEXT, LATER columns
        const timelinePhases = ['now', 'next', 'later'];
        timelinePhases.forEach(phase => {
            const column = this.createTimelineColumn(phase, category.items[phase]);
            grid.appendChild(column);
        });

        categoryDiv.appendChild(grid);
        return categoryDiv;
    }

    createTimelineColumn(phase, items) {
        const column = document.createElement('div');
        column.className = `timeline-column ${phase}`;

        // Items (no header - using sticky header instead)
        if (items && items.length > 0) {
            items.forEach(item => {
                const itemElement = this.createItemElement(item);
                column.appendChild(itemElement);
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No items yet';
            column.appendChild(emptyState);
        }

        return column;
    }

    createItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'roadmap-item';

        const title = document.createElement('div');
        title.className = 'item-title';
        title.textContent = item.title;

        const description = document.createElement('div');
        description.className = 'item-description';
        description.textContent = item.description;

        itemDiv.appendChild(title);
        itemDiv.appendChild(description);

        return itemDiv;
    }

    updateLastModified() {
        const lastUpdatedElement = document.getElementById('last-updated');
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdatedElement.textContent = today.toLocaleDateString('en-US', options);
    }

    // Export to JSON
    downloadJSON() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SPN_Roadmap.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Export to Markdown
    exportToMarkdown() {
        let markdown = '# SPN Roadmap\n\n';

        this.data.categories.forEach(category => {
            // Category header
            markdown += `## ${category.name}\n\n`;

            // NOW section
            if (category.items.now && category.items.now.length > 0) {
                markdown += '### NOW\n\n';
                category.items.now.forEach(item => {
                    markdown += `**${item.title}**\n\n${item.description}\n\n`;
                });
            }

            // NEXT section
            if (category.items.next && category.items.next.length > 0) {
                markdown += '### NEXT\n\n';
                category.items.next.forEach(item => {
                    markdown += `**${item.title}**\n\n${item.description}\n\n`;
                });
            }

            // LATER section
            if (category.items.later && category.items.later.length > 0) {
                markdown += '### LATER\n\n';
                category.items.later.forEach(item => {
                    markdown += `**${item.title}**\n\n${item.description}\n\n`;
                });
            }

            markdown += '---\n\n';
        });

        // Add export date at the end
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        markdown += `\n*Exported: ${today.toLocaleDateString('en-US', options)}*\n`;

        return markdown;
    }

    // Download markdown file
    downloadMarkdown() {
        const markdown = this.exportToMarkdown();
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SPN_Roadmap.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Export to PDF
    exportToPDF() {
        // Hide controls and sticky headers before export
        const controls = document.querySelector('.header-controls');
        const legend = document.querySelector('.framework-legend');
        const stickyHeaders = document.querySelector('.sticky-column-headers');

        controls.style.display = 'none';
        legend.style.marginBottom = '30px';
        stickyHeaders.style.display = 'none';

        const element = document.querySelector('.container');
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'SPN_Roadmap.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'landscape',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            // Restore controls after export
            controls.style.display = '';
            legend.style.marginBottom = '';
            stickyHeaders.style.display = '';
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new RoadmapApp(roadmapData);
    window.roadmapApp = app;
});
