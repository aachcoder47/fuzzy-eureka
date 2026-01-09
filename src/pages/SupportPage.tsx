import { Mail, Phone, MessageCircle, FileText } from 'lucide-react';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        How can we help?
                    </h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                        Reach out directly via WhatsApp, Email, or book a demo.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {/* Direct Contact Links */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Contact Channels</h2>

                        <a
                            href="mailto:ritwikr850@gmail.com"
                            className="flex items-center space-x-4 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl hover:border-cyan-500/50 transition-colors group"
                        >
                            <div className="p-4 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                                <Mail className="w-8 h-8 text-cyan-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">Email Us</h3>
                                <p className="text-slate-400">ritwikr850@gmail.com</p>
                            </div>
                        </a>

                        <a
                            href="https://calendly.com/aachcoder47/ritwikraj8908"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-4 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl hover:border-purple-500/50 transition-colors group"
                        >
                            <div className="p-4 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                                <Phone className="w-8 h-8 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">Schedule Call</h3>
                                <p className="text-slate-400">Book a demo via Calendly</p>
                            </div>
                        </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Instant Actions</h2>

                        <a
                            href="https://wa.me/917462085177?text=Hi,%20I%20am%20interested%20in%20Futuristic%20AI%20Solutions."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-6 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-lg shadow-green-500/20 hover:scale-[1.02]"
                        >
                            <MessageCircle className="w-8 h-8" />
                            <span className="text-lg">Chat on WhatsApp</span>
                        </a>

                        <a
                            href="https://form.typeform.com/to/DDS88AsN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-6 rounded-2xl transition-all flex items-center justify-center space-x-3 border border-slate-700 hover:border-slate-600 hover:scale-[1.02]"
                        >
                            <FileText className="w-8 h-8 text-gray-400" />
                            <span className="text-lg">Fill Inquiry Form</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
