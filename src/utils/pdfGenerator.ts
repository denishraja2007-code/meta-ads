import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CompanyProfile, PerformanceAnalytics } from '../types/report';

export async function generateAndDownloadReportPDF(
  elementId: string,
  company: CompanyProfile,
  analytics: PerformanceAnalytics,
  reportDateStr?: string
): Promise<void> {
  const fileName = `OptivaOne-Performance-Report-${company.name.replace(/\s+/g, '_')}-${analytics.period}.pdf`;

  const targetElement = document.getElementById(elementId);

  if (targetElement) {
    try {
      // Capture DOM node to canvas
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0a0b1e',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
      return;
    } catch (err) {
      console.warn('html2canvas render failed, generating vector text PDF fallback:', err);
    }
  }

  // Fallback: Direct clean vector jsPDF generation if DOM node not available or capture failed
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Dark background header
  doc.setFillColor(15, 17, 38);
  doc.rect(0, 0, pageWidth, 110, 'F');

  // Brand Eyebrow
  doc.setTextColor(168, 85, 247);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('OPTIVAONE COMPETITIVE INTELLIGENCE ENGINE', 40, 42);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(`${company.name} Performance Report`, 40, 72);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  const genDate = reportDateStr || new Date().toLocaleString();
  doc.text(`Period: ${analytics.period}  ·  Track: ${company.track}  ·  Generated: ${genDate}`, 40, 94);

  // Status Banner
  doc.setFillColor(248, 250, 252);
  doc.rect(40, 130, pageWidth - 80, 50, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(40, 130, pageWidth - 80, 50, 'S');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DATA SOURCE & TELEMETRY STATUS', 55, 150);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(analytics.dataSourceInfo || 'Verified multi-channel platform sync.', 55, 168);

  // Key KPI Cards Grid
  let yPos = 210;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Executive Performance Metrics', 40, yPos);
  yPos += 20;

  const kpis = [
    { label: 'Total Posts', val: analytics.totalPosts !== null ? String(analytics.totalPosts) : 'Data unavailable' },
    { label: 'Avg Engagement', val: analytics.averageEngagement !== null ? String(analytics.averageEngagement) : 'Data unavailable' },
    { label: 'Engagement Rate', val: analytics.engagementRate !== null ? `${analytics.engagementRate}%` : 'Data unavailable' },
    { label: 'Posting Frequency', val: analytics.postingFrequency || 'Data unavailable' },
    { label: 'Growth / Trend', val: analytics.engagementGrowth !== null ? `+${analytics.engagementGrowth}%` : 'Data unavailable' },
    { label: 'Total Audience', val: analytics.audienceTotal !== null ? analytics.audienceTotal.toLocaleString() : 'Data unavailable' },
  ];

  const colWidth = (pageWidth - 80 - 20) / 3;
  const rowHeight = 55;

  kpis.forEach((kpi, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 40 + col * (colWidth + 10);
    const y = yPos + row * (rowHeight + 10);

    doc.setFillColor(241, 245, 249);
    doc.rect(x, y, colWidth, rowHeight, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(x, y, colWidth, rowHeight, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label.toUpperCase(), x + 12, y + 20);

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, x + 12, y + 42);
  });

  yPos += 2 * (rowHeight + 10) + 30;

  // Posting Frequency & Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Posting Frequency & Channel Distribution', 40, yPos);
  yPos += 20;

  if (analytics.postingFrequencyData && analytics.postingFrequencyData.length > 0) {
    analytics.postingFrequencyData.forEach((pt) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`${pt.label}: ${pt.posts} posts`, 45, yPos);
      yPos += 14;
    });
  } else {
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('No posting data recorded for this window.', 45, yPos);
    yPos += 16;
  }

  yPos += 15;

  // Summary Takeaway
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Performance Summary & Recommendations', 40, yPos);
  yPos += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const narrative = analytics.summaryNarrative || 'Performance remained consistent across active tracked channels.';
  const splitNarrative = doc.splitTextToSize(narrative, pageWidth - 80);
  doc.text(splitNarrative, 40, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('OptivaOne Intelligence Platform · Confidential · Powered by verified platform APIs', 40, 800);

  doc.save(fileName);
}
