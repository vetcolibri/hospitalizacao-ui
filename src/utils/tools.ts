const date = new Date()

export function makeToday(): string {
    const yearFormat = new Intl.DateTimeFormat("pt-PT", {
        year: "numeric",
    });
    const monthFormat = new Intl.DateTimeFormat("pt-PT", {
        month: "short",
    });
    const dayFormat = new Intl.DateTimeFormat("pt-PT", {
        day: "2-digit",
    });
    return `${dayFormat.format(date)} ${monthFormat.format(date)} ${yearFormat.format(date)}`
}

export function makeHour(): string {
    const hourFormat = new Intl.DateTimeFormat("pt-PT", {
        timeStyle: "short"
    })
    return hourFormat.format(date)
}