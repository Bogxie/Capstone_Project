// component/modals/ImageUploader.jsx
import ewan from '../../assets/images/default.png';

export const ImageUploader = ({ previewUrl, removeImage, handleImageChange }) => {
    return (
        <div className="relative w-full rounded-lg bg-[#23262f] border border-[#3a3d48] p-2.5 mb-2">
            
            {/* Images Container - Scrollable */}
            <div 
                className="flex flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden select-none pb-2 pt-1 hide-scrollbar"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehaviorX: 'contain',
                    overscrollBehaviorY: 'auto',
                    maxHeight: '160px'
                }}
            >
                {previewUrl.length === 0 && (
                    <div className="w-full overflow-hidden rounded-md border border-[#3a3d48] opacity-40 flex-shrink-0">
                        <img
                            src={ewan}
                            alt="default"
                            className="w-full h-[140px] object-cover"
                        />
                    </div>
                )}

                {previewUrl.map((url, index) => (
                    <div key={index} className="relative flex-shrink-0 pt-2 pr-2">
                        <img
                            src={url}
                            alt="Preview"
                            className="w-[120px] h-[120px] object-cover rounded-lg border-2 border-[#b6ff2e]/50 shadow-md"
                        />
                        <button
                            type="button"
                            className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white font-bold text-xs shadow-md hover:bg-red-600 hover:scale-110 transition-all duration-200 ease-in-out flex items-center justify-center focus:outline-none z-10"
                            onClick={() => removeImage(index)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Camera Button */}
            {previewUrl.length < 5 && (
                <div className="absolute bottom-2 right-2 z-20">
                    <label htmlFor="file-input" className="cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-[#23262f]/80 text-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 border-2 border-[#b6ff2e]/50 shadow-lg hover:border-[#b6ff2e]">
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