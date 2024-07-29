import type { AlertModel } from '@/lib/models/alert'
import type { BudgetModel } from '@/lib/models/budget'
import type { HospitalizationModel } from '@/lib/models/hospitalization'
import type { OwnerModel } from '@/lib/models/owner'
import type { PatientModel } from '@/lib/models/patient'
import { Provided } from '@/lib/provided'
import type { AlertService } from '@/lib/services/alert_service'
import type { BudgetService } from '@/lib/services/budget_service'
import type { CrmService } from '@/lib/services/crm_service'
import type { HospitalizationService } from '@/lib/services/hospitalization_service'
import type { PatientService } from '@/lib/services/patient_service'
import { inject, ref } from 'vue'

export function usePageData() {
    const patientService = inject<PatientService>(Provided.PatientService)!
    const ownerService = inject<CrmService>(Provided.CrmService)!
    const hospitalizationService = inject<HospitalizationService>(Provided.HospitalizationService)!
    const budgetService = inject<BudgetService>(Provided.BudgetService)!
    const alertServie = inject<AlertService>(Provided.AlertService)!

    const patients = ref<PatientModel[]>([])
    const hospitalizations = ref<HospitalizationModel[]>([])
    const owners = ref<OwnerModel[]>([])
    const budgets = ref<BudgetModel[]>([])
    const alerts = ref<AlertModel[]>([])

    const loadData = async () => {
        owners.value = await ownerService.getOwners()
        patients.value = await patientService.listHospitalized()
        hospitalizations.value = await hospitalizationService.getAll()
        budgets.value = await budgetService.getAll()
        alerts.value = await alertServie.getActives()
    }

    return {
        patients,
        hospitalizations,
        owners,
        budgets,
        alerts,
        loadData
    }
}
