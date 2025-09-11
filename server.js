const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 12000;
const DOCS_DIR = path.join(__dirname, 'docs');

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Configure marked for better security and features
marked.setOptions({
  breaks: true,
  gfm: true
});

// Utility function to build file tree
async function buildFileTree(dirPath, relativePath = '') {
  const items = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        const children = await buildFileTree(fullPath, relPath);
        items.push({
          name: entry.name,
          type: 'directory',
          path: relPath,
          children: children
        });
      } else if (entry.name.endsWith('.md')) {
        items.push({
          name: entry.name,
          type: 'file',
          path: relPath
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return items.sort((a, b) => {
    // Directories first, then files, both alphabetically
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

// API Routes

// Get document tree structure
app.get('/api/docs', async (req, res) => {
  try {
    const tree = await buildFileTree(DOCS_DIR);
    res.json(tree);
  } catch (error) {
    console.error('Error building file tree:', error);
    res.status(500).json({ error: 'Failed to load document tree' });
  }
});

// Get specific document content
app.get('/api/docs/*', async (req, res) => {
  try {
    const docPath = req.params[0];
    const fullPath = path.join(DOCS_DIR, docPath);
    
    // Security check: ensure the path is within docs directory
    const resolvedPath = path.resolve(fullPath);
    const resolvedDocsDir = path.resolve(DOCS_DIR);
    
    if (!resolvedPath.startsWith(resolvedDocsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if file exists and is a markdown file
    if (!docPath.endsWith('.md')) {
      return res.status(400).json({ error: 'Only markdown files are supported' });
    }
    
    const content = await fs.readFile(fullPath, 'utf8');
    const htmlContent = marked(content);
    
    res.json({
      path: docPath,
      content: content,
      html: htmlContent,
      lastModified: (await fs.stat(fullPath)).mtime
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Document not found' });
    } else {
      console.error('Error reading document:', error);
      res.status(500).json({ error: 'Failed to read document' });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Document Store server running on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
});