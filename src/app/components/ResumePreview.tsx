import {ResumeData, ResumeTemplate} from '../page'

type ResumePreviewProps = Readonly<{
    data: ResumeData
    template: ResumeTemplate
}>

export default function ResumePreview({ data, template }: ResumePreviewProps) {
    const formatDate = (date: string) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
    }

    return (
        <div className = "bg-white shadow-lg p-8 border border-gray-200 max-w-[850px] mx-auto">
            {/* Header */}
            <div className = "text-center mb-6">
                <h1 className = "text-2xl font-bold mb-1">{data.name || 'Your Name'}</h1>
                <p className = "text-lg mb-1">{data.title || 'Your Title'}</p>
                <p className = "text-sm">
                    {data.email} • {data.phone}
                </p>
            </div>

            {/* Summary */}
            <div className = "mb-6">
                <h2 className = "text-lg font-bold border-b border-gray-300 mb-2">Summary</h2>
                <p className = "text-sm">{data.summary}</p>
            </div>

            {/* Experience */}
            {template !== 'entry-level' && data.experience && data.experience.length > 0 && (
                <div className = "mb-6">
                    <h2 className = "text-lg font-bold border-b border-gray-300 mb-2">Experience</h2>
                    {data.experience.map((exp, index) => (
                        <div key = {index} className = "mb-4">
                            <div className = "flex justify-between items-start">
                                <div>
                                    <h3 className = "font-bold text-sm">{exp.position}</h3>
                                    <p className = "text-sm">{exp.company}</p>
                                </div>
                                <div className = "text-sm text-right">
                                    {exp.startDate && exp.endDate && (
                                        <p>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                    )}
                                </div>
                            </div>
                            <p className = "text-sm mt-1">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            <div className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Education</h2>
                {data.education && data.education.map((edu, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-sm">{edu.degree}</h3>
                                <p className="text-sm">{edu.school}</p>
                            </div>
                            <div className="text-sm text-right">
                                {edu.graduationDate && <p>{formatDate(edu.graduationDate)}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Skills</h2>
                <div className="text-sm">
                    {data.skills && data.skills.map((skillCategory, index) => (
                        <div key={index} className="mb-2">
                            <span className="font-bold">{skillCategory.category}: </span>
                            <span>{skillCategory.skills && Array.isArray(skillCategory.skills) ? skillCategory.skills.join(', ') : ''}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications */}
            {['specialized', 'technical', 'executive'].includes(template) && data.certifications && data.certifications.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-2">Certifications</h2>
                    {data.certifications.map((cert, index) => (
                        <div key={index} className="mb-2 text-sm">
                            <span className="font-bold">{cert.name}</span> — {cert.issuer} ({cert.date})
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}




