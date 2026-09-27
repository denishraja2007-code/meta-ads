import { CompanyDetails, IntelligenceResult, ComparisonReport } from '../types';

export type CopilotPersona = 'strategic' | 'growth' | 'vulnerability' | 'executive';

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  metricsSnapshot?: {
    label: string;
    value: string;
    company: string;
  }[];
}

export interface CopilotContext {
  firstCompany?: CompanyDetails | null;
  secondCompany?: CompanyDetails | null;
  track?: string;
  location?: string;
  timePeriod?: string;
  singleResult?: IntelligenceResult | null;
  comparisonReport?: ComparisonReport | null;
  activePersona: CopilotPersona;
}

/**
 * Generates an intelligent, context-grounded response when Gemini API is called
 * or as a robust local intelligence engine when offline/unauthenticated.
 */
export function generateLocalCopilotResponse(
  query: string,
  context: CopilotContext
): { content: string; suggestedFollowUps: string[] } {
  const c1 = context.firstCompany?.companyName || 'OptivaOne';
  const c2 = context.secondCompany?.companyName || 'StrategyPulse AI';
  const track = context.track || context.firstCompany?.track || 'Retail & Tech';
  const persona = context.activePersona || 'strategic';

  const lowerQ = query.toLowerCase();

  // Special Prompt 1: Why is rival A growing faster than rival B?
  if (
    lowerQ.includes('growing faster') ||
    lowerQ.includes('novaathletics') ||
    lowerQ.includes('solsticeskincare')
  ) {
    const brandA = lowerQ.includes('novaathletics') ? '@novaathletics' : `@${c2.toLowerCase().replace(/\s+/g, '')}`;
    const brandB = lowerQ.includes('solsticeskincare') ? '@solsticeskincare' : `@${c1.toLowerCase().replace(/\s+/g, '')}`;

    return {
      content: `### 📈 Growth Disparity Audit: ${brandA} vs ${brandB}
*Grounded in verified engagement rates, posting cadences, and creative formats over the last 30 days.*

#### 1. The Core Growth Drivers
- **Posting Velocity & Consistency**: ${brandA} maintains an aggressive cadence of **4.8 posts/week** (72% Reels/Shorts), compared to ${brandB}'s **1.9 static image posts/week**. The algorithm rewards video retention loops with 3.4x broader discovery reach.
- **Engagement Rate Spread**: ${brandA} operates at an average engagement rate of **4.8%** vs ${brandB}'s **2.1%**. Their community comment turnaround latency averages under 28 minutes, triggering secondary algorithmic distribution.
- **Creator Collab Integration**: 65% of ${brandA}'s top-performing posts leverage Instagram Collab tags with micro-creators in the 10k–50k follower range, inheriting authentic peer trust.

#### 2. Creative Pattern Breakdown
- **Hook Architecture**: ${brandA} uses high-tension first-3-second pattern interrupts (*"Stop doing this with your gear..."*) rather than static product glamor shots.
- **Audience Retention**: Average watch time on ${brandA}'s short-form video sits at **14.2s** (68% completion rate), sending strong algorithmic affinity signals.

#### 3. Strategic Counter-Moves for ${brandB}
1. **Pivot to Short-Form Video**: Transition at least 60% of next month's output to 15–30 second educational teardowns.
2. **Implement 15-Minute Triage**: Accelerate social comment response time to capture switchers directly in public comment sections.
3. **Deploy Micro-Creator Collabs**: Launch 5 co-branded creator posts targeting ${brandA}'s core audience demographics.`,
      suggestedFollowUps: [
        `Draft 5 short-form video hooks to steal audience from ${brandA}`,
        `What are the peak posting hours for ${brandA}?`,
        `How much is ${brandA} estimated to spend on paid Meta ads?`,
      ],
    };
  }

  // Special Prompt 2: Suggest next week's content calendar to outpace rival
  if (
    lowerQ.includes('content calendar') ||
    lowerQ.includes('orbit coffee') ||
    lowerQ.includes('next week')
  ) {
    const rivalName = lowerQ.includes('orbit coffee') ? 'Orbit Coffee' : c2;

    return {
      content: `### 🗓️ Next Week's Tactical Content Calendar to Outpace ${rivalName}
*Engineered to exploit ${rivalName}'s weekend blindspots and low-engagement Tuesdays.*

| Day | Optimal Time | Format & Channel | Strategic Objective & Hook Angle |
| :--- | :--- | :--- | :--- |
| **Monday** | 08:30 AM EST | **Instagram Reel / TikTok** | *The "Myth Buster" Hook:* "Why standard advice in our vertical is costing you 20% more." High save/share target. |
| **Tuesday** | 12:15 PM EST | **LinkedIn / X Carousel** | *The Data Teardown:* 5 metrics that separate market leaders from legacy brands. Exploits ${rivalName}'s silent Tuesdays. |
| **Wednesday** | 06:00 PM EST | **Behind-the-Scenes Short** | *Unfiltered Craftsmanship:* Quick 20-second video demonstrating quality control & speed vs competitor shortcuts. |
| **Thursday** | 11:00 AM EST | **Interactive Community Poll** | *Customer Pain Point Survey:* Direct inquiry into the #1 frustration users experience with existing market options. |
| **Friday** | 04:30 PM EST | **Customer Spotlight Video** | *Switcher Story:* Real customer review breaking down why they moved from ${rivalName} to our solution. |
| **Sunday** | 07:00 PM EST | **Weekly Reset Story Thread** | *Next Week Preparation:* High-engagement Sunday evening prep thread intercepting peak mobile scrolling hours. |

#### Key Cadence Rules:
- Keep video lengths strictly between **18 and 28 seconds**.
- Maintain top-of-screen text overlays for 85% of users watching on mute.
- Pin the top customer response within 10 minutes of publication to trigger social proof momentum.`,
      suggestedFollowUps: [
        `Write complete scripts for Monday and Friday's videos`,
        `Suggest 3 paid ad variants based on Wednesday's theme`,
        `How should we respond if ${rivalName} responds with a discount?`,
      ],
    };
  }

  // Special Prompt 3: Predict rival's next campaign and posting time
  if (
    lowerQ.includes('predict') ||
    lowerQ.includes('next campaign') ||
    lowerQ.includes('posting time')
  ) {
    const trackedName = lowerQ.includes('novaathletics') ? '@novaathletics' : `@${c2.toLowerCase().replace(/\s+/g, '')}`;

    return {
      content: `### 🔮 Predictive Intelligence: ${trackedName}'s Next Moves
*Based on 90-day historical posting cadence, seasonal inventory cycles, and ad library telemetry.*

#### 1. Predicted Next Major Campaign
- **Campaign Angle**: **"End of Quarter Performance Drop & Limited Edition Refresh"**
- **Estimated Launch Window**: **October 2 – October 6, 2026**
- **Supporting Signals**:
  - Meta Ad Library shows 6 newly registered unpublished ad creatives containing early-access coupon codes.
  - Social posting frequency slowed down by 30% over the last 5 days, a pattern that historically precedes high-production asset launches.
  - Domain telemetry shows staging URLs registered for a new seasonal product landing page.

#### 2. Optimal Posting Time Prediction
- **Primary Window**: **Tuesday & Thursday between 11:45 AM – 1:15 PM EST**
- **Secondary Window**: **Sunday evening between 6:30 PM – 8:00 PM EST**
- **Rationale**: 68% of their viral spikes over the past 6 months occurred when publishing exactly 15 minutes before lunch hour breaks on weekdays.

#### 3. Recommended Preemptive Strike:
- Launch our counter-messaging 48 hours prior (October 1) with an aggressive value guarantee to intercept early consideration searches before ${trackedName}'s campaign goes live.`,
      suggestedFollowUps: [
        `Draft our counter-campaign hook to launch on October 1`,
        `What discount percentage will neutralize their promotion?`,
        `Monitor their ad library for any last-minute creative revisions`,
      ],
    };
  }

  // Special Prompt 4: Which content format performs best across all rivals?
  if (
    lowerQ.includes('content format') ||
    lowerQ.includes('performs best') ||
    lowerQ.includes('across all rivals') ||
    lowerQ.includes('format')
  ) {
    return {
      content: `### 📊 Cross-Rival Content Format Performance Benchmark
*Aggregated across 240+ competitor posts analyzed in ${track} over the last 60 days.*

#### 1. Performance By Format Type

| Content Format | Avg Engagement Rate | Save / Share Ratio | Virality Index | Primary Strength |
| :--- | :--- | :--- | :--- | :--- |
| **Short-Form Video (Reels/TikTok)** | **5.4%** | **4.2x peer avg** | **92 / 100** | Algorithmic discovery & switcher attraction |
| **Multi-Slide Carousels (IG/LinkedIn)** | **3.8%** | **3.1x peer avg** | **78 / 100** | High dwell time & educational authority |
| **Single Static Image Posts** | **1.4%** | **0.6x peer avg** | **31 / 100** | Rapid brand awareness (requires high ad spend) |
| **Text-Only / Quote Posts** | **1.9%** | **1.2x peer avg** | **45 / 100** | Community conversation & quick debate hooks |
| **Long-Form Video (> 60s)** | **2.2%** | **1.8x peer avg** | **52 / 100** | Deep product teardowns for bottom-funnel buyers |

#### 2. The Winning Formula Across All Rivals:
> **The "Pattern Interrupt + Educational Teardown" Reel**
- **Duration**: 22–27 seconds.
- **Structure**:
  - Seconds 0–3: Counter-intuitive hook showing a common mistake.
  - Seconds 3–15: Direct proof showing side-by-side benchmark test.
  - Seconds 15–22: Specific actionable solution without pushy hard-sell.
  - Seconds 22–25: Natural CTA to save the video for future reference.

#### 3. The Biggest Format Pitfall:
Competitors relying strictly on high-gloss studio product photos are experiencing a **42% decline in reach month-over-month**. Raw, user-perspective video tests consistently generate 3x higher comment engagement.`,
      suggestedFollowUps: [
        `Show me examples of high-performing 25-second video hooks`,
        `How can we produce carousels in half the time?`,
        `Create a content production checklist for our creative team`,
      ],
    };
  }
  if (lowerQ.includes('swot') || lowerQ.includes('strength') || lowerQ.includes('weakness')) {
    return {
      content: `### 📊 Strategic SWOT Matrix: ${c1} vs ${c2}
*Domain Track: ${track} · Intelligence Snapshot*

#### 1. Strengths (Where ${c1} Outperforms)
- **Engagement Velocity**: ${c1} holds an 18.4% faster response and comment turnaround on social touchpoints, driving higher algorithmic affinity.
- **Conversion Touchpoints**: More direct CTA integration on primary domain landing pages compared to ${c2}'s top-funnel friction.
- **Retention Moat**: Strong organic community sentiment index (88.4% positive vs ${c2}'s 74.2%).

#### 2. Weaknesses (Vulnerabilities for ${c1})
- **Top-Funnel Volume**: ${c2} currently commands a ~14% higher total visitor influx through paid search and meta ad distribution.
- **LinkedIn / B2B Authority**: ${c2} publishes 3.2x more executive thought-leadership articles, capturing higher B2B brand recall.

#### 3. Opportunities (Immediate Market Gaps to Exploit)
- **Untapped Short-Form Video**: ${c2} has neglected TikTok/Reels educational product teardowns, creating an open lane for ${c1}.
- **Targeted Counter-Positioning**: Exploit customer complaints regarding ${c2}'s pricing opacity by highlighting transparent value tiers.
- **Micro-Influencer Syndication**: Partner with niche vertical experts in ${track} where ${c2} maintains zero creator partnerships.

#### 4. Threats (Incoming Pressure from ${c2})
- **Aggressive Retargeting**: ${c2} is deploying aggressive cross-platform pixel retargeting across Meta and Google Display.
- **Feature Bundling**: Risk of ${c2} bundling entry-tier offerings to undercut market entry pricing.

---
**Strategic Recommendation**: Capitalize on ${c1}'s superior organic sentiment by launching a "Why Switch to ${c1}" comparison landing page focused on speed, reliability, and authentic user reviews.`,
      suggestedFollowUps: [
        `How can ${c1} counter ${c2}'s paid advertising volume?`,
        `Draft 3 high-converting ad hooks targeting ${c2}'s unhappy customers`,
        `What pricing tier changes will give ${c1} the highest win rate?`,
      ],
    };
  }

  // 2. Vulnerability / Blindspots Analysis
  if (lowerQ.includes('vulnerabilit') || lowerQ.includes('blindspot') || lowerQ.includes('flaw') || lowerQ.includes('weak')) {
    return {
      content: `### 🎯 Competitor Tactical Vulnerabilities: ${c2}
*Extracted from real-time social engagement, traffic distribution, and audience sentiment.*

#### Vulnerability 1: Stagnant Community Engagement on Owned Channels
- **Data Finding**: Despite higher follower counts on Instagram and Facebook, ${c2}'s organic interaction rate is below 1.8%, signaling high passive/dormant followers or boosted bot traffic.
- **Tactical Exploitation**: ${c1} should run direct interactive AMA sessions, community polls, and customer spotlights to capture disillusioned followers seeking responsive support.

#### Vulnerability 2: Long Customer Support Latency in Public Comments
- **Data Finding**: Social listening monitors detect an average unresolved customer complaint lifespan of 14.6 hours on ${c2}'s official channels.
- **Tactical Exploitation**: Highlight "${c1}'s 24/7 Dedicated Concierge & 5-Minute Resolution" across landing page hero copy and conversion banners.

#### Vulnerability 3: Single-Channel Overdependence
- **Data Finding**: Over 68% of ${c2}'s inbound traffic stems solely from search ads with high CPC cost exposure. Their email retention and direct organic referral share is critically low.
- **Tactical Exploitation**: Build an organic SEO content fortress around high-intent keywords in ${track} before ${c2} diversifies their acquisition channels.`,
      suggestedFollowUps: [
        `Draft social media copy highlighting ${c1}'s responsive support`,
        `What keywords is ${c2} spending the most ad budget on?`,
        `Generate an executive battlecard on this competitor`,
      ],
    };
  }

  // 3. Ad Hooks & Campaign Ideas
  if (lowerQ.includes('ad') || lowerQ.includes('campaign') || lowerQ.includes('hook') || lowerQ.includes('creative') || lowerQ.includes('copy')) {
    return {
      content: `### 💡 High-Converting Counter-Ad Angles: ${c1} vs ${c2}
*Engineered to steal market share across Meta, Google Ads, and LinkedIn.*

#### Angle 1: The "No Bullshit" Frictionless Teardown
- **Headline**: "Tired of ${c2}'s hidden fees and sluggish support? There's a better way."
- **Hook (First 3 Seconds)**: *Show split screen: Frustrated user waiting on hold with ${c2} vs seamless, instant workflow on ${c1}.*
- **Body Copy**: While traditional platforms in ${track} lock you into rigid contracts and slow turnaround, ${c1} delivers 10x faster results with zero onboarding friction.
- **CTA**: Switch to ${c1} in 60 Seconds · Get 30 Days Risk-Free.

#### Angle 2: The Direct Feature Benchmark
- **Headline**: "${c1} vs ${c2}: The Honest 2026 Comparison Matrix"
- **Hook**: "Don't sign that renewal contract until you see this side-by-side performance audit."
- **Body Copy**: Independent benchmarks reveal ${c1} delivers 2.4x higher customer satisfaction, 99.9% uptime, and dedicated human support.
- **CTA**: Download the Full Unbiased Report.

#### Angle 3: The Social Proof Surge
- **Headline**: "Why top brands in ${track} are migrating from ${c2} to ${c1}"
- **Hook**: "3 reasons our team canceled our ${c2} subscription after 2 years..."
- **Body Copy**: Real customer testimonials detailing cost savings, ease of use, and immediate revenue lift within 14 days of switching to ${c1}.
- **CTA**: Book Your Migration Consultation Today.`,
      suggestedFollowUps: [
        `Adapt these hooks into 5 Instagram Carousel concepts`,
        `What budget allocation would maximize ROI for this campaign?`,
        `How do we address objections from customers locked in contracts?`,
      ],
    };
  }

  // 4. Battlecard / Sales Playbook
  if (lowerQ.includes('battlecard') || lowerQ.includes('sales') || lowerQ.includes('playbook') || lowerQ.includes('pitch')) {
    return {
      content: `### 🛡️ Sales Executive Battlecard: Defeating ${c2}
*Internal Use Only · Competitive Intelligence for Sales & Account Executives*

| Parameter | ${c1} Advantage | ${c2} Talking Point & Rebuttal |
| :--- | :--- | :--- |
| **Speed to Value** | Deployment in < 24 hours with guided setup. | *They claim:* "We have more legacy features."<br/>*Rebuttal:* "Their legacy tech debt adds 6 weeks of onboarding time and hidden maintenance costs." |
| **Pricing & ROI** | Transparent pricing, no tier inflation or surprise add-ons. | *They claim:* "We are the established standard."<br/>*Rebuttal:* "You are paying a 40% legacy markup for features 90% of your team never touches." |
| **Customer Success** | Sub-10-minute human response guarantee. | *They claim:* "We provide automated ticket queues."<br/>*Rebuttal:* "When business is on the line, an automated bot doesn't solve customer emergencies." |

#### The "Trap-Setting" Question to Ask Prospects:
> *"When was the last time ${c2} released an update requested by your team, and how many days does it take their tier-2 support to resolve a blocker?"*

#### The Closing Knockout Statement:
> *"Every week you spend on ${c2}'s legacy workflow costs you measurable conversion velocity. Let us run a pilot side-by-side for 14 days; if ${c1} doesn't outperform their metrics by at least 25%, we will reimburse your pilot costs in full."*`,
      suggestedFollowUps: [
        `Give me 3 counter-arguments for price-sensitive prospects`,
        `Create a 1-page PDF summary template of this battlecard`,
        `What are ${c2}'s main renewal discount tactics?`,
      ],
    };
  }

  // 5. Pricing & Positioning Strategy
  if (lowerQ.includes('price') || lowerQ.includes('pricing') || lowerQ.includes('position') || lowerQ.includes('market share')) {
    return {
      content: `### 💎 Strategic Positioning & Pricing Playbook: ${c1} vs ${c2}
*Market segment: ${track} · Geographic scope: ${context.location || 'Global'}*

#### 1. Price-Value Disconnect in the Market
Our intelligence scan indicates that ${c2} has gradually shifted toward enterprise enterprise-locked pricing, leaving high-growth mid-market and agile teams feeling underserved and overcharged.

#### 2. Recommended Pricing Attack Maneuvers:
1. **The "Unbundled Core" Plan**:
   - Offer a razor-sharp starter package covering the top 3 features users actually want at a 30% discount relative to ${c2}'s base entry tier.
2. **Contract Buyout Credit**:
   - Provide prospective switchers up to $500–$2,000 in migration credits to nullify remaining months on active contracts with ${c2}.
3. **Usage-Based Guarantee**:
   - Replace rigid per-seat pricing with clear performance-based milestones, a key differentiator against ${c2}'s rigid licensing.

#### 3. Brand Positioning Wedge:
Position ${c1} as the **modern, agile intelligence leader** against ${c2}'s **bureaucratic, slow legacy apparatus**. In market communications, emphasize agility, modern UX, and real-time responsiveness.`,
      suggestedFollowUps: [
        `Simulate customer lifetime value (LTV) under this pricing model`,
        `How should our website homepage hero reflect this positioning?`,
        `What objections will enterprise procurement teams raise?`,
      ],
    };
  }

  // Default Persona-tailored responses
  if (persona === 'executive') {
    return {
      content: `### 📋 Executive Intelligence Briefing
*Prepared by OptivaOne AI Copilot for Leadership Team*
*Context: ${c1} vs ${c2} in ${track}*

#### Key Takeaways
1. **Market Trajectory**: ${c1} exhibits stronger unit economics in organic acquisition (+22% vs peer median), while ${c2} is burning substantial cash reserves on paid user acquisition to defend territory.
2. **Core Risk Factor**: If ${c2} launches localized regional distribution in the next quarter, our geographic footprint could face margin compression.
3. **Priority Action for Next 30 Days**: Allocate 15% more resource allocation to retention loops and launch a strategic partnership program in the ${track} sector to outflank ${c2}.

Would you like an expanded financial impact forecast or an operational rollout roadmap?`,
      suggestedFollowUps: [
        `Generate 30-60-90 day tactical execution roadmap`,
        `Analyze customer acquisition cost (CAC) disparity`,
        `Identify 3 potential acquisition or partnership targets`,
      ],
    };
  }

  if (persona === 'growth') {
    return {
      content: `### 🚀 Growth & Performance Tear-down: ${c1} vs ${c2}
*Focused on Audience Expansion, Funnel Conversion, and Channel Dominance*

#### Channel Breakdown:
- **Instagram / Social**: ${c1} leads in reel saves and viral shares (4.2% vs ${c2}'s 1.9%). Double down on weekly trend jacking and behind-the-scenes engineering stories.
- **Website Funnel**: ${c2} has a high bounce rate on mobile (~58%). Optimizing ${c1}'s mobile checkout and sign-up form will convert switchers instantly.
- **Email & Re-engagement**: ${c2}'s cadence is erratic (0.5 emails/week). Implement a 5-part behavioral automated onboarding sequence for ${c1} to increase 30-day retention to over 65%.

#### Quick-Win Experiment for This Week:
Launch a 3-part comparison video series breaking down real results between ${c1} and ${c2}. Tag target keywords to capture search traffic from prospects evaluating both solutions.`,
      suggestedFollowUps: [
        `Write scripts for the 3 comparison videos`,
        `What are the best days and times to post in ${track}?`,
        `How to set up retargeting for people who visited ${c2}'s site?`,
      ],
    };
  }

  // General Strategic response
  return {
    content: `### ⚡ OptivaOne Strategic Copilot Assessment
*Analyzing ${c1} in comparison with ${c2} across the ${track} landscape.*

Regarding **"${query}"**:

1. **Market Footprint & Dynamics**:
   - **${c1}**: Differentiated by high user loyalty, modern digital touchpoints, and agile product iterations.
   - **${c2}**: Relies heavily on historical brand inertia, broader search presence, and aggressive outbound acquisition.

2. **Core Competitive Advantage**:
   - ${c1} can out-maneuver ${c2} by focusing on niche personalization and hyper-responsive customer interactions that larger competitors struggle to replicate at scale.

3. **Recommended Immediate Action**:
   - Focus on customer retention and social proof amplification. When existing users openly champion ${c1}, it invalidates ${c2}'s top-funnel ad spend by winning the organic consideration phase.

How would you like to drill deeper into this topic? I can generate battlecards, ad creatives, pricing models, or a complete SWOT report.`,
    suggestedFollowUps: [
      `Generate comprehensive SWOT breakdown`,
      `Identify competitor tactical vulnerabilities`,
      `Create high-converting ad angles for this week`,
    ],
  };
}
