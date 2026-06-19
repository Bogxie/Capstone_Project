import { service } from '../assets/utils/services.js'

export const Footer = () => {
    const socials = [
        { icon: "bi bi-facebook", link: "#", label: "Facebook" },
        { icon: "bi bi-instagram", link: "#", label: "Instagram" },
        { icon: "bi bi-tiktok", link: "#", label: "TikTok" },
    ]

    return (
        <footer className="bg-black border-t border-zinc-800 mt-5">
            <div className="max-w-7xl mx-auto px-4 py-6">
                
                {/* Main Row / Grid Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">

                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <h5 className="text-amber-400 font-bold text-lg tracking-wide">Lime Serenity</h5>
                        <p className="text-xs text-zinc-500 mt-0.5">Your event, our passion.</p>
                    </div>

                    {/* Service Logos Section */}
                    <div className="flex justify-center gap-4">
                        {service.map((svc) => (
                            <div key={svc.brand} className="flex flex-col items-center gap-1">
                                <img
                                    src={svc.logo}
                                    alt={svc.brand}
                                    className="w-7 h-7 object-contain"
                                />
                                <span className="text-[10px] text-zinc-500 tracking-tight">{svc.brand}</span>
                            </div>
                        ))}
                    </div>

                    {/* Social Media Links Section */}
                    <div className="flex justify-center md:justify-end gap-4">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                href={s.link}
                                className="text-zinc-500 hover:text-white transition-colors text-xl"
                                target="_blank"
                                rel="noreferrer"
                                title={s.label}
                            >
                                <i className={s.icon}></i>
                            </a>
                        ))}
                    </div>

                </div>

                {/* Bottom Copyright Section */}
                <div className="border-t border-zinc-900 mt-5 pt-4 text-center">
                    <p className="text-xs text-zinc-600">
                        &copy; {new Date().getFullYear()} Lime Serenity. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}