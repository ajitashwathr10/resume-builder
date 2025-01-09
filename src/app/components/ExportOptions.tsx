import {ResumeData, ResumeTemplate} from '../page'

type ExportOptionsProps = {
  readonly data: ResumeData
  readonly template: ResumeTemplate
};

export default function ExportOptions({data, template}: ExportOptionsProps) {
  const exportAsPDF = () => {
    console.log('Exporting as PDF: ', data, template)
  }
  const exportAsWord = () => {
    console.log('Exporting as Word: ', data, template)
  }
  return (
    <div className = 'mt-6 space-x-4'>
      <button
        onClick = {exportAsPDF}
        className = 'bg-black text-white px-4 py-2 rounded hover:bg-gray-800'
      >
        Export as PDF
      </button>
      <button
        onClick = {exportAsWord}
        className = 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300'
      >
        Export as WORD
      </button>
    </div>
  )
};

