interface Options {
    patientId: string
    phoneNumber: string
    hasWhatsApp: boolean
}

export function share(options: Options) {
    window.open(
        `https://api.whatsapp.com/send?phone=+244${options.phoneNumber}&text=${encodeURIComponent(buildLink(options))}`,
        '_blank'
    )
}

export function copy(options: Options) {
    navigator.clipboard.writeText(buildLink(options))
    alert('Link para o tutor copiado com sucesso.')
}

export function shareOrCopy(options: Options) {
    if (!options.hasWhatsApp) {
        copy(options)
        return
    }

    share(options)
}


function buildLink(options: Options) {
    return `${window.location.origin}/reports?patientId=${options.patientId}`
}
