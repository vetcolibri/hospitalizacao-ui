<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import Discharge from '@/components/Discharge.vue'

import { FOOD } from '@/lib/data/food'
import { STATE_OF_CONSCIOUSNESS } from '@/lib/data/state_of_consciousness'
import { type OwnerModel } from '@/lib/models/owner'
import { type DischargeModel, type ReportModel } from '@/lib/models/report'
import { Provided } from '@/lib/provided'
import { type CrmService } from '@/lib/services/crm_service'
import { copy, share } from '@/lib/shared/share'
import { computed, inject, reactive, ref } from 'vue'

interface Props {
    patientId: string
    ownerId: string
    hospitalizationId: string
}

const props = defineProps<Props>()
const owner = ref<OwnerModel>()
const formRef = ref<HTMLFormElement>()
const service = <CrmService>inject(Provided.CrmService)
const dialogRef = ref<typeof BaseDialog>()
const stateOfConsRef = ref<typeof BaseSelect>()
const foodTypesRef = ref<typeof BaseSelect>()

const report = reactive<ReportModel>({
    stateOfConsciousness: [],
    food: {
        types: [],
        level: '',
        datetime: ''
    },
    discharges: [],
    comments: ''
})

const isDisabled = computed(() => {
    for (const discharge of report.discharges) {
        if (isInvalidDischarge(discharge)) {
            return true
        }
    }

    return (
        report.stateOfConsciousness.length === 0 ||
        report.food.types.length === 0 ||
        !report.food.datetime ||
        !report.food.level ||
        !report.comments
    )
})

function isInvalidDischarge(discharge: DischargeModel) {
    return discharge.type.length === 0 || discharge.aspects.length === 0
}

function chooseFoodLevel(event: Event) {
    report.food.level = (event.target as HTMLSelectElement).value
}

function updateComments(event: Event) {
    report.comments = (event.target as HTMLTextAreaElement).value
}

function open() {
    dialogRef.value?.open()
}

function clearCondition() {
    report.stateOfConsciousness = []
    report.food.types = []
    report.food.level = ''
    report.food.datetime = ''
    report.discharges = []
    report.comments = ''
}

function close() {
    dialogRef.value?.close()
}

function clear() {
    formRef.value?.reset()

    stateOfConsRef.value?.clear()

    foodTypesRef.value?.clear()

    clearCondition()
}

async function shareOrCopy() {
    const ownerOrErr = await service.findOwner(props.ownerId)

    if (ownerOrErr.isLeft()) {
        alert(ownerOrErr.value.message)
        return
    }

    owner.value = ownerOrErr.value

    const opts = {
        patientId: props.patientId,
        hospitalizationId: props.hospitalizationId,
        ownerId: props.ownerId,
        phoneNumber: ''
    }

    if (owner.value!.whatsapp) {
        opts.phoneNumber = owner.value!.phoneNumber
        share(opts)
        return
    }

    copy(opts)
}

async function save() {
    if (isDisabled.value) return

    await service.registerReport(props.patientId, report)

    clear()

    close()
}

defineExpose({ open })
</script>

<template>
    <BaseDialog ref="dialogRef" title="Informações para o Tutor">
        <form ref="formRef">
            <div class="space-y-3">
                <h1>Estado de Consciencia</h1>
                <BaseSelect
                    ref="stateOfConsRef"
                    title="Escolha as opções"
                    :options="STATE_OF_CONSCIOUSNESS"
                    :limit="STATE_OF_CONSCIOUSNESS.length"
                    :search="false"
                    @update:model-value="report.stateOfConsciousness = $event"
                />

                <h1>Alimentação</h1>

                <BaseInput
                    type="datetime-local"
                    class="text-gray-500"
                    :required="true"
                    @update:model-value="report.food.datetime = $event"
                />

                <BaseSelect
                    ref="foodTypesRef"
                    title="Escolha os tipos"
                    :options="FOOD.types"
                    :limit="FOOD.types.length"
                    :search="false"
                    @update:model-value="report.food.types = $event"
                />

                <select class="form-control text-gray-500" @change="chooseFoodLevel" required>
                    <option value class="text-gray-500">Escolha um nível</option>
                    <option
                        v-for="opt in FOOD.levels"
                        :key="opt.level"
                        :value="opt.level"
                        class="text-gray-500"
                    >
                        {{ opt.level }} - {{ opt.title }}
                    </option>
                </select>

                <Discharge @add="report.discharges = $event" />

                <h1>Observações</h1>
                <textarea
                    class="form-control resize-none focus:ring-0 overflow-hidden"
                    placeholder="Comentário do MedVet"
                    rows="4"
                    required
                    @input="updateComments"
                />
                <button
                    type="reset"
                    class="btn btn-secondary w-full uppercase"
                    @click="shareOrCopy()"
                >
                    <i class="bi bi-share mr-2"></i>
                    Partilhar
                </button>
                <button
                    type="button"
                    class="btn btn-success w-full uppercase"
                    :class="{ disabled: isDisabled }"
                    @click="save()"
                >
                    <i class="bi bi-floppy2 mr-2"></i>
                    Salvar
                </button>
            </div>
        </form>
    </BaseDialog>
</template>
