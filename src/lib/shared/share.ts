interface Options {
    patientId: string
    ownerId: string
    hospitalizationId: string
    phoneNumber: string
}

export function share(options: Options) {
    window.open(
        `https://api.whatsapp.com/send?phone=${options.phoneNumber}&text=${encodeURIComponent(buildLink(options))}`,
        '_blank'
    )
}

export function copy(options: Options) {
    navigator.clipboard.writeText(buildLink(options))
    alert('Link para o tutor copiado')
}

function buildLink(options: Options) {
    return `${window.location.origin}/resume?patientId=${options.patientId}&ownerId=${options.ownerId}&hospitalizationId=${options.hospitalizationId}`
}
