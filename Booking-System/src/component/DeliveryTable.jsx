export const DeliveryTable = ({ municipalities = [] }) => {
    const groups = municipalities.reduce((acc, item) => {
        const key = item.fee;
        
        if (!acc[key]) acc[key] = [];
        acc[key].push(item.municipality);  
        
        return acc;
    }, {});

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-text-primary">
                Delivery Fees Table
            </h2>

            <div className="overflow-x-auto rounded-xl shadow-lg border border-border">
                <table className="w-full text-center border-collapse bg-bg-card">
                    <thead>
                        <tr className="bg-lime-600 text-white font-bold border-b border-border">
                            <th className="px-6 py-3.5 text-sm uppercase tracking-wider border-r border-lime-500/30">
                                Municipality
                            </th>
                            <th className="px-6 py-3.5 text-sm uppercase tracking-wider">
                                Delivery Fee
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border text-text-secondary">
                        {Object.entries(groups).map(([fee, municipalities]) => (
                            <tr key={fee} className="hover:bg-bg-hover transition-colors">
                                <td className="px-4 py-1.5 text-xs font-semibold border-r border-border text-center text-text-primary">
                                    {municipalities.join(' / ')}
                                </td>
                                <td className="px-4 py-1.5 text-xs font-bold text-lime-400 whitespace-nowrap">
                                    ₱{fee}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};