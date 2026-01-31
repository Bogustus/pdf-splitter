import { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { splitPdfAndZip, getPdfDetails } from './utils/pdfUtils';
import { FileText, Scissors, RefreshCw, CheckCircle, SplitSquareHorizontal, Layers } from 'lucide-react';

interface PdfInfo {
  name: string;
  pages: number;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [mode, setMode] = useState<'all' | 'range'>('all');
  const [ranges, setRanges] = useState('');

  const onFileSelect = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      // Quickly get details
      const details = await getPdfDetails(selectedFile);
      setPdfInfo({ name: selectedFile.name, pages: details.pageCount });
    } catch (e) {
      console.error(e);
      alert("Error reading PDF. Please ensure it is a valid PDF file.");
      setFile(null);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setCompleted(false);
    try {
      await splitPdfAndZip(
        file,
        { mode, ranges },
        (p) => setProgress(p)
      );
      setCompleted(true);
    } catch (e) {
      console.error(e);
      alert("Error splitting PDF: " + (e as any).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPdfInfo(null);
    setCompleted(false);
    setProgress(0);
    setRanges('');
    setMode('all');
  }

  return (
    <div className="app-container">
      <header className="header fade-in">
        <div className="container flex items-center gap-4">
          <div className="logo-icon">
            <Scissors size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>PDF Splitter</h1>
        </div>
      </header>

      <main className="container main-content fade-in">
        {!file ? (
          <div className="upload-section">
            <div className="text-center mb-8">
              <h2 className="title-lg">Split PDF files simply and securely.</h2>
              <p className="subtitle">All processing happens in your browser. No files are uploaded.</p>
            </div>
            <FileUploader onFileSelect={onFileSelect} />
          </div>
        ) : (
          <div className="card split-interface fade-in">
            <div className="file-info flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="file-icon">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{pdfInfo?.name}</h3>
                  <p className="text-muted">{pdfInfo?.pages} Pages</p>
                </div>
              </div>
              <button onClick={reset} className="btn-secondary" disabled={isProcessing}>
                <RefreshCw size={18} style={{ marginRight: '0.5rem' }} />
                Change File
              </button>
            </div>

            {!completed ? (
              <>
                <div className="options-grid mb-8">
                  <div
                    className={`option-card ${mode === 'all' ? 'selected' : ''}`}
                    onClick={() => setMode('all')}
                  >
                    <div className="check-indicator"></div>
                    <Layers size={24} className="mb-2" />
                    <h4>Extract All Pages</h4>
                    <p>Save every page as a separate PDF file.</p>
                  </div>
                  <div
                    className={`option-card ${mode === 'range' ? 'selected' : ''}`}
                    onClick={() => setMode('range')}
                  >
                    <div className="check-indicator"></div>
                    <SplitSquareHorizontal size={24} className="mb-2" />
                    <h4>Custom Range</h4>
                    <p>Extract specific pages (e.g. 1-5, 8, 10-12).</p>
                  </div>
                </div>

                {mode === 'range' && (
                  <div className="mb-8 fade-in">
                    <label className="block mb-2 font-medium">Page Ranges</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 1-3, 5, 7-9"
                      value={ranges}
                      onChange={(e) => setRanges(e.target.value)}
                    />
                    <p className="text-sm text-muted mt-2">Comma separated. Use hyphen for ranges.</p>
                  </div>
                )}

                <div className="action-area">
                  {isProcessing ? (
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="text-center mt-2 font-medium">Processing... {progress}%</p>
                    </div>
                  ) : (
                    <button
                      className="btn-primary full-width text-lg justify-center transform-gpu active:scale-95"
                      onClick={handleSplit}
                      style={{ padding: '1rem' }}
                    >
                      <Scissors size={20} />
                      Split PDF
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="success-state text-center fade-in py-8">
                <div className="success-icon mb-4">
                  <CheckCircle size={64} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Success!</h2>
                <p className="text-muted mb-8">Your PDF has been split and downloaded.</p>
                <button className="btn-primary" onClick={reset}>
                  Split Another PDF
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer text-center p-8 text-muted">
        <p>&copy; 2024 PDF Splitter. Local Secure Processing.</p>
      </footer>

      <style>{`
        .app-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .header {
            background: var(--surface-color);
            border-bottom: 1px solid var(--border-color);
            padding: 1.5rem 0;
            margin-bottom: 3rem;
        }
        .logo-icon {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
            padding: 0.5rem;
            border-radius: 0.5rem;
            display: flex;
        }
        .main-content {
            flex: 1;
            width: 100%;
        }
        .title-lg {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(to right, var(--text-main), var(--primary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.025em;
        }
        .subtitle {
            font-size: 1.125rem;
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto;
        }
        .file-icon {
            background: #eff6ff;
            color: var(--primary-color);
            padding: 1rem;
            border-radius: var(--radius-md);
        }
        .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }
        @media (max-width: 640px) {
            .options-grid { grid-template-columns: 1fr; }
        }
        .option-card {
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }
        .option-card:hover {
            border-color: var(--primary-color);
            background: var(--bg-color);
        }
        .option-card.selected {
            border-color: var(--primary-color);
            background: rgba(99, 102, 241, 0.05);
            box-shadow: 0 0 0 1px var(--primary-color);
        }
        .check-indicator {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 1.25rem;
            height: 1.25rem;
            border: 2px solid var(--border-color);
            border-radius: 50%;
        }
        .option-card.selected .check-indicator {
            border-color: var(--primary-color);
            background: var(--primary-color);
            box-shadow: inset 0 0 0 3px white;
        }
        .input-field {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
            background: var(--bg-color);
            color: var(--text-main);
        }
        .input-field:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .progress-bar {
            height: 0.5rem;
            background: var(--border-color);
            border-radius: 999px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: var(--primary-color);
            transition: width 0.3s ease;
        }
        .success-icon {
            color: var(--success-color);
            display: inline-block;
            animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default App;
