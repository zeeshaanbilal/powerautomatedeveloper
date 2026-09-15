export function ServiceIcon({ slug }: { slug: string }) {
  if (slug.includes("power-automate")) {
    // Power Automate (Blue Arrow/Chevron style)
    return (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="#e5f0ff" />
        <path d="M22 13L16 19L10 13H14V9H18V13H22Z" fill="#0066ff" />
      </svg>
    );
  }
  if (slug.includes("power-apps")) {
    // Power Apps (Purple Diamond)
    return (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L30 16L16 30L2 16L16 2Z" fill="#f4e8fc" />
        <path d="M14 11V21L21 16L14 11Z" fill="#742774" />
      </svg>
    );
  }
  if (slug.includes("sharepoint")) {
    // SharePoint (Teal 'S' or nodes)
    return (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="24" height="24" rx="4" fill="#e5f5f4" />
        <path d="M19 10C20.6569 10 22 11.3431 22 13C22 14.6569 20.6569 16 19 16C17.3431 16 16 14.6569 16 13C16 11.3431 17.3431 10 19 10Z" fill="#0078d4" />
        <path d="M11 16C12.6569 16 14 17.3431 14 19C14 20.6569 12.6569 22 11 22C9.34315 22 8 20.6569 8 19C8 17.3431 9.34315 16 11 16Z" fill="#0078d4" />
        <path d="M19 18C20.1046 18 21 18.8954 21 20C21 21.1046 20.1046 22 19 22C17.8954 22 17 21.1046 17 20C17 18.8954 17.8954 18 19 18Z" fill="#0078d4" />
        <path d="M18.15 15.15L12.85 18.85M14 19H17" stroke="#0078d4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (slug.includes("dataverse")) {
    // Dataverse (Green Database)
    return (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="20" height="16" rx="3" fill="#e6f4ea" />
        <path d="M6 12C6 10.3431 10.4772 9 16 9C21.5228 9 26 10.3431 26 12M6 12C6 13.6569 10.4772 15 16 15C21.5228 15 26 13.6569 26 12M6 12V20C6 21.6569 10.4772 23 16 23C21.5228 23 26 21.6569 26 20V12" stroke="#107c41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  // Default API / Integrations
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#f3f4f6" />
      <path d="M12 16L16 12L20 16M16 12V20" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
