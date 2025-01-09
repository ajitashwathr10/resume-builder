import { ResumeData, ResumeTemplate } from '../page'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type ResumeFormProps = {
    readonly data: ResumeData
    readonly onChange: (newData: Partial<ResumeData>) => void
    readonly template: ResumeTemplate
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        onChange({ [name]: value })
    }

    const handleArrayChange = (field: keyof ResumeData, index: number, subfield: string, value: any) => {
        const newArray = [...data[field]]
        if(typeof newArray[index] === 'object' && newArray[index] !== null) {
            newArray[index] = {...newArray[index], [subfield]: value}
            onChange({[field]: newArray})
        }
    }

    const addArrayItem = (field: keyof ResumeData) => {
        const newArray = [...data[field], {}]
        onChange({ [field]: newArray })
    }

    const removeArrayItem = (field: keyof ResumeData, index: number) => {
        const newArray = Array.isArray(data[field]) ? data[field].filter((_, i) => i !== index) : []
        onChange({ [field]: newArray })
    }

    return (
        <form className="space-y-6">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                    id="summary"
                    name="summary"
                    value={data.summary}
                    onChange={handleChange}
                    rows={4}
                />
            </div>
            <div>
                <h3 className = 'text-lg font-semibold mb-2'>Work Experience</h3>
                {data.experience.map((exp, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <Input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange = {(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            type="text"
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            type="date"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            type="date"
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                            className="mb-2"
                        />
                        <Textarea
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                            rows={3}
                            className="mb-2"
                        />
                        <Button type="button" onClick={() => removeArrayItem('experience', index)} variant="destructive">
                            Remove Experience
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={() => addArrayItem('experience')} className="mt-2">
                    Add Experience
                </Button>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Education</h3>
                {data.education.map((edu, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <Input
                            type="text"
                            placeholder="School"
                            value={edu.school}
                            onChange = {(e) => handleArrayChange('education', index, 'school', e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            type="date"
                            placeholder="Graduation Date"
                            value={edu.graduationDate}
                            onChange={(e) => handleArrayChange('education', index, 'graduationDate', e.target.value)}
                            className="mb-2"
                        />
                        <Button type="button" onClick={() => removeArrayItem('education', index)} variant="destructive">
                            Remove Education
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={() => addArrayItem('education')} className="mt-2">
                    Add Education
                </Button>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                {data.skills.map((skillCategory, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <Input
                            type="text"
                            placeholder="Skill Category"
                            value={skillCategory.category}
                            onChange = {(e) => handleArrayChange('skills', index, 'category', e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            type="text"
                            placeholder="Skills (comma-separated)"
                            value={skillCategory.skills.join(', ')}
                            onChange={(e) => handleArrayChange('skills', index, 'skills', e.target.value.split(',').map(s => s.trim()))}
                            className="mb-2"
                        />
                        <Button type="button" onClick={() => removeArrayItem('skills', index)} variant="destructive">
                            Remove Skill Category
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={() => addArrayItem('skills')} className="mt-2">
                    Add Skill Category
                </Button>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Projects</h3>
                {data.projects.map((project, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <Input
                            type="text"
                            placeholder="Project Name"
                            value={project.name}
                            onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                            className="mb-2"
                        />
                        <Textarea
                            placeholder="Project Description"
                            value={project.description}
                            onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                            rows={3}
                            className="mb-2"
                        />
                        <Input
                            type="text"
                            placeholder="Technologies Used (comma-separated)"
                            value={project.technologies.join(', ')}
                            onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                            className="mb-2"
                        />
                        <Button type="button" onClick={() => removeArrayItem('projects', index)} variant="destructive">
                            Remove Project
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={() => addArrayItem('projects')} className="mt-2">
                    Add Project
                </Button>
            </div>
        </form>
    )
}

