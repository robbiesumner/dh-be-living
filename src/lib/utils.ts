export function formatDate(date: Date | string | null | undefined): string {
	if (!date) return 'Unbekannt';
	const d = new Date(date);
	return d.toLocaleDateString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit'
	});
}
