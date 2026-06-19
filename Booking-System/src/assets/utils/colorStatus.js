export const colorStatus = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-400 font-bold rounded-full px-3 py-1 text-white';
    case 'Confirmed':
      return 'bg-sky-500 font-bold rounded-full px-3 py-1 text-white';
    case 'Complete':
      return 'bg-green-500 font-bold rounded-full px-3 py-1 text-white';
    case 'Cancelled':
      return 'bg-red-500 font-bold rounded-full px-3 py-1 text-white';
    default:
      return '';
  }
}