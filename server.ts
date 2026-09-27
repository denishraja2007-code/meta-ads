import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/database';
import { ReportingPeriod } from './src/types/report';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Healthcheck endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      engine: 'OptivaOne Intelligence API',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Helper to extract user identity from headers
  const getAuthUserEmail = (req: Request): string => {
    return (req.headers['x-user-email'] as string) || 'denishraja011@gmail.com';
  };

  // 1. Company Information Table API
  app.get('/api/companies', (_req: Request, res: Response) => {
    try {
      const companies = db.getCompanies();
      res.json({ success: true, data: companies });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to fetch companies' });
    }
  });

  app.post('/api/companies', (req: Request, res: Response) => {
    try {
      const { name, track, socialLinks } = req.body;
      if (!name || !track) {
        res.status(400).json({ success: false, error: 'Company name and track are required' });
        return;
      }
      const company = db.saveCompany({ name, track, socialLinks });
      res.json({ success: true, data: company });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to save company' });
    }
  });

  // 2. Reporting Periods Table API
  app.get('/api/reporting-periods', (_req: Request, res: Response) => {
    try {
      const periods = db.getReportingPeriods();
      res.json({ success: true, data: periods });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to fetch reporting periods' });
    }
  });

  // 3. Analytics Data Table API
  app.get('/api/analytics', (req: Request, res: Response) => {
    try {
      const companyIdOrName = (req.query.company as string) || 'comp-optivaone';
      const period = ((req.query.period as string) || 'Monthly') as ReportingPeriod;

      // Find company
      let company = db.getCompany(companyIdOrName);
      if (!company) {
        // Create company on the fly if user passed active name
        company = db.saveCompany({
          name: companyIdOrName,
          track: (req.query.track as string) || 'General Industry',
          socialLinks: {
            instagram: `https://instagram.com/${companyIdOrName.toLowerCase().replace(/\s+/g, '')}`,
            website: `https://${companyIdOrName.toLowerCase().replace(/\s+/g, '')}.com`,
          },
        });
      }

      const analytics = db.getAnalytics(company.id, period);
      if (!analytics) {
        res.status(404).json({ success: false, error: 'No analytics available for this company and period' });
        return;
      }

      res.json({ success: true, data: analytics, company });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to fetch analytics' });
    }
  });

  // 4. Trigger Live Analytics Collection & Processing Pipeline
  app.post('/api/analytics/collect', async (req: Request, res: Response) => {
    try {
      const { companyId, period } = req.body;
      if (!companyId || !period) {
        res.status(400).json({ success: false, error: 'Company ID and period are required' });
        return;
      }

      // Simulate live external API ingest latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const refreshed = db.refreshAnalytics(companyId, period as ReportingPeriod);
      res.json({ success: true, data: refreshed });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to refresh analytics' });
    }
  });

  // 5. Saved Reports Table API with Authentication & Access Control
  app.get('/api/reports/saved', (req: Request, res: Response) => {
    try {
      const userEmail = getAuthUserEmail(req);
      const reports = db.getSavedReportsForUser(userEmail);
      res.json({ success: true, data: reports, userEmail });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to fetch saved reports' });
    }
  });

  app.post('/api/reports/saved', (req: Request, res: Response) => {
    try {
      const userEmail = getAuthUserEmail(req);
      const { reportData, company } = req.body;

      if (!reportData || !company) {
        res.status(400).json({ success: false, error: 'Report data and company are required' });
        return;
      }

      const saved = db.saveReportForUser(userEmail, reportData, company);
      res.json({ success: true, data: saved });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to save report' });
    }
  });

  app.get('/api/reports/saved/:id', (req: Request, res: Response) => {
    try {
      const userEmail = getAuthUserEmail(req);
      const report = db.getSavedReport(req.params.id, userEmail);

      if (!report) {
        res.status(404).json({ success: false, error: 'Report not found or access denied.' });
        return;
      }

      res.json({ success: true, data: report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to retrieve saved report' });
    }
  });

  app.delete('/api/reports/saved/:id', (req: Request, res: Response) => {
    try {
      const userEmail = getAuthUserEmail(req);
      const success = db.deleteSavedReport(req.params.id, userEmail);

      if (!success) {
        res.status(404).json({ success: false, error: 'Report not found or deletion not authorized' });
        return;
      }

      res.json({ success: true, message: 'Report deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to delete report' });
    }
  });

  // OptivaOne Copilot Chat API endpoint using Gemini API
  app.post('/api/copilot/chat', async (req: Request, res: Response) => {
    try {
      const { message, history = [], context = {} } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.json({
          reply: null,
          source: 'local_fallback',
          message: 'No GEMINI_API_KEY configured in environment.',
        });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const c1 = context.firstCompany?.companyName || 'OptivaOne';
      const c2 = context.secondCompany?.companyName || 'StrategyPulse AI';
      const track = context.track || context.firstCompany?.track || 'Retail & Tech';
      const location = context.location || 'Global';
      const persona = context.activePersona || 'strategic';

      const systemInstruction = `You are the OptivaOne Strategic AI Copilot, an elite competitive intelligence analyst and market strategist.
You provide precise, actionable, razor-sharp competitor intelligence for business leaders and marketers.
Current Workspace Context:
- Primary Brand: ${c1}
- Track / Industry: ${track}
- Geographic Scope: ${location}
- Competing Brand: ${c2}
- Active Persona: ${persona} (e.g. strategic advisor, growth marketer, vulnerability hunter, executive brief)

Guidelines:
1. Always structure your responses with crisp headers, bullet points, and high-impact takeaways.
2. Ground advice specifically in the dynamic between ${c1} and ${c2} in the ${track} industry.
3. Be direct, authoritative, and tactically actionable (e.g. concrete counter-moves, campaign angles, pricing adjustments, feature battlecards).
4. Avoid fluff, filler pleasantries, or generic corporate speak.`;

      // Ensure contents strictly alternate between user and model, ending with user: message
      const conversationContents: any[] = [];
      let lastRole: string | null = null;

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          const role = item.role === 'assistant' ? 'model' : 'user';
          if (role !== lastRole && item.content?.trim()) {
            conversationContents.push({
              role,
              parts: [{ text: item.content.trim() }],
            });
            lastRole = role;
          }
        }
      }

      // If the last item in history was user, remove it so our current message is the user prompt
      if (conversationContents.length > 0 && conversationContents[conversationContents.length - 1].role === 'user') {
        conversationContents.pop();
      }

      // Add current message
      conversationContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: conversationContents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const replyText = response.text || '';

      res.json({
        reply: replyText,
        source: 'gemini',
        model: 'gemini-flash-latest',
        suggestedFollowUps: [
          `Draft 3 high-converting ad hooks targeting this rival`,
          `What are the peak posting hours for our category?`,
          `Provide an executive battlecard breakdown`,
        ],
      });
    } catch (err: any) {
      console.error('Error in /api/copilot/chat:', err);
      res.json({
        reply: null,
        source: 'local_fallback',
        error: err?.message || 'Server error communicating with Gemini API',
      });
    }
  });

  // Setup Vite in development or static files in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`OptivaOne server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
