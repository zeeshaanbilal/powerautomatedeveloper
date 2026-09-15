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
        src="/images/microsoft-365-2022.svg" 
        alt="Microsoft 365 Logo" 
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
