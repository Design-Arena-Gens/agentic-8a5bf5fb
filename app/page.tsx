'use client'

import { useState } from 'react'

const PACK_TEMPLATES = {
  TR_INVOICE: {
    name: 'Turkish Invoice',
    description: 'Generates synthetic Turkish tax invoices (FATURA) with realistic headers, line items, and tax calculations',
    fields: ['company_name', 'tax_no', 'address', 'items', 'totals']
  },
  TR_ID_CARD: {
    name: 'Turkish ID Card',
    description: 'Generates synthetic Turkish Kimlik cards with realistic personal information',
    fields: ['tc_no', 'name', 'surname', 'birth_date', 'photo']
  },
  RECEIPT: {
    name: 'Receipt',
    description: 'Generates store receipts with items, prices, and timestamps',
    fields: ['store_name', 'items', 'total', 'date']
  },
  FORM_W2: {
    name: 'US W-2 Form',
    description: 'Generates synthetic US W-2 tax forms',
    fields: ['employer', 'employee', 'wages', 'taxes']
  },
  HANDWRITTEN_NOTE: {
    name: 'Handwritten Note',
    description: 'Generates synthetic handwritten text images',
    fields: ['text', 'style', 'paper_type']
  }
}

export default function Home() {
  const [userId, setUserId] = useState('')
  const [packName, setPackName] = useState('TR_INVOICE')
  const [count, setCount] = useState(10)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')

  const handleGenerate = async () => {
    setProcessing(true)
    setError('')
    setResult(null)
    setDownloadUrl('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          pack_name: packName,
          count: count,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setResult(data)
      if (data.download_url) {
        setDownloadUrl(data.download_url)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🏭 Synthetic Factory</h1>
        <p>Generate synthetic labeled datasets on-demand • Zero-GPU • CPU-Only</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Generate Dataset</h2>

        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            placeholder="Enter your user ID (used as random seed)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="packName">Data Pack Type</label>
          <select
            id="packName"
            value={packName}
            onChange={(e) => setPackName(e.target.value)}
          >
            {Object.entries(PACK_TEMPLATES).map(([key, pack]) => (
              <option key={key} value={key}>
                {pack.name}
              </option>
            ))}
          </select>
        </div>

        {packName && PACK_TEMPLATES[packName as keyof typeof PACK_TEMPLATES] && (
          <div className="pack-info">
            <h4>{PACK_TEMPLATES[packName as keyof typeof PACK_TEMPLATES].name}</h4>
            <p>{PACK_TEMPLATES[packName as keyof typeof PACK_TEMPLATES].description}</p>
            <p style={{ marginTop: '0.5rem' }}>
              <strong>Fields:</strong> {PACK_TEMPLATES[packName as keyof typeof PACK_TEMPLATES].fields.join(', ')}
            </p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="count">Number of Images</label>
          <input
            id="count"
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          />
        </div>

        <button
          className="btn"
          onClick={handleGenerate}
          disabled={processing || !userId}
        >
          {processing ? (
            <>
              Generating Dataset
              <span className="spinner"></span>
            </>
          ) : (
            'Generate Synthetic Data'
          )}
        </button>

        {processing && (
          <div className="status processing">
            <strong>Processing...</strong>
            <p>Generating {count} synthetic images for {packName}. This may take a few moments.</p>
          </div>
        )}

        {error && (
          <div className="status error">
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="status success">
            <strong>✓ Generation Complete!</strong>
            <div className="result">
              <h3>Dataset Summary</h3>
              <div className="result-item">
                <span>Status:</span>
                <strong>{result.status}</strong>
              </div>
              <div className="result-item">
                <span>Files Generated:</span>
                <strong>{result.file_count}</strong>
              </div>
              <div className="result-item">
                <span>ZIP Size:</span>
                <strong>{result.zip_size_MB} MB</strong>
              </div>
              <div className="result-item">
                <span>MD5 Checksum:</span>
                <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{result.md5}</strong>
              </div>
              {downloadUrl && (
                <a href={downloadUrl} download>
                  <button className="btn download-btn">
                    Download Dataset (.zip)
                  </button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>Features</h3>
        <ul style={{ lineHeight: '2', color: '#555' }}>
          <li>✨ Zero-GPU architecture - runs entirely on CPU</li>
          <li>🎯 Multiple synthetic data packs (invoices, IDs, receipts, forms)</li>
          <li>🏷️ Automatic labeling in COCO-JSON + TXT format</li>
          <li>📦 ZIP delivery with MD5 verification</li>
          <li>🔒 No real personal data - 100% synthetic</li>
          <li>⚡ Fast generation optimized for laptop performance</li>
        </ul>
      </div>
    </div>
  )
}
