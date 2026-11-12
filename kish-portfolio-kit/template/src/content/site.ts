// Single source of truth for site copy. Placeholders stay visible until Kish replaces them.

export const site = {
  name: "Kishore Sudhir",
  shortName: "Kish",
  timezone: "Australia/Melbourne",
  hero: {
    lines: ["Data and AI work", "that {holds up} in production"], // {} = accent word
    note: "[Placeholder: confirm headline]",
    status: {
      title: "Open to work now",
      text: "Data engineering, AI adoption and automation roles. Anywhere in Australia, or remote.",
    },
  },
  areas: ["AI Adoption", "Automation", "Data Analytics", "Data Engineering", "Dashboards", "Statistical Analytics"],
  interests: ["Sport Analytics", "Is AI Truly Intelligent?", "Conscious AI", "Operations Improvement"],
  statement: "It starts with an idea. Then a question: what are we solving for? It's the most important thing!",
  stat: {
    beforeLabel: "Time to send a quote, before",
    before: "6 to 7 weeks",
    afterLabel: "After",
    after: "Same day.",
    body: [
      "A quoting process that took 6 to 7 weeks now finishes the same day. I automated it with AI.",
      "Do you have a process that takes this long?",
    ],
    cta: { label: "Book free consultation", href: "#contact" },
  },
  projects: [
    {
      no: "01",
      img: "/assets/project-quote.png",
      title: "Quote automation",
      summary: "Quotes that took 6 to 7 weeks now go out the same day.",
      tags: ["LlamaIndex", "OpenAI", "Azure"],
    },
    {
      no: "02",
      img: "/assets/project-migrate.png",
      title: "Legacy migration to Databricks",
      summary: "Freelance data engineering on a move from a legacy system to Databricks and Delta Lake.",
      tags: ["Databricks", "Delta Lake", "Reconciliation", "Model mapping"],
    },
    {
      no: "03",
      img: "/assets/project-market.png",
      title: "Market analytics",
      summary:
        "A gourmet business wanted to launch a new product in the Australian market. I did the market research and statistical analysis.",
      tags: ["Market research", "Statistical analysis", "Monte Carlo simulation"],
    },
    {
      no: "04",
      img: "/assets/project-webapp.png",
      title: "AI web app development",
      summary:
        "Built an AI module into a client's system that makes onboarding customers from other platforms easier. A migration now takes under 60 seconds.",
      tags: ["TypeScript web app", "Next.js", "GraphQL", "MCP", "OpenAI", "Web scraping"],
    },
    {
      no: "05",
      img: "/assets/project-chain.png",
      title: "Blockchain-based health records",
      summary: "An IEEE paper on using a blockchain to store health records.",
      tags: ["IEEE paper", "Research", "Ethereum"],
      link: "https://doi.org/10.1109/ICSSS54381.2022.9782228",
    },
  ],
  about: {
    bio: [
      `I'm Kish, a Data Scientist and AI Engineer in Melbourne. I'm the person who asks "but why?" one too many times. I like problems that are messy, a little unclear, and worth figuring out properly.`,
      "Right now I'm open to new roles, collaborations and side projects. If you're working on something in sport analytics, AI research or improving how things run, I'm happy to volunteer my time. Let's talk.",
    ],
    facts: [
      { label: "Experience", value: "3+ years", suffix: "in industry", big: true },
      { label: "Based in", value: "Melbourne" },
      { label: "Study", value: "Master of Data Science, RMIT University" },
      { label: "Background", value: "Computer science, Anna University" },
    ],
  },
  // [name, abbreviation, simple-icons slug ('' = none), ring]
  skills: [
    ["Python", "Py", "python", 0], ["SQL", "SQL", "", 0], ["Claude", "Cl", "claude", 0],
    ["MCP", "MCP", "modelcontextprotocol", 0], ["Git", "Git", "git", 0],
    ["LlamaIndex", "LI", "", 1], ["LangChain", "LC", "langchain", 1], ["Power BI", "BI", "powerbi", 1],
    ["PyTorch", "PT", "pytorch", 1], ["Jupyter", "Ju", "jupyter", 1], ["Azure", "Az", "microsoftazure", 1],
    ["AWS", "AWS", "amazonaws", 1], ["Power Automate", "PA", "powerautomate", 1],
  ] as const,
  goals: [
    { no: "01", title: "Sport analytics", text: "[Placeholder: which sport, and the question you want to answer]" },
    { no: "02", title: "Is AI truly intelligent?", text: "Research into whether AI is truly intelligent. [Placeholder: the angle you want to take]" },
    { no: "03", title: "Conscious AI", text: "[Placeholder: what draws you to this]" },
    { no: "04", title: "Operations improvement", text: "[Placeholder: the kind of operations work you want to do]" },
  ],
  contact: {
    heading: "Want to work on something {together?}",
    links: [
      { label: "LinkedIn", href: "#" }, // [Placeholder: LinkedIn URL]
      { label: "Email", href: "#" }, // [Placeholder: mailto]
    ],
    footer: [
      { label: "[Placeholder: email]", href: "#" },
      { label: "[Placeholder: LinkedIn]", href: "#" },
      { label: "[Placeholder: GitHub]", href: "#" },
      { label: "Blog", href: "#" },
      { label: "AI slop", href: "#" },
    ],
  },
} as const;
