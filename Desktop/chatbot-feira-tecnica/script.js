let estabelecimentoAtual = "";
let aguardandoProduto = false;
let agendamentoEmAndamento = null;

const SERVICOS_SALAO = [
    "Manicure",
    "Corte de cabelo",
    "Escova",
    "Hidratação",
    "Penteado"
];

const HORARIOS_AGENDAMENTO = [
    "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00",
    "16:00", "17:00"
];

const CHAVE_AGENDAMENTOS = "atendebot_agendamentos";

const catalogoLoja = [
    { nome: "Mouse Gamer", preco: 119.90, palavras: ["mouse", "mouse gamer"] },
    { nome: "Teclado Mecânico", preco: 189.90, palavras: ["teclado", "teclado mecanico"] },
    { nome: "Headset Gamer", preco: 159.90, palavras: ["headset", "fone", "fone gamer"] },
    { nome: "Memória RAM 8GB", preco: 159.90, palavras: ["memoria ram", "ram", "memoria"] },
    { nome: "SSD 480GB", preco: 219.90, palavras: ["ssd", "armazenamento"] },
    { nome: "Webcam HD", preco: 129.90, palavras: ["webcam", "camera"] }
];

const conhecimentos = {
    loja: [
        {
            palavras: ["preco", "precos", "preço", "preços", "valor", "valores", "quanto custa", "quanto e"],
            resposta: "Nossos produtos de informática custam aproximadamente de R$ 80,00 a R$ 300,00, dependendo do produto e do modelo. 😊 Se quiser consultar um item específico, diga o nome dele!"
        },
        {
            palavras: ["desconto", "descontos", "promocao", "promocoes", "promocional"],
            resposta: "No momento, não temos descontos disponíveis. Quando houver novas promoções, avisaremos você! 😊"
        },
        {
            palavras: ["oque tem na loja", "oque vendem", "o que vende", "o que voces vendem", "o que vocês vendem", "quais produtos", "que produtos", "o que tem na loja", "produtos da loja", "o que comercializa"],
            resposta: "Vendemos aparelhos e itens de informática, como mouse, teclado, headset, memória RAM, SSD e webcam. 💻 Se quiser saber o preço de algum produto, é só perguntar!"
        },
        {
            palavras: ["horario", "funcionamento", "abre", "fecha"],
            resposta: "Nosso horário de funcionamento é de segunda a sábado, das 8h às 18h. 😊"
        },
        {
            palavras: ["pagamento", "pix", "cartao", "dinheiro", "pagar"],
            resposta: "Aceitamos Pix, dinheiro, cartão de débito e cartão de crédito. 💳"
        },
        {
            palavras: ["entrega", "entregar", "frete", "receber"],
            resposta: "Realizamos entregas conforme a região. O prazo e o valor são informados pela nossa equipe. 🚚"
        },
        {
            palavras: ["troca", "devolucao", "devolver", "defeito"],
            resposta: "Para solicitar uma troca ou devolução, apresente o comprovante de compra e entre em contato com nossa equipe. 🔄"
        },
        {
            palavras: ["endereco", "localizacao", "onde fica"],
            resposta: "Nossa loja fictícia fica na Avenida Central, número 100. 📍"
        },
        {
            palavras: ["contato", "telefone", "whatsapp", "falar"],
            resposta: "Nosso atendimento está disponível pelo telefone fictício (31) 99999-0000."
        }
    ],
    salao: [
        {
            palavras: ["servicos", "o que voces fazem", "o que vocês fazem", "o que oferece", "o que oferecem", "quais servicos", "quais serviços", "o que tem no salao", "o que tem no salão"],
            resposta: "Nosso salão oferece diversos serviços de beleza! 💇‍♀️💅\n\n✨ Corte de cabelo\n✨ Escova\n✨ Hidratação\n✨ Penteados\n✨ Manicure\n\nNão realizamos serviços de pedicure.\n\nSe quiser saber o preço de algum serviço ou agendar um horário, é só perguntar!"
        },
        {
            palavras: ["horario", "funcionamento", "abre", "fecha"],
            resposta: "Nosso salão funciona de terça a sábado, das 9h às 19h. 💇"
        },
        {
            palavras: ["preco", "precos", "valor", "servico", "servicos"],
            resposta: "Confira alguns serviços: Corte: R$ 45,00; Escova: R$ 60,00; Manicure: R$ 35,00; Hidratação: R$ 80,00. ✨"
        },
        {
            palavras: ["agendamento", "agendar", "marcar", "horario disponivel"],
            resposta: "Vamos fazer seu agendamento! 📅"
        },
        {
            palavras: ["pagamento", "pix", "cartao", "dinheiro", "pagar"],
            resposta: "Aceitamos Pix, dinheiro, cartão de débito e cartão de crédito. 💳"
        },
        {
            palavras: ["endereco", "localizacao", "onde fica"],
            resposta: "Nosso salão fictício fica na Rua das Flores, número 250. 📍"
        },
        {
            palavras: ["contato", "telefone", "whatsapp", "falar"],
            resposta: "Nosso contato fictício é (31) 98888-0000. Nossa equipe poderá ajudar você!"
        },
        {
            palavras: ["cancelar", "cancelamento", "desmarcar"],
            resposta: "Para cancelar ou remarcar um horário, entre em contato com nossa equipe com antecedência."
        }
    ]
};
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function adicionarMensagem(texto, tipo) {
    const mensagens = document.getElementById("mensagens");
    const mensagem = document.createElement("div");

    mensagem.className = "mensagem " + tipo;
    mensagem.textContent = texto;

    mensagens.appendChild(mensagem);
    mensagens.scrollTop = mensagens.scrollHeight;
}

function escolherEstabelecimento(tipo) {
    estabelecimentoAtual = tipo;
    aguardandoProduto = false;
    agendamentoEmAndamento = null;

    document.getElementById("escolha").hidden = true;
    document.getElementById("chat").hidden = false;
    document.getElementById("mensagens").innerHTML = "";

    const nome = tipo === "loja" ? "loja" : "salão de beleza";

    adicionarMensagem(
        "Olá! Sou o AtendeBot da nossa " + nome +
        ". 🤖 Como posso ajudar você hoje? Pode perguntar sobre horários, preços, pagamentos e outros assuntos!",
        "bot"
    );
}

function responder(pergunta) {
    const texto = normalizar(pergunta);

    if (/\b(oi|ola|bom dia|boa tarde|boa noite|e ai)\b/.test(texto)) {
        return "Olá! 😊 Como posso ajudar você?";
    }

    if (/\b(obrigado|obrigada|valeu)\b/.test(texto)) {
        return "Por nada! Estamos à disposição. 😊";
    }

    if (/\b(tchau|ate logo|adeus)\b/.test(texto)) {
        return "Até logo! Obrigado por conversar com o AtendeBot. 👋";
    }

    const base = conhecimentos[estabelecimentoAtual];

    for (const item of base) {
        const encontrou = item.palavras.some(function (palavra) {
            return texto.includes(normalizar(palavra));
        });

        if (encontrou) {
            return item.resposta;
        }
    }

    return "No momento, não temos essa informação disponível em nosso atendimento. Sua dúvida já foi encaminhada para nossa equipe. Por favor, aguarde, pois em breve entraremos em contato para ajudar você! 💬\n\nEnquanto isso, você também pode perguntar sobre outras coisas.";
}

function responderPrecoProduto(pergunta) {
    const texto = normalizar(pergunta);

    const produto = catalogoLoja.find(function (item) {
        return item.palavras.some(function (palavra) {
            return texto.includes(normalizar(palavra));
        });
    });

    if (!produto) {
        adicionarMensagem(
            "Não encontrei esse produto no nosso catálogo. 😊 Temos mouse, teclado, headset, memória RAM, SSD e webcam. Qual deles você procura?",
            "bot"
        );
        return;
    }

    const mensagens = document.getElementById("mensagens");
    const caixa = document.createElement("div");
    caixa.className = "mensagem bot";

    const nome = document.createElement("strong");
    nome.textContent = produto.nome;

    const preco = document.createElement("p");
    preco.textContent = "Preço: " + produto.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const descricao = document.createElement("p");
    descricao.textContent = "Confira opções de compra deste produto:";

    const link = document.createElement("a");
    link.textContent = "🛒 Ver produto no Mercado Livre";
    link.href = "https://lista.mercadolivre.com.br/" + encodeURIComponent(produto.nome);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "block";
    link.style.marginTop = "10px";
    link.style.color = "#312e81";
    link.style.fontWeight = "bold";

    caixa.appendChild(nome);
    caixa.appendChild(preco);
    caixa.appendChild(descricao);
    caixa.appendChild(link);

    mensagens.appendChild(caixa);
    mensagens.scrollTop = mensagens.scrollHeight;
}
function lerAgendamentos() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_AGENDAMENTOS) || "[]");
    } catch (erro) {
        return [];
    }
}

function salvarAgendamentos(agendamentos) {
    localStorage.setItem(CHAVE_AGENDAMENTOS, JSON.stringify(agendamentos));
}

function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-").map(Number);

    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function criarMensagemComOpcoes(texto, opcoes, aoEscolher) {
    const mensagens = document.getElementById("mensagens");
    const caixa = document.createElement("div");
    caixa.className = "mensagem bot";

    const textoEl = document.createElement("p");
    textoEl.textContent = texto;
    caixa.appendChild(textoEl);

    const botoes = document.createElement("div");
    botoes.style.display = "flex";
    botoes.style.flexWrap = "wrap";
    botoes.style.gap = "8px";
    botoes.style.marginTop = "10px";

    opcoes.forEach(function (opcao) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = opcao.rotulo;
        botao.style.cursor = "pointer";
        botao.style.padding = "8px 12px";
        botao.style.borderRadius = "10px";
        botao.style.border = "1px solid #8b5cf6";
        botao.style.background = "#ffffff";
        botao.style.color = "#312e81";
        botao.style.fontWeight = "600";

        botao.addEventListener("click", function () {
            adicionarMensagem(opcao.rotulo, "usuario");
            aoEscolher(opcao.valor);
        });

        botoes.appendChild(botao);
    });

    caixa.appendChild(botoes);
    mensagens.appendChild(caixa);
    mensagens.scrollTop = mensagens.scrollHeight;
}

function iniciarAgendamento() {
    agendamentoEmAndamento = { etapa: "servico" };

    criarMensagemComOpcoes(
        "Qual serviço você deseja agendar? 💇‍♀️💅",
        SERVICOS_SALAO.map(function (servico) {
            return { rotulo: servico, valor: servico };
        }),
        function (servico) {
            agendamentoEmAndamento.servico = servico;
            escolherDataAgendamento();
        }
    );
}

function gerarDatasDisponiveis() {
    const datas = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Próximos 14 dias; salão atende de terça a sábado.
    for (let i = 0; i < 14 && datas.length < 7; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);

        if (data.getDay() >= 2 && data.getDay() <= 6) {
            const iso = [
                data.getFullYear(),
                String(data.getMonth() + 1).padStart(2, "0"),
                String(data.getDate()).padStart(2, "0")
            ].join("-");

            datas.push({ iso: iso, rotulo: formatarData(iso) });
        }
    }

    return datas;
}

function escolherDataAgendamento() {
    agendamentoEmAndamento.etapa = "data";

    const datas = gerarDatasDisponiveis();

    criarMensagemComOpcoes(
        "Escolha o dia desejado:",
        datas.map(function (data) {
            return { rotulo: data.rotulo, valor: data.iso };
        }),
        function (dataISO) {
            agendamentoEmAndamento.data = dataISO;
            escolherHorarioAgendamento();
        }
    );
}

function escolherHorarioAgendamento() {
    agendamentoEmAndamento.etapa = "horario";

    const agendamentos = lerAgendamentos();

    const horariosLivres = HORARIOS_AGENDAMENTO.filter(function (horario) {
        return !agendamentos.some(function (agendamento) {
            return agendamento.data === agendamentoEmAndamento.data &&
                agendamento.horario === horario;
        });
    });

    if (horariosLivres.length === 0) {
        adicionarMensagem(
            "Não há horários disponíveis nesse dia. Vamos escolher outra data. 📅",
            "bot"
        );
        escolherDataAgendamento();
        return;
    }

    criarMensagemComOpcoes(
        "Estes são os horários disponíveis para " +
            formatarData(agendamentoEmAndamento.data) + ":",
        horariosLivres.map(function (horario) {
            return { rotulo: horario, valor: horario };
        }),
        function (horario) {
            agendamentoEmAndamento.horario = horario;
            confirmarAgendamento();
        }
    );
}

function confirmarAgendamento() {
    agendamentoEmAndamento.etapa = "confirmacao";

    criarMensagemComOpcoes(
        "Confirme seu pedido:\n" +
            "Serviço: " + agendamentoEmAndamento.servico + "\n" +
            "Dia: " + formatarData(agendamentoEmAndamento.data) + "\n" +
            "Horário: " + agendamentoEmAndamento.horario,
        [
            { rotulo: "Confirmar agendamento", valor: "confirmar" },
            { rotulo: "Cancelar", valor: "cancelar" }
        ],
        function (acao) {
            if (acao === "cancelar") {
                agendamentoEmAndamento = null;
                adicionarMensagem(
                    "Tudo bem! O pedido de agendamento foi cancelado.",
                    "bot"
                );
                return;
            }

            const agendamentos = lerAgendamentos();

            const ocupado = agendamentos.some(function (agendamento) {
                return agendamento.data === agendamentoEmAndamento.data &&
                    agendamento.horario === agendamentoEmAndamento.horario;
            });

            if (ocupado) {
                adicionarMensagem(
                    "Esse horário acabou de ficar indisponível. Escolha outro, por favor.",
                    "bot"
                );
                escolherHorarioAgendamento();
                return;
            }

            agendamentos.push({
                id: Date.now(),
                servico: agendamentoEmAndamento.servico,
                data: agendamentoEmAndamento.data,
                horario: agendamentoEmAndamento.horario
            });

            salvarAgendamentos(agendamentos);

            adicionarMensagem(
                "Agendamento registrado nesta demonstração! ✅\n" +
                agendamentoEmAndamento.servico + " — " +
                formatarData(agendamentoEmAndamento.data) + " às " +
                agendamentoEmAndamento.horario + ".",
                "bot"
            );

            agendamentoEmAndamento = null;
        }
    );
}

function mostrarAgendamentos() {
    const agendamentos = lerAgendamentos();

    if (agendamentos.length === 0) {
        adicionarMensagem(
            "Ainda não há agendamentos registrados neste navegador.",
            "bot"
        );
        return;
    }

    const texto = agendamentos
        .slice()
        .sort(function (a, b) {
            return (a.data + a.horario).localeCompare(b.data + b.horario);
        })
        .map(function (agendamento, indice) {
            return (indice + 1) + ". " + agendamento.servico + " — " +
                formatarData(agendamento.data) + " às " + agendamento.horario;
        })
        .join("\n");

    adicionarMensagem("Seus agendamentos registrados:\n" + texto, "bot");
}

function enviarPergunta(texto) {
    if (!texto.trim()) return;

    adicionarMensagem(texto, "usuario");

    const pergunta = normalizar(texto);

    if (estabelecimentoAtual === "salao") {
        if (/\b(meus agendamentos|ver agendamentos|consultar agendamentos|listar agendamentos)\b/.test(pergunta)) {
            mostrarAgendamentos();
            return;
        }

        if (/\b(agendar|agendamento|marcar horario|reservar horario)\b/.test(pergunta)) {
            iniciarAgendamento();
            return;
        }
    }

    if (estabelecimentoAtual === "loja" && aguardandoProduto) {
        responderPrecoProduto(texto);
        aguardandoProduto = false;
        return;
    }

    if (
        estabelecimentoAtual === "loja" &&
        /\b(preco|precos|valor|valores|quanto custa|quanto e)\b/.test(pergunta)
    ) {
        aguardandoProduto = true;

        adicionarMensagem(
            "Claro! 😊 Qual produto você deseja consultar? Temos mouse, teclado, headset, memória RAM, SSD e webcam.",
            "bot"
        );
        return;
    }

    adicionarMensagem(responder(texto), "bot");
}

function perguntar(texto) {
    enviarPergunta(texto);
}

document.getElementById("formulario").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const campo = document.getElementById("mensagem");
    const texto = campo.value.trim();

    if (!texto) return;

    enviarPergunta(texto);
    campo.value = "";
    campo.focus();
});

function trocarEstabelecimento() {
    estabelecimentoAtual = "";
    aguardandoProduto = false;
    agendamentoEmAndamento = null;

    document.getElementById("chat").hidden = true;
    document.getElementById("escolha").hidden = false;
    document.getElementById("mensagens").innerHTML = "";
}