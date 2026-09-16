export interface PatientModel {
    systemId: string;
    patientId: string;
    name: string;
    specie: string;
    breed: string;
    status: string;
    birthDate: string;
    age: string;
    ownerId: string;
}

/**
 * Resultado da pesquisa unificada. Campos mínimos para escolher o paciente e
 * continuar o formulário; nunca telefone nem WhatsApp.
 */
export interface PatientSearchResultModel {
    systemId: string;
    patientId: string;
    patientName: string;
    ownerId: string;
    ownerName: string;
    specie: string;
    breed: string;
    birthDate: string;
    status: string;
}

/** Paciente existente escolhido, no formato que o formulário aplica e bloqueia. */
export interface PatientPresetModel {
    systemId: string;
    patientId: string;
    name: string;
    specie: string;
    breed: string;
    birthDate: string;
    ownerId: string;
}
