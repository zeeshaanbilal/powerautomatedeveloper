import type { Section } from "./types";
type PageCopy = { excerpt: string; sections: Section[] };

// Reviewable business copy, also used by the initial-content fallback.
export const pageCopyDrafts: Record<string, PageCopy> = {
  "privacy-policy": {
    excerpt:
      "How HashTurn LLC handles information collected through this website, project enquiries and consultation requests, and how you can contact us about your privacy.",
    sections: [
      {
        title: "About this policy",
        text: "This policy describes the handling of personal information through powerautomatedeveloper.com, operated by HashTurn LLC. It covers visitors, people making business enquiries and administrators using the website. Information processed within a client project may be subject to a separate services agreement or data-processing agreement. Last updated: 14 September 2026.",
      },
      {
        title: "Information you provide",
        text: "When you submit a project enquiry, we collect your name, business or company name, email address, project type, selected services and project description. You can also provide a phone number, budget and timeline. We use the information you choose to share in later correspondence to understand and respond to your request. Please do not include passwords, access tokens, medical records, financial account information or confidential client documents in the website form.",
      },
      {
        title: "Website and security information",
        text: "The website processes technical information needed to deliver pages and protect its services. This may include connection information, browser requests and operational logs maintained by infrastructure providers. The enquiry system uses signed submission challenges and temporary rate-limit records to reduce automated abuse and repeated submissions. Administrator accounts use credentials and session records to control access to private areas.",
      },
      {
        title: "How we use information",
        text: "We use enquiry information to discuss your requirements, respond to questions, prepare potential project scopes and manage the resulting business relationship. We also use relevant information to operate the website, investigate technical problems, prevent misuse and address legal obligations or disputes. Submitting a project enquiry does not enroll you in a newsletter. The website does not send your form contents as analytics events.",
      },
      {
        title: "Reasons for processing",
        text: "Where data-protection law requires a legal basis, the basis depends on the activity. Responding to a request may involve steps toward a contract or our legitimate interest in answering business enquiries. Website security and administration support our legitimate interest in operating a reliable service. Optional analytics relies on your choice to enable it. Processing necessary to meet a legal obligation is handled on that basis. Your rights and the precise legal requirements depend on the law applicable to you and the processing.",
      },
      {
        title: "Service providers and recipients",
        text: "Authorised people handling enquiries and website administration may access relevant information. This website uses Neon for database services. Hosting, infrastructure and other service providers may process information necessary to operate the website. If optional Google Analytics is configured and you allow it, Google receives analytics information. We may also disclose information where required by law or necessary to respond to a lawful request, protect rights or address misuse. Individual client engagements can involve additional providers described in the project arrangements.",
      },
      {
        title: "Consultation bookings and external websites",
        text: "Consultation buttons link to Calendly. Following that link takes you to a separate service, where the booking details you submit are handled under Calendly's policies as well as the arrangements for your consultation with HashTurn. Other third-party links are provided for convenience. Review the relevant provider's privacy information before submitting information on its website.",
      },
      {
        title: "Cookies and optional analytics",
        text: "The website uses an essential cookie for administrator sessions and browser storage to remember your analytics preference. If Google Analytics is configured, it is loaded only after you allow analytics. It can receive information about interactions such as consultation clicks and enquiry-submission events, without the enquiry text. You can change your choice using Analytics preferences in the footer. See the Cookie Policy for more detail.",
      },
      {
        title: "Storage, international processing and retention",
        text: "Website information may be processed in countries where HashTurn's infrastructure and service providers operate, which may differ from your country. Applicable data-protection requirements must be considered when arranging those services. Retention depends on the purpose of the record, whether an enquiry becomes a client engagement, contractual or legal requirements, and whether information is needed to resolve a dispute or security issue. Enquiry records are not automatically deleted on a fixed schedule by the current website. Contact us to request a review of information held about you.",
      },
      {
        title: "Your choices and privacy requests",
        text: "Depending on applicable law, you may have rights to access, correct or delete personal information, restrict or object to certain processing, obtain a portable copy, or withdraw consent where processing relies on consent. You may also have a right to complain to your relevant data-protection authority. Use the Contact page and identify your message as a privacy request. Include enough information to locate the relevant enquiry, but do not send identity documents unless requested through an appropriate channel. We may need to verify a request before acting and will respond in accordance with applicable requirements.",
      },
      {
        title: "Security and information about children",
        text: "The website restricts administrative access and uses measures such as password hashing, input validation and session controls. No online system can guarantee absolute security. This website is intended for business users and is not directed at children. If you believe a child has supplied personal information, contact us so the information can be reviewed.",
      },
      {
        title: "Contact and policy updates",
        text: "For questions about this policy or the handling of your information, contact HashTurn LLC through the Contact page and mark the message as a privacy enquiry. This policy may be updated as website functionality, service providers or business arrangements change. The date above identifies the current version. Please review the policy when you provide new information.",
      },
    ],
  },
  terms: {
    excerpt:
      "The terms for using the HashTurn website, submitting enquiries and accessing its content. Paid development work is governed by a separate written agreement.",
    sections: [
      {
        title: "About these terms",
        text: "These Terms of Use apply to powerautomatedeveloper.com, operated by HashTurn LLC. By using the website, you agree to use it in accordance with these terms and applicable law. If you do not agree, please stop using the website. These terms concern website use; they do not replace a signed agreement for development, consulting or support services. Last updated: 14 September 2026.",
      },
      {
        title: "Information about our services",
        text: "The website explains the types of automation, application development, integration and support work that HashTurn can discuss with prospective clients. Descriptions, example workflows and educational materials are general information. They do not constitute a binding offer, a guarantee of suitability or a promise of a particular outcome. Scope, availability, timelines and commercial terms must be confirmed for each engagement.",
      },
      {
        title: "Enquiries, consultations and proposals",
        text: "Sending a form, booking a consultation or discussing an idea does not create an obligation for either party to enter a paid engagement. A project begins under the terms agreed in a separate written agreement. Please provide accurate contact information and describe your requirements as clearly as possible. Do not submit information that you do not have permission to share. An initial website enquiry is not a substitute for a confidentiality agreement.",
      },
      {
        title: "Project agreements and third-party costs",
        text: "A written project agreement should identify deliverables, responsibilities, acceptance criteria, fees, payment arrangements, change requests and any support commitment. Software licences, cloud services and other third-party charges are addressed during scoping and are not assumed to be included unless stated in the agreement. Ownership and permitted use of project deliverables are determined by the relevant contract, not by these website terms.",
      },
      {
        title: "Acceptable use",
        text: "You must not use the website to distribute unlawful material, impersonate another person, submit deceptive enquiries, introduce malicious code or interfere with availability. Do not attempt to bypass authentication, access private data, test systems without authorisation or use automated submissions to overload the website. We may restrict access where reasonably necessary to address misuse or protect the service.",
      },
      {
        title: "Website content and intellectual property",
        text: "Website text, layouts, illustrations and other materials may be protected by intellectual-property rights held by HashTurn or their respective owners. You may view the website and use its information to evaluate our services. Reproducing or republishing substantial parts for commercial use requires permission from the relevant rights holder unless applicable law permits the use. Microsoft, Power Automate, Power Apps and other third-party names and product icons remain the property of their respective owners. Their appearance identifies technologies and does not itself imply endorsement or partnership.",
      },
      {
        title: "Examples and educational material",
        text: "Examples and sample articles illustrate approaches rather than completed client engagements unless expressly described otherwise. Educational content needs to be evaluated against your own systems, licensing, security requirements and business rules before implementation. You remain responsible for obtaining appropriate technical, legal or other professional advice where needed. No website example should be treated as a guarantee of performance, savings or regulatory compliance.",
      },
      {
        title: "External services",
        text: "The website may link to Calendly, Microsoft documentation and other third-party websites. External services operate under their own terms and policies. HashTurn does not control their availability, content or subsequent changes. Following a link or using a third-party service is your choice; assess the service before supplying confidential information or relying on it for business operations.",
      },
      {
        title: "Availability and limitations",
        text: "We may update, suspend or remove website content or functionality. Although we aim to provide useful information, the website is provided on an as-available basis without a promise that it will always be uninterrupted, error-free or suitable for every purpose. To the extent permitted by applicable law, HashTurn is not responsible for loss arising solely from reliance on general website information or from interruptions to website access. Nothing in these terms excludes a right, liability or protection that cannot lawfully be excluded.",
      },
      {
        title: "Privacy, questions and disputes",
        text: "Our Privacy Policy and Cookie Policy describe how information and browser storage are handled. For questions about these terms or a concern about the website, contact HashTurn through the Contact page and explain the issue. We encourage an initial discussion to resolve concerns. The law and dispute arrangements for a paid engagement should be stated in its separate contract. Mandatory legal rights and any court jurisdiction established by applicable law remain unaffected.",
      },
      {
        title: "Changes to these terms",
        text: "We may revise these terms to reflect changes to the website, services or legal requirements. Updated terms will be posted on this page with a revised date. Changes to website terms do not automatically amend an existing signed project agreement. Review the current terms when you return to the website.",
      },
    ],
  },
  "cookie-policy": {
    excerpt:
      "How the HashTurn website uses essential session cookies, local storage and optional analytics, and how to change your browser preferences.",
    sections: [
      {
        title: "Cookies and browser storage",
        text: "Cookies are small values stored by your browser and sent with relevant website requests. Local storage is a separate browser feature that can remember a preference on your device. This policy covers both technologies as used by powerautomatedeveloper.com. Their purpose and duration depend on the feature using them. Last updated: 14 September 2026.",
      },
      {
        title: "Essential administrator session cookie",
        text: "The hashturn_session cookie supports authenticated administrator access. It identifies a session rather than storing the administrator's password. The application sets an eight-hour maximum lifetime and ends the session when the administrator signs out. On a production deployment, the cookie uses Secure, HttpOnly and SameSite protections. Ordinary visitors do not need an administrator account to browse services or submit an enquiry. Disabling this cookie prevents normal administrator sign-in.",
      },
      {
        title: "Analytics preference in local storage",
        text: "The hashturn-analytics local-storage entry records whether you chose to allow optional analytics. Its value is yes or no. Unlike a session cookie, this preference has no expiry set by the application and remains until changed or removed from the browser. Clearing site data or using another browser or device can cause you to be asked again.",
      },
      {
        title: "Optional Google Analytics",
        text: "Google Analytics is optional and depends on a measurement ID being configured for the website. The analytics script is not loaded until the stored preference allows it. When active, analytics may use cookies with names beginning _ga to distinguish browser interactions and measure usage. Their duration and operation depend on Google's service and the configured property settings; a fixed expiry is not set by this application's code. The website tracks business interactions such as consultation clicks, hiring clicks and successful enquiry submissions, without sending enquiry-form fields as event parameters.",
      },
      {
        title: "Allowing or declining analytics",
        text: "Use Analytics preferences in the footer to review your choice. Essential only declines optional analytics, and Allow analytics enables it where available. Changing your choice reloads the page. Declining analytics stops subsequent analytics loading through this application and attempts to remove accessible _ga cookies for the website. You can also delete site cookies and storage through your browser settings. Withdrawing a choice does not undo information already processed before the change.",
      },
      {
        title: "Consultation bookings and other websites",
        text: "The website links to Calendly for consultation bookings; it does not embed a Calendly booking widget. Visiting Calendly opens that provider's website, which may use its own cookies or storage under its own policies. The same distinction applies to other external links. Your HashTurn analytics preference does not control a separate website's settings.",
      },
      {
        title: "Browser controls and further information",
        text: "Most browsers let you inspect or delete cookies and site storage and restrict future storage. Some settings can affect sign-in or preference persistence. Browser privacy features may also block analytics even after you allow it. For information about the associated handling of personal information, see the Privacy Policy. Contact HashTurn through the Contact page with questions about this policy. The policy will be updated when relevant website functionality changes.",
      },
    ],
  },
  services: {
    excerpt:
      "Automation development, business apps and system integrations, scoped around the work your team needs to improve.",
    sections: [
      {
        title: "Start with the outcome you need",
        text: "A service name is a starting point, not a project specification. You may need faster approvals, fewer repeated updates, a more reliable reporting process or better visibility into outstanding work. Describe the process and the systems involved, and we can help identify whether a workflow, application, integration or combination is appropriate.",
      },
      {
        title: "From individual flows to connected solutions",
        text: "A focused engagement might address a single Power Automate flow or an Excel reporting task. A broader solution can bring together Power Apps for data entry, Dataverse or SharePoint for structured information, and integrations with existing business systems. The design should account for permissions, exceptions, operational ownership and support as well as the normal path through the process.",
      },
      {
        title: "Assessment, delivery and ongoing care",
        text: "We can discuss a new build, improvements to an existing solution or a scoped maintenance arrangement. Work starts with discovery and an agreed scope. Review points allow your team to assess progress, while testing and handover prepare the solution for everyday use. Licensing, access, third-party dependencies and support expectations are confirmed during scoping.",
      },
    ],
  },
  hire: {
    excerpt:
      "Find the right engagement for your automation work: a hands-on developer, a dedicated specialist, a coordinated team or a consultant.",
    sections: [
      {
        title: "Choose a model that fits the decision ahead",
        text: "Hire a developer when you have a defined workflow or integration to implement. Consider consulting when you need to assess feasibility, understand existing problems or choose an architecture. A dedicated engagement can suit an evolving backlog, while a coordinated team can support work spanning applications, data and multiple systems.",
      },
      {
        title: "Know how the work will be managed",
        text: "Before work starts, agree the point of contact, priorities, review schedule and collaboration tools. Access to environments, responsibilities for testing and the process for approving changes should be explicit. Working-hour overlap and availability are discussed during scoping rather than assumed from a website profile.",
      },
      {
        title: "Prepare for the first conversation",
        text: "Bring a short description of the process, the systems you use and the outcome you want. An anonymized example of an input and expected output is often useful. Include any delivery constraints or existing development standards. We can then discuss the relevant skills, delivery approach and a practical next step.",
      },
    ],
  },
  industries: {
    excerpt:
      "Explore workflow opportunities in mortgage, real estate, healthcare, finance and operations, with attention to each process's people, data and constraints.",
    sections: [
      {
        title: "The same tools, different operating realities",
        text: "Document collection, approvals, reporting and system updates appear in many industries, but the rules around them differ. The right design depends on who owns each decision, what information can be accessed and how exceptions must be handled. Our industry pages describe possible use cases to discuss, rather than asserting completed projects or guaranteed results.",
      },
      {
        title: "Keep business rules and human decisions visible",
        text: "A workflow should make responsibilities clearer. Identify which steps can be automated, which require a person and when a request must be escalated. In processes involving sensitive information, access controls, retention requirements and approved environments belong in the design from the start. Your organisation's policy owners should confirm the applicable requirements.",
      },
      {
        title: "Scope around a real process",
        text: "Choose one process that has a clear owner and a measurable definition of completion. Map the current handoffs, document types and connected systems. Agree realistic test scenarios, including missing information and delayed responses, before expanding to related processes. This gives the team a reviewable basis for implementation.",
      },
    ],
  },
  developers: {
    excerpt:
      "Meet the people behind HashTurn's automation work and explore the skills relevant to your next workflow, application or integration.",
    sections: [
      {
        title: "Expertise matched to the work",
        text: "A reliable business solution often needs more than one skill. Workflow development, application design, data modelling and API integration may all contribute to the same process. Developer profiles introduce individual expertise; the proposed project scope determines the responsibilities and team composition.",
      },
      {
        title: "A clear relationship from the start",
        text: "Discuss who will handle day-to-day communication, how progress will be reviewed and what your internal team needs to provide. Agree how changes are prioritised and how testing, documentation and handover will be handled. A named specialist and an explicit delivery process help both teams understand what is expected.",
      },
      {
        title: "Discuss the right fit",
        text: "Use the hiring pages to compare engagement models, then share the work you have in mind. We will discuss relevant capabilities and confirm availability before making a commitment. You do not need to choose a particular individual before starting a conversation about your requirements.",
      },
    ],
  },
  blog: {
    excerpt:
      "Practical perspectives on planning, building and maintaining business automation, from process discovery to connected systems.",
    sections: [
      {
        title: "Ideas to bring into your next project",
        text: "Use this collection to explore the questions behind an automation decision: what should trigger a workflow, which system owns a record, how exceptions should be handled and who will maintain the result. Articles are a starting point for discussion and should be evaluated against your own environment.",
      },
      {
        title: "Read examples in context",
        text: "An example describes an approach, not a promise of identical results in every organisation. Licensing, permissions, data quality and third-party capabilities can change the implementation. Articles marked Sample article are illustrative preview content. Client outcomes, where published separately, must be supported by verified project information.",
      },
    ],
  },
  resources: {
    excerpt:
      "Resources for making better automation decisions: planning guidance, Power Platform considerations and practical questions for your development team.",
    sections: [
      {
        title: "Find your starting point",
        text: "Start with business automation guidance if the process itself needs clarification. Use the Power Automate collection when you are considering cloud flows, desktop tasks or an existing implementation. The blog offers shorter perspectives on recurring planning and delivery questions. Together, these collections help turn a broad idea into a useful development conversation.",
      },
      {
        title: "Apply guidance to your environment",
        text: "Every workflow sits within a particular business context. Confirm your data sources, permissions, licensing and governance expectations before applying an example. Use anonymized inputs and a suitable test environment to assess whether a proposed approach handles ordinary requests and exceptions.",
      },
      {
        title: "Bring the questions you cannot answer yet",
        text: "You do not need a complete specification to ask for help. A process outline, a list of systems and a clear description of the problem are enough to begin discovery. If a resource raises a question about architecture, reliability or support, share that question with the team so it can be addressed in context.",
      },
    ],
  },
  "resources/guides": {
    excerpt:
      "A practical planning framework for taking an automation idea from discovery through testing, handover and ongoing operation.",
    sections: [
      {
        title: "1. Understand the current process",
        text: "Write down the event that starts the work, the information required and the result that marks completion. Include people, systems and handoffs. Ask the people doing the task to explain common delays and exceptions; these details often matter more than the ideal process diagram.",
      },
      {
        title: "2. Define the first useful release",
        text: "Choose an initial scope that can be reviewed with real users. Identify what is included, what remains manual and what is deferred. Agree responsibilities for access, sample data and acceptance. A clear boundary makes estimates and change discussions more useful.",
      },
      {
        title: "3. Test beyond the successful path",
        text: "Include missing fields, duplicate inputs, rejected requests and temporary service failures in the test plan. Check what a user sees and what an administrator can do to resolve the problem. Use anonymized or approved test information rather than copying sensitive production records without permission.",
      },
      {
        title: "4. Plan ownership after launch",
        text: "Identify the process owner, technical contact and support route. Document the purpose of the solution, the systems it depends on and the changes that require a review. Agree how the team will observe failures, manage access changes and decide whether the next improvement is worthwhile.",
      },
    ],
  },
  "resources/power-automate-guides": {
    excerpt:
      "Planning considerations for Power Automate projects: triggers, connected systems, exception handling, testing and operational ownership.",
    sections: [
      {
        title: "Define the event and expected result",
        text: "Start with what should initiate the work and what a completed run should accomplish. Explain which records or documents are involved and how they should be matched. Decide whether a repeat request should create another action or be recognised as work already handled.",
      },
      {
        title: "Confirm system access and dependencies",
        text: "List the systems a proposed flow will use and ask their owners to confirm the permitted access method. Review the required connectors, licensing and environment policies against the current Microsoft documentation and your tenant configuration. Keep credentials out of planning documents and ordinary enquiry messages.",
      },
      {
        title: "Give exceptions an owner",
        text: "A missing approver, unavailable system or incomplete record needs a deliberate outcome. Decide which conditions should be retried, which should stop for review and who should be notified. A flow that fails visibly with useful context can be easier to support than one that silently leaves work incomplete.",
      },
      {
        title: "Prepare for maintenance",
        text: "Agree how development and testing will be separated from everyday operations. Document connection ownership, business rules and dependencies. Before launch, test the representative scenarios with the process owner and confirm the route for future changes. The appropriate implementation depends on the specific environment and scope.",
      },
    ],
  },
  "resources/automation-guides": {
    excerpt:
      "A business-first approach to choosing automation opportunities, defining success and preparing teams for a changed process.",
    sections: [
      {
        title: "Choose a process with a clear owner",
        text: "A repeated task is a useful candidate when its inputs, decisions and completion conditions can be explained. Ask who owns the outcome and who can confirm the business rules. If the process changes daily or depends on undocumented judgment, discovery may be more valuable than immediate development.",
      },
      {
        title: "Record the current baseline",
        text: "Describe how work is handled today: the steps, people involved, delays and common corrections. If you measure time or error rates, record how the measurement was obtained. Set a project-specific success criterion instead of borrowing a promised saving from an unrelated example.",
      },
      {
        title: "Make the new way of working understandable",
        text: "An automation changes responsibilities as well as software. Explain what users still need to do, where they can see progress and how to request help. Bring process owners into testing so the solution can be evaluated against actual working practices.",
      },
      {
        title: "Improve in reviewable stages",
        text: "After an initial release, review the agreed outcomes and the exceptions encountered. Changes should follow a prioritised backlog and an understood approval process. Expand the scope when ownership, support and the underlying business rules are sufficiently clear.",
      },
    ],
  },
  "case-studies": {
    excerpt:
      "Understand how to evaluate an automation project: the business problem, implementation choices, handover and evidence behind the outcome.",
    sections: [
      {
        title: "Look beyond a polished workflow diagram",
        text: "A useful case study explains the problem before describing the technology. Look for the original process, the constraints that shaped the solution and the responsibilities of the people using it. An implementation can be technically interesting without being appropriate for a different organisation's needs.",
      },
      {
        title: "What a complete project account should cover",
        text: "Project accounts should distinguish the work delivered from future ideas. They should describe the systems involved, important exceptions, testing and handover. Where an outcome is quantified, its measurement period and basis should be clear. Client identities or screenshots should only be shared with appropriate permission.",
      },
      {
        title: "Illustrative scenario: document approval",
        text: "Consider a business that receives documents through several channels and needs a consistent review process. An initial scope might define a shared intake point, required information, routing rules and a review queue for incomplete submissions. Testing would include duplicate files, absent reviewers and rejected requests. This is an illustrative planning scenario, not a claim about a completed HashTurn client engagement.",
      },
      {
        title: "Discuss evidence relevant to your process",
        text: "Share the type of workflow, the systems involved and the constraints you face. We can discuss a proposed approach and what information would be useful to evaluate it. Verified, shareable project accounts belong in this collection; confidential client details and unsupported results do not.",
      },
    ],
  },
};
