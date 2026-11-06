const slides = [
    {
        categoria: "CONHEÇA A TECHBOOT",
        titulo: "O futuro do atendimento começa aqui.",
        texto: "Conheça como os assistentes virtuais podem conectar, organizar e automatizar diferentes atividades.",
        destaque: "Inteligência que transforma seu tempo.",
        fala: "Olá! Seja muito bem-vindo à TechBoot. Eu sou o TechBot e vou apresentar nosso projeto. Prepare-se para conhecer como os assistentes virtuais podem facilitar atividades do dia a dia."
    },
    {
        categoria: "ATENDIMENTO AUTOMÁTICO",
        titulo: "Atendimento rápido, a qualquer momento.",
        texto: "Os assistentes virtuais respondem dúvidas frequentes, orientam usuários e ajudam empresas a oferecer atendimento mesmo quando não há atendentes disponíveis.",
        destaque: "Mais agilidade e praticidade para quem precisa de ajuda.",
        fala: "Uma das aplicações dos assistentes virtuais é o atendimento automático. Eles podem responder perguntas frequentes, explicar serviços e orientar clientes. Assim, as pessoas conseguem encontrar informações com mais rapidez."
    },
    {
        categoria: "SALAS DE CHAT",
        titulo: "Conversas que conectam pessoas.",
        texto: "Em salas de conversa, assistentes virtuais podem interagir com usuários, responder perguntas e compartilhar informações de maneira organizada.",
        destaque: "Interação e troca de informações em tempo real.",
        fala: "Os assistentes também podem participar de salas de chat. Eles interagem com usuários, respondem dúvidas e ajudam a compartilhar informações. Isso torna as conversas mais organizadas e dinâmicas."
    },
    {
        categoria: "COMÉRCIO ELETRÔNICO",
        titulo: "Uma experiência de compra mais simples.",
        texto: "No comércio eletrônico, o assistente pode apresentar produtos, informar preços, esclarecer dúvidas e orientar o cliente durante uma compra.",
        destaque: "Mais facilidade para escolher e conhecer produtos.",
        fala: "No comércio eletrônico, os assistentes virtuais podem ajudar os clientes a conhecer produtos, consultar preços e tirar dúvidas. Eles também podem orientar o usuário durante o processo de compra."
    },
    {
        categoria: "ENTRETENIMENTO",
        titulo: "Tecnologia que também diverte.",
        texto: "Personagens virtuais podem conversar com usuários, apresentar conteúdos e tornar a experiência digital mais interessante e interativa.",
        destaque: "Uma interação mais leve, criativa e envolvente.",
        fala: "Os assistentes virtuais também podem ser usados para entretenimento. Personagens digitais podem conversar, apresentar conteúdos e despertar a curiosidade das pessoas. É uma forma criativa de aproximar usuários da tecnologia."
    },
    {
        categoria: "EDUCAÇÃO E APRENDIZAGEM",
        titulo: "Aprender com apoio da tecnologia.",
        texto: "Na educação, assistentes podem explicar conteúdos, responder perguntas e apoiar estudantes e professores em atividades de aprendizagem.",
        destaque: "Conhecimento mais acessível e interativo.",
        fala: "Na educação, os assistentes virtuais podem apoiar alunos e professores. Eles podem explicar conteúdos, responder perguntas e ajudar nos estudos. A tecnologia se torna uma ferramenta de apoio à aprendizagem."
    },
    {
        categoria: "CRM E ORGANIZAÇÃO",
        titulo: "Relacionamento e informações organizadas.",
        texto: "Empresas podem utilizar sistemas para organizar informações, acompanhar atendimentos e compreender melhor as necessidades dos clientes.",
        destaque: "Informações organizadas para decisões melhores.",
        fala: "Outra aplicação é o CRM, que ajuda empresas a organizar informações e acompanhar o relacionamento com seus clientes. Com dados organizados, fica mais fácil entender necessidades e melhorar o atendimento."
    },
    {
        categoria: "CONCLUSÃO",
        titulo: "Conectar. Organizar. Automatizar.",
        texto: "Os assistentes virtuais podem estar presentes em diferentes áreas, tornando tarefas mais práticas e aproximando pessoas e tecnologia.",
        destaque: "TechBoot: inteligência que transforma seu tempo.",
        fala: "E chegamos ao final da nossa apresentação! Como vimos, os assistentes virtuais podem ser aplicados em várias áreas, desde o atendimento até a educação e o comércio. A TechBoot acredita em uma tecnologia que conecta, organiza e automatiza. Obrigado pela atenção!"
    }
];

let slideAtual = 0;

const titulo = document.getElementById("tituloSlide");
const texto = document.getElementById("textoSlide");
const categoria = document.getElementById("categoria");
const destaque = document.getElementById("textoDestaque");
const numeroEtapa = document.getElementById("numeroEtapa");
const contador = document.getElementById("contador");
const progresso = document.getElementById("progresso");
const falaRobo = document.getElementById("falaRobo");

const mascote = document.getElementById("mascote");
const botaoAnterior = document.getElementById("anterior");
const botaoProximo = document.getElementById("proximo");
const botaoOuvir = document.getElementById("ouvir");
const botaoParar = document.getElementById("pararVoz");

function mostrarSlide() {
    const slide = slides[slideAtual];

    titulo.textContent = slide.titulo;
    texto.textContent = slide.texto;
    categoria.textContent = slide.categoria;
    destaque.textContent = slide.destaque;
    falaRobo.textContent = slide.fala;

    numeroEtapa.textContent =
        String(slideAtual + 1).padStart(2, "0") +
        " / " +
        String(slides.length).padStart(2, "0");

    contador.textContent =
        "Etapa " + (slideAtual + 1) + " de " + slides.length;

    progresso.style.width =
        ((slideAtual + 1) / slides.length) * 100 + "%";

    botaoAnterior.disabled = slideAtual === 0;

    botaoProximo.innerHTML =
        slideAtual === slides.length - 1
            ? "Reiniciar apresentação ↻"
            : 'Próxima etapa <span>→</span>';

    mascote.classList.remove("falando");

    // Pequenas mudanças de pose entre as etapas.
    mascote.style.transform =
        slideAtual % 2 === 0
            ? "translateX(-5px)"
            : "translateX(7px)";

    // Atualiza o balão com a fala da etapa.
    document.getElementById("balao").classList.remove("oculto");

    // Atualiza a apresentação sem deixar a página rolar sozinha.
    window.speechSynthesis.cancel();
}

function falarApresentacao() {
    if (!("speechSynthesis" in window)) {
        alert("Seu navegador não oferece suporte à narração.");
        return;
    }

    window.speechSynthesis.cancel();

    const mensagem = new SpeechSynthesisUtterance(
        slides[slideAtual].fala
    );

    mensagem.lang = "pt-BR";
    mensagem.rate = 0.95;
    mensagem.pitch = 1.15;
    mensagem.volume = 1;

    mensagem.onstart = function () {
        mascote.classList.add("falando");
    };

    mensagem.onend = function () {
        mascote.classList.remove("falando");
    };

    mensagem.onerror = function () {
        mascote.classList.remove("falando");
    };

    window.speechSynthesis.speak(mensagem);
}

function proximaEtapa() {
    if (slideAtual === slides.length - 1) {
        slideAtual = 0;
    } else {
        slideAtual++;
    }

    mostrarSlide();
    falarApresentacao();
}

function etapaAnterior() {
    if (slideAtual > 0) {
        slideAtual--;
        mostrarSlide();
        falarApresentacao();
    }
}

botaoProximo.addEventListener("click", proximaEtapa);
botaoAnterior.addEventListener("click", etapaAnterior);

botaoOuvir.addEventListener("click", falarApresentacao);

botaoParar.addEventListener("click", function () {
    window.speechSynthesis.cancel();
    mascote.classList.remove("falando");
});

// Teclas de seta também controlam a apresentação.
document.addEventListener("keydown", function (evento) {
    if (evento.key === "ArrowRight") {
        proximaEtapa();
    }

    if (evento.key === "ArrowLeft") {
        etapaAnterior();
    }
});

// Apresenta a primeira etapa.
mostrarSlide();