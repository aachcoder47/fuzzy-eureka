import { useState } from 'react';
import { Clock, ArrowLeft, CheckCircle, Video, Users, Zap } from 'lucide-react';

interface BookingPageProps {
    onNavigate: (page: string) => void;
}

export default function BookingPage({ onNavigate }: BookingPageProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState<'calendar' | 'form' | 'success'>('calendar');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        topic: ''
    });

    // Simulated future dates
    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
    });

    const timeSlots = [
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setStep('success');
        }, 1000);
    };

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
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                    {step !== 'success' && (
                        <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-between">
                            <div>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                    {/* Avatar placeholder */}
                                    <div className="text-2xl font-bold text-blue-600">R</div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Ritwik Raj</h3>
                                <p className="text-gray-500 mb-6">Senior Product Specialist</p>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Clock size={16} />
                                        <span>30 min</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Video size={16} />
                                        <span>Google Meet</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 text-xs text-slate-400">
                                &copy; 2024 Futuristic AI. All rights reserved.
                            </div>
                        </div>
                    )}

                    <div className={`flex-1 p-8 ${step === 'success' ? 'w-full' : ''}`}>

                        {step === 'calendar' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Date & Time</h2>

                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">January 2026</h4>
                                    <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
                                        {dates.map((date, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedDate(date)}
                                                className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center border transition-all ${selectedDate?.toDateString() === date.toDateString()
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
                                                    : 'bg-white border-slate-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                                                    }`}
                                            >
                                                <span className="text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                <span className="text-xl font-bold">{date.getDate()}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedDate && (
                                    <div className="animate-fade-in-up">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Available Times</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => {
                                                        setSelectedTime(time);
                                                        setStep('form');
                                                    }}
                                                    className="py-3 px-4 rounded-xl border border-blue-200 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-colors text-center"
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 'form' && (
                            <div className="animate-fade-in">
                                <button
                                    onClick={() => setStep('calendar')}
                                    className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-900"
                                >
                                    <ArrowLeft size={14} className="mr-1" /> Back to Calendar
                                </button>

                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Details</h2>
                                <p className="text-gray-500 mb-6">
                                    You are booking for <span className="font-semibold text-gray-900">{selectedDate?.toLocaleDateString()}</span> at <span className="font-semibold text-gray-900">{selectedTime}</span>.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">First & Last Name</label>
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Company Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="john@company.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Company Website</label>
                                        <input
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="www.yourcompany.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">What would you like to discuss?</label>
                                        <textarea
                                            rows={3}
                                            value={formData.topic}
                                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="I'm interested in..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all mt-4"
                                    >
                                        Confirm Booking
                                    </button>
                                </form>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                                <p className="text-gray-600 mb-8 max-w-md">
                                    We've sent a calendar invitation to <strong>{formData.email}</strong>. We look forward to speaking with you on {selectedDate?.toLocaleDateString()} at {selectedTime}.
                                </p>
                                <button
                                    onClick={() => onNavigate('home')}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all"
                                >
                                    Return to Home
                                </button>
                            </div>
                        )}

                    </div>
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
