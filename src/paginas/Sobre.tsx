import estilos from './Sobre.module.css'
import { Cabecalho } from '../componentes/layout/Cabecalho'
import { Rodape } from '../componentes/layout/Rodape'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiBarChart2, FiCpu, FiCloud } from 'react-icons/fi'
import { LuLeaf, LuDroplets, LuSun, LuThermometer } from 'react-icons/lu'
import diogoImg from '../assets/imagens/diogo.jpg'
import jeanImg from '../assets/imagens/jean.jpeg'

const integrantes = [
  {
    nome: 'Diogo Vieira da Costa',
    foto: diogoImg,
  },
  {
    nome: 'Jean de Melo Prates',
    foto: jeanImg,
  },
]

const recursos = [
  {
    icon: FiBarChart2,
    titulo: 'Monitoramento em Tempo Real',
    descricao:
      'Acompanhe os dados de NPK, pH, temperatura, umidade e luminosidade da sua plantação em tempo real.',
  },
  {
    icon: FiCpu,
    titulo: 'Sensores Inteligentes',
    descricao: 'Dispositivos IoT de alta precisão que coletam dados continuamente do seu solo.',
  },
  {
    icon: LuDroplets,
    titulo: 'Gestão de Irrigação',
    descricao: 'Receba alertas sobre níveis de umidade e otimize o uso da água na sua plantação.',
  },
  {
    icon: FiCloud,
    titulo: 'Dados na Nuvem',
    descricao: 'Acesse seus dados de qualquer lugar, a qualquer momento, com total segurança.',
  },
]

const beneficios = [
  'Aumento de até 30% na produtividade',
  'Redução de desperdício de água e insumos',
  'Prevenção de problemas no solo',
  'Tomada de decisão baseada em dados',
  'Histórico completo das suas plantações',
  'Alertas personalizados para cada cultura',
]

export function Sobre() {
  return (
    <div className={estilos.pagina}>
      <Cabecalho />
      <main className={estilos.conteudoPagina}>
    <div className={estilos.conteiner}>

      <section className={estilos.destaque}>
        <div className={estilos.conteudoDestaque}>
          <h1 className={estilos.titulo}>Monitore a qualidade do solo da sua plantação</h1>
          <p className={estilos.subtitulo}>
            O Agro Sync oferece monitoramento inteligente em tempo real para plantações de pequeno e
            médio porte. Acompanhe NPK, pH, temperatura, umidade e luminosidade com precisão.
          </p>
          <div className={estilos.botoesDestaque}>
            <Link to='/' className={estilos.botaoPrimario}>
              Acessar Dashboard
            </Link>
            <Link to='/dicas' className={estilos.botaoSecundario}>
              Ver Dicas de Cultivo
            </Link>
          </div>
        </div>
        <div className={estilos.imagemDestaque}>
          <div className={estilos.iconesDestaque}>
            <div className={estilos.iconeFlutuante}>
              <LuLeaf />
            </div>
            <div className={estilos.iconeFlutuante}>
              <LuThermometer />
            </div>
            <div className={estilos.iconeFlutuante}>
              <LuDroplets />
            </div>
            <div className={estilos.iconeFlutuante}>
              <LuSun />
            </div>
          </div>
        </div>
      </section>

      <section className={estilos.comoFunciona}>
        <h2 className={estilos.secaoTitulo}>Como Funciona</h2>
        <div className={estilos.passos}>
          <div className={estilos.passo}>
            <div className={estilos.passoNumero}>1</div>
            <h3>Instale o Sensor</h3>
            <p>Posicione o dispositivo Agro Sync no solo da sua plantação.</p>
          </div>
          <div className={estilos.passo}>
            <div className={estilos.passoNumero}>2</div>
            <h3>Conecte ao Sistema</h3>
            <p>O sensor envia dados automaticamente para a nuvem via Wi-Fi.</p>
          </div>
          <div className={estilos.passo}>
            <div className={estilos.passoNumero}>3</div>
            <h3>Monitore Online</h3>
            <p>Acesse o dashboard e acompanhe todas as métricas em tempo real.</p>
          </div>
        </div>
      </section>

      <section className={estilos.recursos}>
        <h2 className={estilos.secaoTitulo}>Recursos do Sistema</h2>
        <div className={estilos.conteinerRecursos}>
          {recursos.map((recurso, index) => (
            <div key={index} className={estilos.cartaoRecurso}>
              <div className={estilos.recursoIcone}>
                <recurso.icon />
              </div>
              <h3>{recurso.titulo}</h3>
              <p>{recurso.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={estilos.beneficios}>
        <div className={estilos.beneficiosConteudo}>
          <h2 className={estilos.secaoTitulo}>Por que usar o Agro Sync?</h2>
          <ul className={estilos.beneficiosLista}>
            {beneficios.map((beneficio, index) => (
              <li key={index}>
                <FiCheckCircle className={estilos.iconeConfirmacao} />
                <span>{beneficio}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={estilos.chamada}>
        <h2>Pronto para otimizar sua plantação?</h2>
        <p>Comece agora mesmo a monitorar a qualidade do solo e aumente sua produtividade.</p>
        <Link to='/' className={estilos.botaoPrimario}>
          Começar Agora
        </Link>
      </section>

      <section className={estilos.secao}>
        <h2 className={estilos.secaoTitulo}>Integrantes do Grupo</h2>
        <div className={estilos.conteinerIntegrantes}>
          {integrantes.map((integrante, i) => (
            <div key={i} className={estilos.cartaoIntegrante}>
              <div className={estilos.conteinerFoto}>
                {integrante.foto ? (
                  <img src={integrante.foto} alt={integrante.nome} className={estilos.foto} />
                ) : (
                  <div className={estilos.fotoPadrao}>
                    <span>{integrante.nome.charAt(0)}</span>
                  </div>
                )}
              </div>
              <h3 className={estilos.integranteNome}>{integrante.nome}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
      </main>
      <Rodape />
    </div>
  )
}
