import React, { useState } from 'react';

function App() {
  // 1. THE STATE
  const [templateTab, setTemplateTab] = useState('link'); // 'link' or 'file'
  const [listTab, setListTab] = useState('link');         // 'link' or 'file'
  
  // NEW: Loading and PDF tracking states
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isMassSending, setIsMassSending] = useState(false);

  const [formData, setFormData] = useState({
    eventName: '',
    winnerTemplateLink: '',
    participantTemplateLink: '',
    winnerTemplateFile: null,
    participantTemplateFile: null,
    sheetUrl: '',
    csvFile: null
  });

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleGenerateDemo = async () => {
    setIsLoading(true);
    setPdfUrl(null);

    const WEBHOOK_URL = "https://n8n.iamsherlock.online/webhook/demo-certificate";
    const payload = new FormData();

    payload.append("eventName", formData.eventName);
    payload.append("templateTypeUsed", templateTab);
    payload.append("listTypeUsed", listTab);

    if (templateTab === 'link') {
      payload.append("winnerTemplateLink", formData.winnerTemplateLink);
      payload.append("participantTemplateLink", formData.participantTemplateLink);
    } else {
      if (formData.winnerTemplateFile) payload.append("winnerTemplateFile", formData.winnerTemplateFile);
      if (formData.participantTemplateFile) payload.append("participantTemplateFile", formData.participantTemplateFile);
    }

    if (listTab === 'link') {
      payload.append("sheetUrl", formData.sheetUrl);
    } else {
      if (formData.csvFile) payload.append("csvFile", formData.csvFile);
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        console.error("n8n rejected the package. Status:", response.status);
      }
    } catch (error) {
      console.error("Network error!", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMassDistribution = async () => {
  setIsMassSending(true);

  const FRIEND_WEBHOOK_URL = "https://nothingxd77.app.n8n.cloud/webhook-test/certify";

  const payload = new FormData();

  /* ✅ FIELD NAMES MATCH HIS N8N FORM EXACTLY */

  payload.append("Add Event name", formData.eventName);

  if (templateTab === "link") {
    payload.append("Winners template", formData.winnerTemplateLink);
    payload.append("Participants Template", formData.participantTemplateLink);
  } else {
    // if he ever enables file upload later
    payload.append("Winners template", formData.winnerTemplateFile);
    payload.append("Participants Template", formData.participantTemplateFile);
  }

  if (listTab === "link") {
    payload.append("Add spreadsheet link", formData.sheetUrl);
  } else {
    payload.append("Add spreadsheet link", formData.csvFile);
  }

  try {
    const response = await fetch(FRIEND_WEBHOOK_URL, {
      method: "POST",
      body: payload,

    });

    if (response.ok) {
      alert("Mass distribution triggered successfully.");
    } else {
      console.error("Failed:", response.status);
      alert("Server rejected request.");
    }
  } catch (error) {
    console.error("Network error:", error);
  } finally {
    setIsMassSending(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans flex flex-col items-center">
      
      <header className="text-center mb-10 w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white mb-2">Certificate Generator</h1>
        <p className="text-slate-400">Coordinator Portal</p>
      </header>

      <div className="w-full max-w-4xl space-y-8">

        {/* SECTION 1: Event Name */}
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <label className="block text-lg font-bold text-white mb-3">1. Event Name</label>
          <input 
            name="eventName"
            onChange={handleTextChange}
            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg transition" 
            placeholder="e.g., Spring Hackathon 2026" 
          />
        </div>

        {/* SECTION 2: Certificate Templates */}
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">2. Certificate Templates</h2>
          
          <div className="flex bg-slate-900 p-1 rounded-xl w-full max-w-md mb-6 border border-slate-700">
            <button
              onClick={() => setTemplateTab('link')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${templateTab === 'link' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Google Slides Links
            </button>
            <button
              onClick={() => setTemplateTab('file')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${templateTab === 'file' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Upload Template Files
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[90px]">
            {templateTab === 'link' ? (
              <>
                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm font-medium mb-2 text-blue-400">Winner Template URL</label>
                  <input name="winnerTemplateLink" onChange={handleTextChange} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="https://docs.google.com/presentation/d/..." />
                </div>
                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm font-medium mb-2 text-blue-400">Participant Template URL</label>
                  <input name="participantTemplateLink" onChange={handleTextChange} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="https://docs.google.com/presentation/d/..." />
                </div>
              </>
            ) : (
              <>
                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm font-medium mb-2 text-emerald-400">Upload Winner Template (.pptx)</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-2 bg-slate-900"><input type="file" name="winnerTemplateFile" onChange={handleFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500/10 file:text-emerald-400 cursor-pointer" /></div>
                </div>
                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm font-medium mb-2 text-emerald-400">Upload Participant Template (.pptx)</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-2 bg-slate-900"><input type="file" name="participantTemplateFile" onChange={handleFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500/10 file:text-emerald-400 cursor-pointer" /></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* SECTION 3: Participant List */}
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">3. Participant List</h2>
          
          <div className="flex bg-slate-900 p-1 rounded-xl w-full max-w-md mb-6 border border-slate-700">
            <button
              onClick={() => setListTab('link')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${listTab === 'link' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Google Sheet Link
            </button>
            <button
              onClick={() => setListTab('file')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${listTab === 'file' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Upload File
            </button>
          </div>

          <div className="min-h-[90px]">
            {listTab === 'link' ? (
              <div className="animate-in fade-in duration-300">
                <input name="sheetUrl" onChange={handleTextChange} className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Paste Google Sheet URL..." />
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="border-2 border-dashed border-slate-600 hover:border-emerald-500 transition rounded-xl p-4 text-center bg-slate-900">
                  <input 
                    type="file" 
                    name="csvFile" 
                    accept=".csv, .xlsx, .xls" 
                    onChange={handleFileChange} 
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer transition" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button 
            onClick={handleGenerateDemo}
            disabled={isLoading}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition ${
              isLoading 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
            }`}>
            {isLoading ? "Generating Demo..." : "Generate Demo"}
          </button>
          
          <button 
  onClick={handleMassDistribution}
  disabled={isMassSending}
  className={`flex-1 py-4 rounded-xl font-bold text-lg transition ${
    isMassSending
      ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
      : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'
  }`}>
  {isMassSending ? "Sending Certificates..." : "Execute Mass Distribution"}
</button>
        </div>

        {/* UPDATED SECTION 5: Etched PDF Preview */}
        {pdfUrl && (
          <div className="w-full max-w-5xl mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
              
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Live Preview: Demo Certificate
                </h2>
                <a 
                  href={pdfUrl} 
                  download={`${formData.eventName || 'Demo'}_Certificate.pdf`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-blue-900/40"
                >
                  Download PDF
                </a>
              </div>

              {/* Responsive Iframe Container */}
              <div className="relative w-full bg-slate-900" style={{ paddingBottom: '70.71%' }}>
                <iframe 
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                  className="absolute top-0 left-0 w-full h-full border-none"
                  title="Certificate Preview" 
                />
              </div>
            </div>
            
            <p className="text-center text-slate-500 text-sm mt-4">
              This is a generated preview for <b>{formData.csvFile || formData.sheetUrl ? "the first participant in your list" : "the selected recipient"}</b>. 
              Execute Mass Distribution to send to all participants.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;