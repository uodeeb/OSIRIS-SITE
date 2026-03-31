---
name: "rtl-development-expert"
description: "Specialized right-to-left development expertise for Arabic, Hebrew, and Persian interfaces with comprehensive RTL implementation patterns"
---

# RTL Development Expert

This skill provides complete right-to-left development capabilities for creating culturally authentic Arabic, Hebrew, and Persian user interfaces with production-ready RTL implementation patterns.

## Core RTL Capabilities

### 🔄 **Complete RTL Implementation**
- Bidirectional text handling and rendering
- RTL CSS grid and flexbox systems
- Arabic reading flow optimization
- Mixed LTR/RTL content management
- RTL-responsive design patterns

### 🎨 **RTL Design System Architecture**
- RTL-first component libraries
- Bidirectional design tokens
- Cultural layout patterns
- Mirror-image interface elements
- RTL animation and transition systems

### ⚡ **Performance Optimization**
- RTL-specific CSS optimization
- Font loading strategies for RTL scripts
- Bidirectional content caching
- RTL JavaScript performance patterns
- Bundle size optimization for RTL features

### 🔧 **Development Tools & Debugging**
- RTL development environment setup
- Bidirectional testing frameworks
- RTL debugging tools and techniques
- Cross-browser RTL compatibility
- RTL accessibility testing

## RTL Implementation Patterns

### 1. CSS Architecture for RTL
```css
/* RTL-First CSS Architecture */
:root {
  --direction: rtl;
  --text-align: right;
  --start: right;
  --end: left;
}

[dir="ltr"] {
  --direction: ltr;
  --text-align: left;
  --start: left;
  --end: right;
}

/* Universal RTL Properties */
.rtl-container {
  direction: var(--direction);
  text-align: var(--text-align);
}

/* Logical CSS Properties */
.margin-inline-start {
  margin-inline-start: 1rem; /* Adapts to text direction */
}

.padding-inline-end {
  padding-inline-end: 2rem; /* RTL-aware spacing */
}
```

### 2. React RTL Components
```tsx
// RTL-Aware Component Architecture
interface RTLComponentProps {
  children: React.ReactNode;
  forceRTL?: boolean;
  preserveLTR?: boolean;
}

const RTLProvider: React.FC<RTLComponentProps> = ({ 
  children, 
  forceRTL = false,
  preserveLTR = false 
}) => {
  const { locale } = useLocale();
  const isRTL = forceRTL || locale === 'ar' || locale === 'he' || locale === 'fa';
  
  return (
    <div dir={isRTL && !preserveLTR ? 'rtl' : 'ltr'}>
      <RTLContext.Provider value={{ isRTL, direction: isRTL ? 'rtl' : 'ltr' }}>
        {children}
      </RTLContext.Provider>
    </div>
  );
};

// RTL-Aware Navigation
const RTLNavigation: React.FC = () => {
  const { isRTL } = useRTL();
  
  return (
    <nav className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      <Logo />
      <MenuItems className={isRTL ? 'mr-auto' : 'ml-auto'} />
      <UserProfile />
    </nav>
  );
};
```

### 3. Bidirectional Text Handling
```tsx
// Advanced Bidirectional Text Component
interface BidirectionalTextProps {
  text: string;
  lang?: string;
  preserveFormatting?: boolean;
}

const BidirectionalText: React.FC<BidirectionalTextProps> = ({ 
  text, 
  lang = 'auto',
  preserveFormatting = true 
}) => {
  const detectedDir = detectTextDirection(text, lang);
  
  return (
    <span 
      dir={detectedDir}
      lang={lang !== 'auto' ? lang : undefined}
      className="unicode-bidi"
    >
      {preserveFormatting ? preserveArabicFormatting(text) : text}
    </span>
  );
};

// Arabic Text Processing
function preserveArabicFormatting(text: string): string {
  return text
    .replace(/\u0640/g, '') // Remove tatweel for web
    .replace(/[\u0600-\u0605]/g, '') // Remove Arabic format controls
    .normalize('NFKC'); // Unicode normalization
}
```

### 4. RTL Grid and Layout Systems
```css
/* RTL Grid System */
.rtl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  direction: rtl;
}

.rtl-grid > * {
  text-align: right;
}

/* RTL Flexbox */
.rtl-flex {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.rtl-flex-center {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
}

/* RTL Positioning */
.rtl-float-start {
  float: inline-start; /* Adapts to text direction */
}

.rtl-position-start {
  inset-inline-start: 0;
}
```

### 5. RTL Animation and Transitions
```css
/* RTL-Aware Animations */
@keyframes rtl-slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes ltr-slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: var(--slide-animation, rtl-slideIn) 0.3s ease-out;
}

[dir="ltr"] .slide-in {
  --slide-animation: ltr-slideIn;
}
```

## RTL Development Tools

### 1. RTL Testing Utilities
```tsx
// RTL Testing Helper
export const testRTL = {
  setupRTL: (locale = 'ar') => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', locale);
  },
  
  teardownRTL: () => {
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');
  },
  
  expectRTL: (element: HTMLElement) => {
    expect(element.getAttribute('dir')).toBe('rtl');
    expect(getComputedStyle(element).direction).toBe('rtl');
  }
};

// Bidirectional Testing
export const testBidirectional = (component: React.ReactElement) => {
  const rtlRender = render(
    <div dir="rtl">{component}</div>
  );
  
  const ltrRender = render(
    <div dir="ltr">{component}</div>
  );
  
  return { rtlRender, ltrRender };
};
```

### 2. RTL Debugging Tools
```tsx
// RTL Debug Component
const RTLDebugger: React.FC = () => {
  const [rtlIssues, setRtlIssues] = useState<string[]>([]);
  
  useEffect(() => {
    const issues = detectRTLIssues();
    setRtlIssues(issues);
  }, []);
  
  if (rtlIssues.length === 0) return null;
  
  return (
    <div className="rtl-debug-panel">
      <h3>RTL Issues Detected:</h3>
      <ul>
        {rtlIssues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </div>
  );
};

function detectRTLIssues(): string[] {
  const issues: string[] = [];
  
  // Check for hardcoded LTR styles
  const elements = document.querySelectorAll('[style*="left"], [style*="right"]');
  elements.forEach(el => {
    if (el.getAttribute('dir') === 'rtl') {
      issues.push(`Hardcoded positioning in RTL context: ${el.tagName}`);
    }
  });
  
  return issues;
}
```

## RTL Best Practices

### 1. CSS Best Practices
```css
/* Use Logical Properties */
/* ✅ Good */
margin-inline-start: 1rem;
border-inline-end: 1px solid #ccc;

/* ❌ Bad */
margin-left: 1rem; /* Won't work in RTL */
border-right: 1px solid #ccc; /* Wrong in RTL */

/* Use Flexbox with Direction */
/* ✅ Good */
.container {
  display: flex;
  flex-direction: row-reverse; /* Adapts to RTL */
}

/* Use Grid with RTL Support */
/* ✅ Good */
.rtl-grid {
  display: grid;
  grid-auto-flow: dense; /* Handles RTL content */
}
```

### 2. JavaScript Best Practices
```tsx
// RTL-Aware Position Calculations
function calculateRTLPosition(element: HTMLElement, position: number): number {
  const isRTL = getComputedStyle(element).direction === 'rtl';
  const containerWidth = element.parentElement?.offsetWidth || 0;
  
  return isRTL ? containerWidth - position : position;
}

// RTL String Handling
function reverseStringForRTL(str: string, locale: string): string {
  if (['ar', 'he', 'fa'].includes(locale)) {
    return str.split('').reverse().join('');
  }
  return str;
}
```

### 3. HTML Structure Best Practices
```html
<!-- Always declare direction and language -->
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>عنوان الصفحة</title>
</head>
<body>
  <!-- Use semantic HTML with RTL awareness -->
  <nav role="navigation" aria-label="القائمة الرئيسية">
    <ul>
      <li><a href="#home">الرئيسية</a></li>
      <li><a href="#about">من نحن</a></li>
    </ul>
  </nav>
</body>
</html>
```

## Common RTL Pitfalls and Solutions

### 1. Icon Mirroring Issues
```tsx
// RTL Icon Component
interface RTLIconProps {
  icon: React.ReactNode;
  shouldMirror?: boolean;
}

const RTLIcon: React.FC<RTLIconProps> = ({ icon, shouldMirror = true }) => {
  const { isRTL } = useRTL();
  
  return (
    <span className={shouldMirror && isRTL ? 'rtl-mirror' : ''}>
      {icon}
    </span>
  );
};

// CSS for icon mirroring
.rtl-mirror {
  transform: scaleX(-1);
  display: inline-block;
}
```

### 2. Form Input Alignment
```tsx
// RTL Form Component
const RTLForm: React.FC = () => {
  const { isRTL } = useRTL();
  
  return (
    <form className="rtl-form" dir={isRTL ? 'rtl' : 'ltr'}>
      <label htmlFor="name">
        الاسم
        <input 
          type="text" 
          id="name" 
          name="name"
          className="rtl-input"
        />
      </label>
    </form>
  );
};
```

### 3. Table and Data Grid RTL
```tsx
// RTL Data Table
interface RTLTableProps {
  columns: string[];
  data: Record<string, any>[];
}

const RTLTable: React.FC<RTLTableProps> = ({ columns, data }) => {
  const { isRTL } = useRTL();
  
  return (
    <table className="rtl-table" dir={isRTL ? 'rtl' : 'ltr'}>
      <thead>
        <tr>
          {isRTL ? columns.reverse().map(col => <th key={col}>{col}</th>) : 
                   columns.map(col => <th key={col}>{col}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {isRTL ? 
              Object.keys(row).reverse().map(key => <td key={key}>{row[key]}</td>) :
              Object.keys(row).map(key => <td key={key}>{row[key]}</td>)
            }
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Performance Optimization

### 1. RTL CSS Optimization
```css
/* Critical RTL CSS - Load First */
.rtl-critical {
  direction: rtl;
  text-align: right;
}

/* Deferred RTL Styles */
@layer rtl-deferred {
  .rtl-advanced {
    /* Complex RTL styles */
  }
}

/* Conditional RTL Loading */
@media (min-width: 768px) {
  [dir="rtl"] .rtl-responsive {
    /* RTL-specific responsive styles */
  }
}
```

### 2. JavaScript RTL Optimization
```tsx
// Lazy RTL Components
const LazyRTLComponent = lazy(() => 
  import('./RTLComponent').then(module => ({
    default: module.RTLComponent
  }))
);

// Conditional RTL Bundle Loading
const loadRTLBundle = async (locale: string) => {
  if (['ar', 'he', 'fa'].includes(locale)) {
    const { rtlBundle } = await import('./rtl-bundle');
    return rtlBundle;
  }
  return null;
};
```

## Testing Strategy

### 1. RTL Unit Testing
```tsx
// RTL Component Testing
describe('RTLButton', () => {
  it('renders correctly in RTL context', () => {
    const { getByRole } = render(
      <div dir="rtl">
        <RTLButton>اضغط هنا</RTLButton>
      </div>
    );
    
    const button = getByRole('button');
    expect(button).toHaveStyle({ direction: 'rtl' });
  });
  
  it('handles bidirectional content', () => {
    const { getByText } = render(
      <BidirectionalText text="Hello مرحبا World" />
    );
    
    expect(getByText('Hello مرحبا World')).toHaveAttribute('dir');
  });
});
```

### 2. Cross-Browser RTL Testing
```tsx
// Browser Compatibility Testing
const rtlBrowsers = [
  { name: 'Chrome', version: 'latest' },
  { name: 'Firefox', version: 'latest' },
  { name: 'Safari', version: 'latest' },
  { name: 'Edge', version: 'latest' }
];

rtlBrowsers.forEach(browser => {
  test(`RTL rendering on ${browser.name}`, async ({ page }) => {
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Test RTL-specific functionality
    await page.click('text=اضغط هنا');
    await expect(page.locator('.rtl-result')).toBeVisible();
  });
});
```

## Integration Guidelines

### 1. Existing Project Integration
```tsx
// Gradual RTL Integration
const RTLIntegration: React.FC = () => {
  const [rtlEnabled, setRtlEnabled] = useState(false);
  
  return (
    <RTLProvider enabled={rtlEnabled}>
      <LegacyComponent />
      <RTLComponent />
    </RTLProvider>
  );
};
```

### 2. Design System Integration
```tsx
// RTL Design System Tokens
const rtlDesignTokens = {
  spacing: {
    scale: [0, 4, 8, 16, 32, 64],
    rtlMultiplier: 1.2 // Arabic needs more spacing
  },
  typography: {
    arabic: {
      fontSize: '1.125rem', // 18px minimum
      lineHeight: 1.8, // Arabic needs more line height
      letterSpacing: '0.01em' // Subtle tracking
    }
  }
};
```

---

*This skill ensures your RTL implementations are culturally authentic, performant, and accessible.*