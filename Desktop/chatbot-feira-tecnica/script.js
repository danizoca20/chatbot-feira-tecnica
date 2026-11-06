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
            palavras: ["preco", "precos", "valor", "valores", "quanto custa", "quanto e"],
            resposta: "Nossos produtos de informática custam aproximadamente de R$ 80,00 a R$ 300,00, dependendo do produto e do modelo. 😊 Se quiser consultar um item específico, diga o nome dele!"
        },
        {
            palavras: ["desconto", "descontos", "promocao", "promocoes", "promocional"],
            resposta: "No momento, não temos descontos disponíveis. Quando houver novas promoções, avisaremos você! 😊"
        },
        {
            palavras: ["oque tem na loja", "oque vendem", "o que vende", "o que voces vendem", "quais produtos", "que produtos", "o que tem na loja", "produtos da loja", "o que comercializa"],
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
            palavras: ["servicos", "o que voces fazem", "o que oferece", "o que oferecem", "quais servicos", "o que tem no salao"],
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

        if (encontrou) return item.resposta;
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
    if (estabelecimentoAtual === "salao" && agendamentoEmAndamento) {
        const botaoCancelar = document.createElement("button");
        botaoCancelar.type = "button";
        botaoCancelar.textContent = "❌ Cancelar agendamento";
        botaoCancelar.style.padding = "8px 12px";
        botaoCancelar.style.borderRadius = "10px";
        botaoCancelar.style.cursor = "pointer";

        botaoCancelar.addEventListener("click", function () {
            adicionarMensagem("Cancelar agendamento", "usuario");
            cancelarAgendamento();
        });

        botoes.appendChild(botaoCancelar);
    }

    botoes.appendChild(botaoCancelar);
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
        adicionarMensagem("Não há horários disponíveis nesse dia. Vamos escolher outra data. 📅", "bot");
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
                adicionarMensagem("Esse horário acabou de ficar indisponível. Escolha outro, por favor.", "bot");
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

function consultarDisponibilidade(textoOriginal) {
    const texto = textoOriginal.toLowerCase();

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
        /(?:às?|as)?\s*(\d{1,2})(?::(\d{2}))?\s*(?:h(?:oras?)?|hrs?)?/i
    );

    if (!horarioEncontrado) {
        adicionarMensagem(
            `Para ${formatarData(dataISO(data))}, informe também o horário. Exemplo: "Tem horário para ${dia}/${String(mes).padStart(2, "0")}/${ano} às 11h?"`,
            "bot"
        );
        return true;
    }

    const hora = Number(horarioEncontrado[1]);
    const minutos = Number(horarioEncontrado[2] || 0);
    const horario = `${String(hora).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;

    const dataAgendamento = dataISO(data);
    const agendamentos = lerAgendamentos();

    if (data < new Date(new Date().setHours(0, 0, 0, 0))) {
        adicionarMensagem("Essa data já passou. Escolha uma data futura, por favor.", "bot");
        return true;
    }

    if (![2, 3, 4, 5, 6].includes(data.getDay())) {
        adicionarMensagem("Atendemos de terça a sábado. Escolha uma data entre esses dias.", "bot");
        return true;
    }

    if (!HORARIOS_AGENDAMENTO.includes(horario)) {
        adicionarMensagem(
            "Esse horário não faz parte dos nossos horários de atendimento. Temos opções das 9h às 17h, com pausa às 12h.",
            "bot"
        );
        return true;
    }

    const ocupado = agendamentos.some(function (agendamento) {
        return agendamento.data === dataAgendamento &&
            agendamento.horario === horario;
    });

    if (ocupado) {
        const livres = HORARIOS_AGENDAMENTO.filter(function (h) {
            return !agendamentos.some(function (agendamento) {
                return agendamento.data === dataAgendamento &&
                    agendamento.horario === h;
            });
        });

        adicionarMensagem(
            livres.length
                ? `Às ${horario}, esse horário já está ocupado. Para ${formatarData(dataAgendamento)}, ainda temos: ${livres.join(", ")}. Digite "agendar" para reservar.`
                : `Não temos mais horários disponíveis para ${formatarData(dataAgendamento)}. Digite "agendar" para escolher outra data.`,
            "bot"
        );
    } else {
        adicionarMensagem(
            `Sim! Temos disponibilidade em ${formatarData(dataAgendamento)} às ${horario}. Digite "agendar" para fazer sua reserva.`,
            "bot"
        );
    }

    return true;
}

function dataISO(data) {
    return [
        data.getFullYear(),
        String(data.getMonth() + 1).padStart(2, "0"),
        String(data.getDate()).padStart(2, "0")
    ].join("-");
}
function iniciarPagamento(metodo) {
    if (metodo === "pix") {
        pagamentoEmAndamento = "pix";

        const chavePix = "00000000-0000-4000-8000-000000000000";

        adicionarMensagem(
            "💠 Pagamento via Pix\n\n" +
            "Para concluir seu pagamento demonstrativo, utilize a chave Pix abaixo:\n\n" +
            "Chave Pix: " + chavePix + "\n\n" +
            "Depois de simular o envio do pagamento, digite: comprovante enviado\n\n" +
            "⚠️ Esta é uma simulação. Nenhum pagamento real será realizado.",
            "bot"
        );

        return;
    }

    if (metodo === "cartao") {
        pagamentoEmAndamento = null;

        if (compraEmAndamento) {
            concluirCompraLoja();
            return;
        }

        adicionarMensagem(
            "💳 O pagamento com cartão será realizado no dia do atendimento. Aguardamos você no horário agendado!",
            "bot"
        );

        return;
    }

    pagamentoEmAndamento = null;

    adicionarMensagem(
        "💵 O pagamento em dinheiro poderá ser entregue no dia do atendimento. Agradecemos pelo contato!",
        "bot"
    );
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
function adicionarAoCarrinho(texto) {
    const pergunta = normalizar(texto);

    const produtosEncontrados = catalogoLoja.filter(function (produto) {
        return produto.palavras.some(function (palavra) {
            return pergunta.includes(normalizar(palavra));
        });
    });

    if (produtosEncontrados.length === 0) {
        adicionarMensagem(
            "Não encontrei esse produto. Temos mouse, teclado, headset, memória RAM, SSD e webcam.",
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

    adicionarMensagem("Produto(s) adicionado(s) ao carrinho! 🛒", "bot");
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
        "Sua compra: " + resumoCompra + "\n\nEscolha uma forma de pagamento:",
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
}
function enviarPergunta(texto) {
    adicionarMensagem(texto, "usuario");

    const pergunta = normalizar(texto);
    // Simulação de envio e aprovação do comprovante Pix
    if (pagamentoEmAndamento === "pix") {

        if (
            pergunta.includes("cancelar") ||
            pergunta.includes("desistir")
        ) {
            pagamentoEmAndamento = null;

            adicionarMensagem(
                "❌ Pagamento Pix cancelado! Se desejar, você poderá escolher outra forma de pagamento.",
                "bot"
            );

            mostrarFormasPagamento();
            if (compraEmAndamento) {
                concluirCompraLoja();
            }
            return;
        }

        if (
            pergunta.includes("comprovante") ||
            pergunta.includes("enviei") ||
            pergunta.includes("paguei")
        ) {
            pagamentoEmAndamento = null;

            adicionarMensagem(
                "✅ Comprovante recebido! Pagamento aprovado na nossa demonstração. Obrigado!",
                "bot"
            );

            return;
        }

        adicionarMensagem(
            "Aguardamos o comprovante para continuar. Se mudou de ideia, digite CANCELAR.",
            "bot"
        );

        return;
    }

    // Mostrar opções quando o cliente perguntar sobre pagamento
    if (
        pergunta.includes("pagamento") ||
        pergunta.includes("formas de pagar") ||
        pergunta.includes("como pagar")
    ) {
        mostrarFormasPagamento();
        return;
    }

    // Se o cliente escolher Pix ou cartão diretamente
    if (pergunta === "pix") {
        iniciarPagamento("pix");
        return;
    }

    if (pergunta.includes("cartao")) {
        iniciarPagamento("cartao");
        return;
    }

    if (pergunta === "dinheiro") {
        iniciarPagamento("dinheiro");
        return;
    }

    if (estabelecimentoAtual === "salao") {
        if (
            pergunta.includes("meus agendamentos") ||
            pergunta.includes("ver agendamentos") ||
            pergunta.includes("minhas reservas")
        ) {
            mostrarAgendamentos();
            return;
        }

        if (consultarDisponibilidade(texto)) return;

        if (
            pergunta.includes("agendar") ||
            pergunta.includes("marcar horario") ||
            pergunta.includes("marcar um horario") ||
            pergunta.includes("quero marcar")
        ) {
            iniciarAgendamento();
            return;
        }
    }

    if (estabelecimentoAtual === "loja" && /\b(preco|precos|valor|quanto custa)\b/.test(pergunta)) {
        aguardandoProduto = true;
        adicionarMensagem("Qual produto você deseja consultar? Temos mouse, teclado, headset, memória RAM, SSD e webcam.", "bot");
        return;
    }

    if (aguardandoProduto) {
        aguardandoProduto = false;
        responderPrecoProduto(texto);
        return;
    }
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
}
function perguntar(texto) {
    const campoMensagem = document.getElementById("mensagem");
    campoMensagem.value = texto;

    document.getElementById("formulario").requestSubmit();
}
function mostrarPagamentoPix() {
    const chavePix = "00000000-0000-4000-8000-000000000000";

    criarMensagemBot(`
        <strong>💠 Pagamento via Pix</strong><br><br>
        Para simular seu pagamento, utilize a chave Pix abaixo:<br><br>
        <strong>Chave Pix:</strong><br>
        <code>${chavePix}</code><br><br>
        Após copiar a chave, imagine que realizou o pagamento e aguarde a confirmação.<br><br>
        <em>⚠️ Esta é uma simulação. Nenhum pagamento real será realizado.</em><br><br>
        <button type="button" onclick="copiarPix('${chavePix}')">
            📋 Copiar chave Pix
        </button>
    `);
}