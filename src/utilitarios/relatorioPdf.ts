import { jsPDF } from 'jspdf'
import * as pluginAutoTable from 'jspdf-autotable'
import type { UserOptions } from 'jspdf-autotable'
import type { DadosRelatorioTipo, ResumoParametroTipo } from './relatorioDados'
import { FAIXAS_RELATORIO } from './relatorioDados'
import { calcularSeveridade, type SeveridadeParametroTipo } from '../tipos/FaixasIdeais'

/*
  O pacote jspdf-autotable exporta a função de formas diferentes dependendo do
  empacotador (Vite, Webpack...). Aqui procuramos a função em todos os lugares
  possíveis, para funcionar de qualquer jeito.
*/
type FuncaoAutoTable = (doc: jsPDF, opcoes: UserOptions) => void

function obterAutoTable(): FuncaoAutoTable {
  const modulo = pluginAutoTable as unknown as Record<string, unknown>
  const padrao = modulo.default as Record<string, unknown> | undefined

  const candidatos = [modulo.autoTable, modulo.default, padrao?.default, padrao?.autoTable]
  const funcao = candidatos.find((item) => typeof item === 'function')
  if (funcao) return funcao as FuncaoAutoTable

  // plano B: instala o plugin dentro do jsPDF e usa doc.autoTable(...)
  const aplicar = (modulo.applyPlugin ?? padrao?.applyPlugin) as ((classe: unknown) => void) | undefined
  if (typeof aplicar === 'function') {
    aplicar(jsPDF)
    return (doc, opcoes) => (doc as unknown as { autoTable: (o: UserOptions) => void }).autoTable(opcoes)
  }

  throw new Error('Não foi possível carregar o jspdf-autotable (reinstale com npm install).')
}

function autoTable(doc: jsPDF, opcoes: UserOptions): void {
  obterAutoTable()(doc, opcoes)
}

type RGB = [number, number, number]

// ---------- Paleta do relatório ----------
const VERDE_ESCURO: RGB = [20, 83, 45]
const VERDE: RGB = [22, 163, 74]
const VERDE_CLARO: RGB = [220, 252, 231]
const TEXTO: RGB = [34, 34, 34]
const CINZA: RGB = [107, 114, 128]
const LINHA: RGB = [229, 231, 235]
const ZEBRA: RGB = [247, 250, 248]

const SITUACAO: Record<SeveridadeParametroTipo, { texto: string; fundo: RGB; letra: RGB }> = {
  ok: { texto: 'OK', fundo: [220, 252, 231], letra: [21, 128, 61] },
  atencao: { texto: 'ATENÇÃO', fundo: [254, 243, 199], letra: [180, 83, 9] },
  critico: { texto: 'CRÍTICO', fundo: [254, 226, 226], letra: [185, 28, 28] },
}

const COR_PARAMETRO: Record<string, RGB> = {
  nitrogenio: [34, 197, 94],
  fosforo: [59, 130, 246],
  potassio: [245, 158, 11],
  temperatura: [239, 68, 68],
  umidade: [20, 184, 166],
  ph: [168, 85, 247],
  condutividade: [99, 102, 241],
}

const CABECALHO_CURTO: Record<string, string> = {
  nitrogenio: 'N (mg/kg)',
  fosforo: 'P (mg/kg)',
  potassio: 'K (mg/kg)',
  temperatura: 'Temp. (°C)',
  umidade: 'Umid. (%)',
  ph: 'pH',
  condutividade: 'EC (µS/cm)',
}

const TITULO_TIPO = { diario: 'Diário', semanal: 'Semanal', mensal: 'Mensal' } as const
const AGRUPAMENTO = { diario: 'média por hora', semanal: 'média por dia', mensal: 'média por semana' } as const

// ---------- Medidas da página (A4, em mm) ----------
const LARGURA = 210
const ALTURA = 297
const MARGEM = 14
const AREA_UTIL = LARGURA - MARGEM * 2

function dataHora(ms: number): string {
  return new Date(ms).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function numero(valor: number | null, casas = 1): string {
  return valor === null ? '-' : valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })
}

function casasDe(chave: string): number {
  return chave === 'ph' ? 2 : 1
}

function comUnidade(valor: number | null, chave: string, unidade: string): string {
  if (valor === null) return '-'
  return unidade ? `${numero(valor, casasDe(chave))} ${unidade}` : numero(valor, casasDe(chave))
}

function ultimoY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
}

function tituloSecao(doc: jsPDF, texto: string, y: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...VERDE_ESCURO)
  doc.text(texto, MARGEM, y)
  doc.setDrawColor(...VERDE)
  doc.setLineWidth(0.6)
  doc.line(MARGEM, y + 2, MARGEM + 14, y + 2)
  return y + 8
}

function cabecalho(doc: jsPDF, dados: DadosRelatorioTipo): number {
  doc.setFillColor(...VERDE_ESCURO)
  doc.rect(0, 0, LARGURA, 36, 'F')
  doc.setFillColor(...VERDE)
  doc.rect(0, 36, LARGURA, 1.5, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text('AgroSync', MARGEM, 17)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`Relatório ${TITULO_TIPO[dados.tipo]} de Monitoramento do Solo`, MARGEM, 26)

  doc.setFontSize(8.5)
  doc.text(`Gerado em ${dataHora(Date.now())}`, LARGURA - MARGEM, 17, { align: 'right' })

  // faixa com as informações do período
  const y = 44
  doc.setFillColor(...VERDE_CLARO)
  doc.roundedRect(MARGEM, y, AREA_UTIL, 16, 2, 2, 'F')

  const colunas = [
    { rotulo: 'PERÍODO', valor: `${dataHora(dados.inicio)} a ${dataHora(dados.fim)}`, x: MARGEM + 4 },
    { rotulo: 'LEITURAS ANALISADAS', valor: dados.total.toLocaleString('pt-BR'), x: MARGEM + 108 },
    { rotulo: 'AGRUPAMENTO', valor: AGRUPAMENTO[dados.tipo], x: MARGEM + 146 },
  ]
  for (const coluna of colunas) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...CINZA)
    doc.text(coluna.rotulo, coluna.x, y + 6)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...TEXTO)
    doc.text(coluna.valor, coluna.x, y + 12)
  }
  return y + 16 + 10
}

function tabelaResumo(doc: jsPDF, resumo: ResumoParametroTipo[], y: number): number {
  const corpo = resumo.map((item) => [
    item.faixa.rotulo,
    comUnidade(item.media, item.faixa.chave, item.faixa.unidade),
    comUnidade(item.minimo, item.faixa.chave, item.faixa.unidade),
    comUnidade(item.maximo, item.faixa.chave, item.faixa.unidade),
    `${item.faixa.min} a ${item.faixa.max}${item.faixa.unidade ? ' ' + item.faixa.unidade : ''}`,
    item.severidade ? SITUACAO[item.severidade].texto : '-',
  ])

  autoTable(doc, {
    startY: y,
    margin: { left: MARGEM, right: MARGEM },
    head: [['Parâmetro', 'Média', 'Mínimo', 'Máximo', 'Faixa ideal', 'Situação']],
    body: corpo,
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.6, textColor: TEXTO, lineColor: LINHA, lineWidth: { bottom: 0.2 } },
    headStyles: { fillColor: VERDE_ESCURO, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: ZEBRA },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42 },
      5: { halign: 'center', fontStyle: 'bold', cellWidth: 26 },
    },
    didParseCell: (dadosCelula) => {
      if (dadosCelula.section !== 'body' || dadosCelula.column.index !== 5) return
      const severidade = resumo[dadosCelula.row.index].severidade
      if (!severidade) return
      dadosCelula.cell.styles.fillColor = SITUACAO[severidade].fundo
      dadosCelula.cell.styles.textColor = SITUACAO[severidade].letra
    },
  })
  return ultimoY(doc) + 8
}

function pontosDeAtencao(doc: jsPDF, resumo: ResumoParametroTipo[], y: number): number {
  const linhas: string[] = []
  for (const item of resumo) {
    if (item.media === null || item.severidade === null || item.severidade === 'ok') continue
    const lado = item.media < item.faixa.min ? 'abaixo' : 'acima'
    linhas.push(
      `${item.faixa.rotulo}: média de ${comUnidade(item.media, item.faixa.chave, item.faixa.unidade)}, ${lado} da faixa ideal (${item.faixa.min} a ${item.faixa.max}).`,
    )
  }

  const tudoOk = linhas.length === 0
  const textos = tudoOk ? ['Todos os parâmetros monitorados ficaram dentro da faixa ideal neste período.'] : linhas
  const altura = 8 + textos.length * 5
  const cor = tudoOk ? SITUACAO.ok : SITUACAO.atencao

  doc.setFillColor(...cor.fundo)
  doc.roundedRect(MARGEM, y, AREA_UTIL, altura, 2, 2, 'F')
  doc.setFillColor(...cor.letra)
  doc.rect(MARGEM, y, 1.6, altura, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...cor.letra)
  doc.text(tudoOk ? 'Tudo certo' : 'Pontos de atenção', MARGEM + 6, y + 6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  textos.forEach((texto, i) => doc.text(tudoOk ? texto : `- ${texto}`, MARGEM + 6, y + 6 + (i + 1) * 5))
  return y + altura + 10
}

// Mini gráfico de linha de um parâmetro (médias por hora/dia/semana)
function miniGrafico(
  doc: jsPDF,
  x: number,
  y: number,
  largura: number,
  altura: number,
  chave: string,
  titulo: string,
  rotulos: string[],
  valores: (number | null)[],
): void {
  const faixa = FAIXAS_RELATORIO.find((f) => f.chave === chave)!
  const cor = COR_PARAMETRO[chave] ?? VERDE

  // cartão
  doc.setDrawColor(...LINHA)
  doc.setLineWidth(0.3)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(x, y, largura, altura, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...TEXTO)
  doc.text(titulo, x + 4, y + 6)

  // área do desenho
  const px = x + 14
  const py = y + 11
  const pl = largura - 14 - 5
  const pa = altura - 11 - 9

  const presentes = valores.filter((v): v is number => v !== null)
  const menor = Math.min(faixa.min, ...presentes)
  const maior = Math.max(faixa.max, ...presentes)
  const folga = (maior - menor) * 0.1 || 1
  const yMin = menor - folga
  const yMax = maior + folga
  const paraY = (valor: number) => py + pa - ((valor - yMin) / (yMax - yMin)) * pa

  // faixa ideal sombreada
  doc.setFillColor(...VERDE_CLARO)
  doc.rect(px, paraY(faixa.max), pl, paraY(faixa.min) - paraY(faixa.max), 'F')

  // grade e valores do eixo Y
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...CINZA)
  doc.setDrawColor(...LINHA)
  doc.setLineWidth(0.15)
  for (let i = 0; i <= 2; i++) {
    const valor = yMin + ((yMax - yMin) * i) / 2
    const yy = paraY(valor)
    doc.line(px, yy, px + pl, yy)
    const casas = yMax - yMin < 10 ? 1 : 0
    doc.text(valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }), px - 1.5, yy + 1, { align: 'right' })
  }

  // linha: interrompida onde não há leitura
  const n = valores.length
  const paraX = (i: number) => (n === 1 ? px + pl / 2 : px + (i / (n - 1)) * pl)

  doc.setDrawColor(...cor)
  doc.setLineWidth(0.6)
  for (let i = 1; i < n; i++) {
    const a = valores[i - 1]
    const b = valores[i]
    if (a !== null && b !== null) doc.line(paraX(i - 1), paraY(a), paraX(i), paraY(b))
  }
  doc.setFillColor(...cor)
  valores.forEach((valor, i) => {
    if (valor !== null) doc.circle(paraX(i), paraY(valor), 0.8, 'F')
  })

  // rótulos do eixo X: primeiro, meio e último
  doc.setFontSize(6.5)
  doc.setTextColor(...CINZA)
  const yRotulo = py + pa + 5
  doc.text(rotulos[0], px, yRotulo, { align: 'left' })
  if (n >= 5) doc.text(rotulos[Math.floor((n - 1) / 2)], px + pl / 2, yRotulo, { align: 'center' })
  if (n >= 2) doc.text(rotulos[n - 1], px + pl, yRotulo, { align: 'right' })
}

function secaoGraficos(doc: jsPDF, dados: DadosRelatorioTipo, yInicial: number): number {
  let y = yInicial
  if (y > ALTURA - 70) {
    doc.addPage()
    y = 22
  }
  y = tituloSecao(doc, `Evolução (${AGRUPAMENTO[dados.tipo]})`, y)

  const rotulos = dados.grupos.map((g) => g.rotulo)
  const larguraCartao = (AREA_UTIL - 6) / 2
  const alturaCartao = 50

  for (let i = 0; i < FAIXAS_RELATORIO.length; i += 2) {
    if (y + alturaCartao > ALTURA - 18) {
      doc.addPage()
      y = 22
    }
    for (let coluna = 0; coluna < 2; coluna++) {
      const faixa = FAIXAS_RELATORIO[i + coluna]
      if (!faixa) continue
      const valores = dados.grupos.map((g) => g.medias[faixa.chave] ?? null)
      miniGrafico(
        doc,
        MARGEM + coluna * (larguraCartao + 6),
        y,
        larguraCartao,
        alturaCartao,
        faixa.chave,
        `${faixa.rotulo}${faixa.unidade ? ' (' + faixa.unidade + ')' : ''}`,
        rotulos,
        valores,
      )
    }
    y += alturaCartao + 6
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...CINZA)
  doc.text('A área verde clara de cada gráfico indica a faixa ideal do parâmetro.', MARGEM, y + 1)
  return y + 10
}

function tabelaPorGrupo(doc: jsPDF, dados: DadosRelatorioTipo, yInicial: number): void {
  let y = yInicial
  if (y > ALTURA - 60) {
    doc.addPage()
    y = 22
  }
  y = tituloSecao(doc, `Médias detalhadas (${AGRUPAMENTO[dados.tipo]})`, y)

  const linhas = dados.grupos.filter((g) => g.leituras > 0)
  const cabecalhoTabela = [
    dados.nomeGrupo,
    ...FAIXAS_RELATORIO.map((f) => CABECALHO_CURTO[f.chave] ?? f.rotulo),
    'Leituras',
  ]
  const corpo = linhas.map((g) => [
    g.rotulo,
    ...FAIXAS_RELATORIO.map((f) => numero(g.medias[f.chave] ?? null, casasDe(f.chave))),
    String(g.leituras),
  ])

  autoTable(doc, {
    startY: y,
    margin: { left: MARGEM, right: MARGEM, bottom: 20 },
    head: [cabecalhoTabela],
    body: corpo,
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, halign: 'center', textColor: TEXTO, lineColor: LINHA, lineWidth: { bottom: 0.2 } },
    headStyles: { fillColor: VERDE_ESCURO, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: ZEBRA },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold', cellWidth: 30 } },
    didParseCell: (c) => {
      // colore o número que ficou fora da faixa ideal
      if (c.section !== 'body' || c.column.index === 0 || c.column.index > FAIXAS_RELATORIO.length) return
      const faixa = FAIXAS_RELATORIO[c.column.index - 1]
      const media = linhas[c.row.index].medias[faixa.chave]
      if (media === null || media === undefined) return
      const severidade = calcularSeveridade(media, faixa)
      if (severidade !== 'ok') {
        c.cell.styles.textColor = SITUACAO[severidade].letra
        c.cell.styles.fontStyle = 'bold'
      }
    },
  })
}

function rodape(doc: jsPDF): void {
  const total = doc.getNumberOfPages()
  for (let pagina = 1; pagina <= total; pagina++) {
    doc.setPage(pagina)
    doc.setDrawColor(...LINHA)
    doc.setLineWidth(0.3)
    doc.line(MARGEM, ALTURA - 13, LARGURA - MARGEM, ALTURA - 13)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...CINZA)
    doc.text('AgroSync - Monitoramento inteligente do solo', MARGEM, ALTURA - 8)
    doc.text(`Página ${pagina} de ${total}`, LARGURA - MARGEM, ALTURA - 8, { align: 'right' })
  }
}

// Monta o PDF e devolve o arquivo (Blob) pronto para baixar
export function gerarPdf(dados: DadosRelatorioTipo): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  let y = cabecalho(doc, dados)
  y = tituloSecao(doc, 'Resumo do período', y)
  y = tabelaResumo(doc, dados.resumo, y)
  y = pontosDeAtencao(doc, dados.resumo, y)
  y = secaoGraficos(doc, dados, y)
  tabelaPorGrupo(doc, dados, y)
  rodape(doc)

  return doc.output('blob')
}