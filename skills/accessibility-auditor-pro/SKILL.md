---
name: "accessibility-auditor-pro"
description: "Comprehensive accessibility auditing and remediation expertise with WCAG 2.1 compliance, automated testing, and inclusive design patterns"
---

# Accessibility Auditor Pro

This skill provides expert-level accessibility auditing, automated testing, and remediation guidance to ensure WCAG 2.1 AA+ compliance and inclusive user experiences.

## Core Auditing Capabilities

### 🔍 **Automated Accessibility Scanning**
- Comprehensive WCAG 2.1 compliance testing
- Color contrast analysis and remediation
- Keyboard navigation validation
- Screen reader compatibility testing
- ARIA implementation verification
- Semantic HTML structure analysis

### ♿ **Manual Accessibility Testing**
- Screen reader user experience testing
- Keyboard-only navigation assessment
- Cognitive accessibility evaluation
- Motor impairment simulation testing
- Visual impairment testing protocols
- Hearing impairment accommodation review

### 📊 **Compliance Reporting & Metrics**
- WCAG 2.1 violation categorization
- Severity ranking and prioritization
- Automated remediation suggestions
- Progress tracking and benchmarking
- Legal compliance documentation
- Executive summary reporting

### 🛠️ **Remediation Implementation**
- Automated code fixes for common issues
- Accessibility-focused component libraries
- Inclusive design pattern integration
- Performance-optimized accessibility features
- Cross-browser compatibility solutions
- Mobile accessibility enhancements

## Automated Testing Framework

### 1. Comprehensive Accessibility Scanner
```tsx
// Accessibility Scanner Component
interface AccessibilityScannerProps {
  component: React.ReactElement;
  wcagLevel?: 'A' | 'AA' | 'AAA';
  autoFix?: boolean;
}

const AccessibilityScanner: React.FC<AccessibilityScannerProps> = ({ 
  component, 
  wcagLevel = 'AA',
  autoFix = false 
}) => {
  const [violations, setViolations] = useState<AccessibilityViolation[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const scanForViolations = async () => {
    setIsScanning(true);
    
    const scanResults = await performAccessibilityScan(component, {
      wcagLevel,
      includeExperimental: true,
      checkColorContrast: true,
      validateARIA: true,
      testKeyboardNavigation: true,
      verifyScreenReader: true
    });
    
    if (autoFix) {
      const fixedComponent = await autoFixViolations(component, scanResults);
      return fixedComponent;
    }
    
    setViolations(scanResults.violations);
    setIsScanning(false);
  };
  
  return (
    <div className="accessibility-scanner">
      <button onClick={scanForViolations} disabled={isScanning}>
        {isScanning ? 'Scanning...' : 'Scan for Accessibility Issues'}
      </button>
      
      {violations.length > 0 && (
        <AccessibilityReport violations={violations} />
      )}
    </div>
  );
};
```

### 2. Color Contrast Analyzer
```tsx
// Advanced Color Contrast Analyzer
interface ColorContrastAnalyzerProps {
  foregroundColor: string;
  backgroundColor: string;
  fontSize?: number;
  fontWeight?: number;
  wcagLevel?: 'AA' | 'AAA';
}

const ColorContrastAnalyzer: React.FC<ColorContrastAnalyzerProps> = ({
  foregroundColor,
  backgroundColor,
  fontSize = 16,
  fontWeight = 400,
  wcagLevel = 'AA'
}) => {
  const contrastRatio = calculateContrastRatio(foregroundColor, backgroundColor);
  const complianceLevel = getWCAGCompliance(contrastRatio, fontSize, fontWeight);
  const recommendations = getContrastRecommendations(foregroundColor, backgroundColor);
  
  return (
    <div className="color-contrast-analyzer">
      <div className="contrast-preview" 
           style={{ color: foregroundColor, backgroundColor }}>
        Sample Text
      </div>
      
      <div className="contrast-metrics">
        <div className="contrast-ratio">
          Contrast Ratio: {contrastRatio}:1
        </div>
        
        <div className={`compliance-status ${complianceLevel.toLowerCase()}`}>
          WCAG {wcagLevel} Compliance: {complianceLevel}
        </div>
        
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation">
            {rec.type}: {rec.suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

// WCAG Compliance Calculator
function getWCAGCompliance(
  contrastRatio: number, 
  fontSize: number, 
  fontWeight: number
): 'Pass' | 'Fail' {
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
  
  if (isLargeText) {
    return contrastRatio >= 3 ? 'Pass' : 'Fail';
  } else {
    return contrastRatio >= 4.5 ? 'Pass' : 'Fail';
  }
}
```

### 3. Keyboard Navigation Validator
```tsx
// Keyboard Navigation Testing Component
interface KeyboardNavigationValidatorProps {
  container: HTMLElement;
  expectedTabOrder?: string[];
  trapFocus?: boolean;
}

const KeyboardNavigationValidator: React.FC<KeyboardNavigationValidatorProps> = ({
  container,
  expectedTabOrder = [],
  trapFocus = false
}) => {
  const [tabOrder, setTabOrder] = useState<FocusableElement[]>([]);
  const [violations, setViolations] = useState<KeyboardViolation[]>([]);
  
  const validateKeyboardNavigation = () => {
    const focusableElements = getFocusableElements(container);
    const keyboardViolations = checkKeyboardViolations(focusableElements, {
      expectedTabOrder,
      checkFocusTrap: trapFocus,
      validateFocusIndicators: true,
      checkSkipLinks: true,
      verifyFocusManagement: true
    });
    
    setTabOrder(focusableElements);
    setViolations(keyboardViolations);
  };
  
  return (
    <div className="keyboard-navigation-validator">
      <button onClick={validateKeyboardNavigation}>
        Validate Keyboard Navigation
      </button>
      
      {violations.length > 0 && (
        <div className="keyboard-violations">
          <h3>Keyboard Navigation Issues:</h3>
          {violations.map((violation, index) => (
            <div key={index} className="violation">
              <div className="violation-type">{violation.type}</div>
              <div className="violation-element">{violation.element}</div>
              <div className="violation-description">{violation.description}</div>
              <div className="violation-remediation">{violation.remediation}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 4. Screen Reader Simulator
```tsx
// Screen Reader Testing Component
interface ScreenReaderSimulatorProps {
  content: React.ReactElement;
  screenReader?: 'NVDA' | 'JAWS' | 'VoiceOver' | 'TalkBack';
  verbosity?: 'low' | 'medium' | 'high';
}

const ScreenReaderSimulator: React.FC<ScreenReaderSimulatorProps> = ({
  content,
  screenReader = 'NVDA',
  verbosity = 'medium'
}) => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const simulateScreenReader = async () => {
    setIsSimulating(true);
    
    const simulationResults = await simulateScreenReaderExperience(content, {
      screenReader,
      verbosity,
      checkLandmarks: true,
      validateHeadings: true,
      verifyLabels: true,
      testDescriptions: true
    });
    
    setAnnouncements(simulationResults.announcements);
    setIsSimulating(false);
  };
  
  return (
    <div className="screen-reader-simulator">
      <button onClick={simulateScreenReader} disabled={isSimulating}>
        {isSimulating ? 'Simulating...' : `Simulate ${screenReader}`}
      </button>
      
      {announcements.length > 0 && (
        <div className="screen-reader-output">
          <h3>Screen Reader Announcements:</h3>
          {announcements.map((announcement, index) => (
            <div key={index} className="announcement">
              <div className="announcement-text">{announcement}</div>
              <div className="announcement-context">
                Context: {getAnnouncementContext(announcement)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Accessibility Component Library

### 1. Accessible Button Component
```tsx
// Fully Accessible Button
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaControls,
  disabled,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event as any);
    }
  };
  
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`accessible-button ${variant} ${size}`}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-busy={loading}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="loading-indicator" aria-hidden="true" />}
      {icon && iconPosition === 'left' && <span className="icon-left">{icon}</span>}
      <span className="button-text">{children}</span>
      {icon && iconPosition === 'right' && <span className="icon-right">{icon}</span>}
    </button>
  );
};
```

### 2. Accessible Form Components
```tsx
// Accessible Form Field with Error Handling
interface AccessibleFormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  ariaDescribedBy?: string;
  autoComplete?: string;
}

const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  label,
  name,
  type = 'text',
  required = false,
  error,
  helperText,
  ariaDescribedBy,
  autoComplete,
  ...props
}) => {
  const fieldId = `field-${name}`;
  const errorId = `error-${name}`;
  const helperId = `helper-${name}`;
  
  const describedBy = [
    ariaDescribedBy,
    error && errorId,
    helperText && helperId
  ].filter(Boolean).join(' ');
  
  return (
    <div className="accessible-form-field">
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && <span className="required-indicator" aria-label="required">*</span>}
      </label>
      
      <input
        id={fieldId}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        autoComplete={autoComplete}
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      
      {error && (
        <div id={errorId} className="error-message" role="alert">
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={helperId} className="helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};
```

### 3. Accessible Navigation
```tsx
// Accessible Navigation Menu
interface AccessibleNavigationProps {
  items: NavigationItem[];
  currentPath?: string;
  ariaLabel?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time';
}

const AccessibleNavigation: React.FC<AccessibleNavigationProps> = ({
  items,
  currentPath,
  ariaLabel = 'Main navigation'
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const toggleItem = (itemHref: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemHref)) {
      newExpanded.delete(itemHref);
    } else {
      newExpanded.add(itemHref);
    }
    setExpandedItems(newExpanded);
  };
  
  return (
    <nav className="accessible-navigation" aria-label={ariaLabel}>
      <ul className="navigation-list">
        {items.map((item, index) => (
          <li key={index} className="navigation-item">
            <a
              href={item.href}
              className={`navigation-link ${currentPath === item.href ? 'current' : ''}`}
              aria-current={item.ariaCurrent || (currentPath === item.href ? 'page' : undefined)}
              aria-expanded={item.children ? expandedItems.has(item.href) : undefined}
              aria-controls={item.children ? `submenu-${index}` : undefined}
            >
              {item.icon && <span className="nav-icon" aria-hidden="true">{item.icon}</span>}
              <span className="nav-label">{item.label}</span>
              {item.children && (
                <span className="submenu-indicator" aria-hidden="true">
                  {expandedItems.has(item.href) ? '▼' : '▶'}
                </span>
              )}
            </a>
            
            {item.children && (
              <ul 
                id={`submenu-${index}`}
                className={`submenu ${expandedItems.has(item.href) ? 'expanded' : 'collapsed'}`}
              >
                {item.children.map((child, childIndex) => (
                  <li key={childIndex} className="submenu-item">
                    <a
                      href={child.href}
                      className={`submenu-link ${currentPath === child.href ? 'current' : ''}`}
                      aria-current={currentPath === child.href ? 'page' : undefined}
                    >
                      {child.icon && <span className="nav-icon" aria-hidden="true">{child.icon}</span>}
                      <span className="nav-label">{child.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

## Automated Remediation System

### 1. Intelligent Code Fixes
```tsx
// Auto-Fix Accessibility Issues
interface AutoFixResult {
  original: string;
  fixed: string;
  issuesFixed: AccessibilityIssue[];
  warnings: string[];
}

const autoFixAccessibility = async (html: string): Promise<AutoFixResult> => {
  const fixes = [
    fixMissingAltText,
    fixEmptyLinks,
    fixMissingLabels,
    fixColorContrast,
    fixMissingFocusIndicators,
    fixImproperHeadingStructure,
    fixMissingLandmarks,
    fixInvalidARIA
  ];
  
  let fixedHtml = html;
  const issuesFixed: AccessibilityIssue[] = [];
  const warnings: string[] = [];
  
  for (const fix of fixes) {
    const result = await fix(fixedHtml);
    fixedHtml = result.html;
    issuesFixed.push(...result.issuesFixed);
    warnings.push(...result.warnings);
  }
  
  return {
    original: html,
    fixed: fixedHtml,
    issuesFixed,
    warnings
  };
};
```

### 2. Real-Time Accessibility Monitoring
```tsx
// Real-Time Accessibility Monitoring
const AccessibilityMonitor: React.FC = () => {
  const [violations, setViolations] = useState<AccessibilityViolation[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  useEffect(() => {
    if (!isMonitoring) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const elementViolations = checkElementAccessibility(node as Element);
              if (elementViolations.length > 0) {
                setViolations(prev => [...prev, ...elementViolations]);
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, [isMonitoring]);
  
  return (
    <div className="accessibility-monitor">
      <button onClick={() => setIsMonitoring(!isMonitoring)}>
        {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
      </button>
      
      {violations.length > 0 && (
        <div className="accessibility-violations">
          <h3>Real-Time Violations ({violations.length})</h3>
          {violations.map((violation, index) => (
            <div key={index} className="violation-alert">
              {violation.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Compliance Reporting System

### 1. WCAG Compliance Dashboard
```tsx
// Accessibility Compliance Dashboard
interface ComplianceDashboardProps {
  projectName: string;
  scanResults: AccessibilityScan[];
  targetLevel: 'A' | 'AA' | 'AAA';
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  projectName,
  scanResults,
  targetLevel
}) => {
  const complianceData = calculateCompliance(scanResults, targetLevel);
  
  return (
    <div className="compliance-dashboard">
      <header className="dashboard-header">
        <h1>Accessibility Compliance - {projectName}</h1>
        <div className="compliance-score">
          Overall Score: {complianceData.overallScore}%
        </div>
      </header>
      
      <div className="compliance-metrics">
        <div className="metric-card">
          <h3>WCAG {targetLevel} Compliance</h3>
          <div className="compliance-percentage">
            {complianceData.wcagCompliance}%
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Critical Issues</h3>
          <div className="issue-count critical">
            {complianceData.criticalIssues}
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Warning Issues</h3>
          <div className="issue-count warning">
            {complianceData.warningIssues}
          </div>
        </div>
      </div>
      
      <div className="violation-breakdown">
        <h2>Issue Breakdown by Category</h2>
        {complianceData.violationsByCategory.map((category) => (
          <div key={category.name} className="category-breakdown">
            <h4>{category.name}</h4>
            <div className="category-stats">
              <span>Issues: {category.issueCount}</span>
              <span>Fixed: {category.fixedCount}</span>
              <span>Remaining: {category.remainingCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 2. Executive Summary Report
```tsx
// Executive Accessibility Summary
interface ExecutiveSummaryProps {
  organization: string;
  complianceData: ComplianceData;
  legalRequirements: string[];
  recommendations: Recommendation[];
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  organization,
  complianceData,
  legalRequirements,
  recommendations
}) => {
  return (
    <div className="executive-summary">
      <header>
        <h1>Accessibility Compliance Report</h1>
        <h2>{organization}</h2>
        <p className="report-date">{new Date().toLocaleDateString()}</p>
      </header>
      
      <section className="executive-overview">
        <h3>Executive Overview</h3>
        <p>
          Our accessibility audit reveals that {organization} currently achieves 
          {complianceData.overallScore}% compliance with WCAG 2.1 standards. 
          {complianceData.criticalIssues > 0 && 
            `Critical issues requiring immediate attention: ${complianceData.criticalIssues}.`}
        </p>
      </section>
      
      <section className="legal-compliance">
        <h3>Legal Compliance Status</h3>
        <ul>
          {legalRequirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </section>
      
      <section className="priority-recommendations">
        <h3>Priority Recommendations</h3>
        {recommendations.slice(0, 5).map((rec, index) => (
          <div key={index} className="recommendation">
            <h4>{rec.title}</h4>
            <p>{rec.description}</p>
            <div className="impact-estimate">
              Impact: {rec.impact} | Effort: {rec.effort} | ROI: {rec.roi}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
```

## Best Practices & Guidelines

### 1. WCAG 2.1 Implementation Checklist
- [ ] **Perceivable**: Text alternatives, captions, color contrast
- [ ] **Operable**: Keyboard navigation, enough time, seizure prevention
- [ ] **Understandable**: Readable text, predictable behavior, input assistance
- [ ] **Robust**: Compatible with assistive technologies, valid markup

### 2. Inclusive Design Principles
- [ ] **Equitable Use**: Same means of use for all users
- [ ] **Flexibility**: Accommodates individual preferences and abilities
- [ ] **Simple & Intuitive**: Easy to understand regardless of experience
- [ ] **Perceptible Information**: Communicates effectively regardless of conditions
- [ ] **Tolerance for Error**: Minimizes hazards and adverse consequences
- [ ] **Low Physical Effort**: Can be used efficiently and comfortably
- [ ] **Size & Space**: Appropriate size and space for approach and use

### 3. Testing Protocol
1. **Automated Scanning**: Use multiple tools for comprehensive coverage
2. **Manual Testing**: Keyboard navigation and screen reader testing
3. **User Testing**: Include users with disabilities in testing process
4. **Cross-Browser**: Test across different browsers and assistive technologies
5. **Mobile**: Ensure mobile accessibility compliance
6. **Ongoing**: Implement continuous monitoring and regular audits

---

*This skill ensures your digital experiences are accessible to all users, meeting legal requirements and providing inclusive user experiences.*