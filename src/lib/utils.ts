export const formatDate = (dateValue: number | Date) => {
	return new Intl.DateTimeFormat('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit'
	}).format(new Date(dateValue));
};
