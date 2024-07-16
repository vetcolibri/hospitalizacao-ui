<script setup lang="ts">
import { DISCHARGES } from '@/lib/data/discharges'
import { FOOD } from '@/lib/data/food'
import { STATE_OF_CONSCIOUSNESS } from '@/lib/data/state_of_consciousness'
import { type PatientConditionModel } from '@/lib/models/patient_condition'
import { Provided } from '@/lib/provided'
import { type PatientService } from '@/lib/services/patient_service'
import { computed, inject, reactive, ref } from 'vue'
import BaseDialog from '../BaseDialog.vue'
import BaseInput from '../BaseInput.vue'
import BaseSelect from '../BaseSelect.vue'

interface Props {
    patientId: string
}

const props = defineProps<Props>()
const formRef = ref<HTMLFormElement>()
const service = <PatientService>inject(Provided.PatientService)
const dialogRef = ref<typeof BaseDialog>()
const stateOfConsRef = ref<typeof BaseSelect>()
const foodTypesRef = ref<typeof BaseSelect>()

const isDisabled = computed(() => {
    return (
        condition.stateOfConsciousness.length === 0 ||
        condition.food.type.length === 0 ||
        !condition.food.datetime ||
        !condition.food.level ||
        !condition.discharges.type ||
        !condition.discharges.aspect ||
        !condition.comments
    )
})

const condition = reactive<PatientConditionModel>({
    stateOfConsciousness: [],
    food: {
        type: [],
        level: '',
        datetime: ''
    },
    discharges: {
        type: '',
        aspect: ''
    },
    comments: ''
})

function chooseFoodLevel(event: Event) {
    condition.food.level = (event.target as HTMLSelectElement).value
}

function chooseDischargeType(event: Event) {
    condition.discharges.type = (event.target as HTMLSelectElement).value
}

function chooseDischargeAspect(event: Event) {
    condition.discharges.aspect = (event.target as HTMLSelectElement).value
}

function updateComments(event: Event) {
    condition.comments = (event.target as HTMLTextAreaElement).value
}

function open() {
    dialogRef.value?.open()
}

function clearCondition() {
    condition.stateOfConsciousness = []
    condition.food.type = []
    condition.food.level = ''
    condition.food.datetime = ''
    condition.discharges.type = ''
    condition.discharges.aspect = ''
    condition.comments = ''
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

async function save() {
    if (isDisabled.value) return

    await service.registerCondition(props.patientId, condition)

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
                    @update:model-value="condition.stateOfConsciousness = $event"
                />

                <h1>Alimentação</h1>

                <BaseInput
                    type="datetime-local"
                    class="text-gray-500"
                    :required="true"
                    @update:model-value="condition.food.datetime = $event"
                />

                <BaseSelect
                    ref="foodTypesRef"
                    title="Escolha os tipos"
                    :options="FOOD.types"
                    :limit="FOOD.types.length"
                    :search="false"
                    @update:model-value="condition.food.type = $event"
                />

                <select class="form-control text-gray-500" @change="chooseFoodLevel" required>
                    <option value class="text-gray-500">Escolha um nível</option>
                    <option
                        v-for="opt in FOOD.levels"
                        :key="opt.level"
                        :value="opt.level"
                        class="text-gray-500"
                    >
                        {{ opt.level }} - {{ opt.description }}
                    </option>
                </select>

                <h1>Descargas</h1>

                <select class="form-control text-gray-500" @change="chooseDischargeType" required>
                    <option value class="text-gray-500">Escolha um tipo</option>
                    <option
                        v-for="opt in DISCHARGES.types"
                        :key="opt"
                        :value="opt"
                        class="text-gray-500"
                    >
                        {{ opt }}
                    </option>
                </select>

                <select class="form-control text-gray-500" @change="chooseDischargeAspect" required>
                    <option value class="text-gray-500">Escolha um aspecto</option>
                    <option
                        v-for="opt in DISCHARGES.aspects"
                        :key="opt"
                        :value="opt"
                        class="text-gray-500"
                    >
                        {{ opt }}
                    </option>
                </select>

                <h1>Observações</h1>
                <textarea
                    class="form-control resize-none focus:ring-0 overflow-hidden"
                    placeholder="Comentário do MedVet"
                    rows="4"
                    required
                    @input="updateComments"
                />

                <button type="reset" class="btn btn-secondary w-full uppercase" @click="clear()">
                    <i class="bi bi-trash mr-2"></i>
                    Limpar
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
