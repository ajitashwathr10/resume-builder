import {useState} from 'react'
import {ResumeData, ResumeTemplate} from '../page'
import {Button} from "@/components/ui/button"
import {jsPDF} from 'jspdf'
import {Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType} from 'docx'

type ExportOptionsProps = Readonly<{
  data: ResumeData
  template: ResumeTemplate
}>

export default function ExportOptions({data, template}: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const formatDate = (date: string) => {
    if(!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {month: 'short', year: 'numeric'});
  }
  const exportAsPDF = async () => {
    setIsExporting(true)
    try {
      const doc = new jsPDF()
      let yPos = 10

      // Helper function to add text and update yPos
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false, align: 'left' | 'center' = 'left') => {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')
        if(align === 'center') {
          doc.text(text, doc.internal.pageSize.width / 2, yPos, {align: 'center'})
        } else {
          doc.text(text, 20, yPos)
        }
        yPos += fontSize / 2 + 2
      }

      addText(data.name, 18, true, 'center')
      addText(data.summary?.split('|')[0] || '', 14, false, 'center')
      addText(`${data.email} | ${data.phone}`, 12, false, 'center')
      yPos += 10

      addText('Summary', 16, true)
      addText(data.summary || '', 12)
      yPos += 10

      if (template !== 'entry-level' && data.experience && data.experience.length > 0) {
        addText('Work Experience', 16, true)
        data.experience.forEach((exp) => {
          addText(`${exp.position} at ${exp.company}`, 14, true)
          addText(`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`)
          addText(exp.description)
          yPos += 5
        })
        yPos += 10
      }

      addText('Education', 16, true)
      if(data.education) {
        data.education.forEach((edu) => {
          addText(`${edu.degree}`, 14, true)
          addText(`${edu.school} | ${formatDate(edu.graduationDate)}`, 12)
          yPos += 5
        })
      }
      yPos += 10

      addText('Skills', 16, true)
      if(data.skills) {
        data.skills.forEach((skillCategory) => {
          if(skillCategory.category && skillCategory.skills && Array.isArray(skillCategory.skills)) {
            addText(`${skillCategory.category}: ${skillCategory.skills.join(', ')}`, 12)
          }
        })
      }
      yPos += 10


      if(data.projects && data.projects.length > 0) {
        addText('Projects', 16, true)
        data.projects.forEach((project) => {
          addText(project.name, 14, true)
          addText(project.description, 12)
          if(Array.isArray(project.technologies)) {
            addText(`Technologies: ${project.technologies.join(', ')}`, 12)
          } else if(typeof project.technologies === 'string') {
            addText('Technologies: ${project.technologies}', 12)
          }
          yPos += 5
        })
        yPos += 10
      }

      // Add template-specific sections
      if (['specialized', 'technical', 'executive'].includes(template) && data.certifications && data.certifications.length > 0) {
        addText('Certifications', 16, true)
        data.certifications.forEach((cert) => {
          addText(`${cert.name} - ${cert.issuer} (${formatDate(cert.date)})`, 12)
        })
        yPos += 10
      }

      if (['academic', 'specialized'].includes(template) && data.publications && data.publications.length > 0) {
        addText('Publications', 14, true)
        data.publications.forEach((pub) => {
          addText(pub.title, 12, true)
          addText(`${pub.publisher} | ${pub.date}`)
          addText(pub.description)
          yPos += 5
        })
      }

      if (['executive', 'academic'].includes(template) && data.awards && data.awards.length > 0) {
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
                text: data.name,
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: data.summary?.split('|')[0] || '',
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `${data.email} | ${data.phone}`,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: 'Summary',
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: data.summary || '',
              }),
              ...generateWordSections(),
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

  const generateWordSections = () => {
    const sections = []

    if (template !== 'entry-level' && data.experience && data.experience.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Experience',
          heading: HeadingLevel.HEADING_1,
        })
      )
      data.experience.forEach((exp) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${exp.position} - ${exp.company}`, bold: true }),
              new TextRun({ text: `\t${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`, bold: false }),
            ],
          }),
          new Paragraph({
            text: exp.description,
          })
        )
      })
    }

    if (data.projects && data.projects.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Projects',
          heading: HeadingLevel.HEADING_1,
        })
      )
      data.projects.forEach((project) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({text: project.name, bold: true})],
          }),
          new Paragraph({
            text: project.description,
          })
        )
        if (Array.isArray(project.technologies)) {
          sections.push(
            new Paragraph({
              text: `Technologies: ${project.technologies.join(', ')}`,
            })
          )
        } else if (typeof project.technologies === 'string') {
          sections.push(
            new Paragraph({
              text: `Technologies: ${project.technologies}`,
            })
          )
        }
      })
    }

    if (data.education) {
      sections.push(
        new Paragraph({
          text: 'Education',
          heading: HeadingLevel.HEADING_1,
        })
      )
      data.education.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree, bold: true }),
              new TextRun({ text: `\t${edu.school} | ${formatDate(edu.graduationDate)}`, bold: false }),
            ],
          })
        )
      })
    }

    if (data.skills) {
      sections.push(
        new Paragraph({
          text: 'Skills',
          heading: HeadingLevel.HEADING_1,
        })
      )
      data.skills.forEach((skillCategory) => {
        if (skillCategory.category && skillCategory.skills && Array.isArray(skillCategory.skills)) {
          sections.push(
            new Paragraph({
              text: `${skillCategory.category}: ${skillCategory.skills.join(', ')}`,
            })
          )
        }
      })
    }

    if (['specialized', 'technical', 'executive'].includes(template) && data.certifications && data.certifications.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Certifications',
          heading: HeadingLevel.HEADING_1,
        })
      )
      data.certifications.forEach((cert) => {
        sections.push(
          new Paragraph({
            text: `${cert.name} - ${cert.issuer} (${formatDate(cert.date)})`,
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