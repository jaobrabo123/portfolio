// Alternância de tema
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Verificar se há preferência salva
const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('portfolioTheme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('portfolioTheme', 'dark');
    }
});

// Menu mobile
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');

    // Alterar ícone do botão
    const icon = mobileMenuButton.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Fechar menu mobile ao clicar em um link
const mobileLinks = document.querySelectorAll('#mobileMenu a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Suavizar rolagem para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Slider de Projetos - Loop infinito 
const projectsTrack = document.getElementById('projectsTrack');
const projectCards = document.querySelectorAll('.project-card');
const prevBtn = document.querySelector('.slider-nav.prev');
const nextBtn = document.querySelector('.slider-nav.next');
const sliderIndicatorsContainer = document.getElementById('sliderIndicators');
const projectCounterSpan = document.getElementById('projectCounter');
const projectTotalSpan = document.getElementById('projectTotal');

let currentIndex = 0;
const totalProjects = projectCards.length;
let indicators = [];

// Gerar indicadores dinamicamente
function generateIndicators() {
    sliderIndicatorsContainer.innerHTML = '';
    indicators = [];

    for (let i = 0; i < totalProjects; i++) {
        const button = document.createElement('button');
        button.className = `w-3 h-3 rounded-full slider-indicator ${i === 0 ? 'active' : ''}`;
        button.setAttribute('data-index', i);

        if (i === 0) {
            button.style.backgroundColor = 'white';
        } else {
            button.style.backgroundColor = '#4B5563';
        }

        button.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
        });

        sliderIndicatorsContainer.appendChild(button);
        indicators.push(button);
    }

    projectTotalSpan.textContent = totalProjects;
}

// Função para atualizar o slider
function updateSlider() {
    projectCards.forEach((card, index) => {
        card.classList.remove('center', 'side');

        // Determinar qual card deve ser center e quais side
        if (index === currentIndex) {
            card.classList.add('center');
        } else {
            card.classList.add('side');
        }
    });
    projectsTrack.style.transform = `translateX(-${currentIndex * (100 / totalProjects)}%)`;

    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentIndex) {
            indicator.classList.add('active');
            indicator.style.backgroundColor = 'white';
        } else {
            indicator.style.backgroundColor = '#4B5563';
        }
    });

    projectCounterSpan.textContent = currentIndex + 1;
}

// Navegação para o próximo projeto
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalProjects;
    updateSlider();
});

// Navegação para o projeto anterior
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
    updateSlider();
});
generateIndicators();
updateSlider();

// Navegação por teclado para o slider
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        updateSlider();
    } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % totalProjects;
        updateSlider();
    }
});

// Inicializar tooltips das habilidades
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        const tooltip = this.querySelector('.skill-tooltip');
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
    });

    card.addEventListener('mouseleave', function () {
        const tooltip = this.querySelector('.skill-tooltip');
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });
});

// Auto-rotacionar o slider a cada 5 segundos
let autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalProjects;
    updateSlider();
}, 5000);

// Pausar auto-rotacionar quando o mouse estiver sobre o slider
const projectsSlider = document.querySelector('.projects-slider');
projectsSlider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

projectsSlider.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalProjects;
        updateSlider();
    }, 5000);
});

// Slider para cada categoria de Hard Skills
document.addEventListener('DOMContentLoaded', () => {
    const skillSliders = document.querySelectorAll('.skill-category-slider');

    skillSliders.forEach(slider => {
        const track = slider.querySelector('.skill-slider-track');
        const grid = track.querySelector('.grid');
        const skillCards = grid.querySelectorAll('.skill-card');
        const prevBtn = slider.querySelector('.skill-slider-nav.prev');
        const nextBtn = slider.querySelector('.skill-slider-nav.next');
        const indicators = slider.querySelectorAll('.skill-indicator');
        const counter = slider.querySelector('.skill-counter');

        // Calcular quantos itens por slide baseado no layout da grid
        let itemsPerSlide = 3; 
        const gridClasses = grid.className;

        if (gridClasses.includes('grid-cols-1')) {
            itemsPerSlide = 1;
        } else if (gridClasses.includes('grid-cols-2') && !gridClasses.includes('md:grid-cols-3')) {
            itemsPerSlide = 2;
        }


        // Verificar se é mobile
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            // Em mobile, contar baseado na primeira classe de grid (sem md:)
            if (gridClasses.includes('grid-cols-1')) {
                itemsPerSlide = 1;
            } else if (gridClasses.includes('grid-cols-2')) {
                itemsPerSlide = 2;
            }
        }

        const totalItems = skillCards.length;
        const totalSlides = Math.ceil(totalItems / itemsPerSlide);
        let currentSlide = 0;

        // Atualizar contador
        function updateCounter() {
            if (counter) {
                counter.textContent = `${currentSlide + 1}/${totalSlides}`;
            }
        }

        // Atualizar indicadores
        function updateIndicators() {
            indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                    indicator.style.backgroundColor = 'var(--vermilion)';
                } else {
                    indicator.classList.remove('active');
                    indicator.style.backgroundColor = '#4B5563';
                }
            });
        }

        // Mover para um slide específico
        function goToSlide(slideIndex) {
            if (slideIndex < 0) slideIndex = totalSlides - 1;
            if (slideIndex >= totalSlides) slideIndex = 0;

            currentSlide = slideIndex;

            const slideWidth = track.offsetWidth;
            grid.style.transform = `translateX(-${slideWidth * currentSlide}px)`;

            updateCounter();
            updateIndicators();
        }
        // Event listeners para botões de navegação
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });

        // Event listeners para indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Ajustar quando a janela for redimensionada
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalcular itemsPerSlide baseado no tamanho da tela
                if (window.innerWidth < 768) {
                    if (gridClasses.includes('grid-cols-1')) {
                        itemsPerSlide = 1;
                    } else if (gridClasses.includes('grid-cols-2')) {
                        itemsPerSlide = 2;
                    } else {
                        itemsPerSlide = 2; 
                    }
                } else {
                    if (gridClasses.includes('md:grid-cols-3')) {
                        itemsPerSlide = 3;
                    } else if (gridClasses.includes('md:grid-cols-2')) {
                        itemsPerSlide = 2;
                    } else if (gridClasses.includes('grid-cols-1')) {
                        itemsPerSlide = 1;
                    }
                }

                const newTotalSlides = Math.ceil(totalItems / itemsPerSlide);

                // Ajustar currentSlide se necessário
                if (currentSlide >= newTotalSlides) {
                    currentSlide = newTotalSlides - 1;
                }

                goToSlide(currentSlide);
            }, 250);
        });

        updateCounter();
        updateIndicators();

        // Garantir que o grid tenha a largura correta
        grid.style.width = `${totalSlides * 100}%`;
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${totalSlides * itemsPerSlide}, 1fr)`;
    });

    // Inicializar tooltips das habilidades (mantendo a funcionalidade existente)
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            const tooltip = this.querySelector('.skill-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            }
        });

        card.addEventListener('mouseleave', function () {
            const tooltip = this.querySelector('.skill-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        });
    });
});