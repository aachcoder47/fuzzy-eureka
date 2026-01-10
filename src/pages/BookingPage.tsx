
import { Clock, ArrowLeft, CheckCircle, Video, Users, Zap } from 'lucide-react';

interface BookingPageProps {
    onNavigate: (page: string) => void;
}

export default function BookingPage({ onNavigate }: BookingPageProps) {
    // No local state needed for iframe embed

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header / Hero */}
            <div className="bg-slate-900 text-white pt-24 pb-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-cyan-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[80%] bg-blue-600 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <button
                        onClick={() => onNavigate('home')}
                        className="flex items-center space-x-2 text-slate-300 hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </button>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 mb-6">
                                <Video size={16} className="text-cyan-400" />
                                <span className="text-sm font-medium text-cyan-100">30-Minute Strategy Session</span>
                            </div>
                            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                                Unlock Your Business's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Full Potential</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                Book a personalized demo with our experts. We'll show you exactly how our AI solutions can drive growth, efficiency, and revenue for your specific use case.
                            </p>

                            <div className="space-y-4">
                                {[
                                    'Deep dive into your specific challenges and goals',
                                    'Live walkthrough of platform features tailored to you',
                                    'Custom implementation roadmap and ROI analysis'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                                        <span className="text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Visual or Trust */}
                        <div className="hidden md:grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/40 p-6 rounded-2xl backdrop-blur-sm border border-slate-700">
                                <Users className="text-cyan-400 mb-4" size={32} />
                                <div className="text-3xl font-bold mb-1">10k+</div>
                                <div className="text-sm text-slate-400">Teams Enabled</div>
                            </div>
                            <div className="bg-slate-800/40 p-6 rounded-2xl backdrop-blur-sm border border-slate-700">
                                <Zap className="text-yellow-400 mb-4" size={32} />
                                <div className="text-3xl font-bold mb-1">300%</div>
                                <div className="text-sm text-slate-400">Avg ROI</div>
                            </div>
                            <div className="col-span-2 bg-slate-800/40 p-6 rounded-2xl backdrop-blur-sm border border-slate-700 flex items-center justify-between">
                                <div>
                                    <div className="text-orange-400 font-bold mb-1">LIMITED AVAILABILITY</div>
                                    <div className="text-sm text-slate-400">Only 4 slots left for this week</div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center animate-pulse">
                                    <Clock size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Booking Interface */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 mb-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[700px] flex flex-col relative">
                    {/* Loader to show while iframe loads */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-0">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                    </div>

                    {/* Calendly Inline Widget */}
                    <iframe
                        src="https://calendly.com/aachcoder47/ritwikraj8908?hide_gdpr_banner=1&background_color=ffffff&text_color=0f172a&primary_color=0891b2"
                        width="100%"
                        height="700"
                        frameBorder="0"
                        className="relative z-10"
                        title="Schedule a Demo"
                    ></iframe>
                </div>
            </div>

            {/* Footer / Trust badges */}
            <div className="max-w-7xl mx-auto px-4 pb-12 text-center text-gray-400">
                <p className="text-sm mb-4">Trusted by innovative teams worldwide</p>
                <div className="flex justify-center flex-wrap gap-8 opacity-50 grayscale transition-all hover:grayscale-0">
                    {/* Simple text placeholders for logos */}
                    <span className="text-xl font-bold font-serif">ACME Corp</span>
                    <span className="text-xl font-bold font-mono">GlobalTech</span>
                    <span className="text-xl font-bold font-sans">Nebula</span>
                    <span className="text-xl font-bold">Vortex.ai</span>
                </div>
            </div>

        </div>
    );
}
