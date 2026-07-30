// component/modals/ImageUploader.jsx
import ewan from '../../assets/images/default.png';

export const ImageUploader = ({ previewUrl, removeImage, handleImageChange }) => {
    return (
        <div className="relative w-full rounded-md bg-neutral-950 border border-neutral-700 p-2.5 mb-2">
            
            {/* ✅ Images Container - Scrollable */}
            <div 
                className="flex flex-nowrap items-center gap-2.5 overflow-x-auto overflow-y-hidden select-none pb-2"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehaviorX: 'contain',
                    overscrollBehaviorY: 'auto',
                    maxHeight: '180px'
                }}
            >
                {previewUrl.length === 0 && (
                    <div className="w-full overflow-hidden rounded-md border border-neutral-800 opacity-50 flex-shrink-0">
                        <img
                            src={ewan}
                            alt="default"
                            className="w-[460px] h-[160px] object-cover"
                        />
                    </div>
                )}

                {previewUrl.map((url, index) => (
                    <div key={index} className="relative flex-shrink-0 m-2">
                        <img
                            src={url}
                            alt="Preview"
                            className="w-[160px] h-[160px] object-cover rounded-lg border border-amber-500 shadow-md"
                        />
                        <button
                            type="button"
                            className="absolute -top-2.5 -right-2.5 h-7 w-7 rounded-full bg-[#dc3545] text-white font-bold text-lg shadow-md hover:bg-[#bb2d3b] hover:scale-110 transition-all duration-200 ease-in-out flex items-center justify-center pb-0.5 focus:outline-none z-10"
                            onClick={() => removeImage(index)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            {/* ✅ Camera Button - Nasa LABAS ng scroll container! */}
            {previewUrl.length < 5 && (
                <div className="absolute bottom-3 right-3 z-20">
                    <label htmlFor="file-input" className="cursor-pointer">
                        <div className="h-11 w-11 rounded-full bg-black/70 text-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 backdrop-blur-sm border-2 border-amber-500/50 shadow-lg">
                            📷
                        </div>
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>
            )}
        </div>
    );
};