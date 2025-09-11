# Mermaid Diagram Examples

This document showcases various types of Mermaid diagrams supported by the Document Store.

## Flowchart

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix Issues]
    E --> B
    C --> F[End]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Request document
    Frontend->>Backend: API call
    Backend->>Database: Query data
    Database-->>Backend: Return data
    Backend-->>Frontend: JSON response
    Frontend-->>User: Render document
```

## Class Diagram

```mermaid
classDiagram
    class DocumentStore {
        +String currentDocument
        +Object documentTree
        +String searchQuery
        +init()
        +loadDocument(path)
        +processMermaidDiagrams()
    }
    
    class FileSystem {
        +readFile(path)
        +buildTree(dir)
    }
    
    DocumentStore --> FileSystem : uses
```

## Gantt Chart

```mermaid
gantt
    title Document Store Development
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements    :done, req, 2024-01-01, 2024-01-05
    Design         :done, design, after req, 3d
    section Development
    Backend        :done, backend, 2024-01-08, 10d
    Frontend       :done, frontend, after backend, 8d
    Mermaid Support :active, mermaid, 2024-01-20, 2d
    section Testing
    Unit Tests     :testing, after mermaid, 3d
    Integration    :integration, after testing, 2d
```

## Git Graph

```mermaid
gitgraph
    commit id: "Initial commit"
    branch feature/mermaid
    checkout feature/mermaid
    commit id: "Add Mermaid.js"
    commit id: "Process diagrams"
    checkout main
    commit id: "Bug fixes"
    merge feature/mermaid
    commit id: "Release v1.1"
```

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ DOCUMENT : creates
    USER {
        string id
        string name
        string email
    }
    DOCUMENT ||--o{ VERSION : has
    DOCUMENT {
        string id
        string title
        string path
        datetime created
    }
    VERSION {
        string id
        string content
        datetime timestamp
        string author
    }
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> DocumentList : success
    Loading --> Error : failure
    DocumentList --> DocumentView : select document
    DocumentView --> DocumentList : close document
    DocumentView --> Search : search
    Search --> DocumentView : select result
    Error --> Loading : retry
```

## Pie Chart

```mermaid
pie title Document Types
    "Markdown" : 85
    "Images" : 10
    "Other" : 5
```

## User Journey

```mermaid
journey
    title User Document Discovery Journey
    section Browsing
      Navigate to site: 5: User
      View document tree: 4: User
      Expand folders: 3: User
    section Searching
      Enter search term: 4: User
      Review results: 5: User
      Click document: 5: User
    section Reading
      Read content: 5: User
      View diagrams: 5: User
      Navigate sections: 4: User
```

These examples demonstrate the power of Mermaid diagrams for creating visual documentation that enhances understanding and communication.