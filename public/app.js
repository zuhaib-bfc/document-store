class DocumentStore {
    constructor() {
        this.currentDocument = null;
        this.documentTree = null;
        this.filteredTree = null;
        this.searchQuery = '';
        this.init();
    }

    async init() {
        this.bindEvents();
        this.initMermaid();
        await this.loadDocumentTree();
        const path = this.extractCurrentPath();
        if(path !== '' && path !== '/') {
            this.loadDocument(path);
        }
    }

    extractCurrentPath() {
    // Get the path from the current page URL and remove the leading slash
    return window.location.pathname.replace(/^\/+/, '');
    }

    initMermaid() {
        // Initialize Mermaid with configuration
        if (window.mermaid) {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'default',
                securityLevel: 'loose',
                fontFamily: 'inherit'
            });
        }
    }

    async processMermaidDiagrams(container) {
        if (!window.mermaid) {
            console.log('Mermaid not available');
            return;
        }

        // Find all code blocks with language 'mermaid'
        const mermaidBlocks = container.querySelectorAll('pre code.language-mermaid');
        console.log(`Found ${mermaidBlocks.length} mermaid blocks`);
        
        for (let i = 0; i < mermaidBlocks.length; i++) {
            const codeBlock = mermaidBlocks[i];
            const preElement = codeBlock.parentElement;
            const parentNode = preElement ? preElement.parentElement : null;
            const mermaidCode = codeBlock.textContent.trim();
            
            console.log(`Processing mermaid block ${i + 1}:`, mermaidCode.substring(0, 50) + '...');
            
            if (!parentNode) {
                console.error('No parent node found for mermaid block');
                continue;
            }
            
            try {
                // Create a unique ID for this diagram
                const diagramId = `mermaid-diagram-${Date.now()}-${i}`;
                
                // Create a div to hold the mermaid diagram
                const mermaidDiv = document.createElement('div');
                mermaidDiv.id = diagramId;
                mermaidDiv.className = 'mermaid-diagram';
                mermaidDiv.style.textAlign = 'center';
                mermaidDiv.style.margin = '20px 0';
                
                // Render the mermaid diagram first
                const { svg } = await mermaid.render(diagramId + '-svg', mermaidCode);
                mermaidDiv.innerHTML = svg;
                
                // Replace the pre/code block with the mermaid div
                parentNode.replaceChild(mermaidDiv, preElement);
                
                console.log(`Successfully rendered mermaid diagram ${i + 1}`);
                
            } catch (error) {
                console.error('Error rendering Mermaid diagram:', error);
                // If rendering fails, show the original code block with an error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'mermaid-error';
                errorDiv.style.border = '1px solid #e53e3e';
                errorDiv.style.borderRadius = '4px';
                errorDiv.style.padding = '10px';
                errorDiv.style.margin = '10px 0';
                errorDiv.style.backgroundColor = '#fed7d7';
                errorDiv.innerHTML = `
                    <strong>Mermaid Diagram Error:</strong><br>
                    <code style="background: #fff; padding: 2px 4px; border-radius: 2px;">${error.message}</code>
                    <details style="margin-top: 10px;">
                        <summary>Show diagram code</summary>
                        <pre style="background: #f7fafc; padding: 10px; border-radius: 4px; margin-top: 5px;"><code>${mermaidCode}</code></pre>
                    </details>
                `;
                
                try {
                    parentNode.replaceChild(errorDiv, preElement);
                } catch (replaceError) {
                    console.error('Error replacing element with error div:', replaceError);
                }
            }
        }
    }

    bindEvents() {
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadDocumentTree();
        });

        // Close document button
        document.getElementById('close-doc-btn').addEventListener('click', () => {
            this.closeDocument();
        });

        // Search input
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.getElementById('clear-search');

        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        clearSearch.addEventListener('click', () => {
            this.clearSearch();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.searchQuery) {
                    this.clearSearch();
                } else {
                    this.closeDocument();
                }
            }
            // Focus search with Ctrl+F or Cmd+F
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    async loadDocumentTree() {
        const treeContainer = document.getElementById('document-tree');
        treeContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading documents...</div>';

        try {
            const response = await fetch('/api/docs');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.documentTree = await response.json();
            this.renderDocumentTree();
        } catch (error) {
            console.error('Error loading document tree:', error);
            treeContainer.innerHTML = `
                <div class="loading" style="color: #e53e3e;">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Failed to load documents
                </div>
            `;
        }
    }

    renderDocumentTree() {
        this.filteredTree = this.documentTree;
        this.filterAndRenderTree();
    }

    buildTreeHTML(items, level = 0) {
        return items.map(item => {
            if (item.type === 'directory') {
                const hasChildren = item.children && item.children.length > 0;
                const childrenHTML = hasChildren ? this.buildTreeHTML(item.children, level + 1) : '';
                
                return `
                    <div class="tree-item" data-path="${item.path}">
                        <button class="tree-node directory" data-type="directory" data-path="${item.path}">
                            <i class="tree-icon fas ${hasChildren ? 'fa-chevron-right' : 'fa-folder'}"></i>
                            <i class="fas fa-folder" style="margin-right: 0.5rem; color: #f6ad55;"></i>
                            ${item.name}
                        </button>
                        ${hasChildren ? `<div class="tree-children">${childrenHTML}</div>` : ''}
                    </div>
                `;
            } else {
                return `
                    <div class="tree-item" data-path="${item.path}">
                        <button class="tree-node file" data-type="file" data-path="${item.path}">
                            <i class="tree-icon fas fa-file-alt" style="color: #667eea;"></i>
                            ${item.name.replace('.md', '')}
                        </button>
                    </div>
                `;
            }
        }).join('');
    }

    bindTreeEvents() {
        const treeNodes = document.querySelectorAll('.tree-node');
        
        treeNodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const type = node.dataset.type;
                const path = node.dataset.path;
                
                if (type === 'directory') {
                    this.toggleDirectory(node);
                } else if (type === 'file') {
                    this.loadDocument(path);
                    this.setActiveNode(node);
                }
            });
        });
    }

    toggleDirectory(node) {
        const treeItem = node.closest('.tree-item');
        const children = treeItem.querySelector('.tree-children');
        const chevron = node.querySelector('.fa-chevron-right');
        
        if (children) {
            const isExpanded = children.classList.contains('expanded');
            
            if (isExpanded) {
                children.classList.remove('expanded');
                treeItem.classList.remove('expanded');
            } else {
                children.classList.add('expanded');
                treeItem.classList.add('expanded');
            }
        }
    }

    setActiveNode(node) {
        // Remove active class from all nodes
        document.querySelectorAll('.tree-node').forEach(n => n.classList.remove('active'));
        // Add active class to clicked node
        node.classList.add('active');
    }

    async loadDocument(path) {
        const welcomeScreen = document.getElementById('welcome-screen');
        const documentViewer = document.getElementById('document-viewer');
        const documentContent = document.getElementById('document-content');
        const documentPath = document.getElementById('document-path');

        // Show document viewer and hide welcome screen
        welcomeScreen.style.display = 'none';
        documentViewer.style.display = 'flex';

        // Show loading state
        documentContent.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading document...</div>';
        documentPath.textContent = path.replaceAll("%20","-");

        try {
            const response = await fetch(`/api/docs/${path}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const document = await response.json();
            window.history.pushState({}, '', `/${document.path}`);
            this.currentDocument = document;
            
            // Render the HTML content
            documentContent.innerHTML = document.html;
            
            // Highlight code blocks
            if (window.Prism) {
                Prism.highlightAllUnder(documentContent);
            }
            
            // Process Mermaid diagrams
            await this.processMermaidDiagrams(documentContent);
            
            // Scroll to top
            documentContent.scrollTop = 0;
            
        } catch (error) {
            console.error('Error loading document:', error);
            documentContent.innerHTML = `
                <div class="loading" style="color: #e53e3e;">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Failed to load document: ${error.message}
                </div>
            `;
        }
    }

    closeDocument() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const documentViewer = document.getElementById('document-viewer');
        
        // Hide document viewer and show welcome screen
        documentViewer.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        
        // Clear active state
        document.querySelectorAll('.tree-node').forEach(n => n.classList.remove('active'));
        
        this.currentDocument = null;
    }

    handleSearch(query) {
        this.searchQuery = query.trim().toLowerCase();
        const clearButton = document.getElementById('clear-search');
        
        // Show/hide clear button
        if (this.searchQuery) {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }

        this.filterAndRenderTree();
    }

    clearSearch() {
        const searchInput = document.getElementById('search-input');
        const clearButton = document.getElementById('clear-search');
        
        searchInput.value = '';
        this.searchQuery = '';
        clearButton.style.display = 'none';
        
        this.filterAndRenderTree();
    }

    filterAndRenderTree() {
        if (!this.documentTree) return;

        if (!this.searchQuery) {
            // No search query, show all documents
            this.filteredTree = this.documentTree;
        } else {
            // Filter documents based on search query
            this.filteredTree = this.filterTree(this.documentTree, this.searchQuery);
        }

        this.renderFilteredTree();
    }

    filterTree(items, query) {
        const filtered = [];

        for (const item of items) {
            const itemName = item.name.toLowerCase().replace('.md', '');
            const matches = itemName.includes(query);

            if (item.type === 'directory') {
                // For directories, check if any children match
                const filteredChildren = item.children ? this.filterTree(item.children, query) : [];
                const hasMatchingChildren = filteredChildren.length > 0;

                if (matches || hasMatchingChildren) {
                    filtered.push({
                        ...item,
                        children: filteredChildren,
                        searchMatch: matches
                    });
                }
            } else if (matches) {
                // For files, include if name matches
                filtered.push({
                    ...item,
                    searchMatch: true
                });
            }
        }

        return filtered;
    }

    renderFilteredTree() {
        const treeContainer = document.getElementById('document-tree');
        
        if (!this.filteredTree || this.filteredTree.length === 0) {
            if (this.searchQuery) {
                treeContainer.innerHTML = `
                    <div class="no-search-results">
                        <i class="fas fa-search"></i>
                        No documents found for "${this.searchQuery}"
                    </div>
                `;
            } else {
                treeContainer.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-folder-open"></i> 
                        No documents found
                    </div>
                `;
            }
            return;
        }

        const treeHTML = this.buildFilteredTreeHTML(this.filteredTree);
        treeContainer.innerHTML = treeHTML;

        // Bind click events
        this.bindTreeEvents();

        // Auto-expand directories with matches when searching
        if (this.searchQuery) {
            this.expandMatchingDirectories();
        }
    }

    buildFilteredTreeHTML(items, level = 0) {
        return items.map(item => {
            const highlightedName = this.highlightSearchTerm(item.name.replace('.md', ''), this.searchQuery);
            const matchClass = item.searchMatch ? 'search-match' : '';

            if (item.type === 'directory') {
                const hasChildren = item.children && item.children.length > 0;
                const childrenHTML = hasChildren ? this.buildFilteredTreeHTML(item.children, level + 1) : '';
                
                return `
                    <div class="tree-item ${matchClass}" data-path="${item.path}">
                        <button class="tree-node directory" data-type="directory" data-path="${item.path}">
                            <i class="tree-icon fas ${hasChildren ? 'fa-chevron-right' : 'fa-folder'}"></i>
                            <i class="fas fa-folder" style="margin-right: 0.5rem; color: #f6ad55;"></i>
                            ${highlightedName}
                        </button>
                        ${hasChildren ? `<div class="tree-children">${childrenHTML}</div>` : ''}
                    </div>
                `;
            } else {
                return `
                    <div class="tree-item ${matchClass}" data-path="${item.path}">
                        <button class="tree-node file" data-type="file" data-path="${item.path}">
                            <i class="tree-icon fas fa-file-alt" style="color: #667eea;"></i>
                            ${highlightedName}
                        </button>
                    </div>
                `;
            }
        }).join('');
    }

    highlightSearchTerm(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    expandMatchingDirectories() {
        // Expand all directories that contain matching items when searching
        if (this.searchQuery) {
            const allDirectories = document.querySelectorAll('.tree-item');
            allDirectories.forEach(item => {
                const directoryNode = item.querySelector('.tree-node.directory');
                if (directoryNode) {
                    // Check if this directory or any of its descendants have matches
                    const hasMatchingDescendants = item.querySelector('.tree-item.search-match');
                    if (hasMatchingDescendants || item.classList.contains('search-match')) {
                        item.classList.add('expanded');
                        const children = item.querySelector('.tree-children');
                        if (children) {
                            children.classList.add('expanded');
                        }
                    }
                }
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DocumentStore();
});