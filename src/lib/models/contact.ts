/**
 * Contacto de uma pessoa a avisar sobre a hospitalização (RF-13).
 *
 * Serve tanto para a ficha global do tutor como para a excepção guardada num
 * episódio: o que muda é qual dos dois é o contacto efectivo.
 */
export interface ContactModel {
    name: string;
    phoneNumber: string;
    whatsapp: boolean;
}
