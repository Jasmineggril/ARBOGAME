import { supabase } from '@/lib/supabase'

export interface Jogador {
  id: string
  nome: string
  email?: string
  pontuacao?: number
  progresso?: number
  criado_em?: string
}

/**
 * Busca todos os jogadores
 */
export async function buscarJogadores(): Promise<Jogador[]> {
  try {
    const { data, error } = await supabase
      .from('jogadores')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) {
      console.error('Erro ao buscar jogadores:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Erro na função buscarJogadores:', err)
    return []
  }
}

/**
 * Busca um jogador específico pelo ID
 */
export async function buscarJogadorPorId(id: string): Promise<Jogador | null> {
  try {
    const { data, error } = await supabase
      .from('jogadores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar jogador:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Erro na função buscarJogadorPorId:', err)
    return null
  }
}

/**
 * Cria um novo jogador
 */
export async function criarJogador(jogador: Omit<Jogador, 'id' | 'criado_em'>): Promise<Jogador | null> {
  try {
    const { data, error } = await supabase
      .from('jogadores')
      .insert([jogador])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar jogador:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Erro na função criarJogador:', err)
    return null
  }
}

/**
 * Atualiza pontuação de um jogador
 */
export async function atualizarPontuacao(id: string, pontuacao: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jogadores')
      .update({ pontuacao })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar pontuação:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Erro na função atualizarPontuacao:', err)
    return false
  }
}

/**
 * Atualiza progresso de um jogador
 */
export async function atualizarProgresso(id: string, progresso: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('jogadores')
      .update({ progresso })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar progresso:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Erro na função atualizarProgresso:', err)
    return false
  }
}

/**
 * Testa a conexão com Supabase
 */
export async function testarConexao(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('jogadores').select('count', { count: 'exact' })

    if (error) {
      console.error('❌ Erro ao conectar no Supabase:', error)
      return false
    }

    console.log('✅ Conexão com Supabase funcionando!')
    return true
  } catch (err) {
    console.error('❌ Erro na função testarConexao:', err)
    return false
  }
}
