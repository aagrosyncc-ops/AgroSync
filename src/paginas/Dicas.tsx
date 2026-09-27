import estilos from './Dicas.module.css'
import { Cabecalho } from '../componentes/layout/Cabecalho'
import { Rodape } from '../componentes/layout/Rodape'
import { FiSun, FiDroplet, FiWind, FiCalendar } from 'react-icons/fi'
import { LuLeaf, LuSprout, LuBug, LuFlower2 } from 'react-icons/lu'

const dicasPlantio = [
  {
    icon: LuSprout,
    titulo: 'Preparação do Solo',
    descricao:
      'Antes de plantar, certifique-se de que o solo está bem aerado e com os níveis adequados de nutrientes. Use o Agro Sync para verificar NPK.',
    dicas: [
      'Realize análise do solo antes do plantio',
      'Corrija o pH se necessário (ideal entre 6.0 e 7.0)',
      'Adicione matéria orgânica para melhorar a estrutura',
    ],
  },
  {
    icon: FiDroplet,
    titulo: 'Irrigação Inteligente',
    descricao:
      'A quantidade de água varia conforme a cultura e o estágio de crescimento. Monitore a umidade constantemente.',
    dicas: [
      'Irrigue nas primeiras horas da manhã',
      'Evite molhar as folhas para prevenir doenças',
      'Mantenha umidade entre 60% e 80% para a maioria das culturas',
    ],
  },
  {
    icon: FiSun,
    titulo: 'Luminosidade Adequada',
    descricao:
      'Cada cultura tem necessidades específicas de luz. Plantas de frutos geralmente precisam de mais sol.',
    dicas: [
      'Tomates: 6-8 horas de sol direto',
      'Alface: 4-6 horas (tolera sombra parcial)',
      'Morangos: 6+ horas de sol pleno',
    ],
  },
  {
    icon: LuLeaf,
    titulo: 'Nutrição das Plantas',
    descricao:
      'NPK são os macronutrientes essenciais. N (Nitrogênio) para folhas, P (Fósforo) para raízes e K (Potássio) para frutos.',
    dicas: [
      'Nitrogênio alto na fase vegetativa',
      'Fósforo importante no início do ciclo',
      'Potássio essencial na formação de frutos',
    ],
  },
]

const dicasColheita = [
  {
    icon: FiCalendar,
    titulo: 'Momento Certo',
    descricao:
      'Cada cultura tem seu ponto ideal de colheita. Colher cedo ou tarde demais afeta qualidade e durabilidade.',
    culturas: [
      { nome: 'Tomate', tempo: '60-80 dias após transplante' },
      { nome: 'Morango', tempo: '4-6 semanas após floração' },
      { nome: 'Alface', tempo: '45-60 dias após semeadura' },
    ],
  },
  {
    icon: FiWind,
    titulo: 'Condições Ideais',
    descricao:
      'Prefira colher pela manhã, quando as plantas estão mais hidratadas e a temperatura está amena.',
    dicas: [
      'Evite colher após chuvas fortes',
      'Use ferramentas limpas e afiadas',
      'Manuseie com cuidado para evitar danos',
    ],
  },
  {
    icon: LuFlower2,
    titulo: 'Sinais de Maturação',
    descricao: 'Observe cor, tamanho e textura para determinar o momento ideal da colheita.',
    dicas: [
      'Tomate: cor vermelha uniforme, ligeiramente macio',
      'Morango: vermelho brilhante, aroma adocicado',
      'Alface: folhas firmes, tamanho adequado',
    ],
  },
  {
    icon: LuBug,
    titulo: 'Controle de Pragas',
    descricao: 'Monitore constantemente e atue preventivamente para evitar perdas na colheita.',
    dicas: [
      'Inspecione plantas regularmente',
      'Use controle biológico quando possível',
      'Rotação de culturas reduz pragas',
    ],
  },
]

export function Dicas() {
  return (
    <div className={estilos.pagina}>
      <Cabecalho />
      <main className={estilos.conteudoPagina}>
    <div className={estilos.conteiner}>

      <section className={estilos.cabecalhoSecao}>
        <h1>Dicas de Plantio e Colheita</h1>
        <p>
          Aprenda as melhores práticas para maximizar a qualidade e produtividade da sua plantação
          com orientações baseadas em dados e conhecimento agronômico.
        </p>
      </section>

      <section className={estilos.secao}>
        <h2 className={estilos.secaoTitulo}>
          <LuSprout /> Dicas de Plantio
        </h2>
        <div className={estilos.conteinerCartoes}>
          {dicasPlantio.map((dica, index) => (
            <div key={index} className={estilos.cartao}>
              <div className={estilos.iconeCartao}>
                <dica.icon />
              </div>
              <h3>{dica.titulo}</h3>
              <p className={estilos.descricaoCartao}>{dica.descricao}</p>
              <ul className={estilos.listaCartao}>
                {dica.dicas.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={estilos.secao}>
        <h2 className={estilos.secaoTitulo}>
          <LuFlower2 /> Dicas de Colheita
        </h2>
        <div className={estilos.conteinerCartoes}>
          {dicasColheita.map((dica, index) => (
            <div key={index} className={estilos.cartao}>
              <div className={estilos.iconeCartao}>
                <dica.icon />
              </div>
              <h3>{dica.titulo}</h3>
              <p className={estilos.descricaoCartao}>{dica.descricao}</p>
              {'culturas' in dica ? (
                <div className={estilos.culturas}>
                  {dica.culturas?.map((cultura, i) => (
                    <div key={i} className={estilos.cultura}>
                      <strong>{cultura.nome}:</strong> {cultura.tempo}
                    </div>
                  ))}
                </div>
              ) : (
                <ul className={estilos.listaCartao}>
                  {dica.dicas.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={estilos.secaoTabela}>
        <h2 className={estilos.secaoTitulo}>
          <LuLeaf /> Valores Ideais por Cultura
        </h2>

        <div className={estilos.conteinerTabela}>
          <table className={estilos.tabela}>
            <thead>
              <tr>
                <th>Cultura</th>
                <th>pH Ideal</th>
                <th>Temp. (°C)</th>
                <th>Umidade (%)</th>
                <th>N (mg/kg)</th>
                <th>P (mg/kg)</th>
                <th>K (mg/kg)</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Abóbora</td>
                <td>6.0 - 6.8</td>
                <td>20 - 30</td>
                <td>60 - 80</td>
                <td>40 - 70</td>
                <td>30 - 55</td>
                <td>40 - 65</td>
              </tr>

              <tr>
                <td>Alface</td>
                <td>6.0 - 7.0</td>
                <td>15 - 24</td>
                <td>60 - 80</td>
                <td>35 - 55</td>
                <td>25 - 45</td>
                <td>30 - 50</td>
              </tr>

              <tr>
                <td>Arroz</td>
                <td>5.0 - 6.5</td>
                <td>20 - 35</td>
                <td>70 - 90</td>
                <td>40 - 70</td>
                <td>25 - 45</td>
                <td>30 - 55</td>
              </tr>

              <tr>
                <td>Banana</td>
                <td>5.5 - 6.5</td>
                <td>24 - 30</td>
                <td>70 - 90</td>
                <td>60 - 90</td>
                <td>40 - 70</td>
                <td>60 - 90</td>
              </tr>

              <tr>
                <td>Batata</td>
                <td>5.0 - 6.0</td>
                <td>15 - 22</td>
                <td>60 - 80</td>
                <td>40 - 65</td>
                <td>30 - 55</td>
                <td>45 - 70</td>
              </tr>

              <tr>
                <td>Café</td>
                <td>5.0 - 6.0</td>
                <td>18 - 24</td>
                <td>60 - 80</td>
                <td>30 - 50</td>
                <td>20 - 40</td>
                <td>35 - 55</td>
              </tr>

              <tr>
                <td>Cana-de-açúcar</td>
                <td>5.5 - 6.5</td>
                <td>22 - 32</td>
                <td>60 - 80</td>
                <td>60 - 90</td>
                <td>40 - 70</td>
                <td>50 - 80</td>
              </tr>

              <tr>
                <td>Cenoura</td>
                <td>6.0 - 7.0</td>
                <td>16 - 24</td>
                <td>55 - 75</td>
                <td>35 - 55</td>
                <td>25 - 45</td>
                <td>30 - 50</td>
              </tr>

              <tr>
                <td>Feijão</td>
                <td>6.0 - 7.0</td>
                <td>18 - 30</td>
                <td>55 - 75</td>
                <td>30 - 60</td>
                <td>25 - 50</td>
                <td>35 - 60</td>
              </tr>

              <tr>
                <td>Milho</td>
                <td>5.8 - 7.0</td>
                <td>24 - 30</td>
                <td>50 - 70</td>
                <td>50 - 80</td>
                <td>30 - 55</td>
                <td>40 - 70</td>
              </tr>

              <tr>
                <td>Morango</td>
                <td>5.5 - 6.5</td>
                <td>18 - 25</td>
                <td>65 - 85</td>
                <td>25 - 45</td>
                <td>35 - 55</td>
                <td>40 - 60</td>
              </tr>

              <tr>
                <td>Olimentão</td>
                <td>5.8 - 6.8</td>
                <td>18 - 28</td>
                <td>60 - 80</td>
                <td>40 - 65</td>
                <td>30 - 55</td>
                <td>40 - 65</td>
              </tr>

              <tr>
                <td>Repolho</td>
                <td>6.0 - 7.5</td>
                <td>15 - 22</td>
                <td>65 - 85</td>
                <td>50 - 80</td>
                <td>35 - 60</td>
                <td>45 - 70</td>
              </tr>

              <tr>
                <td>Soja</td>
                <td>6.0 - 6.8</td>
                <td>20 - 30</td>
                <td>50 - 70</td>
                <td>45 - 70</td>
                <td>35 - 60</td>
                <td>40 - 65</td>
              </tr>

              <tr>
                <td>Tomate</td>
                <td>5.8 - 6.8</td>
                <td>20 - 28</td>
                <td>60 - 80</td>
                <td>40 - 60</td>
                <td>30 - 50</td>
                <td>45 - 65</td>
              </tr>

              <tr>
                <td>Uva</td>
                <td>5.5 - 6.5</td>
                <td>15 - 28</td>
                <td>50 - 70</td>
                <td>30 - 50</td>
                <td>25 - 45</td>
                <td>35 - 60</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
      </main>
      <Rodape />
    </div>
  )
}
