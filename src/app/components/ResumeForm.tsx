import {useState} from 'react'
import {ResumeData, ResumeTemplate} from '../page'
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"

type ResumeFormProps = Readonly<{
    data: ResumeData
    onChange: (newData: Partial<ResumeData>) => void
    template: ResumeTemplate
}>

export default function ResumeForm({ data, onChange, template }: ResumeFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        onChange({ [name]: value })
    }

    const handleArrayChange = (field: keyof ResumeData, index: number, subfield: string, value: any) => {
        const newArray = [...(data[field] as any[])]
        newArray[index] = { ...newArray[index], [subfield]: value }
        onChange({ [field]: newArray })
    }

    const addArrayItem = (field: keyof ResumeData) => {
        const newArray = [...(data[field] as any[]), {}]
        onChange({ [field]: newArray })
    }

    const removeArrayItem = (field: keyof ResumeData, index: number) => {
        const newArray = (data[field] as any[]).filter((_, i) => i !== index)
        onChange({ [field]: newArray })
    }

    const renderSection = (sectionName: string, items: any[], fields: string[]) => (
        <div>
            <h3 className="text-lg font-semibold mb-2">{sectionName}</h3>
            {items.map((item, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                    {fields.map((field) => (
                        <Input
                            key={field}
                            type="text"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={item[field] || ''}
                            onChange={(e) => handleArrayChange(sectionName.toLowerCase() as keyof ResumeData, index, field, e.target.value)}
                            className="mb-2"
                        />
                    ))}
                    <Button type="button" onClick={() => removeArrayItem(sectionName.toLowerCase() as keyof ResumeData, index)} variant="destructive" className = 'bg-red-500 hover:bg-red-400 text-white'>
                        Remove {sectionName}
                    </Button>
                </div>
            ))}
            <Button type="button" onClick={() => addArrayItem(sectionName.toLowerCase() as keyof ResumeData)} className="mt-2 bg-black text-white">
                Add {sectionName}
            </Button>
        </div>
    )

    return (
        <form className="space-y-6">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={data.name || ''}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    value={data.email || ''}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={data.phone || ''}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                    id="summary"
                    name="summary"
                    value={data.summary || ''}
                    onChange={handleChange}
                    rows={4}
                />
            </div>
            {template !== 'entry-level' && renderSection('Experience', data.experience || [], ['company', 'position', 'startDate', 'endDate', 'description'])}
            {renderSection('Education', data.education || [], ['school', 'degree', 'graduationDate'])}
            <div>
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                {(data.skills || []).map((skillCategory, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <Input
                            type="text"
                            placeholder="Skill Category"
                            value={skillCategory.category || ''}
                            onChange={(e) => handleArrayChange('skills', index, 'category', e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            type="text"
                            placeholder="Skills (comma-separated)"
                            value={skillCategory.skills ? skillCategory.skills.join(', ') : ''}
                            onChange={(e) => handleArrayChange('skills', index, 'skills', e.target.value.split(',').map(s => s.trim()))}
                            className="mb-2"
                        />
                        <Button type="button" onClick={() => removeArrayItem('skills', index)} variant="destructive" className = "bg-red-500 hover:bg-red-400 text-white">
                            Remove Skill Category
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={() => addArrayItem('skills')} className="mt-2 bg-black text-white">
                    Add Skill Category
                </Button>
            </div>
            {renderSection('Projects', data.projects || [], ['name', 'description', 'technologies'])}
            {(template === 'specialized' || template === 'technical' || template === 'executive') &&
                renderSection('Certifications', data.certifications || [], ['name', 'issuer', 'date'])}
            {(template === 'academic' || template === 'specialized') &&
                renderSection('Publications', data.publications || [], ['title', 'publisher', 'date', 'description'])}
            {(template === 'executive' || template === 'academic') &&
                renderSection('Awards', data.awards || [], ['title', 'issuer', 'date', 'description'])}
        </form>
    )
}



