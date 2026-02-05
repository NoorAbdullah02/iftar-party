import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
const LandingPage = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const heroRef = useRef(null);
    const featuresRef = useRef(null);

    const foodMenu = [
        { name: 'খিচুড়ি', icon: '🍛', description: 'ঐতিহ্যবাহী বাংলা খিচুড়ি' },
        { name: 'চিকেন রোস্ট', icon: '🍗', description: 'মসলাদার চিকেন রোস্ট' },
        { name: 'বিফ কারি', icon: '🍖', description: 'সুস্বাদু বিফ কারি' },
        { name: 'সালাদ', icon: '🥗', description: 'তাজা সবজির সালাদ' },
        { name: 'ডিম', icon: '🥚', description: 'সিদ্ধ ডিম' },
        { name: 'ডেজার্ট / মিষ্টি', icon: '🍰', description: 'মিষ্টি জাতীয় খাবার' },
        { name: 'সফট ড্রিংকস / পানি', icon: '🥤', description: 'পানীয়' }
    ];

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className="min-h-screen bg-green-50 overflow-hidden relative">
            {/* Subtle Pattern Background */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#166534 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* Hero Section */}
            <div ref={heroRef} className="relative z-10 container mx-auto px-4 pt-24 pb-20">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Title */}
                    <div className="mb-10 bg-white/95 backdrop-blur-sm p-8 rounded-3xl border border-green-200 shadow-sm inline-block">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-black mb-4 leading-tight">
                            ইফতার পার্টি – ২০২৬
                        </h1>
                        <div className="space-y-4 py-2">
                            <p className="text-3xl md:text-4xl font-black text-black">ICE Department</p>
                            <p className="text-xl md:text-2xl text-black font-bold">Information & Communication Engineering</p>
                        </div>
                    </div>

                    <div className="flex justify-center mb-10">
                        {/* Fee Badge */}
                        <div className="bg-emerald-700 text-white px-12 py-6 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 border-4 border-emerald-500">
                            <p className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                                <span>🎫</span>
                                <span className="text-white">রেজিস্ট্রেশন ফি: ৪৫০ টাকা</span>
                            </p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <button
                            onClick={() => navigate('/iftar-register')}
                            className="bg-green-800 text-white px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-green-900 transition-colors border-2 border-green-700 w-full sm:w-auto"
                        >
                            👉 রেজিস্ট্রেশন করুন
                        </button>

                        <button
                            onClick={toggleMenu}
                            className="bg-white text-green-900 px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-gray-50 transition-colors border-2 border-green-800 w-full sm:w-auto"
                        >
                            🍽️ খাবারের মেনু দেখুন
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex justify-center gap-8 text-5xl opacity-80">
                        <span className="animate-bounce" style={{ animationDuration: '2s' }}>🌿</span>
                        <span className="animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}>🍃</span>
                        <span className="animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.4s' }}>🦜</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div ref={featuresRef} className="relative z-10 container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="feature-card bg-white rounded-3xl p-8 shadow-2xl hover:shadow-green-500/30 transform hover:-translate-y-3 transition-all duration-300 border-4 border-green-200">
                        <div className="text-6xl mb-6">🎉</div>
                        <h3 className="text-3xl font-black text-black mb-4">মজার পরিবেশ</h3>
                        <p className="text-black leading-relaxed text-lg font-bold">
                            সকল ব্যাচের সাথে একসাথে আনন্দময় সময় কাটান
                        </p>
                    </div>

                    <div className="feature-card bg-white rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/30 transform hover:-translate-y-3 transition-all duration-300 border-4 border-emerald-200">
                        <div className="text-6xl mb-6">🍱</div>
                        <h3 className="text-3xl font-black text-black mb-4">সুস্বাদু খাবার</h3>
                        <p className="text-black leading-relaxed text-lg font-bold">
                            বাংলাদেশি ঐতিহ্যবাহী খাবারের সমারোহ
                        </p>
                    </div>

                    <div className="feature-card bg-white rounded-3xl p-8 shadow-2xl hover:shadow-teal-500/30 transform hover:-translate-y-3 transition-all duration-300 border-4 border-teal-200">
                        <div className="text-6xl mb-6">📸</div>
                        <h3 className="text-3xl font-black text-black mb-4">স্মৃতি সংরক্ষণ</h3>
                        <p className="text-black leading-relaxed text-lg font-bold">
                            অবিস্মরণীয় মুহূর্তগুলো ক্যামেরায় বন্দি করুন
                        </p>
                    </div>
                </div>
            </div>

            {/* Food Menu Panel */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                    onClick={toggleMenu}
                >
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-green-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-green-700 to-emerald-700 text-white p-10 rounded-t-3xl z-10 border-b-4 border-green-400">
                            <button
                                onClick={toggleMenu}
                                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/30 rounded-full transition-colors duration-200 cursor-pointer z-50 backdrop-blur-sm"
                                aria-label="Close menu"
                            >
                                <X className="w-8 h-8 text-white drop-shadow-md" />
                            </button>
                            <h2 className="text-5xl font-black mb-3 drop-shadow-lg">🍽️ ইফতারের খাবারের মেনু</h2>
                            <p className="text-green-100 text-xl font-semibold">ইফতার পার্টি – ২০২৬ | ICE Department</p>
                        </div>

                        {/* Menu Grid */}
                        <div className="p-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {foodMenu.map((item, index) => (
                                    <div
                                        key={index}
                                        className="menu-card group bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 hover:scale-105 transition-all duration-300 border-4 border-green-200 hover:border-green-400 cursor-pointer"
                                    >
                                        <div className="text-7xl mb-5 group-hover:scale-125 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-black mb-3">
                                            {item.name}
                                        </h3>
                                        <p className="text-black text-base font-bold">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Note */}
                            <div className="mt-10 p-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl text-center border-4 border-green-300">
                                <p className="text-black text-xl font-black">
                                    🌿 সকল খাবার তাজা এবং স্বাস্থ্যসম্মত উপায়ে প্রস্তুত করা হবে
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="relative z-10 text-center py-12 px-4">
                <p className="text-black text-lg mb-2 font-bold">
                    যেকোনো প্রশ্নের জন্য যোগাযোগ করুন
                </p>
                <p className="text-black font-semibold">
                    © ২০২৬ ICE Department | All Rights Reserved
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
