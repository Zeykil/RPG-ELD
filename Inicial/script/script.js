document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os cards de personagem
    const characterCards = document.querySelectorAll('.character-card');

    // Adiciona eventos de clique para os botões de toggle e inputs de stat
    characterCards.forEach(card => {
        const toggleAttributes = card.querySelector('.toggle-attributes');
        const toggleAbilities = card.querySelector('.toggle-abilities');
        const attributesSection = card.querySelector('.attributes-section');
        const abilitiesSection = card.querySelector('.abilities-section');
        const chevronAttributes = toggleAttributes?.querySelector('i');
        const chevronAbilities = toggleAbilities?.querySelector('i');

        // Oculta as seções inicialmente
        if (attributesSection) attributesSection.classList.remove('active');
        if (abilitiesSection) abilitiesSection.classList.remove('active');
        if (chevronAttributes) chevronAttributes.classList.remove('fa-chevron-up');
        if (chevronAbilities) chevronAbilities.classList.remove('fa-chevron-up');

        if (toggleAttributes) {
            toggleAttributes.addEventListener('click', function(e) {
                e.stopPropagation();
                // Fecha outras seções de atributos abertas
                document.querySelectorAll('.attributes-section').forEach(section => {
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
                chevronAttributes.classList.toggle('fa-chevron-up');
                // Fecha a seção de habilidades se estiver aberta
                if (abilitiesSection && abilitiesSection.classList.contains('active')) {
                    abilitiesSection.classList.remove('active');
                    chevronAbilities.classList.remove('fa-chevron-up');
                }
            });
        }

        if (toggleAbilities) {
            toggleAbilities.addEventListener('click', function(e) {
                e.stopPropagation();
                // Fecha outras seções de habilidades abertas
                 document.querySelectorAll('.abilities-section').forEach(section => {
                    if (section !== abilitiesSection && section.classList.contains('active')) {
                        section.classList.remove('active');
                        const prevBtn = section.previousElementSibling;
                        if (prevBtn) {
                            const icon = prevBtn.querySelector('i');
                            if (icon) icon.classList.remove('fa-chevron-up');
                        }
                    }
                });
                abilitiesSection.classList.toggle('active');
                chevronAbilities.classList.toggle('fa-chevron-up');
                // Fecha a seção de atributos se estiver aberta
                if (attributesSection && attributesSection.classList.contains('active')) {
                    attributesSection.classList.remove('active');
                    chevronAttributes.classList.remove('fa-chevron-up');
                }
            });
        }

        // --- Lógica para atualizar HP/Mana/Estamina via Input ---

        // Seleciona os elementos de HP para o card atual
        const hpInput = card.querySelector('.hp-input');
        const hpFill = card.querySelector('.hp-fill');
        const hpText = card.querySelector('.hp-text');

        // Seleciona os elementos de Mana ou Estamina para o card atual
        const isLythar = card.dataset.id === 'lythar'; // Verifica se é o Lythar pelo data-id

        let resourceInput, resourceFill, resourceText;

        if (isLythar) {
            resourceInput = card.querySelector('.mana-input');
            resourceFill = card.querySelector('.mana-fill');
            resourceText = card.querySelector('.mana-text');
        } else {
            resourceInput = card.querySelector('.estamina-input');
            resourceFill = card.querySelector('.estamina-fill');
            resourceText = card.querySelector('.estamina-text');
        }

        // Função para atualizar a barra e o texto de um stat (HP, Mana, Estamina)
        function updateStat(inputElement, fillElement, textElement) {
            const current = parseInt(inputElement.value) || 0; // Pega o valor do input, padrão 0 se inválido
            const max = parseInt(inputElement.dataset.max) || 1; // Pega o valor máximo do data-max, padrão 1 para evitar divisão por zero

            // Limita o valor atual entre 0 e o máximo
            const clampedCurrent = Math.max(0, Math.min(current, max));
            inputElement.value = clampedCurrent; // Atualiza o input com o valor limitado

            const percentage = (clampedCurrent / max) * 100;

            fillElement.style.width = `${percentage}%`;
            textElement.textContent = `${clampedCurrent}/${max}`;

            // Adiciona efeitos visuais (opcional)
            const statBarContainer = fillElement.parentElement;
            // Captura o valor anterior do texto ANTES de atualizá-lo
            const previousValue = parseInt(textElement.textContent.split('/')[0].trim());

             if (clampedCurrent < previousValue) { // Se o novo valor é menor que o anterior (dano)
                 statBarContainer.classList.add('damage-effect');
                 setTimeout(() => statBarContainer.classList.remove('damage-effect'), 300);
             } else if (clampedCurrent > previousValue) { // Se o novo valor é maior que o anterior (cura)
                 statBarContainer.classList.add('heal-effect');
                 setTimeout(() => statBarContainer.classList.remove('heal-effect'), 300);
             }


             // Atualiza a cor do fill para HP conforme o percentual
             if (fillElement === hpFill) {
                 if (percentage < 20) {
                    fillElement.style.backgroundColor = '#ff0000'; // Vermelho
                 } else if (percentage < 50) {
                    fillElement.style.backgroundColor = '#ff8c00'; // Laranja
                 } else {
                     fillElement.style.backgroundColor = 'var(--pixel-accent)'; // Vermelho do tema padrão
                 }
             }
             // TODO: Adicionar lógica similar para Mana/Estamina se quiserem cores diferentes em % baixos
        }

        // Adiciona listeners de input para HP, Mana e Estamina
        if (hpInput && hpFill && hpText) {
            hpInput.addEventListener('input', () => updateStat(hpInput, hpFill, hpText));
             // Dispara a atualização inicial ao carregar
            updateStat(hpInput, hpFill, hpText);
        }

        if (resourceInput && resourceFill && resourceText) {
             resourceInput.addEventListener('input', () => updateStat(resourceInput, resourceFill, resourceText));
              // Dispara a atualização inicial ao carregar
             updateStat(resourceInput, resourceFill, resourceText);
        }


        // --- Lógica de Level Up e Pontos ---
        const levelElement = card.querySelector('.character-level');
        const pointsDisplay = card.querySelector('.remaining-points');
        const increaseLevelBtn = card.querySelector('.increase-level');
        const decreaseLevelBtn = card.querySelector('.decrease-level');
        const attributeValues = card.querySelectorAll('.attributes-grid .attr-value'); // Todos os elementos de valor de atributo
        const increaseAttrBtns = card.querySelectorAll('.increase-attr'); // Todos os botões de aumentar atributo
        const decreaseAttrBtns = card.querySelectorAll('.decrease-attr'); // Todos os botões de diminuir atributo


        let currentLevel = parseInt(card.dataset.level) || 0;
        // Calcula pontos iniciais com base no nível inicial (5 pontos por nível acima de 0)
        let availablePoints = (parseInt(card.dataset.level) || 0) * 5;
        // Atualiza o data attribute com os pontos iniciais calculados
        card.dataset.currentPoints = availablePoints;


        // Função para atualizar a exibição de nível e pontos
        function updateLevelAndPointsDisplay() {
            levelElement.textContent = `NÍVEL ${currentLevel}`;
            pointsDisplay.textContent = availablePoints;

            // Opcional: desabilitar botões se não houver pontos
            increaseAttrBtns.forEach(btn => {
                 btn.disabled = availablePoints <= 0;
                 btn.style.opacity = availablePoints <= 0 ? '0.5' : '1'; // Feedback visual
                 btn.style.cursor = availablePoints <= 0 ? 'not-allowed' : 'pointer';
            });
        }

        // Listener para aumentar nível
        if (increaseLevelBtn) {
            increaseLevelBtn.addEventListener('click', () => {
                currentLevel++;
                availablePoints += 5; // Ganha 5 pontos por nível
                card.dataset.level = currentLevel; // Atualiza o data attribute do level
                card.dataset.currentPoints = availablePoints; // Atualiza o data attribute dos pontos
                updateLevelAndPointsDisplay();
                // TODO: Se HP/Mana/Estamina dependem do level, recalcular max aqui e atualizar a barra
            });
        }

        // Listener para diminuir nível
         if (decreaseLevelBtn) {
            decreaseLevelBtn.addEventListener('click', () => {
                 if (currentLevel > 0) {
                    // Verifica se o personagem tem pontos gastos que seriam perdidos
                     const spentPoints = (parseInt(card.dataset.level) || 0) * 5 - (parseInt(card.dataset.currentPoints) || 0);
                     if (spentPoints > availablePoints + 5) {
                          alert("Você tem mais pontos gastos do que pode recuperar ao diminuir o nível.");
                          return; // Impede a diminuição se perderia pontos
                     }

                    currentLevel--;
                    availablePoints -= 5; // Perde 5 pontos
                     // Garante que pontos não fiquem negativos
                    availablePoints = Math.max(0, availablePoints);

                    card.dataset.level = currentLevel; // Atualiza o data attribute do level
                    card.dataset.currentPoints = availablePoints; // Atualiza o data attribute dos pontos
                    updateLevelAndPointsDisplay();
                    // TODO: Se HP/Mana/Estamina dependem do level, recalcular max aqui e atualizar a barra
                 }
            });
        }


        // Listeners para aumentar atributos
        increaseAttrBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (availablePoints > 0) {
                    const attrValueSpan = this.closest('.attr-value-control').querySelector('.attr-value');
                    let currentValue = parseInt(attrValueSpan.textContent) || 0;
                    currentValue++;
                    attrValueSpan.textContent = currentValue;
                    availablePoints--;
                    card.dataset.currentPoints = availablePoints; // Atualiza o data attribute dos pontos
                    updateLevelAndPointsDisplay();
                    // TODO: Se HP/Mana/Estamina dependem dos atributos, recalcular max aqui e atualizar a barra
                }
            });
        });

        // Listeners para diminuir atributos
        decreaseAttrBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const attrValueSpan = this.closest('.attr-value-control').querySelector('.attr-value');
                const baseValue = parseInt(attrValueSpan.dataset.baseValue) || 0; // Pega o valor base
                let currentValue = parseInt(attrValueSpan.textContent) || 0;

                if (currentValue > baseValue) { // Só pode diminuir até o valor base
                    currentValue--;
                    attrValueSpan.textContent = currentValue;
                    availablePoints++;
                    card.dataset.currentPoints = availablePoints; // Atualiza o data attribute dos pontos
                    updateLevelAndPointsDisplay();
                    // TODO: Se HP/Mana/Estamina dependem dos atributos, recalcular max aqui e atualizar a barra
                }
            });
        });


        // --- Lógica de Filtros (mantida do original) ---
        // (Código dos filtros permanece o mesmo)

        // --- Efeito Hover (mantido do original) ---
        // (Código do hover permanece o mesmo)

         // --- Lógica do Modal de Edição (mantida do original, ajustada para Estamina) ---
         // (Código do modal permanece o mesmo, mas pode precisar de ajustes futuros se os inputs do modal
         //  forem usados para editar level/pontos/atributos diretamente em vez de usar os botões)

        // --- Inicialização ---
        // Dispara a atualização inicial de level e pontos ao carregar
        updateLevelAndPointsDisplay();

        // Dispara a atualização inicial dos stats (HP, Mana, Estamina)
        if (hpInput && hpFill && hpText) {
             updateStat(hpInput, hpFill, hpText);
        }
         if (resourceInput && resourceFill && resourceText) {
             updateStat(resourceInput, resourceFill, resourceText);
         }

         // Inicializa o data-base-value para cada atributo se não existir
        attributeValues.forEach(attrValueSpan => {
            if (!attrValueSpan.dataset.baseValue) {
                attrValueSpan.dataset.baseValue = parseInt(attrValueSpan.textContent) || 0;
            }
        });
    });

    // --- Código de filtros e efeitos globais (mantido do original) ---
    // Seleciona e gerencia os filtros
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');

    function filterCharacters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedRace = filterSelect ? filterSelect.value : 'all';
        const characterCards = document.querySelectorAll('.character-card'); // Seleciona novamente dentro da função

        characterCards.forEach(card => {
            const characterName = card.querySelector('h2').textContent.toLowerCase();
            const cardRace = card.dataset.race;

            const matchesSearch = characterName.includes(searchTerm);
            const matchesRace = (selectedRace === 'all' || cardRace === selectedRace);

            if (matchesSearch && matchesRace) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

     if (searchInput) {
        searchInput.addEventListener('input', filterCharacters);
     }

     if (filterSelect) {
        filterSelect.addEventListener('change', filterCharacters);
     }


     // Efeito fade-in no body (mantido do original)
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Efeito de brilho no toggle-btn (mantido do original)
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect(); // Pega a posição do elemento
            const x = e.clientX - rect.left; // Posição X relativa ao elemento
            const y = e.clientY - rect.top;   // Posição Y relativa ao elemento
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });

     // Lógica de fechar modal global (mantida do original)
     document.querySelectorAll('.close-modal, .modal').forEach(el => {
         el.addEventListener('click', function(e) {
             // Fecha apenas se clicar no background do modal ou no elemento com classe 'close-modal'
             if (e.target === this || e.target.classList.contains('close-modal')) {
                 const modal = document.getElementById('edit-modal'); // Certifique-se que o modal existe no HTML
                 if (modal) modal.style.display = 'none';
             }
         });
     });

    // Adiciona o link para o dashboard na sidebar em todos os cards
    document.querySelectorAll('.sidebar-nav ul li a').forEach(link => {
        if (link.textContent.includes('PAINEL')) {
            link.href = 'dashboard.html'; // Define o href para a página do dashboard
        }
    });

});