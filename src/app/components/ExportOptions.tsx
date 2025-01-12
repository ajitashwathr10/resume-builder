import { useState } from 'react'
import { ResumeData, ResumeTemplate } from '../page'
import { Button } from "@/components/ui/button"
import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, TextRun } from 'docx'

type ExportOptionsProps = Readonly<{
  data: ResumeData
  template: ResumeTemplate
}>

export default function ExportOptions({ data, template }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportAsPDF = async () => {
    setIsExporting(true)
    try {
      const doc = new jsPDF()
      let yPos = 10

      // Helper function to add text and update yPos
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')
        doc.text(text, 10, yPos)
        yPos += fontSize / 2 + 2
      }

      // Add content to PDF
      addText(data.name, 18, true)
      addText(`${data.email} | ${data.phone}`)
      addText('Professional Summary', 14, true)
      addText(data.summary)

      if (template !== 'entry-level') {
        addText('Work Experience', 14, true)
        data.experience.forEach((exp) => {
          addText(`${exp.position} at ${exp.company}`, 12, true)
          addText(`${exp.startDate} - ${exp.endDate}`)
          addText(exp.description)
          yPos += 5
        })
      }

      addText('Education', 14, true)
      data.education.forEach((edu) => {
        addText(`${edu.degree} - ${edu.school}`, 12, true)
        addText(edu.graduationDate)
        yPos += 5
      })

      addText('Skills', 14, true)
      data.skills.forEach((skillCategory) => {
        addText(skillCategory.category, 12, true)
        addText(skillCategory.skills.join(', '))
        yPos += 5
      })

      addText('Projects', 14, true)
      data.projects.forEach((project) => {
        addText(project.name, 12, true)
        addText(project.description)
        addText(`Technologies: ${project.technologies.join(', ')}`)
        yPos += 5
      })

      // Add template-specific sections
      if (['specialized', 'technical', 'executive'].includes(template) && data.certifications) {
        addText('Certifications', 14, true)
        data.certifications.forEach((cert) => {
          addText(`${cert.name} - ${cert.issuer}`, 12, true)
          addText(cert.date)
          yPos += 5
        })
      }

      if (['academic', 'specialized'].includes(template) && data.publications) {
        addText('Publications', 14, true)
        data.publications.forEach((pub) => {
          addText(pub.title, 12, true)
          addText(`${pub.publisher} | ${pub.date}`)
          addText(pub.description)
          yPos += 5
        })
      }

      if (['executive', 'academic'].includes(template) && data.awards) {
        addText('Awards', 14, true)
        data.awards.forEach((award) => {
          addText(award.title, 12, true)
          addText(`${award.issuer} | ${award.date}`)
          addText(award.description)
          yPos += 5
        })
      }

      // Save the PDF
      doc.save('resume.pdf')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('An error occurred while exporting the PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsWord = async () => {
    setIsExporting(true)
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun({ text: data.name, bold: true, size: 28 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: `${data.email} | ${data.phone}`, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: 'Professional Summary', bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: data.summary })],
              }),
              ...generateWordSections(data, template),
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'resume.docx'
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting Word document:', error)
      alert('An error occurred while exporting the Word document. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const generateWordSections = (data: ResumeData, template: ResumeTemplate) => {
    const sections = []

    if (template !== 'entry-level') {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: 'Work Experience', bold: true, size: 24 })],
        })
      )
      data.experience.forEach((exp) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: `${exp.position} at ${exp.company}`, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `${exp.startDate} - ${exp.endDate}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: exp.description })],
          })
        )
      })
    }

    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Education', bold: true, size: 24 })],
      })
    )
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `${edu.degree} - ${edu.school}`, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: edu.graduationDate })],
        })
      )
    })

    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Skills', bold: true, size: 24 })],
      })
    )
    data.skills.forEach((skillCategory) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: skillCategory.category, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: skillCategory.skills.join(', ') })],
        })
      )
    })

    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Projects', bold: true, size: 24 })],
      })
    )
    data.projects.forEach((project) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: project.name, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: project.description })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Technologies: ${project.technologies.join(', ')}` })],
        })
      )
    })

    if (['specialized', 'technical', 'executive'].includes(template) && data.certifications) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: 'Certifications', bold: true, size: 24 })],
        })
      )
      data.certifications.forEach((cert) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: `${cert.name} - ${cert.issuer}`, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: cert.date })],
          })
        )
      })
    }

    if (['academic', 'specialized'].includes(template) && data.publications) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: 'Publications', bold: true, size: 24 })],
        })
      )
      data.publications.forEach((pub) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: pub.title, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `${pub.publisher} | ${pub.date}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: pub.description })],
          })
        )
      })
    }

    if (['executive', 'academic'].includes(template) && data.awards) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: 'Awards', bold: true, size: 24 })],
        })
      )
      data.awards.forEach((award) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: award.title, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `${award.issuer} | ${award.date}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: award.description })],
          })
        )
      })
    }

    return sections
  }

  return (
    <div className="mt-6 space-x-4">
      <Button
        onClick={exportAsPDF}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export as PDF'}
      </Button>
      <Button
        onClick={exportAsWord}
        className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export as Word'}
      </Button>
    </div>
  )
}

