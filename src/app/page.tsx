'use client'

import {useState} from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import TemplateSelector from './components/TemplateSelector'
import ExportOptions from './components/ExportOptions'

export type ResumeData = {
  name: string
  email: string
  phone: string
  summary: string
  experience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    graduationDate: string
  }>
  skills: Array<{
    category: string
    skills: string[]
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
  }>
  basics: {
    name: string;
    email: string;
  }
  work: {
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    summary: string;
  }
}

export type ResumeTemplate = 'entry-level' | 'career-changer' | 'mid-career' | 'specialized' | 'technical' | 'executive' | 'academic'

export default function ResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    basics: {
      name: '',
      email: ''
    },
    work: {
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      summary: ''
    }
  })
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('entry-level')

  const handleDataChange = (newData: Partial<ResumeData>) => {
    setResumeData(prevData => ({ ...prevData, ...newData }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Resume Builder</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <TemplateSelector onSelect={setSelectedTemplate} selected={selectedTemplate} />
          <ResumeForm data={resumeData} onChange={handleDataChange} template={selectedTemplate} />
        </div>
        <div className="sticky top-8">
          <ResumePreview data={resumeData} template={selectedTemplate} onChange={handleDataChange} />
          <ExportOptions data={resumeData} template={selectedTemplate} />
        </div>
      </div>
    </div>
  )
}

