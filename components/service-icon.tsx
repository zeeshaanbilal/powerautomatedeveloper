export function ServiceIcon({ slug }: { slug: string }) {
  if (slug.includes("power-automate")) {
    // Power Automate (Blue Arrow/Chevron style)
    return (
      <img 
        src="/images/power-automate.svg" 
        alt="Power Automate Logo" 
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
    );
  }
  if (slug.includes("power-apps")) {
    // Power Apps (Purple Diamond)
    return (
      <img 
        src="/images/power-apps.png" 
        alt="Power Apps Logo" 
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
    );
  }
  if (slug.includes("power-pages")) {
    // Power Pages
    return (
      <img 
        src="/images/power-pages.png" 
        alt="Power Pages Logo" 
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
    );
  }
  if (slug.includes("sharepoint")) {
    // SharePoint (Teal 'S' or nodes)
    return (
      <img 
        src="/images/sharepoint.svg" 
        alt="SharePoint Logo" 
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
    );
  }
  if (slug.includes("dataverse")) {
    // Dataverse (Green Database)
    return (
      <img 
        src="/images/dataverse.png" 
        alt="Dataverse Logo" 
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
    );
  }
  if (slug.includes("excel")) {
    // Excel / Microsoft 365
    return (
      <img 
        src="/images/excel-logo.webp" 
        alt="Microsoft Excel Logo" 
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
    );
  }
  if (slug.includes("ai-builder")) {
    // AI Builder
    return (
      <img 
        src="/images/ai-builder.png" 
        alt="AI Builder Logo" 
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
    );
  }
  if (slug.includes("business-process") || slug.includes("workflow") || slug.includes("operation")) {
    // Operations Workflow — Flowchart Node Icon
    return (
      <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main node */}
        <rect x="4" y="12" width="8" height="8" rx="2" fill="#e5f0ff" stroke="#0066ff" strokeWidth="1.5" />
        {/* Branch lines */}
        <path d="M12 16H17" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 16V8H20" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 16H20" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 16V24H20" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sub-nodes */}
        <rect x="20" y="5" width="8" height="6" rx="1.5" fill="#e5f0ff" stroke="#0066ff" strokeWidth="1.5" />
        <rect x="20" y="13" width="8" height="6" rx="1.5" fill="#e5f0ff" stroke="#0066ff" strokeWidth="1.5" />
        <rect x="20" y="21" width="8" height="6" rx="1.5" fill="#e5f0ff" stroke="#0066ff" strokeWidth="1.5" />
        {/* Small dots inside sub-nodes */}
        <circle cx="24" cy="8" r="1" fill="#0066ff" />
        <circle cx="24" cy="16" r="1" fill="#0066ff" />
        <circle cx="24" cy="24" r="1" fill="#0066ff" />
      </svg>
    );
  }
  
  // Default API / Integrations
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="10" width="17" height="12" rx="3" fill="#e5f0ff" stroke="#0066ff" strokeWidth="1.5" />
      <text x="15.5" y="19" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" fill="#0066ff" textAnchor="middle">API</text>
      
      {/* Left Node & Wire */}
      <path d="M4.5 16H7" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="3" cy="16" r="1.5" fill="#0066ff" />
      
      {/* Right Nodes & Wires */}
      <path d="M24 16 H26 V11 H27.5" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M26 16 V21 H27.5" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      <circle cx="29" cy="11" r="1.5" fill="#0066ff" />
      <circle cx="29" cy="21" r="1.5" fill="#0066ff" />
    </svg>
  );
}
