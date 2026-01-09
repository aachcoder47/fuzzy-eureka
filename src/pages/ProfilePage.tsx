import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Building2, Phone, Mail, Loader2, Save, UserCircle } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '',
        company_name: '',
        phone: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    company_name: data.company_name || '',
                    phone: data.phone || '',
                    avatar_url: data.avatar_url || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    full_name: profile.full_name,
                    company_name: profile.company_name,
                    phone: profile.phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-cyan-500/10 rounded-xl">
                            <UserCircle className="w-8 h-8 text-cyan-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
                            <p className="text-slate-400">Manage your account settings and business information</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-cyan-500" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-outfit"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-cyan-500" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full bg-slate-800/20 border border-slate-700 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed font-outfit"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <Building2 className="w-4 h-4 mr-2 text-cyan-500" />
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.company_name}
                                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-outfit"
                                    placeholder="Enter your company name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-cyan-500" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-outfit"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-2 rounded-lg transition-all flex items-center shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
