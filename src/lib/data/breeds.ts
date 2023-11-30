const caes = [
    'Affenpinscher',
    'Afghan Hound',
    'Airedale Terrier',
    'Akita',
    'Akita Americano',
    'American Bully',
    'American Bully Standard',
    'American Bully Xl',
    'American Hairless Terrier',
    'American Pit Bull Terrier',
    'American Staffordshire Terrier',
    'Anão',
    'Askysiberiano',
    'Australian Cattle Dog',
    'Australian Shepherd',
    'Baer Bool',
    'Barbado Da Terceira',
    'Basenji',
    'Basset Artesian Norman',
    'Basset Bleu De Gascogne',
    'Basset Fauve De Bretagne',
    'Basset Griffon Vandeano',
    'Basset Hound',
    'Beagle',
    'Bearded Collie',
    'Bedlington Terrier',
    'Bernese Mountain Dog',
    'Bichon Frisé',
    'Bichon Maltês',
    'Bloodhound',
    'Bobtail O Antigo Pastor Inglês',
    'Boerboel',
    'Boieiro Das Ardenas',
    'Boieiro De Berna',
    'Boldog Frances',
    'Border Collie',
    'Border Terrier',
    'Borzoi',
    'Boston Terrier',
    'Bouvier De Flandres',
    'Boxer',
    'Braco Alemão De Pêlo Duro',
    'Braco Italiano',
    'Braco Ungaro',
    'Breton Spaniel',
    'Brussels Griffon',
    'Buldog Frances',
    'Bull Boel',
    'Bull Bull',
    'Bull Dog Francês',
    'Bullmastiff',
    'Bull Terrier',
    'Bull Terrier Inglês',
    'Bull Terrier Mini',
    'Bulldog',
    'Bulldog Americano',
    'Bulldog Francês',
    'Bulldog Inglês',
    'Cairn Terrier',
    'Cane Corso',
    'Cane Corso Italiano',
    'Caniche',
    'Caniche Anão',
    'Caniche Bichon Maltês',
    'Caniche Gigante',
    'Caniche Médio',
    'Caniche Toy',
    'Castro Laboreiro',
    'Cavalier King C. Spaniel',
    'Cavalier King Charles',
    'Charpey',
    'Chien D´artois',
    'Chihuahua',
    'Chinese Crested Dog',
    'Chiwawa',
    'Chow Chow',
    'Clumber Spaniel',
    'Cocker',
    'Cocker Spaniel',
    'Cocker Spaniel Americano',
    'Cocker Spaniel Inglês',
    'Collie',
    'Collie De Pêlo Comprido',
    'Collie De Pêlo Curto',
    'Crista Chinesa',
    'Cruzado',
    'Cruzado De Spitz',
    'Cruzado Pit Bull*Dogue Alem',
    'Cruzado Pitbull*Leao Da Rodezi',
    'Cão Da Montanha De Berna',
    'Cão Da Serra Da Estrela',
    'Cão Da Serra De Aires',
    'Cão De Bernese',
    'Cão De Castro Laboreiro',
    'Cão De Fila De São Miguel',
    'Cão De Gado Transmontano',
    'Cão De Montanha Dos Pirinéus',
    'Cão De Água Espanhol',
    'Cão De Água Português',
    'Cão Dos Pirineus',
    'Cão Lobo Checoslovaco',
    'Dachshund',
    'Dachshund (Teckel)',
    'Dachshund Miniatura',
    'Dachshund Doberman',
    'Dálmata',
    'Dandie Dinmont Terrier',
    'Dachshund',
    'Dachshund Teckel',
    'Dobermann',
    'Doberman Pinscher',
    'Dogue Americano',
    'Dogue Argentino',
    'Dogue Alemão',
    'Dogue Argentino',
    'Dogue Argentino',
    'Dogue Bordeus',
    'Dogue Brasileiro',
    'Dogue Canário',
    'Doberman',
    'Elkhound Norueguês',
    'Epagneul Breton',
    'Epagneul Japonês',
    'Epagneul Tibetano',
    'Eurasier',
    'Field Spaniel',
    'Fila Brasileiro',
    'Fila São Miguel',
    'Flat Coated Retriever',
    'Fox Hound Americano',
    'Fox Hound Inglês',
    'Fox Terrier',
    'Fox Terrier Pêlo Duro',
    'Fox Terrier Pêlo Liso',
    'Galgo',
    'Galgo Afegão',
    'Galgo Espanhol',
    'Galgo Inglês',
    'Galgo Polaco',
    'Galguinho Italiano',
    'Genérico',
    'Golden Retriever',
    'Golden Retriever X',
    'Gos D´atura Catalá',
    'Gran Basset Griffon Vendeen',
    'Grande Cão Japonês',
    'Greyhound',
    'Griffon',
    'Hask Siberiano',
    'Hovawart',
    'Husky Siberiano',
    'Indeterminada',
    'Indeterminado',
    'Indeterminado*Braco',
    'Irish Terrier',
    'Irish Wolfhound',
    'Jack Russel Terrier',
    'Jack Russell Terrier',
    'Japanese Chin',
    'Keeshond',
    'Kerry Blue Terrier',
    'Komondor',
    'Kurzhaar',
    'Kuvasz',
    'Kyi Leo',
    'Labradoodle',
    'Labrador',
    'Labrador',
    'Labrador Retriever',
    'Laekenois',
    'Lapinkoira',
    'Levrier Azawakh',
    'Leão Da Rodésia',
    'Leão Da Rodésia',
    'Lhasa Apso',
    'Lhasa Apso',
    'Lulu Da Pomerânia',
    'Lulu Da Pomerânia',
    'Malamute',
    'Malamute Do Alaska',
    'Maltes',
    'Maltes/Yorkshire',
    'Malteze',
    'Maltês',
    'Manchester Terrier',
    'Mansa',
    'Mastiff',
    'Mastim Dos Pirinéus',
    'Mastim Espanhol',
    'Mastim Inglês',
    'Mastim Napolitano',
    'Mastim Português (Cão De Gado)',
    'Mastin Inglês',
    'Mestiço',
    'Mista',
    'Norfolk Terrier',
    'Norwich Terrier',
    'Old English Sheepdog',
    'Papillon',
    'Parson Russell Terrier',
    'Pastor Alemão',
    'Pastor Alemão Branco',
    'Pastor Americano Miniatu',
    'Pastor Australiano',
    'Pastor Australiano',
    'Pastor Belga',
    'Pastor Belga',
    'Pastor Belga Groenendael',
    'Pastor Belga Malinois',
    'Pastor Belga Tervueren',
    'Pastor Da Picardia',
    'Pastor De Shetland',
    'Pastor Dos Pirinéus Pêlo Comprido',
    'Pastor Holandês',
    'Pastor Suiço',
    'Pastor Suiço',
    'Pembroke Welsh Corgi',
    'Pequeno Basset Griffon Vendeen',
    'Pequeno Levriero Italiano',
    'Pequeno Sabujo Suíço',
    'Pequinês',
    'Perdigueiro',
    'Perdigueiro Português',
    'Petit Chien Lion',
    'Pharaoh Hound',
    'Pinscher',
    'Pinscher Miniatura',
    'Pitbull Terrier Americano',
    'Pitbull',
    'Podengo',
    'Podengo Andaluz',
    'Podengo Anão',
    'Podengo Canário',
    'Podengo Português',
    'Podengo Português Médio Pêlo',
    'Podengo Português Pequeno',
    'Podengo Português Pequeno Pêlo',
    'Pointer',
    'Pointer Inglês',
    'Poodle',
    'Presa Canario',
    'Presa Canario',
    'Pudengo',
    'Pug',
    'Puli',
    'Rafeiro',
    'Rafeiro Alentejano',
    'Rafeiro Do Alentejo',
    'Retriever Do Labrador',
    'Rhodesian Ridgeback',
    'Rottweiler',
    'Rough Collie',
    'Salsicha',
    'Saluki',
    'Samoiedo',
    'Schipperke',
    'Schnauzer',
    'Schnauzer Gigante',
    'Schnauzer Miniatura',
    'Schnauzer Médio',
    'Scottish Terrier',
    'Serra Da Estrela',
    'Serra De Aires',
    'Serra D´aires',
    'Setter Gordon',
    'Setter Inglês',
    'Setter Irlandês',
    'Shar Pei',
    'Shiba Inu',
    'Shih Tzu',
    'Shit Zu',
    'Skye Terrier',
    'Spaniel Bretão',
    'Spinone Italiano',
    'Spitz',
    'Spitz Alemão',
    'Spitz Alemão Anão',
    'Spitz Anão',
    'Spitz Finlandês',
    'Spitz Japonês',
    'Springer Spaniel',
    'Springer Spaniel Inglês',
    'Spitz Italiano',
    'Srd',
    'Stafford Terrier',
    'Staffordshire Bull Terrier',
    'Standard Schnauzer',
    'São Bernardo',
    'Teckel',
    'Teckel Miniatura',
    'Terra Nova',
    'Terrier Brasileiro',
    'Tibetan Terrier',
    'Tosa',
    'Vizsla',
    'Weimaraner',
    'Welsh Corgi Cardigan',
    'Welsh Corgi Pembroke',
    'Welsh Terrier',
    'West Highland White Terrier',
    'Westie Terrier',
    'Whippet',
    'Yorkshire Terrier'
]

const gatos = [
    'Abissínio',
    'Africano Comum',
    'American Short Hair',
    'Angorá Turco',
    'Azul Russo',
    'Balinês',
    'Bengal',
    'Bichon Frisé',
    'Birmanês',
    'Bobtail Americano',
    'Bobtail Japonês',
    'Bosque Da Noruega',
    'Bosques Da Noruega',
    'Burmese',
    'British Shorthair',
    'Burmês',
    'Chartreux',
    'Cornish Rex',
    'Cruzada Siamês',
    'Devon Rex',
    'Egyptian Mau',
    'Europeu Comum',
    'Exótico',
    'Felina Europeia Comum',
    'Gato De Rua',
    'Indeterminada',
    'Maine Coon',
    'Manx',
    'Meio Persa',
    'Mengala',
    'Ocicat',
    'Oriental',
    'Pêlo Curto Brasileiro',
    'Persa',
    'Ragamuffin',
    'Ragdoll',
    'Raggamuffin',
    'Roedor',
    'Russian Blue',
    'Sagrado Da Birmânia',
    'Scottish Fold',
    'Scottish Straight',
    'Semi Persa',
    'Shorthair Americano',
    'Shorthair Britânico',
    'Shorthair Exótico',
    'Siamês',
    'Siamese',
    'Somali',
    'Sphynx',
    'Tabby',
    'Turco Do Lago De Van',
    'X Bosques Da Noruega',
    'X Persa',
    'X Sagrado Da Birmânia',
    'X Siamês',
    'X Bosques',
    'Xinxila',
    'Xpersa',
    'X Siamês'
]

const aves = [
    'Arara',
    'Canário',
    'Caturra',
    'Papagaio',
    'Piriquito',
    'Rola',
    'Psittacus erithacus (papagaio cinza africano'
]

const mamiferos = [
    'Chinchila',
    'Coelho',
    'Genérico',
    'Hamster',
    'Macaco',
    'Porquinho',
    'Porquinho da índia',
    'Primata',
    'Anão',
    'Orelhudo',
    'Cinzento cauda vermelha'
]

const repteis = [
    'Cobra',
    'Réptil',
    'Tartaruga',
    'Pogona viticeps (dragão barbudo)',
    'Tartaruga aquática',
    'Trachemys',
    'Tartaruga Leopardo'
]

export const BREEDS = {
    gatos,
    caes,
    aves,
    mamiferos,
    repteis,
    srd: ['Sem Raça Definida']
}
