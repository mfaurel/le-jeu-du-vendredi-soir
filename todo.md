    Ajouter un nouveau type de tuile `7 = stair step` avec rendu 3D :                                                   
    - Top face (plate) + riser face avant = illusion d'une marche                                         
    - Chaque "palier" décalé en Y pour simuler la hauteur                                                               
                                                                                                                      
    ### Nouveau MAP                                                                                                     
    - 5–6 paliers horizontaux, séparés par des rangées de murs
    - Start en bas-gauche (0,10), portal en haut-droite (14,0)                                                          
    - Chemin en zigzag montant : palier 1 → escalier → palier 2 → ...                                                 
    - Ennemis repositionnés sur les paliers 2, 3, 5
    - NPCs repositionnés sur les paliers intermédiaires

    ### Changements code
    1. `MAP` — nouvelle disposition en escalier
    2. `_buildTilemap()` — cas `type === 7` : dessin d'une marche iso
       - Face top : losange décalé vers le haut (hauteur = STEP_H)
       - Face riser : rectangle vertical devant la marche
    3. `isoToScreen` — inchangé
    4. `EnemiesData.js` — nouvelles positions
    5. `DialoguesData.js` — nouvelles positions NPCs

    ### Couleurs marches
    - Top : 0x3a5c8a (pierre bleue)
    - Riser : 0x1e3050 (ombre)
    - Edge : 0x4a7ab5 (reflet)

    ## Status
    En attente d'implémentation.