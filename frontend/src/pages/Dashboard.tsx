import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Loader2, Image as ImageIcon, Copy, Download } from 'lucide-react';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    title: '',
    product_name: '',
    target_audience: '',
    platform: 'Instagram',
    tone: 'Professional',
    keywords: '',
    cta: '',
    product_description: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [polling, setPolling] = useState(false);

  const platforms = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'];
  const tones = ['Professional', 'Luxury', 'Funny', 'Corporate', 'Startup', 'Urgent'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/content/generate', formData);
      setResult(res.data);
      if (res.data.status === 'Pending') {
        setPolling(true);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (polling && result?.generation_id) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/content/status/${result.generation_id}`);
          if (res.data.status === 'Completed' || res.data.status === 'Failed') {
            setResult((prev: any) => ({ ...prev, ...res.data }));
            setPolling(false);
            setLoading(false);
            clearInterval(interval);
          }
        } catch (error) {
          console.error(error);
          setPolling(false);
          setLoading(false);
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [polling, result?.generation_id]);

  const copyToClipboard = () => {
    if (result?.generated_text) {
      navigator.clipboard.writeText(result.generated_text);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">✨</span>
            Campaign Brief
          </h3>
          
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-textMuted mb-2">Campaign Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50" placeholder="e.g. Summer Sale 2024" />
              </div>
              <div>
                <label className="block text-sm text-textMuted mb-2">Product Name</label>
                <input required type="text" value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50" placeholder="e.g. Neo Smartwatch" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-textMuted mb-2">Product Description</label>
              <textarea required rows={3} value={formData.product_description} onChange={e => setFormData({...formData, product_description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 resize-none" placeholder="Describe the product features..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-textMuted mb-2">Platform</label>
                <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 text-white">
                  {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-textMuted mb-2">Tone of Voice</label>
                <select value={formData.tone} onChange={e => setFormData({...formData, tone: e.target.value})} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 text-white">
                  {tones.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-textMuted mb-2">Target Audience</label>
                <input type="text" value={formData.target_audience} onChange={e => setFormData({...formData, target_audience: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50" placeholder="e.g. Gen Z Techies" />
              </div>
              <div>
                <label className="block text-sm text-textMuted mb-2">Call to Action (CTA)</label>
                <input type="text" value={formData.cta} onChange={e => setFormData({...formData, cta: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50" placeholder="e.g. Buy Now 50% Off" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Content'}
            </button>
          </form>
        </motion.div>

        {/* Result Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Image Result */}
          <div className="glass p-6 rounded-2xl flex-1 flex flex-col min-h-[400px]">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-secondary" />
              Generated Asset
            </h3>
            
            <div className="flex-1 bg-black/20 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center relative group">
              {loading && !result?.image_url ? (
                <div className="flex flex-col items-center text-textMuted">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                  <p>AI is generating your visual...</p>
                </div>
              ) : result?.image_url ? (
                <>
                  <img src={result.image_url} alt="Generated Ad" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={result.image_url} download target="_blank" rel="noreferrer" className="bg-white text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:scale-105 transition-transform">
                      <Download className="w-4 h-4" /> Download HD
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-textMuted">Your image will appear here.</p>
              )}
            </div>
          </div>

          {/* Text Result */}
          <div className="glass p-6 rounded-2xl relative group">
            <h3 className="text-xl font-bold mb-4">Generated Copy</h3>
            
            {result?.generated_text ? (
              <>
                <div className="bg-black/20 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap text-textMain border border-white/5">
                  {result.generated_text}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 h-[120px] flex items-center justify-center text-textMuted">
                {loading ? 'AI is writing your copy...' : 'Your optimized copy will appear here.'}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
