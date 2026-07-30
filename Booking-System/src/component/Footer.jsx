import { service } from '../assets/utils/services.js'

export const Footer = () => {
    const socials = [
        { icon: "bi bi-facebook", link: "#", label: "Facebook" },
        { icon: "bi bi-instagram", link: "#", label: "Instagram" },
        { icon: "bi bi-tiktok", link: "#", label: "TikTok" },
    ]

    return (
        <footer className="bg-bg-secondary border-t border-lime-500/30 dark:border-lime-600/50 mt-5">
            <div className="max-w-7xl mx-auto px-4 py-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">

                    <div className="text-center md:text-left">
                        <h5 className="font-bold text-lg tracking-wide">
                            <span className="text-text-primary">E-vent</span>
                            <span className="text-lime-500 dark:text-lime-400">Flow</span>
                        </h5>
                        <p className="text-xs text-text-secondary mt-0.5">Your event, our passion.</p>
                    </div>

                    <div className="flex justify-center gap-4">
                        {service.map((svc) => (
                            <div key={svc.brand} className="flex flex-col items-center gap-1">
                                <img
                                    src={svc.logo}
                                    alt={svc.brand}
                                    className="w-7 h-7 object-contain"
                                />
                                <span className="text-[10px] text-text-secondary tracking-tight">{svc.brand}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center md:justify-end gap-4">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                href={s.link}
                                className="text-text-secondary hover:text-lime-500 dark:hover:text-lime-400 transition-colors text-xl"
                                target="_blank"
                                rel="noreferrer"
                                title={s.label}
                            >
                                <i className={s.icon}></i>
                            </a>
                        ))}
                    </div>

                </div>

                <div className="border-t border-border dark:border-zinc-700 mt-5 pt-4 text-center">
                    <p className="text-xs text-text-muted dark:text-zinc-500">
                        &copy; {new Date().getFullYear()} E-vent Flow. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}