const form = document.getElementById("intake-form");
const payloadPreview = document.getElementById("payload-preview");
const promptPreview = document.getElementById("prompt-preview");
const downloadSummaryButton = document.getElementById("download-summary");
const liveOutput = document.getElementById("live-output");
let latestSummaryDocument = "";

function fileNames(files) {
  return Array.from(files || []).map((file) => file.name);
}

function buildPayload() {
  const assets = document.getElementById("assets").files;
  const names = fileNames(assets);
  const primaryAsset =
    names.find((name) => name === "2026-fleetio-benchmarking-report.pdf") ||
    "2026-fleetio-benchmarking-report.pdf";

  return {
    primary_asset: primaryAsset,
    assets: names,
    target_audience: {
      segment: document.getElementById("segment").value,
      industry: document.getElementById("industry").value,
      role_title: document.getElementById("role_title").value,
      revenue_range: document.getElementById("revenue_range").value,
      employee_size: document.getElementById("employee_size").value
    },
    campaign_inputs: {
      awareness_stage: document.getElementById("awareness_stage").value,
      desired_action: document.getElementById("desired_action").value.trim(),
      brand_voice_notes: document.getElementById("brand_voice_notes").value.trim(),
      campaign_context: document.getElementById("campaign_context").value.trim()
    },
    requested_outputs: {
      executive_summary: {
        count: 1,
        word_target: "500-600",
        require_source_references: true
      },
      emails: {
        count: 5,
        audience_personalized: true,
        body_word_target: "150-250"
      },
      linkedin_messages: {
        count: 3,
        type: "outreach_message",
        require_visual_recommendation: true
      }
    }
  };
}

function buildPrompt(payload) {
  const assetLine = payload.assets.length
    ? payload.assets.join(", ")
    : "[no assets uploaded yet]";

  return [
    "You are Campaign Architect, a B2B content repurposing agent.",
    "",
    "Use the primary asset as the main source of truth.",
    "Treat any other uploaded assets as supporting context only.",
    "Do not introduce external data or unsupported claims.",
    "If a claim is weak or cannot be grounded in the source material, flag it explicitly.",
    "",
    "Inputs",
    `- Primary asset: ${payload.primary_asset}`,
    `- Assets: ${assetLine}`,
    `- Segment: ${payload.target_audience.segment}`,
    `- Industry: ${payload.target_audience.industry}`,
    `- Role/Title: ${payload.target_audience.role_title}`,
    `- Revenue: ${payload.target_audience.revenue_range}`,
    `- Employee size: ${payload.target_audience.employee_size}`,
    `- Awareness stage: ${payload.campaign_inputs.awareness_stage}`,
    `- Desired action: ${payload.campaign_inputs.desired_action}`,
    `- Brand voice notes: ${payload.campaign_inputs.brand_voice_notes}`,
    `- Campaign context: ${payload.campaign_inputs.campaign_context}`,
    "",
    "Workflow",
    "1. Extract thesis, support, data points, quotable moments, jargon, and source gaps.",
    "2. Translate the source material for the selected audience.",
    "3. Return valid JSON matching the schema in campaign-agent.schema.json.",
    "",
    "Required outputs",
    "- 1 executive summary, 500-600 words, written for the selected audience, with source references.",
    "- 5 personalized emails with subject lines, preview text, body copy, CTA, timing, and personalization markers.",
    "- 3 LinkedIn outreach messages with visual recommendations, visual specs, CTA, and rationale.",
    "",
    "Visual recommendation requirements",
    "- Recommend one format per LinkedIn message: single_image, carousel, document_snippet, chart, or quote_card.",
    "- State what the visual should show, why it supports the message, suggested specs, and whether design support is required."
  ].join("\n");
}

function buildSummaryDownload(payload) {
  const role = payload.target_audience.role_title;
  const industry = payload.target_audience.industry;
  const action = payload.campaign_inputs.desired_action;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Fleetio Executive Summary</title>
  <style>
    @page { size: letter; margin: 0.5in; }
    body { font-family: Georgia, "Times New Roman", serif; color: #1c1814; margin: 0; }
    .page { width: 7.5in; min-height: 10in; margin: 0 auto; }
    h1 { font-size: 22px; line-height: 1.1; margin: 0 0 14px; }
    p { font-size: 12.5px; line-height: 1.42; margin: 0 0 10px; }
    .takeaway { margin: 0 0 10px; }
    .cta { margin-top: 14px; padding-top: 10px; border-top: 1px solid #c8b9a7; font-weight: bold; }
  </style>
</head>
<body>
  <main class="page">
    <h1>Fleet performance is being squeezed by cost, coordination, and manual work</h1>
    <p>For ${role}s in ${industry}, the Fleetio benchmark shows that the core issue is not a single broken function. It is compounded operating drag. Fleetio’s report combines survey input from more than 600 verified fleet professionals with aggregated benchmark data across more than 1 million vehicles, 17.49B miles, and $7B in service spend, making it a useful planning lens rather than a narrow point-in-time opinion [Fleetio 2026, Methodology].</p>
    <p class="takeaway"><strong>Pressure is stacking across the operating model.</strong> Rising costs were the top concern for 54.4% of respondents, followed by regulations and emissions mandates at 46.1%, EV transition and infrastructure at 35.1%, technician shortages at 32.5%, and parts and vehicle availability at 28.9% [The Squeeze, p.9]. The implication is that performance pressure is showing up in cost, compliance, staffing, and turnaround at the same time.</p>
    <p class="takeaway"><strong>Most fleets are operating in the maintenance middle.</strong> 44.3% of respondents say they do a decent job but still have room for improvement, while 48.0% say their maintenance mix is half scheduled and half unscheduled [The Maintenance Middle, pp.10-11]. That suggests many teams know what good looks like, but process consistency is still weak enough to create ongoing leakage.</p>
    <p class="takeaway"><strong>Execution bottlenecks are driven by coordination, not ignorance.</strong> Fleetio frames missed performance less as a knowledge problem and more as a timing, communication, and visibility problem [The Coordination Bottleneck, p.13]. That matters for leaders because operational improvement may come faster from workflow discipline than from adding another reporting layer.</p>
    <p class="takeaway"><strong>Manual admin work is still a major drag on performance.</strong> 79.3% of fleet managers say they enter fleet data themselves, and a meaningful share spend 4-8 hours or more each week on manual entry [Modern Tools, Manual Reality, pp.15-17]. High software adoption has not eliminated the admin burden, which means data quality and decision speed are still exposed to human bottlenecks.</p>
    <p class="takeaway"><strong>Near-term AI value is in low-risk support, not autonomous decision-making.</strong> 35.1% of fleets are researching AI, 18.2% are piloting it, and only 5.6% say they use it broadly. Just 1.5% completely trust AI recommendations without human review [AI Wanted, Not Trusted, pp.20-21]. The near-term opportunity is practical automation and tighter visibility, not fully delegated operational judgment.</p>
    <p>The strongest strategic use of this benchmark is to identify one or two operating levers for the next 90 days: reactive maintenance mix, coordination delays, manual data entry, or hybrid vendor complexity. Fleetio’s own guidance is to choose measurable progress over broad transformation claims [How to Use This Report].</p>
    <p class="cta">CTA: Use the Fleetio benchmark to isolate the biggest operational leak, then ${action.toLowerCase()} around that specific gap.</p>
  </main>
</body>
</html>`;
}

function buildLiveOutput(payload) {
  const role = payload.target_audience.role_title;
  const industry = payload.target_audience.industry;
  const segment = payload.target_audience.segment;
  const action = payload.campaign_inputs.desired_action;

  const execSummary = `
    <section class="output-section">
      <span class="eyebrow-label">Executive Summary</span>
      <h3>Fleet performance is being squeezed by cost, coordination, and manual work</h3>
      <p>For ${role}s in ${industry}, the Fleetio benchmark makes one point clearly: most fleet teams are not collapsing, but they are operating with enough friction to erode uptime, planning accuracy, and confidence. The report combines survey input from more than 600 verified fleet professionals with aggregated platform data across more than 1 million vehicles, 17.49B miles, and $7B in service spend, which gives this benchmark enough scale to be useful as an operating lens rather than a one-off opinion [Fleetio 2026, Methodology].</p>
      <p>The strongest signal is not dramatic failure. It is persistent operational drag. Rising costs were the top concern for 54.4% of respondents, followed by regulations and emissions mandates at 46.1%, EV transition and infrastructure at 35.1%, technician shortages at 32.5%, and parts and vehicle availability at 28.9% [The Squeeze, p.9]. That matters because the pressure is not isolated to one function. It shows up in compliance, staffing, replacement cycles, and day-to-day turnaround time.</p>
      <p>Maintenance performance also clusters in the middle. 44.3% of respondents say they do a decent job but still have room for improvement, while 48.0% say their service environment is half scheduled and half unscheduled [The Maintenance Middle, pp.10-11]. In practice, that means many teams are not dealing with a strategy problem. They are dealing with execution instability. The report reinforces this in the coordination section, where missed performance is tied less to knowledge gaps and more to communication, timing, and visibility bottlenecks [The Coordination Bottleneck, p.13].</p>
      <p>The data on operating systems is equally useful for leaders trying to decide where to focus next. Software adoption may be high, but manual process still dominates. 79.3% of fleet managers say they enter fleet data themselves, and weekly manual entry time remains meaningful across the sample, including 21.3% reporting 4-8 hours and 13.8% reporting 16+ hours per week [Modern Tools, Manual Reality, pp.15-17]. That signals a process maturity gap, not just a tooling gap.</p>
      <p>AI interest exists, but trust has not caught up. 35.1% of fleets are researching AI, 18.2% are piloting it, and only 5.6% say they are using it broadly. Just 1.5% completely trust AI recommendations without review [AI Wanted, Not Trusted, pp.20-21]. For ${segment} operators, the implication is straightforward: the near-term win is not autonomous decision-making. It is low-risk automation, tighter data discipline, and clearer operational visibility.</p>
      <p>If you are using this report as a planning tool, the takeaway is to target the leaks that compound across the operating model: reactive work, slow coordination, fragmented data capture, and hybrid vendor complexity. Fleetio’s own guidance is practical here: choose one or two levers for the next 90 days instead of treating transformation as a broad platform project [How to Use This Report].</p>
      <p><strong>CTA:</strong> Use the Fleetio benchmark to identify the one process bottleneck most likely to improve uptime, then ${action.toLowerCase()} around that specific operational gap.</p>
    </section>
  `;

  const linkedinMessages = [
    {
      title: "LinkedIn Message 1",
      angle: "Pain-led",
      copy: `{{first_name}}, I was reviewing Fleetio’s 2026 benchmark and one stat stood out: 54.4% of fleet teams say rising costs are their top pressure point. What was more interesting is that the report doesn’t frame the problem as cost alone. It shows cost pressure stacked on top of compliance, staffing, and coordination friction.\n\nIf your team is feeling that same squeeze, I can send over a one-page version with the key operating patterns called out.`,
      visual: "Quote card featuring the 'cost, compliance and capacity, all at once' framing plus the top concern percentages.",
      specs: "Single image, 1080x1080, warm neutral background, one headline stat, three supporting concern bars.",
      why: "This works as an opener because it leads with an external benchmark rather than a product pitch and gives the recipient a reason to compare their reality to the market.",
      cta: "Offer the one-page summary."
    },
    {
      title: "LinkedIn Message 2",
      angle: "Insight-led",
      copy: `{{first_name}}, another useful data point from the Fleetio benchmark: 48.0% of respondents say maintenance is half scheduled and half unscheduled, and 44.3% say they are doing a decent job but still have room for improvement.\n\nThat middle ground is probably the most expensive place to operate. Nothing looks broken enough to force change, but the process is still leaking time.\n\nIf helpful, I can share a short breakdown of where Fleetio says those leaks usually show up.`,
      visual: "Simple benchmark chart showing the 'maintenance middle' and the scheduled vs. unscheduled split.",
      specs: "Chart visual, 1200x627, horizontal orientation for sharing in DM or email follow-up.",
      why: "This message works because it turns benchmark data into a sharper business insight: the real cost sits in tolerated inconsistency.",
      cta: "Ask if they want the short breakdown."
    },
    {
      title: "LinkedIn Message 3",
      angle: "Outcome-led",
      copy: `{{first_name}}, the Fleetio report makes a strong case that the next operational gains are less about adding more tools and more about reducing manual drag. 79.3% of fleet managers still enter fleet data themselves, and a meaningful share spend 4-8 hours or more each week on manual entry.\n\nIf ${payload.target_audience.employee_size} employee teams in ${industry} are trying to improve uptime without adding admin burden, this is probably the section worth looking at first.\n\nOpen to a quick exchange on how your team is handling that tradeoff today?`,
      visual: "Carousel with three panels: manual entry burden, coordination bottlenecks, and 90-day improvement levers.",
      specs: "Carousel, 1080x1350 per panel, built from Fleetio report excerpts and simple iconography.",
      why: "This closer works because it reframes the report as a planning aid and moves toward a conversation without forcing a hard sell.",
      cta: "Invite a quick exchange."
    }
  ];

  const emails = [
    {
      label: "Email 1 of 5",
      purpose: "Hook",
      subject: "The fleet ops data point I’d put in front of {{company}}",
      preview: "Fleetio’s latest benchmark shows where the squeeze is showing up first.",
      body: `{{first_name}},\n\nI’ve been reviewing Fleetio’s 2026 benchmark report and one pattern is hard to ignore: the pressure on fleet teams is stacking, not shifting. Rising costs led the concern list, but they sit next to compliance pressure, infrastructure questions, technician shortages, and parts availability.\n\nThat combination matters because it creates drag even when the operation looks stable from the outside. The report’s framing is blunt: many fleets are doing okay, but still paying a steady tax in reactive work, coordination delays, and admin overhead.\n\nIf you’re looking at this from a ${role} seat, that’s useful because it turns a general “efficiency” conversation into a more specific operating question: where is the friction compounding fastest inside {{company}} today?\n\nI put together a short summary of the benchmark sections most relevant to ${industry} teams. Happy to send it over if that would be useful.`,
      cta: `Reply with "send it" and I’ll share the summary.`,
      timing: "Send immediately after connection or first touch.",
      visual: "Attach a one-page benchmark snapshot with the top five pressure categories highlighted.",
      specs: "Letter-sized PDF or PNG preview, clean white background, one bar chart plus one pull quote."
    },
    {
      label: "Email 2 of 5",
      purpose: "Problem",
      subject: "Why fleets get stuck in the middle",
      preview: "The expensive issue usually isn’t failure. It’s tolerated inconsistency.",
      body: `{{first_name}},\n\nOne of the better sections in the Fleetio benchmark focuses on what they call the maintenance middle.\n\n44.3% of respondents say they do a decent job on maintenance but still have room for improvement. Another 48.0% say their work is split roughly half scheduled and half unscheduled.\n\nThat is a useful warning sign. It usually means the team knows what good looks like, but execution keeps drifting because scheduling, communication, and follow-through aren’t consistent enough.\n\nThat kind of environment rarely creates one obvious fire. Instead, it creates a constant flow of smaller misses that pull time out of planning, service coordination, and reporting.\n\nIf that sounds familiar at {{company}}, the benchmark is worth reading less as an industry snapshot and more as a way to isolate which leak is costing you the most right now.`,
      cta: "Want the 3 sections I’d prioritize first?",
      timing: "Send 3 days after Email 1.",
      visual: "Inline chart showing the maintenance-middle split between decent, good, and great performance.",
      specs: "1200x627 chart image, three bars, muted palette, one callout on the 44.3% midpoint."
    },
    {
      label: "Email 3 of 5",
      purpose: "Insight",
      subject: "The manual work problem hiding inside fleet software",
      preview: "High software adoption does not mean low admin burden.",
      body: `{{first_name}},\n\nA stat from Fleetio’s report that deserves more attention: 79.3% of fleet managers say they enter fleet data themselves.\n\nThat explains a lot.\n\nThe benchmark’s point is not that fleets lack systems. It is that many modern operations still run on software plus spreadsheets plus paper, which keeps the admin load high and weakens the quality of the data teams rely on.\n\nOnce that happens, even good people end up making decisions off incomplete visibility. Work takes longer to coordinate. Exceptions pile up. Reporting becomes something the team has to catch up on instead of something they can trust in real time.\n\nFor teams trying to improve uptime or control service spend, reducing manual drag may be the highest-leverage move before any larger transformation project.`,
      cta: `If helpful, I can send a one-page breakdown of the manual-work findings and the 90-day levers Fleetio suggests.`,
      timing: "Send 4 days after Email 2.",
      visual: "Mini infographic showing manual-entry burden by hours per week.",
      specs: "Narrow infographic, 1080x1350, four data points, simple icons for spreadsheet, paper, and system entry."
    },
    {
      label: "Email 4 of 5",
      purpose: "Proof",
      subject: "What the benchmark says about hybrid maintenance models",
      preview: "Most fleets are not fully in-house or fully outsourced.",
      body: `{{first_name}},\n\nAnother part of the Fleetio report that stands out is the section on outsourcing.\n\n48.9% of fleets say they operate with a mix of in-house and third-party maintenance. That makes sense from a capacity standpoint, but it also raises the coordination burden. Vendor mix, work prioritization, and communication discipline suddenly matter a lot more.\n\nThe report does a good job showing why some teams feel like they are solving one bottleneck while creating another. Outsourcing can relieve pressure, but it also increases process complexity if the underlying workflow is already loose.\n\nThat is why the strongest operators in the report seem to separate themselves less through heroic effort and more through repeatable process and better data discipline.\n\nIf {{company}} is running a hybrid maintenance model, this section is worth a look.`,
      cta: "Should I send over the hybrid-model summary?",
      timing: "Send 5 days after Email 3.",
      visual: "Comparison visual showing in-house, hybrid, and outsourced models with hybrid emphasized.",
      specs: "Single image, 1080x1080, three-column layout, hybrid column highlighted in accent color."
    },
    {
      label: "Email 5 of 5",
      purpose: "Direct Ask",
      subject: "Worth a quick benchmark conversation?",
      preview: "Fleetio’s data gives a practical way to pick the next operating lever.",
      body: `{{first_name}},\n\nLast note from me.\n\nWhat I like about the Fleetio benchmark is that it does not pretend every fleet needs a broad transformation plan. The practical advice is narrower: pick one or two levers for the next 90 days and focus on measurable progress.\n\nGiven what the report shows about cost pressure, coordination bottlenecks, manual entry burden, and mixed scheduled versus unscheduled work, there is usually one issue creating a disproportionate amount of friction.\n\nIf you are open to it, I can walk you through a short benchmark-based view of where teams like {{company}} typically start. Even a 15-minute conversation should be enough to identify whether the biggest opportunity is in maintenance planning, admin reduction, vendor coordination, or data discipline.`,
      cta: `Open to a short call next week to compare notes?`,
      timing: "Send 6 days after Email 4.",
      visual: "Decision slide with four improvement levers: planning, admin reduction, vendor coordination, data discipline.",
      specs: "Presentation-style slide, 1600x900, quadrant layout, built for email attachment or follow-up deck."
    }
  ];

  const linkedinHtml = linkedinMessages
    .map(
      (message) => `
        <div class="message-block">
          <span class="eyebrow-label">${message.title}</span>
          <h4>${message.angle}</h4>
          <p>${message.copy.replace(/\n\n/g, "</p><p>")}</p>
          <p><strong>Visual recommendation:</strong> ${message.visual}</p>
          <p><strong>Visual specs:</strong> ${message.specs}</p>
          <p><strong>CTA:</strong> ${message.cta}</p>
          <p><strong>Why it works:</strong> ${message.why}</p>
        </div>
      `
    )
    .join("");

  const emailHtml = emails
    .map(
      (email) => `
        <div class="email-block">
          <span class="eyebrow-label">${email.label}</span>
          <h4>${email.purpose}</h4>
          <p><strong>Subject:</strong> ${email.subject}</p>
          <p><strong>Preview:</strong> ${email.preview}</p>
          <p>${email.body.replace(/\n\n/g, "</p><p>")}</p>
          <div class="visual-note">
            <p><strong>Graphic recommendation:</strong> ${email.visual}</p>
            <p><strong>Graphic specs:</strong> ${email.specs}</p>
          </div>
          <p><strong>CTA:</strong> ${email.cta}</p>
          <p><strong>Timing:</strong> ${email.timing}</p>
        </div>
      `
    )
    .join("");

  liveOutput.innerHTML = `
    ${execSummary}
    <section class="output-section">
      <span class="eyebrow-label">LinkedIn Messages</span>
      <h3>3 outreach messages with visual recommendations</h3>
      ${linkedinHtml}
    </section>
    <section class="output-section">
      <span class="eyebrow-label">Email Sequence</span>
      <h3>5-email draft grounded in Fleetio benchmark data</h3>
      ${emailHtml}
    </section>
  `;
}

function render() {
  const payload = buildPayload();
  payloadPreview.textContent = JSON.stringify(payload, null, 2);
  promptPreview.textContent = buildPrompt(payload);
  latestSummaryDocument = buildSummaryDownload(payload);
  downloadSummaryButton.disabled = false;
  buildLiveOutput(payload);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
  liveOutput.scrollIntoView({ behavior: "smooth", block: "start" });
});

form.addEventListener("input", render);
form.addEventListener("change", render);

downloadSummaryButton.addEventListener("click", () => {
  if (!latestSummaryDocument) {
    return;
  }

  const blob = new Blob([latestSummaryDocument], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "fleetio-executive-summary.html";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

render();
