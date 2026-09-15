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
      <circle cx="16" cy="16" r="14" fill="#f3f4f6" />
      <path d="M12 16L16 12L20 16M16 12V20" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
