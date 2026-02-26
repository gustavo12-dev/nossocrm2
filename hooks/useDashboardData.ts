'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DashboardData {
  ram: number;
  rede: string;
  firewallAtivo: boolean;
  intrusoes: number;
  ultimaVarredura: string;
  n8nConectado: boolean;
  whatsappAtivo: boolean;
  latenciaMs: number;
  consultas: number;
  sincronizacaoOk: boolean;
  backupAtras: string;
  processamento: number;
  atividade: 'Baixa' | 'Média' | 'Alta';
  conexoes: number;
  dataHora: Date;
}

function randomBetween(min: number, max: number): number {
  return Math.round((max - min) * Math.random() + min);
}

function formatRede(value: number): string {
  return `${(value / 1024).toFixed(1)}GB/s`;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>(() => getNextMock());

  const refresh = useCallback(() => {
    setData(getNextMock());
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 1500);
    return () => clearInterval(interval);
  }, [refresh]);

  return data;
}

function getNextMock(): DashboardData {
  const now = new Date();
  const atividades: Array<'Baixa' | 'Média' | 'Alta'> = ['Baixa', 'Média', 'Alta'];
  return {
    ram: Math.round((randomBetween(60, 95) * 10) / 10),
    rede: formatRede(randomBetween(800, 1800)),
    firewallAtivo: true,
    intrusoes: 0,
    ultimaVarredura: '15min',
    n8nConectado: true,
    whatsappAtivo: true,
    latenciaMs: randomBetween(10, 25),
    consultas: randomBetween(1200, 1300),
    sincronizacaoOk: true,
    backupAtras: '2h atrás',
    processamento: randomBetween(15, 40),
    atividade: atividades[randomBetween(0, 2)],
    conexoes: randomBetween(240, 255),
    dataHora: now,
  };
}

/** Formata data/hora em pt-BR para o header */
export function formatDashboardDateTime(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
