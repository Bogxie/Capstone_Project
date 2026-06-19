export const DeliveryTable = ({ deliveryFee = [] }) => {

    const groups = deliveryFee.reduce((acc, item) => {
        const key = item.fee;

        if (!acc[key]) acc[key] = [];

        acc[key].push(item.municipality);

        return acc;
    }, {});

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Delivery Fees Table
            </h2>

            <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                <table className="w-full text-center border-collapse bg-white">

                    <thead>
                        <tr className="bg-amber-500 text-[#1e1e1e] font-bold border-b border-gray-200">
                            <th className="px-6 py-3.5 text-sm uppercase tracking-wider border-r border-amber-600/20">
                                Municipality
                            </th>
                            <th className="px-6 py-3.5 text-sm uppercase tracking-wider">
                                Delivery Fee
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 text-gray-700">
                        {Object.entries(groups).map(([fee, municipalities]) => (
                            <tr key={fee} className="hover:bg-amber-50/40 transition-colors">

                                <td className="px-4 py-1.5 text-xs font-semibold border-r border-gray-200 text-center">
                                    {municipalities.join(' / ')}
                                </td>

                                <td className="px-4 py-1.5 text-xs font-bold text-amber-600 whitespace-nowrap">
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