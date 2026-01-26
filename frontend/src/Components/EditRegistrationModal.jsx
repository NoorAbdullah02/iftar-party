import { useState, useEffect } from 'react';
import { X, Save, User, Phone, Mail, GraduationCap } from 'lucide-react';

const EditRegistrationModal = ({ registration, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        batch: '',
        mobile: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (registration) {
            setFormData({
                name: registration.name || '',
                department: registration.department || 'ICE',
                batch: registration.batch || '',
                mobile: registration.mobile || '',
                email: registration.email || ''
            });
        }
    }, [registration]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onUpdate(registration.id, formData);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border-4 border-green-400 overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-700 to-emerald-700 p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        ✏️ তথ্য পরিবর্তন করুন
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4 text-emerald-600" />
                            নাম
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-semibold text-gray-800"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-emerald-600" />
                                ডিপার্টমেন্ট
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-semibold text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-emerald-600" />
                                ব্যাচ
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-semibold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-emerald-600" />
                            মোবাইল
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-semibold text-gray-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-emerald-600" />
                            ইমেইল
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-semibold text-gray-800"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200 transition-all"
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition-all flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    সংরক্ষণ করুন
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRegistrationModal;
