/**
 * Linha da listagem de últimos internamentos. Campos mínimos para navegação e
 * leitura; nunca telefone, WhatsApp ou dados clínicos.
 */
export interface RecentHospitalizationModel {
    hospitalizationId: string;
    /** system_id interno, usado no deep-link do episódio read-only. */
    systemId: string;
    entryDate: string;
    dischargeDate?: string;
    status: string;
    patientId: string;
    patientName: string;
    ownerId: string;
    ownerName: string;
}

export interface RecentHospitalizationsFilters {
    term?: string;
    from?: string;
    to?: string;
}
