# Tool Development Guide

This guide is for developers and AI coding assistants creating new tools for WebsiteKit.

## Tool Structure Overview

Every tool must follow this exact structure:

```
tools/
└── [tool-id]/                    # Tool folder (kebab-case)
    ├── index.ts          ✅       # Mandatory: Tool registration
    ├── component.tsx     ✅       # Mandatory: Main component
    ├── types.ts          ✅       # Mandatory: Type definitions
    └── lib/                       # Optional: All other files go here
        ├── generator.ts           # Content generation logic
        ├── preview-generator.ts   # Preview HTML generation
        ├── form-sections.tsx      # Form UI components
        └── content.ts             # SEO content
```

## Step-by-Step: Creating a New Tool

### Step 1: Create Tool Folder Structure

```bash
mkdir -p tools/my-tool/lib
```

### Step 2: Create Mandatory Files

#### 2.1 Create `types.ts`

```typescript
// tools/my-tool/types.ts

export interface MyToolState {
  // Define your tool's state properties
  field1: string;
  field2: number;
  // ... more fields
}

export const DEFAULT_STATE: MyToolState = {
  field1: "",
  field2: 0,
  // ... default values
};
```

#### 2.2 Create `component.tsx`

```typescript
// tools/my-tool/component.tsx
"use client";

import { useEffect, useMemo } from "react";
import type { ToolProps } from "@/lib/utils/tool-registry";
import { DEFAULT_STATE, type MyToolState } from "./types";
// Import from lib/ for optional files:
// import { generateOutput } from "./lib/generator";
// import { MyForm } from "./lib/form";

export function MyToolComponent({
  assets,
  state,
  setState,
  onGenerate,
  setHeaderGenerate,
}: ToolProps) {
  const currentState = useMemo(
    () => ({ ...DEFAULT_STATE, ...(state as Partial<MyToolState>) }),
    [state]
  );

  // Initialize from assets if needed
  useEffect(() => {
    const updates: Partial<MyToolState> = {};
    // Set defaults from assets
    if (!currentState.field1 && assets.name) {
      updates.field1 = assets.name;
    }
    if (Object.keys(updates).length > 0) {
      setState(updates);
    }
  }, [assets, currentState, setState]);

  // Generate output when state changes (optional - can be manual)
  useEffect(() => {
    const output = generateOutput(currentState);
    onGenerate(output);
  }, [currentState, onGenerate]);

  // Register header generate button (optional)
  useEffect(() => {
    if (!setHeaderGenerate) return;
    setHeaderGenerate({
      onGenerate: () => {
        const output = generateOutput(currentState);
        onGenerate(output);
      },
      label: "Generate",
    });
    return () => setHeaderGenerate(null);
  }, [currentState, onGenerate, setHeaderGenerate]);

  return (
    <div className="space-y-4">
      {/* Your form UI here */}
    </div>
  );
}
```

#### 2.3 Create `index.ts`

```typescript
// tools/my-tool/index.ts
import { registerTool } from "@/lib/utils/tool-registry";

import { MyToolComponent } from "./component";

registerTool({
  id: "my-tool",
  name: "My Tool",
  description: "Brief description of what this tool does",
  category: "Category Name", // Must match sidebar config
  keywords: [
    "keyword1",
    "keyword2",
    // ... more keywords for search
  ],
  acceptedContext: ["name", "domain"], // Which website assets this tool uses
  outputs: ["html"], // Output types: "html", "files", "json", "text", "image"
  Component: MyToolComponent,
});
```

### Step 3: Register Tool

Add import to `tools/index.ts`:

```typescript
// tools/index.ts
import "./my-tool";
```

### Step 4: Add to Sidebar (if needed)

Update `config/sidebar.ts` to include your tool in the appropriate category.

## Optional Files (in `lib/` folder)

### Generator Functions

```typescript
// tools/my-tool/lib/generator.ts
import type { ToolOutput } from "@/lib/utils/tool-registry";

import type { MyToolState } from "../types";

export function generateOutput(state: MyToolState): ToolOutput {
  // Generate your output
  const content = generateContent(state);

  return {
    type: "html", // or "files", "json", etc.
    content: content,
    preview: generatePreview(state), // Optional: HTML string for preview
    filename: "output.html", // Optional: For downloads
  };
}

function generateContent(state: MyToolState): string {
  // Your generation logic
  return "<html>...</html>";
}

function generatePreview(state: MyToolState): string {
  // Optional: Generate preview HTML
  return "<div>Preview</div>";
}
```

### Form Components

```typescript
// tools/my-tool/lib/form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MyToolState } from "../types";

interface MyFormProps {
  state: MyToolState;
  onFieldChange: (field: keyof MyToolState, value: string | number) => void;
}

export function MyForm({ state, onFieldChange }: MyFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="field1">Field 1</Label>
        <Input
          id="field1"
          value={state.field1}
          onChange={(e) => onFieldChange("field1", e.target.value)}
        />
      </div>
      {/* More fields... */}
    </div>
  );
}
```

### Preview Generator

```typescript
// tools/my-tool/lib/preview-generator.ts
import type { MyToolState } from "../types";

export function generatePreviewHTML(
  state: MyToolState,
  primaryColor?: string
): string {
  // Generate HTML string showing preview
  // This will be rendered by the shared PreviewTab component
  return `
    <div class="preview-container">
      <!-- Your preview HTML -->
    </div>
  `.trim();
}
```

## Tool Output Pattern

Tools generate output by calling `onGenerate()` with a `ToolOutput` object:

```typescript
onGenerate({
  type: "html", // Required: Output type
  content: "<html>...</html>", // Required for html/json/text
  files: [...], // Required for files/image types
  preview: "<div>Preview</div>", // Optional: HTML string for preview tab
  filename: "output.html", // Optional: For downloads
  mimeType: "text/html", // Optional: For file downloads
});
```

The shared `OutputRenderer` automatically:

- Shows **Preview tab** if `preview` is provided
- Shows **Code tab** with `content` or `files`
- Shows **Files tab** if `files` array is provided
- Handles **copy** and **download** actions

## Import Patterns

### In Component (`component.tsx`)

```typescript
// Import types from same directory
import { MyForm } from "./lib/form";
// Import from lib/ subfolder
import { generateOutput } from "./lib/generator";
import { DEFAULT_STATE, type MyToolState } from "./types";
```

### In Lib Files

```typescript
// Import types from parent directory

// Import shared types from root
import type { ToolContent } from "../../content-types";
import type { MyToolState } from "../types";
```

## State Management

- Tool state is managed by the host via `state` and `setState` props
- Initialize from website assets in `useEffect`
- State persists automatically (handled by host)
- Use `DEFAULT_STATE` to merge with current state

## Website Assets Access

Tools receive website assets as read-only:

```typescript
interface ToolProps {
  assets: Readonly<WebsiteAssets>; // Read-only access
  // assets.name, assets.domain, assets.description, etc.
}
```

Tools can read assets but **cannot modify them**. Users edit assets via the Asset Modal.

## Header Actions

Tools can register actions in the header:

```typescript
// Register generate button
setHeaderGenerate({
  onGenerate: () => {
    // Generate output
  },
  disabled: false, // Optional
  label: "Generate", // Optional
});

// Register custom action
setHeaderAction(
  <Button onClick={handleAction}>Action</Button>
);

// Clean up on unmount
useEffect(() => {
  return () => {
    setHeaderGenerate(null);
    setHeaderAction(null);
  };
}, []);
```

## Real-time Preview

For tools that generate previews as users type:

```typescript
useEffect(() => {
  const output = generateOutput(currentState);
  if (hasContent(output)) {
    onGenerate(output);
  }
}, [currentState, onGenerate]);
```

## Testing Checklist

- [ ] Tool appears in sidebar
- [ ] Tool page loads without errors
- [ ] Form inputs work correctly
- [ ] State initializes from website assets
- [ ] Output generates correctly
- [ ] Preview tab displays (if implemented)
- [ ] Code tab shows content
- [ ] Copy button works
- [ ] Download button works
- [ ] Header generate button works (if implemented)

## Common Patterns

### Pattern 1: Simple HTML Generator

```typescript
// Component generates output directly
useEffect(() => {
  const html = generateHTML(currentState);
  onGenerate({
    type: "html",
    content: html,
    preview: generatePreview(currentState),
  });
}, [currentState]);
```

### Pattern 2: File Generator

```typescript
// Generate files
const file = new Blob([content], { type: "text/plain" });
onGenerate({
  type: "files",
  files: [
    {
      filename: "output.txt",
      content: file,
      mimeType: "text/plain",
    },
  ],
  preview: previewHTML,
});
```

### Pattern 3: Manual Generation

```typescript
// User clicks button to generate
const handleGenerate = () => {
  const output = generateOutput(currentState);
  onGenerate(output);
};

// Register in header
useEffect(() => {
  setHeaderGenerate({
    onGenerate: handleGenerate,
    label: "Generate",
  });
}, [currentState]);
```

## File Naming Conventions

- Use kebab-case for tool IDs: `my-tool`, `meta-tags`
- Use PascalCase for components: `MyToolComponent`
- Use camelCase for functions: `generateOutput`
- Use kebab-case for files: `preview-generator.ts`

## Best Practices

1. **Keep components focused** - Split complex forms into separate components in `lib/`
2. **Extract generators** - Move generation logic to `lib/generator.ts`
3. **Type everything** - Use TypeScript types from `types.ts`
4. **Initialize from assets** - Pre-fill form fields from website assets when possible
5. **Provide previews** - Generate preview HTML for better UX
6. **Handle edge cases** - Validate inputs and handle empty states
7. **Clean up effects** - Remove header actions on unmount

## Troubleshooting

### Tool not appearing in sidebar

- Check `config/sidebar.ts` includes your tool
- Verify tool ID matches route

### Import errors

- Check import paths (use `./` for same dir, `../` for parent, `./lib/` for lib files)
- Verify file extensions (.ts, .tsx)

### State not updating

- Ensure you're merging with existing state: `setState({ ...currentState, ...updates })`
- Check useEffect dependencies

### Output not showing

- Verify `onGenerate()` is being called
- Check `ToolOutput` structure matches expected format
- Ensure output has `content` or `files`

## Example: Complete Tool

See `tools/meta-tags/` or `tools/qr-code/` for complete working examples.
