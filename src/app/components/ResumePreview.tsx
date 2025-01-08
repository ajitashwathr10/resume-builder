import {ResumeData, ResumeTemplate} from '../page'

type ResumePreviewProps = {
    readonly data: ResumeData
    onChange: (newData: Partial<ResumeData>) => void
    readonly template: ResumeTemplate
}

export default function ResumePreview({ data, template }: Readonly<ResumePreviewProps>) {
    return (
        <div className="bg-white shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
            <p className="mb-2">{data.email} | {data.phone}</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Professional Summary</h3>
            <p>{data.summary}</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Work Experience</h3>
            {data.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                    <h4 className="font-semibold">{exp.position}</h4>
                    <p>{exp.company} | {exp.startDate} - {exp.endDate}</p>
                    <p>{exp.description}</p>
                </div>
            ))}
            <h3 className="text-lg font-semibold mt-4 mb-2">Education</h3>
            {data.education.map((edu, index) => (
                <div key={index} className="mb-2">
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p>{edu.school} | {edu.graduationDate}</p>
                </div>
            ))}
            <h3 className="text-lg font-semibold mt-4 mb-2">Skills</h3>
            {data.skills.map((skillCategory, index) => (
                <div key={index} className="mb-2">
                    <h4 className="font-semibold">{skillCategory.category}</h4>
                    <p>{skillCategory.skills.join(', ')}</p>
                </div>
            ))}
            <h3 className="text-lg font-semibold mt-4 mb-2">Projects</h3>
            {data.projects.map((project, index) => (
                <div key={index} className="mb-4">
                    <h4 className="font-semibold">{project.name}</h4>
                    <p>{project.description}</p>
                    <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
                </div>
            ))}
        </div>
    )
}

