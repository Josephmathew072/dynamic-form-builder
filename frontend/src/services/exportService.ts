import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun } from 'docx';
import PptxGenJS from 'pptxgenjs';
import { saveAs } from 'file-saver';

export interface ChartImage {
    id: string;
    title: string;
    element: HTMLElement;
}

export class ExportService {

    // Export as PDF
    static async exportAsPDF(formTitle: string, charts: ChartImage[], stats: any) {
        const pdf = new jsPDF('p', 'mm', 'a4');
        let yOffset = 20;

        // Title
        pdf.setFontSize(24);
        pdf.setTextColor(59, 130, 246);
        pdf.text(`Analytics Report: ${formTitle}`, 20, yOffset);
        yOffset += 15;

        // Date
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yOffset);
        yOffset += 15;

        // Summary Stats
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Summary Statistics', 20, yOffset);
        yOffset += 10;

        pdf.setFontSize(10);
        pdf.text(`Total Submissions: ${stats.totalSubmissions}`, 25, yOffset);
        yOffset += 7;

        if (stats.numberFields) {
            stats.numberFields.forEach((field: any) => {
                pdf.text(`Average ${field.label}: ${field.average?.toFixed(2) || 'N/A'}`, 25, yOffset);
                yOffset += 7;
            });
        }

        if (stats.selectFields) {
            stats.selectFields.forEach((field: any) => {
                pdf.text(`Most Selected (${field.label}): ${field.mostSelected || 'None'} (${field.mostSelectedCount || 0} selections)`, 25, yOffset);
                yOffset += 7;
            });
        }

        yOffset += 10;

        // Add charts
        for (const chart of charts) {
            if (yOffset > 250) {
                pdf.addPage();
                yOffset = 20;
            }

            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            pdf.text(chart.title, 20, yOffset);
            yOffset += 5;

            try {
                const canvas = await html2canvas(chart.element, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 170;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                if (yOffset + imgHeight > 280) {
                    pdf.addPage();
                    yOffset = 20;
                    pdf.text(chart.title, 20, yOffset);
                    yOffset += 5;
                }

                pdf.addImage(imgData, 'PNG', 20, yOffset, imgWidth, imgHeight);
                yOffset += imgHeight + 15;
            } catch (error) {
                console.error(`Failed to capture chart ${chart.title}:`, error);
                pdf.text(`[Chart could not be rendered: ${chart.title}]`, 25, yOffset);
                yOffset += 10;
            }
        }

        pdf.save(`${formTitle.replace(/[^a-z0-9]/gi, '_')}_analytics_report.pdf`);
    }

    // Export as DOCX with images
    static async exportAsDOCX(formTitle: string, charts: ChartImage[], stats: any) {
        const children: any[] = [];

        // Title
        children.push(
            new Paragraph({
                text: `Analytics Report: ${formTitle}`,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
            })
        );

        // Date
        children.push(
            new Paragraph({
                text: `Generated: ${new Date().toLocaleString()}`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 }
            })
        );

        // Summary Section
        children.push(
            new Paragraph({
                text: "Summary Statistics",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 200 }
            })
        );

        // Stats Table
        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph("Metric")], shading: { fill: "E5E7EB" } }),
                    new TableCell({ children: [new Paragraph("Value")], shading: { fill: "E5E7EB" } })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph("Total Submissions")] }),
                    new TableCell({ children: [new Paragraph(stats.totalSubmissions.toString())] })
                ]
            })
        ];

        if (stats.numberFields) {
            stats.numberFields.forEach((field: any) => {
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(`Average ${field.label}`)] }),
                            new TableCell({ children: [new Paragraph(field.average?.toFixed(2) || 'N/A')] })
                        ]
                    })
                );
            });
        }

        if (stats.selectFields) {
            stats.selectFields.forEach((field: any) => {
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(`Most Selected (${field.label})`)] }),
                            new TableCell({ children: [new Paragraph(`${field.mostSelected || 'None'} (${field.mostSelectedCount || 0} selections)`)] })
                        ]
                    })
                );
            });
        }

        children.push(
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                },
                rows: tableRows
            })
        );

        children.push(new Paragraph({ text: "", spacing: { after: 400 } }));

        // Charts Section
        children.push(
            new Paragraph({
                text: "Detailed Charts",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 200 }
            })
        );

        // Capture charts and add to document
        const doc = new Document({
            sections: [{
                properties: {},
                children: children
            }]
        });

        // We need to rebuild the document with images
        // Since docx doesn't support adding sections after creation, we'll create a new one with all content
        const allChildren = [...children];

        for (let i = 0; i < charts.length; i++) {
            const chart = charts[i];
            allChildren.push(
                new Paragraph({
                    text: chart.title,
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 200, after: 100 }
                })
            );

            try {
                const canvas = await html2canvas(chart.element, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');

                allChildren.push(
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: imgData,
                                transformation: { width: 500, height: (canvas.height * 500) / canvas.width },
                                type: 'png'  // Add this - specifies the image type
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 }
                    })
                );
            } catch (error) {
                console.error(`Failed to capture chart ${chart.title}:`, error);
                allChildren.push(
                    new Paragraph({
                        text: `[Chart could not be rendered: ${chart.title}]`,
                        spacing: { after: 100 }
                    })
                );
            }
        }

        const finalDoc = new Document({
            sections: [{
                properties: {},
                children: allChildren
            }]
        });

        const blob = await Packer.toBlob(finalDoc);
        saveAs(blob, `${formTitle.replace(/[^a-z0-9]/gi, '_')}_analytics_report.docx`);
    }

    // Export as PPTX
    static async exportAsPPTX(formTitle: string, charts: ChartImage[], stats: any) {
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';
        pptx.defineLayout({ name: 'WIDE', width: 10, height: 5.625 });
        pptx.layout = 'WIDE';

        // Title Slide
        const titleSlide = pptx.addSlide();
        titleSlide.addText(`Analytics Report`, {
            x: 0.5,
            y: 1.5,
            w: '90%',
            h: 1,
            fontSize: 44,
            bold: true,
            color: '3B82F6',
            align: 'center'
        });
        titleSlide.addText(formTitle, {
            x: 0.5,
            y: 2.5,
            w: '90%',
            h: 0.8,
            fontSize: 28,
            align: 'center'
        });
        titleSlide.addText(`Generated: ${new Date().toLocaleString()}`, {
            x: 0.5,
            y: 5,
            w: '90%',
            h: 0.5,
            fontSize: 14,
            align: 'center'
        });

        // Summary Slide
        const summarySlide = pptx.addSlide();
        summarySlide.addText('Summary Statistics', {
            x: 0.5,
            y: 0.3,
            w: '90%',
            h: 0.6,
            fontSize: 28,
            bold: true
        });

        let summaryY = 1.2;
        summarySlide.addText(`Total Submissions: ${stats.totalSubmissions}`, {
            x: 0.8,
            y: summaryY,
            w: '80%',
            h: 0.4,
            fontSize: 16
        });
        summaryY += 0.5;

        if (stats.numberFields) {
            stats.numberFields.forEach((field: any) => {
                summarySlide.addText(`Average ${field.label}: ${field.average?.toFixed(2) || 'N/A'}`, {
                    x: 0.8,
                    y: summaryY,
                    w: '80%',
                    h: 0.4,
                    fontSize: 16
                });
                summaryY += 0.5;
            });
        }

        if (stats.selectFields) {
            stats.selectFields.forEach((field: any) => {
                summarySlide.addText(`Most Selected (${field.label}): ${field.mostSelected || 'None'}`, {
                    x: 0.8,
                    y: summaryY,
                    w: '80%',
                    h: 0.4,
                    fontSize: 16
                });
                summaryY += 0.5;
            });
        }

        // Chart Slides
        for (const chart of charts) {
            const slide = pptx.addSlide();

            // Add title
            slide.addText(chart.title, {
                x: 0.5,
                y: 0.2,
                w: '90%',
                h: 0.5,
                fontSize: 24,
                bold: true
            });

            try {
                // Capture chart as image
                const canvas = await html2canvas(chart.element, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                });
                const imgData = canvas.toDataURL('image/png');

                // Add image to slide
                slide.addImage({
                    data: imgData,
                    x: 0.5,
                    y: 1,
                    w: 9,
                    h: 4.5
                });
            } catch (error) {
                console.error(`Failed to capture chart ${chart.title}:`, error);
                slide.addText('Chart could not be rendered', {
                    x: 0.5,
                    y: 3,
                    w: '90%',
                    h: 0.5,
                    fontSize: 14,
                    align: 'center',
                    color: 'FF0000'
                });
            }
        }

        // Save presentation with proper error handling
        try {
            await pptx.writeFile({ fileName: `${formTitle.replace(/[^a-z0-9]/gi, '_')}_analytics_report.pptx` });
        } catch (error) {
            console.error('Error saving PPTX:', error);
            // Fallback: use save method
            pptx.writeFile({ fileName: `${formTitle.replace(/[^a-z0-9]/gi, '_')}_analytics_report.pptx` });
        }
    }

    // Export as CSV (Raw Data)
    static exportAsCSV(formTitle: string, responses: any[]) {
        if (!responses || responses.length === 0) {
            alert('No data to export');
            return;
        }

        // Get all unique keys from responses
        const allKeys = new Set<string>();
        responses.forEach(response => {
            Object.keys(response.answers).forEach(key => allKeys.add(key));
        });
        allKeys.add('submittedAt');

        const headers = Array.from(allKeys);

        // Create CSV rows
        const csvRows = [headers.join(',')];

        responses.forEach(response => {
            const row = headers.map(header => {
                if (header === 'submittedAt') {
                    return `"${new Date(response.submittedAt).toLocaleString()}"`;
                }
                const value = response.answers[header];
                if (Array.isArray(value)) {
                    return `"${value.join('; ')}"`;
                }
                if (value === undefined || value === null) {
                    return '""';
                }
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(row.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${formTitle.replace(/[^a-z0-9]/gi, '_')}_data_export.csv`);
    }
}