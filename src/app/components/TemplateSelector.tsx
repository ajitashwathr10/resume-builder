import { ResumeTemplate } from '../page'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TemplateSelectorProps = Readonly<{
  onSelect: (template: ResumeTemplate) => void
  selected: ResumeTemplate
}>

export default function TemplateSelector({ onSelect, selected }: TemplateSelectorProps) {
  const templates: ResumeTemplate[] = ['entry-level', 'career-changer', 'mid-career', 'specialized', 'technical', 'executive', 'academic']

  return (
    <div className="mb-6">
      <Select onValueChange={onSelect} value={selected}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent className="bg-white"> 
          {templates.map((template) => (
            <SelectItem key={template} value={template}>
              {template.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
