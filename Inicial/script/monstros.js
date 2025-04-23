document.addEventListener('DOMContentLoaded', function() {

    // Seleciona todos os cards de monstros
    const monsterCards = document.querySelectorAll('.monster-card'); // Alterado para monster-card

    // Adiciona eventos de clique para os botões de toggle e lógica de HP para cada card de monstro
    monsterCards.forEach(card => {
        const toggleAttributes = card.querySelector('.toggle-attributes');
        const toggleAbilities = card.querySelector('.toggle-abilities'); // Mantido o nome da classe, mas representa Especiais/Poderes
        const toggleDescription = card.querySelector('.toggle-description'); // Toggle para descrição
        const toggleCharacteristics = card.querySelector('.toggle-characteristics'); // Toggle para Características (para Voidbringer)


        const attributesSection = card.querySelector('.attributes-section');
        const abilitiesSection = card.querySelector('.abilities-section'); // Mantido o nome da classe
        const descriptionSection = card.querySelector('.description-section'); // Seção de descrição
        const characteristicsSection = card.querySelector('.characteristics-section'); // Seção de Características

        const chevronAttributes = toggleAttributes?.querySelector('i');
        const chevronAbilities = toggleAbilities?.querySelector('i');
        const chevronDescription = toggleDescription?.querySelector('i');
        const chevronCharacteristics = toggleCharacteristics?.querySelector('i'); // Chevron para Características


        // Seleciona os elementos de HP para o card atual (APENAS se existirem)
        const hpInput = card.querySelector('.hp-input');
        const hpFill = card.querySelector('.hp-fill');
        const hpText = card.querySelector('.hp-text');

         // Obter HP Máximo do atributo data-max (se o input existe)
        const maxHP = hpInput ? parseInt(hpInput.dataset.max) || 1 : 1; // Padrão 1 para evitar divisão por zero


        // Oculta as seções inicialmente
        if (attributesSection) attributesSection.classList.remove('active');
        if (abilitiesSection) abilitiesSection.classList.remove('active');
        if (descriptionSection) descriptionSection.classList.remove('active');
        if (characteristicsSection) characteristicsSection.classList.remove('active'); // Oculta características

        if (chevronAttributes) chevronAttributes.classList.remove('fa-chevron-up');
        if (chevronAbilities) chevronAbilities.classList.remove('fa-chevron-up');
        if (chevronDescription) chevronDescription.classList.remove('fa-chevron-up');
        if (chevronCharacteristics) chevronCharacteristics.classList.remove('fa-chevron-up'); // Oculta chevron características


        // Função para atualizar a barra de stat (HP)
        function updateStatDisplay(currentValue, maxValue, fillElement, textElement) {
            if (!fillElement || !textElement) return;

            const percentage = (currentValue / maxValue) * 100;
            fillElement.style.width = `${percentage}%`;
            textElement.textContent = `${currentValue}/${maxValue}`;

            // Lógica de cor da barra de HP baseada no percentual (copiada de personagem.css)
            if (percentage < 20) {
                fillElement.style.backgroundColor = '#ff0000'; // Vermelho
            } else if (percentage < 50) {
                fillElement.style.backgroundColor = '#ff8c00'; // Laranja
            } else {
                fillElement.style.backgroundColor = 'var(--pixel-accent)'; // Vermelho do tema padrão
            }

             // Adiciona efeito de dano/cura visual (opcional)
             // Esta parte é mais complexa sem botões dedicados, talvez remover ou simplificar
             // if (currentValue < parseInt(textElement.dataset.previousValue || maxValue)) {
             //     fillElement.classList.add('damage-effect');
             //     fillElement.addEventListener('animationend', () => fillElement.classList.remove('damage-effect'), { once: true });
             // } else if (currentValue > parseInt(textElement.dataset.previousValue || 0)) {
             //     fillElement.classList.add('heal-effect');
             //      fillElement.addEventListener('animationend', () => fillElement.classList.remove('heal-effect'), { once: true });
             // }
             // textElement.dataset.previousValue = currentValue; // Armazena valor atual como anterior
        }


        // --- Lógica de HP Input (se o input existe para este monstro) ---
        if (hpInput) {
             // Define o valor inicial do input e atualiza a exibição ao carregar
             // O valor inicial é lido do HTML
            let initialHP = parseInt(hpInput.value) || 0;
            hpInput.value = initialHP; // Garante que o input tenha o valor numérico correto

            updateStatDisplay(initialHP, maxHP, hpFill, hpText); // Atualiza a barra e texto inicialmente


            // Listener para o evento 'input' no campo HP
            hpInput.addEventListener('input', function() {
                let currentHP = parseInt(this.value) || 0; // Pega o valor do input, default 0 se não for número

                // Limita o valor entre 0 e o HP máximo
                if (currentHP < 0) currentHP = 0;
                if (currentHP > maxHP) currentHP = maxHP;

                this.value = currentHP; // Atualiza o valor do input (para corrigir se for fora do range)

                updateStatDisplay(currentHP, maxHP, hpFill, hpText); // Atualiza a barra e texto
            });
        }


        // --- Listeners para os botões Toggle ---

        // Listener para o toggle de Atributos
        if (toggleAttributes) {
            toggleAttributes.addEventListener('click', function(e) {
                e.stopPropagation();
                // Fecha outras seções de atributos abertas (de outros cards ou do mesmo card)
                document.querySelectorAll('.monster-card .attributes-section').forEach(section => {
                    if (section !== attributesSection && section.classList.contains('active')) {
                        section.classList.remove('active');
                        const prevBtn = section.previousElementSibling;
                        if (prevBtn) {
                            const icon = prevBtn.querySelector('i');
                            if (icon) icon.classList.remove('fa-chevron-up');
                        }
                    }
                });
                attributesSection.classList.toggle('active');
                if(chevronAttributes) chevronAttributes.classList.toggle('fa-chevron-up');
                // Fecha outras seções do mesmo card se estiverem abertas
                if (abilitiesSection && abilitiesSection.classList.contains('active')) {
                    abilitiesSection.classList.remove('active');
                     if(chevronAbilities) chevronAbilities.classList.remove('fa-chevron-up');
                }
                 if (descriptionSection && descriptionSection.classList.contains('active')) {
                     descriptionSection.classList.remove('active');
                      if(chevronDescription) chevronDescription.classList.remove('fa-chevron-up');
                 }
                 if (characteristicsSection && characteristicsSection.classList.contains('active')) {
                      characteristicsSection.classList.remove('active');
                       if(chevronCharacteristics) chevronCharacteristics.classList.remove('fa-chevron-up');
                  }
            });
        }

        // Listener para o toggle de Habilidades/Especiais
        if (toggleAbilities) {
            toggleAbilities.addEventListener('click', function(e) {
                e.stopPropagation();
                 // Fecha outras seções de habilidades/especiais abertas (de outros cards ou do mesmo card)
                 document.querySelectorAll('.monster-card .abilities-section').forEach(section => {
                    // Verifica se a seção não é a de descrição ou características antes de fechar (se ambas usam a mesma classe)
                     if (section !== abilitiesSection && section !== descriptionSection && section !== characteristicsSection && section.classList.contains('active')) {
                        section.classList.remove('active');
                        const prevBtn = section.previousElementSibling;
                        if (prevBtn) {
                            const icon = prevBtn.querySelector('i');
                             // Verifica se o ícone pertence a um toggle button válido para fechar
                             if (icon && (prevBtn.classList.contains('toggle-abilities') || prevBtn.classList.contains('toggle-description') || prevBtn.classList.contains('toggle-characteristics'))) {
                                 icon.classList.remove('fa-chevron-up');
                             }
                        }
                    }
                });
                abilitiesSection.classList.toggle('active');
                 if(chevronAbilities) chevronAbilities.classList.toggle('fa-chevron-up');
                // Fecha outras seções do mesmo card se estiverem abertas
                if (attributesSection && attributesSection.classList.contains('active')) {
                    attributesSection.classList.remove('active');
                    if(chevronAttributes) chevronAttributes.classList.remove('fa-chevron-up');
                }
                 if (descriptionSection && descriptionSection.classList.contains('active')) {
                     descriptionSection.classList.remove('active');
                      if(chevronDescription) chevronDescription.classList.remove('fa-chevron-up');
                 }
                 if (characteristicsSection && characteristicsSection.classList.contains('active')) {
                      characteristicsSection.classList.remove('active');
                       if(chevronCharacteristics) chevronCharacteristics.classList.remove('fa-chevron-up');
                  }
            });
        }

        // Listener para o toggle de Descrição
         if (toggleDescription) {
            toggleDescription.addEventListener('click', function(e) {
                e.stopPropagation();
                 // Fecha outras seções de descrição abertas (de outros cards)
                 document.querySelectorAll('.monster-card .description-section').forEach(section => {
                     if (section !== descriptionSection && section.classList.contains('active')) {
                         section.classList.remove('active');
                         const prevBtn = section.previousElementSibling;
                         if (prevBtn) {
                             const icon = prevBtn.querySelector('i');
                              if (icon && icon.parentElement.classList.contains('toggle-description')) {
                                  icon.classList.remove('fa-chevron-up');
                             }
                         }
                     }
                 });
                descriptionSection.classList.toggle('active');
                 if(chevronDescription) chevronDescription.classList.toggle('fa-chevron-up');
                // Fecha outras seções do mesmo card se estiverem abertas
                if (attributesSection && attributesSection.classList.contains('active')) {
                    attributesSection.classList.remove('active');
                     if(chevronAttributes) chevronAttributes.classList.remove('fa-chevron-up');
                }
                 if (abilitiesSection && abilitiesSection.classList.contains('active')) {
                     abilitiesSection.classList.remove('active');
                      if(chevronAbilities) chevronAbilities.classList.remove('fa-chevron-up');
                 }
                 if (characteristicsSection && characteristicsSection.classList.contains('active')) {
                      characteristicsSection.classList.remove('active');
                       if(chevronCharacteristics) chevronCharacteristics.classList.remove('fa-chevron-up');
                  }
            });
         }

         // Listener para o toggle de Características (NOVO)
         if (toggleCharacteristics) {
            toggleCharacteristics.addEventListener('click', function(e) {
                e.stopPropagation();
                 // Fecha outras seções de características abertas (de outros cards)
                 document.querySelectorAll('.monster-card .characteristics-section').forEach(section => {
                     if (section !== characteristicsSection && section.classList.contains('active')) {
                         section.classList.remove('active');
                         const prevBtn = section.previousElementSibling;
                         if (prevBtn) {
                             const icon = prevBtn.querySelector('i');
                              if (icon && icon.parentElement.classList.contains('toggle-characteristics')) {
                                  icon.classList.remove('fa-chevron-up');
                             }
                         }
                     }
                 });
                characteristicsSection.classList.toggle('active');
                 if(chevronCharacteristics) chevronCharacteristics.classList.toggle('fa-chevron-up');
                // Fecha outras seções do mesmo card se estiverem abertas
                if (attributesSection && attributesSection.classList.contains('active')) {
                    attributesSection.classList.remove('active');
                     if(chevronAttributes) chevronAttributes.classList.remove('fa-chevron-up');
                }
                 if (abilitiesSection && abilitiesSection.classList.contains('active')) {
                     abilitiesSection.classList.remove('active');
                      if(chevronAbilities) chevronAbilities.classList.remove('fa-chevron-up');
                 }
                 if (descriptionSection && descriptionSection.classList.contains('active')) {
                     descriptionSection.classList.remove('active');
                      if(chevronDescription) chevronDescription.classList.remove('fa-chevron-up');
                 }
            });
         }


        // --- Lógica de Filtros (adaptada de script.js) ---
        const searchInput = document.querySelector('.search-input'); // Manter search-input
        // const filterSelect = document.querySelector('.filter-select'); // Remover se não usar filtro por tipo

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                filterMonsters(); // Chama a função de filtro
            });
        }

        // Se usar filtro por tipo, descomente e adapte
        // if (filterSelect) {
        //    filterSelect.addEventListener('change', filterMonsters);
        // }

        function filterMonsters() { // Função de filtro adaptada para monstros
             const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
             // const selectedType = filterSelect ? filterSelect.value : 'all'; // Se usar filtro por tipo

             monsterCards.forEach(card => { // Iterar sobre monsterCards
                 const monsterName = card.querySelector('h2').textContent.toLowerCase();
                 // const cardType = card.dataset.type; // Se adicionar data-type ao card

                 const matchesSearch = monsterName.includes(searchTerm);
                 // const matchesType = (selectedType === 'all' || cardType === selectedType); // Se usar filtro por tipo

                 // if (matchesSearch && matchesType) { // Lógica de exibição com filtro por tipo
                 if (matchesSearch) { // Lógica de exibição apenas com filtro por nome
                     card.style.display = 'block';
                 } else {
                     card.style.display = 'none';
                 }
             });
         }


        // --- Efeito Hover (Manter igual) ---
        // Note: Este listener já está no forEach, então ele será aplicado a cada card.
        // card.addEventListener('mouseenter', function() { ... });
        // card.addEventListener('mouseleave', function() { ... });


         // --- Lógica de Modal de Edição (Removida) ---
         // O código relacionado a openEditModal, close-modal, edit-character-form foi removido.
         // Se você decidir adicionar edição de monstros, precisará implementar um novo modal e lógica.


        // --- Inicialização ---
        // Dispara a atualização inicial da barra de HP ao carregar a página (se existir HP input)
        if (hpInput) {
             const initialHP = parseInt(hpInput.value) || 0;
             updateStatDisplay(initialHP, maxHP, hpFill, hpText);
         }


    });

    // --- Efeito de brilho no toggle-btn (Manter igual, fora do loop forEach) ---
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const x = e.pageX - this.offsetLeft;
            const y = e.pageY - this.offsetTop;
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });

    // Remover lógica global de fechar modal de edição se não for usada
    /*
     document.querySelectorAll('.close-modal, .modal').forEach(el => {
         el.addEventListener('click', function(e) {
             if (e.target === this || e.target.classList.contains('close-modal')) {
                 const modal = document.getElementById('edit-modal');
                 if (modal) modal.style.display = 'none';
             }
         });
     });
     */

    // Efeito fade-in no body (Manter igual)
     setTimeout(() => {
         document.body.style.opacity = '1';
     }, 100);

});