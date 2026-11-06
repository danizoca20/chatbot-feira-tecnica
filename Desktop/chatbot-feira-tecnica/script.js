
let pagamentoEmAndamento = null;
let estabelecimentoAtual = "";
let aguardandoProduto = false;
let agendamentoEmAndamento = null;
let carrinho = [];
let compraEmAndamento = false;
let resumoCompra = "";

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
            palavras: ["desconto", "descontos", "promocao", "promocoes"],
            resposta: "No momento, não temos descontos disponíveis. Quando houver novas promoções, avisaremos você! 😊"
        },
        {
            palavras: ["oque tem na loja", "o que tem na loja", "oque vendem", "o que vende", "o que voces vendem", "quais produtos", "que produtos", "produtos da loja"],
            resposta: "Vendemos produtos de informática, como mouse, teclado, headset, memória RAM, SSD e webcam. 💻"
        },
        {
            palavras: ["horario", "funcionamento", "abre", "fecha"],
            resposta: "Nossa loja funciona de segunda a sábado, das 8h às 18h. 😊"
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
            palavras: ["contato", "telefone", "whatsapp"],
            resposta: "Nosso atendimento está disponível pelo telefone fictício (31) 99999-0000."
        }
    ],

    salao: [
        {
            palavras: ["servicos", "o que voces fazem", "o que oferece", "quais servicos", "o que tem no salao"],
            resposta: "Nosso salão oferece:\n\n✨ Corte de cabelo\n✨ Escova\n✨ Hidratação\n✨ Penteados\n✨ Manicure\n\nNão realizamos serviços de pedicure. 💅"
        },
        {
            palavras: ["horario", "funcionamento", "abre", "fecha"],
            resposta: "Nosso salão funciona de terça a sábado, das 9h às 19h. 💇"
        },
        {
            palavras: ["preco", "precos", "valor", "valores", "quanto custa"],
            resposta: "Confira nossos preços:\n\n✂️ Corte: R$ 45,00\n💇 Escova: R$ 60,00\n💅 Manicure: R$ 35,00\n✨ Hidratação: R$ 80,00\n\nPara penteados, consulte nossa equipe."
        },
        {
            palavras: ["endereco", "localizacao", "onde fica"],
            resposta: "Nosso salão fictício fica na Rua das Flores, número 250. 📍"
        },
        {
            palavras: ["contato", "telefone", "whatsapp"],
            resposta: "Nosso contato fictício é (31) 98888-0000."
        }
    ]
};

// NORMALIZAÇÃO

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
    pagamentoEmAndamento = null;

    document.getElementById("escolha").hidden = true;
    document.getElementById("chat").hidden = false;
    document.getElementById("mensagens").innerHTML = "";

    const nome = tipo === "loja" ? "loja" : "salão de beleza";

    adicionarMensagem(
        "Olá! Sou o AtendeBot da nossa " + nome +
        ". 🤖 Como posso ajudar você hoje? Pergunte sobre horários, preços, pagamentos e outros assuntos!",
        "bot"
    );
}

// RESPOSTAS AUTOMÁTICAS

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

        if (encontrou) return item.resposta;
    }

    return "No momento, não temos essa informação disponível em nosso atendimento. Sua dúvida já foi encaminhada para nossa equipe. Por favor, aguarde, pois em breve entraremos em contato para ajudar você! 💬";
}

// PRODUTOS

function responderPrecoProduto(pergunta) {
    const texto = normalizar(pergunta);

    const produto = catalogoLoja.find(function (item) {
        return item.palavras.some(function (palavra) {
            return texto.includes(normalizar(palavra));
        });
    });

    if (!produto) {
        adicionarMensagem(
            "Não encontramos esse produto no catálogo. Temos mouse, teclado, headset, memória RAM, SSD e webcam. Qual deles você procura?",
            "bot"
        );
        aguardandoProduto = true;
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

    caixa.appendChild(nome);
    caixa.appendChild(preco);
    caixa.appendChild(descricao);
    caixa.appendChild(link);

    mensagens.appendChild(caixa);
    mensagens.scrollTop = mensagens.scrollHeight;
}

// AGENDAMENTOS

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

function dataISO(data) {
    return [
        data.getFullYear(),
        String(data.getMonth() + 1).padStart(2, "0"),
        String(data.getDate()).padStart(2, "0")
    ].join("-");
}

// BOTÕES DE OPÇÕES

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

    if (agendamentoEmAndamento) {
        const botaoCancelar = document.createElement("button");

        botaoCancelar.type = "button";
        botaoCancelar.textContent = "❌ Cancelar agendamento";

        botaoCancelar.addEventListener("click", function () {
            adicionarMensagem("Cancelar agendamento", "usuario");
            cancelarAgendamento();
        });

        botoes.appendChild(botaoCancelar);
    }

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

function cancelarAgendamento() {
    if (!agendamentoEmAndamento) {
        adicionarMensagem("Não existe agendamento em andamento para cancelar.", "bot");
        return;
    }

    agendamentoEmAndamento = null;

    adicionarMensagem(
        "❌ Agendamento cancelado! Quando quiser, estaremos à disposição para marcar outro horário. 😊",
        "bot"
    );
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

    for (let i = 0; i < 30 && datas.length < 10; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);

        if (data.getDay() >= 2 && data.getDay() <= 6) {
            const iso = dataISO(data);

            datas.push({
                iso: iso,
                rotulo: formatarData(iso)
            });
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
        function (dataISOEscolhida) {
            agendamentoEmAndamento.data = dataISOEscolhida;
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
                adicionarMensagem("Tudo bem! O pedido de agendamento foi cancelado.", "bot");
                return;
            }

            const agendamentos = lerAgendamentos();

            const ocupado = agendamentos.some(function (agendamento) {
                return agendamento.data === agendamentoEmAndamento.data &&
                    agendamento.horario === agendamentoEmAndamento.horario;
            });

            if (ocupado) {
                adicionarMensagem("Esse horário acabou de ficar indisponível. Escolha outro.", "bot");
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
        adicionarMensagem("Ainda não há agendamentos registrados neste navegador.", "bot");
        return;
    }

    const mensagens = document.getElementById("mensagens");
    const caixa = document.createElement("div");

    caixa.className = "mensagem bot";

    const titulo = document.createElement("p");
    titulo.textContent = "📅 Seus agendamentos registrados:";
    caixa.appendChild(titulo);

    agendamentos.forEach(function (agendamento) {
        const item = document.createElement("p");

        item.textContent =
            agendamento.servico + " — " +
            formatarData(agendamento.data) + " às " +
            agendamento.horario;

        caixa.appendChild(item);

        const botao = document.createElement("button");

        botao.type = "button";
        botao.textContent = "Cancelar este horário";

        botao.addEventListener("click", function () {
            const atualizados = lerAgendamentos().filter(function (item) {
                return item.id !== agendamento.id;
            });

            salvarAgendamentos(atualizados);

            adicionarMensagem("Agendamento cancelado com sucesso! ❌", "bot");
            mostrarAgendamentos();
        });

        caixa.appendChild(botao);
    });

    mensagens.appendChild(caixa);
    mensagens.scrollTop = mensagens.scrollHeight;
}

// CONSULTA DE DISPONIBILIDADE

function consultarDisponibilidade(textoOriginal) {
    const texto = normalizar(textoOriginal);

    const dataEncontrada = texto.match(
        /(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/
    );

    if (!dataEncontrada) return false;

    const dia = Number(dataEncontrada[1]);
    const mes = Number(dataEncontrada[2]);
    const ano = Number(dataEncontrada[3]);

    const data = new Date(ano, mes - 1, dia);

    if (
        data.getFullYear() !== ano ||
        data.getMonth() !== mes - 1 ||
        data.getDate() !== dia
    ) {
        adicionarMensagem("Essa data não é válida. Confira e tente novamente.", "bot");
        return true;
    }

    const textoDepoisDaData = texto.slice(
        dataEncontrada.index + dataEncontrada[0].length
    );

    const horarioEncontrado = textoDepoisDaData.match(
        /(?:as)?\s*(\d{1,2})(?::(\d{2}))?\s*(?:h(?:oras?)?|hrs?)?/i
    );

    if (!horarioEncontrado) {
        adicionarMensagem(
            "Informe também o horário desejado. Exemplo: Tem horário para 10/11/2026 às 11h?",
            "bot"
        );
        return true;
    }

    const hora = Number(horarioEncontrado[1]);
    const minutos = Number(horarioEncontrado[2] || 0);

    const horario =
        String(hora).padStart(2, "0") + ":" +
        String(minutos).padStart(2, "0");

    const dataAgendamento = dataISO(data);

    if (data < new Date(new Date().setHours(0, 0, 0, 0))) {
        adicionarMensagem("Essa data já passou. Escolha uma data futura.", "bot");
        return true;
    }

    if (![2, 3, 4, 5, 6].includes(data.getDay())) {
        adicionarMensagem("Atendemos de terça a sábado. Escolha uma data entre esses dias.", "bot");
        return true;
    }

    if (!HORARIOS_AGENDAMENTO.includes(horario)) {
        adicionarMensagem(
            "Esse horário não está disponível. Temos opções das 9h às 11h e das 13h às 17h.",
            "bot"
        );
        return true;
    }

    const agendamentos = lerAgendamentos();

    const ocupado = agendamentos.some(function (agendamento) {
        return agendamento.data === dataAgendamento &&
            agendamento.horario === horario;
    });

    if (ocupado) {
        adicionarMensagem(
            "Esse horário já está ocupado. Digite AGENDAR para escolher outro horário.",
            "bot"
        );
    } else {
        adicionarMensagem(
            "Sim! Temos disponibilidade em " +
            formatarData(dataAgendamento) + " às " + horario +
            ". Digite AGENDAR para reservar.",
            "bot"
        );
    }

    return true;
}

// PAGAMENTOS

function iniciarPagamento(metodo) {
    if (metodo === "pix") {
        pagamentoEmAndamento = "pix";

        const chavePix = "00000000-0000-4000-8000-000000000000";

        adicionarMensagem(
            "💠 Pagamento via Pix (simulação)\n\n" +
            "Chave Pix fictícia: " + chavePix +
            "\n\nNenhuma transferência real deve ser realizada. " +
            "Digite COMPROVANTE ENVIADO para simular a confirmação ou CANCELAR para desistir.",
            "bot"
        );

        return;
    }

    pagamentoEmAndamento = null;

    if (estabelecimentoAtual === "loja" && compraEmAndamento) {
        concluirCompraLoja();
        return;
    }

    if (estabelecimentoAtual === "salao") {
        adicionarMensagem(
            metodo === "cartao"
                ? "💳 O pagamento com cartão será realizado no dia do atendimento!"
                : "💵 O pagamento em dinheiro poderá ser realizado no dia do atendimento!",
            "bot"
        );
    } else {
        adicionarMensagem(
            "Pagamento selecionado na demonstração. Nenhuma cobrança real será realizada.",
            "bot"
        );

        concluirCompraLoja();
    }
}

function mostrarFormasPagamento() {
    criarMensagemComOpcoes(
        "Como deseja realizar o pagamento?",
        [
            { rotulo: "Pix", valor: "pix" },
            { rotulo: "Cartão", valor: "cartao" },
            { rotulo: "Dinheiro", valor: "dinheiro" }
        ],
        function (metodo) {
            iniciarPagamento(metodo);
        }
    );
}

// CARRINHO

function adicionarAoCarrinho(texto) {
    const pergunta = normalizar(texto);

    const produtosEncontrados = catalogoLoja.filter(function (produto) {
        return produto.palavras.some(function (palavra) {
            return pergunta.includes(normalizar(palavra));
        });
    });

    if (produtosEncontrados.length === 0) {
        adicionarMensagem(
            "Não encontramos esse produto. Temos mouse, teclado, headset, memória RAM, SSD e webcam.",
            "bot"
        );
        return;
    }

    produtosEncontrados.forEach(function (produto) {
        const existente = carrinho.find(function (item) {
            return item.nome === produto.nome;
        });

        if (existente) {
            existente.quantidade++;
        } else {
            carrinho.push({
                nome: produto.nome,
                preco: produto.preco,
                quantidade: 1
            });
        }
    });

    adicionarMensagem("Produto adicionado ao carrinho! 🛒", "bot");
    mostrarCarrinho();
}

function mostrarCarrinho() {
    if (carrinho.length === 0) {
        adicionarMensagem("Seu carrinho está vazio. 🛒", "bot");
        return;
    }

    const total = carrinho.reduce(function (soma, item) {
        return soma + item.preco * item.quantidade;
    }, 0);

    const resumo = carrinho.map(function (item) {
        return item.quantidade + "x " + item.nome +
            " — " + (item.preco * item.quantidade).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
    }).join("\n");

    adicionarMensagem(
        "🛒 SEU CARRINHO\n\n" + resumo +
        "\n\nTotal: " + total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }),
        "bot"
    );

    const opcoes = carrinho.map(function (item) {
        return {
            rotulo: "Remover " + item.nome,
            valor: "remover:" + item.nome
        };
    });

    opcoes.push(
        { rotulo: "Finalizar compra", valor: "finalizar" },
        { rotulo: "Cancelar compra", valor: "cancelar" }
    );

    criarMensagemComOpcoes(
        "O que deseja fazer agora?",
        opcoes,
        function (acao) {
            if (acao === "finalizar") {
                finalizarCompra();
                return;
            }

            if (acao === "cancelar") {
                carrinho = [];
                compraEmAndamento = false;
                pagamentoEmAndamento = null;

                adicionarMensagem("Compra cancelada. Seu carrinho foi esvaziado. ❌", "bot");
                return;
            }

            if (acao.startsWith("remover:")) {
                const nome = acao.replace("remover:", "");

                carrinho = carrinho.filter(function (item) {
                    return item.nome !== nome;
                });

                adicionarMensagem(nome + " removido do carrinho.", "bot");
                mostrarCarrinho();
            }
        }
    );
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        adicionarMensagem("Seu carrinho está vazio!", "bot");
        return;
    }

    const total = carrinho.reduce(function (soma, item) {
        return soma + item.preco * item.quantidade;
    }, 0);

    resumoCompra = carrinho.map(function (item) {
        return item.quantidade + "x " + item.nome;
    }).join(", ");

    resumoCompra += " — Total: " + total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    compraEmAndamento = true;

    adicionarMensagem(
        "Sua compra: " + resumoCompra +
        "\n\nEscolha uma forma de pagamento:",
        "bot"
    );

    mostrarFormasPagamento();
}

function concluirCompraLoja() {
    adicionarMensagem(
        "✅ Compra registrada nesta demonstração!\n\n" +
        resumoCompra +
        "\n\n⚠️ Nenhum pagamento real foi realizado.",
        "bot"
    );

    carrinho = [];
    compraEmAndamento = false;
    resumoCompra = "";
    pagamentoEmAndamento = null;
}

// ENVIO DE PERGUNTAS

function enviarPergunta(texto) {
    adicionarMensagem(texto, "usuario");

    const pergunta = normalizar(texto);

    // CANCELAMENTO DO PIX

    if (pagamentoEmAndamento === "pix") {
        if (pergunta.includes("cancelar") || pergunta.includes("desistir")) {
            pagamentoEmAndamento = null;

            adicionarMensagem(
                "❌ Pagamento Pix cancelado! Sua compra não foi concluída.",
                "bot"
            );

            mostrarFormasPagamento();
            return;
        }

        if (
            pergunta.includes("comprovante") ||
            pergunta.includes("enviei") ||
            pergunta.includes("paguei")
        ) {
            pagamentoEmAndamento = null;

            adicionarMensagem(
                "✅ Confirmação simulada recebida! Obrigado por participar da demonstração.",
                "bot"
            );

            if (estabelecimentoAtual === "loja" && compraEmAndamento) {
                concluirCompraLoja();
            }

            return;
        }

        adicionarMensagem(
            "Aguardamos a confirmação simulada. Digite COMPROVANTE ENVIADO ou CANCELAR.",
            "bot"
        );

        return;
    }

    // PAGAMENTO

    if (
        pergunta.includes("formas de pagar") ||
        pergunta.includes("como pagar") ||
        pergunta.includes("formas de pagamento") ||
        pergunta.includes("qual pagamento")
    ) {
        mostrarFormasPagamento();
        return;
    }

    if (pergunta === "pix") {
        iniciarPagamento("pix");
        return;
    }

    if (pergunta === "cartao") {
        iniciarPagamento("cartao");
        return;
    }

    if (pergunta === "dinheiro") {
        iniciarPagamento("dinheiro");
        return;
    }

    // SALÃO

    if (estabelecimentoAtual === "salao") {
        if (
            pergunta.includes("meus agendamentos") ||
            pergunta.includes("ver agendamentos") ||
            pergunta.includes("minhas reservas")
        ) {
            mostrarAgendamentos();
            return;
        }

        if (
            pergunta.includes("cancelar agendamento") ||
            pergunta.includes("cancelar horario") ||
            pergunta.includes("desmarcar")
        ) {
            if (agendamentoEmAndamento) {
                cancelarAgendamento();
            } else {
                mostrarAgendamentos();
            }
            return;
        }

        if (consultarDisponibilidade(texto)) return;

        if (
            pergunta.includes("agendar") ||
            pergunta.includes("marcar horario") ||
            pergunta.includes("quero marcar")
        ) {
            iniciarAgendamento();
            return;
        }
    }

    // CONSULTA DE PREÇO DA LOJA

    if (
        estabelecimentoAtual === "loja" &&
        /\b(preco|precos|valor|valores|quanto custa)\b/.test(pergunta)
    ) {
        aguardandoProduto = true;

        adicionarMensagem(
            "Qual produto você deseja consultar? Temos mouse, teclado, headset, memória RAM, SSD e webcam.",
            "bot"
        );

        return;
    }

    if (aguardandoProduto) {
        aguardandoProduto = false;
        responderPrecoProduto(texto);
        return;
    }

    // LOJA

    if (estabelecimentoAtual === "loja") {
        if (
            pergunta.includes("ver carrinho") ||
            pergunta.includes("mostrar carrinho") ||
            pergunta === "carrinho"
        ) {
            mostrarCarrinho();
            return;
        }

        if (
            pergunta.includes("cancelar compra") ||
            pergunta.includes("desistir da compra")
        ) {
            carrinho = [];
            compraEmAndamento = false;
            pagamentoEmAndamento = null;
            resumoCompra = "";

            adicionarMensagem("Compra cancelada! Seu carrinho foi esvaziado. ❌", "bot");
            return;
        }

        if (
            pergunta.includes("comprar") ||
            pergunta.includes("adicionar ao carrinho") ||
            pergunta.includes("colocar no carrinho")
        ) {
            adicionarAoCarrinho(texto);
            return;
        }
    }

    adicionarMensagem(responder(texto), "bot");
}

// FORMULÁRIO

document.getElementById("formulario").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const campo = document.getElementById("mensagem");
    const texto = campo.value.trim();

    if (!texto) return;

    enviarPergunta(texto);

    campo.value = "";
    campo.focus();
});

// TROCAR ESTABELECIMENTO

function trocarEstabelecimento() {
    estabelecimentoAtual = "";
    aguardandoProduto = false;
    agendamentoEmAndamento = null;
    pagamentoEmAndamento = null;

    document.getElementById("chat").hidden = true;
    document.getElementById("escolha").hidden = false;
}

// BOTÕES DE PERGUNTAS RÁPIDAS

function perguntar(texto) {
    const campoMensagem = document.getElementById("mensagem");

    campoMensagem.value = texto;

    document.getElementById("formulario").requestSubmit();
}
