import type { ContactModel } from '@/lib/models/contact';
import type { OwnerModel } from '@/lib/models/owner';

/**
 * Seam único de resolução do contacto efectivo (RF-13).
 *
 * Sem excepção no episódio, o contacto efectivo é o tutor principal actual.
 * Com excepção, usa exclusivamente o contacto guardado na hospitalização — o
 * tutor não é alterado nem consultado como alternativa.
 *
 * Toda a UI (detalhes e partilha) resolve por aqui para não duplicar o fallback.
 */
export function resolveEffectiveContact(
    owner?: OwnerModel,
    hospitalizationContact?: ContactModel
): ContactModel | undefined {
    if (hospitalizationContact) return hospitalizationContact;

    if (!owner) return undefined;

    return {
        name: owner.name,
        phoneNumber: owner.phoneNumber,
        whatsapp: owner.whatsapp
    };
}
