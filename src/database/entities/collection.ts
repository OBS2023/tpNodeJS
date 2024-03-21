import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "collection" })
export class Collection {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    nbTomes: number

    @Column()
    auteur: string

    @Column()
    prixUnitaire: number

    constructor(id: number, name: string, nbTomes: number, auteur: string, prixUnitaire: number) {
        this.id = id
        this.name = name
        this.nbTomes = nbTomes
        this.auteur = auteur
        this.prixUnitaire = prixUnitaire
    }
}