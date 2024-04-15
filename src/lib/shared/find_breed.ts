import { BREEDS } from '../data/breeds'

export function findBreed(specie: string) {
    switch (specie) {
        case 'CANINO':
            return BREEDS.caes
        case 'FELINO':
            return BREEDS.gatos
        case 'AVES':
            return BREEDS.aves
        case 'EXOTICO':
            return BREEDS.mamiferos
        case 'EXOTICO - MACACO':
            return BREEDS.mamiferos
        case 'EXOTICO - PAPAGAIO':
            return BREEDS.aves
        case 'EXOTICO - RÉPTIL':
            return BREEDS.repteis
        default:
            return []
    }
}
