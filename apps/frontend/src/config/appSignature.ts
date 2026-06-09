/**
 * ASSINATURA TÉCNICA DO SISTEMA
 *
 * OBJETIVO:
 * - registrar autoria técnica no console do navegador
 * - facilitar identificação por outros programadores
 * - documentar que o sistema foi construído por Diogo, Natália e Marcelo
 */

let signatureAlreadyPrinted = false

export function printAppSignature(): void {
  if (signatureAlreadyPrinted) {
    return
  }

  signatureAlreadyPrinted = true

  console.log(
    '%cEditora Guardiana',
    'font-size: 16px; font-weight: bold; color: #2563eb;',
  )

  console.log(
    '%cCriado por:',
    'font-size: 13px; font-weight: bold; color: #16a34a;',
  )

  console.log(
    '%c - Diogo Alberto Ribeiro Kirchoff - 2026',
    'font-size: 13px; font-weight: bold; color: #16a34a;',
  )

  console.log(
    '%c - Marcelo de Assis Marçal - 2026',
    'font-size: 13px; font-weight: bold; color: #16a34a;',
  )

  console.log(
    '%c - Natália Kunz - 2026',
    'font-size: 13px; font-weight: bold; color: #16a34a;',
  )

  console.log(
    '%cProjeto: Site e Saas Editora Guardiana',
    'font-size: 12px; color: #64748b;',
  )
}