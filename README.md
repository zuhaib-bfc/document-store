# Document Store

A modern, web-based document management system for organizing and viewing markdown documentation with an intuitive folder structure interface.

## Features

- 📁 **Hierarchical Document Organization**: Organize documents in nested folders
- 🌳 **Expandable Tree View**: Navigate through documents with an intuitive tree interface
- 📝 **Markdown Rendering**: Full markdown support with syntax highlighting
- 🎨 **Modern UI**: Clean, responsive design with professional styling
- 🔍 **Easy Navigation**: Quick access to all documents with visual feedback
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   Open your browser and navigate to `http://localhost:12000`

## Project Structure

```
document-store/
├── docs/                    # Document storage directory
│   ├── api/                # API documentation
│   ├── guides/             # User guides and tutorials
│   ├── projects/           # Project-specific documentation
│   ├── tutorials/          # Learning materials
│   └── README.md           # Main documentation index
├── public/                 # Frontend assets
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Application styles
│   └── app.js              # Frontend JavaScript
├── server.js               # Express.js server
└── package.json            # Node.js dependencies
```

## Adding Documents

1. Navigate to the `docs/` directory
2. Create new markdown files (`.md` extension)
3. Organize files in folders as needed
4. The changes will be automatically reflected in the web interface

### Example Document Structure

```
docs/
├── projects/
│   ├── project-alpha.md
│   └── project-beta.md
├── guides/
│   ├── deployment-guide.md
│   └── user-manual.md
└── api/
    ├── authentication.md
    └── endpoints.md
```

## API Endpoints

- `GET /api/docs` - Retrieve the complete document tree structure
- `GET /api/docs/*` - Get specific document content and rendered HTML
- `GET /health` - Health check endpoint

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Markdown Processing**: Marked.js
- **Syntax Highlighting**: Prism.js
- **Icons**: Font Awesome

## Configuration

The server can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 12000 |
| `NODE_ENV` | Environment | development |

## Development

For development with auto-restart:

```bash
npm install -g nodemon
npm run dev
```

## Security Features

- Path traversal protection
- File type validation (only `.md` files)
- CORS configuration
- Input sanitization

## Browser Support

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Add your markdown documents to the `docs/` directory
2. Follow markdown best practices for formatting
3. Use descriptive filenames and folder structures
4. Test your documents in the web interface

## License

MIT License - feel free to use this project for your documentation needs!