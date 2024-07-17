export const FOOD = {
    types: ['Ração seca', 'Ração húmida', 'Recovery (Papa nutritiva)'],
    levels: [
        {
            level: '0',
            title: 'Apetite Nulo',
            description:
                'Não mostra qualquer interesse por comida e necessita de ser alimentado forçadamente para garantir a nutrição adequada'
        },
        {
            level: '1',
            title: 'Apetite Muito Baixo',
            description:
                'Tem um interesse extremamente limitado pela comida e recusa-se a comer mesmo as suas guloseimas favoritas'
        },
        {
            level: '2',
            title: 'Apetite Baixo',
            description:
                'Come apenas pequenas quantidades de comida e frequentemente precisa de ser incentivado a comer'
        },
        {
            level: '3',
            title: 'Apetite Reduzido',
            description:
                'Come apenas uma fração do que normalmente comeria e pode necessitar de incentivo ou alimentação forçada ocasionalmente'
        },
        {
            level: '4',
            title: 'Apetite Moderadamente Reduzido',
            description:
                'Come mais do que uma fração, mas ainda não alcança a quantidade total necessária'
        },
        {
            level: '5',
            title: 'Apetite Moderado',
            description:
                'Come uma quantidade razoável de comida, mas não está a comer a sua quantidade normal'
        },
        {
            level: '6',
            title: 'Apetite Relativamente Bom',
            description:
                'Come quase a quantidade normal de comida, mas pode precisar de um pouco de incentivo ou de alimentos mais apetitosos'
        },
        {
            level: '7',
            title: ' Apetite Bom',
            description:
                'Come a maioria da sua comida normalmente, com apenas um ligeiro incentivo necessário ocasionalmente.'
        },
        {
            level: '8',
            title: 'Apetite Muito Bom',
            description:
                'Come quase toda a sua comida sem necessidade de incentivo e mostra interesse em comer'
        },
        {
            level: '9',
            title: 'Apetite Quase Máximo',
            description:
                'Come toda a sua comida sem necessidade de incentivo e procura por mais comida ou guloseimas'
        },
        {
            level: '10',
            title: 'Apetite Máximo',
            description:
                'Mostra um apetite excelente, comendo toda a sua comida por conta própria e demonstrando disposição ativa para se alimentar sempre que tiver oportunidade'
        }
    ]
}

export function findLevelDescription(level?: string) {
    if (!level) return 'N/A'

    const description = FOOD.levels.find((l) => l.level === level)?.description

    if (!description) return 'N/A'

    return description
}
