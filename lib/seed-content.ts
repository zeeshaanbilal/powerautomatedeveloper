import type { Entry, Kind, Settings, ContentData } from "./types";
import { pageCopyDrafts } from "./page-copy-drafts";
export const origin = "https://powerautomatedeveloper.com";
export const defaults: Settings = {
  companyName: "HashTurn LLC",
  email: "",
  phone: "",
  address: "",
  logo: "",
  favicon: "",
  defaultTitle: "Power Automate Developers & Consultants | HashTurn",
  defaultDescription:
    "HashTurn builds, integrates and maintains business workflows with Power Automate, Power Apps and the Microsoft Power Platform.",
  defaultOgImage: "/opengraph-image",
  consultationLabel: "Book a Free Consultation",
  consultationUrl: "https://calendly.com/hashturns/30min",
  socialLinks: [],
  googleAnalyticsId: "",
  searchConsoleToken: "",
  trackingNotes: "",
};
const updatedAt = "2026-09-13T00:00:00.000Z";
function entry(
  kind: Kind,
  slug: string,
  title: string,
  excerpt: string,
  data: ContentData = {},
): Entry {
  return {
    id: slug || "home",
    kind,
    slug,
    title,
    excerpt,
    body: "",
    status: "PUBLISHED",
    publishedAt: updatedAt,
    sortOrder: 0,
    featuredImage: "",
    imageAlt: "",
    seo: {
      title: `${title} | HashTurn`,
      description: excerpt,
      canonical: `${origin}/${slug ? `${slug}/` : ""}`,
      ogImage: "/opengraph-image",
      schemaEnabled: true,
    },
    data,
    updatedAt,
  };
}
const serviceSpecs = [
  [
    "power-automate-development",
    "Power Automate Development",
    "Turn a manual process into a dependable workflow. HashTurn designs, builds and maintains Power Automate solutions around your systems and the people who use them.",
    "Disconnected tasks, duplicate data entry and workflows with no clear owner.",
    "Approval workflows|Event-driven integrations|Monitoring and failure recovery",
    "We map the trigger, decisions, data permissions and exception paths before building. Delivery includes testing with representative records and a documented handover.",
    "Power Automate Cloud|Microsoft 365|Dataverse",
    "Purchase approvals|Customer onboarding|Cross-system record updates",
  ],
  [
    "power-automate-cloud",
    "Power Automate Cloud",
    "Connect cloud applications with automated, scheduled and instant flows. We build cloud workflows with clear ownership, controlled access and practical recovery paths.",
    "Flows that time out, run twice or quietly stop when a connection changes.",
    "Trigger conditions and concurrency control|Reusable child flows|Retry policies and operational alerts",
    "We review connector limits and authentication, design idempotent operations, then test failures and volume before release.",
    "Power Automate Cloud|Microsoft Graph|SharePoint",
    "Scheduled reporting|Teams notifications|CRM synchronisation",
  ],
  [
    "power-automate-desktop",
    "Power Automate Desktop & RPA",
    "Automate repetitive work in desktop applications when an API is unavailable. HashTurn builds desktop flows that account for application state, machine setup and exceptions.",
    "Legacy software requires manual typing, file downloads or repeated screen navigation.",
    "Attended desktop automation|Unattended execution planning|Selectors, error handling and recovery",
    "We assess whether an API is more suitable, validate the desktop environment and document machine, session and licensing dependencies.",
    "Power Automate Desktop|Windows|Excel",
    "Legacy application data entry|Report downloads|Desktop document processing",
  ],
  [
    "sharepoint-automation",
    "SharePoint Automation",
    "Build a clearer way to manage documents, requests and approvals in SharePoint. We connect lists and libraries to the business processes they support.",
    "Requests get lost in email and document status is hard to follow.",
    "List-driven approvals|Document routing and metadata|Permissions-aware notifications",
    "We review list design, permissions and expected volume, then test workflow behaviour with the teams who own the process.",
    "SharePoint|Power Automate|Microsoft Teams",
    "Policy acknowledgements|Document reviews|Internal service requests",
  ],
  [
    "excel-automation",
    "Excel Automation",
    "Reduce recurring spreadsheet work with Excel automation, Office Scripts, VBA and connected workflows. We choose an approach that fits how your workbooks are used.",
    "Manual copy-paste, inconsistent workbook formats and reports that depend on one person.",
    "Workbook validation and transformation|Scheduled report preparation|VBA and Office Scripts development",
    "We inspect workbook structure and concurrent usage, define validation rules and provide recovery instructions for unexpected input.",
    "Excel|Office Scripts|VBA|Python",
    "Monthly reporting|Workbook consolidation|Data reconciliation",
  ],
  [
    "ai-builder",
    "AI Builder & AI Automation",
    "Add document extraction and classification to business workflows with human review where it matters. HashTurn connects AI Builder to a controlled downstream process.",
    "Teams manually read incoming documents and re-enter information into business systems.",
    "Document extraction pipelines|Confidence-based review queues|Classification and validation",
    "We evaluate representative samples, define review thresholds and test exceptions. Accuracy depends on document quality and is measured with your own data.",
    "AI Builder|Power Automate|Copilot Studio",
    "Invoice intake|Form extraction|Document triage",
  ],
  [
    "dataverse-development",
    "Dataverse Development",
    "Create a reliable data foundation for Power Platform applications. We design Dataverse tables, relationships and security around your business processes.",
    "Inconsistent records, spreadsheet sprawl and unclear access rules make automation fragile.",
    "Relational data modelling|Security roles and access design|Power Platform integrations",
    "We agree ownership and relationships, plan migration and validate permissions using representative user roles.",
    "Dataverse|Power Apps|Power Automate",
    "Operational data platforms|Case management|Shared business records",
  ],
  [
    "power-apps-development",
    "Power Apps Development",
    "Give your team a focused application for everyday work. HashTurn builds Power Apps connected to the data, approvals and systems behind your operations.",
    "Email and spreadsheets make it difficult to collect consistent information or track work.",
    "Canvas applications|Model-driven applications|Role-aware forms and workflow integration",
    "We prototype the user journey, confirm the data model and permissions, and test the application on the devices your team uses.",
    "Power Apps|Dataverse|SharePoint",
    "Field data collection|Request management|Internal operations applications",
  ],
  [
    "api-integrations",
    "API Integrations",
    "Connect business systems with maintainable API integrations. We handle authentication, data mapping and failure recovery so records move through a defined process.",
    "Systems hold different versions of the same information and manual exports cannot keep up.",
    "REST API and webhook integration|Custom connectors|Pagination, retries and reconciliation",
    "We review API contracts and limits, design secure credential handling and make partial failures visible for support teams.",
    "REST APIs|Microsoft Graph|Power Automate|n8n|Python",
    "CRM-to-operations handoffs|Webhook event processing|Scheduled data synchronisation",
  ],
  [
    "crm-automation",
    "CRM Automation",
    "Connect your customer lifecycle to the work behind it. HashTurn automates CRM updates, handoffs and follow-ups with explicit rules for record ownership.",
    "Sales and operations repeat data entry or miss important handoffs between systems.",
    "Lead routing and assignment|Customer onboarding workflows|CRM integration and data validation",
    "We map lifecycle stages, agree matching and deduplication rules, and test exception cases before enabling automated updates.",
    "Power Automate|Dataverse|CRM APIs",
    "Deal-to-project handoff|Contact synchronisation|Follow-up task creation",
  ],
  [
    "document-automation",
    "Document Automation",
    "Build a consistent path from document intake to a reviewed, stored and usable record. We connect extraction, validation, generation and approvals.",
    "Files arrive through multiple channels and require repeated checking, renaming and filing.",
    "Document intake and classification|Template-based generation|Approval, storage and metadata workflows",
    "We define document types and required fields, validate realistic samples and design a review path for missing or uncertain information.",
    "SharePoint|AI Builder|Power Automate|Microsoft 365",
    "Mortgage document intake|Invoice processing|Contract generation",
  ],
  [
    "business-process-automation",
    "Business Process Automation",
    "Improve the process before automating it. HashTurn maps how work moves across teams, then builds connected workflows with clear responsibilities and support.",
    "Processes cross multiple departments with unclear handoffs, duplicated work and limited visibility.",
    "Process discovery and prioritisation|Cross-team workflow orchestration|Operational monitoring and documentation",
    "We identify constraints and exception paths, agree a useful first release and refine the workflow using feedback from its owners.",
    "Power Platform|Microsoft 365|n8n|APIs",
    "Employee onboarding|Procurement|Operations request handling",
  ],
];
export const services = serviceSpecs.map(
  ([slug, title, excerpt, problem, build, process, tech, cases], i) => ({
    ...entry("SERVICE", `services/${slug}`, title, excerpt, {
      eyebrow: "Power Platform services",
      sections: [
        { title: "The problems we solve", text: problem },
        {
          title: "What we build",
          text: "A solution scoped to your process, data and operating environment.",
          items: build.split("|"),
        },
        {
          title: "Typical use cases",
          text: "These are examples of the work this service can support, rather than claims about completed client projects.",
          items: cases.split("|"),
        },
        { title: "How we deliver", text: process },
        {
          title: "Built for the people who maintain it",
          text: "We agree ownership, access, deployment and support during scoping. Documentation explains the workflow, its dependencies and what to do when an exception occurs.",
        },
      ],
      skills: tech.split("|"),
      related: [
        "hire/power-automate-developer",
        "industries/operations",
        "services/" +
          (slug === "api-integrations"
            ? "power-automate-cloud"
            : "api-integrations"),
      ],
      faqs: [
        {
          question: `What do you need to scope ${title.toLowerCase()}?`,
          answer: `We start with a walkthrough of your process, sample inputs and outputs, and the systems involved. For ${tech.split("|")[0]}, we also review access, environment setup and licensing dependencies.`,
        },
        {
          question: "Can you improve an existing solution?",
          answer: `Yes. We can review your current ${title.toLowerCase()} setup, identify failure points and agree a scoped set of changes. Access and a reproducible example help us assess the work.`,
        },
      ],
    }),
    sortOrder: i,
  }),
);
const hireSpecs = [
  [
    "power-automate-developer",
    "Hire a Power Automate Developer",
    "Add hands-on Power Automate development to your project. Work with HashTurn on a defined workflow, integration or improvement, with clear scope and technical ownership.",
    "Best for a defined delivery need",
    "A developer is a good fit when you know the process to improve and need someone to implement, test and document it.",
    "Workflow development|API integrations|Flow troubleshooting|Release documentation",
  ],
  [
    "power-automate-team",
    "Hire a Power Automate Team",
    "Bring together automation, application and integration skills for work that spans systems. HashTurn organises a delivery team around the scope of your project.",
    "Best for work across systems and disciplines",
    "A team is appropriate when parallel workstreams need coordinated delivery, such as an application, its data model and the workflows connecting it to other systems.",
    "Solution design|Power Apps and Dataverse|Automation development|Testing and handover",
  ],
  [
    "dedicated-power-automate-developer",
    "Dedicated Power Automate Developer",
    "Build continuity for an ongoing automation backlog. Agree a dedicated engagement with HashTurn around your priorities, collaboration needs and support requirements.",
    "Best for an evolving backlog",
    "A dedicated engagement supports regular iterations and growing familiarity with your environment. Availability, capacity and working hours are agreed before the engagement begins.",
    "Backlog refinement|Iterative development|Maintenance and optimisation|Knowledge transfer",
  ],
  [
    "power-automate-consultant",
    "Hire a Power Automate Consultant",
    "Make informed decisions before investing in automation. HashTurn helps assess processes, review existing solutions and plan a practical Power Platform implementation.",
    "Best for deciding what to build next",
    "Consulting helps when the right approach is unclear, a flow is unreliable, or your team needs an independent review before implementation.",
    "Process assessment|Architecture review|Governance planning|Implementation roadmap",
  ],
];
const hires = hireSpecs.map(([slug, title, excerpt, heading, text, skills]) =>
  entry("HIRE", `hire/${slug}`, title, excerpt, {
    sections: [
      { title: heading, text },
      {
        title: "What your engagement includes",
        text: "We agree deliverables, responsibilities and acceptance criteria before development starts.",
        items: skills.split("|"),
      },
      {
        title: "Communication and project workflow",
        text: "Expect a named point of contact, a prioritised scope and reviewable progress. Meeting cadence, collaboration tools and working-hour overlap are agreed with your team.",
      },
      {
        title: "Engagement and support",
        text: "Choose a scoped project, an ongoing development engagement or a consulting assessment. Support coverage and response expectations are defined in your agreement.",
      },
    ],
    skills: ["Power Automate", "Power Apps", "SharePoint", "Dataverse", "APIs"],
    related: hireSpecs.filter((s) => s[0] !== slug).map((s) => `hire/${s[0]}`),
    faqs: [
      {
        question: "How do we get started?",
        answer:
          "Share the process, systems and timeframe you have in mind. We review the requirements, clarify dependencies and propose a suitable engagement.",
      },
      {
        question: "Do you work with our internal team?",
        answer:
          "Yes. Access, code ownership, review practices and handover can be agreed around your existing team and environment.",
      },
    ],
  }),
);
const industries = [
  [
    "mortgage",
    "Mortgage",
    "Coordinate document intake, missing-information requests and review handoffs without losing sight of who owns the next step.",
    "Document intake checklists|Application status notifications|Reviewer assignment",
    "Sensitive borrower information requires access rules and retention decisions set by your organisation. Automation supports your process; it does not replace lending judgement.",
  ],
  [
    "real-estate",
    "Real Estate",
    "Connect enquiries, property records and transaction tasks so your team can follow a consistent process from first contact to handover.",
    "Enquiry routing|Property document organisation|Transaction task tracking",
    "We define how records are matched and how staff handle incomplete or duplicate enquiries before enabling automatic updates.",
  ],
  [
    "healthcare",
    "Healthcare",
    "Support administrative workflows with controlled routing, consistent forms and clear ownership across your operations team.",
    "Administrative request handling|Internal approval routing|Operational reporting",
    "Your security and compliance teams must approve the data, systems and permissions used. No compliance certification or clinical suitability is implied.",
  ],
  [
    "finance",
    "Finance",
    "Build reviewable workflows for recurring finance operations, from invoice intake to reconciliation and approval tracking.",
    "Invoice review queues|Expense approvals|Report preparation",
    "Approval authority, separation of duties and audit requirements must be defined with your finance and security stakeholders.",
  ],
  [
    "operations",
    "Operations",
    "Replace scattered requests and repeated updates with connected workflows that make responsibilities and exceptions clear.",
    "Employee onboarding|Procurement requests|Service request tracking",
    "We begin with the actual handoffs and exceptions, then agree process ownership before implementing automation.",
  ],
].map(([slug, name, excerpt, items, caution]) =>
  entry(
    "INDUSTRY",
    `industries/${slug}`,
    `${name} Workflow Automation`,
    excerpt,
    {
      eyebrow: "Automation by industry",
      sections: [
        {
          title: `Where automation can help ${name.toLowerCase()} teams`,
          text: "Start with a repeated, well-understood process and a measurable acceptance criterion.",
          items: items.split("|"),
        },
        { title: "Design around your operating requirements", text: caution },
        {
          title: "A practical first engagement",
          text: "We walk through one process, review sample data and identify the systems involved. The resulting scope defines what is automated, where people review work and how exceptions are handled.",
        },
      ],
      related: [
        "services/document-automation",
        "services/business-process-automation",
        "hire/power-automate-team",
      ],
      faqs: [
        {
          question: "Can you connect our existing systems?",
          answer:
            "We assess available APIs, connectors and access policies first. Where a supported integration is unavailable, we explain the limitations and options before proposing a build.",
        },
      ],
    },
  ),
);
const initialContent: Entry[] = [
  entry(
    "PAGE",
    "",
    "Hire Power Automate Developers",
    "Your processes. Connected. We build, integrate and maintain the workflows that keep your business moving.",
    {
      eyebrow: "Your automation development partner",
      primaryCta: "Hire a Power Automate Developer",
      secondaryCta: "Book a Free Consultation",
      sections: [
        {
          title: "Less busywork. More business.",
          text: "HashTurn brings together Power Automate developers and automation specialists to turn disconnected tasks into dependable business processes.",
        },
      ],
      faqs: [
        {
          question: "What can you automate with Power Automate?",
          answer:
            "Approvals, document processing, notifications, data synchronisation and recurring operational tasks are common starting points. We assess your process and systems before recommending a solution.",
        },
        {
          question: "Should I hire a developer or a team?",
          answer:
            "A developer suits a defined workflow or integration. A team can support a broader project involving applications, data modelling and several connected systems.",
        },
        {
          question: "Can you fix or maintain our existing flows?",
          answer:
            "Yes. We can review existing flows, investigate failures and scope improvements or an ongoing support engagement.",
        },
        {
          question: "How much does a project cost?",
          answer:
            "Cost depends on scope, integrations, data complexity and support needs. We review those factors with you and provide a proposal before development begins.",
        },
      ],
    },
  ),
  entry(
    "PAGE",
    "services",
    "Automation services built around your business",
    "From a single approval flow to a connected Power Platform solution, explore how HashTurn can help your team work with less friction.",
  ),
  ...services,
  ...hires,
  ...industries,
  entry(
    "PAGE",
    "hire",
    "The right expertise for your next step",
    "Choose hands-on development, a coordinated team, a dedicated engagement or consulting support to match your project.",
  ),
  entry(
    "PAGE",
    "industries",
    "Real processes. Industry context.",
    "Explore practical automation opportunities across mortgage, real estate, healthcare, finance and operations.",
  ),
  entry(
    "PAGE",
    "developers",
    "Meet your automation development partner",
    "Work with HashTurn’s technical lead and wider team of automation specialists across Power Automate and the Microsoft Power Platform.",
  ),
  entry(
    "TEAM",
    "developers/zeeshan-bilal",
    "Zeeshan Bilal",
    "Lead Automation Developer at HashTurn. Zeeshan helps businesses connect their systems and turn manual processes into maintainable automation.",
    {
      role: "Lead Automation Developer",
      sections: [
        {
          title: "Technical depth, grounded in the process",
          text: "Zeeshan works across Power Automate Cloud and Desktop, Power Apps, SharePoint and Dataverse. His work connects workflow development with APIs, document processing and the everyday needs of business teams.",
        },
        {
          title: "Beyond a single platform",
          text: "His expertise includes AI Builder, Copilot Studio, Microsoft 365, webhooks, CRM automation, Excel, VBA, Office Scripts, Python and n8n. The approach follows the requirements of the process and the systems involved.",
        },
        {
          title: "Leading HashTurn",
          text: "As lead automation developer, Zeeshan brings technical direction to HashTurn’s wider automation team. Project responsibilities and the delivery model are agreed during scoping.",
        },
      ],
      skills: [
        "Power Automate Cloud",
        "Power Automate Desktop",
        "Power Apps",
        "SharePoint",
        "Dataverse",
        "AI Builder",
        "Copilot Studio",
        "Microsoft 365",
        "APIs & webhooks",
        "CRM automation",
        "Excel & VBA",
        "Office Scripts",
        "Python",
        "n8n",
        "RPA",
        "Document automation",
      ],
      related: [
        "services/power-automate-development",
        "services/api-integrations",
        "hire/power-automate-consultant",
      ],
    },
  ),
  entry(
    "TEAM",
    "developers/rehana-ghaffar",
    "Rehana Ghaffar",
    "RPA Developer at HashTurn. Rehana specialises in robotic process automation and desktop workflows.",
    {
      role: "RPA Developer",
      sections: [
        {
          title: "Robotic Process Automation",
          text: "Rehana focuses on automating repetitive work in legacy systems and desktop applications using Power Automate Desktop and RPA tools.",
        },
        {
          title: "Reliable Desktop Workflows",
          text: "Her approach ensures unattended and attended desktop flows account for application state, machine dependencies, and clear exception handling.",
        },
      ],
      skills: [
        "Power Automate Desktop",
        "RPA",
        "Automation Strategy",
        "Excel & VBA",
      ],
      related: [
        "services/power-automate-desktop",
        "hire/power-automate-developer",
      ],
    },
  ),
  entry(
    "TEAM",
    "developers/zohaib-rashid",
    "Zohaib Rashid",
    "Automation Engineer at HashTurn. Zohaib specialises in business automation.",
    {
      role: "Automation Engineer",
      sections: [
        {
          title: "Power Apps",
          text: "Zohaib designs canvas and model-driven applications around specific operational workflows, ensuring clear data entry and reliable request management.",
        },
        {
          title: "Dataverse & SharePoint",
          text: "He structures Dataverse environments and SharePoint architectures so that Power Platform solutions rest on secure, consistent, and practical data models.",
        },
      ],
      skills: [
        "Power Apps",
        "Dataverse",
        "SharePoint",
        "CRM Automation",
      ],
      related: [
        "services/power-apps-development",
        "services/dataverse-development",
        "hire/power-automate-team",
      ],
    },
  ),
  entry(
    "TEAM",
    "developers/aqsa-wazeer",
    "Aqsa Wazeer",
    "RPA Developer at HashTurn. Aqsa builds attended and unattended workflows for legacy application automation.",
    {
      role: "RPA Developer",
      sections: [
        {
          title: "Desktop Automation Specialist",
          text: "Aqsa builds dependable, unattended desktop flows to replace manual typing, copy-pasting, and legacy system navigation. Her solutions ensure repetitive daily tasks are handled autonomously.",
        },
        {
          title: "Error Handling & Recovery",
          text: "She designs workflows that account for application timeouts and unexpected popups, guaranteeing that if an automation fails, the team knows exactly where and why.",
        },
      ],
      skills: [
        "Power Automate Desktop",
        "RPA",
        "Legacy System Automation",
        "Excel",
      ],
      related: [
        "services/power-automate-desktop",
        "hire/power-automate-developer",
      ],
    },
  ),
  entry(
    "TEAM",
    "developers/iqra-ahsan",
    "Iqra Ahsan",
    "SharePoint Architect at HashTurn. Iqra designs practical and structured SharePoint environments.",
    {
      role: "SharePoint Architect",
      sections: [
        {
          title: "SharePoint Architecture",
          text: "Iqra plans the information architecture, governance policies, and designs reliable SharePoint solutions.",
        },
      ],
      skills: [
        "SharePoint",
        "Microsoft 365",
        "Architecture",
      ],
      related: [
        "services/sharepoint-automation",
      ],
    },
  ),
  entry(
    "PAGE",
    "developers/our-team",
    "One team. Connected expertise.",
    "HashTurn brings together 15+ automation specialists and developers, with skills across workflows, applications, data and integrations.",
    {
      sections: [
        {
          title: "A team shaped around your project",
          text: "Not every project needs the same roles. We match the delivery approach to your scope, from a focused workflow build to work spanning Power Apps, Dataverse and connected systems.",
        },
        {
          title: "A clear way to collaborate",
          text: "We agree technical responsibilities, communication and review points at the start. Documentation and handover help your team understand what has been built and how to maintain it.",
        },
      ],
      related: ["developers/zeeshan-bilal", "hire/power-automate-team"],
    },
  ),
  entry(
    "PAGE",
    "case-studies",
    "Automation in practice",
    "Published case studies will explain the problem, implementation and verified outcome. Contact us to discuss experience relevant to your process.",
    {
      sections: [
        {
          title: "Evidence you can evaluate",
          text: "We publish project details only when they have been verified and approved for sharing. Client identities can remain anonymous. No sample project on this site is presented as a completed engagement.",
        },
      ],
    },
  ),
  entry(
    "PAGE",
    "resources",
    "A clearer path to automation",
    "Explore our resource collections, or speak with the team about a Power Platform decision you are working through.",
  ),
  entry(
    "PAGE",
    "blog",
    "Notes on building better workflows",
    "Our editorial space for practical Power Platform development, integration and automation strategy. Articles are published after review.",
  ),
  entry(
    "PAGE",
    "resources/guides",
    "Automation guides",
    "A collection for reviewed, practical guides covering process discovery, implementation and maintenance. New guides will appear here when published.",
  ),
  entry(
    "PAGE",
    "resources/power-automate-guides",
    "Power Automate guides",
    "Reviewed guidance for designing cloud flows, working with desktop automation and maintaining Power Automate solutions will appear in this collection.",
  ),
  entry(
    "PAGE",
    "resources/automation-guides",
    "Business automation guides",
    "This collection is dedicated to process mapping, integration choices and operational ownership. Guides will appear once reviewed and published.",
  ),
  entry(
    "PAGE",
    "about",
    "Better workflows start with understanding your work",
    "HashTurn LLC helps businesses build, automate, integrate and maintain business processes using Microsoft Power Automate and the Microsoft Power Platform.",
    {
      sections: [
        {
          title: "Your automation development partner",
          text: "Led by lead automation developer Zeeshan Bilal, HashTurn brings together 15+ automation specialists and developers. We work across workflows, business applications, data and integrations.",
        },
        {
          title: "How we approach the work",
          text: "We begin with the process: who does the work, where information lives and what happens when things go wrong. That understanding shapes a solution your team can use and maintain.",
        },
        {
          title: "A practical technology toolkit",
          text: "Our capabilities include Power Automate, Power Apps, Dataverse, SharePoint, AI Builder, Copilot Studio, Microsoft 365, APIs, n8n, Python, Excel, VBA and Office Scripts.",
        },
      ],
      related: ["developers/zeeshan-bilal", "developers/our-team", "services"],
    },
  ),
  entry(
    "PAGE",
    "pricing",
    "A clear scope before a price",
    "Automation work varies by process, integration complexity and support needs. We prepare a proposal around agreed deliverables rather than publishing a misleading one-size-fits-all rate.",
    {
      sections: [
        {
          title: "Scoped projects",
          text: "For a defined workflow or application, we agree the requirements, acceptance criteria, dependencies and delivery approach before quoting.",
        },
        {
          title: "Ongoing development",
          text: "For an evolving backlog, we agree capacity, priorities and a review cadence. Availability and working-hour overlap are confirmed during scoping.",
        },
        {
          title: "Consulting and assessment",
          text: "For an uncertain starting point, a focused assessment can clarify feasibility, architecture and an implementation roadmap.",
        },
        {
          title: "What affects the estimate",
          text: "The number of systems, access requirements, data quality, exception handling, testing and support expectations all influence the scope. Microsoft and other third-party licence costs are confirmed separately.",
        },
      ],
      related: ["hire", "contact"],
    },
  ),
  entry(
    "PAGE",
    "contact",
    "Let’s put your process to work",
    "Tell us what your team is doing manually, what systems you use and what you would like to improve. We’ll use those details to discuss a practical next step.",
  ),
  ...[
    ["privacy-policy", "Privacy Policy"],
    ["terms", "Terms of Use"],
    ["cookie-policy", "Cookie Policy"],
  ].map(([slug, title]) => ({
    ...entry(
      "PAGE",
      slug,
      title,
      `Information about ${title.toLowerCase()} for the HashTurn website.`,
      {
        sections: pageCopyDrafts[slug].sections,
      },
    ),
    seo: {
      title: `${title} | HashTurn`,
      description: `Read the ${title.toLowerCase()} information for HashTurn’s automation services website.`,
      canonical: `${origin}/${slug}/`,
      noindex: true,
      ogImage: "/opengraph-image",
      schemaEnabled: true,
    },
  })),
];
export const seedContent: Entry[] = initialContent.map((entry) => {
  const copy = pageCopyDrafts[entry.slug];
  const e = copy
    ? {
        ...entry,
        excerpt: copy.excerpt,
        data: { ...entry.data, sections: copy.sections },
        seo: { ...entry.seo, description: copy.excerpt },
      }
    : entry;
    
  if (e.slug === "developers/rehana-ghaffar") {
    e.featuredImage = "/images/rehana-ghaffar.jpg";
    e.imageAlt = "Rehana Ghaffar, RPA Developer";
  }
  
  if (e.slug === "developers/zohaib-rashid") {
    e.featuredImage = "/images/zohaib-rashid.jpg";
    e.imageAlt = "Zohaib Rashid, Power Apps Developer";
  }
  
  if (e.slug === "developers/aqsa-wazeer") {
    e.featuredImage = "/media_1789467755008.png";
    e.imageAlt = "Aqsa Wazeer, RPA Developer";
  }
  
  if (e.slug === "developers/iqra-ahsan") {
    e.imageAlt = "Iqra Ahsan, SharePoint Architect";
  }
  
  return e;
});
export const defaultNavigation = [
  ["Home", "/"],
  ["Services", "/services/"],
  ["Hire Developers", "/hire/"],
  ["Industries", "/industries/"],
  ["Developers", "/developers/"],
  ["Case Studies", "/case-studies/"],
  ["Resources", "/resources/"],
  ["About", "/about/"],
  ["Contact", "/contact/"],
].map(([label, href], sortOrder) => ({
  id: String(sortOrder),
  label,
  href,
  sortOrder,
  location: "HEADER",
  active: true,
}));
