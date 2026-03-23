const escapeValue = (value) => {
    if (value === null || value === undefined) {
        return ''
    }

    const stringValue = String(value).replace(/"/g, '""')
    return `"${stringValue}"`
}

export const downloadCsv = (filename, rows, columns) => {
    const header = columns.map((column) => escapeValue(column.header)).join(',')
    const dataRows = rows.map((row) =>
        columns.map((column) => escapeValue(row[column.key])).join(',')
    )

    const csvContent = [header, ...dataRows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

