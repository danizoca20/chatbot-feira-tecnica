
let estabelecimentoAtual = "";
let aguardandoProduto = false;

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
            palavras: [
                "preco",
                "precos",
                "preço",
                "preços",
                "valor",
                "valores",
                "quanto custa",
                "quanto e"
            ],
            resposta: "Nossos produtos de informática custam aproximadamente de R$ 80,00 a R$ 300,00, dependendo do produto e do modelo. 😊 Se quiser consultar um item específico, diga o nome dele!"
        },
        {
            palavras: [
                "desconto",
                "descontos",
                "promocao",
                "promocoes",
                "promocional"
            ],
            resposta: "No momento, não temos descontos disponíveis. Quando houver novas promoções, avisaremos você! 😊"
        },
        {
            palavras: [
                "oque tem na loja",
                "oque vendem",
                "o que vende",
                "o que voces vendem",
                "o que vocês vendem",
                "quais produtos",
                "que produtos",
                "o que tem na loja",
                "produtos da loja",
                "o que comercializa"
            ],
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
            palavras: ["horario", "funcionamento", "abre", "fecha"],
            resposta: "Nosso salão funciona de terça a sábado, das 9h às 19h. 💇"
        },
        {
            palavras: ["preco", "precos", "valor", "servico", "servicos"],
            resposta: "Confira alguns serviços: Corte: R$ 45,00; Escova: R$ 60,00; Manicure: R$ 35,00; Hidratação: R$ 80,00. ✨"
        },
        {
            palavras: ["agendamento", "agendar", "marcar", "horario disponivel"],
            resposta: "Para agendar, informe o serviço desejado e o melhor dia para nossa equipe. 📅"
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

function enviarPergunta(texto) {
    if (!texto.trim()) return;

    adicionarMensagem(texto, "usuario");

    const pergunta = normalizar(texto);

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

    document.getElementById("chat").hidden = true;
    document.getElementById("escolha").hidden = false;
    document.getElementById("mensagens").innerHTML = "";
}
