import React from 'react'
import {ResumeData, ResumeTemplate} from '../page'
import {jsPDF} from 'jspdf'
import html2canvas from 'html2canvas'
import {saveAs} from 'file-saver';
import {Document, Packer, Paragraph, TextRun} from 'docx';

type ExportOptionsProps = {
  readonly data: ResumeData;
  readonly contentRef?: React.RefObject<HTMLDivElement>;
  readonly template: ResumeTemplate;
};

export default function ExportOptions({data, contentRef}: ExportOptionsProps) {
  const exportAsPDF = async () => {
    if (!contentRef?.current) {
      console.error('Content reference is missing');
      return;
    }
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'px'
      });
      const imgWidth = 595;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      );
      pdf.save(`${data.basics.name.replace(/\s+/g, '_')}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF: ', error);
    }
  };

  const exportAsWord = async (data: ResumeData) => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: data.basics.name,
                  bold: true,
                  size: 28
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: data.basics.email,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Experience',
                  bold: true,
                  size: 24
                })
              ]
            }),
            ...(Array.isArray(data.work) ? data.work.map((job: { position: string; company: string; startDate: string; endDate: string; summary: string; }) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${job.position} at ${job.company}`,
                    bold: true 
                  }),
                  new TextRun({
                    text: `\n${job.startDate} - ${job.endDate}`,
                    italics: true 
                  }),
                  new TextRun({
                    text: `\n${job.summary}`
                  })
                ]
              })
            ) : [])
          ]
        }]
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${data.basics.name.replace(/\s+/g, '_')}_resume.docx`);
    } catch(error) {
      console.error('Error generating Word document: ', error);
    }
  };
  return (
    <div className = 'mt-6 space-x-4'>
      <button
        onClick = {() => exportAsPDF()}
        className = 'bg-black text-white px-4 py-2 rounded hover:bg-gray-800'
      >
        Export as PDF 
      </button>
      <button
        onClick = {() => exportAsWord(data)}
        className = 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300'
      >
        Export as WORD
      </button>
    </div>
  );
}