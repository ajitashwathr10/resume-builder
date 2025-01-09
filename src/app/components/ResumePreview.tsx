import { ResumeData, ResumeTemplate } from '../page'
import {JSX} from 'react'

type ResumePreviewProps = Readonly<{
  data: ResumeData
  template: ResumeTemplate
}>

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  const renderSection = (title: string, items: any[], renderItem: (item: any) => JSX.Element) => (
    <>
      <h3 className = "text-lg font-semibold mt-4 mb-2">{title}</h3>
      {items.map((item, index) => (
        <div key = {index} className = "mb-4">
          {renderItem(item)}
        </div>
      ))}
    </>
  )
  return (
    <div className = "bg-white shadow-lg p-8 border border-gray-200">
      <h2 className = "text-2xl font-bold mb-4">{data.name}</h2>
      <p className = "mb-2">{data.email} | {data.phone}</p>
      <h3 className = "text-lg font-semibold mt-4 mb-2">Professional Summary</h3>
      <p>{data.summary}</p>
      {template !== 'entry-level' && renderSection('Work Experience', data.experience, (exp) => (
        <>
          <h4 className = "font-semibold">{exp.position}</h4>
          <p>{exp.company} | {exp.startDate} - {exp.endDate}</p>
          <p>{exp.description}</p>
        </>
      ))}
      {renderSection('Education', data.education, (edu) => (
        <>
          <h4 className = "font-semibold">{edu.degree}</h4>
          <p>{edu.school} | {edu.graduationDate}</p>
        </>
      ))}

      {renderSection('Skills', data.skills, (skillCategory) => (
        <>
          <h4 className = "font-semibold">{skillCategory.category}</h4>
          <p>{skillCategory.skills && skillCategory.skills.length > 0 ? skillCategory.skills.join(', ') : 'No skills listed'}</p>
        </>
      ))}

      {renderSection('Projects', data.projects, (project) => (
        <>
          <h4 className = "font-semibold">{project.name}</h4>
          <p>{project.description}</p>
          <p><strong>Technologies:</strong> {project.technologies && project.technologies.length > 0 ? project.technologies.join(', ') : 'No technologies listed'}</p>
        </>
      ))}

      {(template === 'specialized' || template === 'technical' || template === 'executive') && data.certifications &&
        renderSection('Certifications', data.certifications, (cert) => (
          <>
            <h4 className = "font-semibold">{cert.name}</h4>
            <p>{cert.issuer} | {cert.date}</p>
          </>
        ))}

      {(template === 'academic' || template === 'specialized') && data.publications &&
        renderSection('Publications', data.publications, (pub) => (
          <>
            <h4 className = "font-semibold">{pub.title}</h4>
            <p>{pub.publisher} | {pub.date}</p>
            <p>{pub.description}</p>
          </>
        ))}

      {(template === 'executive' || template === 'academic') && data.awards &&
        renderSection('Awards', data.awards, (award) => (
          <>
            <h4 className = "font-semibold">{award.title}</h4>
            <p>{award.issuer} | {award.date}</p>
            <p>{award.description}</p>
          </>
        ))}
    </div>
  )
}

